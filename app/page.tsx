import Link from "next/link";
import { getServerSession } from "next-auth/next";
import {
  BarChart3,
  Building2,
  Globe2,
  LineChart,
  Sparkles,
  Wallet,
  Users,
  FileDown,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnimatedSection } from "@/components/marketing/animated-section";

const FEATURES = [
  {
    icon: BarChart3,
    title: "Market Overview",
    description: "TAM/SAM/SOM, CAGR trends, PESTLE, SWOT, and Porter's Five Forces — generated and explainable.",
  },
  {
    icon: Building2,
    title: "Competitor Intelligence",
    description: "Track competitors, market share, pricing, and positioning with a live benchmark dashboard.",
  },
  {
    icon: Users,
    title: "Customer Analysis",
    description: "AI-generated personas, segmentation, and price sensitivity for your target buyer.",
  },
  {
    icon: Wallet,
    title: "Financial Modeling",
    description: "Revenue projections, ROI, break-even, and best/expected/worst scenario analysis.",
  },
  {
    icon: Globe2,
    title: "Geographic Analysis",
    description: "Live World Bank data — population, GDP, growth — plotted on an interactive map.",
  },
  {
    icon: FileDown,
    title: "Export Anywhere",
    description: "One-click PDF and Excel export of the full report, ready to share with stakeholders.",
  },
];

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  const ctaHref = session?.user ? "/dashboard" : "/signup";
  const ctaLabel = session?.user ? "Go to dashboard" : "Get started free";

  return (
    <div className="min-h-screen bg-grid-fade">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session?.user ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/signin">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-4xl px-6 pb-20 pt-16 text-center sm:pt-24">
          <AnimatedSection>
            <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-3 text-primary" />
              AI-powered market research, generated in minutes
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Market research that feels like a <span className="text-primary">terminal</span>, not a chatbot.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Market sizing, competitor intelligence, financial modeling, and geographic analysis — in one
              dashboard, with every metric explained and every AI insight cited.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href={ctaHref}>
                  {ctaLabel}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/signin">Try the demo account</Link>
              </Button>
            </div>
          </AnimatedSection>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.05}>
                <div className="h-full rounded-xl border border-border bg-card p-6">
                  <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="size-5" />
                  </div>
                  <p className="mb-1 font-medium">{f.title}</p>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-24">
          <AnimatedSection className="rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
            <LineChart className="mx-auto mb-4 size-8 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight">Every score, explained.</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Opportunity, risk, competition, demand, and profitability scores are computed from a transparent
              model — drill into the breakdown behind every number, and every AI-generated section carries a
              confidence score and a cited source.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-status-good" />
              No black-box conclusions — trace every insight back to its input.
            </div>
          </AnimatedSection>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-muted-foreground sm:flex-row">
          <Logo className="text-foreground" />
          <p>Built for consultants, investors, and corporate strategy teams.</p>
        </div>
      </footer>
    </div>
  );
}
