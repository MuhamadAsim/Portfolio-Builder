import { describe, it, expect } from "vitest";
import {
  extractDataFromResumeText,
  validatePdfBuffer,
} from "./resumeParser";

describe("resumeParser", () => {
  describe("validatePdfBuffer", () => {
    it("throws if buffer is too short", () => {
      expect(() => validatePdfBuffer(Buffer.from("123"))).toThrow("too small");
    });

    it("throws if buffer does not start with %PDF-", () => {
      expect(() => validatePdfBuffer(Buffer.from("INVALID_CONTENT"))).toThrow("valid PDF document");
    });

    it("accepts buffer starting with %PDF-", () => {
      expect(() => validatePdfBuffer(Buffer.from("%PDF-1.4\n..."))).not.toThrow();
    });
  });

  describe("extractDataFromResumeText", () => {
    it("extracts basic information from raw resume text", () => {
      const sampleResume = `
ALEX RIVERA
Full Stack Developer
San Francisco, CA | alex.rivera@example.com | (555) 234-5678
github.com/alexrivera | linkedin.com/in/alexrivera-dev | twitter.com/alexrivera

PROFESSIONAL SUMMARY
Passionate engineer with extensive background building modern web apps. Dedicated to clean code, great UX, and scalable backend services.

TECHNICAL SKILLS
TypeScript, React, Next.js, Node.js, PostgreSQL, Tailwind CSS, Docker, Git

EXPERIENCE
Acme Corp — Senior Developer
2021 - Present
`;

      const result = extractDataFromResumeText(sampleResume);

      expect(result.fullName).toBe("Alex Rivera");
      expect(result.title).toBe("Full Stack Developer");
      expect(result.email).toBe("alex.rivera@example.com");
      expect(result.phone).toBe("(555) 234-5678");
      expect(result.location).toBe("San Francisco, CA");
      expect(result.github).toBe("https://github.com/alexrivera");
      expect(result.linkedin).toBe("https://linkedin.com/in/alexrivera-dev");
      expect(result.twitter).toBe("https://twitter.com/alexrivera");
      expect(result.bio).toContain("Passionate engineer with extensive background");

      const skillNames = result.skills.map((s) => s.name);
      expect(skillNames).toContain("TypeScript");
      expect(skillNames).toContain("React");
      expect(skillNames).toContain("Next.js");
      expect(skillNames).toContain("Node.js");
      expect(skillNames).toContain("PostgreSQL");
      expect(skillNames).toContain("Docker");
    });

    it("handles resumes with uppercase titles and alternative spacing", () => {
      const sample = `
JANE DOE
Software Engineer
jane@test.org
linkedin.com/in/janedoe

SKILLS
Python, Docker, AWS, Redis, GraphQL
`;
      const result = extractDataFromResumeText(sample);
      expect(result.fullName).toBe("Jane Doe");
      expect(result.title).toBe("Software Engineer");
      expect(result.email).toBe("jane@test.org");
      expect(result.linkedin).toBe("https://linkedin.com/in/janedoe");
      const skillNames = result.skills.map((s) => s.name);
      expect(skillNames).toContain("Python");
      expect(skillNames).toContain("Docker");
      expect(skillNames).toContain("AWS");
    });
  });
});
