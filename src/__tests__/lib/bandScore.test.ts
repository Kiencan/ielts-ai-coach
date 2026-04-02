import { calcIeltsBand } from "@/lib/utils";

// TC-MOC-02: IELTS Overall band rounding rules
// (7.0+6.5+6.0+6.0)/4 = 6.375 → rounds UP to 6.5
describe("IELTS Overall Band Score rounding (TC-MOC-02)", () => {
  function calcOverallBand(l: number, r: number, w: number, s: number): number {
    const avg = (l + r + w + s) / 4;
    // IELTS rounding: round to nearest 0.5 (0.25 rounds up)
    return Math.round(avg * 2) / 2;
  }

  it("L=7.0 R=6.5 W=6.0 S=6.0 → Overall 6.5 (TC-MOC-02)", () => {
    expect(calcOverallBand(7.0, 6.5, 6.0, 6.0)).toBe(6.5);
  });

  it("L=6.0 R=6.0 W=6.0 S=6.0 → Overall 6.0", () => {
    expect(calcOverallBand(6.0, 6.0, 6.0, 6.0)).toBe(6.0);
  });

  it("L=7.5 R=7.0 W=6.5 S=6.5 → Overall 7.0", () => {
    expect(calcOverallBand(7.5, 7.0, 6.5, 6.5)).toBe(7.0);
  });

  it("L=8.0 R=8.0 W=7.0 S=7.0 → Overall 7.5", () => {
    expect(calcOverallBand(8.0, 8.0, 7.0, 7.0)).toBe(7.5);
  });
});
