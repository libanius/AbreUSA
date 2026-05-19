const DRAFT_KEY = "abreusa_onboarding_draft";
const DRAFT_VERSION = 1;

// Mirrors the serialisable subset of GuidedIntakeShell state.
// File objects (documentFiles) are excluded — they cannot be serialised.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OnboardingDraft = Record<string, any> & {
  version: number;
  savedAt: string;
  activeStep: string;
  hadDocumentFiles: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function saveDraft(draft: Record<string, any>): void {
  try {
    const toSave = {
      ...draft,
      version: DRAFT_VERSION,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
  } catch {
    // localStorage unavailable or quota exceeded — silently skip
  }
}

export function loadDraft(): OnboardingDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OnboardingDraft;
    if (parsed.version !== DRAFT_VERSION) {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}
