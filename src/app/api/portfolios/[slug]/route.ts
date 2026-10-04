import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyEditToken } from "@/lib/tokens";
import { createPortfolioSchema, type PortfolioData } from "@/lib/schema/portfolio";
import { validateSlug } from "@/lib/slug";
import {
  getPortfolioUploadPath,
  getTmpUploadPath,
  copyPortfolioUploads,
  removePortfolioUploads,
} from "@/lib/images";
import { getPublicUrl } from "@/lib/host";
import { MAX_PORTFOLIO_PAYLOAD_SIZE } from "@/app/api/portfolios/route";

function extractEditToken(req: NextRequest): string | null {
  const customHeader = req.headers.get("x-edit-token");
  if (customHeader && customHeader.trim().length > 0) {
    return customHeader.trim();
  }
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const val = authHeader.slice(7).trim();
    if (val.length > 0) return val;
  }
  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const token = extractEditToken(req);
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: Missing edit token." },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug },
  });

  if (!portfolio) {
    return NextResponse.json(
      { error: `Portfolio "${slug}" was not found.` },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (!verifyEditToken(token, portfolio.editTokenHash)) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid edit token." },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  let data: PortfolioData;
  try {
    data = JSON.parse(portfolio.data) as PortfolioData;
  } catch {
    return NextResponse.json(
      { error: "Corrupted portfolio data in database." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    {
      slug: portfolio.slug,
      templateId: portfolio.templateId,
      data,
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const token = extractEditToken(req);
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: Missing edit token." },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug },
  });

  if (!portfolio) {
    return NextResponse.json(
      { error: `Portfolio "${slug}" was not found.` },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (!verifyEditToken(token, portfolio.editTokenHash)) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid edit token." },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  // Check Content-Length header early
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_PORTFOLIO_PAYLOAD_SIZE) {
    return NextResponse.json(
      { error: "Payload exceeds 200 KB limit" },
      { status: 413, headers: { "Cache-Control": "no-store" } }
    );
  }

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

  const parseResult = createPortfolioSchema.safeParse(jsonBody);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parseResult.error.format() },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const { slug: newSlug, templateId, data } = parseResult.data;

  const slugCheck = validateSlug(newSlug);
  if (!slugCheck.valid) {
    return NextResponse.json(
      { error: slugCheck.error },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  // Check if new slug is taken by a different portfolio
  if (newSlug !== slug) {
    const existing = await prisma.portfolio.findUnique({
      where: { slug: newSlug },
    });
    if (existing && existing.id !== portfolio.id) {
      return NextResponse.json(
        { error: `The slug "${newSlug}" is already in use by another portfolio.` },
        { status: 409, headers: { "Cache-Control": "no-store" } }
      );
    }
  }

  // Collect referenced images
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

  // Verify and copy any new images from uploads/tmp/ to uploads/<portfolio.id>/
  const newImagesToCopy: string[] = [];
  for (const filename of uniqueImages) {
    const existingInPortfolio = await getPortfolioUploadPath(portfolio.id, filename);
    if (!existingInPortfolio) {
      const tmpPath = await getTmpUploadPath(filename);
      if (!tmpPath) {
        return NextResponse.json(
          { error: `Referenced image "${filename}" not found.` },
          { status: 400, headers: { "Cache-Control": "no-store" } }
        );
      }
      newImagesToCopy.push(filename);
    }
  }

  if (newImagesToCopy.length > 0) {
    try {
      await copyPortfolioUploads(portfolio.id, newImagesToCopy);
    } catch {
      return NextResponse.json(
        { error: "Failed to process updated portfolio images" },
        { status: 500, headers: { "Cache-Control": "no-store" } }
      );
    }
  }

  try {
    const updated = await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: {
        slug: newSlug,
        templateId,
        data: JSON.stringify(data),
      },
    });

    const publicUrl = getPublicUrl(updated.slug);

    return NextResponse.json(
      {
        slug: updated.slug,
        url: publicUrl,
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: `The slug "${newSlug}" was taken just now. Please choose another.` },
        { status: 409, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      { error: "Failed to update portfolio record" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const token = extractEditToken(req);
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: Missing edit token." },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug },
  });

  if (!portfolio) {
    return NextResponse.json(
      { error: `Portfolio "${slug}" was not found.` },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (!verifyEditToken(token, portfolio.editTokenHash)) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid edit token." },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    await prisma.portfolio.delete({
      where: { id: portfolio.id },
    });
    await removePortfolioUploads(portfolio.id);

    return NextResponse.json(
      { message: "Portfolio deleted successfully." },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to delete portfolio." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
