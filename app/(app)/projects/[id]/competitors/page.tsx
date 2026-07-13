import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/project-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketShareChart } from "@/components/charts/market-share-chart";
import { CompetitorManager } from "@/components/project/competitor-manager";

export default async function CompetitorsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { project } = await requireProjectOwner(id);
  if (!project) notFound();

  const competitors = await prisma.competitor.findMany({ where: { projectId: id }, orderBy: { marketSharePct: "desc" } });
  const shareData = competitors.filter((c) => c.marketSharePct != null).map((c) => ({ name: c.name, value: c.marketSharePct! }));

  return (
    <div className="space-y-6">
      {shareData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Market Share</CardTitle>
          </CardHeader>
          <CardContent>
            <MarketShareChart data={shareData} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Competitor Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <CompetitorManager projectId={id} competitors={competitors} />
        </CardContent>
      </Card>
    </div>
  );
}
