import { calcIeltsBand } from "@/lib/utils";

// Tests for edge cases in scoring functions
describe("IELTS Listening/Reading scoring edge cases", () => {
  it("handles 0 total questions gracefully", () => {
    // Should not divide by zero
    expect(() => calcIeltsBand(0, 0)).not.toThrow();
  });

  it("handles score > total questions", () => {
    // Band should cap at 9.0
    const band = calcIeltsBand(50, 40);
    expect(band).toBe(9.0);
  });

  it("Listening 10/10 → Band 9.0", () => {
    expect(calcIeltsBand(10, 10)).toBe(9.0);
  });

  it("Listening 0/10 → Band 4.0", () => {
    expect(calcIeltsBand(0, 10)).toBe(4.0);
  });
});

describe("Reading score answer matching (TC-REA-02)", () => {
  // Simulates the answer matching logic in reading/[id]/page.tsx
  function isCorrect(userAnswer: string, correctAnswer: string): boolean {
    const userAns = userAnswer.trim().toUpperCase();
    const correctAns = correctAnswer.toUpperCase();
    // BUG CHECK: empty string should NOT be treated as correct
    if (!userAns) return false;
    return userAns === correctAns || correctAns.includes(userAns);
  }

  it("exact T/F/NG match → correct", () => {
    expect(isCorrect("TRUE", "TRUE")).toBe(true);
    expect(isCorrect("FALSE", "FALSE")).toBe(true);
    expect(isCorrect("NOT GIVEN", "NOT GIVEN")).toBe(true);
  });

  it("wrong T/F/NG → incorrect", () => {
    expect(isCorrect("TRUE", "FALSE")).toBe(false);
    expect(isCorrect("FALSE", "NOT GIVEN")).toBe(false);
  });

  it("empty answer → MUST be incorrect (bug prevention)", () => {
    expect(isCorrect("", "TRUE")).toBe(false);
    expect(isCorrect("", "one-third / 1/3 / approximately one-third")).toBe(false);
  });

  it("partial short answer match → correct (Bean Belt)", () => {
    // "BEAN BELT" should match in "ONE-THIRD / 1/3 / APPROXIMATELY ONE-THIRD"? No
    // "Bean Belt" should match in "Bean Belt" exactly
    expect(isCorrect("Bean Belt", "Bean Belt")).toBe(true);
  });

  it("short answer in alternatives → correct", () => {
    expect(isCorrect("1/3", "one-third / 1/3 / approximately one-third")).toBe(true);
  });

  it("case insensitive matching", () => {
    expect(isCorrect("true", "TRUE")).toBe(true);
    expect(isCorrect("bean belt", "Bean Belt")).toBe(true);
  });
});
