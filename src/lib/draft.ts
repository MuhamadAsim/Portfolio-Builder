import { z } from "zod";

export const DRAFT_STORAGE_KEY = "pb_form_draft_v1";

export const draftFormSchema = z.object({
  templateId: z.enum(["template-a", "template-b"]).default("template-a"),
  step: z.number().int().min(1).max(6).default(1),
  data: z.record(z.string(), z.unknown()),
  savedAt: z.number().optional(),
});

export type DraftForm = z.infer<typeof draftFormSchema>;

/**
 * Loads and validates a draft from sessionStorage.
 * Corrupt or outdated drafts are discarded and removed.
 */
export function loadDraft(): DraftForm | null {
  if (typeof window === "undefined" || !window.sessionStorage) {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;

    const parsedJson = JSON.parse(raw);
    const validated = draftFormSchema.safeParse(parsedJson);

    if (validated.success) {
      return validated.data;
    }

    // Discard invalid / outdated draft
    window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    return null;
  } catch {
    try {
      window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignore sessionStorage access errors
    }
    return null;
  }
}

/**
 * Persists a draft to sessionStorage.
 */
export function saveDraft(draft: DraftForm): void {
  if (typeof window === "undefined" || !window.sessionStorage) {
    return;
  }

  try {
    const payload: DraftForm = {
      ...draft,
      savedAt: Date.now(),
    };
    window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota or private browsing storage errors
  }
}

/**
 * Clears the persisted draft from sessionStorage.
 */
export function clearDraft(): void {
  if (typeof window === "undefined" || !window.sessionStorage) {
    return;
  }

  try {
    window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
