import { describe, it, expect } from "vitest";
import {
  portfolioDataSchema,
  createPortfolioSchema,
} from "./portfolio";

describe("portfolioDataSchema", () => {
  const minimalValidData = {
    basics: {
      fullName: "Alex Rivera",
      title: "Senior Full Stack Engineer",
      bio: "Crafting performant web experiences with precision and modern architectural standards.",
    },
    contact: {
      email: "alex@example.com",
    },
    skills: [],
    experience: [],
    education: [],
    projects: [],
  };

  it("parses minimal valid portfolio data successfully", () => {
    const parsed = portfolioDataSchema.parse(minimalValidData);
    expect(parsed.basics.fullName).toBe("Alex Rivera");
    expect(parsed.skills).toEqual([]);
    expect(parsed.experience).toEqual([]);
    expect(parsed.education).toEqual([]);
    expect(parsed.projects).toEqual([]);
  });

  it("transforms empty string URLs to undefined", () => {
    const dataWithEmptyUrls = {
      ...minimalValidData,
      contact: {
        email: "alex@example.com",
        github: "",
        linkedin: "",
        website: "",
      },
    };
    const parsed = portfolioDataSchema.parse(dataWithEmptyUrls);
    expect(parsed.contact.github).toBeUndefined();
    expect(parsed.contact.linkedin).toBeUndefined();
    expect(parsed.contact.website).toBeUndefined();
  });

  it("rejects non-https URLs for security", () => {
    const httpData = {
      ...minimalValidData,
      contact: {
        email: "alex@example.com",
        github: "http://github.com/alex",
      },
    };
    expect(() => portfolioDataSchema.parse(httpData)).toThrow();

    const jsUrlData = {
      ...minimalValidData,
      contact: {
        email: "alex@example.com",
        website: "javascript:alert(1)",
      },
    };
    expect(() => portfolioDataSchema.parse(jsUrlData)).toThrow();
  });

  it("accepts valid https URLs", () => {
    const validUrlData = {
      ...minimalValidData,
      contact: {
        email: "alex@example.com",
        github: "https://github.com/alex",
        linkedin: "https://linkedin.com/in/alex",
        website: "https://alexrivera.dev",
      },
    };
    const parsed = portfolioDataSchema.parse(validUrlData);
    expect(parsed.contact.github).toBe("https://github.com/alex");
    expect(parsed.contact.website).toBe("https://alexrivera.dev");
  });

  it("accepts the approved optional fields (bioQuote, experience location, workType)", () => {
    const extendedData = {
      ...minimalValidData,
      basics: {
        ...minimalValidData.basics,
        bioQuote: "Turning ideas into high-impact software products.",
        location: "Berlin, Germany",
      },
      experience: [
        {
          company: "Tech Corp",
          role: "Lead Architect",
          startDate: "2021-01",
          endDate: "Present",
          description: "Leading frontend infrastructure and design systems.",
          location: "Berlin, Remote",
          workType: "Full-time",
        },
      ],
    };

    const parsed = portfolioDataSchema.parse(extendedData);
    expect(parsed.basics.bioQuote).toBe(
      "Turning ideas into high-impact software products."
    );
    expect(parsed.basics.location).toBe("Berlin, Germany");
    expect(parsed.experience[0].workType).toBe("Full-time");
    expect(parsed.experience[0].location).toBe("Berlin, Remote");
  });

  it("enforces array length limits", () => {
    const tooManyProjects = {
      ...minimalValidData,
      projects: Array.from({ length: 13 }, (_, i) => ({
        title: `Project ${i + 1}`,
        description: "A comprehensive project overview.",
        tags: ["React"],
      })),
    };
    expect(() => portfolioDataSchema.parse(tooManyProjects)).toThrow();

    const maxProjects = {
      ...minimalValidData,
      projects: Array.from({ length: 12 }, (_, i) => ({
        title: `Project ${i + 1}`,
        description: "A comprehensive project overview.",
        tags: ["React"],
      })),
    };
    expect(() => portfolioDataSchema.parse(maxProjects)).not.toThrow();
  });

  it("accepts valid availability string and trims whitespace", () => {
    const dataWithAvailability = {
      ...minimalValidData,
      basics: {
        ...minimalValidData.basics,
        availability: "  Available for freelance projects  ",
      },
    };
    const parsed = portfolioDataSchema.parse(dataWithAvailability);
    expect(parsed.basics.availability).toBe("Available for freelance projects");
  });

  it("rejects availability exceeding 100 characters", () => {
    const dataWithTooLongAvailability = {
      ...minimalValidData,
      basics: {
        ...minimalValidData.basics,
        availability: "A".repeat(101),
      },
    };
    expect(() => portfolioDataSchema.parse(dataWithTooLongAvailability)).toThrow();
  });

  it("accepts valid 36-char uuid .webp image filenames", () => {
    const dataWithValidImage = {
      ...minimalValidData,
      basics: {
        ...minimalValidData.basics,
        photo: "12345678-1234-1234-1234-123456789abc.webp",
      },
      projects: [
        {
          title: "Project 1",
          description: "Desc",
          tags: ["Tech"],
          image: "87654321-4321-4321-4321-cba987654321.webp",
        },
      ],
    };
    const parsed = portfolioDataSchema.parse(dataWithValidImage);
    expect(parsed.basics.photo).toBe("12345678-1234-1234-1234-123456789abc.webp");
    expect(parsed.projects[0].image).toBe("87654321-4321-4321-4321-cba987654321.webp");
  });

  it("rejects non-uuid, non-webp, or path traversal image filenames", () => {
    const invalidImages = [
      "profile.png",
      "profile.webp",
      "../hack.webp",
      "/uploads/12345678-1234-1234-1234-123456789abc.webp",
      "12345678-1234-1234-1234-123456789abc.png",
      "1234.webp",
    ];

    for (const badImg of invalidImages) {
      const dataWithBadImg = {
        ...minimalValidData,
        basics: {
          ...minimalValidData.basics,
          photo: badImg,
        },
      };
      expect(() => portfolioDataSchema.parse(dataWithBadImg)).toThrow();
    }
  });
});

describe("createPortfolioSchema", () => {
  const validData = {
    basics: {
      fullName: "Alex Rivera",
      title: "Full Stack Engineer",
      bio: "Building robust cloud-native applications and interfaces.",
    },
    contact: {
      email: "alex@example.com",
    },
    skills: [],
    experience: [],
    education: [],
    projects: [],
  };

  it("accepts valid creation input", () => {
    const input = {
      slug: "alex-rivera",
      templateId: "template-a",
      data: validData,
    };
    const parsed = createPortfolioSchema.parse(input);
    expect(parsed.slug).toBe("alex-rivera");
    expect(parsed.templateId).toBe("template-a");
  });

  it("rejects invalid templateId", () => {
    const input = {
      slug: "alex-rivera",
      templateId: "template-c",
      data: validData,
    };
    expect(() => createPortfolioSchema.parse(input)).toThrow();
  });

  it("rejects invalid slug format in create schema", () => {
    const input = {
      slug: "-alex-",
      templateId: "template-b",
      data: validData,
    };
    expect(() => createPortfolioSchema.parse(input)).toThrow();
  });
});
