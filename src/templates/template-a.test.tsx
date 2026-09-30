import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { templateA } from "./template-a";
import { samplePortfolioData } from "./sample-data";
import { minimalFixture } from "./__fixtures__/minimal";
import { maximalFixture } from "./__fixtures__/maximal";
import { xssTextFixture, maliciousUrlPayloads } from "./__fixtures__/xss";

describe("Template A (Clean Modern)", () => {
  const opts = { assetBase: "/uploads" };

  it("renders sample dataset with complete sections", () => {
    const markup = renderToStaticMarkup(templateA.render(samplePortfolioData, opts));

    expect(markup).toContain("Jordan Vance");
    expect(markup).toContain("Full Stack Engineer &amp; AI Specialist");
    expect(markup).toContain("OmniSearch AI Assistant");
    expect(markup).toContain("PulseFlow Analytics Dashboard");
    expect(markup).toContain("React");
    expect(markup).toContain("Next.js");
    expect(markup).toContain("State University of Technology");
    expect(markup).toContain("Apex Cloud Solutions");
    expect(markup).toContain("jordan.vance@example.com");
  });

  it("renders minimal dataset without omitting required basics or showing empty optional sections", () => {
    const markup = renderToStaticMarkup(templateA.render(minimalFixture, opts));

    expect(markup).toContain("Jane Doe");
    expect(markup).toContain("Software Engineer");
    expect(markup).toContain("jane.doe@example.com");

    // Optional sections must not render when empty
    expect(markup).not.toContain('id="projects"');
    expect(markup).not.toContain('id="skills"');
    expect(markup).not.toContain('id="experience"');

    // Nav links for missing sections must be omitted
    expect(markup).not.toContain('href="#projects"');
    expect(markup).not.toContain('href="#skills"');
    expect(markup).not.toContain('href="#experience"');
  });

  it("renders cleanly when photo is omitted", () => {
    const dataWithoutPhoto = {
      ...samplePortfolioData,
      basics: {
        ...samplePortfolioData.basics,
        photo: undefined,
      },
    };
    const markup = renderToStaticMarkup(templateA.render(dataWithoutPhoto, opts));

    expect(markup).toContain("tpl-avatar-placeholder");
    expect(markup).not.toContain("sample-profile.png");
  });

  it("renders maximal dataset within bounds without error", () => {
    const markup = renderToStaticMarkup(templateA.render(maximalFixture, opts));

    expect(markup).toContain("Alexandria Bartholomew Constantine-Montgomery");
    expect(markup).toContain("Distributed High-Throughput Streaming Engine 12");
    expect(markup).toContain("Technical Skill 30");
    expect(markup).toContain("Enterprise Technologies Global Group 10");
    expect(markup).toContain("Institute of Advanced Computer Science 6");
  });

  describe("Security & XSS sanitization", () => {
    it("escapes all HTML and script injection probes in text fields", () => {
      const markup = renderToStaticMarkup(templateA.render(xssTextFixture, opts));

      // Raw unescaped script tags from user input must NEVER exist in markup
      expect(markup).not.toContain("<script>alert('xss-name')</script>");
      expect(markup).not.toContain("<script>alert('xss-title')</script>");
      expect(markup).not.toContain("<script>alert('xss-bio')</script>");
      expect(markup).not.toContain("<script>alert('xss-skill')</script>");
      expect(markup).not.toContain("<script>alert('xss-proj')</script>");
      expect(markup).not.toContain("<img src=x onerror=alert('xss-title')>");

      // Escaped safe entities must be present
      expect(markup).toContain("&lt;script&gt;alert(&#x27;xss-name&#x27;)&lt;/script&gt;");
      expect(markup).toContain("&lt;script&gt;alert(&#x27;xss-bio&#x27;)&lt;/script&gt;");
    });

    it("sanitizes link fields and rejects javascript: and data: URLs", () => {
      for (const dangerousUrl of maliciousUrlPayloads) {
        const attackData = {
          ...minimalFixture,
          contact: {
            ...minimalFixture.contact,
            github: dangerousUrl,
            linkedin: dangerousUrl,
            twitter: dangerousUrl,
            website: dangerousUrl,
            resumeUrl: dangerousUrl,
          },
          projects: [
            {
              title: "Probe Project",
              description: "Probe description",
              tags: ["Security"],
              liveUrl: dangerousUrl,
              repoUrl: dangerousUrl,
            },
          ],
        };

        const markup = renderToStaticMarkup(templateA.render(attackData, opts));

        expect(markup).not.toContain(`href="${dangerousUrl}"`);
        expect(markup).not.toContain("javascript:");
        expect(markup).not.toContain("data:text/html");
        expect(markup).not.toContain("vbscript:");
      }
    });

    it("ensures no user data is interpolated into inline style attributes", () => {
      const markup = renderToStaticMarkup(templateA.render(xssTextFixture, opts));
      const styleMatches = markup.match(/style="([^"]*)"/g) || [];

      // Check all style attributes to ensure no probe payloads appear inside styles
      for (const styleAttr of styleMatches) {
        expect(styleAttr).not.toContain("xss");
        expect(styleAttr).not.toContain("probe");
        expect(styleAttr).not.toContain("alert");
      }
    });

    it("ensures inline script is strictly static with zero user data", () => {
      const markup = renderToStaticMarkup(templateA.render(xssTextFixture, opts));
      const scriptMatches = markup.match(/<script>([\s\S]*?)<\/script>/g) || [];

      expect(scriptMatches.length).toBe(1);
      const scriptContent = scriptMatches[0];

      // Script must not contain user content
      expect(scriptContent).not.toContain("Alex");
      expect(scriptContent).not.toContain("xss");
      expect(scriptContent).not.toContain("probe");
      expect(scriptContent).toContain("tpl-nav-toggle");
    });
  });
});
