import { SLUG_REGEX } from "./schema/portfolio";

export const RESERVED_SLUGS = new Set<string>([
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
  "portfolio",
  "portfolios",
  "settings",
  "test",
  "demo",
]);

export function normalizeSlug(input: string): string {
  return input.trim().toLowerCase();
}

export function isValidSlugFormat(slug: string): boolean {
  return SLUG_REGEX.test(slug);
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(normalizeSlug(slug));
}

export interface SlugValidationResult {
  valid: boolean;
  error?: string;
}

export function validateSlug(rawSlug: string): SlugValidationResult {
  const slug = normalizeSlug(rawSlug);

  if (slug.length < 3) {
    return { valid: false, error: "Slug must be at least 3 characters long." };
  }

  if (slug.length > 30) {
    return { valid: false, error: "Slug cannot exceed 30 characters." };
  }

  if (!isValidSlugFormat(slug)) {
    return {
      valid: false,
      error:
        "Slug must consist of lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.",
    };
  }

  if (isReservedSlug(slug)) {
    return {
      valid: false,
      error: `"${slug}" is a reserved word and cannot be used.`,
    };
  }

  return { valid: true };
}
