import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { getCountrySnapshot } from "@/lib/worldbank";

export async function GET(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const country = new URL(req.url).searchParams.get("country");
  if (!country) return NextResponse.json({ error: "Missing country" }, { status: 400 });

  const snapshot = await getCountrySnapshot(country);
  return NextResponse.json(snapshot);
}
