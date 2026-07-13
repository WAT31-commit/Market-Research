import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/project-auth";
import { renderProjectPdf, type PdfSection } from "@/lib/pdf";
import type { SectionType } from "@/lib/constants";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, status, project } = await requireProjectOwner(id);
  if (error || !project) return NextResponse.json({ error }, { status });

  const [score, sections, competitors] = await Promise.all([
    prisma.score.findUnique({ where: { projectId: id } }),
    prisma.reportSection.findMany({ where: { projectId: id } }),
    prisma.competitor.findMany({ where: { projectId: id } }),
  ]);

  const pdfSections: PdfSection[] = sections.map((s) => ({
    type: s.type as SectionType,
    content: JSON.parse(s.content),
    source: s.source,
    confidenceScore: s.confidenceScore,
  }));

  const buffer = await renderProjectPdf({
    name: project.name,
    industry: project.industry,
    country: project.country,
    currency: project.currency,
    generatedAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    scores: score
      ? {
          overall: score.overall,
          opportunity: score.opportunity,
          risk: score.risk,
          competition: score.competition,
          demand: score.demand,
          profitability: score.profitability,
          investmentRecommendation: score.investmentRecommendation,
          breakdown: JSON.parse(score.breakdown),
        }
      : null,
    sections: pdfSections,
    competitors: competitors.map((c) => ({ name: c.name, description: c.description, marketSharePct: c.marketSharePct })),
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${project.name.replace(/[^a-z0-9]+/gi, "-")}-report.pdf"`,
    },
  });
}
