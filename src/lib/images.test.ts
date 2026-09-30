import { describe, it, expect, afterAll } from "vitest";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import {
  processAndSaveUpload,
  findUploadFile,
  cleanupOldTmpUploads,
  getTmpUploadsDir,
  MAX_UPLOAD_SIZE,
} from "./images";

describe("Image processing and storage (src/lib/images)", () => {
  const createdFiles: string[] = [];

  afterAll(async () => {
    for (const f of createdFiles) {
      try {
        await fs.unlink(f);
      } catch {
        // Ignore cleanup error
      }
    }
  });

  it("converts a valid PNG to WebP and saves to uploads/tmp/", async () => {
    const pngBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    const result = await processAndSaveUpload(pngBuffer);
    createdFiles.push(result.filepath);

    expect(result.filename).toMatch(/^[a-f0-9-]{36}\.webp$/);
    expect(result.filepath).toBe(path.join(getTmpUploadsDir(), result.filename));
    expect(result.size).toBeGreaterThan(0);

    // Verify saved file is valid WebP with Sharp
    const savedMeta = await sharp(result.filepath).metadata();
    expect(savedMeta.format).toBe("webp");
    expect(savedMeta.width).toBe(100);
    expect(savedMeta.height).toBe(100);
  });

  it("converts and resizes an oversized dimension image to max 1600px", async () => {
    const largeBuffer = await sharp({
      create: {
        width: 2000,
        height: 1000,
        channels: 3,
        background: { r: 0, g: 128, b: 255 },
      },
    })
      .jpeg()
      .toBuffer();

    const result = await processAndSaveUpload(largeBuffer);
    createdFiles.push(result.filepath);

    const savedMeta = await sharp(result.filepath).metadata();
    expect(savedMeta.format).toBe("webp");
    expect(savedMeta.width).toBe(1600);
    expect(savedMeta.height).toBe(800);
  });

  it("rejects an image exceeding MAX_UPLOAD_SIZE", async () => {
    const oversizedBuffer = Buffer.alloc(MAX_UPLOAD_SIZE + 10);
    await expect(processAndSaveUpload(oversizedBuffer)).rejects.toThrow(
      "File exceeds maximum allowed size of 2 MB"
    );
  });

  it("rejects SVG and non-raster formats even if disguised", async () => {
    const svgBuffer = Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'><circle r='50'/></svg>");
    await expect(processAndSaveUpload(svgBuffer)).rejects.toThrow(/Invalid image format/);

    const textBuffer = Buffer.from("this is just plain text content");
    await expect(processAndSaveUpload(textBuffer)).rejects.toThrow();
  });

  it("finds uploaded file in tmp directory and validates filename regex", async () => {
    const pngBuffer = await sharp({
      create: {
        width: 50,
        height: 50,
        channels: 3,
        background: { r: 50, g: 50, b: 50 },
      },
    })
      .png()
      .toBuffer();

    const result = await processAndSaveUpload(pngBuffer);
    createdFiles.push(result.filepath);

    // Valid search
    const found = await findUploadFile(result.filename);
    expect(found).toBe(result.filepath);

    // Invalid format search
    const invalidFormat = await findUploadFile("not-a-valid-uuid.png");
    expect(invalidFormat).toBeNull();

    // Directory traversal attempt
    const traversal = await findUploadFile("../../../evil.webp");
    expect(traversal).toBeNull();

    // Non-existent valid-formatted uuid
    const nonExistent = await findUploadFile("00000000-0000-0000-0000-000000000000.webp");
    expect(nonExistent).toBeNull();
  });

  it("cleans up old tmp upload files older than threshold", async () => {
    const pngBuffer = await sharp({
      create: {
        width: 10,
        height: 10,
        channels: 3,
        background: { r: 10, g: 10, b: 10 },
      },
    })
      .png()
      .toBuffer();

    const result = await processAndSaveUpload(pngBuffer);
    // Artificially change file mtime to 25 hours ago
    const pastTime = new Date(Date.now() - 25 * 60 * 60 * 1000);
    await fs.utimes(result.filepath, pastTime, pastTime);

    // Also create a fresh file that should NOT be cleaned up
    const freshResult = await processAndSaveUpload(pngBuffer);
    createdFiles.push(freshResult.filepath);

    const cleanupResult = await cleanupOldTmpUploads(24 * 60 * 60 * 1000);
    expect(cleanupResult.removedCount).toBeGreaterThanOrEqual(1);

    // Verify old file is gone
    const oldFound = await findUploadFile(result.filename);
    expect(oldFound).toBeNull();

    // Verify fresh file remains
    const freshFound = await findUploadFile(freshResult.filename);
    expect(freshFound).toBe(freshResult.filepath);
  });
});
