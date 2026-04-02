"use client";
import { useState } from "react";
import Link from "next/link";
import { Headphones, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { BandScore } from "@/components/shared/BandScore";

const audios = [
  { id: "l1", section: 1, title: "Accommodation Enquiry", topic: "Housing", difficulty: "easy" as const, questions: 10, done: false, types: ["Form Completion"] },
  { id: "l2", section: 2, title: "City Tour Information", topic: "Travel", difficulty: "medium" as const, questions: 10, done: true, lastBand: 6.5, types: ["Multiple Choice", "Map Labelling"] },
  { id: "l3", section: 3, title: "University Assignment Discussion", topic: "Education", difficulty: "medium" as const, questions: 10, done: false, types: ["Multiple Choice", "Sentence Completion"] },
  { id: "l4", section: 4, title: "Lecture on Marine Biology", topic: "Science", difficulty: "hard" as const, questions: 10, done: false, types: ["Note Completion"] },
];

const difficultyMap = {
  easy: { label: "Dễ", variant: "green" as const },
  medium: { label: "Trung bình", variant: "amber" as const },
  hard: { label: "Khó", variant: "red" as const },
};
const sectionColors = [
  "bg-blue-50 text-blue-600",
  "bg-green-50 text-green-600",
  "bg-amber-50 text-amber-600",
  "bg-purple-50 text-purple-600",
];

type Difficulty = "easy" | "medium" | "hard";
type QuestionType = "Form Completion" | "Multiple Choice" | "Map Labelling" | "Sentence Completion" | "Note Completion";

const ALL_TYPES: QuestionType[] = [
  "Form Completion", "Multiple Choice", "Map Labelling", "Sentence Completion", "Note Completion",
];

export default function ListeningListPage() {
  // S2-14: filter state
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "all">("all");
  const [filterType, setFilterType] = useState<QuestionType | "all">("all");
  const [filterSection, setFilterSection] = useState<number | "all">("all");

  const filtered = audios.filter((a) => {
    if (filterDifficulty !== "all" && a.difficulty !== filterDifficulty) return false;
    if (filterSection !== "all" && a.section !== filterSection) return false;
    if (filterType !== "all" && !a.types.includes(filterType)) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Listening" subtitle="Luyện nghe với các bài audio mô phỏng đúng cấu trúc IELTS. Audio chỉ phát 1 lần." />

      {/* Section overview */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {["Section 1\nĐối thoại xã hội", "Section 2\nĐộc thoại", "Section 3\nThảo luận học thuật", "Section 4\nBài giảng"].map((s, i) => (
          <button
            key={i}
            onClick={() => setFilterSection(filterSection === i + 1 ? "all" : i + 1)}
            className={`p-3 rounded-xl text-center border transition-colors ${
              filterSection === i + 1
                ? "border-primary-700 bg-primary-50"
                : "border-slate-200 " + sectionColors[i].split(" ")[0]
            }`}
          >
            <p className="text-xs font-bold text-slate-700 whitespace-pre-line">{s}</p>
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2 mb-5">
        {/* Difficulty filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium">Độ khó:</span>
          {(["all", "easy", "medium", "hard"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setFilterDifficulty(d)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                filterDifficulty === d
                  ? "bg-primary-700 text-white border-primary-700"
                  : "border-slate-200 text-slate-600 hover:border-primary-700"
              }`}
            >
              {d === "all" ? "Tất cả" : difficultyMap[d].label}
            </button>
          ))}
        </div>

        {/* Question type filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 font-medium">Dạng câu:</span>
          <button
            onClick={() => setFilterType("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
              filterType === "all"
                ? "bg-primary-700 text-white border-primary-700"
                : "border-slate-200 text-slate-600 hover:border-primary-700"
            }`}
          >
            Tất cả
          </button>
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(filterType === t ? "all" : t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                filterType === t
                  ? "bg-primary-700 text-white border-primary-700"
                  : "border-slate-200 text-slate-600 hover:border-primary-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-slate-400 py-10 text-sm">Không có bài nào phù hợp với bộ lọc hiện tại.</p>
        ) : (
          filtered.map((a) => {
            const diff = difficultyMap[a.difficulty];
            return (
              <Card key={a.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${sectionColors[a.section - 1].split(" ")[0]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Headphones className={`w-5 h-5 ${sectionColors[a.section - 1].split(" ")[1]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant="blue">Section {a.section}</Badge>
                        <Badge variant={diff.variant}>{diff.label}</Badge>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm">{a.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />~10 phút</span>
                        <span>{a.questions} câu</span>
                        <span className="text-slate-300">·</span>
                        {a.types.map((t) => <span key={t}>{t}</span>)}
                      </div>
                    </div>
                    {a.done && a.lastBand && <BandScore score={a.lastBand} size="sm" />}
                    <Link href={`/listening/${a.id}`}>
                      <Button size="sm" variant={a.done ? "outline" : "default"}>{a.done ? "Làm lại" : "Bắt đầu"}</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
