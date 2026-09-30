import { describe, it, expect } from "vitest";
import { buildPortfolioZip, buildPortfolioZipBuffer, generateReadme } from "./buildZip";
import { prisma } from "@/lib/db";
import { hashEditToken } from "@/lib/tokens";
import { samplePortfolioData } from "@/templates/sample-data";
import { processAndSaveUpload, copyPortfolioUploads } from "@/lib/images";
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { execSync } from "node:child_process";
import crypto from "node:crypto";

describe("buildPortfolioZip (src/lib/export/buildZip.ts)", () => {
  it("returns null for non-existent slug", async () => {
    const res = await buildPortfolioZip("non-existent-slug-xyz");
    expect(res).toBeNull();
  });

  it("returns null for invalid slug format", async () => {
    const res = await buildPortfolioZip("invalid_slug!");
    expect(res).toBeNull();
  });

  it("returns null for corrupted portfolio data in database", async () => {
    const corruptSlug = `corrupt-zip-${Date.now()}`;
    await prisma.portfolio.create({
      data: {
        slug: corruptSlug,
        templateId: "template-a",
        data: "not valid json {",
        editTokenHash: "dummy",
      },
    });

    const res = await buildPortfolioZip(corruptSlug);
    expect(res).toBeNull();
  });

  it("generates comprehensive README with local viewing and hosting instructions", () => {
    const readme = generateReadme("Alex Rivera");
    expect(readme).toContain("ALEX RIVERA - PORTFOLIO EXPORT");
    expect(readme).toContain("VIEWING LOCALLY");
    expect(readme).toContain('double-click "index.html"');
    expect(readme).toContain("Netlify Drop");
    expect(readme).toContain("GitHub Pages");
    expect(readme).toContain("Vercel");
    expect(readme).toContain("FILE MANIFEST");
  });

  it("builds a valid static ZIP package with index.html, styles.css, README.txt, and assets for Template A", async () => {
    // 1. Create a dummy image
    const imageBuffer = await sharp({
      create: {
        width: 16,
        height: 16,
        channels: 3,
        background: { r: 10, g: 20, b: 30 },
      },
    })
      .png()
      .toBuffer();

    const upload = await processAndSaveUpload(imageBuffer);
    const portfolioId = crypto.randomUUID();
    await copyPortfolioUploads(portfolioId, [upload.filename]);

    const testSlug = `zip-tpl-a-${Date.now()}`;
    const testData = {
      ...samplePortfolioData,
      basics: {
        ...samplePortfolioData.basics,
        fullName: "Export Tester A",
        photo: upload.filename,
      },
    };

    await prisma.portfolio.create({
      data: {
        id: portfolioId,
        slug: testSlug,
        templateId: "template-a",
        data: JSON.stringify(testData),
        editTokenHash: hashEditToken("secret-token"),
      },
    });

    const zipResult = await buildPortfolioZipBuffer(testSlug);
    expect(zipResult).not.toBeNull();
    if (!zipResult) return;

    expect(zipResult.filename).toBe(`${testSlug}-portfolio.zip`);
    const { buffer } = zipResult;

    // Standard ZIP signature (PK\x03\x04)
    expect(buffer[0]).toBe(0x50); // P
    expect(buffer[1]).toBe(0x4b); // K
    expect(buffer[2]).toBe(0x03);
    expect(buffer[3]).toBe(0x04);

    // Extract archive to a temp directory to verify real offline unpacking
    const tempExtractDir = path.join(os.tmpdir(), `zip-test-a-${Date.now()}`);
    const tempZipFile = path.join(os.tmpdir(), `test-a-${Date.now()}.zip`);
    await fs.mkdir(tempExtractDir, { recursive: true });
    await fs.writeFile(tempZipFile, buffer);

    try {
      execSync(`tar -xf "${tempZipFile}" -C "${tempExtractDir}"`);

      // Verify unzipped files exist
      const indexHtml = await fs.readFile(path.join(tempExtractDir, "index.html"), "utf-8");
      const stylesCss = await fs.readFile(path.join(tempExtractDir, "styles.css"), "utf-8");
      const readmeTxt = await fs.readFile(path.join(tempExtractDir, "README.txt"), "utf-8");
      const assetStat = await fs.stat(path.join(tempExtractDir, "assets", upload.filename));

      expect(assetStat.isFile()).toBe(true);
      expect(indexHtml).toContain("Export Tester A");
      expect(indexHtml).toContain('<link rel="stylesheet" href="./styles.css" />');
      expect(indexHtml).toContain(`./assets/${upload.filename}`);
      expect(indexHtml).not.toContain(`/uploads/${portfolioId}`);

      expect(stylesCss).toContain(".tpl-a");
      expect(readmeTxt).toContain("VIEWING LOCALLY");
    } finally {
      await fs.rm(tempExtractDir, { recursive: true, force: true });
      await fs.unlink(tempZipFile).catch(() => {});
    }
  });

  it("builds a valid static ZIP package for Template B", async () => {
    const testSlug = `zip-tpl-b-${Date.now()}`;
    const testData = {
      ...samplePortfolioData,
      basics: {
        ...samplePortfolioData.basics,
        fullName: "Export Tester B",
        photo: undefined,
      },
    };

    await prisma.portfolio.create({
      data: {
        slug: testSlug,
        templateId: "template-b",
        data: JSON.stringify(testData),
        editTokenHash: hashEditToken("secret-token-b"),
      },
    });

    const zipResult = await buildPortfolioZipBuffer(testSlug);
    expect(zipResult).not.toBeNull();
    if (!zipResult) return;

    expect(zipResult.filename).toBe(`${testSlug}-portfolio.zip`);

    const tempExtractDir = path.join(os.tmpdir(), `zip-test-b-${Date.now()}`);
    const tempZipFile = path.join(os.tmpdir(), `test-b-${Date.now()}.zip`);
    await fs.mkdir(tempExtractDir, { recursive: true });
    await fs.writeFile(tempZipFile, zipResult.buffer);

    try {
      execSync(`tar -xf "${tempZipFile}" -C "${tempExtractDir}"`);

      const indexHtml = await fs.readFile(path.join(tempExtractDir, "index.html"), "utf-8");
      const stylesCss = await fs.readFile(path.join(tempExtractDir, "styles.css"), "utf-8");

      expect(indexHtml).toContain("Export Tester B");
      expect(indexHtml).toContain('<link rel="stylesheet" href="./styles.css" />');
      expect(stylesCss).toContain(".tpl-b");
    } finally {
      await fs.rm(tempExtractDir, { recursive: true, force: true });
      await fs.unlink(tempZipFile).catch(() => {});
    }
  });
});
