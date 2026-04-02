import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";
import { sm2 } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });

    const { itemId, quality: rawQuality } = await req.json();
    // BUG-03 fix: normalize SM-2 standard scale (0-5) to our internal scale (0-3)
    // API accepts both 0-3 (UI) and 0-5 (SM-2 standard) — map 4,5 → 3; 3 → 2; 2 → 1; 0,1 → 0
    const quality = rawQuality >= 4 ? 3 : rawQuality >= 3 ? 2 : rawQuality >= 2 ? 1 : 0;
    const item = await prisma.vocabularyItem.findFirst({ where: { id: itemId, userId: user.id } });
    if (!item) return NextResponse.json({ success: false, error: { code: "NOT_FOUND" } }, { status: 404 });

    const { easeFactor, intervalDays, repetitions, nextReviewAt } = sm2(
      item.easeFactor, item.intervalDays, item.repetitions, quality
    );

    const updated = await prisma.vocabularyItem.update({
      where: { id: itemId },
      data: { easeFactor, intervalDays, repetitions, nextReviewAt },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR" } }, { status: 500 });
  }
}
