import { notFound } from "next/navigation";
import { requireProjectOwner } from "@/lib/project-auth";
import { getProjectSections } from "@/lib/sections.server";
import { SectionCard } from "@/components/reports/section-card";
import { SwotGrid, PestleGrid } from "@/components/reports/content-views";
import { PortersRadar } from "@/components/charts/porters-radar";
import { TrendChart, type TrendPoint } from "@/components/charts/trend-chart";
import { StatTile } from "@/components/charts/stat-tile";

export default async function MarketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { project } = await requireProjectOwner(id);
  if (!project) notFound();

  const sections = await getProjectSections(id);
  const marketSize = sections.MARKET_SIZE;
  const swot = sections.SWOT;
  const pestle = sections.PESTLE;
  const porters = sections.PORTERS;

  const trendData: TrendPoint[] = marketSize
    ? [
        ...marketSize.content.historicalGrowth.map((p) => ({ year: p.year, value: p.valueBn, projected: false })),
        ...marketSize.content.projectedGrowth.map((p) => ({ year: p.year, value: p.valueBn, projected: true })),
      ]
    : [];

  return (
    <div className="space-y-6">
      <SectionCard
        projectId={id}
        type="MARKET_SIZE"
        title="Market Size (TAM / SAM / SOM)"
        source={marketSize?.source ?? null}
        confidenceScore={marketSize?.confidenceScore ?? null}
        empty={!marketSize}
      >
        {marketSize && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="TAM ($M)" value={marketSize.content.tam} suffix="" />
              <StatTile label="SAM ($M)" value={marketSize.content.sam} suffix="" />
              <StatTile label="SOM ($M)" value={marketSize.content.som} suffix="" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">
                Growth trend ({marketSize.content.cagrPct}% CAGR) — historical vs. projected (USD bn)
              </p>
              <TrendChart data={trendData} unit="bn" />
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        projectId={id}
        type="SWOT"
        title="SWOT Analysis"
        source={swot?.source ?? null}
        confidenceScore={swot?.confidenceScore ?? null}
        empty={!swot}
      >
        {swot && <SwotGrid content={swot.content} />}
      </SectionCard>

      <SectionCard
        projectId={id}
        type="PESTLE"
        title="PESTLE Analysis"
        source={pestle?.source ?? null}
        confidenceScore={pestle?.confidenceScore ?? null}
        empty={!pestle}
      >
        {pestle && <PestleGrid content={pestle.content} />}
      </SectionCard>

      <SectionCard
        projectId={id}
        type="PORTERS"
        title="Porter's Five Forces"
        source={porters?.source ?? null}
        confidenceScore={porters?.confidenceScore ?? null}
        empty={!porters}
      >
        {porters && (
          <div className="grid gap-4 lg:grid-cols-2">
            <PortersRadar content={porters.content} />
            <div className="space-y-2 text-sm">
              {(
                [
                  ["New entrants", porters.content.newEntrants],
                  ["Supplier power", porters.content.supplierPower],
                  ["Buyer power", porters.content.buyerPower],
                  ["Substitutes", porters.content.substitutes],
                  ["Rivalry", porters.content.rivalry],
                ] as const
              ).map(([label, force]) => (
                <div key={label} className="rounded-md border border-border p-2.5">
                  <p className="font-medium">
                    {label}: <span className="font-normal text-muted-foreground">{force.level}</span>
                  </p>
                  <p className="text-muted-foreground">{force.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
