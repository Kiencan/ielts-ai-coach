import Link from "next/link";
import { Headphones, BookOpen, PenLine, Mic, Flame, BookMarked, TrendingUp, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BandScore } from "@/components/shared/BandScore";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";

const skills = [
  { label: "Listening", href: "/listening", icon: Headphones, band: 6.0, color: "bg-blue-50 text-blue-600" },
  { label: "Reading", href: "/reading", icon: BookOpen, band: 6.5, color: "bg-green-50 text-green-600" },
  { label: "Writing", href: "/writing", icon: PenLine, band: 5.5, color: "bg-amber-50 text-amber-600" },
  { label: "Speaking", href: "/speaking", icon: Mic, band: 6.0, color: "bg-purple-50 text-purple-600" },
];

const recentActivities = [
  { skill: "Reading", title: "The History of Coffee", score: 7.0, date: "Hôm nay" },
  { skill: "Writing", title: "Task 2 – Education", score: 6.0, date: "Hôm qua" },
  { skill: "Listening", title: "Section 1 – Housing", score: 6.5, date: "2 ngày trước" },
];

export default function DashboardPage() {
  const overallBand = ((6.0 + 6.5 + 5.5 + 6.0) / 4).toFixed(1);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Dashboard"
        subtitle="Chào mừng trở lại! Hôm nay bạn muốn luyện kỹ năng gì?"
      />

      {/* Overall + Streak */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="col-span-2 md:col-span-1">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Overall Band</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-primary-700">{overallBand}</span>
              <span className="text-sm text-green-600 font-semibold mb-1">↑ 0.5</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Ước tính từ các bài luyện</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Streak</p>
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="text-3xl font-bold text-slate-900">7</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">ngày liên tiếp</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Bài đã làm</p>
            <span className="text-3xl font-bold text-slate-900">24</span>
            <p className="text-xs text-slate-400 mt-1">trong 30 ngày qua</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Từ cần ôn</p>
            <div className="flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-primary-700" />
              <span className="text-3xl font-bold text-slate-900">12</span>
            </div>
            <Link href="/vocabulary" className="text-xs text-primary-700 font-semibold mt-1 block hover:underline">Ôn ngay →</Link>
          </CardContent>
        </Card>
      </div>

      {/* Skills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {skills.map(({ label, href, icon: Icon, band, color }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <BandScore score={band} size="sm" />
                </div>
                <p className="font-semibold text-slate-900 text-sm">{label}</p>
                <div className="mt-2 h-1.5 bg-slate-100 rounded-full">
                  <div className="h-1.5 bg-primary-700 rounded-full" style={{ width: `${((band - 3) / 6) * 100}%` }} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent + Suggestion */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recentActivities.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 last:border-0">
                  <Badge variant={a.skill === "Reading" ? "green" : a.skill === "Writing" ? "amber" : "blue"}>
                    {a.skill}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{a.title}</p>
                    <p className="text-xs text-slate-400">{a.date}</p>
                  </div>
                  <BandScore score={a.score} size="sm" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-700" /> Gợi ý hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-slate-500">Dựa trên phân tích điểm yếu của bạn</p>
            {[
              { href: "/writing", label: "Luyện Writing Task 2", desc: "Coherence cần cải thiện", variant: "amber" as const },
              { href: "/vocabulary", label: "Ôn 12 từ vựng", desc: "Đến hạn ôn hôm nay", variant: "blue" as const },
            ].map((s) => (
              <Link key={s.href} href={s.href}>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-primary-700 hover:bg-primary-50 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{s.label}</p>
                    <p className="text-xs text-slate-500">{s.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary-700" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
