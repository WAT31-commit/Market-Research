import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/project-auth";
import { renderProjectExcel } from "@/lib/excel";
import type { MarketSizeContent, FinancialProjectionContent } from "@/lib/section-types";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, status, project } = await requireProjectOwner(id);
  if (error || !project) return NextResponse.json({ error }, { status });

  const [competitors, marketSizeRow, financialRow] = await Promise.all([
    prisma.competitor.findMany({ where: { projectId: id } }),
    prisma.reportSection.findUnique({ where: { projectId_type: { projectId: id, type: "MARKET_SIZE" } } }),
    prisma.reportSection.findUnique({ where: { projectId_type: { projectId: id, type: "FINANCIAL_PROJECTION" } } }),
  ]);

  const buffer = await renderProjectExcel({
    name: project.name,
    competitors: competitors.map((c) => ({
      name: c.name,
      description: c.description,
      marketSharePct: c.marketSharePct,
      pricingModel: c.pricingModel,
      website: c.website,
    })),
    marketSize: marketSizeRow ? (JSON.parse(marketSizeRow.content) as MarketSizeContent) : null,
    financials: financialRow ? (JSON.parse(financialRow.content) as FinancialProjectionContent) : null,
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${project.name.replace(/[^a-z0-9]+/gi, "-")}-data.xlsx"`,
    },
  });
}
