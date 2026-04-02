"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BandScore } from "@/components/shared/BandScore";
import { Mic, Square, Play, Pause, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const TASK = {
  part: 2,
  title: "Describe a memorable trip",
  cueCard: {
    topic: "Describe a memorable trip you have taken.",
    prompts: ["where you went", "who you went with", "what you did there", "why it was memorable"],
  },
  followUpQuestions: [
    "Do Vietnamese people travel a lot nowadays?",
    "How has tourism changed in Vietnam in the last decade?",
    "What are the advantages and disadvantages of international travel?",
  ],
  prepSeconds: 120,
  speakSeconds: 180,
};

interface SpeakingFeedback {
  transcript: string;
  fluencyScore: number;
  lexicalScore: number;
  grammarScore: number;
  pronunciationNote: string;
  overallBand: number;
  strengths: string[];
  improvements: string[];
  suggestions: { original: string; suggested: string }[];
}

type Stage = "intro" | "prep" | "recording" | "processing" | "result";

export default function SpeakingPracticePage({ params }: { params: { id: string } }) {
  const [stage, setStage] = useState<Stage>("intro");
  const [prepLeft, setPrepLeft] = useState(TASK.prepSeconds);
  const [recordLeft, setRecordLeft] = useState(TASK.speakSeconds);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [error, setError] = useState("");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startPrep = useCallback(async () => {
    setStage("prep");
    setPrepLeft(TASK.prepSeconds);
    const interval = setInterval(() => {
      setPrepLeft((p) => {
        if (p <= 1) { clearInterval(interval); startRecording(); return 0; }
        return p - 1;
      });
    }, 1000);
    timerRef.current = interval;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        setAudioBlob(blob);
        submitAudio(blob);
      };
      mediaRecorder.current.start();
      setStage("recording");
      setRecordLeft(TASK.speakSeconds);
      const interval = setInterval(() => {
        setRecordLeft((p) => {
          if (p <= 1) { clearInterval(interval); stopRecording(); return 0; }
          return p - 1;
        });
      }, 1000);
    } catch {
      setError("Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current?.state !== "inactive") {
      mediaRecorder.current?.stop();
      mediaRecorder.current?.stream.getTracks().forEach((t) => t.stop());
    }
    setStage("processing");
  }, []);

  async function submitAudio(blob: Blob) {
    setStage("processing");
    try {
      const form = new FormData();
      form.append("audio", blob, "speaking.webm");
      form.append("part", String(TASK.part));
      form.append("topic", TASK.cueCard.topic);
      const res = await fetch("/api/ai/grade-speaking", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Lỗi phân tích");
      setFeedback(data.data);
      setStage("result");
    } catch (e: any) {
      setError(e.message);
      setStage("result");
    }
  }

  const mm = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Badge variant="purple">Part {TASK.part}</Badge>
        <h1 className="font-bold text-slate-900 text-xl">{TASK.title}</h1>
      </div>

      {/* Cue Card */}
      <div className="p-5 bg-amber-50 border-2 border-amber-200 rounded-xl mb-6">
        <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">Cue Card</p>
        <p className="font-semibold text-slate-900 mb-3">{TASK.cueCard.topic}</p>
        <p className="text-sm text-slate-600 mb-1">You should say:</p>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-0.5">
          {TASK.cueCard.prompts.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </div>

      {stage === "intro" && (
        <div className="text-center space-y-4">
          <p className="text-slate-600">Bạn sẽ có <strong>2 phút chuẩn bị</strong>, sau đó <strong>nói tối đa 3 phút</strong>.</p>
          <p className="text-sm text-slate-400">Đảm bảo microphone đã được cấp quyền trước khi bắt đầu.</p>
          <Button size="lg" onClick={startPrep}><Mic className="w-4 h-4" /> Bắt đầu chuẩn bị</Button>
        </div>
      )}

      {stage === "prep" && (
        <div className="text-center space-y-3 py-6">
          <p className="text-slate-600 font-medium">Thời gian chuẩn bị</p>
          <div className="text-5xl font-bold text-primary-700 font-mono">{mm(prepLeft)}</div>
          <p className="text-sm text-slate-400">Ghi âm sẽ tự động bắt đầu khi hết giờ</p>
        </div>
      )}

      {stage === "recording" && (
        <div className="text-center space-y-4 py-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Mic className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-bold">Đang ghi âm...</p>
          <div className="text-4xl font-bold text-slate-900 font-mono">{mm(recordLeft)}</div>
          <Button variant="destructive" onClick={stopRecording}><Square className="w-4 h-4" /> Kết thúc ghi âm</Button>
        </div>
      )}

      {stage === "processing" && (
        <div className="text-center py-10 space-y-3">
          <Loader2 className="w-10 h-10 text-primary-700 animate-spin mx-auto" />
          <p className="text-slate-600 font-medium">AI đang phân tích bài nói của bạn...</p>
          <p className="text-sm text-slate-400">Thường mất 20–40 giây</p>
        </div>
      )}

      {stage === "result" && (
        <div className="space-y-4">
          {error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          ) : feedback ? (
            <>
              <div className="flex items-center gap-4 p-5 bg-primary-50 border border-primary-100 rounded-xl">
                <BandScore score={feedback.overallBand} size="lg" />
                <div>
                  <p className="text-sm text-slate-500">Band score ước tính</p>
                  <p className="text-2xl font-bold text-primary-700">{feedback.overallBand.toFixed(1)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Fluency & Coherence", score: feedback.fluencyScore },
                  { label: "Lexical Resource", score: feedback.lexicalScore },
                  { label: "Grammatical Range", score: feedback.grammarScore },
                  { label: "Pronunciation", note: feedback.pronunciationNote },
                ].map((c) => (
                  <div key={c.label} className="p-3 border border-slate-200 rounded-xl bg-white">
                    <p className="text-xs font-semibold text-slate-500 mb-1">{c.label}</p>
                    {c.score != null ? <BandScore score={c.score} size="sm" /> : <p className="text-sm text-slate-700">{c.note}</p>}
                  </div>
                ))}
              </div>

              <div className="p-4 border border-slate-200 rounded-xl bg-white">
                <p className="font-semibold text-sm text-slate-700 mb-2">Transcript</p>
                <p className="text-sm text-slate-600 leading-relaxed italic">"{feedback.transcript}"</p>
              </div>

              <div className="p-4 border border-slate-200 rounded-xl bg-white space-y-2">
                <p className="font-semibold text-sm text-slate-700 mb-2">Nhận xét</p>
                {feedback.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-green-700">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {s}
                  </div>
                ))}
                {feedback.improvements.map((s, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-amber-700">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {s}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
