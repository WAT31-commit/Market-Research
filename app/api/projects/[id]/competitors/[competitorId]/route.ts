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

  await prisma.competitor.delete({ where: { id: competitorId } });
  return NextResponse.json({ ok: true });
}
