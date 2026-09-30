import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { prisma } from "@/lib/db";
import { hashEditToken } from "@/lib/tokens";
import { samplePortfolioData } from "@/templates/sample-data";

describe("GET /api/portfolios/[slug]/export", () => {
  it("returns 404 for non-existent slug with security headers", async () => {
    const req = new NextRequest("http://localhost:3000/api/portfolios/missing-slug/export");
    const res = await GET(req, {
      params: Promise.resolve({ slug: "missing-slug" }),
    });

    expect(res.status).toBe(404);
    expect(res.headers.get("Cache-Control")).toBe("no-cache");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("returns 404 for invalid slug format", async () => {
    const req = new NextRequest("http://localhost:3000/api/portfolios/bad!slug/export");
    const res = await GET(req, {
      params: Promise.resolve({ slug: "bad!slug" }),
    });

    expect(res.status).toBe(404);
    expect(res.headers.get("Cache-Control")).toBe("no-cache");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("streams 200 ZIP download with proper headers and filename for valid portfolio", async () => {
    const testSlug = `route-export-${Date.now()}`;
    await prisma.portfolio.create({
      data: {
        slug: testSlug,
        templateId: "template-a",
        data: JSON.stringify(samplePortfolioData),
        editTokenHash: hashEditToken("some-edit-token"),
      },
    });

    const req = new NextRequest(`http://localhost:3000/api/portfolios/${testSlug}/export`);
    const res = await GET(req, {
      params: Promise.resolve({ slug: testSlug }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/zip");
    expect(res.headers.get("Content-Disposition")).toBe(
      `attachment; filename="${testSlug}-portfolio.zip"`
    );
    expect(res.headers.get("Cache-Control")).toBe("no-cache");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify ZIP magic number PK\x03\x04
    expect(buffer[0]).toBe(0x50);
    expect(buffer[1]).toBe(0x4b);
    expect(buffer[2]).toBe(0x03);
    expect(buffer[3]).toBe(0x04);
  });
});
