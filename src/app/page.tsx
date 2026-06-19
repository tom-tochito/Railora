import {
  ArrowRight,
  Braces,
  EyeOff,
  GitBranch,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { providerHealth, railoraOneSummary } from "@/lib/data/railora-one";
import { formatAED } from "@/lib/domain/money";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="railora-hero flex min-h-[88svh] items-end">
        <div className="w-full px-4 pb-14 pt-24 sm:px-6 lg:px-12">
          <div className="max-w-5xl text-white">
            <Badge className="border-white/30 bg-white/10 text-white shadow-none backdrop-blur">
              Railora One / UAE-first payment orchestration
            </Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-none sm:text-7xl lg:text-8xl">
              Railora
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
              One API and one calm operations console for payments, payouts,
              settlement, reconciliation, risk, privacy, KYB, webhooks, and
              intelligent routing.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/auth" size="lg" className="w-full sm:w-auto">
                Enter workspace
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink
                href="/dashboard"
                variant="secondary"
                size="lg"
                className="w-full border-white/35 bg-white/12 text-white backdrop-blur hover:bg-white/18 sm:w-auto"
              >
                View command center
              </ButtonLink>
              <ButtonLink
                href="/routing"
                variant="secondary"
                size="lg"
                className="w-full border-white/35 bg-white/12 text-white backdrop-blur hover:bg-white/18 sm:w-auto"
              >
                Open Rail Map
              </ButtonLink>
            </div>
            <div className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
              {[
                ["Processed volume", formatAED(railoraOneSummary.activeVolumeFils)],
                ["Provider health", `${providerHealth.length} routes watched`],
                ["Privacy posture", "Masked by default"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[var(--radius-card)] border border-white/20 bg-white/10 p-4 shadow-[0_18px_44px_rgba(0,0,0,0.12)] backdrop-blur"
                >
                  <p className="text-xs text-white/60">{label}</p>
                  <p className="amount-tabular mt-2 text-lg font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="-mt-10 px-4 pb-12 sm:px-6 lg:px-12">
        <div className="grid gap-4 lg:grid-cols-4">
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
          ].map((item) => (
            <Card key={item.label} className="min-h-40">
              <div className="flex size-10 items-center justify-center rounded-[var(--radius-control)] border border-brand/15 bg-brand-soft text-brand">
                <item.icon className="size-5" aria-hidden />
              </div>
              <h2 className="mt-4 text-base font-semibold">{item.label}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
            </Card>
          ))}
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
