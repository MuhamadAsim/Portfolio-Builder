import { prisma } from "@/lib/db";
import { getTemplate } from "@/templates/registry";
import { portfolioDataSchema } from "@/lib/schema/portfolio";
import { validateSlug } from "@/lib/slug";
import { buildHtmlDocumentWithHashes, escapeHtml } from "@/lib/document";

/**
 * Returns a friendly standalone 404 HTML response.
 */
export function renderNotFoundPage(slug?: string): Response {
  const displaySlug = slug ? escapeHtml(slug) : "the requested page";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Portfolio Not Found • 404</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 1rem;
      padding: 2.5rem;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #312e81;
      color: #a5b4fc;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; color: #ffffff; }
    p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem; }
    .btn {
      display: inline-block;
      background: #4f46e5;
      color: #ffffff;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      text-decoration: none;
      transition: background 0.15s ease;
    }
    .btn:hover { background: #4338ca; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">404 Error</div>
    <h1>Portfolio Not Found</h1>
    <p>We couldn't find a portfolio published at <strong>${displaySlug}</strong>. It may have been unpublished or the address was mistyped.</p>
    <a href="/" class="btn">Create Your Own Portfolio</a>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 404,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  });
}

/**
 * Returns a friendly standalone 500 HTML response.
 */
export function renderServerErrorPage(message = "An error occurred while loading this portfolio."): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Unable to Load Portfolio • 500</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 1rem;
      padding: 2.5rem;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #881337;
      color: #fecdd3;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; color: #ffffff; }
    p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem; }
    .btn {
      display: inline-block;
      background: #334155;
      color: #ffffff;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      text-decoration: none;
      transition: background 0.15s ease;
    }
    .btn:hover { background: #475569; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">500 Server Error</div>
    <h1>Unable to Display Portfolio</h1>
    <p>${escapeHtml(message)}</p>
    <a href="/" class="btn">Return to Portfolio Builder</a>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 500,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  });
}

/**
 * Shared renderer for published portfolio pages.
 * Used by both /p/[slug] and /_sites/[slug] route handlers.
 */
export async function renderPublishedPage(slug: string): Promise<Response> {
  // 1. Slug validation
  const validation = validateSlug(slug);
  if (!validation.valid) {
    return renderNotFoundPage(slug);
  }

  // 2. Fetch record from SQLite
  let record;
  try {
    record = await prisma.portfolio.findUnique({
      where: { slug },
    });
  } catch {
    return renderServerErrorPage("Failed to query portfolio from database.");
  }

  if (!record) {
    return renderNotFoundPage(slug);
  }

  // 3. Look up template
  const template = getTemplate(record.templateId);
  if (!template) {
    return renderServerErrorPage("The template specified for this portfolio is unknown or unavailable.");
  }

  // 4. Parse portfolio data against Zod schema
  let parsedRaw: unknown;
  try {
    parsedRaw = JSON.parse(record.data);
  } catch {
    return renderServerErrorPage("The stored portfolio data is corrupted JSON.");
  }

  const parseResult = portfolioDataSchema.safeParse(parsedRaw);
  if (!parseResult.success) {
    return renderServerErrorPage("The stored portfolio data does not match the required schema.");
  }

  // 5. Render standalone HTML with CSP hashes
  const { html, cspHeader } = buildHtmlDocumentWithHashes(
    template,
    parseResult.data,
    {
      assetBase: `/uploads/${record.id}`,
      mode: "published",
      title: parseResult.data.basics.fullName || "Portfolio",
    }
  );

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Content-Security-Policy": cspHeader,
    },
  });
}
