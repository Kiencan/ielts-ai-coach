import { cookies } from "next/headers";
import { createServerSupabase } from "./supabase";
import { prisma } from "./prisma";

export async function getServerUser() {
  try {
    const cookieStore = cookies();
    const supabase = createServerSupabase();
    const authCookie = cookieStore.get("sb-access-token");
    if (!authCookie) return null;

    const { data: { user }, error } = await supabase.auth.getUser(authCookie.value);
    if (error || !user) return null;

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    return dbUser;
  } catch {
    return null;
  }
}
