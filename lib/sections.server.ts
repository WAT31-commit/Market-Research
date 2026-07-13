import "server-only";
import { prisma } from "@/lib/prisma";
import type { SectionType } from "@/lib/constants";
import type { SectionContentMap } from "@/lib/section-types";

export interface LoadedSection<T extends SectionType> {
  content: SectionContentMap[T];
  source: string;
  confidenceScore: number | null;
  generatedByAI: boolean;
  updatedAt: Date;
}

export async function getProjectSections(projectId: string): Promise<
  Partial<{ [K in SectionType]: LoadedSection<K> }>
> {
  const rows = await prisma.reportSection.findMany({ where: { projectId } });
  const result: Partial<{ [K in SectionType]: LoadedSection<K> }> = {};
  for (const row of rows) {
    const type = row.type as SectionType;
    (result as Record<string, unknown>)[type] = {
      content: JSON.parse(row.content),
      source: row.source,
      confidenceScore: row.confidenceScore,
      generatedByAI: row.generatedByAI,
      updatedAt: row.updatedAt,
    };
  }
  return result;
}
