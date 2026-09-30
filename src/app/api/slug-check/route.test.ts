import { describe, it, expect, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { prisma } from "@/lib/db";
import { generateEditToken, hashEditToken } from "@/lib/tokens";

describe("Slug Check API Route (GET /api/slug-check)", () => {
  const existingSlug = `taken-slug-${Date.now()}`;

  afterAll(async () => {
    await prisma.portfolio.deleteMany({
      where: { slug: existingSlug },
    });
    await prisma.$disconnect();
  });

  it("returns 400 if slug query parameter is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/slug-check");
    const res = await GET(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.available).toBe(false);
    expect(json.reason).toMatch(/Slug parameter is required/);
  });

  it("returns available: false for invalid slug syntax", async () => {
    const req = new NextRequest("http://localhost:3000/api/slug-check?slug=ab");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.available).toBe(false);
    expect(json.reason).toMatch(/at least 3 characters/);
  });

  it("returns available: false for reserved slugs", async () => {
    const req = new NextRequest("http://localhost:3000/api/slug-check?slug=admin");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.available).toBe(false);
    expect(json.reason).toMatch(/reserved/i);
  });

  it("returns available: false if slug is already taken in the database", async () => {
    // Seed the slug in DB
    await prisma.portfolio.create({
      data: {
        slug: existingSlug,
        templateId: "template-a",
        data: JSON.stringify({ basics: { fullName: "Taken", title: "Test", bio: "Bio" }, contact: { email: "taken@example.com" }, skills: [], experience: [], education: [], projects: [] }),
        editTokenHash: hashEditToken(generateEditToken()),
      },
    });

    const req = new NextRequest(`http://localhost:3000/api/slug-check?slug=${existingSlug}`);
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.available).toBe(false);
    expect(json.reason).toMatch(/already taken/);
  });

  it("returns available: true for a valid, unreserved, unused slug", async () => {
    const unusedSlug = `available-slug-${Date.now()}`;
    const req = new NextRequest(`http://localhost:3000/api/slug-check?slug=${unusedSlug}`);
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.available).toBe(true);
    expect(json.slug).toBe(unusedSlug);
  });
});
