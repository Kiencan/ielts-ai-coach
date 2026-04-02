import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Chưa đăng nhập." } }, { status: 401 });

    const { targetBand, currentBand } = await req.json();
    const bandMap: Record<string, number> = {
      "4.0": 4.0, "4.5": 4.5, "5.0": 5.0, "5.5": 5.5,
      "6.0": 6.0, "6.5": 6.5, "7.0": 7.0, "7.5": 7.5, "8.0": 8.0, "8.5+": 8.5,
    };

    await prisma.user.update({
      where: { id: user.id },
      data: {
        targetBand: bandMap[targetBand] || null,
        onboardingDone: true,
      },
    });
    return NextResponse.json({ success: true, data: null });
  } catch {
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Lỗi máy chủ." } }, { status: 500 });
  }
}
