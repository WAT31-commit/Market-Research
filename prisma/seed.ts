import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SECTION_TYPES } from "../lib/constants";
import { generateMockSection, type ProjectLike } from "../lib/mock-sections";
import { computeScores } from "../lib/scoring";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@example.com";
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, name: "Demo User" },
  });

  const existing = await prisma.project.findFirst({ where: { ownerId: user.id } });
  if (existing) {
    console.log("Demo project already exists, skipping seed.");
    return;
  }

  const project = await prisma.project.create({
    data: {
      ownerId: user.id,
      name: "EV Charging Network Expansion",
      industry: "Electric vehicle charging infrastructure",
      country: "Germany",
      region: "Europe",
      city: "Berlin",
      targetCustomer: "Urban EV owners without home charging access",
      objective: "Assess feasibility of a public fast-charging network expansion",
      businessType: "B2C infrastructure operator",
      competitorsRaw: "Tesla Supercharger, Ionity, Allego, EnBW mobility+",
      budget: 2_500_000,
      investmentSize: 12_000_000,
      currency: "EUR",
      researchDepth: "INVESTMENT_GRADE",
    },
  });

  await prisma.competitor.createMany({
    data: [
      {
        projectId: project.id,
        name: "Ionity",
        description: "Joint-venture ultra-fast charging network along highways.",
        marketSharePct: 22,
        pricingModel: "Per-kWh, subscription discount",
        strengths: "Strong highway coverage, OEM backing",
        weaknesses: "High per-kWh price, limited urban presence",
        website: "https://ionity.eu",
      },
      {
        projectId: project.id,
        name: "EnBW mobility+",
        description: "Utility-backed charging network with broad urban and rural coverage.",
        marketSharePct: 18,
        pricingModel: "Per-kWh, app-based",
        strengths: "Largest charge point count in Germany",
        weaknesses: "Inconsistent uptime at older sites",
        website: "https://mobility-plus.enbw.com",
      },
      {
        projectId: project.id,
        name: "Allego",
        description: "Pan-European charging operator expanding urban fast-charging hubs.",
        marketSharePct: 9,
        pricingModel: "Per-kWh",
        strengths: "Fast urban hub rollout",
        weaknesses: "Smaller brand recognition",
        website: "https://allego.eu",
      },
    ],
  });

  const projectLike: ProjectLike = {
    id: project.id,
    name: project.name,
    industry: project.industry,
    country: project.country,
    targetCustomer: project.targetCustomer,
    businessType: project.businessType,
    budget: project.budget,
    investmentSize: project.investmentSize,
    currency: project.currency,
    competitorsRaw: project.competitorsRaw,
  };

  for (const type of SECTION_TYPES) {
    const content = generateMockSection(type, projectLike);
    await prisma.reportSection.create({
      data: {
        projectId: project.id,
        type,
        content: JSON.stringify(content),
        source: "AI-generated (simulated demo data)",
        confidenceScore: Math.round(60 + Math.random() * 20),
        generatedByAI: true,
      },
    });
  }

  const scores = computeScores(projectLike, 3);
  await prisma.score.create({
    data: {
      projectId: project.id,
      overall: scores.overall,
      opportunity: scores.opportunity,
      risk: scores.risk,
      competition: scores.competition,
      demand: scores.demand,
      profitability: scores.profitability,
      investmentRecommendation: scores.investmentRecommendation,
      breakdown: JSON.stringify(scores.breakdown),
    },
  });

  console.log(`Seeded demo user (${email} / password123) and project "${project.name}".`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
