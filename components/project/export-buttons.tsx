"use client";

import { useState } from "react";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

async function download(url: string, fallbackName: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Export failed");
  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition") ?? "";
  const match = disposition.match(/filename="(.+)"/);
  const filename = match?.[1] ?? fallbackName;

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

export function ExportButtons({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState<"pdf" | "excel" | null>(null);

  async function handleExport(kind: "pdf" | "excel") {
    setLoading(kind);
    try {
      await download(
        `/api/projects/${projectId}/export/${kind}`,
        kind === "pdf" ? "report.pdf" : "data.xlsx"
      );
    } catch {
      toast.error("Export failed — please try again");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleExport("pdf")} disabled={loading !== null}>
        <FileDown className="size-3.5" />
        {loading === "pdf" ? "Exporting…" : "Export PDF"}
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleExport("excel")} disabled={loading !== null}>
        <FileSpreadsheet className="size-3.5" />
        {loading === "excel" ? "Exporting…" : "Export Excel"}
      </Button>
    </div>
  );
}
