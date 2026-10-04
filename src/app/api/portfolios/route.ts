import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { createPortfolioSchema } from "@/lib/schema/portfolio";
import { validateSlug } from "@/lib/slug";
import { generateEditToken, hashEditToken } from "@/lib/tokens";
import { getTmpUploadPath, copyPortfolioUploads, removePortfolioUploads } from "@/lib/images";
import { getPublicUrl } from "@/lib/host";
import { prisma } from "@/lib/db";

export const MAX_PORTFOLIO_PAYLOAD_SIZE = 200 * 1024; // 200 KB

export async function POST(req: NextRequest) {
  // 1. Check Content-Length header early to reject oversized payloads
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_PORTFOLIO_PAYLOAD_SIZE) {
    return NextResponse.json(
      { error: "Payload exceeds 200 KB limit" },
      { status: 413, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 2. Read and parse body text with size enforcement
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json(
      { error: "Failed to read request body" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (Buffer.byteLength(rawBody, "utf-8") > MAX_PORTFOLIO_PAYLOAD_SIZE) {
    return NextResponse.json(
      { error: "Payload exceeds 200 KB limit" },
      { status: 413, headers: { "Cache-Control": "no-store" } }
    );
  }

  let jsonBody: unknown;
  try {
    jsonBody = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 3. Validate payload schema
  const parseResult = createPortfolioSchema.safeParse(jsonBody);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parseResult.error.format() },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const { slug, templateId, data } = parseResult.data;

  // 4. Validate slug semantics and reserved words
  const slugCheck = validateSlug(slug);
  if (!slugCheck.valid) {
    return NextResponse.json(
      { error: slugCheck.error },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 5. Collect and deduplicate all referenced image filenames
  const referencedImages: string[] = [];
  if (data.basics.photo) {
    referencedImages.push(data.basics.photo);
  }
  if (data.contact.resumePdf) {
    referencedImages.push(data.contact.resumePdf);
  }
  for (const proj of data.projects) {
    if (proj.image) {
      referencedImages.push(proj.image);
    }
  }
  const uniqueImages = Array.from(new Set(referencedImages));

  // 6. Verify all referenced images exist in uploads/tmp/
  for (const filename of uniqueImages) {
    const tmpPath = await getTmpUploadPath(filename);
    if (!tmpPath) {
      return NextResponse.json(
        { error: `Referenced image "${filename}" not found in temporary uploads` },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }
  }

  // 7. Generate portfolio id and tokens up front
  const portfolioId = crypto.randomUUID();
  const editToken = generateEditToken();
  const editTokenHash = hashEditToken(editToken);

  // 8. Copy referenced images to uploads/<portfolioId>/
  try {
    if (uniqueImages.length > 0) {
      await copyPortfolioUploads(portfolioId, uniqueImages);
    }
  } catch {
    await removePortfolioUploads(portfolioId);
    return NextResponse.json(
      { error: "Failed to process portfolio images" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 9. Create database row with rollback guarantee
  try {
    await prisma.portfolio.create({
      data: {
        id: portfolioId,
        slug,
        templateId,
        data: JSON.stringify(data),
        editTokenHash,
      },
    });

    const publicUrl = getPublicUrl(slug);

    return NextResponse.json(
      {
        slug,
        editToken,
        url: publicUrl,
      },
      {
        status: 201,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error: unknown) {
    // Rollback: remove copied images if DB insertion fails
    await removePortfolioUploads(portfolioId);

    // Prisma unique constraint violation code is P2002
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: `The slug "${slug}" was taken just now. Please choose another.` },
        { status: 409, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      { error: "Failed to create portfolio record" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
