import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <AppShell userName={session.user.name ?? session.user.email ?? "User"} userEmail={session.user.email ?? ""}>
      {children}
    </AppShell>
  );
}
