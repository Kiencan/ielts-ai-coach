import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBand(band: number | null | undefined): string {
  if (band == null) return "—";
  return band.toFixed(1);
}

// IELTS Academic Reading/Listening band conversion (40-question standard)
// Source: Official Cambridge IELTS band score conversion tables
const IELTS_40Q_TABLE: [number, number][] = [
  [39, 9.0], [37, 8.5], [35, 8.0], [33, 7.5], [30, 7.0],
  [27, 6.5], [23, 6.0], [19, 5.5], [15, 5.0], [10, 4.5],
];

export function calcIeltsBand(rawScore: number, total: number): number {
  if (total <= 0) return 4.0;
  // Normalise to 40-question scale for consistent band lookup
  const score40 = total === 40 ? rawScore : Math.round((rawScore / total) * 40);
  for (const [minScore, band] of IELTS_40Q_TABLE) {
    if (score40 >= minScore) return band;
  }
  return 4.0;
}

// SM-2 algorithm for spaced repetition
export function sm2(
  easeFactor: number,
  intervalDays: number,
  repetitions: number,
  quality: number // 0=fail, 1=hard, 2=easy, 3=perfect
): { easeFactor: number; intervalDays: number; repetitions: number; nextReviewAt: Date } {
  let newEF = easeFactor;
  let newInterval = intervalDays;
  let newRepetitions = repetitions;

  if (quality < 1) {
    newRepetitions = 0;
    newInterval = 1;
  } else {
    newEF = Math.max(1.3, easeFactor + 0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
    if (repetitions === 0) newInterval = 1;
    else if (repetitions === 1) newInterval = 6;
    else newInterval = Math.round(intervalDays * newEF);
    newRepetitions = repetitions + 1;
  }

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);

  return { easeFactor: newEF, intervalDays: newInterval, repetitions: newRepetitions, nextReviewAt };
}
