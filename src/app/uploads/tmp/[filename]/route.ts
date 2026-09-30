import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import { getTmpUploadPath } from "@/lib/images";
import { IMAGE_FILENAME_REGEX } from "@/lib/schema/portfolio";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!IMAGE_FILENAME_REGEX.test(filename)) {
    return NextResponse.json(
      { error: "Invalid image filename format" },
      { status: 400 }
    );
  }

  const filePath = await getTmpUploadPath(filename);

  if (!filePath) {
    return NextResponse.json({ error: "Image not found in tmp" }, { status: 404 });
  }

  try {
    const fileBuffer = await fs.readFile(filePath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to read image file" }, { status: 500 });
  }
}
