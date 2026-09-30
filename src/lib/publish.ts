import type { PortfolioData } from "./schema/portfolio";

export interface PublishPayload {
  templateId: string;
  slug: string;
  data: PortfolioData;
}

export type PublishResult =
  | {
      kind: "success";
      data: {
        slug: string;
        token: string;
        publicUrl: string;
        fallbackUrl: string;
      };
    }
  | { kind: "slug_taken"; message: string }
  | { kind: "validation_error"; message: string; details?: unknown }
  | { kind: "network_error"; message: string };

/**
 * Pure function to submit portfolio payload to /api/portfolios and map responses to typed results.
 */
export async function publishPortfolio(payload: PublishPayload): Promise<PublishResult> {
  try {
    const res = await fetch("/api/portfolios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let json: Record<string, unknown> = {};
    try {
      json = (await res.json()) as Record<string, unknown>;
    } catch {
      // Non-JSON response
    }

    if (res.status === 201) {
      const slug = String(json.slug || payload.slug);
      const token = String(json.editToken || "");
      const publicUrl = String(json.url || "");
      const fallbackUrl = `/p/${slug}`;

      return {
        kind: "success",
        data: {
          slug,
          token,
          publicUrl,
          fallbackUrl,
        },
      };
    }

    if (res.status === 409) {
      return {
        kind: "slug_taken",
        message:
          typeof json.error === "string"
            ? json.error
            : `The slug "${payload.slug}" is already taken.`,
      };
    }

    if (res.status === 400 || res.status === 413) {
      return {
        kind: "validation_error",
        message: typeof json.error === "string" ? json.error : "Validation failed.",
        details: json.details,
      };
    }

    return {
      kind: "network_error",
      message:
        typeof json.error === "string"
          ? json.error
          : `Failed to publish portfolio (server error ${res.status}).`,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Network error. Unable to reach server.";
    return {
      kind: "network_error",
      message,
    };
  }
}
