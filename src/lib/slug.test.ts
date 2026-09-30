import { describe, it, expect } from "vitest";
import {
  validateSlug,
  isReservedSlug,
  isValidSlugFormat,
  normalizeSlug,
  RESERVED_SLUGS,
} from "./slug";

describe("slug utilities", () => {
  it("normalizes uppercase and surrounding whitespace", () => {
    expect(normalizeSlug("  John-Doe  ")).toBe("john-doe");
  });

  describe("isValidSlugFormat", () => {
    it("accepts valid alphanumeric slugs with hyphens (3-30 chars)", () => {
      expect(isValidSlugFormat("abc")).toBe(true);
      expect(isValidSlugFormat("john-doe")).toBe(true);
      expect(isValidSlugFormat("dev-123-cool")).toBe(true);
      expect(isValidSlugFormat("a".repeat(30))).toBe(true);
    });

    it("rejects slugs that are too short or too long", () => {
      expect(isValidSlugFormat("ab")).toBe(false);
      expect(isValidSlugFormat("a".repeat(31))).toBe(false);
    });

    it("rejects slugs with leading or trailing hyphens", () => {
      expect(isValidSlugFormat("-johndoe")).toBe(false);
      expect(isValidSlugFormat("johndoe-")).toBe(false);
    });

    it("rejects slugs with uppercase letters or special characters", () => {
      expect(isValidSlugFormat("JohnDoe")).toBe(false);
      expect(isValidSlugFormat("john_doe")).toBe(false);
      expect(isValidSlugFormat("john.doe")).toBe(false);
      expect(isValidSlugFormat("john@doe")).toBe(false);
      expect(isValidSlugFormat("john doe")).toBe(false);
    });
  });

  describe("isReservedSlug", () => {
    it("identifies reserved slugs case-insensitively", () => {
      expect(isReservedSlug("api")).toBe(true);
      expect(isReservedSlug("API")).toBe(true);
      expect(isReservedSlug("www")).toBe(true);
      expect(isReservedSlug("admin")).toBe(true);
      expect(isReservedSlug("_next")).toBe(true);
      expect(isReservedSlug("uploads")).toBe(true);
    });

    it("returns false for non-reserved slugs", () => {
      expect(isReservedSlug("alex-smith")).toBe(false);
      expect(isReservedSlug("sarah-dev")).toBe(false);
    });

    it("ensures all documented reserved slugs are included", () => {
      const documentedReserved = [
        "www",
        "api",
        "app",
        "admin",
        "dashboard",
        "edit",
        "create",
        "p",
        "_next",
        "static",
        "assets",
        "uploads",
        "mail",
        "ftp",
        "ns1",
        "ns2",
        "root",
        "support",
        "help",
        "blog",
        "docs",
        "login",
        "signup",
      ];
      for (const slug of documentedReserved) {
        expect(RESERVED_SLUGS.has(slug)).toBe(true);
      }
    });
  });

  describe("validateSlug", () => {
    it("returns valid: true for eligible slugs", () => {
      expect(validateSlug("developer-jane")).toEqual({ valid: true });
    });

    it("returns descriptive error for short slugs", () => {
      const res = validateSlug("yo");
      expect(res.valid).toBe(false);
      expect(res.error).toMatch(/at least 3 characters/i);
    });

    it("returns descriptive error for long slugs", () => {
      const res = validateSlug("a".repeat(31));
      expect(res.valid).toBe(false);
      expect(res.error).toMatch(/cannot exceed 30/i);
    });

    it("returns descriptive error for reserved slugs", () => {
      const res = validateSlug("admin");
      expect(res.valid).toBe(false);
      expect(res.error).toMatch(/reserved word/i);
    });

    it("returns descriptive error for invalid characters", () => {
      const res = validateSlug("invalid_slug");
      expect(res.valid).toBe(false);
      expect(res.error).toMatch(/lowercase letters, numbers, and hyphens/i);
    });
  });
});
