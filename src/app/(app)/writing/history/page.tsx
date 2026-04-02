"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, PenLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BandScore } from "@/components/shared/BandScore";
import { Button } from "@/components/ui/button";

interface SessionItem {
  id: string;
  bandScore: number | null;
  submittedAt: string | null;
  answers: Record<string, string> | null;
  questionSet: { skill: string; title: string; type: string };
  aiFeedback: {
    taskAchievementScore: number | null;
    coherenceScore: number | null;
    lexicalScore: number | null;
    grammarScore: number | null;
    overallBand: number | null;
    strengths: string[];
    improvements: string[];
    suggestions: { original: string; suggested: string; explanation?: string }[] | null;
  } | null;
}

function relativeDate(s: string | null): string {
  if (!s) return "";
  const diff = Date.now() - new Date(s).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Hôm nay";
  if (days === 1) return "Hôm qua";
  return `${days} ngày trước`;
}

export default function WritingHistoryPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/practice/sessions?skill=writing&limit=20")
      .then((r) => r.json())
      .then((res) => { if (res.success) setSessions(res.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/writing">
          <Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4" /> Quay lại</Button>
        </Link>
        <h1 className="font-bold text-slate-900 text-xl">Lịch sử Writing</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-700 animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16">
          <PenLine className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Chưa có bài Writing nào được nộp.</p>
          <Link href="/writing">
            <Button className="mt-4">Bắt đầu luyện Writing</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => (
            <Card key={s.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Summary row */}
                <button
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                >
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PenLine className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="amber">{s.questionSet.type}</Badge>
                    </div>
                    <p className="font-semibold text-slate-900 text-sm truncate">{s.questionSet.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{relativeDate(s.submittedAt)}</p>
                  </div>
                  {s.bandScore !== null && <BandScore score={s.bandScore} size="sm" />}
                  <span className="text-xs text-primary-700 font-semibold">
                    {expanded === s.id ? "Thu gọn ▲" : "Chi tiết ▼"}
                  </span>
                </button>

                {/* Expanded detail */}
                {expanded === s.id && s.aiFeedback && (
                  <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50">
                    {/* Criteria grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Task Achievement", score: s.aiFeedback.taskAchievementScore },
                        { label: "Coherence & Cohesion", score: s.aiFeedback.coherenceScore },
                        { label: "Lexical Resource", score: s.aiFeedback.lexicalScore },
                        { label: "Grammatical Range", score: s.aiFeedback.grammarScore },
                      ].map((c) => (
                        <div key={c.label} className="p-3 bg-white rounded-lg border border-slate-200">
                          <p className="text-xs text-slate-500 mb-1">{c.label}</p>
                          {c.score !== null ? (
                            <BandScore score={c.score} size="sm" />
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Strengths & improvements */}
                    {(s.aiFeedback.strengths.length > 0 || s.aiFeedback.improvements.length > 0) && (
                      <div className="space-y-1.5">
                        {s.aiFeedback.strengths.map((str, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-green-700">
                            <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {str}
                          </div>
                        ))}
                        {s.aiFeedback.improvements.map((imp, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-amber-700">
                            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {imp}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Vocabulary suggestions */}
                    {s.aiFeedback.suggestions && s.aiFeedback.suggestions.length > 0 && (
                      <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <p className="text-xs font-semibold text-slate-700 mb-2">Gợi ý từ vựng</p>
                        <div className="space-y-1.5">
                          {(s.aiFeedback.suggestions as { original: string; suggested: string; explanation?: string }[]).map((sg, i) => (
                            <p key={i} className="text-xs">
                              <span className="line-through text-slate-400">{sg.original}</span>
                              {" → "}
                              <span className="font-semibold text-primary-700">{sg.suggested}</span>
                              {sg.explanation && <span className="text-slate-500"> — {sg.explanation}</span>}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Essay text */}
                    {s.answers && typeof s.answers === "object" && (s.answers as Record<string, string>).essay && (
                      <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Bài viết</p>
                        <p className="text-sm text-slate-700 leading-relaxed font-serif whitespace-pre-line">
                          {(s.answers as Record<string, string>).essay}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {expanded === s.id && !s.aiFeedback && (
                  <div className="border-t border-slate-100 p-5 text-center text-sm text-slate-400">
                    Không có phản hồi AI cho bài này.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
