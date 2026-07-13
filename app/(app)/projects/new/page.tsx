"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RESEARCH_DEPTHS, RESEARCH_DEPTH_LABELS, type ResearchDepth } from "@/lib/constants";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    industry: "",
    country: "",
    region: "",
    city: "",
    targetCustomer: "",
    objective: "",
    businessType: "",
    competitorsRaw: "",
    budget: "",
    investmentSize: "",
    currency: "USD",
    researchDepth: "PROFESSIONAL" as ResearchDepth,
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const project = await res.json();
      toast.success("Project created");
      router.push(`/projects/${project.id}`);
    } catch {
      toast.error("Could not create project — check required fields");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">New Research Project</h1>
      <p className="mb-8 text-muted-foreground">
        Define your market and objective. You can refine or regenerate every section with AI afterward.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project basics</CardTitle>
            <CardDescription>What are you researching, and why?</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Project name *</Label>
              <Input id="name" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. EV Charging Network Expansion" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Market / Industry *</Label>
              <Input id="industry" required value={form.industry} onChange={(e) => set("industry", e.target.value)} placeholder="e.g. Electric vehicle charging" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType">Business type</Label>
              <Input id="businessType" value={form.businessType} onChange={(e) => set("businessType", e.target.value)} placeholder="e.g. B2C, SaaS, Marketplace" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="objective">Research objective</Label>
              <Textarea id="objective" value={form.objective} onChange={(e) => set("objective", e.target.value)} placeholder="What decision will this research inform?" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Geography</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input id="country" required value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="e.g. Germany" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input id="region" value={form.region} onChange={(e) => set("region", e.target.value)} placeholder="e.g. Europe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Berlin" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer & competition</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="targetCustomer">Target customer</Label>
              <Input id="targetCustomer" value={form.targetCustomer} onChange={(e) => set("targetCustomer", e.target.value)} placeholder="e.g. Urban EV owners without home charging" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="competitorsRaw">Known competitors</Label>
              <Input id="competitorsRaw" value={form.competitorsRaw} onChange={(e) => set("competitorsRaw", e.target.value)} placeholder="Comma-separated, e.g. Tesla Supercharger, Ionity" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Budget & research depth</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input id="budget" type="number" min={0} value={form.budget} onChange={(e) => set("budget", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="investmentSize">Investment size</Label>
              <Input id="investmentSize" type="number" min={0} value={form.investmentSize} onChange={(e) => set("investmentSize", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" value={form.currency} onChange={(e) => set("currency", e.target.value.toUpperCase())} maxLength={6} />
            </div>
            <div className="space-y-2">
              <Label>Research depth</Label>
              <Select value={form.researchDepth} onValueChange={(v) => set("researchDepth", v as ResearchDepth)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESEARCH_DEPTHS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {RESEARCH_DEPTH_LABELS[d]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={loading} size="lg">
            {loading ? "Creating…" : "Create project"}
          </Button>
        </div>
      </form>
    </div>
  );
}
