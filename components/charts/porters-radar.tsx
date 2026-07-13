"use client";

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import type { PortersContent, ForceLevel } from "@/lib/section-types";

const LEVEL_VALUE: Record<ForceLevel, number> = { Low: 1, Medium: 2, High: 3 };

export function PortersRadar({ content }: { content: PortersContent }) {
  const data = [
    { force: "New Entrants", value: LEVEL_VALUE[content.newEntrants.level] },
    { force: "Supplier Power", value: LEVEL_VALUE[content.supplierPower.level] },
    { force: "Buyer Power", value: LEVEL_VALUE[content.buyerPower.level] },
    { force: "Substitutes", value: LEVEL_VALUE[content.substitutes.level] },
    { force: "Rivalry", value: LEVEL_VALUE[content.rivalry.level] },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} outerRadius="70%">
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="force" stroke="var(--muted-foreground)" fontSize={12} />
        <PolarRadiusAxis domain={[0, 3]} tickCount={4} tick={false} axisLine={false} />
        <Radar dataKey="value" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.35} />
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--popover-foreground)",
          }}
          formatter={(value) => [["", "Low", "Medium", "High"][Number(value)], "Intensity"]}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
