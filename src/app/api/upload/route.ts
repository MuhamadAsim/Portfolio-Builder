import { NextRequest, NextResponse } from "next/server";
import { processAndSaveUpload, MAX_UPLOAD_SIZE } from "@/lib/images";

export async function POST(req: NextRequest) {
  try {
    // 1. Check Content-Length header early to reject oversized payloads before buffering
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_UPLOAD_SIZE + 4096) {
      return NextResponse.json(
        { error: "Payload exceeds 2 MB upload limit" },
        { status: 413 }
      );
    }

    // 2. Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided. Ensure form-data field 'file' is set." },
        { status: 400 }
      );
    }

    // 3. Verify file size
    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 2 MB upload limit" },
        { status: 413 }
      );
    }

    // 4. Read arrayBuffer and process with sharp
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await processAndSaveUpload(buffer);

    return NextResponse.json(
      {
        filename: result.filename,
        url: `/uploads/tmp/${result.filename}`,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process image upload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
