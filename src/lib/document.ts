import { renderToStaticMarkup } from "react-dom/server.browser";
import type { PortfolioData } from "./schema/portfolio";
import type { PortfolioTemplate, RenderOptions } from "@/templates/types";

/**
 * Escapes special characters for safe injection into HTML text nodes / attributes.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface BuildHtmlOptions extends RenderOptions {
  title?: string;
}

/**
 * Builds a complete, standalone HTML document string from a portfolio template and data.
 * Pure function: same inputs -> exact same output string.
 * Used for builder iframe preview, route handler static delivery, and static ZIP export.
 */
export function buildHtmlDocument(
  template: PortfolioTemplate,
  data: PortfolioData,
  opts: BuildHtmlOptions
): string {
  const pageTitle = escapeHtml(opts.title || data.basics.fullName || "Portfolio");
  const markup = renderToStaticMarkup(template.render(data, opts));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${pageTitle}</title>
  <style>
${template.css}
  </style>
</head>
<body>
${markup}
</body>
</html>`;
}
