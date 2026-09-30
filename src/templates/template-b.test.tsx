import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { templateB } from "./template-b";
import { samplePortfolioData } from "./sample-data";

describe("Template B Specific Features (Neo-Pop)", () => {
  const opts = { assetBase: "/uploads" };

  it("renders with root .tpl-b scoped container", () => {
    const markup = renderToStaticMarkup(templateB.render(samplePortfolioData, opts));
    expect(markup).toContain('class="tpl-b"');
  });

  it("includes an early anti-flash script that targets parentElement (.tpl-b)", () => {
    const markup = renderToStaticMarkup(templateB.render(samplePortfolioData, opts));
    expect(markup).toContain("parentElement.setAttribute('data-theme', t)");
  });

  it("renders the theme toggle button with aria-pressed='false'", () => {
    const markup = renderToStaticMarkup(templateB.render(samplePortfolioData, opts));
    expect(markup).toContain('class="tpl-theme-toggle"');
    expect(markup).toContain('aria-pressed="false"');
    expect(markup).toContain('aria-label="Toggle dark mode theme"');
  });

  it("renders tape sticker derived dynamically from basics.title", () => {
    const markup = renderToStaticMarkup(templateB.render(samplePortfolioData, opts));
    expect(markup).toContain('class="tpl-tape-sticker"');
    expect(markup).toContain("/// Full Stack Engineer &amp; AI Specialist ///");
  });

  it("omits tape sticker when basics.title is empty", () => {
    const dataWithoutTitle = {
      ...samplePortfolioData,
      basics: {
        ...samplePortfolioData.basics,
        title: "",
      },
    };
    const markup = renderToStaticMarkup(templateB.render(dataWithoutTitle, opts));
    expect(markup).not.toContain('class="tpl-tape-sticker"');
  });

  it("does not render any hardcoded 'Available for...' badge or assume developer persona", () => {
    const markup = renderToStaticMarkup(templateB.render(samplePortfolioData, opts));
    expect(markup).not.toContain("Available for");
    expect(markup).not.toContain("engineering roles");
    expect(markup).not.toContain("software applications");
  });

  it("renders polaroid card with photo frame", () => {
    const markup = renderToStaticMarkup(templateB.render(samplePortfolioData, opts));
    expect(markup).toContain('class="tpl-polaroid-card"');
    expect(markup).toContain('class="tpl-polaroid-inner"');
  });

  it("renders availability indicator when basics.availability is set", () => {
    const dataWithAvailability = {
      ...samplePortfolioData,
      basics: {
        ...samplePortfolioData.basics,
        availability: "Accepting select client projects",
      },
    };
    const markup = renderToStaticMarkup(templateB.render(dataWithAvailability, opts));
    expect(markup).toContain('class="tpl-availability-pill"');
    expect(markup).toContain("Accepting select client projects");
  });

  it("omits availability indicator when basics.availability is undefined", () => {
    const dataWithoutAvailability = {
      ...samplePortfolioData,
      basics: {
        ...samplePortfolioData.basics,
        availability: undefined,
      },
    };
    const markup = renderToStaticMarkup(templateB.render(dataWithoutAvailability, opts));
    expect(markup).not.toContain('class="tpl-availability-pill"');
  });
});
