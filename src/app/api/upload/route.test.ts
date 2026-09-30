import { describe, it, expect, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { TMP_UPLOADS_DIR, MAX_UPLOAD_SIZE } from "@/lib/images";

describe("Upload API Route (POST /api/upload)", () => {
  const createdFiles: string[] = [];

  afterAll(async () => {
    for (const f of createdFiles) {
      try {
        await fs.unlink(path.join(TMP_UPLOADS_DIR, f));
      } catch {
        // Ignore
      }
    }
  });

  it("successfully uploads a valid JPEG image and returns WebP url and filename", async () => {
    const jpegBuffer = await sharp({
      create: {
        width: 80,
        height: 80,
        channels: 3,
        background: { r: 200, g: 100, b: 50 },
      },
    })
      .jpeg()
      .toBuffer();

    const formData = new FormData();
    const file = new File([jpegBuffer], "avatar.jpg", { type: "image/jpeg" });
    formData.append("file", file);

    const req = new NextRequest("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.filename).toMatch(/^[a-f0-9-]{36}\.webp$/);
    expect(json.url).toBe(`/uploads/${json.filename}`);

    createdFiles.push(json.filename);

    // Verify file exists in tmp dir
    const stat = await fs.stat(path.join(TMP_UPLOADS_DIR, json.filename));
    expect(stat.isFile()).toBe(true);
  });

  it("returns 413 when Content-Length exceeds maximum limit", async () => {
    const formData = new FormData();
    formData.append("file", new File([new Uint8Array(10)], "tiny.jpg", { type: "image/jpeg" }));

    const req = new NextRequest("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
      headers: {
        "content-length": String(MAX_UPLOAD_SIZE + 10_000),
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(413);
    const json = await res.json();
    expect(json.error).toMatch(/exceeds 2 MB/);
  });

  it("returns 413 when file.size exceeds maximum limit", async () => {
    const largeBuffer = new Uint8Array(MAX_UPLOAD_SIZE + 10);
    const formData = new FormData();
    formData.append("file", new File([largeBuffer], "huge.jpg", { type: "image/jpeg" }));

    const req = new NextRequest("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(413);
    const json = await res.json();
    expect(json.error).toMatch(/exceeds 2 MB/);
  });

  it("returns 400 when no file is provided in FormData", async () => {
    const formData = new FormData();
    formData.append("unrelatedField", "value");

    const req = new NextRequest("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/No file provided/);
  });

  it("returns 400 when disallowed format (e.g. GIF) is submitted", async () => {
    const gifBuffer = await sharp({
      create: {
        width: 10,
        height: 10,
        channels: 3,
        background: { r: 0, g: 0, b: 0 },
      },
    })
      .gif()
      .toBuffer();

    const formData = new FormData();
    formData.append("file", new File([gifBuffer], "image.gif", { type: "image/gif" }));

    const req = new NextRequest("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Invalid image format/);
  });

  it("returns 400 when corrupt/SVG file is submitted", async () => {
    const formData = new FormData();
    formData.append(
      "file",
      new File(["<svg></svg>"], "image.svg", { type: "image/svg+xml" })
    );

    const req = new NextRequest("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeTruthy();
  });
});
