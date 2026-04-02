import Link from "next/link";
import { PenLine, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { BandScore } from "@/components/shared/BandScore";

const tasks = [
  { id: "w1", task: 1, type: "Bar Chart", title: "Tourism Statistics 2020–2024", difficulty: "medium" as const, done: false },
  { id: "w2", task: 2, type: "Opinion", title: "Technology reduces human interaction", difficulty: "medium" as const, done: true, lastBand: 6.0 },
  { id: "w3", task: 2, type: "Discussion", title: "Advantages of living in cities vs countryside", difficulty: "easy" as const, done: false },
  { id: "w4", task: 1, type: "Process Diagram", title: "How paper is made", difficulty: "hard" as const, done: false },
  { id: "w5", task: 2, type: "Problem-Solution", title: "Environmental pollution in modern cities", difficulty: "hard" as const, done: true, lastBand: 5.5 },
];

const difficultyMap = { easy: { label: "Dễ", variant: "green" as const }, medium: { label: "Trung bình", variant: "amber" as const }, hard: { label: "Khó", variant: "red" as const } };

export default function WritingListPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Writing" subtitle="Luyện Task 1 và Task 2 với phản hồi AI chi tiết theo 4 tiêu chí IELTS." />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Task 1</p>
          <p className="text-sm text-slate-700">Mô tả biểu đồ, sơ đồ, bản đồ · Tối thiểu 150 từ · 20 phút</p>
        </div>
        <div className="p-4 bg-primary-50 border border-primary-100 rounded-xl">
          <p className="text-xs font-bold text-primary-700 uppercase tracking-wide mb-1">Task 2</p>
          <p className="text-sm text-slate-700">Viết luận (essay) · Tối thiểu 250 từ · 40 phút</p>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((t) => {
          const diff = difficultyMap[t.difficulty];
          return (
            <Card key={t.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PenLine className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant={t.task === 1 ? "amber" : "blue"}>Task {t.task}</Badge>
                      <Badge variant="gray">{t.type}</Badge>
                      <Badge variant={diff.variant}>{diff.label}</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 text-sm truncate">{t.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.task === 1 ? "20" : "40"} phút</span>
                      <span>{t.task === 1 ? "≥ 150" : "≥ 250"} từ</span>
                    </div>
                  </div>
                  {t.done && t.lastBand && <BandScore score={t.lastBand} size="sm" />}
                  <Link href={`/writing/${t.id}`}>
                    <Button size="sm" variant={t.done ? "outline" : "default"}>{t.done ? "Viết lại" : "Bắt đầu"}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
