"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const steps = [
  { id: "goal", label: "Mục tiêu" },
  { id: "level", label: "Trình độ" },
  { id: "done", label: "Hoàn tất" },
];

const bands = ["4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5+"];
const currentBands = ["Chưa biết", "4.0–4.5", "5.0–5.5", "6.0–6.5", "7.0+"];
const examDates = ["Chưa định", "1–3 tháng", "3–6 tháng", "6–12 tháng"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [targetBand, setTargetBand] = useState("");
  const [currentBand, setCurrentBand] = useState("");
  const [examDate, setExamDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFinish() {
    setLoading(true);
    await fetch("/api/auth/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetBand, currentBand }),
    });
    router.push("/dashboard");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 mb-2">
          {steps.map((s, i) => (
            <div key={s.id} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary-700" : "bg-slate-200"}`} />
          ))}
        </div>
        <CardTitle>
          {step === 0 && "Mục tiêu của bạn là gì?"}
          {step === 1 && "Trình độ hiện tại của bạn?"}
          {step === 2 && "Sẵn sàng bắt đầu!"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Band score mục tiêu</p>
              <div className="grid grid-cols-5 gap-2">
                {bands.map((b) => (
                  <button
                    key={b} onClick={() => setTargetBand(b)}
                    className={`py-2 text-sm border rounded-lg font-medium transition-colors ${targetBand === b ? "bg-primary-700 text-white border-primary-700" : "border-slate-200 hover:border-primary-700 hover:text-primary-700"}`}
                  >{b}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Ngày thi dự kiến</p>
              <div className="grid grid-cols-2 gap-2">
                {examDates.map((d) => (
                  <button
                    key={d} onClick={() => setExamDate(d)}
                    className={`py-2 text-sm border rounded-lg transition-colors ${examDate === d ? "bg-primary-50 text-primary-700 border-primary-700 font-semibold" : "border-slate-200 hover:border-primary-700"}`}
                  >{d}</button>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={() => setStep(1)} disabled={!targetBand}>Tiếp theo</Button>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-slate-700 mb-2">Band score hiện tại của bạn</p>
            <div className="space-y-2">
              {currentBands.map((b) => (
                <button
                  key={b} onClick={() => setCurrentBand(b)}
                  className={`w-full py-2.5 text-sm border rounded-lg text-left px-4 transition-colors ${currentBand === b ? "bg-primary-50 text-primary-700 border-primary-700 font-semibold" : "border-slate-200 hover:border-primary-700"}`}
                >{b}</button>
              ))}
            </div>
            <Button className="w-full" onClick={() => setStep(2)} disabled={!currentBand}>Tiếp theo</Button>
          </div>
        )}
        {step === 2 && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-1">Lộ trình học đã được tạo!</p>
              <p className="text-sm text-slate-500">Mục tiêu: Band {targetBand} · Trình độ hiện tại: {currentBand}</p>
            </div>
            <Button className="w-full" onClick={handleFinish} disabled={loading}>
              {loading ? "Đang chuẩn bị..." : "Vào học ngay →"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
