export const RESEARCH_DEPTHS = [
  "QUICK",
  "PROFESSIONAL",
  "INVESTMENT_GRADE",
  "ENTERPRISE_GRADE",
] as const;
export type ResearchDepth = (typeof RESEARCH_DEPTHS)[number];

export const RESEARCH_DEPTH_LABELS: Record<ResearchDepth, string> = {
  QUICK: "Quick",
  PROFESSIONAL: "Professional",
  INVESTMENT_GRADE: "Investment Grade",
  ENTERPRISE_GRADE: "Enterprise Grade",
};

export const SECTION_TYPES = [
  "EXEC_SUMMARY",
  "SWOT",
  "PESTLE",
  "PORTERS",
  "MARKET_SIZE",
  "CUSTOMER_PERSONA",
  "CUSTOMER_SEGMENTATION",
  "FINANCIAL_PROJECTION",
  "FINANCIAL_SCENARIOS",
  "RISK_ASSESSMENT",
  "GO_TO_MARKET",
] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export const SECTION_LABELS: Record<SectionType, string> = {
  EXEC_SUMMARY: "Executive Summary",
  SWOT: "SWOT Analysis",
  PESTLE: "PESTLE Analysis",
  PORTERS: "Porter's Five Forces",
  MARKET_SIZE: "Market Size (TAM/SAM/SOM)",
  CUSTOMER_PERSONA: "Customer Personas",
  CUSTOMER_SEGMENTATION: "Customer Segmentation",
  FINANCIAL_PROJECTION: "Financial Projection",
  FINANCIAL_SCENARIOS: "Scenario Analysis",
  RISK_ASSESSMENT: "Risk Assessment",
  GO_TO_MARKET: "Go-to-Market Strategy",
};

export const CONNECTION_STATUSES = ["CONNECTED", "NOT_CONFIGURED"] as const;
export type ConnectionStatus = (typeof CONNECTION_STATUSES)[number];

export const DATA_SOURCE_PROVIDERS = [
  {
    id: "world_bank",
    name: "World Bank Open Data",
    live: true,
    description: "GDP, population, and income indicators. Free, no API key required.",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude (AI generation)",
    live: true,
    description: "Powers AI-generated sections. Add ANTHROPIC_API_KEY to enable live generation.",
  },
  {
    id: "statista",
    name: "Statista",
    live: false,
    description: "Requires a paid enterprise contract — not yet connected.",
  },
  {
    id: "pitchbook",
    name: "PitchBook",
    live: false,
    description: "Requires a paid enterprise contract — not yet connected.",
  },
  {
    id: "cb_insights",
    name: "CB Insights",
    live: false,
    description: "Requires a paid enterprise contract — not yet connected.",
  },
  {
    id: "crunchbase",
    name: "Crunchbase",
    live: false,
    description: "Requires an API key — not yet connected.",
  },
  {
    id: "alpha_vantage",
    name: "Alpha Vantage",
    live: false,
    description: "Financial market data — not yet connected.",
  },
] as const;
