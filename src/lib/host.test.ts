import { describe, it, expect } from "vitest";
import { parseSubdomain, getPublicUrl } from "./host";

describe("Subdomain Host Parsing (parseSubdomain)", () => {
  const rootWithPort = "localhost:3000";
  const rootWithoutPort = "example.com";

  it("parses valid subdomain with port", () => {
    const result = parseSubdomain("john.localhost:3000", rootWithPort);
    expect(result).toEqual({ isSubdomain: true, slug: "john" });
  });

  it("handles case insensitivity", () => {
    const result = parseSubdomain("JOHN.Localhost:3000", rootWithPort);
    expect(result).toEqual({ isSubdomain: true, slug: "john" });
  });

  it("handles trailing dot in host", () => {
    const resultWithPort = parseSubdomain("john.localhost.:3000", rootWithPort);
    expect(resultWithPort).toEqual({ isSubdomain: true, slug: "john" });

    const resultWithoutPort = parseSubdomain("john.example.com.", rootWithoutPort);
    expect(resultWithoutPort).toEqual({ isSubdomain: true, slug: "john" });
  });

  it("returns null for bare root domain", () => {
    expect(parseSubdomain("localhost:3000", rootWithPort)).toEqual({
      isSubdomain: false,
      slug: null,
    });
    expect(parseSubdomain("example.com", rootWithoutPort)).toEqual({
      isSubdomain: false,
      slug: null,
    });
    expect(parseSubdomain("example.com:8080", rootWithoutPort)).toEqual({
      isSubdomain: false,
      slug: null,
    });
  });

  it("returns null for reserved prefixes like www, api, admin", () => {
    expect(parseSubdomain("www.localhost:3000", rootWithPort)).toEqual({
      isSubdomain: false,
      slug: null,
    });
    expect(parseSubdomain("api.localhost:3000", rootWithPort)).toEqual({
      isSubdomain: false,
      slug: null,
    });
    expect(parseSubdomain("admin.localhost:3000", rootWithPort)).toEqual({
      isSubdomain: false,
      slug: null,
    });
  });

  it("returns null for multi-level subdomains", () => {
    expect(parseSubdomain("a.b.localhost:3000", rootWithPort)).toEqual({
      isSubdomain: false,
      slug: null,
    });
  });

  it("returns null for attacker domains attempting suffix spoofing", () => {
    expect(parseSubdomain("evil.localhost.attacker.com:3000", rootWithPort)).toEqual({
      isSubdomain: false,
      slug: null,
    });
    expect(parseSubdomain("notexample.com", rootWithoutPort)).toEqual({
      isSubdomain: false,
      slug: null,
    });
  });

  it("returns null for empty Host or whitespace", () => {
    expect(parseSubdomain("", rootWithPort)).toEqual({
      isSubdomain: false,
      slug: null,
    });
    expect(parseSubdomain("   ", rootWithPort)).toEqual({
      isSubdomain: false,
      slug: null,
    });
  });

  it("returns null for IP hosts (IPv4 and IPv6)", () => {
    expect(parseSubdomain("127.0.0.1:3000", rootWithPort)).toEqual({
      isSubdomain: false,
      slug: null,
    });
    expect(parseSubdomain("192.168.1.1", rootWithoutPort)).toEqual({
      isSubdomain: false,
      slug: null,
    });
    expect(parseSubdomain("[::1]:3000", rootWithPort)).toEqual({
      isSubdomain: false,
      slug: null,
    });
  });

  it("parses valid subdomain when ROOT_DOMAIN has no port", () => {
    const result1 = parseSubdomain("alice.example.com", rootWithoutPort);
    expect(result1).toEqual({ isSubdomain: true, slug: "alice" });

    const result2 = parseSubdomain("alice.example.com:8080", rootWithoutPort);
    expect(result2).toEqual({ isSubdomain: true, slug: "alice" });
  });

  it("getPublicUrl generates correct URL using env protocol or defaults", () => {
    const url = getPublicUrl("alex");
    expect(url).toBe("http://alex.localhost:3000");

    process.env.PUBLIC_PROTOCOL = "https";
    process.env.ROOT_DOMAIN = "portfolio.dev";
    expect(getPublicUrl("alex")).toBe("https://alex.portfolio.dev");

    delete process.env.PUBLIC_PROTOCOL;
    delete process.env.ROOT_DOMAIN;
  });
});
