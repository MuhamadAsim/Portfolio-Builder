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

  it("renders availability indicator when basics.availability is set", () => {
    const dataWithAvailability = {
      ...samplePortfolioData,
      basics: {
        ...samplePortfolioData.basics,
        availability: "Available for freelance design",
      },
    };
    const markup = renderToStaticMarkup(templateA.render(dataWithAvailability, opts));
    expect(markup).toContain('class="tpl-availability-badge"');
    expect(markup).toContain("Available for freelance design");
  });

  it("omits availability indicator when basics.availability is undefined", () => {
    const dataWithoutAvailability = {
      ...samplePortfolioData,
      basics: {
        ...samplePortfolioData.basics,
        availability: undefined,
      },
    };
    const markup = renderToStaticMarkup(templateA.render(dataWithoutAvailability, opts));
    expect(markup).not.toContain('class="tpl-availability-badge"');
  });
});
