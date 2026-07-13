import "server-only";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";

export async function requireProjectOwner(projectId: string) {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Unauthorized" as const, status: 401 as const, project: null, userId: null };

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { error: "Not found" as const, status: 404 as const, project: null, userId };
  if (project.ownerId !== userId) return { error: "Forbidden" as const, status: 403 as const, project: null, userId };

  return { error: null, status: 200 as const, project, userId };
}
