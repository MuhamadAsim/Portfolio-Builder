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

  it("accepts a valid PDF and returns 200 with extracted information", async () => {
    const minPdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 120 >>
stream
BT /F1 12 Tf 72 712 Td (ALEX RIVERA) Tj ET
BT /F1 12 Tf 72 690 Td (alex@example.com) Tj ET
BT /F1 12 Tf 72 670 Td (Software Engineer) Tj ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000261 00000 n 
0000000431 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
510
%%EOF`;

    const formData = new FormData();
    const validFile = new File([minPdf], "resume.pdf", {
      type: "application/pdf",
    });
    formData.append("file", validFile);

    const req = new NextRequest("http://localhost:3000/api/resume/parse", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.filename).toMatch(/^[a-f0-9-]{36}\.pdf$/);
    expect(body.url).toContain("/uploads/tmp/");
    expect(body.extracted.fullName).toBe("Alex Rivera");
    expect(body.extracted.email).toBe("alex@example.com");
  });
});
