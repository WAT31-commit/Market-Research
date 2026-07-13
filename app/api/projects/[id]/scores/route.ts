import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/project-auth";
import { computeScores } from "@/lib/scoring";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, status, project } = await requireProjectOwner(id);
  if (error || !project) return NextResponse.json({ error }, { status });

  const competitorCount = await prisma.competitor.count({ where: { projectId: id } });
  const scores = computeScores(
    {
      id: project.id,
      name: project.name,
      industry: project.industry,
      country: project.country,
      targetCustomer: project.targetCustomer,
      businessType: project.businessType,
      budget: project.budget,
      investmentSize: project.investmentSize,
      currency: project.currency,
      competitorsRaw: project.competitorsRaw,
    },
    competitorCount
  );

  const score = await prisma.score.upsert({
    where: { projectId: id },
    update: {
      overall: scores.overall,
      opportunity: scores.opportunity,
      risk: scores.risk,
      competition: scores.competition,
      demand: scores.demand,
      profitability: scores.profitability,
      investmentRecommendation: scores.investmentRecommendation,
      breakdown: JSON.stringify(scores.breakdown),
    },
    create: {
      projectId: id,
      overall: scores.overall,
      opportunity: scores.opportunity,
      risk: scores.risk,
      competition: scores.competition,
      demand: scores.demand,
      profitability: scores.profitability,
      investmentRecommendation: scores.investmentRecommendation,
      breakdown: JSON.stringify(scores.breakdown),
    },
  });

  return NextResponse.json(score);
}
