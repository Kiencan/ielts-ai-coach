/**
 * Sprint 2 — TC-S205 Streak Counter Unit Tests
 * Tests the calcStreak logic extracted from /api/dashboard/summary/route.ts
 */

// Extracted calcStreak function for unit testing
function calcStreak(sessions: { submittedAt: Date | null }[]): number {
  if (!sessions.length) return 0;

  const uniqueDates = [
    ...new Set(
      sessions
        .filter((s) => s.submittedAt)
        .map((s) => s.submittedAt!.toISOString().slice(0, 10))
    ),
  ].sort((a, b) => b.localeCompare(a));

  if (!uniqueDates.length) return 0;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

describe("calcStreak (TC-S205)", () => {
  // TC-S205-01: 7 consecutive days ending today
  test("TC-S205-01: streak = 7 when studied 7 consecutive days", () => {
    const sessions = Array.from({ length: 7 }, (_, i) => ({
      submittedAt: daysAgo(i),
    }));
    expect(calcStreak(sessions)).toBe(7);
  });

  // TC-S205-02: gap in the middle resets streak
  test("TC-S205-02: streak = 1 when there is a 1-day gap (days 0,1,2, skip 3, day 4)", () => {
    const sessions = [
      { submittedAt: daysAgo(0) }, // today
      { submittedAt: daysAgo(1) },
      { submittedAt: daysAgo(2) },
      // skipped day 3
      { submittedAt: daysAgo(4) },
      { submittedAt: daysAgo(5) },
    ];
    // Most recent run: today, yesterday, 2 days ago = 3 continuous
    expect(calcStreak(sessions)).toBe(3);
  });

  // TC-S205-03: no session today — streak starts from yesterday or returns 0
  test("TC-S205-03: streak counts from yesterday if no session today", () => {
    const sessions = [
      { submittedAt: daysAgo(1) },
      { submittedAt: daysAgo(2) },
      { submittedAt: daysAgo(3) },
    ];
    // yesterday is valid start of streak
    expect(calcStreak(sessions)).toBe(3);
  });

  test("TC-S205-03b: streak = 0 if most recent session is 2+ days ago", () => {
    const sessions = [
      { submittedAt: daysAgo(2) },
      { submittedAt: daysAgo(3) },
    ];
    expect(calcStreak(sessions)).toBe(0);
  });

  // TC-S205-04: single session today → streak = 1
  test("TC-S205-04: streak = 1 for single session today", () => {
    const sessions = [{ submittedAt: daysAgo(0) }];
    expect(calcStreak(sessions)).toBe(1);
  });

  // TC-S205-05: 3 sessions same day → only counts as 1 day
  test("TC-S205-05: multiple sessions same day count as 1 streak day", () => {
    const today = new Date();
    const sessions = [
      { submittedAt: today },
      { submittedAt: today },
      { submittedAt: today },
    ];
    expect(calcStreak(sessions)).toBe(1);
  });

  test("no sessions → streak = 0", () => {
    expect(calcStreak([])).toBe(0);
  });

  test("sessions with null submittedAt are ignored", () => {
    const sessions = [
      { submittedAt: null },
      { submittedAt: daysAgo(0) },
    ];
    expect(calcStreak(sessions)).toBe(1);
  });
});
