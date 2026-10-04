import { NextRequest, NextResponse } from "next/server";
import { parseAndSaveResumePdf, MAX_PDF_SIZE } from "@/lib/resumeParser";

export async function POST(req: NextRequest) {
  try {
    // 1. Check Content-Length header early
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_PDF_SIZE + 4096) {
      return NextResponse.json(
        { error: "Payload exceeds 5 MB upload limit for PDF resumes" },
        { status: 413 }
      );
    }

    // 2. Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No PDF file provided. Ensure form-data field 'file' is set." },
        { status: 400 }
      );
    }

    // 3. Verify file size
    if (file.size > MAX_PDF_SIZE) {
      return NextResponse.json(
        { error: "PDF exceeds 5 MB upload limit" },
        { status: 413 }
      );
    }

    // 4. Read arrayBuffer and process with resume parser
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await parseAndSaveResumePdf(buffer);

    return NextResponse.json(
      {
        filename: result.filename,
        url: `/uploads/tmp/${result.filename}`,
        size: result.size,
        extracted: result.extracted,
        fieldsExtracted: result.fieldsExtracted,
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to parse PDF resume";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
