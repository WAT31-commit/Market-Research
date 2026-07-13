import Link from "next/link";
import { ArrowUpRight, Building2, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RESEARCH_DEPTH_LABELS, type ResearchDepth } from "@/lib/constants";

export interface ProjectCardData {
  id: string;
  name: string;
  industry: string;
  country: string;
  researchDepth: string;
  updatedAt: string | Date;
  competitorCount: number;
  overallScore: number | null;
}

function scoreTone(score: number) {
  if (score >= 70) return "text-status-good";
  if (score >= 50) return "text-status-warning";
  return "text-status-serious";
}

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="group h-full transition-all hover:-translate-y-0.5 hover:shadow-lg">
        <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
          <div>
            <p className="font-semibold leading-tight">{project.name}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 className="size-3" />
              {project.industry}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {project.country}
            </p>
          </div>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="font-normal">
              {RESEARCH_DEPTH_LABELS[project.researchDepth as ResearchDepth] ?? project.researchDepth}
            </Badge>
            {project.overallScore != null && (
              <span className={`text-xl font-semibold tabular-nums ${scoreTone(project.overallScore)}`}>
                {project.overallScore}
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {project.competitorCount} competitor{project.competitorCount === 1 ? "" : "s"} tracked
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
