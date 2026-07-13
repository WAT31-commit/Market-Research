import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/project-auth";

const createSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  marketSharePct: z.coerce.number().min(0).max(100).optional(),
  pricingModel: z.string().max(120).optional(),
  strengths: z.string().max(500).optional(),
  weaknesses: z.string().max(500).optional(),
  website: z.string().max(300).optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, status } = await requireProjectOwner(id);
  if (error) return NextResponse.json({ error }, { status });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const competitor = await prisma.competitor.create({
    data: { projectId: id, ...parsed.data },
  });
  return NextResponse.json(competitor, { status: 201 });
}
