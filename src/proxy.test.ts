import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

describe("Subdomain Proxy (src/proxy.ts)", () => {
  const originalEnv = process.env.ROOT_DOMAIN;

  beforeEach(() => {
    process.env.ROOT_DOMAIN = "localhost:3000";
  });

  afterEach(() => {
    process.env.ROOT_DOMAIN = originalEnv;
  });

  it("rewrites root path on a valid subdomain host to /_sites/<slug>", () => {
    const req = new NextRequest("http://localhost:3000/", {
      headers: { host: "john.localhost:3000" },
    });

    const res = proxy(req);
    expect(res.headers.get("x-middleware-rewrite")).toBe("http://localhost:3000/_sites/john");
  });

  it("does NOT rewrite requests to /api even on a subdomain host", () => {
    const req = new NextRequest("http://localhost:3000/api/portfolios", {
      headers: { host: "john.localhost:3000" },
    });

    const res = proxy(req);
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("does NOT rewrite requests to /uploads even on a subdomain host", () => {
    const req = new NextRequest("http://localhost:3000/uploads/tmp/test.webp", {
      headers: { host: "john.localhost:3000" },
    });

    const res = proxy(req);
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("does NOT rewrite requests to /_next even on a subdomain host", () => {
    const req = new NextRequest("http://localhost:3000/_next/static/test.js", {
      headers: { host: "john.localhost:3000" },
    });

    const res = proxy(req);
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("does NOT rewrite requests to static files with extensions", () => {
    const req = new NextRequest("http://localhost:3000/favicon.ico", {
      headers: { host: "john.localhost:3000" },
    });

    const res = proxy(req);
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("returns 404 with security headers on a non-root path on a subdomain host (e.g. /foo)", () => {
    const req = new NextRequest("http://localhost:3000/foo", {
      headers: { host: "john.localhost:3000" },
    });

    const res = proxy(req);
    expect(res.status).toBe(404);
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
    expect(res.headers.get("cache-control")).toBe("no-cache");
  });

  it("does NOT rewrite any requests on the root domain host", () => {
    const req = new NextRequest("http://localhost:3000/", {
      headers: { host: "localhost:3000" },
    });

    const res = proxy(req);
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("does NOT rewrite reserved subdomains like www or api", () => {
    const req = new NextRequest("http://localhost:3000/", {
      headers: { host: "www.localhost:3000" },
    });

    const res = proxy(req);
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });
});
