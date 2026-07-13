import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/project-auth";
import { SECTION_TYPES } from "@/lib/constants";
import { generateSection } from "@/lib/ai";

const bodySchema = z.object({ type: z.enum(SECTION_TYPES) });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, status, project } = await requireProjectOwner(id);
  if (error || !project) return NextResponse.json({ error }, { status });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid section type" }, { status: 400 });
  const { type } = parsed.data;

  const generated = await generateSection(type, {
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
  });

  const section = await prisma.reportSection.upsert({
    where: { projectId_type: { projectId: id, type } },
    update: {
      content: JSON.stringify(generated.content),
      source: generated.source,
      confidenceScore: generated.confidenceScore,
      generatedByAI: generated.generatedByAI,
    },
    create: {
      projectId: id,
      type,
      content: JSON.stringify(generated.content),
      source: generated.source,
      confidenceScore: generated.confidenceScore,
      generatedByAI: generated.generatedByAI,
    },
  });

  return NextResponse.json(section);
}
