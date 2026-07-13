import Link from "next/link";
import { PlusCircle, FolderKanban } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/dashboard/project-card";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const userId = await getCurrentUserId();
  const projects = await prisma.project.findMany({
    where: { ownerId: userId! },
    orderBy: { updatedAt: "desc" },
    include: { score: true, _count: { select: { competitors: true } } },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Research Projects</h1>
          <p className="text-muted-foreground">
            {projects.length} project{projects.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/projects/new">
            <PlusCircle className="size-4" />
            New Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center">
          <FolderKanban className="mb-4 size-10 text-muted-foreground" />
          <p className="mb-1 font-medium">No research projects yet</p>
          <p className="mb-4 max-w-sm text-sm text-muted-foreground">
            Create your first project to generate a market overview, competitor analysis, financial model, and more.
          </p>
          <Button asChild>
            <Link href="/projects/new">Create your first project</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={{
                id: p.id,
                name: p.name,
                industry: p.industry,
                country: p.country,
                researchDepth: p.researchDepth,
                updatedAt: p.updatedAt,
                competitorCount: p._count.competitors,
                overallScore: p.score?.overall ?? null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
