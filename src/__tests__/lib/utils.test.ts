import { calcIeltsBand, sm2, formatBand } from "@/lib/utils";

// ============================================================
// TC-REA-02: calcIeltsBand — IELTS standard band conversion
// ============================================================
describe("calcIeltsBand", () => {
  it("30/40 correct → Band 7.0 (TC-REA-02)", () => {
    expect(calcIeltsBand(30, 40)).toBe(7.0);
  });

  it("39/40 correct → Band 9.0", () => {
    expect(calcIeltsBand(39, 40)).toBe(9.0);
  });

  it("40/40 correct → Band 9.0", () => {
    expect(calcIeltsBand(40, 40)).toBe(9.0);
  });

  it("37/40 correct → Band 8.5", () => {
    expect(calcIeltsBand(37, 40)).toBe(8.5);
  });

  it("35/40 correct → Band 8.0", () => {
    expect(calcIeltsBand(35, 40)).toBe(8.0);
  });

  it("33/40 correct → Band 7.5", () => {
    expect(calcIeltsBand(33, 40)).toBe(7.5);
  });

  it("27/40 correct → Band 6.5", () => {
    expect(calcIeltsBand(27, 40)).toBe(6.5);
  });

  it("23/40 correct → Band 6.0", () => {
    expect(calcIeltsBand(23, 40)).toBe(6.0);
  });

  it("19/40 correct → Band 5.5", () => {
    expect(calcIeltsBand(19, 40)).toBe(5.5);
  });

  it("15/40 correct → Band 5.0", () => {
    expect(calcIeltsBand(15, 40)).toBe(5.0);
  });

  it("10/40 correct → Band 4.5", () => {
    expect(calcIeltsBand(10, 40)).toBe(4.5);
  });

  it("0/40 correct → Band 4.0", () => {
    expect(calcIeltsBand(0, 40)).toBe(4.0);
  });

  it("Reading: 7-question set, 7/7 → Band 9.0", () => {
    expect(calcIeltsBand(7, 7)).toBe(9.0);
  });

  it("Reading: 7-question set, 0/7 → Band 4.0", () => {
    expect(calcIeltsBand(0, 7)).toBe(4.0);
  });
});

// ============================================================
// TC-VOC-02 / TC-VOC-03 / TC-API-07: SM-2 algorithm
// ============================================================
describe("sm2", () => {
  const defaultItem = { easeFactor: 2.5, intervalDays: 1, repetitions: 0 };

  // TC-VOC-03: quality=0 (Không nhớ) → reset
  it("quality=0 (fail) resets interval to 1 and repetitions to 0 (TC-VOC-03)", () => {
    const result = sm2(2.5, 10, 5, 0);
    expect(result.intervalDays).toBe(1);
    expect(result.repetitions).toBe(0);
  });

  it("quality=0 on a well-established card still resets completely", () => {
    const result = sm2(2.7, 30, 8, 0);
    expect(result.intervalDays).toBe(1);
    expect(result.repetitions).toBe(0);
  });

  // TC-VOC-02: quality=3 (Rất dễ), first review (repetitions=0) → interval=1
  it("quality=3 (perfect), first review (rep=0) → interval=1, rep=1", () => {
    const result = sm2(2.5, 1, 0, 3);
    expect(result.intervalDays).toBe(1);
    expect(result.repetitions).toBe(1);
  });

  // TC-VOC-02: quality=3, second review (repetitions=1) → interval=6
  it("quality=3 (perfect), second review (rep=1) → interval=6, rep=2 (TC-VOC-02)", () => {
    const result = sm2(2.5, 1, 1, 3);
    expect(result.intervalDays).toBe(6);
    expect(result.repetitions).toBe(2);
  });

  it("quality=3 (perfect), third review (rep>=2) → interval = round(prev * EF)", () => {
    const result = sm2(2.5, 6, 2, 3);
    expect(result.intervalDays).toBe(Math.round(6 * result.easeFactor));
  });

  it("quality=1 (hard) reduces easeFactor", () => {
    const result = sm2(2.5, 1, 0, 1);
    expect(result.easeFactor).toBeLessThan(2.5);
  });

  it("easeFactor never falls below 1.3", () => {
    let ef = 1.4;
    let interval = 1;
    let reps = 3;
    for (let i = 0; i < 20; i++) {
      const r = sm2(ef, interval, reps, 0);
      ef = r.easeFactor;
      interval = r.intervalDays;
      reps = r.repetitions;
    }
    expect(ef).toBeGreaterThanOrEqual(1.3);
  });

  it("nextReviewAt is in the future", () => {
    const now = new Date();
    const result = sm2(2.5, 1, 0, 3);
    expect(result.nextReviewAt.getTime()).toBeGreaterThan(now.getTime());
  });

  it("nextReviewAt = today + intervalDays", () => {
    const result = sm2(2.5, 1, 1, 3); // interval should be 6
    const expected = new Date();
    expected.setDate(expected.getDate() + result.intervalDays);
    const diff = Math.abs(result.nextReviewAt.getDate() - expected.getDate());
    expect(diff).toBeLessThanOrEqual(1);
  });
});

// ============================================================
// formatBand
// ============================================================
describe("formatBand", () => {
  it("formats 6.5 as '6.5'", () => {
    expect(formatBand(6.5)).toBe("6.5");
  });

  it("formats 9 as '9.0'", () => {
    expect(formatBand(9)).toBe("9.0");
  });

  it("returns '—' for null", () => {
    expect(formatBand(null)).toBe("—");
  });

  it("returns '—' for undefined", () => {
    expect(formatBand(undefined)).toBe("—");
  });
});
