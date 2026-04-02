"use client";
import { useState, useEffect, useCallback } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerProps {
  initialSeconds: number;
  onExpire?: () => void;
  className?: string;
}

export function Timer({ initialSeconds, onExpire, className }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) { onExpire?.(); return; }
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds, onExpire]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const urgent = seconds < 300;

  return (
    <div className={cn("flex items-center gap-1.5 font-mono text-sm font-semibold", urgent ? "text-red-600" : "text-slate-700", className)}>
      <Clock className="w-4 h-4" />
      {mm}:{ss}
    </div>
  );
}
