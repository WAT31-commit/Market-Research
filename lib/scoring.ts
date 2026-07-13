import { SeededRandom } from "@/lib/seed-random";
import type { ProjectLike } from "@/lib/mock-sections";

export interface ScoreBreakdownItem {
  label: string;
  value: number;
  weight: number;
  note: string;
}

export interface ComputedScores {
  overall: number;
  opportunity: number;
  risk: number;
  competition: number;
  demand: number;
  profitability: number;
  investmentRecommendation: string;
  breakdown: {
    opportunity: ScoreBreakdownItem[];
    risk: ScoreBreakdownItem[];
    competition: ScoreBreakdownItem[];
    demand: ScoreBreakdownItem[];
    profitability: ScoreBreakdownItem[];
  };
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

/**
 * Heuristic, explainable scoring model. Combines actual project inputs
 * (competitor count, budget, research depth) with a seeded pseudo-random
 * factor standing in for signals a real deployment would pull from live
 * market data. Every sub-score keeps a breakdown so the UI can show *why*.
 */
export function computeScores(
  project: ProjectLike,
  competitorCount: number
): ComputedScores {
  const rng = new SeededRandom(`${project.id}:score`);

  const competitorDensity = clamp(100 - competitorCount * 12, 10, 95);
  const marketSignal = rng.int(40, 95);
  const budgetAdequacy = project.budget
    ? clamp(30 + Math.log10(Math.max(project.budget, 1000)) * 12)
    : rng.int(40, 70);

  const opportunityBreakdown: ScoreBreakdownItem[] = [
    { label: "Market growth signal", value: marketSignal, weight: 0.5, note: "Estimated CAGR and demand trend strength." },
    { label: "White space vs. competitors", value: competitorDensity, weight: 0.3, note: `Based on ${competitorCount} tracked competitor(s).` },
    { label: "Budget adequacy", value: budgetAdequacy, weight: 0.2, note: "Stated budget relative to typical entry cost for this depth of research." },
  ];
  const opportunity = clamp(
    opportunityBreakdown.reduce((sum, i) => sum + i.value * i.weight, 0)
  );

  const regulatoryRisk = rng.int(15, 70);
  const executionRisk = rng.int(20, 65);
  const marketRisk = clamp(100 - marketSignal, 10, 90);
  const riskBreakdown: ScoreBreakdownItem[] = [
    { label: "Regulatory/political exposure", value: regulatoryRisk, weight: 0.35, note: `Country-level regulatory posture for ${project.country}.` },
    { label: "Execution risk", value: executionRisk, weight: 0.35, note: "Team, timeline, and operational complexity." },
    { label: "Market volatility", value: marketRisk, weight: 0.3, note: "Inverse of the market growth signal." },
  ];
  const risk = clamp(riskBreakdown.reduce((sum, i) => sum + i.value * i.weight, 0));

  const competitionBreakdown: ScoreBreakdownItem[] = [
    { label: "Number of direct competitors", value: clamp(100 - competitorCount * 15), weight: 0.6, note: `${competitorCount} competitor(s) currently tracked.` },
    { label: "Differentiation potential", value: rng.int(40, 90), weight: 0.4, note: "Estimated based on business type and positioning." },
  ];
  const competition = clamp(competitionBreakdown.reduce((sum, i) => sum + i.value * i.weight, 0));

  const demandBreakdown: ScoreBreakdownItem[] = [
    { label: "Target customer clarity", value: project.targetCustomer ? 80 : 50, weight: 0.4, note: project.targetCustomer ? "Target customer defined." : "Target customer not yet defined — lowers confidence." },
    { label: "Market growth signal", value: marketSignal, weight: 0.6, note: "Shared with opportunity score." },
  ];
  const demand = clamp(demandBreakdown.reduce((sum, i) => sum + i.value * i.weight, 0));

  const marginSignal = rng.int(35, 85);
  const profitabilityBreakdown: ScoreBreakdownItem[] = [
    { label: "Estimated margin profile", value: marginSignal, weight: 0.6, note: "Derived from business type and industry norms." },
    { label: "Budget-to-opportunity fit", value: budgetAdequacy, weight: 0.4, note: "Stated budget relative to opportunity size." },
  ];
  const profitability = clamp(profitabilityBreakdown.reduce((sum, i) => sum + i.value * i.weight, 0));

  const overall = clamp(
    opportunity * 0.3 + (100 - risk) * 0.2 + competition * 0.15 + demand * 0.2 + profitability * 0.15
  );

  let investmentRecommendation: string;
  if (overall >= 75) investmentRecommendation = "Strong Buy — high-conviction opportunity";
  else if (overall >= 60) investmentRecommendation = "Buy — favorable risk/reward";
  else if (overall >= 45) investmentRecommendation = "Hold — proceed with further validation";
  else investmentRecommendation = "Caution — significant risks outweigh current signal";

  return {
    overall,
    opportunity,
    risk,
    competition,
    demand,
    profitability,
    investmentRecommendation,
    breakdown: {
      opportunity: opportunityBreakdown,
      risk: riskBreakdown,
      competition: competitionBreakdown,
      demand: demandBreakdown,
      profitability: profitabilityBreakdown,
    },
  };
}
