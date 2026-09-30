import { describe, it, expect, beforeEach } from "vitest";
import {
  loadDraft,
  saveDraft,
  clearDraft,
  DRAFT_STORAGE_KEY,
  draftFormSchema,
  type DraftForm,
} from "./draft";

class MockStorage implements Storage {
  private store: Record<string, string> = {};
  get length() {
    return Object.keys(this.store).length;
  }
  key(index: number) {
    return Object.keys(this.store)[index] ?? null;
  }
  getItem(key: string) {
    return this.store[key] ?? null;
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

const mockStorage = new MockStorage();

if (typeof window === "undefined") {
  (globalThis as unknown as { window: { sessionStorage: Storage }; sessionStorage: Storage }).window = {
    sessionStorage: mockStorage,
  };
  (globalThis as unknown as { sessionStorage: Storage }).sessionStorage = mockStorage;
}

describe("draftFormSchema & draft storage", () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it("validates valid draft shape", () => {
    const validDraft: DraftForm = {
      templateId: "template-b",
      step: 3,
      data: {
        basics: { fullName: "Sam Vance" },
      },
    };

    const parsed = draftFormSchema.parse(validDraft);
    expect(parsed.templateId).toBe("template-b");
    expect(parsed.step).toBe(3);
  });

  it("rejects invalid step number or template ID in draft schema", () => {
    const invalidTemplate = {
      templateId: "template-z",
      step: 1,
      data: {},
    };
    expect(() => draftFormSchema.parse(invalidTemplate)).toThrow();

    const invalidStep = {
      templateId: "template-a",
      step: 99,
      data: {},
    };
    expect(() => draftFormSchema.parse(invalidStep)).toThrow();
  });

  it("saves and loads draft from sessionStorage", () => {
    const draft: DraftForm = {
      templateId: "template-a",
      step: 2,
      data: {
        basics: { fullName: "Morgan Lee" },
      },
    };

    saveDraft(draft);

    const loaded = loadDraft();
    expect(loaded).not.toBeNull();
    expect(loaded?.templateId).toBe("template-a");
    expect(loaded?.step).toBe(2);
    expect(loaded?.data).toEqual({ basics: { fullName: "Morgan Lee" } });
  });

  it("discards corrupt JSON and removes storage key", () => {
    mockStorage.setItem(DRAFT_STORAGE_KEY, "{corrupt-json");

    const loaded = loadDraft();
    expect(loaded).toBeNull();
    expect(mockStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });

  it("discards schema-violating draft and removes storage key", () => {
    mockStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({ templateId: "unknown-tpl", step: -1 })
    );

    const loaded = loadDraft();
    expect(loaded).toBeNull();
    expect(mockStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });

  it("clears draft on demand", () => {
    saveDraft({
      templateId: "template-a",
      step: 1,
      data: {},
    });
    expect(mockStorage.getItem(DRAFT_STORAGE_KEY)).not.toBeNull();

    clearDraft();
    expect(mockStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });
});
