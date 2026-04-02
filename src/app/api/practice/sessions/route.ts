import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

// GET /api/practice/sessions?skill=writing&limit=20
export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const skill = searchParams.get("skill");
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));

    const sessions = await prisma.practiceSession.findMany({
      where: {
        userId: user.id,
        status: "completed",
        ...(skill ? { questionSet: { skill: skill as never } } : {}),
      },
      orderBy: { submittedAt: "desc" },
      take: limit,
      include: {
        questionSet: { select: { skill: true, title: true, type: true } },
        aiFeedback: {
          select: {
            taskAchievementScore: true,
            coherenceScore: true,
            lexicalScore: true,
            grammarScore: true,
            overallBand: true,
            strengths: true,
            improvements: true,
            suggestions: true,
            transcript: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: sessions });
  } catch {
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR" } }, { status: 500 });
  }
}
