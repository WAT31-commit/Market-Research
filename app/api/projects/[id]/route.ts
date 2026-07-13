import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/project-auth";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, status } = await requireProjectOwner(id);
  if (error) return NextResponse.json({ error }, { status });

  const full = await prisma.project.findUnique({
    where: { id },
    include: { score: true, competitors: true, sections: true },
  });
  return NextResponse.json(full);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, status } = await requireProjectOwner(id);
  if (error) return NextResponse.json({ error }, { status });

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
