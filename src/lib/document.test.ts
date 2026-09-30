import { describe, it, expect } from "vitest";
import { buildHtmlDocument } from "./document";
import { templateA } from "@/templates/template-a";
import { samplePortfolioData } from "@/templates/sample-data";

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
});
