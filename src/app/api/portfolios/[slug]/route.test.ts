import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET, PUT, DELETE } from "./route";
import { prisma } from "@/lib/db";
import { generateEditToken, hashEditToken } from "@/lib/tokens";
import {
  processAndSaveUpload,
  getUploadsRoot,
  copyPortfolioUploads,
} from "@/lib/images";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { MAX_PORTFOLIO_PAYLOAD_SIZE } from "@/app/api/portfolios/route";

describe("/api/portfolios/[slug]", () => {
  const shortId = () => Math.random().toString(36).slice(2, 9);

  const baseData = {
    basics: {
      fullName: "Alex Taylor",
      title: "Full Stack Engineer",
      bio: "Creating high performance web software.",
    },
    contact: {
      email: "alex@example.com",
    },
    skills: [{ name: "TypeScript", category: "Languages" }],
    experience: [],
    education: [],
    projects: [],
  };

  async function createTestPortfolio(slug: string, initialPhoto?: string) {
    const portfolioId = crypto.randomUUID();
    const editToken = generateEditToken();
    const editTokenHash = hashEditToken(editToken);

    const data = {
      ...baseData,
      basics: {
        ...baseData.basics,
        photo: initialPhoto,
      },
    };

    if (initialPhoto) {
      await copyPortfolioUploads(portfolioId, [initialPhoto]);
    }

    const record = await prisma.portfolio.create({
      data: {
        id: portfolioId,
        slug,
        templateId: "template-a",
        data: JSON.stringify(data),
        editTokenHash,
      },
    });

    return { portfolio: record, editToken, portfolioId };
  }

  describe("GET", () => {
    it("returns 401 if x-edit-token is missing", async () => {
      const slug = `g-mis-${shortId()}`;
      await createTestPortfolio(slug);

      const req = new NextRequest(`http://localhost:3000/api/portfolios/${slug}`);
      const res = await GET(req, { params: Promise.resolve({ slug }) });

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toMatch(/missing/i);
    });

    it("returns 401 if x-edit-token is invalid", async () => {
      const slug = `g-inv-${shortId()}`;
      await createTestPortfolio(slug);

      const req = new NextRequest(`http://localhost:3000/api/portfolios/${slug}`, {
        headers: { "x-edit-token": "wrong-token" },
      });
      const res = await GET(req, { params: Promise.resolve({ slug }) });

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toMatch(/invalid/i);
    });

    it("returns 404 if portfolio does not exist", async () => {
      const slug = `g-not-${shortId()}`;
      const req = new NextRequest(`http://localhost:3000/api/portfolios/${slug}`, {
        headers: { "x-edit-token": "any-token" },
      });
      const res = await GET(req, { params: Promise.resolve({ slug }) });

      expect(res.status).toBe(404);
    });

    it("returns 200 with portfolio data when token is valid", async () => {
      const slug = `g-ok-${shortId()}`;
      const { editToken } = await createTestPortfolio(slug);

      const req = new NextRequest(`http://localhost:3000/api/portfolios/${slug}`, {
        headers: { "x-edit-token": editToken },
      });
      const res = await GET(req, { params: Promise.resolve({ slug }) });

      expect(res.status).toBe(200);
      expect(res.headers.get("Cache-Control")).toBe("no-store");
      const json = await res.json();
      expect(json.slug).toBe(slug);
      expect(json.templateId).toBe("template-a");
      expect(json.data.basics.fullName).toBe("Alex Taylor");
    });

    it("also accepts Authorization: Bearer <token>", async () => {
      const slug = `g-tok-${shortId()}`;
      const { editToken } = await createTestPortfolio(slug);

      const req = new NextRequest(`http://localhost:3000/api/portfolios/${slug}`, {
        headers: { authorization: `Bearer ${editToken}` },
      });
      const res = await GET(req, { params: Promise.resolve({ slug }) });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.slug).toBe(slug);
    });
  });

  describe("PUT", () => {
    it("returns 401 if token is invalid or missing", async () => {
      const slug = `p-unauth-${shortId()}`;
      await createTestPortfolio(slug);

      const req = new NextRequest(`http://localhost:3000/api/portfolios/${slug}`, {
        method: "PUT",
        body: JSON.stringify({
          slug,
          templateId: "template-b",
          data: baseData,
        }),
      });
      const res = await PUT(req, { params: Promise.resolve({ slug }) });
      expect(res.status).toBe(401);
    });

    it("returns 404 if target portfolio does not exist", async () => {
      const slug = `p-not-${shortId()}`;
      const req = new NextRequest(`http://localhost:3000/api/portfolios/${slug}`, {
        method: "PUT",
        headers: { "x-edit-token": "any-token" },
        body: JSON.stringify({
          slug,
          templateId: "template-b",
          data: baseData,
        }),
      });
      const res = await PUT(req, { params: Promise.resolve({ slug }) });
      expect(res.status).toBe(404);
    });

    it("returns 413 if payload exceeds size limit", async () => {
      const slug = `p-sz-${shortId()}`;
      const { editToken } = await createTestPortfolio(slug);

      const req = new NextRequest(`http://localhost:3000/api/portfolios/${slug}`, {
        method: "PUT",
        headers: {
          "x-edit-token": editToken,
          "content-length": String(MAX_PORTFOLIO_PAYLOAD_SIZE + 500),
        },
        body: JSON.stringify({}),
      });
      const res = await PUT(req, { params: Promise.resolve({ slug }) });
      expect(res.status).toBe(413);
    });

    it("returns 400 for invalid payload schema or reserved slug", async () => {
      const slug = `p-bad-${shortId()}`;
      const { editToken } = await createTestPortfolio(slug);

      const req = new NextRequest(`http://localhost:3000/api/portfolios/${slug}`, {
        method: "PUT",
        headers: { "x-edit-token": editToken },
        body: JSON.stringify({
          slug: "admin", // reserved
          templateId: "template-a",
          data: { invalid: "data" },
        }),
      });
      const res = await PUT(req, { params: Promise.resolve({ slug }) });
      expect(res.status).toBe(400);
    });

    it("returns 409 if new slug is already taken by another portfolio", async () => {
      const slug1 = `p-s1-${shortId()}`;
      const slug2 = `p-s2-${shortId()}`;
      await createTestPortfolio(slug1);
      const { editToken } = await createTestPortfolio(slug2);

      const req = new NextRequest(`http://localhost:3000/api/portfolios/${slug2}`, {
        method: "PUT",
        headers: { "x-edit-token": editToken },
        body: JSON.stringify({
          slug: slug1, // Attempt to rename to slug1
          templateId: "template-b",
          data: baseData,
        }),
      });
      const res = await PUT(req, { params: Promise.resolve({ slug: slug2 }) });
      expect(res.status).toBe(409);
      const json = await res.json();
      expect(json.error).toMatch(/already in use/i);
    });

    it("returns 400 if a referenced image is neither in the portfolio folder nor in tmp/", async () => {
      const slug = `p-img-${shortId()}`;
      const { editToken } = await createTestPortfolio(slug);

      const fakeUuid = `${crypto.randomUUID()}.webp`;
      const req = new NextRequest(`http://localhost:3000/api/portfolios/${slug}`, {
        method: "PUT",
        headers: { "x-edit-token": editToken },
        body: JSON.stringify({
          slug,
          templateId: "template-a",
          data: {
            ...baseData,
            basics: {
              ...baseData.basics,
              photo: fakeUuid,
            },
          },
        }),
      });
      const res = await PUT(req, { params: Promise.resolve({ slug }) });
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toMatch(/not found/i);
    });

    it("updates portfolio data, template, slug, and copies new tmp images", async () => {
      // 1. Initial image in tmp
      const initialBuf = await sharp({
        create: { width: 10, height: 10, channels: 3, background: { r: 1, g: 2, b: 3 } },
      })
        .png()
        .toBuffer();
      const initialUpload = await processAndSaveUpload(initialBuf);

      const oldSlug = `p-old-${shortId()}`;
      const { editToken, portfolioId } = await createTestPortfolio(oldSlug, initialUpload.filename);

      // 2. Prepare a new image in tmp for the update
      const newBuf = await sharp({
        create: { width: 10, height: 10, channels: 3, background: { r: 50, g: 60, b: 70 } },
      })
        .png()
        .toBuffer();
      const newUpload = await processAndSaveUpload(newBuf);

      const newSlug = `p-new-${shortId()}`;
      const updatedData = {
        ...baseData,
        basics: {
          ...baseData.basics,
          fullName: "Alex Updated",
          photo: newUpload.filename,
        },
      };

      const req = new NextRequest(`http://localhost:3000/api/portfolios/${oldSlug}`, {
        method: "PUT",
        headers: { "x-edit-token": editToken },
        body: JSON.stringify({
          slug: newSlug,
          templateId: "template-b",
          data: updatedData,
        }),
      });

      const res = await PUT(req, { params: Promise.resolve({ slug: oldSlug }) });
      expect(res.status).toBe(200);
      expect(res.headers.get("Cache-Control")).toBe("no-store");

      const json = await res.json();
      expect(json.slug).toBe(newSlug);
      expect(json.url).toBe(`http://${newSlug}.localhost:3000`);

      // Verify DB record updated
      const updatedRecord = await prisma.portfolio.findUnique({
        where: { slug: newSlug },
      });
      expect(updatedRecord).not.toBeNull();
      expect(updatedRecord?.templateId).toBe("template-b");
      const parsedData = JSON.parse(updatedRecord!.data);
      expect(parsedData.basics.fullName).toBe("Alex Updated");

      // Verify old slug is gone
      const oldRecord = await prisma.portfolio.findUnique({
        where: { slug: oldSlug },
      });
      expect(oldRecord).toBeNull();

      // Verify newly uploaded image was copied into uploads/<portfolioId>/
      const targetImagePath = path.join(getUploadsRoot(), portfolioId, newUpload.filename);
      const stat = await fs.stat(targetImagePath);
      expect(stat.isFile()).toBe(true);
    });
  });

  describe("DELETE", () => {
    it("returns 401 if token is missing or invalid", async () => {
      const slug = `d-unauth-${shortId()}`;
      await createTestPortfolio(slug);

      const req = new NextRequest(`http://localhost:3000/api/portfolios/${slug}`, {
        method: "DELETE",
      });
      const res = await DELETE(req, { params: Promise.resolve({ slug }) });
      expect(res.status).toBe(401);
    });

    it("returns 404 if portfolio does not exist", async () => {
      const slug = `d-not-${shortId()}`;
      const req = new NextRequest(`http://localhost:3000/api/portfolios/${slug}`, {
        method: "DELETE",
        headers: { "x-edit-token": "any-token" },
      });
      const res = await DELETE(req, { params: Promise.resolve({ slug }) });
      expect(res.status).toBe(404);
    });

    it("deletes database record and removes uploaded images directory", async () => {
      const imgBuf = await sharp({
        create: { width: 10, height: 10, channels: 3, background: { r: 10, g: 20, b: 30 } },
      })
        .png()
        .toBuffer();
      const upload = await processAndSaveUpload(imgBuf);

      const slug = `d-ok-${shortId()}`;
      const { editToken, portfolioId } = await createTestPortfolio(slug, upload.filename);

      // Verify uploads directory exists before delete
      const portfolioDir = path.join(getUploadsRoot(), portfolioId);
      const preStat = await fs.stat(portfolioDir);
      expect(preStat.isDirectory()).toBe(true);

      const req = new NextRequest(`http://localhost:3000/api/portfolios/${slug}`, {
        method: "DELETE",
        headers: { "x-edit-token": editToken },
      });

      const res = await DELETE(req, { params: Promise.resolve({ slug }) });
      expect(res.status).toBe(200);
      expect(res.headers.get("Cache-Control")).toBe("no-store");

      // Verify DB record is deleted
      const record = await prisma.portfolio.findUnique({
        where: { slug },
      });
      expect(record).toBeNull();

      // Verify uploaded images directory is deleted
      let dirExists = true;
      try {
        await fs.stat(portfolioDir);
      } catch {
        dirExists = false;
      }
      expect(dirExists).toBe(false);
    });
  });
});
