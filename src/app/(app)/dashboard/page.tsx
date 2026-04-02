"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Headphones, BookOpen, PenLine, Mic, Flame, BookMarked, TrendingUp, ChevronRight, Loader2,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BandScore } from "@/components/shared/BandScore";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";

interface DashboardData {
  sessionsLast30Days: number;
  vocabDueToday: number;
  streak: number;
  skillBands: { listening: number | null; reading: number | null; writing: number | null; speaking: number | null };
  overallBand: number | null;
  bandHistory: { week: string; listening: number | null; reading: number | null; writing: number | null; speaking: number | null }[];
  weakAreas: { skill: string; band: number }[];
  recentActivities: { skill: string; title: string; score: number | null; date: string | null }[];
}

const SKILL_CONFIG = [
  { key: "listening", label: "Listening", href: "/listening", icon: Headphones, color: "bg-blue-50 text-blue-600", chartColor: "#3b82f6" },
  { key: "reading", label: "Reading", href: "/reading", icon: BookOpen, color: "bg-green-50 text-green-600", chartColor: "#22c55e" },
  { key: "writing", label: "Writing", href: "/writing", icon: PenLine, color: "bg-amber-50 text-amber-600", chartColor: "#f59e0b" },
  { key: "speaking", label: "Speaking", href: "/speaking", icon: Mic, color: "bg-purple-50 text-purple-600", chartColor: "#a855f7" },
] as const;

const SKILL_HREF: Record<string, string> = {
  listening: "/listening",
  reading: "/reading",
  writing: "/writing",
  speaking: "/speaking",
};

function skillLabel(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function relativeDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Hôm nay";
  if (days === 1) return "Hôm qua";
  return `${days} ngày trước`;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  // BUG-S2-06 fix: chart time-period filter (TC-S206-03)
  const [chartPeriod, setChartPeriod] = useState<7 | 30 | 90>(90);

  useEffect(() => {
    fetch("/api/dashboard/summary")
      .then((r) => r.json())
      .then((res) => { if (res.success) setData(res.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <Loader2 className="w-8 h-8 text-primary-700 animate-spin" />
      </div>
    );
  }

  const bands = data?.skillBands;
  const overall = data?.overallBand;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Dashboard"
        subtitle="Chào mừng trở lại! Hôm nay bạn muốn luyện kỹ năng gì?"
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="col-span-2 md:col-span-1">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Overall Band</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-primary-700">
                {overall !== null && overall !== undefined ? overall.toFixed(1) : "—"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Ước tính từ các bài luyện</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Streak</p>
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="text-3xl font-bold text-slate-900">{data?.streak ?? 0}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">ngày liên tiếp</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Bài đã làm</p>
            <span className="text-3xl font-bold text-slate-900">{data?.sessionsLast30Days ?? 0}</span>
            <p className="text-xs text-slate-400 mt-1">trong 30 ngày qua</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Từ cần ôn</p>
            <div className="flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-primary-700" />
              <span className="text-3xl font-bold text-slate-900">{data?.vocabDueToday ?? 0}</span>
            </div>
            <Link href="/vocabulary" className="text-xs text-primary-700 font-semibold mt-1 block hover:underline">
              Ôn ngay →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Skill cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {SKILL_CONFIG.map(({ key, label, href, icon: Icon, color }) => {
          const band = bands?.[key] ?? null;
          return (
            <Link key={key} href={href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {band !== null ? <BandScore score={band} size="sm" /> : <span className="text-xs text-slate-400">—</span>}
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{label}</p>
                  <div className="mt-2 h-1.5 bg-slate-100 rounded-full">
                    <div
                      className="h-1.5 bg-primary-700 rounded-full transition-all"
                      style={{ width: band !== null ? `${Math.min(100, ((band - 3) / 6) * 100)}%` : "0%" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Band History Chart */}
      {data && data.bandHistory.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Tiến độ Band Score</CardTitle>
              {/* BUG-S2-06 fix: time period filter buttons (TC-S206-03) */}
              <div className="flex gap-1">
                {([7, 30, 90] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setChartPeriod(p)}
                    className={`px-2 py-0.5 rounded text-xs font-semibold border transition-colors ${
                      chartPeriod === p
                        ? "bg-primary-700 text-white border-primary-700"
                        : "border-slate-200 text-slate-500 hover:border-primary-700"
                    }`}
                  >
                    {p === 7 ? "1T" : p === 30 ? "1M" : "3M"}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={data.bandHistory.filter((w) => {
                  const cutoff = new Date();
                  cutoff.setDate(cutoff.getDate() - chartPeriod);
                  return new Date(w.week) >= cutoff;
                })}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(v) => {
                    const d = new Date(v);
                    return `${d.getDate()}/${d.getMonth() + 1}`;
                  }}
                />
                <YAxis domain={[3, 9]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip
                  formatter={(value: number) => value?.toFixed(1)}
                  labelFormatter={(label) => {
                    const d = new Date(label);
                    return `Tuần ${d.getDate()}/${d.getMonth() + 1}`;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {SKILL_CONFIG.map(({ key, label, chartColor }) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={label}
                    stroke={chartColor}
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent activities + Suggestions */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {data && data.recentActivities.length > 0 ? (
                data.recentActivities.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 last:border-0">
                    <Badge
                      variant={
                        a.skill === "reading" ? "green"
                          : a.skill === "writing" ? "amber"
                          : a.skill === "speaking" ? "purple"
                          : "blue"
                      }
                    >
                      {skillLabel(a.skill)}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{a.title}</p>
                      <p className="text-xs text-slate-400">{relativeDate(a.date)}</p>
                    </div>
                    {a.score !== null && <BandScore score={a.score} size="sm" />}
                  </div>
                ))
              ) : (
                <p className="px-5 py-6 text-sm text-slate-400 text-center">
                  Chưa có bài luyện nào. Bắt đầu ngay!
                </p>
              )}
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

            {data && data.weakAreas.length > 0 ? (
              data.weakAreas.map((w) => (
                <Link key={w.skill} href={SKILL_HREF[w.skill] ?? "/"}>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-primary-700 hover:bg-primary-50 transition-colors group">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">Luyện {skillLabel(w.skill)}</p>
                      <p className="text-xs text-slate-500">Band hiện tại: {w.band?.toFixed(1) ?? "—"} — cần cải thiện</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary-700" />
                  </div>
                </Link>
              ))
            ) : (
              <>
                {[
                  { href: "/writing", label: "Luyện Writing Task 2", desc: "Kỹ năng cần rèn luyện nhiều nhất" },
                  { href: "/vocabulary", label: "Ôn từ vựng hôm nay", desc: "Duy trì streak của bạn" },
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
              </>
            )}

            {data && data.vocabDueToday > 0 && (
              <Link href="/vocabulary">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-primary-200 bg-primary-50 hover:border-primary-700 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">Ôn {data.vocabDueToday} từ vựng</p>
                    <p className="text-xs text-slate-500">Đến hạn ôn hôm nay</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary-700" />
                </div>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
