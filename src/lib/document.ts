import crypto from "node:crypto";
import { renderToStaticMarkup } from "react-dom/server.browser";
import type { PortfolioData } from "./schema/portfolio";
import type { PortfolioTemplate, RenderOptions } from "@/templates/types";

/**
 * Escapes special characters for safe injection into HTML text nodes / attributes.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface BuildHtmlOptions extends RenderOptions {
  title?: string;
  mode?: "preview" | "published";
  previewOrigin?: string;
}

/**
 * Extracts the exact text of every inline <script> in the HTML and computes its SHA-256 base64 hash.
 */
export function extractAndHashScripts(html: string): string[] {
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  const hashes: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = scriptRegex.exec(html)) !== null) {
    const scriptContent = match[1];
    if (scriptContent.trim().length > 0) {
      const hash = crypto.createHash("sha256").update(scriptContent).digest("base64");
      hashes.push(`'sha256-${hash}'`);
    }
  }
  return hashes;
}

/**
 * Builds standard Content-Security-Policy directive.
 * - Published pages: img-src 'self'
 * - Preview iframe: img-src 'self' <previewOrigin> (keeps sandbox, no broad http:/https:)
 * - Scripts: strict sha256 hashes of inline scripts (no 'unsafe-inline')
 */
export function buildCspDirective(options: {
  scriptHashes: string[];
  mode?: "preview" | "published";
  previewOrigin?: string;
}): string {
  const scriptSources =
    options.scriptHashes.length > 0 ? options.scriptHashes.join(" ") : "'none'";

  let imgSrc = "'self'";
  if (options.mode === "preview" && options.previewOrigin) {
    imgSrc = `'self' ${options.previewOrigin}`;
  }

  return [
    `default-src 'none'`,
    `img-src ${imgSrc}`,
    `style-src 'unsafe-inline'`,
    `script-src ${scriptSources}`,
    `frame-ancestors 'none'`,
    `base-uri 'none'`,
    `form-action 'none'`,
  ].join("; ");
}

/**
 * Builds complete HTML document string and computes CSP hashes.
 */
export function buildHtmlDocumentWithHashes(
  template: PortfolioTemplate,
  data: PortfolioData,
  opts: BuildHtmlOptions
): { html: string; scriptHashes: string[]; cspHeader: string } {
  const pageTitle = escapeHtml(opts.title || data.basics.fullName || "Portfolio");
  const markup = renderToStaticMarkup(template.render(data, opts));
  const scriptHashes = extractAndHashScripts(markup);

  const cspHeader = buildCspDirective({
    scriptHashes,
    mode: opts.mode,
    previewOrigin: opts.previewOrigin,
  });

  // For sandboxed preview iframe, include CSP as a meta tag in head
  const metaCsp = opts.mode === "preview"
    ? `  <meta http-equiv="Content-Security-Policy" content="${escapeHtml(cspHeader)}" />\n`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
${metaCsp}  <title>${pageTitle}</title>
  <style>
${template.css}
  </style>
</head>
<body>
${markup}
</body>
</html>`;

  return { html, scriptHashes, cspHeader };
}

/**
 * Builds a complete standalone HTML document string.
 */
export function buildHtmlDocument(
  template: PortfolioTemplate,
  data: PortfolioData,
  opts: BuildHtmlOptions
): string {
  return buildHtmlDocumentWithHashes(template, data, opts).html;
}
