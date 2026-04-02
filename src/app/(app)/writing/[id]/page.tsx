"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer } from "@/components/shared/Timer";
import { BandScore } from "@/components/shared/BandScore";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const TASK = {
  id: "w2",
  task: 2,
  type: "Opinion",
  title: "Technology reduces human interaction",
  prompt: `Some people believe that modern technology has reduced face-to-face communication and weakened human relationships. To what extent do you agree or disagree with this statement?

Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.`,
  minWords: 250,
  timeMinutes: 40,
};

interface AiFeedback {
  taskAchievement: { score: number; strengths: string[]; improvements: string[] };
  coherence: { score: number; strengths: string[]; improvements: string[] };
  lexical: { score: number; strengths: string[]; improvements: string[] };
  grammar: { score: number; strengths: string[]; improvements: string[] };
  overallBand: number;
  suggestions: { original: string; suggested: string; explanation: string }[];
}

export default function WritingPracticePage({ params }: { params: { id: string } }) {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<AiFeedback | null>(null);
  const [error, setError] = useState("");
  const [lastSaved, setLastSaved] = useState<string | null>(null); // BUG-12 fix

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [text]);

  // BUG-12 fix: auto-save draft every 30s with timestamp display (TC-WRI-05)
  useEffect(() => {
    if (!text || submitted) return;
    const t = setInterval(() => {
      localStorage.setItem(`writing-draft-${params.id}`, text);
      const now = new Date();
      setLastSaved(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`);
    }, 30000);
    return () => clearInterval(t);
  }, [text, submitted, params.id]);

  useEffect(() => {
    const saved = localStorage.getItem(`writing-draft-${params.id}`);
    if (saved) setText(saved);
  }, [params.id]);

  async function handleSubmit() {
    if (wordCount < TASK.minWords) return;
    setSubmitted(true);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/grade-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay: text, taskType: TASK.task, prompt: TASK.prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "AI grading failed");
      setFeedback(data.data);

      // Persist session + AI feedback to DB (best-effort, non-blocking)
      fetch("/api/practice/sessions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionSetId: params.id,
          answers: { essay: text },
          bandScore: data.data?.overallBand ?? null,
          aiFeedback: data.data,
        }),
      }).catch(() => { /* ignore persistence errors */ });
    } catch (e: any) {
      setError(e.message || "Không thể chấm bài. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  const criteriaLabels = [
    { key: "taskAchievement", label: "Task Achievement" },
    { key: "coherence", label: "Coherence & Cohesion" },
    { key: "lexical", label: "Lexical Resource" },
    { key: "grammar", label: "Grammatical Range & Accuracy" },
  ] as const;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Badge variant="amber">Task {TASK.task}</Badge>
            <Badge variant="gray">{TASK.type}</Badge>
          </div>
          <h1 className="font-bold text-slate-900 text-sm">{TASK.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {!submitted && <Timer initialSeconds={TASK.timeMinutes * 60} />}
          <span className={`text-sm font-semibold ${wordCount >= TASK.minWords ? "text-green-600" : "text-slate-400"}`}>
            {wordCount}/{TASK.minWords} từ
          </span>
          {!submitted && (
            <Button size="sm" onClick={handleSubmit} disabled={wordCount < TASK.minWords}>
              Nộp bài & Chấm AI
            </Button>
          )}
        </div>
      </div>

      <div className={`flex flex-1 overflow-hidden ${submitted ? "flex-col" : ""}`}>
        {!submitted ? (
          <>
            {/* Prompt */}
            <div className="w-2/5 border-r border-slate-200 overflow-y-auto p-6 bg-slate-50">
              <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wide">Đề bài</p>
              <p className="text-slate-700 leading-relaxed font-serif text-[15px] whitespace-pre-line">{TASK.prompt}</p>
            </div>
            {/* Editor */}
            <div className="flex-1 flex flex-col p-6">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 w-full border border-slate-200 rounded-xl p-4 text-[15px] leading-relaxed font-serif resize-none focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent"
                placeholder="Bắt đầu viết bài của bạn tại đây..."
              />
              {/* BUG-12 fix: show auto-save timestamp (TC-WRI-05) */}
              <p className="text-xs text-slate-400 mt-2">
                {lastSaved ? `Đã lưu tự động lúc ${lastSaved}` : "Bài nháp được lưu tự động mỗi 30 giây"}
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary-700 animate-spin mb-4" />
                <p className="text-slate-600 font-medium">AI đang chấm bài của bạn...</p>
                <p className="text-sm text-slate-400 mt-1">Thường mất dưới 30 giây</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-10">
                <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
                <p className="text-red-600 font-medium">{error}</p>
                <Button className="mt-4" onClick={() => { setSubmitted(false); setError(""); }}>Thử lại</Button>
              </div>
            ) : feedback ? (
              <div className="space-y-5">
                {/* Overall */}
                <div className="flex items-center gap-4 p-5 bg-primary-50 rounded-xl border border-primary-100">
                  <BandScore score={feedback.overallBand} size="lg" />
                  <div>
                    <p className="text-sm text-slate-500">Band score ước tính</p>
                    <p className="text-2xl font-bold text-primary-700">{feedback.overallBand.toFixed(1)}</p>
                  </div>
                </div>

                {/* Criteria */}
                <div className="grid md:grid-cols-2 gap-4">
                  {criteriaLabels.map(({ key, label }) => {
                    const c = feedback[key];
                    return (
                      <div key={key} className="p-4 border border-slate-200 rounded-xl bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-semibold text-sm text-slate-700">{label}</p>
                          <BandScore score={c.score} size="sm" />
                        </div>
                        <div className="space-y-2">
                          {c.strengths.map((s, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-green-700">
                              <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                              <span>{s}</span>
                            </div>
                          ))}
                          {c.improvements.map((s, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-amber-700">
                              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                              <span>{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Suggestions */}
                {feedback.suggestions.length > 0 && (
                  <div className="p-4 border border-slate-200 rounded-xl bg-white">
                    <p className="font-semibold text-sm text-slate-700 mb-3">Gợi ý từ vựng nâng cao</p>
                    <div className="space-y-3">
                      {feedback.suggestions.map((s, i) => (
                        <div key={i} className="text-sm">
                          <span className="line-through text-slate-400">{s.original}</span>
                          {" → "}
                          <span className="font-semibold text-primary-700">{s.suggested}</span>
                          <p className="text-xs text-slate-500 mt-0.5">{s.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Bài viết của bạn</p>
                  <p className="text-sm text-slate-700 leading-relaxed font-serif whitespace-pre-line">{text}</p>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
