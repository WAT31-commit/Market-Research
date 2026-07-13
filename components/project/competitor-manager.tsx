"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface CompetitorItem {
  id: string;
  name: string;
  description: string | null;
  marketSharePct: number | null;
  pricingModel: string | null;
  strengths: string | null;
  weaknesses: string | null;
  website: string | null;
}

export function CompetitorManager({ projectId, competitors }: { projectId: string; competitors: CompetitorItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    marketSharePct: "",
    pricingModel: "",
    strengths: "",
    weaknesses: "",
    website: "",
  });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/competitors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setOpen(false);
      setForm({ name: "", description: "", marketSharePct: "", pricingModel: "", strengths: "", weaknesses: "", website: "" });
      toast.success("Competitor added");
      router.refresh();
    } catch {
      toast.error("Could not add competitor");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(competitorId: string) {
    try {
      const res = await fetch(`/api/projects/${projectId}/competitors/${competitorId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Competitor removed");
      router.refresh();
    } catch {
      toast.error("Could not remove competitor");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="size-3.5" />
              Add Competitor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add competitor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="c-name">Name *</Label>
                <Input id="c-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="c-share">Market share %</Label>
                  <Input
                    id="c-share"
                    type="number"
                    min={0}
                    max={100}
                    value={form.marketSharePct}
                    onChange={(e) => setForm((f) => ({ ...f, marketSharePct: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-pricing">Pricing model</Label>
                  <Input id="c-pricing" value={form.pricingModel} onChange={(e) => setForm((f) => ({ ...f, pricingModel: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-desc">Description</Label>
                <Textarea id="c-desc" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="c-strengths">Strengths</Label>
                  <Input id="c-strengths" value={form.strengths} onChange={(e) => setForm((f) => ({ ...f, strengths: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-weaknesses">Weaknesses</Label>
                  <Input id="c-weaknesses" value={form.weaknesses} onChange={(e) => setForm((f) => ({ ...f, weaknesses: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-website">Website</Label>
                <Input id="c-website" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? "Adding…" : "Add competitor"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {competitors.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No competitors tracked yet. Add one to populate the market share chart and benchmark table.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {competitors.map((c) => (
            <Card key={c.id}>
              <CardContent className="pt-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    {c.marketSharePct != null && (
                      <p className="text-xs text-muted-foreground">{c.marketSharePct}% market share</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {c.website && (
                      <a href={c.website} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                    <button onClick={() => handleDelete(c.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
                {c.description && <p className="mb-2 text-sm text-muted-foreground">{c.description}</p>}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {c.pricingModel && (
                    <div>
                      <p className="text-muted-foreground">Pricing</p>
                      <p>{c.pricingModel}</p>
                    </div>
                  )}
                  {c.strengths && (
                    <div>
                      <p className="text-muted-foreground">Strengths</p>
                      <p>{c.strengths}</p>
                    </div>
                  )}
                  {c.weaknesses && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Weaknesses</p>
                      <p>{c.weaknesses}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
