import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET as getP } from "./route";
import { GET as getSites } from "../../%5Fsites/[slug]/route";
import { prisma } from "@/lib/db";
import { hashEditToken } from "@/lib/tokens";
import { extractAndHashScripts } from "@/lib/document";

describe("Published Pages Routes (/p/[slug] and /_sites/[slug])", () => {
  const testSlug = `pub-page-${Date.now()}`;
  const testData = {
    basics: {
      fullName: "Public Author",
      title: "UI Designer",
      bio: "Crafting beautiful accessible user interfaces for web.",
    },
    contact: {
      email: "author@example.com",
    },
    skills: [{ name: "CSS", category: "Styling" }],
    experience: [],
    education: [],
    projects: [],
  };

  it("serves static HTML with CSP script hashes matching response body for /p/[slug]", async () => {
    // Seed record
    await prisma.portfolio.create({
      data: {
        slug: testSlug,
        templateId: "template-a",
        data: JSON.stringify(testData),
        editTokenHash: hashEditToken("some-token"),
      },
    });

    const req = new NextRequest(`http://localhost:3000/p/${testSlug}`);
    const res = await getP(req, {
      params: Promise.resolve({ slug: testSlug }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/html; charset=utf-8");
    expect(res.headers.get("Cache-Control")).toBe("no-cache");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");

    const csp = res.headers.get("Content-Security-Policy");
    expect(csp).toBeTruthy();
    expect(csp).toContain("default-src 'none'");
    expect(csp).toContain("img-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");

    const bodyHtml = await res.text();
    expect(bodyHtml).toContain("Public Author");
    expect(bodyHtml).toContain("UI Designer");

    // Requirement 5: Recompute script hashes from response body and match header
    const recomputedHashes = extractAndHashScripts(bodyHtml);
    for (const h of recomputedHashes) {
      expect(csp).toContain(h);
    }
  });

  it("serves identical static HTML for /_sites/[slug] route", async () => {
    const req = new NextRequest(`http://localhost:3000/_sites/${testSlug}`);
    const res = await getSites(req, {
      params: Promise.resolve({ slug: testSlug }),
    });

    expect(res.status).toBe(200);
    const bodyHtml = await res.text();
    expect(bodyHtml).toContain("Public Author");
  });

  it("returns 404 with styled error page for non-existent slug", async () => {
    const req = new NextRequest("http://localhost:3000/p/non-existent-slug");
    const res = await getP(req, {
      params: Promise.resolve({ slug: "non-existent-slug" }),
    });

    expect(res.status).toBe(404);
    expect(res.headers.get("Cache-Control")).toBe("no-cache");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    const bodyHtml = await res.text();
    expect(bodyHtml).toContain("Portfolio Not Found");
    expect(bodyHtml).toContain("404 Error");
  });

  it("returns 404 for reserved slug", async () => {
    const req = new NextRequest("http://localhost:3000/p/admin");
    const res = await getP(req, {
      params: Promise.resolve({ slug: "admin" }),
    });

    expect(res.status).toBe(404);
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    const bodyHtml = await res.text();
    expect(bodyHtml).toContain("Portfolio Not Found");
  });

  it("returns 500 with friendly error page if stored data is corrupted", async () => {
    const corruptSlug = `corrupt-data-${Date.now()}`;
    await prisma.portfolio.create({
      data: {
        slug: corruptSlug,
        templateId: "template-a",
        data: "not valid json {",
        editTokenHash: "dummy",
      },
    });

    const req = new NextRequest(`http://localhost:3000/p/${corruptSlug}`);
    const res = await getP(req, {
      params: Promise.resolve({ slug: corruptSlug }),
    });

    expect(res.status).toBe(500);
    expect(res.headers.get("Cache-Control")).toBe("no-cache");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    const bodyHtml = await res.text();
    expect(bodyHtml).toContain("500 Server Error");
    expect(bodyHtml).toContain("Unable to Display Portfolio");
  });
});
