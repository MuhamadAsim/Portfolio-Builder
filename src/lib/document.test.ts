import { describe, it, expect } from "vitest";
import { buildHtmlDocument, buildHtmlDocumentWithHashes } from "./document";
import { templateA } from "@/templates/template-a";
import { templateB } from "@/templates/template-b";
import { samplePortfolioData } from "@/templates/sample-data";
import { maximalFixture } from "@/templates/__fixtures__/maximal";
import crypto from "node:crypto";

describe("buildHtmlDocument", () => {
  it("assembles complete standalone HTML document with doctype, head, title, and body", () => {
    const html = buildHtmlDocument(templateA, samplePortfolioData, {
      assetBase: "/uploads",
      title: "My Portfolio Title",
    });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain('<html lang="en">');
    expect(html).toContain("<title>My Portfolio Title</title>");
    expect(html).toContain("<style>");
    expect(html).toContain(".tpl-a");
    expect(html).toContain("Jordan Vance");
    expect(html).toContain("</html>");
  });

  it("escapes special characters in page title to prevent HTML injection in head", () => {
    const html = buildHtmlDocument(templateA, samplePortfolioData, {
      assetBase: "/uploads",
      title: 'Hacker <script>alert("xss")</script> & "Quotes"',
    });

    expect(html).not.toContain('<script>alert("xss")</script>');
    expect(html).toContain("&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;");
    expect(html).toContain("&amp; &quot;Quotes&quot;");
  });

  it("computes exact CSP script hashes matching every inline script for BOTH template-a and template-b using maximal fixture", () => {
    const templates = [
      { id: "template-a", template: templateA },
      { id: "template-b", template: templateB },
    ];

    for (const { id, template } of templates) {
      const { html, scriptHashes, cspHeader } = buildHtmlDocumentWithHashes(
        template,
        maximalFixture,
        {
          assetBase: "/uploads/test-portfolio",
          mode: "published",
          title: "Maximal Test",
        }
      );

      // Extract all inline script bodies from generated HTML
      const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
      const foundScripts: string[] = [];
      let match: RegExpExecArray | null;
      while ((match = scriptRegex.exec(html)) !== null) {
        const body = match[1];
        if (body.trim().length > 0) {
          foundScripts.push(body);
        }
      }

      // Must have scripts
      expect(foundScripts.length, `${id} must contain inline scripts`).toBeGreaterThan(0);
      expect(scriptHashes.length, `${id} hash count must match found scripts`).toBe(foundScripts.length);

      // Verify every script body's SHA-256 hash matches the extracted scriptHashes
      for (let i = 0; i < foundScripts.length; i++) {
        const expectedHash = `'sha256-${crypto.createHash("sha256").update(foundScripts[i]).digest("base64")}'`;
        expect(scriptHashes[i]).toBe(expectedHash);
        expect(cspHeader).toContain(expectedHash);
      }

      // Verify no unsafe-inline is in script-src directive
      const scriptSrcDirective = cspHeader
        .split(";")
        .map((s) => s.trim())
        .find((s) => s.startsWith("script-src"));
      expect(scriptSrcDirective).toBeDefined();
      expect(scriptSrcDirective).not.toContain("'unsafe-inline'");
    }
  });
});

