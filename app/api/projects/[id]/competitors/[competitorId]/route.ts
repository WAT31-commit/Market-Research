import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/project-auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; competitorId: string }> }
) {
  const { id, competitorId } = await params;
  const { error, status } = await requireProjectOwner(id);
  if (error) return NextResponse.json({ error }, { status });

  const { count } = await prisma.competitor.deleteMany({
    where: { id: competitorId, projectId: id },
  });
  if (count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
