import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [sessions, vocabDue, recentSessions] = await Promise.all([
      prisma.practiceSession.count({ where: { userId: user.id, submittedAt: { gte: thirtyDaysAgo } } }),
      prisma.vocabularyItem.count({ where: { userId: user.id, nextReviewAt: { lte: new Date() } } }),
      prisma.practiceSession.findMany({
        where: { userId: user.id, status: "completed", bandScore: { not: null } },
        orderBy: { submittedAt: "desc" },
        take: 20,
        include: { questionSet: { select: { skill: true } } },
      }),
    ]);

    // Calculate per-skill band averages
    const skillBands: Record<string, number[]> = { listening: [], reading: [], writing: [], speaking: [] };
    recentSessions.forEach((s) => {
      if (s.bandScore) skillBands[s.questionSet.skill].push(s.bandScore);
    });
    const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

    return NextResponse.json({
      success: true,
      data: {
        sessionsLast30Days: sessions,
        vocabDueToday: vocabDue,
        skillBands: {
          listening: avg(skillBands.listening),
          reading: avg(skillBands.reading),
          writing: avg(skillBands.writing),
          speaking: avg(skillBands.speaking),
        },
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR" } }, { status: 500 });
  }
}
