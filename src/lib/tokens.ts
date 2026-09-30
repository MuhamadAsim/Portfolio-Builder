import crypto from "node:crypto";

/**
 * Generates a cryptographically secure random token (32 bytes encoded in base64url).
 * This token is shown to the user exactly once upon publishing.
 */
export function generateEditToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

/**
 * Hashes an edit token using SHA-256 for persistent database storage.
 */
export function hashEditToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Compares an incoming edit token against the stored SHA-256 hash using a
 * constant-time comparison to prevent timing attack side-channels.
 */
export function verifyEditToken(token: string, storedHash: string): boolean {
  if (!token || !storedHash) {
    return false;
  }

  const computedHash = hashEditToken(token);
  const computedBuffer = Buffer.from(computedHash, "hex");
  const storedBuffer = Buffer.from(storedHash, "hex");

  if (computedBuffer.length !== storedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(computedBuffer, storedBuffer);
}
