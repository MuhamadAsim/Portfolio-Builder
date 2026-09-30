import { NextRequest, NextResponse } from "next/server";
import { validateSlug, normalizeSlug } from "@/lib/slug";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawSlug = searchParams.get("slug");

  if (!rawSlug) {
    return NextResponse.json(
      { available: false, reason: "Slug parameter is required" },
      { status: 400 }
    );
  }

  const normalized = normalizeSlug(rawSlug);

  // 1. Validate length, regex pattern, and reserved slugs
  const validation = validateSlug(normalized);
  if (!validation.valid) {
    return NextResponse.json({
      available: false,
      reason: validation.error,
    });
  }

  // 2. Check SQLite database for uniqueness
  try {
    const existing = await prisma.portfolio.findUnique({
      where: { slug: normalized },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({
        available: false,
        reason: `The slug "${normalized}" is already taken.`,
      });
    }

    return NextResponse.json({
      available: true,
      slug: normalized,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database check failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
