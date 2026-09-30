import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseSubdomain } from "@/lib/host";

/**
 * Next.js 16 Proxy for subdomain routing.
 * Rewrites <slug>.<ROOT_DOMAIN>/... to /_sites/<slug>/...
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Never rewrite API routes, upload routes, Next.js system files, or static assets with extensions
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const host = request.headers.get("host") || "";
  const rootDomain = process.env.ROOT_DOMAIN || "localhost:3000";

  const { isSubdomain, slug } = parseSubdomain(host, rootDomain);

  if (isSubdomain && slug) {
    // Only the root path is a valid portfolio URL on a subdomain
    if (pathname !== "/") {
      return new NextResponse("Not Found", {
        status: 404,
        headers: {
          "x-content-type-options": "nosniff",
          "referrer-policy": "strict-origin-when-cross-origin",
          "cache-control": "no-cache",
        },
      });
    }

    const url = request.nextUrl.clone();
    url.pathname = `/_sites/${slug}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/*)
     * - upload routes (/uploads/*)
     * - _next (Next.js system files)
     * - static files with extensions (e.g. favicon.ico, .png, .css, etc.)
     */
    "/((?!api/|uploads/|_next/|[\\w-]+\\.\\w+).*)",
  ],
};
