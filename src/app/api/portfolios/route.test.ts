import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST, MAX_PORTFOLIO_PAYLOAD_SIZE } from "./route";
import { prisma } from "@/lib/db";
import { hashEditToken } from "@/lib/tokens";
import { processAndSaveUpload, getUploadsRoot, getTmpUploadsDir } from "@/lib/images";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

describe("POST /api/portfolios", () => {
  it("creates portfolio, copies images to uploads/<id>/, hashes token, and returns 201 with no-store", async () => {
    // 1. Prepare valid image in tmp
    const pngBuffer = await sharp({
      create: { width: 20, height: 20, channels: 3, background: { r: 10, g: 20, b: 30 } },
    })
      .png()
      .toBuffer();
    const uploaded = await processAndSaveUpload(pngBuffer);

    const testSlug = `portfolio-test-${Date.now()}`;
    const payload = {
      slug: testSlug,
      templateId: "template-a",
      data: {
        basics: {
          fullName: "Morgan Publisher",
          title: "Lead Architect",
          bio: "Building robust publishing pipelines for web portfolios.",
          photo: uploaded.filename,
        },
        contact: {
          email: "morgan@example.com",
        },
        skills: [{ name: "Next.js", category: "Framework" }],
        experience: [],
        education: [],
        projects: [],
      },
    };

    const req = new NextRequest("http://localhost:3000/api/portfolios", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(res.headers.get("Cache-Control")).toBe("no-store");

    const json = await res.json();
    expect(json.slug).toBe(testSlug);
    expect(json.editToken).toBeTruthy();
    expect(json.url).toBe(`http://${testSlug}.localhost:3000`);

    // Verify DB row
    const record = await prisma.portfolio.findUnique({
      where: { slug: testSlug },
    });
    expect(record).not.toBeNull();
    if (!record) return;

    // Verify token is stored ONLY as a hash
    expect(record.editTokenHash).toBe(hashEditToken(json.editToken));
    expect(record.editTokenHash).not.toBe(json.editToken);

    // Verify image was copied to uploads/<portfolioId>/<filename>
    const publishedImagePath = path.join(getUploadsRoot(), record.id, uploaded.filename);
    const stat = await fs.stat(publishedImagePath);
    expect(stat.isFile()).toBe(true);

    // Verify original remains in tmp for cleanup job
    const tmpPath = path.join(getTmpUploadsDir(), uploaded.filename);
    const tmpStat = await fs.stat(tmpPath);
    expect(tmpStat.isFile()).toBe(true);
  });

  it("returns 413 when Content-Length exceeds limit", async () => {
    const req = new NextRequest("http://localhost:3000/api/portfolios", {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "content-length": String(MAX_PORTFOLIO_PAYLOAD_SIZE + 100),
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(413);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });

  it("returns 400 for invalid payload or reserved slug", async () => {
    const req = new NextRequest("http://localhost:3000/api/portfolios", {
      method: "POST",
      body: JSON.stringify({
        slug: "admin",
        templateId: "template-a",
        data: { basics: { fullName: "A" } },
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });

  it("returns 400 when a referenced image is missing from tmp uploads", async () => {
    const testSlug = `missing-img-${Date.now()}`;
    const payload = {
      slug: testSlug,
      templateId: "template-a",
      data: {
        basics: {
          fullName: "Missing Image",
          title: "Test Role",
          bio: "Checking missing image handling in published portfolios.",
          photo: "00000000-0000-0000-0000-000000000000.webp",
        },
        contact: { email: "missing@example.com" },
        skills: [],
        experience: [],
        education: [],
        projects: [],
      },
    };

    const req = new NextRequest("http://localhost:3000/api/portfolios", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/not found in temporary uploads/);

    // Verify row was not created
    const record = await prisma.portfolio.findUnique({
      where: { slug: testSlug },
    });
    expect(record).toBeNull();
  });

  it("returns 409 when slug is already taken (P2002 race condition)", async () => {
    const duplicateSlug = `dup-slug-${Date.now()}`;

    // Seed existing
    await prisma.portfolio.create({
      data: {
        slug: duplicateSlug,
        templateId: "template-a",
        data: JSON.stringify({
          basics: {
            fullName: "First Author",
            title: "Software Engineer",
            bio: "First author bio with more than ten characters.",
          },
          contact: { email: "f@example.com" },
          skills: [],
          experience: [],
          education: [],
          projects: [],
        }),
        editTokenHash: "dummyhash",
      },
    });

    const req = new NextRequest("http://localhost:3000/api/portfolios", {
      method: "POST",
      body: JSON.stringify({
        slug: duplicateSlug,
        templateId: "template-a",
        data: {
          basics: {
            fullName: "Second Author",
            title: "Frontend Developer",
            bio: "Second author bio with more than ten characters.",
          },
          contact: { email: "s@example.com" },
          skills: [],
          experience: [],
          education: [],
          projects: [],
        },
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.error).toMatch(/was taken just now/);
  });

  it("rolls back copied uploads directory if DB creation fails", async () => {
    const pngBuffer = await sharp({
      create: { width: 10, height: 10, channels: 3, background: { r: 1, g: 2, b: 3 } },
    })
      .png()
      .toBuffer();
    const uploaded = await processAndSaveUpload(pngBuffer);

    const testSlug = `rollback-test-${Date.now()}`;
    const payload = {
      slug: testSlug,
      templateId: "template-a",
      data: {
        basics: {
          fullName: "Rollback Tester",
          title: "Testing Rollbacks",
          bio: "Ensures no orphaned files remain if database write fails.",
          photo: uploaded.filename,
        },
        contact: { email: "rollback@example.com" },
        skills: [],
        experience: [],
        education: [],
        projects: [],
      },
    };

    // Inject DB failure on prisma.portfolio.create
    const spy = vi.spyOn(prisma.portfolio, "create").mockRejectedValueOnce(new Error("Simulated DB connection failure"));

    const req = new NextRequest("http://localhost:3000/api/portfolios", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);

    // Verify row was not created
    const record = await prisma.portfolio.findUnique({
      where: { slug: testSlug },
    });
    expect(record).toBeNull();

    // Verify no portfolio directory was left behind
    const rootEntries = await fs.readdir(getUploadsRoot());
    const nonTmpDirs = rootEntries.filter((e) => e !== "tmp");
    for (const dir of nonTmpDirs) {
      const fileCandidate = path.join(getUploadsRoot(), dir, uploaded.filename);
      let exists = false;
      try {
        await fs.stat(fileCandidate);
        exists = true;
      } catch {
        exists = false;
      }
      expect(exists).toBe(false);
    }

    spy.mockRestore();
  });
});
