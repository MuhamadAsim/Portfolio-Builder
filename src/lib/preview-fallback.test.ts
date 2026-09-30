import { describe, it, expect } from "vitest";
import { resolvePreviewData } from "./preview-fallback";
import { samplePortfolioData } from "@/templates/sample-data";
import { minimalFixture } from "@/templates/__fixtures__/minimal";

describe("resolvePreviewData", () => {
  it("uses valid draft sections when fully conforming to schema", () => {
    const draft = {
      basics: {
        fullName: "Taylor Swift",
        title: "Songwriter & Producer",
        bio: "Writing and performing across indie, pop, and country genres for decades.",
        availability: "On world tour",
      },
      contact: {
        email: "taylor@example.com",
        website: "https://taylor.example.com",
      },
      skills: [{ name: "Songwriting", category: "Music" }],
      experience: [],
      education: [],
      projects: [],
    };

    const result = resolvePreviewData(draft, null);

    expect(result.data.basics.fullName).toBe("Taylor Swift");
    expect(result.data.basics.title).toBe("Songwriter & Producer");
    expect(result.data.basics.availability).toBe("On world tour");
    expect(result.data.contact.email).toBe("taylor@example.com");
    expect(result.data.skills).toEqual([{ name: "Songwriting", category: "Music" }]);
    expect(result.fallbackSections).toHaveLength(0);
  });

  it("falls back to lastValid section when draft section is invalid or incomplete", () => {
    const draftWithInvalidBasics = {
      basics: {
        fullName: "T", // Too short (min 2)
        title: "", // Empty (min 2)
        bio: "short", // Too short (min 10)
      },
      contact: {
        email: "valid@example.com",
      },
    };

    const lastValid = {
      ...samplePortfolioData,
      basics: {
        ...samplePortfolioData.basics,
        fullName: "Last Valid Name",
      },
    };

    const result = resolvePreviewData(draftWithInvalidBasics, lastValid);

    // basics fell back to lastValid
    expect(result.data.basics.fullName).toBe("Last Valid Name");
    expect(result.fallbackSections).toContainEqual({
      section: "basics",
      source: "last-valid",
    });

    // contact was valid in draft, so no fallback for contact
    expect(result.data.contact.email).toBe("valid@example.com");
  });

  it("falls back to sample default when draft is empty and lastValid is absent", () => {
    const result = resolvePreviewData({}, null);

    expect(result.data.basics.fullName).toBe(samplePortfolioData.basics.fullName);
    expect(result.data.contact.email).toBe(samplePortfolioData.contact.email);
    expect(result.data.projects).toEqual(samplePortfolioData.projects);

    expect(result.fallbackSections).toEqual([
      { section: "basics", source: "sample" },
      { section: "contact", source: "sample" },
      { section: "skills", source: "sample" },
      { section: "experience", source: "sample" },
      { section: "education", source: "sample" },
      { section: "projects", source: "sample" },
    ]);
  });

  it("preserves explicitly valid empty lists in draft without forcing sample items", () => {
    const draftWithEmptyLists = {
      ...minimalFixture,
      skills: [],
      experience: [],
      education: [],
      projects: [],
    };

    const result = resolvePreviewData(draftWithEmptyLists, null);

    expect(result.data.skills).toEqual([]);
    expect(result.data.experience).toEqual([]);
    expect(result.data.education).toEqual([]);
    expect(result.data.projects).toEqual([]);
    expect(result.fallbackSections).toHaveLength(0);
  });
});
