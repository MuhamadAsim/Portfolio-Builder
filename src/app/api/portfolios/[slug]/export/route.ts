import { NextRequest, NextResponse } from "next/server";
import { buildPortfolioZip } from "@/lib/export/buildZip";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const result = await buildPortfolioZip(slug);

  if (!result) {
    return NextResponse.json(
      { error: `Portfolio "${slug}" was not found or is not exportable.` },
      {
        status: 404,
        headers: {
          "Cache-Control": "no-cache",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  }

  return new Response(result.stream, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${result.filename}"`,
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
