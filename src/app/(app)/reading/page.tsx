import Link from "next/link";
import { BookOpen, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";

const passages = [
  {
    id: "reading-1",
    title: "The History of Coffee",
    topic: "Food & Drink",
    difficulty: "medium" as const,
    questionCount: 13,
    timeMinutes: 20,
    types: ["T/F/NG", "Matching", "Short Answer"],
    done: false,
  },
  {
    id: "reading-2",
    title: "Climate Change and Agriculture",
    topic: "Environment",
    difficulty: "hard" as const,
    questionCount: 14,
    timeMinutes: 20,
    types: ["Matching Headings", "T/F/NG", "Sentence Completion"],
    done: true,
    lastScore: 6.5,
  },
  {
    id: "reading-3",
    title: "The Psychology of Learning",
    topic: "Education",
    difficulty: "medium" as const,
    questionCount: 13,
    timeMinutes: 20,
    types: ["Multiple Choice", "Sentence Completion"],
    done: false,
  },
  {
    id: "reading-4",
    title: "Urbanization in Southeast Asia",
    topic: "Society",
    difficulty: "easy" as const,
    questionCount: 13,
    timeMinutes: 20,
    types: ["T/F/NG", "Short Answer"],
    done: false,
  },
];

const difficultyMap = {
  easy: { label: "Dễ", variant: "green" as const },
  medium: { label: "Trung bình", variant: "amber" as const },
  hard: { label: "Khó", variant: "red" as const },
};

export default function ReadingListPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title="Reading"
        subtitle="Luyện tập kỹ năng đọc hiểu với các bài đọc chuẩn IELTS Academic."
      />

      <div className="flex gap-2 mb-6 flex-wrap">
        {["Tất cả", "Chưa làm", "Đã làm", "Dễ", "Trung bình", "Khó"].map((f) => (
          <button
            key={f}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-full hover:border-primary-700 hover:text-primary-700 transition-colors first:bg-primary-700 first:text-white first:border-primary-700"
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {passages.map((p) => {
          const diff = difficultyMap[p.difficulty];
          return (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-slate-900">{p.title}</h3>
                        {p.done && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge variant="gray">{p.topic}</Badge>
                        <Badge variant={diff.variant}>{diff.label}</Badge>
                        {p.types.map((t) => <Badge key={t} variant="gray">{t}</Badge>)}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{p.questionCount} câu hỏi</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.timeMinutes} phút</span>
                        {p.done && p.lastScore && (
                          <span className="text-green-600 font-semibold">Điểm: {p.lastScore}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link href={`/reading/${p.id}`}>
                    <Button size="sm" variant={p.done ? "outline" : "default"}>
                      {p.done ? "Làm lại" : "Bắt đầu"}
                    </Button>
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
