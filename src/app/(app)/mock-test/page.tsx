"use client";
import { useState } from "react";
import Link from "next/link";
import { FileText, Headphones, BookOpen, PenLine, Mic, Clock, ChevronRight, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BandScore } from "@/components/shared/BandScore";
import { PageHeader } from "@/components/layout/PageHeader";

const previousTests = [
  { date: "20/03/2026", listening: 6.5, reading: 6.5, writing: 6.0, speaking: 6.0, overall: 6.5 },
  { date: "05/03/2026", listening: 6.0, reading: 6.0, writing: 5.5, speaking: 5.5, overall: 5.5 },
];

const sections = [
  { key: "listening", label: "Listening", icon: Headphones, time: "40 phút", questions: 40, color: "text-blue-600 bg-blue-50", href: "/listening/l1" },
  { key: "reading", label: "Reading", icon: BookOpen, time: "60 phút", questions: 40, color: "text-green-600 bg-green-50", href: "/reading/reading-1" },
  { key: "writing", label: "Writing", icon: PenLine, time: "60 phút", tasks: "Task 1 + Task 2", color: "text-amber-600 bg-amber-50", href: "/writing/w1" },
  { key: "speaking", label: "Speaking", icon: Mic, time: "11–14 phút", parts: "Part 1 + 2 + 3", color: "text-purple-600 bg-purple-50", href: "/speaking/s1" },
];

export default function MockTestPage() {
  const [started, setStarted] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title="Mock Test"
        subtitle="Thi thử đầy đủ mô phỏng kỳ thi IELTS thật. Nhận band score ước tính cho cả 4 kỹ năng."
      />

      {!started ? (
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Mock Test #3</CardTitle>
              <p className="text-sm text-slate-500">Hoàn thành cả 4 kỹ năng theo thứ tự để nhận Overall band score chính xác nhất.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {sections.map(({ key, label, icon: Icon, time, color, href, questions, tasks, parts }) => (
                <div key={key} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-primary-300 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{label}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{time}</span>
                      <span>{questions ? `${questions} câu` : tasks || parts}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
              <div className="pt-2">
                <Button className="w-full" size="lg" onClick={() => setStarted(true)}>
                  Bắt đầu Mock Test
                </Button>
              </div>
            </CardContent>
          </Card>

          {previousTests.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Lịch sử thi thử</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-400 uppercase">Ngày</th>
                        <th className="text-center px-3 py-2.5 text-xs font-semibold text-slate-400">L</th>
                        <th className="text-center px-3 py-2.5 text-xs font-semibold text-slate-400">R</th>
                        <th className="text-center px-3 py-2.5 text-xs font-semibold text-slate-400">W</th>
                        <th className="text-center px-3 py-2.5 text-xs font-semibold text-slate-400">S</th>
                        <th className="text-center px-3 py-2.5 text-xs font-semibold text-slate-400">Overall</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previousTests.map((t, i) => (
                        <tr key={i} className="border-b border-slate-100 last:border-0">
                          <td className="px-5 py-3 text-slate-600">{t.date}</td>
                          <td className="text-center px-3 py-3"><BandScore score={t.listening} size="sm" /></td>
                          <td className="text-center px-3 py-3"><BandScore score={t.reading} size="sm" /></td>
                          <td className="text-center px-3 py-3"><BandScore score={t.writing} size="sm" /></td>
                          <td className="text-center px-3 py-3"><BandScore score={t.speaking} size="sm" /></td>
                          <td className="text-center px-3 py-3 font-bold text-primary-700">{t.overall.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700 font-medium">Mock Test đã bắt đầu! Hoàn thành từng kỹ năng theo thứ tự.</p>
          </div>
          <div className="space-y-3">
            {sections.map(({ key, label, icon: Icon, time, color, href, questions, tasks, parts }, i) => (
              <Card key={key} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{label}</p>
                      <p className="text-xs text-slate-500">{time} · {questions ? `${questions} câu` : tasks || parts}</p>
                    </div>
                    <Badge variant="gray">Bước {i + 1}</Badge>
                    <Link href={href}>
                      <Button size="sm">Làm ngay</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
