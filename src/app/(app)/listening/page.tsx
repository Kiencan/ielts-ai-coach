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

const difficultyMap = { easy: { label: "Dễ", variant: "green" as const }, medium: { label: "Trung bình", variant: "amber" as const }, hard: { label: "Khó", variant: "red" as const } };
const sectionColors = ["bg-blue-50 text-blue-600", "bg-green-50 text-green-600", "bg-amber-50 text-amber-600", "bg-purple-50 text-purple-600"];

export default function ListeningListPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Listening" subtitle="Luyện nghe với các bài audio mô phỏng đúng cấu trúc IELTS. Audio chỉ phát 1 lần." />

      <div className="grid grid-cols-4 gap-3 mb-6">
        {["Section 1\nĐối thoại xã hội", "Section 2\nĐộc thoại", "Section 3\nThảo luận học thuật", "Section 4\nBài giảng"].map((s, i) => (
          <div key={i} className={`p-3 rounded-xl text-center ${sectionColors[i].replace("text-", "bg-").replace("bg-", "bg-").split(" ")[0]} border border-slate-200`}>
            <p className="text-xs font-bold text-slate-700 whitespace-pre-line">{s}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {audios.map((a) => {
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
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />~10 phút</span>
                      <span>{a.questions} câu</span>
                      <span className="text-slate-300">·</span>
                      {a.types.map((t) => <span key={t} className="text-slate-400">{t}</span>)}
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
        })}
      </div>
    </div>
  );
}
