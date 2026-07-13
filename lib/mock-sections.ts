import { SeededRandom } from "@/lib/seed-random";
import type {
  SectionContentMap,
  ScenarioFinancials,
  ForceLevel,
} from "@/lib/section-types";
import type { SectionType } from "@/lib/constants";

export interface ProjectLike {
  id: string;
  name: string;
  industry: string;
  country: string;
  targetCustomer: string | null;
  businessType: string | null;
  budget: number | null;
  investmentSize: number | null;
  currency: string;
  competitorsRaw: string | null;
}

const LEVELS: ForceLevel[] = ["Low", "Medium", "High"];

function levelFor(rng: SeededRandom): { level: ForceLevel; note: string } {
  return { level: rng.pick(LEVELS), note: "" };
}

export function generateMockSection<T extends SectionType>(
  type: T,
  project: ProjectLike
): SectionContentMap[T] {
  const rng = new SeededRandom(`${project.id}:${type}`);
  const industry = project.industry || "the target industry";
  const country = project.country || "the target market";
  const customer = project.targetCustomer || "the target customer segment";

  switch (type) {
    case "EXEC_SUMMARY": {
      const content: SectionContentMap["EXEC_SUMMARY"] = {
        summary: `${project.name} targets ${industry} in ${country}. Based on current market signals, demand indicators, and the competitive landscape, this opportunity is rated ${rng.pick([
          "moderately attractive",
          "attractive",
          "highly attractive",
          "cautiously promising",
        ])} for ${customer}.`,
        keyFindings: [
          `Estimated market growth (CAGR) of ${rng.float(3, 22)}% over the next 5 years.`,
          `Competitive intensity is ${rng.pick(["low", "moderate", "high"])} relative to comparable markets.`,
          `Primary demand driver: ${rng.pick([
            "shifting consumer preferences",
            "regulatory tailwinds",
            "technology adoption",
            "demographic shifts",
            "cost pressure on incumbents",
          ])}.`,
          `Key risk: ${rng.pick([
            "supply chain concentration",
            "regulatory uncertainty",
            "customer acquisition cost",
            "currency volatility",
            "incumbent retaliation",
          ])}.`,
        ],
        recommendation: rng.pick([
          "Proceed with a phased market entry, validating demand with a pilot before scaling.",
          "Proceed with investment, prioritizing differentiation against the top two incumbents.",
          "Proceed cautiously — further primary research recommended before committing capital.",
          "Strong opportunity — recommend accelerated entry ahead of competitors.",
        ]),
      };
      return content as SectionContentMap[T];
    }

    case "SWOT": {
      const content: SectionContentMap["SWOT"] = {
        strengths: [
          `Clear positioning for ${customer}`,
          "Founding team domain expertise",
          rng.pick(["Early-mover advantage", "Capital efficiency", "Defensible IP", "Strong unit economics"]),
        ],
        weaknesses: [
          rng.pick(["Limited brand recognition", "Thin distribution network", "Small initial team", "Unproven go-to-market"]),
          "No established customer base yet",
        ],
        opportunities: [
          `Underserved segments within ${industry}`,
          rng.pick(["Adjacent market expansion", "Partnership channel potential", "Regulatory tailwinds", "Emerging technology adoption"]),
        ],
        threats: [
          rng.pick(["Incumbent price competition", "New entrant risk", "Changing regulation", "Macroeconomic slowdown"]),
          `Customer acquisition cost inflation in ${country}`,
        ],
      };
      return content as SectionContentMap[T];
    }

    case "PESTLE": {
      const content: SectionContentMap["PESTLE"] = {
        political: [`Regulatory stance toward ${industry} in ${country} is ${rng.pick(["stable", "evolving", "tightening", "favorable"])}.`],
        economic: [`${rng.pick(["Inflation", "Interest rates", "Currency volatility", "GDP growth"])} is a relevant macro factor for buyer budgets.`],
        social: [`Shifting attitudes among ${customer} are ${rng.pick(["accelerating", "gradually increasing", "steady"])} demand.`],
        technological: [`Adoption of ${rng.pick(["automation", "AI tooling", "mobile-first platforms", "cloud infrastructure"])} is reshaping the category.`],
        legal: [`Compliance requirements are ${rng.pick(["moderate", "significant", "minimal"])} for new entrants.`],
        environmental: [`Sustainability expectations are ${rng.pick(["a growing purchase factor", "a minor factor", "a major differentiator"])}.`],
      };
      return content as SectionContentMap[T];
    }

    case "PORTERS": {
      const content: SectionContentMap["PORTERS"] = {
        newEntrants: { ...levelFor(rng), note: "Barriers to entry driven by capital requirements and brand trust." },
        supplierPower: { ...levelFor(rng), note: "Supplier concentration and switching costs." },
        buyerPower: { ...levelFor(rng), note: "Buyer price sensitivity and available alternatives." },
        substitutes: { ...levelFor(rng), note: "Availability of adjacent solutions solving the same job." },
        rivalry: { ...levelFor(rng), note: "Number and aggressiveness of direct competitors." },
      };
      return content as SectionContentMap[T];
    }

    case "MARKET_SIZE": {
      const tam = rng.float(0.5, 50, 1) * 1000; // in millions
      const sam = tam * rng.float(0.2, 0.5);
      const som = sam * rng.float(0.05, 0.2);
      const cagr = rng.float(3, 22);
      const baseYear = 2024;
      const historicalGrowth = Array.from({ length: 5 }, (_, i) => ({
        year: baseYear - 4 + i,
        valueBn: Math.round(((tam / 1000) * (1 - cagr / 100) ** (4 - i)) * 100) / 100,
      }));
      const projectedGrowth = Array.from({ length: 5 }, (_, i) => ({
        year: baseYear + i,
        valueBn: Math.round(((tam / 1000) * (1 + cagr / 100) ** i) * 100) / 100,
      }));
      const content: SectionContentMap["MARKET_SIZE"] = {
        tam: Math.round(tam),
        sam: Math.round(sam),
        som: Math.round(som),
        cagrPct: cagr,
        historicalGrowth,
        projectedGrowth,
      };
      return content as SectionContentMap[T];
    }

    case "CUSTOMER_PERSONA": {
      const names = ["Avery", "Jordan", "Priya", "Diego", "Mei", "Sam"];
      const roles = rng.shuffle([
        `${customer} decision-maker`,
        `${customer} end user`,
        `${customer} budget owner`,
      ]);
      const content: SectionContentMap["CUSTOMER_PERSONA"] = {
        personas: roles.slice(0, 2).map((role) => ({
          name: rng.pick(names),
          ageRange: rng.pick(["25-34", "35-44", "45-54"]),
          role,
          goals: [`Solve pain points related to ${industry}`, "Reduce time-to-value"],
          painPoints: [rng.pick(["High cost of current solutions", "Poor visibility into outcomes", "Manual, slow workflows"])],
          behavior: rng.pick([
            "Researches extensively before buying, relies on peer reviews.",
            "Prefers self-serve trials before committing budget.",
            "Buys based on vendor relationships and case studies.",
          ]),
        })),
      };
      return content as SectionContentMap[T];
    }

    case "CUSTOMER_SEGMENTATION": {
      const segs = [
        { name: "Early adopters", sizePct: rng.int(10, 20) },
        { name: "Mainstream buyers", sizePct: rng.int(40, 60) },
        { name: "Price-sensitive laggards", sizePct: 0 },
      ];
      segs[2].sizePct = 100 - segs[0].sizePct - segs[1].sizePct;
      const content: SectionContentMap["CUSTOMER_SEGMENTATION"] = {
        segments: segs.map((s) => ({
          name: s.name,
          sizePct: s.sizePct,
          description: `${s.name} within ${customer}, evaluated on fit for ${industry}.`,
          priceSensitivity: rng.pick(["Low", "Medium", "High"]),
        })),
      };
      return content as SectionContentMap[T];
    }

    case "FINANCIAL_PROJECTION": {
      const baseRevenue = (project.budget ?? 500000) * rng.float(1.5, 4);
      const years = Array.from({ length: 5 }, (_, i) => {
        const growth = (1 + rng.float(0.15, 0.6)) ** i;
        const revenue = Math.round(baseRevenue * growth);
        const cost = Math.round(revenue * rng.float(0.55, 0.85));
        return {
          year: 2025 + i,
          revenue,
          cost,
          grossMarginPct: Math.round(((revenue - cost) / revenue) * 1000) / 10,
          netMarginPct: Math.round(((revenue - cost) / revenue) * 700) / 10,
        };
      });
      const content: SectionContentMap["FINANCIAL_PROJECTION"] = {
        years,
        roiPct: rng.float(15, 80),
        breakEvenMonth: rng.int(8, 30),
      };
      return content as SectionContentMap[T];
    }

    case "FINANCIAL_SCENARIOS": {
      const base = (project.investmentSize ?? project.budget ?? 500000) * rng.float(2, 5);
      const scenario = (mult: number, note: string): ScenarioFinancials => ({
        revenueYear3: Math.round(base * mult),
        npv: Math.round(base * mult * rng.float(0.3, 0.6)),
        irrPct: rng.float(5, 45),
        note,
      });
      const content: SectionContentMap["FINANCIAL_SCENARIOS"] = {
        best: scenario(rng.float(2.5, 4), "Faster-than-expected adoption and successful expansion."),
        expected: scenario(rng.float(1.3, 2), "Base case assuming planned execution and market conditions."),
        worst: scenario(rng.float(0.4, 0.9), "Slower adoption, increased competition, or cost overruns."),
      };
      return content as SectionContentMap[T];
    }

    case "RISK_ASSESSMENT": {
      const riskPool = [
        { name: "Regulatory change", category: "Political/Legal" },
        { name: "New competitor entry", category: "Competitive" },
        { name: "Customer acquisition cost inflation", category: "Commercial" },
        { name: "Supply chain disruption", category: "Operational" },
        { name: "Currency/macro volatility", category: "Financial" },
        { name: "Key talent attrition", category: "Organizational" },
      ];
      const chosen = rng.shuffle(riskPool).slice(0, 4);
      const content: SectionContentMap["RISK_ASSESSMENT"] = {
        risks: chosen.map((r) => ({
          name: r.name,
          category: r.category,
          likelihood: rng.pick(["Low", "Medium", "High"]),
          impact: rng.pick(["Low", "Medium", "High"]),
          mitigation: `Monitor closely and build contingency into the ${rng.pick(["operating plan", "budget", "go-to-market roadmap"])}.`,
        })),
      };
      return content as SectionContentMap[T];
    }

    case "GO_TO_MARKET": {
      const content: SectionContentMap["GO_TO_MARKET"] = {
        phases: [
          { name: "Validate", timeframe: "Months 1-3", actions: ["Run pilot with design partners", "Validate pricing"] },
          { name: "Launch", timeframe: "Months 4-8", actions: ["Public launch", "Build initial sales/marketing motion"] },
          { name: "Scale", timeframe: "Months 9-18", actions: ["Expand channels", `Enter adjacent segments within ${industry}`] },
        ],
        channels: rng.shuffle(["Direct sales", "Self-serve online", "Channel partners", "Marketplace listings"]).slice(0, 3),
        pricingStrategy: rng.pick([
          "Value-based pricing anchored to customer ROI.",
          "Penetration pricing to build share, raising prices as retention proves out.",
          "Tiered pricing to capture both price-sensitive and premium segments.",
        ]),
      };
      return content as SectionContentMap[T];
    }

    default:
      throw new Error(`Unknown section type: ${type}`);
  }
}
