/**
 * Sprint 2 — TC-S211 Reading Auto-Save / localStorage Isolation Tests
 * Tests the draft key naming and isolation logic
 */

// Simulate the Reading page draft key logic
function getDraftKey(passageId: string): string {
  return `reading-draft-${passageId}`;
}

function saveDraft(passageId: string, answers: Record<string, string>, storage: Map<string, string>): void {
  storage.set(getDraftKey(passageId), JSON.stringify(answers));
}

function loadDraft(passageId: string, storage: Map<string, string>): Record<string, string> | null {
  const raw = storage.get(getDraftKey(passageId));
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function clearDraft(passageId: string, storage: Map<string, string>): void {
  storage.delete(getDraftKey(passageId));
}

describe("Reading Auto-Save — localStorage logic (TC-S211)", () => {
  let storage: Map<string, string>;

  beforeEach(() => {
    storage = new Map();
  });

  // TC-S211-01: draft is saved with correct key
  test("TC-S211-01: draft saved with key reading-draft-{id}", () => {
    saveDraft("coffee-passage", { q1: "TRUE", q2: "FALSE" }, storage);
    expect(storage.has("reading-draft-coffee-passage")).toBe(true);
  });

  // TC-S211-02: draft is restored on mount
  test("TC-S211-02: draft restored correctly on page load", () => {
    const answers = { q1: "TRUE", q2: "FALSE", q3: "NOT GIVEN" };
    saveDraft("coffee-passage", answers, storage);
    const restored = loadDraft("coffee-passage", storage);
    expect(restored).toEqual(answers);
  });

  // TC-S211-03: draft cleared after submit
  test("TC-S211-03: localStorage cleared after submit", () => {
    saveDraft("coffee-passage", { q1: "TRUE" }, storage);
    expect(loadDraft("coffee-passage", storage)).not.toBeNull();

    clearDraft("coffee-passage", storage); // simulate handleSubmit
    expect(loadDraft("coffee-passage", storage)).toBeNull();
  });

  // TC-S211-05: draft isolation — different passage IDs use different keys
  test("TC-S211-05: draft for passage A does not affect passage B", () => {
    saveDraft("passage-a", { q1: "TRUE" }, storage);
    const draftB = loadDraft("passage-b", storage);
    expect(draftB).toBeNull();
  });

  test("TC-S211-05b: saving passage B does not overwrite passage A", () => {
    saveDraft("passage-a", { q1: "TRUE" }, storage);
    saveDraft("passage-b", { q1: "FALSE" }, storage);

    const draftA = loadDraft("passage-a", storage);
    const draftB = loadDraft("passage-b", storage);

    expect(draftA?.q1).toBe("TRUE");
    expect(draftB?.q1).toBe("FALSE");
  });

  test("returns null when draft is empty or non-existent", () => {
    expect(loadDraft("nonexistent", storage)).toBeNull();
  });

  test("handles malformed JSON in storage gracefully", () => {
    storage.set("reading-draft-bad", "{not valid json");
    const result = loadDraft("bad", storage);
    expect(result).toBeNull();
  });
});

describe("Reading Auto-Save — timestamp formatting", () => {
  function formatTimestamp(date: Date): string {
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  }

  test("TC-S211-04: timestamp format is HH:MM", () => {
    const t = new Date("2026-04-02T09:05:00");
    expect(formatTimestamp(t)).toBe("09:05");
  });

  test("TC-S211-04: single-digit hours/minutes are zero-padded", () => {
    const t = new Date("2026-04-02T03:07:00");
    expect(formatTimestamp(t)).toBe("03:07");
  });
});
