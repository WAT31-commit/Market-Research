"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfidenceBadge } from "@/components/reports/confidence-badge";
import { SourceCitation } from "@/components/reports/source-citation";
import type { SectionType } from "@/lib/constants";

export function SectionCard({
  projectId,
  type,
  title,
  source,
  confidenceScore,
  empty,
  children,
}: {
  projectId: string;
  type: SectionType;
  title: string;
  source: string | null;
  confidenceScore: number | null;
  empty: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function regenerate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (!res.ok) throw new Error();
      toast.success(`${title} generated`);
      router.refresh();
    } catch {
      toast.error("Generation failed — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <div className="flex items-center gap-3">
          <CardTitle>{title}</CardTitle>
          <ConfidenceBadge score={confidenceScore} />
        </div>
        <Button size="sm" variant="outline" onClick={regenerate} disabled={loading} className="gap-1.5">
          <RefreshCw className={loading ? "size-3.5 animate-spin" : "size-3.5"} />
          {empty ? "Generate with AI" : "Regenerate"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {empty ? (
          <p className="text-sm text-muted-foreground">
            Not generated yet. Click &ldquo;Generate with AI&rdquo; to create this section.
          </p>
        ) : (
          <>
            {children}
            {source && <SourceCitation source={source} />}
          </>
        )}
      </CardContent>
    </Card>
  );
}
