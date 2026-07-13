import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSourceList } from "@/components/settings/data-source-list";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const connections = session?.user?.id
    ? await prisma.dataSourceConnection.findMany({ where: { userId: session.user.id } })
    : [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and data source connections.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Name: </span>
            {session?.user?.name}
          </p>
          <p>
            <span className="text-muted-foreground">Email: </span>
            {session?.user?.email}
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-1 text-lg font-medium">Data Sources</h2>
        <CardDescription className="mb-4">
          World Bank data and AI generation are live and free/keyless (AI generation falls back to simulated
          output without a key). Enterprise sources require a paid contract and are not connected in this build —
          add credentials here once available.
        </CardDescription>
        <DataSourceList
          connections={connections.map((c) => ({ provider: c.provider, status: c.status as "CONNECTED" | "NOT_CONFIGURED" }))}
        />
      </div>
    </div>
  );
}
