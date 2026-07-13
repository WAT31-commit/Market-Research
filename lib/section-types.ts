// Content shapes for each ReportSection.type. Stored as JSON in
// ReportSection.content and typed here so API routes, mock generators, and
// UI components all agree on the shape.

export interface ExecSummaryContent {
  summary: string;
  keyFindings: string[];
  recommendation: string;
}

export interface SwotContent {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface PestleContent {
  political: string[];
  economic: string[];
  social: string[];
  technological: string[];
  legal: string[];
  environmental: string[];
}

export type ForceLevel = "Low" | "Medium" | "High";

export interface PortersContent {
  newEntrants: { level: ForceLevel; note: string };
  supplierPower: { level: ForceLevel; note: string };
  buyerPower: { level: ForceLevel; note: string };
  substitutes: { level: ForceLevel; note: string };
  rivalry: { level: ForceLevel; note: string };
}

export interface MarketSizeContent {
  tam: number;
  sam: number;
  som: number;
  cagrPct: number;
  historicalGrowth: { year: number; valueBn: number }[];
  projectedGrowth: { year: number; valueBn: number }[];
}

export interface CustomerPersonaContent {
  personas: {
    name: string;
    ageRange: string;
    role: string;
    goals: string[];
    painPoints: string[];
    behavior: string;
  }[];
}

export interface CustomerSegmentationContent {
  segments: {
    name: string;
    sizePct: number;
    description: string;
    priceSensitivity: "Low" | "Medium" | "High";
  }[];
}

export interface FinancialProjectionContent {
  years: {
    year: number;
    revenue: number;
    cost: number;
    grossMarginPct: number;
    netMarginPct: number;
  }[];
  roiPct: number;
  breakEvenMonth: number;
}

export interface ScenarioFinancials {
  revenueYear3: number;
  npv: number;
  irrPct: number;
  note: string;
}

export interface FinancialScenariosContent {
  best: ScenarioFinancials;
  expected: ScenarioFinancials;
  worst: ScenarioFinancials;
}

export interface RiskAssessmentContent {
  risks: {
    name: string;
    category: string;
    likelihood: "Low" | "Medium" | "High";
    impact: "Low" | "Medium" | "High";
    mitigation: string;
  }[];
}

export interface GoToMarketContent {
  phases: { name: string; timeframe: string; actions: string[] }[];
  channels: string[];
  pricingStrategy: string;
}

export type SectionContentMap = {
  EXEC_SUMMARY: ExecSummaryContent;
  SWOT: SwotContent;
  PESTLE: PestleContent;
  PORTERS: PortersContent;
  MARKET_SIZE: MarketSizeContent;
  CUSTOMER_PERSONA: CustomerPersonaContent;
  CUSTOMER_SEGMENTATION: CustomerSegmentationContent;
  FINANCIAL_PROJECTION: FinancialProjectionContent;
  FINANCIAL_SCENARIOS: FinancialScenariosContent;
  RISK_ASSESSMENT: RiskAssessmentContent;
  GO_TO_MARKET: GoToMarketContent;
};
