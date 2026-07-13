"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const WorldMap = dynamic(() => import("@/components/maps/world-map").then((m) => m.WorldMap), {
  ssr: false,
  loading: () => <Skeleton className="h-[360px] w-full rounded-xl" />,
});

export { WorldMap as WorldMapLoader };
export default WorldMap;
