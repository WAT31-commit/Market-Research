import { cn } from "@/lib/utils";

function statusColor(value: number): string {
  if (value >= 70) return "var(--status-good)";
  if (value >= 50) return "var(--status-warning)";
  if (value >= 35) return "var(--status-serious)";
  return "var(--status-critical)";
}

export function StatTile({
  label,
  value,
  suffix = "",
  hint,
  className,
}: {
  label: string;
  value: number;
  suffix?: string;
  hint?: string;
  className?: string;
}) {
  const color = statusColor(value);
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums" style={{ color }}>
        {value}
        <span className="text-lg text-muted-foreground">{suffix}</span>
      </p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
        />
      </div>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
