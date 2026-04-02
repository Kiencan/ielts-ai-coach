import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION", message: "Vui lòng điền đầy đủ thông tin." } }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION", message: "Mật khẩu phải có ít nhất 8 ký tự." } }, { status: 400 });
    }

    const supabase = createServerSupabase();
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
    if (error) {
      // BUG-04 fix: return 409 for duplicate email (TC-API-02)
      const isDuplicate = error.message.toLowerCase().includes("already") || error.status === 422;
      return NextResponse.json(
        { success: false, error: { code: isDuplicate ? "EMAIL_ALREADY_EXISTS" : "AUTH_ERROR", message: isDuplicate ? "Email này đã được sử dụng." : error.message } },
        { status: isDuplicate ? 409 : 400 }
      );
    }

    await prisma.user.create({ data: { email, name, id: data.user!.id } });

    const res = NextResponse.json({ success: true, data: { userId: data.user!.id } });
    if (data.session) {
      res.cookies.set("sb-access-token", data.session.access_token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 30, path: "/" });
    }
    return res;
  } catch (e: any) {
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Lỗi máy chủ." } }, { status: 500 });
  }
}
