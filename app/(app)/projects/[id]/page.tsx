import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/project-auth";
import { getProjectSections } from "@/lib/sections.server";
import { StatTile } from "@/components/charts/stat-tile";
import { SectionCard } from "@/components/reports/section-card";
import { ExecSummaryView } from "@/components/reports/content-views";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProjectOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { project } = await requireProjectOwner(id);
  if (!project) notFound();

  const [score, sections] = await Promise.all([
    prisma.score.findUnique({ where: { projectId: id } }),
    getProjectSections(id),
  ]);

  const execSummary = sections.EXEC_SUMMARY;

  return (
    <div className="space-y-6">
      {score && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatTile label="Overall Score" value={score.overall} />
            <StatTile label="Opportunity" value={score.opportunity} />
            <StatTile label="Risk" value={score.risk} />
            <StatTile label="Competition" value={score.competition} />
            <StatTile label="Demand" value={score.demand} />
            <StatTile label="Profitability" value={score.profitability} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Investment Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{score.investmentRecommendation}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                Scores are computed from a transparent heuristic model combining your project inputs
                (competitor count, budget, target customer clarity) with market signal estimates — see each tab
                for the data behind every score.
              </p>
            </CardContent>
          </Card>
        </>
      )}

      <SectionCard
        projectId={id}
        type="EXEC_SUMMARY"
        title="Executive Summary"
        source={execSummary?.source ?? null}
        confidenceScore={execSummary?.confidenceScore ?? null}
        empty={!execSummary}
      >
        {execSummary && <ExecSummaryView content={execSummary.content} />}
      </SectionCard>
    </div>
  );
}
