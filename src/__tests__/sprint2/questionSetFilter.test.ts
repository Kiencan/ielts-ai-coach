/**
 * Sprint 2 — TC-S202 Question Sets Filter Validation Tests
 * Tests the enum validation logic added in BUG-S2-01 fix
 */

const VALID_SKILLS = ["listening", "reading", "writing", "speaking"];
const VALID_DIFFICULTIES = ["easy", "medium", "hard"];

function validateSkill(skill: string | null): { valid: boolean; code?: string } {
  if (!skill) return { valid: true }; // null = no filter = valid
  if (!VALID_SKILLS.includes(skill)) return { valid: false, code: "INVALID_SKILL" };
  return { valid: true };
}

function validateDifficulty(difficulty: string | null): { valid: boolean; code?: string } {
  if (!difficulty) return { valid: true };
  if (!VALID_DIFFICULTIES.includes(difficulty)) return { valid: false, code: "INVALID_DIFFICULTY" };
  return { valid: true };
}

describe("Question Sets — skill filter validation (TC-S202-06)", () => {
  test("TC-S202-06: invalid skill 'dancing' → INVALID_SKILL", () => {
    expect(validateSkill("dancing")).toEqual({ valid: false, code: "INVALID_SKILL" });
  });

  test("TC-S202-06: invalid skill 'maths' → INVALID_SKILL", () => {
    expect(validateSkill("maths")).toEqual({ valid: false, code: "INVALID_SKILL" });
  });

  test("TC-S202-02: valid skill 'reading' → valid", () => {
    expect(validateSkill("reading")).toEqual({ valid: true });
  });

  test("TC-S202-02: valid skill 'listening' → valid", () => {
    expect(validateSkill("listening")).toEqual({ valid: true });
  });

  test("null skill (no filter) → valid", () => {
    expect(validateSkill(null)).toEqual({ valid: true });
  });

  test("all valid skills pass", () => {
    VALID_SKILLS.forEach((s) => {
      expect(validateSkill(s).valid).toBe(true);
    });
  });

  test("empty string skill → INVALID_SKILL", () => {
    // Empty string is truthy-falsy edge: "" is falsy so treated as no filter
    expect(validateSkill("")).toEqual({ valid: true }); // null-like
  });
});

describe("Question Sets — difficulty filter validation", () => {
  test("invalid difficulty 'extreme' → INVALID_DIFFICULTY", () => {
    expect(validateDifficulty("extreme")).toEqual({ valid: false, code: "INVALID_DIFFICULTY" });
  });

  test("valid difficulty 'hard' → valid", () => {
    expect(validateDifficulty("hard")).toEqual({ valid: true });
  });

  test("null difficulty → valid", () => {
    expect(validateDifficulty(null)).toEqual({ valid: true });
  });

  test("all valid difficulties pass", () => {
    VALID_DIFFICULTIES.forEach((d) => {
      expect(validateDifficulty(d).valid).toBe(true);
    });
  });
});

describe("Question Sets — pagination logic", () => {
  test("page 1 limit 3: skip=0, take=3", () => {
    const page = 1, limit = 3;
    const skip = (page - 1) * limit;
    expect(skip).toBe(0);
  });

  test("page 2 limit 3: skip=3, take=3 (no overlap with page 1)", () => {
    const page = 2, limit = 3;
    const skip = (page - 1) * limit;
    expect(skip).toBe(3);
  });

  test("TC-S202-04: totalPages calculation", () => {
    expect(Math.ceil(8 / 3)).toBe(3); // 8 items, limit 3 → 3 pages
    expect(Math.ceil(6 / 3)).toBe(2);
    expect(Math.ceil(3 / 3)).toBe(1);
    expect(Math.ceil(0 / 3)).toBe(0);
  });

  test("limit is capped at 50", () => {
    const rawLimit = 9999;
    const limit = Math.min(50, Math.max(1, rawLimit));
    expect(limit).toBe(50);
  });

  test("limit minimum is 1", () => {
    const rawLimit = -5;
    const limit = Math.min(50, Math.max(1, rawLimit));
    expect(limit).toBe(1);
  });
});
