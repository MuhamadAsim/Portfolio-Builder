import { NextRequest } from "next/server";
import { renderPublishedPage } from "@/lib/published";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return renderPublishedPage(slug);
}
