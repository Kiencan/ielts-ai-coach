import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

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

  // Streak must start from today or yesterday
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

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const [sessionsCount, vocabDue, allSessions, streakSessions] = await Promise.all([
      prisma.practiceSession.count({
        where: { userId: user.id, submittedAt: { gte: thirtyDaysAgo } },
      }),
      prisma.vocabularyItem.count({
        where: { userId: user.id, nextReviewAt: { lte: new Date() } },
      }),
      prisma.practiceSession.findMany({
        where: {
          userId: user.id,
          status: "completed",
          bandScore: { not: null },
          submittedAt: { gte: ninetyDaysAgo },
        },
        orderBy: { submittedAt: "asc" },
        select: {
          id: true,
          bandScore: true,
          submittedAt: true,
          questionSet: { select: { skill: true, title: true } },
        },
      }),
      prisma.practiceSession.findMany({
        where: { userId: user.id, status: "completed" },
        select: { submittedAt: true },
        orderBy: { submittedAt: "desc" },
        take: 365,
      }),
    ]);

    const avg = (arr: number[]) =>
      arr.length ? +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : null;

    // Per-skill band averages
    const skillBands: Record<string, number[]> = { listening: [], reading: [], writing: [], speaking: [] };
    allSessions.forEach((s) => {
      if (s.bandScore) skillBands[s.questionSet.skill].push(s.bandScore);
    });

    // Weekly band history for chart (last 90 days)
    const weeklyData: Record<string, Record<string, number[]> & { week: string }> = {};
    allSessions.forEach((s) => {
      if (!s.submittedAt || !s.bandScore) return;
      const date = new Date(s.submittedAt);
      const day = date.getDay();
      const monday = new Date(date);
      monday.setDate(date.getDate() - ((day + 6) % 7));
      const weekKey = monday.toISOString().slice(0, 10);
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { week: weekKey, listening: [], reading: [], writing: [], speaking: [] };
      }
      (weeklyData[weekKey][s.questionSet.skill] as number[]).push(s.bandScore);
    });

    const bandHistory = Object.values(weeklyData)
      .sort((a, b) => a.week.localeCompare(b.week))
      .map((w) => ({
        week: w.week,
        listening: avg(w.listening as number[]),
        reading: avg(w.reading as number[]),
        writing: avg(w.writing as number[]),
        speaking: avg(w.speaking as number[]),
      }));

    // Weak areas: 2 skills with lowest average band
    const weakAreas = Object.entries({
      listening: avg(skillBands.listening),
      reading: avg(skillBands.reading),
      writing: avg(skillBands.writing),
      speaking: avg(skillBands.speaking),
    })
      .filter(([, v]) => v !== null)
      .sort(([, a], [, b]) => (a as number) - (b as number))
      .slice(0, 2)
      .map(([skill, band]) => ({ skill, band }));

    // Recent 5 activities
    const recentActivities = [...allSessions]
      .reverse()
      .slice(0, 5)
      .map((s) => ({
        skill: s.questionSet.skill,
        title: s.questionSet.title,
        score: s.bandScore,
        date: s.submittedAt,
      }));

    return NextResponse.json({
      success: true,
      data: {
        sessionsLast30Days: sessionsCount,
        vocabDueToday: vocabDue,
        streak: calcStreak(streakSessions),
        skillBands: {
          listening: avg(skillBands.listening),
          reading: avg(skillBands.reading),
          writing: avg(skillBands.writing),
          speaking: avg(skillBands.speaking),
        },
        overallBand: avg([
          ...skillBands.listening,
          ...skillBands.reading,
          ...skillBands.writing,
          ...skillBands.speaking,
        ]),
        bandHistory,
        weakAreas,
        recentActivities,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR" } }, { status: 500 });
  }
}
