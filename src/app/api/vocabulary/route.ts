import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });

    const items = await prisma.vocabularyItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: items });
  } catch {
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR" } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });

    const { word, definitionVi, exampleSentence, topic } = await req.json();
    if (!word || !definitionVi) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION", message: "Thiếu từ hoặc nghĩa." } }, { status: 400 });
    }

    // BUG-S2-04 fix: check for duplicate word before inserting (TC-S212-04)
    const existing = await prisma.vocabularyItem.findFirst({
      where: { userId: user.id, word: { equals: word, mode: "insensitive" } },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: "DUPLICATE_WORD", message: "Từ này đã có trong từ điển của bạn." } },
        { status: 409 }
      );
    }

    const item = await prisma.vocabularyItem.create({
      data: { userId: user.id, word, definitionVi, exampleSentence, topic, nextReviewAt: new Date() },
    });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR" } }, { status: 500 });
  }
}
