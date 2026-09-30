import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { IMAGE_FILENAME_REGEX } from "./schema/portfolio";

export const MAX_UPLOAD_SIZE = 2 * 1024 * 1024; // 2 MB
export const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp"]);
export const MAX_IMAGE_DIMENSION = 1600;
export const LIMIT_INPUT_PIXELS = 25_000_000;

export const UPLOADS_ROOT = path.resolve(process.cwd(), "uploads");
export const TMP_UPLOADS_DIR = path.join(UPLOADS_ROOT, "tmp");

/**
 * Ensures the uploads/tmp directory exists on disk.
 */
export async function ensureUploadDirs(): Promise<void> {
  await fs.mkdir(TMP_UPLOADS_DIR, { recursive: true });
}

export interface ProcessedUpload {
  filename: string;
  filepath: string;
  size: number;
}

/**
 * Validates, re-encodes, resizes, and saves an uploaded image buffer to uploads/tmp/.
 * Security rules:
 * - Checks sharp format is strictly jpeg, png, or webp (never trusts client MIME)
 * - Restricts input pixels to prevent decompression bombs
 * - Auto-rotates using EXIF orientation then strips metadata
 * - Resizes to max 1600px bounding box
 * - Re-encodes as clean WebP
 * - Saves with random UUIDv4 filename
 */
export async function processAndSaveUpload(buffer: Buffer): Promise<ProcessedUpload> {
  if (buffer.length > MAX_UPLOAD_SIZE) {
    throw new Error("File exceeds maximum allowed size of 2 MB");
  }

  await ensureUploadDirs();

  const image = sharp(buffer, {
    failOn: "none",
    limitInputPixels: LIMIT_INPUT_PIXELS,
  });

  const metadata = await image.metadata();

  if (!metadata.format || !ALLOWED_FORMATS.has(metadata.format)) {
    throw new Error("Invalid image format. Allowed formats: JPEG, PNG, WebP (SVG and other formats are rejected)");
  }

  const processedBuffer = await image
    .rotate()
    .resize({
      width: MAX_IMAGE_DIMENSION,
      height: MAX_IMAGE_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer();

  const filename = `${crypto.randomUUID()}.webp`;
  const filepath = path.join(TMP_UPLOADS_DIR, filename);

  await fs.writeFile(filepath, processedBuffer);

  return {
    filename,
    filepath,
    size: processedBuffer.length,
  };
}

/**
 * Searches for an uploaded file on disk by filename.
 * Checks uploads/tmp/ first, then scans published portfolio subdirectories.
 */
export async function findUploadFile(filename: string): Promise<string | null> {
  if (!IMAGE_FILENAME_REGEX.test(filename)) {
    return null;
  }

  // 1. Check uploads/tmp/<filename>
  const tmpPath = path.join(TMP_UPLOADS_DIR, filename);
  try {
    const stat = await fs.stat(tmpPath);
    if (stat.isFile()) return tmpPath;
  } catch {
    // Not in tmp
  }

  // 2. Check uploads/<portfolioId>/<filename>
  try {
    const entries = await fs.readdir(UPLOADS_ROOT, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== "tmp") {
        const candidate = path.join(UPLOADS_ROOT, entry.name, filename);
        try {
          const stat = await fs.stat(candidate);
          if (stat.isFile()) return candidate;
        } catch {
          // Continue searching
        }
      }
    }
  } catch {
    // Root uploads dir may not exist yet
  }

  return null;
}

/**
 * Removes temporary upload files in uploads/tmp/ that are older than maxAgeMs (default 24h).
 */
export async function cleanupOldTmpUploads(
  maxAgeMs = 24 * 60 * 60 * 1000
): Promise<{ removedCount: number }> {
  let removedCount = 0;

  try {
    await ensureUploadDirs();
    const files = await fs.readdir(TMP_UPLOADS_DIR);
    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(TMP_UPLOADS_DIR, file);
      try {
        const stat = await fs.stat(filePath);
        if (stat.isFile() && now - stat.mtimeMs > maxAgeMs) {
          await fs.unlink(filePath);
          removedCount++;
        }
      } catch {
        // Ignore single file deletion errors
      }
    }
  } catch {
    // Directory might not exist yet
  }

  return { removedCount };
}
