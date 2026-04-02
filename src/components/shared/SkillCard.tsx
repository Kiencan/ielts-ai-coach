import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BandScore } from "./BandScore";

interface SkillCardProps {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  band?: number | null;
  color: string;
}

export function SkillCard({ title, href, icon: Icon, description, band, color }: SkillCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <BandScore score={band} size="sm" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
