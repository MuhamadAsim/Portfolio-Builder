import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { templateA } from "./template-a";
import { samplePortfolioData } from "./sample-data";

describe("Template A Specific Features (Clean Modern)", () => {
  const opts = { assetBase: "/uploads" };

  it("renders with root .tpl-a scoped container", () => {
    const markup = renderToStaticMarkup(templateA.render(samplePortfolioData, opts));
    expect(markup).toContain('class="tpl-a"');
  });

  it("renders tag filter buttons when projects have tags", () => {
    const markup = renderToStaticMarkup(templateA.render(samplePortfolioData, opts));

    expect(markup).toContain('class="tpl-filter-row"');
    expect(markup).toContain('data-filter="all"');
    expect(markup).toContain('data-filter="React"');
  });

  it("omits tag filter buttons when projects have no tags", () => {
    const dataWithoutTags = {
      ...samplePortfolioData,
      projects: [
        {
          title: "Simple Project",
          description: "No tags project",
          tags: [],
        },
      ],
    };

    const markup = renderToStaticMarkup(templateA.render(dataWithoutTags, opts));
    expect(markup).not.toContain('class="tpl-filter-row"');
  });
});
