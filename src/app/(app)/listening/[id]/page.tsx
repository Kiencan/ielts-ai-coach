"use client";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer } from "@/components/shared/Timer";
import { Volume2, Play, Pause, CheckCircle, XCircle } from "lucide-react";

const AUDIO_DATA = {
  title: "Accommodation Enquiry",
  section: 1,
  audioText: "[Audio sẽ được phát ở đây — kết nối với file audio thật khi deploy]",
  questions: [
    { id: "q1", type: "form", label: "Tên người thuê:", answer: "Johnson", placeholder: "Nhập họ tên..." },
    { id: "q2", type: "form", label: "Số điện thoại:", answer: "0912345678", placeholder: "Nhập số điện thoại..." },
    { id: "q3", type: "form", label: "Loại phòng mong muốn:", answer: "single", placeholder: "single / double / studio" },
    { id: "q4", type: "multiple", label: "Trang thiết bị được yêu cầu:", answer: "B", options: [{ value: "A", text: "Bãi đỗ xe riêng" }, { value: "B", text: "Máy giặt" }, { value: "C", text: "Ban công" }] },
    { id: "q5", type: "multiple", label: "Giá thuê phù hợp:", answer: "C", options: [{ value: "A", text: "Dưới 3 triệu/tháng" }, { value: "B", text: "3–5 triệu/tháng" }, { value: "C", text: "5–7 triệu/tháng" }] },
    { id: "q6", type: "form", label: "Ngày dọn vào:", answer: "15 tháng 5", placeholder: "Ngày / tháng..." },
    { id: "q7", type: "form", label: "Thời gian thuê:", answer: "6 tháng", placeholder: "Số tháng..." },
    { id: "q8", type: "multiple", label: "Người giới thiệu:", answer: "A", options: [{ value: "A", text: "Bạn bè" }, { value: "B", text: "Internet" }, { value: "C", text: "Báo" }] },
  ],
};

export default function ListeningPracticePage({ params }: { params: { id: string } }) {
  const [playing, setPlaying] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false); // BUG-13 fix
  const audioRef = useRef<HTMLAudioElement>(null);

  function togglePlay() {
    setPlaying(!playing);
    setAudioPlayed(true);
    // audioRef.current?.play() or pause() — hooked to real audio when available
  }

  // BUG-13 fix: warn if unanswered questions remain (TC-LIS-04)
  function handleSubmitClick() {
    const unanswered = AUDIO_DATA.questions.length - Object.keys(answers).length;
    if (unanswered > 0 && !confirmSubmit) {
      setConfirmSubmit(true);
    } else {
      handleSubmit();
    }
  }

  function handleSubmit() {
    setConfirmSubmit(false);
    setSubmitted(true);
  }

  function getScore() {
    return AUDIO_DATA.questions.filter((q) => {
      const user = (answers[q.id] || "").trim().toLowerCase();
      return user === q.answer.toLowerCase() || user.includes(q.answer.toLowerCase());
    }).length;
  }

  const score = submitted ? getScore() : 0;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Badge variant="blue">Section {AUDIO_DATA.section}</Badge>
          </div>
          <h1 className="font-bold text-slate-900">{AUDIO_DATA.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {!submitted && <Timer initialSeconds={10 * 60} onExpire={handleSubmit} />}
          {submitted ? (
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary-700">{score}/{AUDIO_DATA.questions.length}</span>
            </div>
          ) : (
            <Button size="sm" onClick={handleSubmitClick}>Nộp bài ({Object.keys(answers).length}/{AUDIO_DATA.questions.length})</Button>
          )}
        </div>
      </div>

      {/* BUG-13 fix: confirmation dialog for unanswered questions (TC-LIS-04) */}
      {confirmSubmit && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <p className="font-semibold text-slate-900 mb-2">Còn câu chưa trả lời</p>
            <p className="text-sm text-slate-500 mb-4">
              Bạn còn {AUDIO_DATA.questions.length - Object.keys(answers).length} câu chưa trả lời. Tiếp tục nộp bài?
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmSubmit(false)}>Quay lại</Button>
              <Button className="flex-1" onClick={handleSubmit}>Nộp bài</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full space-y-5">
        {/* Audio Player */}
        <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-xl">
          <button
            onClick={togglePlay}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 hover:bg-slate-100 transition-colors"
          >
            {playing ? <Pause className="w-4 h-4 text-slate-900" /> : <Play className="w-4 h-4 text-slate-900 ml-0.5" />}
          </button>
          <div className="flex-1">
            <div className="h-1 bg-slate-700 rounded-full">
              <div className="h-1 bg-primary-400 rounded-full w-0 transition-all" />
            </div>
          </div>
          <Volume2 className="w-5 h-5 text-slate-400" />
          <span className="text-xs text-slate-400">Chỉ phát 1 lần</span>
        </div>

        {submitted && (
          <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
            <p className="font-bold text-primary-700 text-lg">{score}/{AUDIO_DATA.questions.length} câu đúng</p>
            <p className="text-sm text-slate-600 mt-1">Band ước tính: {(4 + (score / AUDIO_DATA.questions.length) * 5).toFixed(1)}</p>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Điền vào bảng thông tin</p>
          <div className="space-y-4">
            {AUDIO_DATA.questions.map((q, i) => {
              const isCorrect = submitted && ((answers[q.id] || "").toLowerCase().includes(q.answer.toLowerCase()));
              return (
                <div key={q.id} className={`p-3 rounded-lg border ${submitted ? (isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50") : "border-slate-100"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {submitted && (isCorrect
                      ? <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      : <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />)}
                    <label className="text-sm font-medium text-slate-700">{i + 1}. {q.label}</label>
                  </div>

                  {q.type === "form" ? (
                    <input
                      type="text" disabled={submitted} value={answers[q.id] || ""}
                      onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                      placeholder={q.placeholder}
                      className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700 disabled:bg-slate-50"
                    />
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {q.options!.map((opt) => (
                        <button
                          key={opt.value} type="button" disabled={submitted}
                          onClick={() => setAnswers((p) => ({ ...p, [q.id]: opt.value }))}
                          className={`text-left px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                            answers[q.id] === opt.value
                              ? submitted ? (opt.value === q.answer ? "bg-green-600 text-white border-green-600" : "bg-red-500 text-white border-red-500") : "bg-primary-700 text-white border-primary-700"
                              : submitted && opt.value === q.answer ? "bg-green-100 text-green-700 border-green-300"
                              : "border-slate-200 hover:border-primary-700"
                          }`}
                        >
                          {opt.value}. {opt.text}
                        </button>
                      ))}
                    </div>
                  )}
                  {submitted && !isCorrect && (
                    <p className="text-xs text-red-600 mt-1.5 font-medium">Đáp án đúng: {q.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
