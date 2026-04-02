import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

// GET /api/practice/question-sets?skill=reading&difficulty=medium&page=1&limit=10
export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const skill = searchParams.get("skill");
    const difficulty = searchParams.get("difficulty");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (skill) where.skill = skill;
    if (difficulty) where.difficulty = difficulty;

    const [total, questionSets] = await Promise.all([
      prisma.questionSet.count({ where }),
      prisma.questionSet.findMany({
        where,
        select: {
          id: true,
          skill: true,
          type: true,
          difficulty: true,
          title: true,
          estimatedBand: true,
          createdAt: true,
          // Exclude heavy content field for list view
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: questionSets,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR" } }, { status: 500 });
  }
}
