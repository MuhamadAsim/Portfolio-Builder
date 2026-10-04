import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import { getTmpUploadPath } from "@/lib/images";
import { ASSET_FILENAME_REGEX } from "@/lib/schema/portfolio";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!ASSET_FILENAME_REGEX.test(filename)) {
    return NextResponse.json(
      { error: "Invalid asset filename format" },
      { status: 400 }
    );
  }

  const filePath = await getTmpUploadPath(filename);

  if (!filePath) {
    return NextResponse.json({ error: "File not found in tmp" }, { status: 404 });
  }

  try {
    const fileBuffer = await fs.readFile(filePath);
    const isPdf = filename.endsWith(".pdf");

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": isPdf ? "application/pdf" : "image/webp",
        ...(isPdf ? { "Content-Disposition": 'inline; filename="resume.pdf"' } : {}),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to read asset file" }, { status: 500 });
  }
}
