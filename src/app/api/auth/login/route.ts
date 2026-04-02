import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const supabase = createServerSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return NextResponse.json({ success: false, error: { code: "AUTH_ERROR", message: "Email hoặc mật khẩu không đúng." } }, { status: 401 });
    }
    const res = NextResponse.json({ success: true, data: { userId: data.user.id } });
    res.cookies.set("sb-access-token", data.session.access_token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 30, path: "/" });
    return res;
  } catch {
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Lỗi máy chủ." } }, { status: 500 });
  }
}
