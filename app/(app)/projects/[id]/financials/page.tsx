import { notFound } from "next/navigation";
import { requireProjectOwner } from "@/lib/project-auth";
import { getProjectSections } from "@/lib/sections.server";
import { SectionCard } from "@/components/reports/section-card";
import { RiskTable, GoToMarketTimeline } from "@/components/reports/content-views";
import { BarComparisonChart } from "@/components/charts/bar-comparison-chart";
import { StatTile } from "@/components/charts/stat-tile";
import { Card, CardContent } from "@/components/ui/card";

const scenarioLabels = { best: "Best case", expected: "Expected case", worst: "Worst case" } as const;

export default async function FinancialsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { project } = await requireProjectOwner(id);
  if (!project) notFound();

  const sections = await getProjectSections(id);
  const projection = sections.FINANCIAL_PROJECTION;
  const scenarios = sections.FINANCIAL_SCENARIOS;
  const risks = sections.RISK_ASSESSMENT;
  const gtm = sections.GO_TO_MARKET;

  const currency = project.currency;
  const money = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, notation: "compact", maximumFractionDigits: 1 }).format(v);

  return (
    <div className="space-y-6">
      <SectionCard
        projectId={id}
        type="FINANCIAL_PROJECTION"
        title="Financial Projection"
        source={projection?.source ?? null}
        confidenceScore={projection?.confidenceScore ?? null}
        empty={!projection}
      >
        {projection && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              <StatTile label="5-Year ROI" value={Math.round(projection.content.roiPct)} suffix="%" />
              <StatTile label="Break-even (months)" value={projection.content.breakEvenMonth} />
            </div>
            <BarComparisonChart
              data={projection.content.years.map((y) => ({ year: y.year, revenue: y.revenue, cost: y.cost }))}
              xKey="year"
              series={[
                { key: "revenue", label: "Revenue", color: "var(--chart-1)" },
                { key: "cost", label: "Cost", color: "var(--chart-5)" },
              ]}
              currency={currency}
            />
          </div>
        )}
      </SectionCard>

      <SectionCard
        projectId={id}
        type="FINANCIAL_SCENARIOS"
        title="Scenario Analysis"
        source={scenarios?.source ?? null}
        confidenceScore={scenarios?.confidenceScore ?? null}
        empty={!scenarios}
      >
        {scenarios && (
          <div className="space-y-4">
            <BarComparisonChart
              data={(["worst", "expected", "best"] as const).map((k) => ({
                scenario: scenarioLabels[k],
                revenue: scenarios.content[k].revenueYear3,
              }))}
              xKey="scenario"
              series={[{ key: "revenue", label: "Year 3 revenue", color: "var(--chart-1)" }]}
              currency={currency}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              {(["worst", "expected", "best"] as const).map((k) => (
                <Card key={k}>
                  <CardContent className="pt-5">
                    <p className="text-sm font-medium">{scenarioLabels[k]}</p>
                    <p className="text-xs text-muted-foreground">NPV {money(scenarios.content[k].npv)} · IRR {scenarios.content[k].irrPct}%</p>
                    <p className="mt-2 text-sm text-muted-foreground">{scenarios.content[k].note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        projectId={id}
        type="RISK_ASSESSMENT"
        title="Risk Assessment"
        source={risks?.source ?? null}
        confidenceScore={risks?.confidenceScore ?? null}
        empty={!risks}
      >
        {risks && <RiskTable content={risks.content} />}
      </SectionCard>

      <SectionCard
        projectId={id}
        type="GO_TO_MARKET"
        title="Go-to-Market Strategy"
        source={gtm?.source ?? null}
        confidenceScore={gtm?.confidenceScore ?? null}
        empty={!gtm}
      >
        {gtm && <GoToMarketTimeline content={gtm.content} />}
      </SectionCard>
    </div>
  );
}
