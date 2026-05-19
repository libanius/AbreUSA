import { describe, it, expect, beforeEach } from "vitest";

// Mock localStorage for Node environment
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
};
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock, writable: true });

import { saveDraft, loadDraft, clearDraft } from "@/lib/draft-storage";

describe("draft-storage", () => {
  beforeEach(() => localStorageMock.clear());

  it("loadDraft returns null when nothing saved", () => {
    expect(loadDraft()).toBeNull();
  });

  it("saveDraft persists and loadDraft retrieves", () => {
    saveDraft({ activeStep: "llc_name", someField: "value" });
    const draft = loadDraft();
    expect(draft).not.toBeNull();
    expect(draft?.activeStep).toBe("llc_name");
    expect((draft as Record<string, unknown>).someField).toBe("value");
  });

  it("loadDraft includes savedAt timestamp", () => {
    saveDraft({ activeStep: "service" });
    const draft = loadDraft();
    expect(draft?.savedAt).toBeDefined();
    expect(new Date(draft!.savedAt).getTime()).toBeGreaterThan(0);
  });

  it("loadDraft includes version field", () => {
    saveDraft({ activeStep: "service" });
    const draft = loadDraft();
    expect(typeof draft?.version).toBe("number");
  });

  it("loadDraft returns null on version mismatch", () => {
    // Manually save with wrong version
    store["abreusa_onboarding_draft"] = JSON.stringify({
      version: 999,
      savedAt: new Date().toISOString(),
      activeStep: "service",
    });
    expect(loadDraft()).toBeNull();
  });

  it("loadDraft returns null on corrupt JSON", () => {
    store["abreusa_onboarding_draft"] = "not-valid-json{{{";
    expect(loadDraft()).toBeNull();
  });

  it("clearDraft removes saved draft", () => {
    saveDraft({ activeStep: "llc_name" });
    expect(loadDraft()).not.toBeNull();
    clearDraft();
    expect(loadDraft()).toBeNull();
  });

  it("saveDraft overwrites previous draft", () => {
    saveDraft({ activeStep: "service" });
    saveDraft({ activeStep: "llc_name" });
    expect(loadDraft()?.activeStep).toBe("llc_name");
  });
});
