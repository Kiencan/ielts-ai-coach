"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer } from "@/components/shared/Timer";
import { CheckCircle, XCircle, Info } from "lucide-react";
import { WordLookup } from "@/components/shared/WordLookup";

const PASSAGE = {
  title: "The History of Coffee",
  text: `Coffee is one of the world's most popular beverages, consumed by billions of people every day. Its origins can be traced back to the ancient coffee forests of the Ethiopian plateau, where legend has it that the goat herder Kaldi first noticed the effects of these plants when his goats, after eating berries from a certain tree, became so energetic that they did not want to sleep at night.

Kaldi reportedly shared his discovery with the local monastery and the abbot made a drink with the berries. Finding that the drink kept him alert through the long hours of evening prayer, he shared his discovery with the other monks. Knowledge of the energizing berries spread eastward and coffee was first cultivated and traded in the Arabian Peninsula.

By the 15th century, coffee was being grown in the Yemeni district of Arabia and by the 16th century it was known in the rest of the Middle East, Persia, Turkey, and northern Africa. Coffee cultivation spread throughout the Americas in the 18th century, first to Haiti in 1720 and later to Brazil, which today produces approximately one-third of all coffee in the world.

The word 'coffee' itself is derived from the Dutch word 'koffie', which was borrowed from Ottoman Turkish 'kahve', which in turn was borrowed from the Arabic 'qahwah'. Modern coffee cultivation depends heavily on a narrow band of land known as the 'Bean Belt', which runs between the Tropics of Cancer and Capricorn.`,
  questions: [
    { id: "q1", type: "tfng", statement: "Coffee was first discovered in Ethiopia.", answer: "TRUE", explanation: "Paragraph 1: 'Its origins can be traced back to the ancient coffee forests of the Ethiopian plateau'" },
    { id: "q2", type: "tfng", statement: "Kaldi was a monk at a local monastery.", answer: "FALSE", explanation: "Paragraph 1: Kaldi was a 'goat herder', not a monk. He shared the discovery WITH the monastery." },
    { id: "q3", type: "tfng", statement: "The monks used coffee berries to help them stay awake.", answer: "TRUE", explanation: "Paragraph 2: 'the drink kept him alert through the long hours of evening prayer'" },
    { id: "q4", type: "tfng", statement: "Coffee was grown in Yemen before it spread to Turkey.", answer: "TRUE", explanation: "Paragraph 3: 'coffee was being grown in the Yemeni district of Arabia... it was known in... Turkey'" },
    { id: "q5", type: "tfng", statement: "Brazil was the first country in the Americas to cultivate coffee.", answer: "FALSE", explanation: "Paragraph 3: Haiti received coffee first (1720), then Brazil." },
    { id: "q6", type: "short_answer", question: "What percentage of world coffee does Brazil produce?", answer: "one-third / 1/3 / approximately one-third", explanation: "Paragraph 3: 'Brazil, which today produces approximately one-third of all coffee in the world'" },
    { id: "q7", type: "short_answer", question: "What is the term for the region where most coffee is grown?", answer: "Bean Belt", explanation: "Paragraph 4: 'a narrow band of land known as the Bean Belt'" },
  ],
};

type TFNGAnswer = "TRUE" | "FALSE" | "NOT GIVEN";

