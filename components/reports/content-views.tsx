import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  ExecSummaryContent,
  SwotContent,
  PestleContent,
  CustomerPersonaContent,
  CustomerSegmentationContent,
  RiskAssessmentContent,
  GoToMarketContent,
  ForceLevel,
} from "@/lib/section-types";

export function ExecSummaryView({ content }: { content: ExecSummaryContent }) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed">{content.summary}</p>
      <div>
        <p className="mb-2 text-sm font-medium">Key findings</p>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {content.keyFindings.map((f, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary">•</span>
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
        <span className="font-medium">Recommendation: </span>
        {content.recommendation}
      </div>
    </div>
  );
}

const SWOT_META: { key: keyof SwotContent; label: string; tone: string }[] = [
  { key: "strengths", label: "Strengths", tone: "border-status-good/30 bg-status-good/5" },
  { key: "weaknesses", label: "Weaknesses", tone: "border-status-serious/30 bg-status-serious/5" },
  { key: "opportunities", label: "Opportunities", tone: "border-chart-1/30 bg-chart-1/5" },
  { key: "threats", label: "Threats", tone: "border-status-critical/30 bg-status-critical/5" },
];

export function SwotGrid({ content }: { content: SwotContent }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {SWOT_META.map((meta) => (
        <div key={meta.key} className={cn("rounded-lg border p-3", meta.tone)}>
          <p className="mb-2 text-sm font-medium">{meta.label}</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {content[meta.key].map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const PESTLE_META: { key: keyof PestleContent; label: string }[] = [
  { key: "political", label: "Political" },
  { key: "economic", label: "Economic" },
  { key: "social", label: "Social" },
  { key: "technological", label: "Technological" },
  { key: "legal", label: "Legal" },
  { key: "environmental", label: "Environmental" },
];

export function PestleGrid({ content }: { content: PestleContent }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {PESTLE_META.map((meta) => (
        <div key={meta.key} className="rounded-lg border border-border p-3">
          <p className="mb-2 text-sm font-medium">{meta.label}</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {content[meta.key].map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function PersonaCards({ content }: { content: CustomerPersonaContent }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {content.personas.map((p, i) => (
        <div key={i} className="rounded-lg border border-border p-4">
          <p className="font-medium">
            {p.name} <span className="font-normal text-muted-foreground">· {p.ageRange}</span>
          </p>
          <p className="mb-2 text-sm text-muted-foreground">{p.role}</p>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Goals</p>
          <ul className="mb-2 space-y-0.5 text-sm">
            {p.goals.map((g, gi) => (
              <li key={gi}>• {g}</li>
            ))}
          </ul>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Pain points</p>
          <ul className="mb-2 space-y-0.5 text-sm">
            {p.painPoints.map((pp, pi) => (
              <li key={pi}>• {pp}</li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">{p.behavior}</p>
        </div>
      ))}
    </div>
  );
}

export function SegmentBars({ content }: { content: CustomerSegmentationContent }) {
  return (
    <div className="space-y-3">
      {content.segments.map((s, i) => (
        <div key={i}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium">{s.name}</span>
            <span className="text-muted-foreground">
              {s.sizePct}% · {s.priceSensitivity} price sensitivity
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-chart-1" style={{ width: `${s.sizePct}%` }} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
        </div>
      ))}
    </div>
  );
}

const LEVEL_TONE: Record<ForceLevel, string> = {
  Low: "bg-status-good/15 text-status-good",
  Medium: "bg-status-warning/15 text-status-warning",
  High: "bg-status-critical/15 text-status-critical",
};

export function RiskTable({ content }: { content: RiskAssessmentContent }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="py-2 pr-3 font-medium">Risk</th>
            <th className="py-2 pr-3 font-medium">Category</th>
            <th className="py-2 pr-3 font-medium">Likelihood</th>
            <th className="py-2 pr-3 font-medium">Impact</th>
            <th className="py-2 font-medium">Mitigation</th>
          </tr>
        </thead>
        <tbody>
          {content.risks.map((r, i) => (
            <tr key={i} className="border-b border-border/60 last:border-0">
              <td className="py-2 pr-3 font-medium">{r.name}</td>
              <td className="py-2 pr-3 text-muted-foreground">{r.category}</td>
              <td className="py-2 pr-3">
                <Badge className={cn("font-normal", LEVEL_TONE[r.likelihood])} variant="outline">
                  {r.likelihood}
                </Badge>
              </td>
              <td className="py-2 pr-3">
                <Badge className={cn("font-normal", LEVEL_TONE[r.impact])} variant="outline">
                  {r.impact}
                </Badge>
              </td>
              <td className="py-2 text-muted-foreground">{r.mitigation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GoToMarketTimeline({ content }: { content: GoToMarketContent }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {content.phases.map((phase, i) => (
          <div key={i} className="rounded-lg border border-border p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">{phase.timeframe}</p>
            <p className="mb-2 font-medium">{phase.name}</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {phase.actions.map((a, ai) => (
                <li key={ai}>• {a}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Channels:</span>
        {content.channels.map((c) => (
          <Badge key={c} variant="secondary" className="font-normal">
            {c}
          </Badge>
        ))}
      </div>
      <p className="text-sm">
        <span className="font-medium">Pricing strategy: </span>
        {content.pricingStrategy}
      </p>
    </div>
  );
}
