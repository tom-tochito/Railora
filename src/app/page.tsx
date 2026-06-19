import {
  ArrowRight,
  Braces,
  EyeOff,
  GitBranch,
  Landmark,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Sparkline } from "@/components/charts/sparkline";
import { TrendBars } from "@/components/charts/trend-bars";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  providerHealth,
  railoraOneSummary,
  settlementTrend,
  successTrend,
  volumeTrend,
} from "@/lib/data/railora-one";
import { formatAED } from "@/lib/domain/money";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="railora-hero flex min-h-[90svh] items-end">
        <div className="w-full px-4 pb-16 pt-28 sm:px-6 lg:px-12">
          <div className="max-w-5xl text-white">
            <Badge className="animate-railora-rise border-white/30 bg-white/10 text-white shadow-none backdrop-blur">
              Railora One / UAE-first payment orchestration
            </Badge>
            <h1
              className="animate-railora-rise mt-7 max-w-4xl text-5xl font-semibold leading-none tracking-tight sm:text-7xl lg:text-8xl"
              style={{ animationDelay: "80ms" }}
            >
              Railora
            </h1>
            <p
              className="animate-railora-rise mt-6 max-w-2xl text-lg leading-8 text-white/78"
              style={{ animationDelay: "160ms" }}
            >
              One API and one calm operations console for payments, payouts,
              settlement, reconciliation, risk, privacy, KYB, webhooks, and
              intelligent routing.
            </p>
            <div
              className="animate-railora-rise mt-9 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "240ms" }}
            >
              <ButtonLink href="/auth" size="lg" className="hover-lift w-full sm:w-auto">
                Enter workspace
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink
                href="/dashboard"
                variant="secondary"
                size="lg"
                className="hover-lift w-full border-white/35 bg-white/12 text-white backdrop-blur hover:bg-white/18 sm:w-auto"
              >
                View command center
              </ButtonLink>
              <ButtonLink
                href="/routing"
                variant="secondary"
                size="lg"
                className="hover-lift w-full border-white/35 bg-white/12 text-white backdrop-blur hover:bg-white/18 sm:w-auto"
              >
                Open Rail Map
              </ButtonLink>
            </div>
            <div className="mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Processed volume",
                  value: formatAED(railoraOneSummary.activeVolumeFils),
                  chart: <Sparkline data={volumeTrend} color="#a5b4fc" id="hero-volume" className="mt-4 h-12 w-full" showDot={false} />,
                },
                {
                  label: "Provider health",
                  value: `${providerHealth.length} routes watched`,
                  chart: <Sparkline data={successTrend} color="#6ee7b7" id="hero-success" className="mt-4 h-12 w-full" showDot={false} />,
                },
                {
                  label: "Privacy posture",
                  value: "Masked by default",
                  chart: <TrendBars data={settlementTrend} color="#d8b4fe" trackColor="rgba(255,255,255,0.08)" className="mt-4 h-12 w-full" />,
                },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="hover-lift animate-railora-rise rounded-[var(--radius-card)] border border-white/20 bg-white/10 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.18)] backdrop-blur"
                  style={{ animationDelay: `${320 + index * 90}ms` }}
                >
                  <p className="eyebrow text-white/60">{stat.label}</p>
                  <p className="amount-mono mt-2 text-lg font-semibold">{stat.value}</p>
                  {stat.chart}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="-mt-12 px-4 pb-14 sm:px-6 lg:px-12">
        <div className="grid gap-5 lg:grid-cols-4">
          {[
            {
              icon: GitBranch,
              label: "Intelligent routing",
              detail: "Smart, fastest, lowest-cost, highest-success, privacy-first, and manual provider objectives.",
            },
            {
              icon: Landmark,
              label: "Settlement clarity",
              detail: "Batches, reserves, fees, refunds, chargebacks, and unmatched items are visible in one timeline.",
            },
            {
              icon: EyeOff,
              label: "Privacy-first controls",
              detail: "Sensitive customer, beneficiary, API key, and webhook fields stay masked until explicitly revealed.",
            },
            {
              icon: Braces,
              label: "Developer operations",
              detail: "Sandbox/live keys, webhooks, event logs, request traces, and provider simulation share the same system.",
            },
          ].map((item, index) => (
            <Card
              key={item.label}
              className="hover-lift animate-railora-rise min-h-44"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex size-10 items-center justify-center rounded-[var(--radius-control)] border border-brand/15 bg-brand-soft text-brand">
                <item.icon className="size-5" aria-hidden />
              </div>
              <h2 className="mt-5 text-base font-semibold">{item.label}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-12">
        <div className="overflow-hidden rounded-[var(--radius-panel)] border border-brand/20 bg-ink p-6 text-white shadow-[var(--shadow-float)] sm:p-8">
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-white/50">Live sandbox telemetry</span>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Every rail, settlement, and privacy signal in one view.
            </h2>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <div className="rounded-[var(--radius-card)] border border-white/10 bg-white/[0.06] p-5">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-white/55">Processed volume</span>
                <span className="amount-mono inline-flex items-center gap-1 text-xs font-semibold text-success">
                  <TrendingUp className="size-3.5" aria-hidden />
                  +24%
                </span>
              </div>
              <p className="amount-mono mt-3 text-2xl font-semibold">
                {formatAED(railoraOneSummary.activeVolumeFils)}
              </p>
              <Sparkline data={volumeTrend} color="var(--brand)" id="showcase-volume" className="mt-4 h-24 w-full" />
            </div>
            <div className="rounded-[var(--radius-card)] border border-white/10 bg-white/[0.06] p-5">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-white/55">Authorization success</span>
                <span className="amount-mono text-xs font-semibold text-success">99.1%</span>
              </div>
              <p className="amount-mono mt-3 text-2xl font-semibold">{railoraOneSummary.successRate}</p>
              <Sparkline data={successTrend} color="var(--success)" id="showcase-success" className="mt-4 h-24 w-full" />
            </div>
            <div className="rounded-[var(--radius-card)] border border-white/10 bg-white/[0.06] p-5">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-white/55">Settlement throughput</span>
                <span className="amount-mono text-xs font-semibold text-privacy">9 batches</span>
              </div>
              <p className="amount-mono mt-3 text-2xl font-semibold">
                {formatAED(railoraOneSummary.recoveredFils)} recovered
              </p>
              <TrendBars data={settlementTrend} color="var(--privacy)" trackColor="rgba(255,255,255,0.08)" className="mt-4 h-24 w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-12">
        <div className="grid gap-8 border-y border-border py-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold text-brand">Financial operating system</p>
            <h2 className="mt-3 text-3xl font-semibold">
              Consumer-fintech simplicity with enterprise payment operations.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Users can understand balance, settlement state, and required actions immediately.",
              "Operators keep dense tables, audit trails, and reconciliation evidence when they need them.",
              "Provider fallback and privacy tradeoffs are visible before a route is published.",
              "Existing escrow, invoice, KYB, risk, dispute, and audit flows remain operational.",
            ].map((text) => (
              <div
                key={text}
                className="rounded-[var(--radius-card)] border border-border bg-surface p-4 text-sm leading-6 shadow-sm"
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-12">
        <div className="rounded-[var(--radius-panel)] border border-border bg-ink p-6 text-white">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <ShieldCheck className="size-6 text-brand" aria-hidden />
              <h2 className="mt-4 text-2xl font-semibold">Sandbox boundaries stay explicit.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/64">
                Railora One remains a high-fidelity prototype. No production funds, KYB,
                provider integrations, queues, R2 storage, or D1 state are introduced here.
              </p>
            </div>
            <ButtonLink href="/design-system" variant="secondary" className="border-white/10 bg-white/10 text-white hover:bg-white/15">
              View design system
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
