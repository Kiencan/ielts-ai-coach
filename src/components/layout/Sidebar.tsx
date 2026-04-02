"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Headphones, BookOpen, PenLine,
  Mic, BookMarked, FileText, User, LogOut
} from "lucide-react";

const nav = [
  { label: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
  { label: "Kỹ năng", type: "section" },
  { label: "Listening", href: "/listening", icon: Headphones },
  { label: "Reading", href: "/reading", icon: BookOpen },
  { label: "Writing", href: "/writing", icon: PenLine },
  { label: "Speaking", href: "/speaking", icon: Mic },
  { label: "Học tập", type: "section" },
  { label: "Từ vựng", href: "/vocabulary", icon: BookMarked },
  { label: "Mock Test", href: "/mock-test", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 min-h-screen">
      <div className="p-4 border-b border-slate-200">
        <span className="text-lg font-bold text-primary-700 tracking-tight">IELTS AI Coach</span>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {nav.map((item, i) => {
          if (item.type === "section") {
            return (
              <p key={i} className="px-2 pt-4 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {item.label}
              </p>
            );
          }
          const Icon = item.icon!;
          const active = pathname.startsWith(item.href!);
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                active ? "bg-primary-50 text-primary-700 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-slate-200 space-y-0.5">
        <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
          <User className="w-4 h-4" /> Hồ sơ
        </Link>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4" /> Đăng xuất
          </button>
        </form>
      </div>
    </aside>
  );
}
