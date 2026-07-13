import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/project-auth";
import { getCountrySnapshot } from "@/lib/worldbank";
import { SeededRandom } from "@/lib/seed-random";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorldMapLoader } from "@/components/maps/world-map-loader";
import { Badge } from "@/components/ui/badge";
import { Globe2 } from "lucide-react";

function formatNumber(n: number | null, opts: Intl.NumberFormatOptions = {}) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1, ...opts }).format(n);
}

export default async function GeographyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { project } = await requireProjectOwner(id);
  if (!project) notFound();

  const [snapshot, competitors] = await Promise.all([
    getCountrySnapshot(project.country),
    prisma.competitor.findMany({ where: { projectId: id } }),
  ]);

  const rng = new SeededRandom(`${id}:geo`);
  const centerLat = snapshot.country?.latitude ?? 20;
  const centerLng = snapshot.country?.longitude ?? 0;

  const competitorMarkers = competitors.map((c) => ({
    id: c.id,
    name: c.name,
    description: "Illustrative location — approximate, not a verified address.",
    lat: centerLat + rng.float(-2, 2, 2),
    lng: centerLng + rng.float(-2, 2, 2),
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe2 className="size-4" />
            {snapshot.country?.name ?? project.country}
          </CardTitle>
          <Badge variant="outline" className="font-normal">
            Live: World Bank Open Data
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <WorldMapLoader
            centerLat={centerLat}
            centerLng={centerLng}
            zoom={snapshot.country ? 5 : 2}
            markers={[
              { id: "country", name: snapshot.country?.name ?? project.country, lat: centerLat, lng: centerLng, description: "Project market center" },
              ...competitorMarkers,
            ]}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Population</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{formatNumber(snapshot.population.value)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{snapshot.population.year ?? "n/a"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">GDP</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {formatNumber(snapshot.gdpUsd.value, { style: "currency", currency: "USD" })}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{snapshot.gdpUsd.year ?? "n/a"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">GDP per capita</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {formatNumber(snapshot.gdpPerCapitaUsd.value, { style: "currency", currency: "USD" })}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{snapshot.gdpPerCapitaUsd.year ?? "n/a"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">GDP growth</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {snapshot.gdpGrowthPct.value != null ? `${snapshot.gdpGrowthPct.value.toFixed(1)}%` : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{snapshot.gdpGrowthPct.year ?? "n/a"}</p>
            </div>
          </div>
          {!snapshot.country && (
            <p className="text-xs text-muted-foreground">
              Could not resolve &ldquo;{project.country}&rdquo; against World Bank country data — try a standard
              country name (e.g. &ldquo;Germany&rdquo; rather than &ldquo;EU&rdquo;).
            </p>
          )}
          {snapshot.country && competitorMarkers.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Competitor markers are illustrative placements near the country center, not verified addresses.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
