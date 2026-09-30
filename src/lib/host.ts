import { validateSlug } from "./slug";

export interface SubdomainResult {
  isSubdomain: boolean;
  slug: string | null;
}

/**
 * Pure host-parsing function to determine if an incoming Host header represents a portfolio subdomain.
 * Rules:
 * - Empty Host, IP addresses (IPv4/IPv6), and trailing dots are handled safely.
 * - Compares against ROOT_DOMAIN (including port if ROOT_DOMAIN specifies one).
 * - Multi-level subdomains (e.g. a.b.root) are rejected.
 * - Reserved words (www, api, admin, etc.) and invalid slug syntax are rejected.
 */
export function parseSubdomain(host: string, rootDomain: string): SubdomainResult {
  if (!host || typeof host !== "string") {
    return { isSubdomain: false, slug: null };
  }

  let normalizedHost = host.toLowerCase().trim();
  const normalizedRoot = rootDomain.toLowerCase().trim().replace(/\.+$/, "");

  if (!normalizedHost || !normalizedRoot) {
    return { isSubdomain: false, slug: null };
  }

  // Remove trailing dot(s) in hostname portion (e.g. "john.localhost.:3000" or "example.com.")
  const colonIdx = normalizedHost.lastIndexOf(":");
  if (colonIdx !== -1 && !normalizedHost.includes("]")) {
    const hostnamePart = normalizedHost.slice(0, colonIdx).replace(/\.+$/, "");
    const portPart = normalizedHost.slice(colonIdx);
    normalizedHost = `${hostnamePart}${portPart}`;
  } else {
    normalizedHost = normalizedHost.replace(/\.+$/, "");
  }

  // Reject IPv4 and IPv6 hosts
  const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?$/;
  if (ipv4Regex.test(normalizedHost) || normalizedHost.startsWith("[") || (normalizedHost.includes(":") && normalizedHost.split(":").length > 2)) {
    return { isSubdomain: false, slug: null };
  }

  let candidate: string | null = null;

  if (normalizedRoot.includes(":")) {
    // ROOT_DOMAIN includes a port (e.g. "localhost:3000")
    if (normalizedHost === normalizedRoot) {
      return { isSubdomain: false, slug: null };
    }
    const suffix = `.${normalizedRoot}`;
    if (normalizedHost.endsWith(suffix)) {
      candidate = normalizedHost.slice(0, -suffix.length);
    } else {
      return { isSubdomain: false, slug: null };
    }
  } else {
    // ROOT_DOMAIN has no port (e.g. "example.com")
    // Host may optionally include a port (e.g. "john.example.com:8080" or "john.example.com")
    const [hostWithoutPort] = normalizedHost.split(":");
    if (hostWithoutPort === normalizedRoot) {
      return { isSubdomain: false, slug: null };
    }
    const suffix = `.${normalizedRoot}`;
    if (hostWithoutPort.endsWith(suffix)) {
      candidate = hostWithoutPort.slice(0, -suffix.length);
    } else {
      return { isSubdomain: false, slug: null };
    }
  }

  if (!candidate) {
    return { isSubdomain: false, slug: null };
  }

  // Reject multi-level subdomains (e.g. "a.b")
  if (candidate.includes(".")) {
    return { isSubdomain: false, slug: null };
  }

  // Validate slug syntax, length, and reserved words (e.g. "www", "api", "admin")
  const validation = validateSlug(candidate);
  if (!validation.valid) {
    return { isSubdomain: false, slug: null };
  }

  return { isSubdomain: true, slug: candidate };
}

/**
 * Helper to build the canonical public URL for a given portfolio slug.
 * Reads PUBLIC_PROTOCOL (or defaults to http in dev, https in prod) and ROOT_DOMAIN.
 */
export function getPublicUrl(slug: string): string {
  const protocol =
    process.env.PUBLIC_PROTOCOL ||
    (process.env.NODE_ENV === "production" ? "https" : "http");
  const rootDomain = process.env.ROOT_DOMAIN || "localhost:3000";
  return `${protocol}://${slug}.${rootDomain}`;
}
