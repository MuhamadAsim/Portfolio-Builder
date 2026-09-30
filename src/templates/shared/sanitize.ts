/**
 * Sanitizes an external URL to only allow https:// or mailto: schemes.
 * Rejects javascript:, data:, and relative script injections.
 */
export function sanitizeHref(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (trimmed.startsWith("https://") || trimmed.startsWith("mailto:")) {
    return trimmed;
  }
  return undefined;
}
