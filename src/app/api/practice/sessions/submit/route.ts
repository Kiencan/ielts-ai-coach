import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";
import { calcIeltsBand } from "@/lib/utils";

// POST /api/practice/sessions/submit
// Body: { questionSetId, answers, timeSpentSeconds, bandScore?, aiFeedback? }
export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });

    const body = await req.json();
    const { questionSetId, answers, timeSpentSeconds, bandScore, aiFeedback } = body;

    if (!questionSetId) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION", message: "questionSetId là bắt buộc." } },
        { status: 400 }
      );
    }

    const questionSet = await prisma.questionSet.findUnique({ where: { id: questionSetId } });
    if (!questionSet) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Không tìm thấy bộ đề." } },
        { status: 404 }
      );
    }

    // Calculate band score for objective skills (reading/listening) if not provided
    let finalBand = bandScore ?? null;
    if (finalBand === null && answers && (questionSet.skill === "reading" || questionSet.skill === "listening")) {
      const content = questionSet.content as { questions?: { answer: string }[] };
      const questions = content?.questions ?? [];
      if (questions.length > 0) {
        const correct = questions.filter((q, i) => {
          const userAns = (answers[i] || "").trim().toLowerCase();
          return userAns && userAns.includes(q.answer.toLowerCase());
        }).length;
        finalBand = calcIeltsBand(correct, questions.length);
      }
    }

    // Create session and optionally AI feedback in one transaction
    const session = await prisma.$transaction(async (tx) => {
      const newSession = await tx.practiceSession.create({
        data: {
          userId: user.id,
          questionSetId,
          status: "completed",
          answers: answers ?? {},
          bandScore: finalBand,
          timeSpentSeconds: timeSpentSeconds ?? null,
          submittedAt: new Date(),
        },
      });

      if (aiFeedback) {
        await tx.aiFeedback.create({
          data: {
            sessionId: newSession.id,
            taskAchievementScore: aiFeedback.taskAchievement?.score ?? aiFeedback.fluencyScore ?? null,
            coherenceScore: aiFeedback.coherence?.score ?? null,
            lexicalScore: aiFeedback.lexical?.score ?? aiFeedback.lexicalScore ?? null,
            grammarScore: aiFeedback.grammar?.score ?? aiFeedback.grammarScore ?? null,
            overallBand: aiFeedback.overallBand ?? finalBand,
            strengths: aiFeedback.strengths ?? [],
            improvements: aiFeedback.improvements ?? [],
            suggestions: aiFeedback.suggestions ?? [],
            transcript: aiFeedback.transcript ?? null,
          },
        });
      }

      return newSession;
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        bandScore: session.bandScore,
        submittedAt: session.submittedAt,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR" } }, { status: 500 });
  }
}
