import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { publishPortfolio } from "./publish";
import { samplePortfolioData } from "@/templates/sample-data";

describe("publishPortfolio (src/lib/publish.ts)", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  const dummyPayload = {
    templateId: "template-a",
    slug: "alex-test",
    data: samplePortfolioData,
  };

  it("maps 201 response to kind: 'success' with token and URLs", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 201,
      json: async () => ({
        slug: "alex-test",
        editToken: "secret-token-xyz",
        url: "http://alex-test.localhost:3000",
      }),
    } as unknown as Response);

    const result = await publishPortfolio(dummyPayload);

    expect(result.kind).toBe("success");
    if (result.kind === "success") {
      expect(result.data.slug).toBe("alex-test");
      expect(result.data.token).toBe("secret-token-xyz");
      expect(result.data.publicUrl).toBe("http://alex-test.localhost:3000");
      expect(result.data.fallbackUrl).toBe("/p/alex-test");
    }
  });

  it("maps 409 response to kind: 'slug_taken'", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 409,
      json: async () => ({
        error: "The slug alex-test was taken just now.",
      }),
    } as unknown as Response);

    const result = await publishPortfolio(dummyPayload);

    expect(result.kind).toBe("slug_taken");
    if (result.kind === "slug_taken") {
      expect(result.message).toBe("The slug alex-test was taken just now.");
    }
  });

  it("maps 400 validation error to kind: 'validation_error'", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 400,
      json: async () => ({
        error: "Validation failed",
        details: { basics: { fullName: ["Required"] } },
      }),
    } as unknown as Response);

    const result = await publishPortfolio(dummyPayload);

    expect(result.kind).toBe("validation_error");
    if (result.kind === "validation_error") {
      expect(result.message).toBe("Validation failed");
      expect(result.details).toBeDefined();
    }
  });

  it("maps 413 payload too large to kind: 'validation_error'", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 413,
      json: async () => ({
        error: "Payload exceeds 200 KB limit",
      }),
    } as unknown as Response);

    const result = await publishPortfolio(dummyPayload);

    expect(result.kind).toBe("validation_error");
    if (result.kind === "validation_error") {
      expect(result.message).toBe("Payload exceeds 200 KB limit");
    }
  });

  it("maps 500 server error to kind: 'network_error'", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 500,
      json: async () => ({
        error: "Internal server error occurred",
      }),
    } as unknown as Response);

    const result = await publishPortfolio(dummyPayload);

    expect(result.kind).toBe("network_error");
    if (result.kind === "network_error") {
      expect(result.message).toBe("Internal server error occurred");
    }
  });

  it("maps fetch network throw to kind: 'network_error'", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Connection refused"));

    const result = await publishPortfolio(dummyPayload);

    expect(result.kind).toBe("network_error");
    if (result.kind === "network_error") {
      expect(result.message).toBe("Connection refused");
    }
  });
});
