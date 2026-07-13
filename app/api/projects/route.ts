import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";
import { RESEARCH_DEPTHS } from "@/lib/constants";
import { computeScores } from "@/lib/scoring";

const createSchema = z.object({
  name: z.string().min(1).max(120),
  industry: z.string().min(1).max(120),
  country: z.string().min(1).max(120),
  region: z.string().max(120).optional(),
  city: z.string().max(120).optional(),
  targetCustomer: z.string().max(300).optional(),
  objective: z.string().max(500).optional(),
  businessType: z.string().max(120).optional(),
  competitorsRaw: z.string().max(500).optional(),
  budget: z.coerce.number().nonnegative().optional(),
  investmentSize: z.coerce.number().nonnegative().optional(),
  currency: z.string().min(1).max(10).default("USD"),
  researchDepth: z.enum(RESEARCH_DEPTHS).default("PROFESSIONAL"),
});

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
    include: { score: true, _count: { select: { competitors: true } } },
  });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: { ownerId: userId, ...parsed.data },
  });

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
    0
  );
  await prisma.score.create({
    data: {
      projectId: project.id,
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

  return NextResponse.json(project, { status: 201 });
}
