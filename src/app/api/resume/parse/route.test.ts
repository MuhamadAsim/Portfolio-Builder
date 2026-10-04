import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";
import fs from "node:fs/promises";
import { getTmpUploadsDir } from "@/lib/images";

describe("POST /api/resume/parse", () => {
  beforeEach(async () => {
    await fs.mkdir(getTmpUploadsDir(), { recursive: true });
  });

  it("returns 400 if no file provided", async () => {
    const formData = new FormData();
    const req = new NextRequest("http://localhost:3000/api/resume/parse", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("No PDF file provided");
  });

  it("returns 400 if file is not a valid PDF", async () => {
    const formData = new FormData();
    const invalidFile = new File(["not a pdf at all"], "test.pdf", {
      type: "application/pdf",
    });
    formData.append("file", invalidFile);

    const req = new NextRequest("http://localhost:3000/api/resume/parse", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("must be a valid PDF document");
  });
});
