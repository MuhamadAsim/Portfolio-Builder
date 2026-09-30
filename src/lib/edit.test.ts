import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchPortfolioForEdit,
  updatePortfolio,
  deletePortfolio,
} from "./edit";
import { samplePortfolioData } from "@/templates/sample-data";

describe("src/lib/edit.ts", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("fetchPortfolioForEdit", () => {
    it("returns success with portfolio data on 200", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 200,
        json: async () => ({
          slug: "my-portfolio",
          templateId: "template-b",
          data: samplePortfolioData,
        }),
      } as unknown as Response);

      const result = await fetchPortfolioForEdit("my-portfolio", "valid-token");

      expect(result.kind).toBe("success");
      if (result.kind === "success") {
        expect(result.data.slug).toBe("my-portfolio");
        expect(result.data.templateId).toBe("template-b");
        expect(result.data.data.basics.fullName).toBe(samplePortfolioData.basics.fullName);
      }
    });

    it("returns unauthorized on 401", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 401,
        json: async () => ({
          error: "Invalid edit token.",
        }),
      } as unknown as Response);

      const result = await fetchPortfolioForEdit("my-portfolio", "bad-token");

      expect(result.kind).toBe("unauthorized");
      if (result.kind === "unauthorized") {
        expect(result.message).toBe("Invalid edit token.");
      }
    });

    it("returns not_found on 404", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 404,
        json: async () => ({
          error: "Portfolio not found.",
        }),
      } as unknown as Response);

      const result = await fetchPortfolioForEdit("ghost-portfolio", "any-token");

      expect(result.kind).toBe("not_found");
      if (result.kind === "not_found") {
        expect(result.message).toBe("Portfolio not found.");
      }
    });

    it("returns network_error on 500 or throw", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network disconnect"));

      const result = await fetchPortfolioForEdit("my-portfolio", "token");

      expect(result.kind).toBe("network_error");
      if (result.kind === "network_error") {
        expect(result.message).toBe("Network disconnect");
      }
    });
  });

  describe("updatePortfolio", () => {
    const payload = {
      slug: "updated-slug",
      templateId: "template-a" as const,
      data: samplePortfolioData,
    };

    it("returns success with updated URLs on 200", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 200,
        json: async () => ({
          slug: "updated-slug",
          url: "http://updated-slug.localhost:3000",
        }),
      } as unknown as Response);

      const result = await updatePortfolio("old-slug", payload, "token-123");

      expect(result.kind).toBe("success");
      if (result.kind === "success") {
        expect(result.data.slug).toBe("updated-slug");
        expect(result.data.publicUrl).toBe("http://updated-slug.localhost:3000");
        expect(result.data.fallbackUrl).toBe("/p/updated-slug");
      }
    });

    it("returns unauthorized on 401", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 401,
        json: async () => ({
          error: "Invalid edit token.",
        }),
      } as unknown as Response);

      const result = await updatePortfolio("slug", payload, "wrong-token");

      expect(result.kind).toBe("unauthorized");
    });

    it("returns slug_taken on 409", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 409,
        json: async () => ({
          error: "Slug already exists.",
        }),
      } as unknown as Response);

      const result = await updatePortfolio("slug", payload, "token");

      expect(result.kind).toBe("slug_taken");
      if (result.kind === "slug_taken") {
        expect(result.message).toBe("Slug already exists.");
      }
    });

    it("returns validation_error on 400", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 400,
        json: async () => ({
          error: "Validation failed",
          details: { slug: ["Invalid slug"] },
        }),
      } as unknown as Response);

      const result = await updatePortfolio("slug", payload, "token");

      expect(result.kind).toBe("validation_error");
      if (result.kind === "validation_error") {
        expect(result.details).toBeDefined();
      }
    });

    it("returns network_error on fetch rejection", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Timeout"));

      const result = await updatePortfolio("slug", payload, "token");

      expect(result.kind).toBe("network_error");
      if (result.kind === "network_error") {
        expect(result.message).toBe("Timeout");
      }
    });
  });

  describe("deletePortfolio", () => {
    it("returns success on 200", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 200,
        json: async () => ({
          message: "Portfolio deleted successfully.",
        }),
      } as unknown as Response);

      const result = await deletePortfolio("slug", "token");

      expect(result.kind).toBe("success");
      if (result.kind === "success") {
        expect(result.message).toBe("Portfolio deleted successfully.");
      }
    });

    it("returns unauthorized on 401", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 401,
        json: async () => ({
          error: "Invalid token.",
        }),
      } as unknown as Response);

      const result = await deletePortfolio("slug", "token");

      expect(result.kind).toBe("unauthorized");
    });

    it("returns not_found on 404", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 404,
        json: async () => ({
          error: "Portfolio not found.",
        }),
      } as unknown as Response);

      const result = await deletePortfolio("not-found-slug", "token");

      expect(result.kind).toBe("not_found");
    });

    it("returns network_error on failure", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network failed"));

      const result = await deletePortfolio("slug", "token");

      expect(result.kind).toBe("network_error");
    });
  });
});
