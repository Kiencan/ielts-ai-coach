import Link from "next/link";
import { Mic, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";

const speakingTasks = [
  { id: "s1", part: 1, title: "Hometown & Daily Life", topics: ["Hometown", "Daily routine", "Hobbies"], duration: "4–5 phút", done: false },
  { id: "s2", part: 2, title: "Describe a memorable trip", cueCard: true, duration: "3–4 phút", done: false },
  { id: "s3", part: 3, title: "Travel & Tourism (Discussion)", followUp: true, duration: "4–5 phút", done: false },
  { id: "s4", part: 1, title: "Technology & Work", topics: ["Technology use", "Remote work", "Future jobs"], duration: "4–5 phút", done: false },
  { id: "s5", part: 2, title: "Describe a book you've read recently", cueCard: true, duration: "3–4 phút", done: false },
];

const partColors = ["bg-purple-50 text-purple-600", "bg-blue-50 text-blue-600", "bg-green-50 text-green-600"];

export default function SpeakingListPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Speaking" subtitle="Luyện phát âm và diễn đạt với AI. Ghi âm trực tiếp trên trình duyệt." />

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { part: "Part 1", desc: "Câu hỏi về chủ đề quen thuộc · 4–5 phút" },
          { part: "Part 2", desc: "Cue card + 2 phút chuẩn bị + 2 phút nói" },
          { part: "Part 3", desc: "Thảo luận chuyên sâu liên quan Part 2" },
        ].map(({ part, desc }, i) => (
          <div key={part} className={`p-3 rounded-xl border border-slate-200 ${partColors[i].split(" ")[0]}`}>
            <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${partColors[i].split(" ")[1]}`}>{part}</p>
            <p className="text-xs text-slate-600">{desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {speakingTasks.map((t) => (
          <Card key={t.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 ${partColors[t.part - 1].split(" ")[0]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Mic className={`w-5 h-5 ${partColors[t.part - 1].split(" ")[1]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={t.part === 1 ? "purple" : t.part === 2 ? "blue" : "green"}>Part {t.part}</Badge>
                    {t.cueCard && <Badge variant="gray">Cue Card</Badge>}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm">{t.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.duration}</span>
                    {t.topics && t.topics.map((topic) => <span key={topic}>• {topic}</span>)}
                  </div>
                </div>
                <Link href={`/speaking/${t.id}`}>
                  <Button size="sm">Bắt đầu</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
