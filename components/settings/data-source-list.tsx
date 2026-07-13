"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, CircleDashed } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DATA_SOURCE_PROVIDERS } from "@/lib/constants";

export interface ConnectionState {
  provider: string;
  status: "CONNECTED" | "NOT_CONFIGURED";
}

export function DataSourceList({ connections }: { connections: ConnectionState[] }) {
  const router = useRouter();
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const statusByProvider = new Map(connections.map((c) => [c.provider, c.status]));

  async function save(providerId: string) {
    setSaving(providerId);
    try {
      const res = await fetch("/api/settings/data-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: providerId, apiKey: keys[providerId] ?? "" }),
      });
      if (!res.ok) throw new Error();
      toast.success("Connection updated");
      router.refresh();
    } catch {
      toast.error("Could not update connection");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-3">
      {DATA_SOURCE_PROVIDERS.map((provider) => {
        const status = provider.live ? statusByProvider.get(provider.id) ?? (provider.id === "world_bank" ? "CONNECTED" : "NOT_CONFIGURED") : "NOT_CONFIGURED";
        const connected = status === "CONNECTED";
        return (
          <Card key={provider.id}>
            <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{provider.name}</p>
                  <Badge variant={connected ? "default" : "outline"} className="gap-1 font-normal">
                    {connected ? <CheckCircle2 className="size-3" /> : <CircleDashed className="size-3" />}
                    {connected ? "Connected" : "Not configured"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{provider.description}</p>
              </div>
              {provider.id !== "world_bank" && (
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="API key"
                    className="w-48"
                    value={keys[provider.id] ?? ""}
                    onChange={(e) => setKeys((k) => ({ ...k, [provider.id]: e.target.value }))}
                    disabled={!provider.live}
                  />
                  <Button size="sm" onClick={() => save(provider.id)} disabled={!provider.live || saving === provider.id}>
                    {saving === provider.id ? "Saving…" : "Save"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
