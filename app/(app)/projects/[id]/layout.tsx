import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/project-auth";
import { ProjectTabs } from "@/components/project/project-tabs";
import { ExportButtons } from "@/components/project/export-buttons";
import { RESEARCH_DEPTH_LABELS, type ResearchDepth } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { project } = await requireProjectOwner(id);
  if (!project) notFound();

  const competitorCount = await prisma.competitor.count({ where: { projectId: id } });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
            <Badge variant="secondary" className="font-normal">
              {RESEARCH_DEPTH_LABELS[project.researchDepth as ResearchDepth] ?? project.researchDepth}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {project.industry} · {project.country}
            {project.city ? `, ${project.city}` : ""} · {competitorCount} competitor
            {competitorCount === 1 ? "" : "s"} tracked
          </p>
        </div>
        <ExportButtons projectId={id} />
      </div>

      <div className="mb-6">
        <ProjectTabs projectId={id} />
      </div>

      {children}
    </div>
  );
}
