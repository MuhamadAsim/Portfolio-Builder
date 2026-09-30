import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import { getPortfolioUploadPath, PORTFOLIO_ID_REGEX } from "@/lib/images";
import { IMAGE_FILENAME_REGEX } from "@/lib/schema/portfolio";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ portfolioId: string; filename: string }> }
) {
  const { portfolioId, filename } = await params;

  if (!PORTFOLIO_ID_REGEX.test(portfolioId)) {
    return NextResponse.json(
      { error: "Invalid portfolio identifier format" },
      { status: 400 }
    );
  }

  if (!IMAGE_FILENAME_REGEX.test(filename)) {
    return NextResponse.json(
      { error: "Invalid image filename format" },
      { status: 400 }
    );
  }

  const filePath = await getPortfolioUploadPath(portfolioId, filename);

  if (!filePath) {
    return NextResponse.json({ error: "Image not found for portfolio" }, { status: 404 });
  }

  try {
    const fileBuffer = await fs.readFile(filePath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to read image file" }, { status: 500 });
  }
}
