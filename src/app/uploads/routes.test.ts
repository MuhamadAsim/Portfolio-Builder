import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET as getTmp } from "./tmp/[filename]/route";
import { GET as getPortfolio } from "./[portfolioId]/[filename]/route";
import sharp from "sharp";
import { processAndSaveUpload, copyPortfolioUploads } from "@/lib/images";

describe("Explicit Upload Serving Routes", () => {
  it("GET /uploads/tmp/[filename] serves temporary file with correct headers", async () => {
    const pngBuffer = await sharp({
      create: {
        width: 16,
        height: 16,
        channels: 3,
        background: { r: 50, g: 150, b: 250 },
      },
    })
      .png()
      .toBuffer();

    const upload = await processAndSaveUpload(pngBuffer);

    // Valid file in tmp
    const req = new NextRequest(`http://localhost:3000/uploads/tmp/${upload.filename}`);
    const res = await getTmp(req, {
      params: Promise.resolve({ filename: upload.filename }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/webp");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=86400");

    // Traversal attempts in tmp filename segment
    const traversals = [
      "../secret.txt",
      "../../etc/passwd",
      "..\\windows\\system32",
      "%2e%2e/evil.webp",
      "sub/00000000-0000-0000-0000-000000000000.webp",
    ];

    for (const evilFilename of traversals) {
      const traversalRes = await getTmp(req, {
        params: Promise.resolve({ filename: evilFilename }),
      });
      expect(traversalRes.status).toBe(400);
    }

    // Invalid format
    const badRes = await getTmp(req, {
      params: Promise.resolve({ filename: "bad-name.png" }),
    });
    expect(badRes.status).toBe(400);

    // Missing file (well-formed UUID but non-existent on disk)
    const notFoundRes = await getTmp(req, {
      params: Promise.resolve({ filename: "00000000-0000-0000-0000-000000000000.webp" }),
    });
    expect(notFoundRes.status).toBe(404);
  });

  it("GET /uploads/[portfolioId]/[filename] serves published portfolio image with immutable headers", async () => {
    const pngBuffer = await sharp({
      create: {
        width: 16,
        height: 16,
        channels: 3,
        background: { r: 250, g: 50, b: 150 },
      },
    })
      .png()
      .toBuffer();

    const upload = await processAndSaveUpload(pngBuffer);
    const testPortfolioId = "test-portfolio-123";
    await copyPortfolioUploads(testPortfolioId, [upload.filename]);

    // Valid published image
    const req = new NextRequest(
      `http://localhost:3000/uploads/${testPortfolioId}/${upload.filename}`
    );
    const res = await getPortfolio(req, {
      params: Promise.resolve({
        portfolioId: testPortfolioId,
        filename: upload.filename,
      }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/webp");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=31536000, immutable");

    // Traversal attempts in portfolioId segment
    const badPortfolioIds = [
      "../evil",
      "../../etc",
      "folder/../escape",
      "%2e%2e",
      "portfolio/sub",
      "portfolio@bad#",
      "portfolio with spaces",
      "a".repeat(65),
    ];

    for (const badId of badPortfolioIds) {
      const badPortRes = await getPortfolio(req, {
        params: Promise.resolve({
          portfolioId: badId,
          filename: upload.filename,
        }),
      });
      expect(badPortRes.status).toBe(400);
    }

    // Traversal attempts in filename segment
    const badFilenames = [
      "../evil.webp",
      "../../secret.key",
      "%2e%2e/test.webp",
      "nested/00000000-0000-0000-0000-000000000000.webp",
      "not-a-uuid.webp",
      "image.png",
    ];

    for (const badFile of badFilenames) {
      const badFileRes = await getPortfolio(req, {
        params: Promise.resolve({
          portfolioId: testPortfolioId,
          filename: badFile,
        }),
      });
      expect(badFileRes.status).toBe(400);
    }

    // Non-existent file for existing portfolio
    const missingRes = await getPortfolio(req, {
      params: Promise.resolve({
        portfolioId: testPortfolioId,
        filename: "00000000-0000-0000-0000-000000000000.webp",
      }),
    });
    expect(missingRes.status).toBe(404);

    // Non-existent portfolio with valid format
    const missingPortRes = await getPortfolio(req, {
      params: Promise.resolve({
        portfolioId: "nonexistent-portfolio-id",
        filename: upload.filename,
      }),
    });
    expect(missingPortRes.status).toBe(404);
  });
});
