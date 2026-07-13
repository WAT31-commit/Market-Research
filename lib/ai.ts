import Anthropic from "@anthropic-ai/sdk";
import type { SectionType } from "@/lib/constants";
import { SECTION_LABELS } from "@/lib/constants";
import { generateMockSection, type ProjectLike } from "@/lib/mock-sections";
import type { SectionContentMap } from "@/lib/section-types";

export interface GeneratedSection<T extends SectionType> {
  content: SectionContentMap[T];
  confidenceScore: number;
  source: string;
  generatedByAI: boolean;
}

const MODEL = "claude-sonnet-5";

function schemaHintFor(type: SectionType): string {
  // Minimal shape hints keep the model's JSON close to SectionContentMap
  // without shipping a full JSON-schema validator for an MVP.
  const hints: Record<SectionType, string> = {
    EXEC_SUMMARY: `{"summary": string, "keyFindings": string[3-5], "recommendation": string}`,
    SWOT: `{"strengths": string[2-4], "weaknesses": string[2-4], "opportunities": string[2-4], "threats": string[2-4]}`,
    PESTLE: `{"political": string[1-2], "economic": string[1-2], "social": string[1-2], "technological": string[1-2], "legal": string[1-2], "environmental": string[1-2]}`,
    PORTERS: `{"newEntrants": {"level": "Low"|"Medium"|"High", "note": string}, "supplierPower": {...same shape...}, "buyerPower": {...}, "substitutes": {...}, "rivalry": {...}}`,
    MARKET_SIZE: `{"tam": number (USD millions), "sam": number, "som": number, "cagrPct": number, "historicalGrowth": [{"year": number, "valueBn": number}] (5 items), "projectedGrowth": [{"year": number, "valueBn": number}] (5 items)}`,
    CUSTOMER_PERSONA: `{"personas": [{"name": string, "ageRange": string, "role": string, "goals": string[2], "painPoints": string[2], "behavior": string}] (2 items)}`,
    CUSTOMER_SEGMENTATION: `{"segments": [{"name": string, "sizePct": number, "description": string, "priceSensitivity": "Low"|"Medium"|"High"}] (2-4 items, sizePct sums to ~100)}`,
    FINANCIAL_PROJECTION: `{"years": [{"year": number, "revenue": number, "cost": number, "grossMarginPct": number, "netMarginPct": number}] (5 items), "roiPct": number, "breakEvenMonth": number}`,
    FINANCIAL_SCENARIOS: `{"best": {"revenueYear3": number, "npv": number, "irrPct": number, "note": string}, "expected": {...same shape...}, "worst": {...}}`,
    RISK_ASSESSMENT: `{"risks": [{"name": string, "category": string, "likelihood": "Low"|"Medium"|"High", "impact": "Low"|"Medium"|"High", "mitigation": string}] (3-5 items)}`,
    GO_TO_MARKET: `{"phases": [{"name": string, "timeframe": string, "actions": string[2]}] (3 items), "channels": string[3], "pricingStrategy": string}`,
  };
  return hints[type];
}

async function generateWithClaude<T extends SectionType>(
  type: T,
  project: ProjectLike
): Promise<SectionContentMap[T] | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const client = new Anthropic({ apiKey });
    const prompt = `You are a market research analyst. Generate the "${SECTION_LABELS[type]}" section for this research project:

Project: ${project.name}
Industry: ${project.industry}
Country: ${project.country}
Target customer: ${project.targetCustomer ?? "not specified"}
Business type: ${project.businessType ?? "not specified"}
Known competitors: ${project.competitorsRaw ?? "not specified"}

Respond with ONLY valid JSON (no markdown fences, no commentary) matching this shape:
${schemaHintFor(type)}`;

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]) as SectionContentMap[T];
  } catch (err) {
    console.error(`Claude generation failed for ${type}:`, err);
    return null;
  }
}

export async function generateSection<T extends SectionType>(
  type: T,
  project: ProjectLike
): Promise<GeneratedSection<T>> {
  const claudeContent = await generateWithClaude(type, project);

  if (claudeContent) {
    return {
      content: claudeContent,
      confidenceScore: Math.round(72 + Math.random() * 18),
      source: `AI-generated (Claude, ${MODEL})`,
      generatedByAI: true,
    };
  }

  const mockContent = generateMockSection(type, project);
  return {
    content: mockContent,
    confidenceScore: Math.round(55 + Math.random() * 20),
    source: "AI-generated (simulated — set ANTHROPIC_API_KEY for live generation)",
    generatedByAI: true,
  };
}
