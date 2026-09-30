import { describe, it, expect } from "vitest";
import { generateEditToken, hashEditToken, verifyEditToken } from "./tokens";

describe("edit tokens", () => {
  it("generates a high-entropy base64url token of appropriate length", () => {
    const token1 = generateEditToken();
    const token2 = generateEditToken();

    expect(token1).toBeTruthy();
    expect(typeof token1).toBe("string");
    // 32 bytes in base64url is 43 characters
    expect(token1.length).toBeGreaterThanOrEqual(40);
    expect(token1).not.toBe(token2);
    // Base64url should only contain a-z, A-Z, 0-9, -, _
    expect(/^[A-Za-z0-9_-]+$/.test(token1)).toBe(true);
  });

  it("consistently computes SHA-256 hashes", () => {
    const token = "sample-edit-token-12345";
    const hash1 = hashEditToken(token);
    const hash2 = hashEditToken(token);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // 64 hex characters for SHA-256
  });

  it("verifies matching token and hash using constant-time check", () => {
    const token = generateEditToken();
    const hash = hashEditToken(token);

    expect(verifyEditToken(token, hash)).toBe(true);
  });

  it("rejects invalid or tampered tokens", () => {
    const token = generateEditToken();
    const hash = hashEditToken(token);

    expect(verifyEditToken("wrong-token", hash)).toBe(false);
    expect(verifyEditToken(token + "x", hash)).toBe(false);
    expect(verifyEditToken("", hash)).toBe(false);
    expect(verifyEditToken(token, "")).toBe(false);
    expect(verifyEditToken(token, "invalid-hex-hash")).toBe(false);
  });
});
