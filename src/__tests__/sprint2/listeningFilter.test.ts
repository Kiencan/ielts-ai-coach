/**
 * Sprint 2 — TC-S214 Listening Filter Logic Tests
 */

type Difficulty = "easy" | "medium" | "hard";

interface Audio {
  id: string;
  section: number;
  title: string;
  difficulty: Difficulty;
  types: string[];
}

const AUDIOS: Audio[] = [
  { id: "l1", section: 1, title: "Accommodation Enquiry", difficulty: "easy", types: ["Form Completion"] },
  { id: "l2", section: 2, title: "City Tour Information", difficulty: "medium", types: ["Multiple Choice", "Map Labelling"] },
  { id: "l3", section: 3, title: "University Assignment Discussion", difficulty: "medium", types: ["Multiple Choice", "Sentence Completion"] },
  { id: "l4", section: 4, title: "Lecture on Marine Biology", difficulty: "hard", types: ["Note Completion"] },
];

function applyFilters(
  audios: Audio[],
  filterSection: number | "all",
  filterDifficulty: Difficulty | "all",
  filterType: string | "all"
): Audio[] {
  return audios.filter((a) => {
    if (filterSection !== "all" && a.section !== filterSection) return false;
    if (filterDifficulty !== "all" && a.difficulty !== filterDifficulty) return false;
    if (filterType !== "all" && !a.types.includes(filterType)) return false;
    return true;
  });
}

describe("Listening Filter (TC-S214)", () => {
  // TC-S214-01: filter by section
  test("TC-S214-01: filter Section 2 returns only Section 2 items", () => {
    const result = applyFilters(AUDIOS, 2, "all", "all");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("l2");
  });

  // TC-S214-02: filter by difficulty
  test("TC-S214-02: filter difficulty=hard returns only hard items", () => {
    const result = applyFilters(AUDIOS, "all", "hard", "all");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("l4");
  });

  test("TC-S214-02: filter difficulty=medium returns 2 items", () => {
    const result = applyFilters(AUDIOS, "all", "medium", "all");
    expect(result).toHaveLength(2);
  });

  // TC-S214-03: filter by question type
  test("TC-S214-03: filter Multiple Choice returns 2 items (l2 and l3)", () => {
    const result = applyFilters(AUDIOS, "all", "all", "Multiple Choice");
    expect(result.map((a) => a.id)).toEqual(["l2", "l3"]);
  });

  // TC-S214-04: combined filters (AND logic)
  test("TC-S214-04: Section 3 + medium + Multiple Choice → 1 result", () => {
    const result = applyFilters(AUDIOS, 3, "medium", "Multiple Choice");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("l3");
  });

  test("TC-S214-04: no results for impossible combination → empty array, no crash", () => {
    const result = applyFilters(AUDIOS, 1, "hard", "Map Labelling");
    expect(result).toHaveLength(0);
  });

  // TC-S214-05: reset to "all" shows everything
  test("TC-S214-05: all filters = 'all' returns all audios", () => {
    const result = applyFilters(AUDIOS, "all", "all", "all");
    expect(result).toHaveLength(AUDIOS.length);
  });

  test("Note Completion filter returns only Section 4", () => {
    const result = applyFilters(AUDIOS, "all", "all", "Note Completion");
    expect(result).toHaveLength(1);
    expect(result[0].section).toBe(4);
  });
});
