import type { PortfolioData } from "./schema/portfolio";

export type FetchEditResult =
  | {
      kind: "success";
      data: {
        slug: string;
        templateId: "template-a" | "template-b";
        data: PortfolioData;
      };
    }
  | { kind: "unauthorized"; message: string }
  | { kind: "not_found"; message: string }
  | { kind: "network_error"; message: string };

export type UpdatePortfolioResult =
  | {
      kind: "success";
      data: {
        slug: string;
        publicUrl: string;
        fallbackUrl: string;
      };
    }
  | { kind: "unauthorized"; message: string }
  | { kind: "slug_taken"; message: string }
  | { kind: "validation_error"; message: string; details?: unknown }
  | { kind: "network_error"; message: string };

export type DeletePortfolioResult =
  | { kind: "success"; message: string }
  | { kind: "unauthorized"; message: string }
  | { kind: "not_found"; message: string }
  | { kind: "network_error"; message: string };

export interface UpdatePayload {
  templateId: "template-a" | "template-b";
  slug: string;
  data: PortfolioData;
}

/**
 * Fetches portfolio content for editing using the secret edit token.
 */
export async function fetchPortfolioForEdit(
  slug: string,
  token: string
): Promise<FetchEditResult> {
  try {
    const res = await fetch(`/api/portfolios/${encodeURIComponent(slug)}`, {
      method: "GET",
      headers: {
        "x-edit-token": token,
      },
    });

    let json: Record<string, unknown> = {};
    try {
      json = (await res.json()) as Record<string, unknown>;
    } catch {
      // Non-JSON response
    }

    if (res.status === 200) {
      return {
        kind: "success",
        data: {
          slug: String(json.slug),
          templateId: json.templateId as "template-a" | "template-b",
          data: json.data as PortfolioData,
        },
      };
    }

    if (res.status === 401) {
      return {
        kind: "unauthorized",
        message:
          typeof json.error === "string"
            ? json.error
            : "Invalid or missing edit token.",
      };
    }

    if (res.status === 404) {
      return {
        kind: "not_found",
        message:
          typeof json.error === "string"
            ? json.error
            : `Portfolio "${slug}" was not found.`,
      };
    }

    return {
      kind: "network_error",
      message:
        typeof json.error === "string"
          ? json.error
          : `Server returned error (${res.status}).`,
    };
  } catch (err: unknown) {
    return {
      kind: "network_error",
      message: err instanceof Error ? err.message : "Unable to reach server.",
    };
  }
}

/**
 * Updates an existing portfolio with modified content, template, or slug.
 */
export async function updatePortfolio(
  currentSlug: string,
  payload: UpdatePayload,
  token: string
): Promise<UpdatePortfolioResult> {
  try {
    const res = await fetch(`/api/portfolios/${encodeURIComponent(currentSlug)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-edit-token": token,
      },
      body: JSON.stringify(payload),
    });

    let json: Record<string, unknown> = {};
    try {
      json = (await res.json()) as Record<string, unknown>;
    } catch {
      // Non-JSON response
    }

    if (res.status === 200) {
      const updatedSlug = String(json.slug || payload.slug);
      const publicUrl = String(json.url || "");
      const fallbackUrl = `/p/${updatedSlug}`;

      return {
        kind: "success",
        data: {
          slug: updatedSlug,
          publicUrl,
          fallbackUrl,
        },
      };
    }

    if (res.status === 401) {
      return {
        kind: "unauthorized",
        message:
          typeof json.error === "string"
            ? json.error
            : "Invalid or missing edit token.",
      };
    }

    if (res.status === 409) {
      return {
        kind: "slug_taken",
        message:
          typeof json.error === "string"
            ? json.error
            : `The slug "${payload.slug}" is already in use by another portfolio.`,
      };
    }

    if (res.status === 400 || res.status === 413) {
      return {
        kind: "validation_error",
        message:
          typeof json.error === "string"
            ? json.error
            : "Validation failed on update payload.",
        details: json.details,
      };
    }

    return {
      kind: "network_error",
      message:
        typeof json.error === "string"
          ? json.error
          : `Server error (${res.status}).`,
    };
  } catch (err: unknown) {
    return {
      kind: "network_error",
      message: err instanceof Error ? err.message : "Unable to reach server.",
    };
  }
}

/**
 * Permanently deletes a portfolio and its uploaded images.
 */
export async function deletePortfolio(
  slug: string,
  token: string
): Promise<DeletePortfolioResult> {
  try {
    const res = await fetch(`/api/portfolios/${encodeURIComponent(slug)}`, {
      method: "DELETE",
      headers: {
        "x-edit-token": token,
      },
    });

    let json: Record<string, unknown> = {};
    try {
      json = (await res.json()) as Record<string, unknown>;
    } catch {
      // Non-JSON response
    }

    if (res.status === 200) {
      return {
        kind: "success",
        message:
          typeof json.message === "string"
            ? json.message
            : "Portfolio deleted successfully.",
      };
    }

    if (res.status === 401) {
      return {
        kind: "unauthorized",
        message:
          typeof json.error === "string"
            ? json.error
            : "Invalid or missing edit token.",
      };
    }

    if (res.status === 404) {
      return {
        kind: "not_found",
        message:
          typeof json.error === "string"
            ? json.error
            : `Portfolio "${slug}" was not found.`,
      };
    }

    return {
      kind: "network_error",
      message:
        typeof json.error === "string"
          ? json.error
          : `Server error (${res.status}).`,
    };
  } catch (err: unknown) {
    return {
      kind: "network_error",
      message: err instanceof Error ? err.message : "Unable to reach server.",
    };
  }
}
