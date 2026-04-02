"use client";
import { useState } from "react";
import { BookMarked, Plus, RotateCcw, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";

const SAMPLE_VOCAB = [
  { id: "v1", word: "ubiquitous", definitionVi: "có mặt khắp nơi, phổ biến rộng rãi", exampleSentence: "Smartphones have become ubiquitous in modern society.", topic: "Technology", nextReviewAt: new Date() },
  { id: "v2", word: "deteriorate", definitionVi: "suy giảm, trở nên tệ hơn", exampleSentence: "Air quality continues to deteriorate in major cities.", topic: "Environment", nextReviewAt: new Date() },
  { id: "v3", word: "alleviate", definitionVi: "giảm nhẹ, làm dịu", exampleSentence: "Exercise can help alleviate stress.", topic: "Health", nextReviewAt: new Date() },
  { id: "v4", word: "exacerbate", definitionVi: "làm trầm trọng thêm", exampleSentence: "Poverty can exacerbate social inequality.", topic: "Society", nextReviewAt: new Date() },
  { id: "v5", word: "encompass", definitionVi: "bao gồm, bao hàm", exampleSentence: "The curriculum encompasses a wide range of subjects.", topic: "Education", nextReviewAt: new Date() },
  { id: "v6", word: "paramount", definitionVi: "tối quan trọng, hơn hết thảy", exampleSentence: "Safety is paramount in any workplace.", topic: "General", nextReviewAt: new Date() },
];

const TOPIC_SETS = [
  { name: "Environment", count: 45, color: "bg-green-50 text-green-700 border-green-200" },
  { name: "Technology", count: 38, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { name: "Education", count: 32, color: "bg-purple-50 text-purple-700 border-purple-200" },
  { name: "Health", count: 29, color: "bg-red-50 text-red-700 border-red-200" },
  { name: "Society", count: 41, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { name: "Economy", count: 27, color: "bg-slate-100 text-slate-700 border-slate-200" },
];

type View = "list" | "flashcard" | "add";

export default function VocabularyPage() {
  const [view, setView] = useState<View>("list");
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [newWord, setNewWord] = useState({ word: "", definitionVi: "", example: "", topic: "" });
  const [reviewed, setReviewed] = useState<string[]>([]);
  const dueToday = SAMPLE_VOCAB.filter((v) => !reviewed.includes(v.id));

  function handleReview(id: string, quality: number) {
    setReviewed((p) => [...p, id]);
    setFlipped(false);
    setTimeout(() => setCardIndex((i) => i + 1), 200);
  }

  const currentCard = dueToday[cardIndex];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title="Từ vựng"
        subtitle="Ôn tập thông minh với thuật toán Spaced Repetition (SM-2)."
        action={
          <div className="flex gap-2">
            <Button size="sm" variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}>Danh sách</Button>
            <Button size="sm" variant={view === "flashcard" ? "default" : "outline"} onClick={() => { setView("flashcard"); setCardIndex(0); setFlipped(false); }}>
              Ôn tập ({dueToday.length})
            </Button>
            <Button size="sm" variant={view === "add" ? "default" : "outline"} onClick={() => setView("add")}>
              <Plus className="w-3.5 h-3.5" /> Thêm từ
            </Button>
          </div>
        }
      />

      {view === "list" && (
        <div className="space-y-4">
          {/* Topic Sets */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Bộ từ theo chủ đề</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {TOPIC_SETS.map((t) => (
                  <button key={t.name} className={`p-3 rounded-lg border text-left hover:shadow-sm transition-shadow ${t.color}`}>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs opacity-70">{t.count} từ</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* My Words */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Từ của tôi ({SAMPLE_VOCAB.length})</CardTitle>
                <Badge variant="blue">{dueToday.length} cần ôn hôm nay</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {SAMPLE_VOCAB.map((v, i) => (
                <div key={v.id} className={`flex items-center gap-4 px-5 py-3.5 ${i < SAMPLE_VOCAB.length - 1 ? "border-b border-slate-100" : ""}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-slate-900">{v.word}</span>
                      <Badge variant="gray">{v.topic}</Badge>
                    </div>
                    <p className="text-sm text-slate-500">{v.definitionVi}</p>
                    <p className="text-xs text-slate-400 mt-0.5 italic">"{v.exampleSentence}"</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {view === "flashcard" && (
        <div className="max-w-lg mx-auto">
          {cardIndex >= dueToday.length ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">Xong rồi!</h3>
              <p className="text-slate-500 mb-6">Bạn đã ôn {reviewed.length} từ hôm nay. Tuyệt vời!</p>
              <Button onClick={() => { setReviewed([]); setCardIndex(0); setView("list"); }}>
                <RotateCcw className="w-4 h-4" /> Quay về danh sách
              </Button>
            </div>
          ) : currentCard && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{cardIndex + 1} / {dueToday.length}</span>
                <div className="flex gap-1">
                  {dueToday.map((_, i) => (
                    <div key={i} className={`h-1.5 w-6 rounded-full ${i < cardIndex ? "bg-green-400" : i === cardIndex ? "bg-primary-700" : "bg-slate-200"}`} />
                  ))}
                </div>
              </div>

              <button
                onClick={() => setFlipped(!flipped)}
                className="w-full min-h-[220px] p-8 bg-white border-2 border-slate-200 rounded-2xl text-center hover:border-primary-300 transition-colors cursor-pointer"
              >
                {!flipped ? (
                  <div>
                    <p className="text-xs text-slate-400 mb-4 uppercase tracking-wide">Từ tiếng Anh</p>
                    <p className="text-3xl font-bold text-slate-900">{currentCard.word}</p>
                    <p className="text-sm text-slate-400 mt-6">Nhấn để xem nghĩa</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-slate-400 mb-3 uppercase tracking-wide">Nghĩa tiếng Việt</p>
                    <p className="text-xl font-semibold text-slate-900 mb-4">{currentCard.definitionVi}</p>
                    <p className="text-sm text-slate-500 italic">"{currentCard.exampleSentence}"</p>
                  </div>
                )}
              </button>

              {flipped && (
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Không nhớ", quality: 0, color: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" },
                    { label: "Khó", quality: 1, color: "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100" },
                    { label: "Dễ", quality: 2, color: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100" },
                    { label: "Rất dễ", quality: 3, color: "bg-green-50 text-green-600 border-green-200 hover:bg-green-100" },
                  ].map(({ label, quality, color }) => (
                    <button
                      key={label}
                      onClick={() => handleReview(currentCard.id, quality)}
                      className={`py-2.5 text-xs font-semibold border rounded-xl transition-colors ${color}`}
                    >{label}</button>
                  ))}
                </div>
              )}
              {!flipped && <p className="text-center text-xs text-slate-400">Nhấn vào thẻ để lật</p>}
            </div>
          )}
        </div>
      )}

      {view === "add" && (
        <Card className="max-w-lg">
          <CardHeader><CardTitle className="text-base">Thêm từ mới</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Từ tiếng Anh *</label>
              <input
                type="text" value={newWord.word} onChange={(e) => setNewWord((p) => ({ ...p, word: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                placeholder="e.g. ubiquitous"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nghĩa tiếng Việt *</label>
              <input
                type="text" value={newWord.definitionVi} onChange={(e) => setNewWord((p) => ({ ...p, definitionVi: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                placeholder="e.g. có mặt khắp nơi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Câu ví dụ</label>
              <textarea
                value={newWord.example} onChange={(e) => setNewWord((p) => ({ ...p, example: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-700 resize-none"
                rows={2} placeholder="e.g. Smartphones have become ubiquitous..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Chủ đề</label>
              <div className="flex gap-2 flex-wrap">
                {TOPIC_SETS.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setNewWord((p) => ({ ...p, topic: t.name }))}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${newWord.topic === t.name ? "bg-primary-700 text-white border-primary-700" : "border-slate-200 text-slate-600 hover:border-primary-700"}`}
                  >{t.name}</button>
                ))}
              </div>
            </div>
            <Button className="w-full" disabled={!newWord.word || !newWord.definitionVi}>Thêm vào từ điển</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
