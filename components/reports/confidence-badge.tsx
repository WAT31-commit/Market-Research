import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConfidenceBadge({ score }: { score: number | null }) {
  if (score == null) return null;
  const tone =
    score >= 75 ? "text-status-good" : score >= 55 ? "text-status-warning" : "text-status-serious";
  return (
    <Badge variant="outline" className={cn("gap-1 font-normal", tone)}>
      <Sparkles className="size-3" />
      {score}% confidence
    </Badge>
  );
}