export default function ReadingPracticePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [highlighted, setHighlighted] = useState("");
  const [lookup, setLookup] = useState<{ word: string; x: number; y: number } | null>(null);

  // S2-12: double-click to look up a word
  function handlePassageDoubleClick(e: React.MouseEvent) {
    const selection = window.getSelection();
    const word = selection?.toString().trim().replace(/[^a-zA-Z'-]/g, "");
    if (!word) return;
    setLookup({ word, x: e.clientX, y: e.clientY });
  }
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // S2-11: restore draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`reading-draft-${params.id}`);
    if (saved) {
      try { setAnswers(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, [params.id]);

  // S2-11: auto-save answers every 30s
  useEffect(() => {
    if (submitted || Object.keys(answers).length === 0) return;
    const t = setInterval(() => {
      localStorage.setItem(`reading-draft-${params.id}`, JSON.stringify(answers));
      const now = new Date();
      setLastSaved(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`);
    }, 30000);
    return () => clearInterval(t);
  }, [answers, submitted, params.id]);

  // BUG-07 fix: define handleSubmit before handleExpire, wrap both with useCallback
  const handleSubmit = useCallback(() => {
    setSubmitted(true);
  }, []);

  const handleExpire = useCallback(() => {
    setSubmitted((prev) => { if (!prev) return true; return prev; });
  }, []);

  function getScore() {
    let correct = 0;
    PASSAGE.questions.forEach((q) => {
      const userAns = (answers[q.id] || "").trim().toUpperCase();
      if (!userAns) return; // BUG-01 fix: empty answer is never correct
      const correctAns = q.answer.toUpperCase();
      if (userAns === correctAns || correctAns.includes(userAns)) correct++;
    });
    return correct;
  }

  const score = submitted ? getScore() : 0;

  return (
    <div className="h-[calc(100vh-0px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white">
        <div>
          <h1 className="font-bold text-slate-900">{PASSAGE.title}</h1>
          <p className="text-xs text-slate-500">{PASSAGE.questions.length} câu hỏi · Academic Reading</p>
        </div>
        <div className="flex items-center gap-4">
          {!submitted && <Timer initialSeconds={20 * 60} onExpire={handleExpire} />}
          {submitted ? (
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary-700">{score}/{PASSAGE.questions.length}</span>
              <Button size="sm" onClick={() => router.push("/reading")}>Về danh sách</Button>
            </div>
          ) : (
            <Button size="sm" onClick={handleSubmit} disabled={Object.keys(answers).length < PASSAGE.questions.length}>
              Nộp bài ({Object.keys(answers).length}/{PASSAGE.questions.length})
            </Button>
          )}
        </div>
      </div>

      {/* Split Pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Passage */}
        <div className="w-1/2 border-r border-slate-200 overflow-y-auto p-6 bg-white flex flex-col">
          <p
            className="font-serif text-slate-800 leading-relaxed whitespace-pre-line text-[15px] flex-1 select-text cursor-text"
            onDoubleClick={handlePassageDoubleClick}
          >
            {PASSAGE.text}
          </p>
          {!submitted && (
            <p className="text-xs text-slate-400 mt-4">
              {lastSaved ? `Đã lưu tự động lúc ${lastSaved}` : "Câu trả lời được lưu tự động mỗi 30 giây"}
            </p>
          )}
        </div>

        {/* Questions */}
        <div className="w-1/2 overflow-y-auto p-6 space-y-5">
          {!submitted && (
            <div className="p-3 bg-primary-50 rounded-lg text-sm text-primary-700 flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Double-click vào từ bất kỳ trong bài đọc để tra từ điển.
            </div>
          )}

          {submitted && (
            <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
              <p className="font-bold text-primary-700 text-lg">{score}/{PASSAGE.questions.length} câu đúng</p>
              <p className="text-sm text-slate-600">Band ước tính: {(4 + (score / PASSAGE.questions.length) * 5).toFixed(1)}</p>
            </div>
          )}

          {PASSAGE.questions.map((q, i) => {
            const isCorrect = submitted && (answers[q.id] || "").toUpperCase().includes(q.answer.toUpperCase().split("/")[0].trim());
            return (
              <div key={q.id} className={`p-4 rounded-xl border transition-colors ${submitted ? (isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50") : "border-slate-200 bg-white"}`}>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Câu {i + 1}. {q.type === "tfng" ? q.statement : q.question}
                </p>

                {q.type === "tfng" ? (
                  <div className="flex gap-2 flex-wrap">
                    {(["TRUE", "FALSE", "NOT GIVEN"] as TFNGAnswer[]).map((opt) => (
                      <button
                        key={opt}
                        disabled={submitted}
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          answers[q.id] === opt
                            ? submitted
                              ? opt === q.answer ? "bg-green-600 text-white border-green-600" : "bg-red-500 text-white border-red-500"
                              : "bg-primary-700 text-white border-primary-700"
                            : submitted && opt === q.answer
                            ? "bg-green-100 text-green-700 border-green-300"
                            : "border-slate-300 text-slate-600 hover:border-primary-700"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    disabled={submitted}
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder="Nhập câu trả lời..."
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700"
                  />
                )}

                {submitted && (
                  <div className="mt-2 flex items-start gap-1.5">
                    {isCorrect ? <CheckCircle className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />}
                    <div className="text-xs">
                      {!isCorrect && <span className="text-red-600 font-semibold">Đáp án: {q.answer} · </span>}
                      <span className="text-slate-500">{q.explanation}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* S2-12: word lookup popup */}
      {lookup && (
        <WordLookup
          word={lookup.word}
          x={lookup.x}
          y={lookup.y}
          onClose={() => setLookup(null)}
        />
      )}
    </div>
  );
}
