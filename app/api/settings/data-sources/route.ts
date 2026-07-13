import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";

const bodySchema = z.object({
  provider: z.string().min(1).max(60),
  apiKey: z.string().max(300),
});

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const connections = await prisma.dataSourceConnection.findMany({
    where: { userId },
    select: { id: true, provider: true, status: true, updatedAt: true },
  });
  return NextResponse.json(connections);
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { provider, apiKey } = parsed.data;
  const connection = await prisma.dataSourceConnection.upsert({
    where: { userId_provider: { userId, provider } },
    update: { apiKey: apiKey || null, status: apiKey ? "CONNECTED" : "NOT_CONFIGURED" },
    create: { userId, provider, apiKey: apiKey || null, status: apiKey ? "CONNECTED" : "NOT_CONFIGURED" },
    select: { id: true, provider: true, status: true, updatedAt: true },
  });

  return NextResponse.json(connection);
}
