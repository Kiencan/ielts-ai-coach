import { cn } from "@/lib/utils";

interface BandScoreProps {
  score: number | null | undefined;
  size?: "sm" | "md" | "lg";
}

export function BandScore({ score, size = "md" }: BandScoreProps) {
  const sizes = { sm: "w-8 h-8 text-sm", md: "w-10 h-10 text-base", lg: "w-14 h-14 text-xl" };
  const color =
    score == null ? "bg-slate-100 text-slate-400"
    : score >= 7 ? "bg-green-100 text-green-700"
    : score >= 5.5 ? "bg-amber-100 text-amber-700"
    : "bg-red-100 text-red-600";

  return (
    <div className={cn("rounded-lg font-bold flex items-center justify-center flex-shrink-0", sizes[size], color)}>
      {score != null ? score.toFixed(1) : "—"}
    </div>
  );
}
