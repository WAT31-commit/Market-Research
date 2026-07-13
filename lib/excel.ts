import ExcelJS from "exceljs";
import type { FinancialProjectionContent, MarketSizeContent } from "@/lib/section-types";

export interface ExcelProjectData {
  name: string;
  competitors: { name: string; description: string | null; marketSharePct: number | null; pricingModel: string | null; website: string | null }[];
  marketSize: MarketSizeContent | null;
  financials: FinancialProjectionContent | null;
}

export async function renderProjectExcel(data: ExcelProjectData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Market Research Platform";
  workbook.created = new Date();

  const competitorSheet = workbook.addWorksheet("Competitors");
  competitorSheet.columns = [
    { header: "Name", key: "name", width: 24 },
    { header: "Description", key: "description", width: 40 },
    { header: "Market Share %", key: "marketSharePct", width: 16 },
    { header: "Pricing Model", key: "pricingModel", width: 20 },
    { header: "Website", key: "website", width: 28 },
  ];
  competitorSheet.getRow(1).font = { bold: true };
  data.competitors.forEach((c) => competitorSheet.addRow(c));

  if (data.marketSize) {
    const sheet = workbook.addWorksheet("Market Size");
    sheet.columns = [
      { header: "Metric", key: "metric", width: 24 },
      { header: "Value", key: "value", width: 20 },
    ];
    sheet.getRow(1).font = { bold: true };
    sheet.addRow({ metric: "TAM (USD millions)", value: data.marketSize.tam });
    sheet.addRow({ metric: "SAM (USD millions)", value: data.marketSize.sam });
    sheet.addRow({ metric: "SOM (USD millions)", value: data.marketSize.som });
    sheet.addRow({ metric: "CAGR %", value: data.marketSize.cagrPct });
    sheet.addRow({});
    sheet.addRow({ metric: "Year", value: "Projected value (USD bn)" }).font = { bold: true };
    data.marketSize.projectedGrowth.forEach((p) => sheet.addRow({ metric: p.year, value: p.valueBn }));
  }

  if (data.financials) {
    const sheet = workbook.addWorksheet("Financial Projection");
    sheet.columns = [
      { header: "Year", key: "year", width: 10 },
      { header: "Revenue", key: "revenue", width: 16 },
      { header: "Cost", key: "cost", width: 16 },
      { header: "Gross Margin %", key: "grossMarginPct", width: 16 },
      { header: "Net Margin %", key: "netMarginPct", width: 16 },
    ];
    sheet.getRow(1).font = { bold: true };
    data.financials.years.forEach((y) => sheet.addRow(y));
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
