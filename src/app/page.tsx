import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  FileCheck2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatAED } from "@/lib/domain/money";
import { orders } from "@/lib/data/seed";

const totalVolume = orders.reduce(
  (sum, order) => sum + order.amountFils + order.vatFils,
  0,
);

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="railora-hero flex min-h-[86svh] items-end">
        <div className="w-full px-4 pb-14 pt-24 sm:px-6 lg:px-12">
          <div className="max-w-4xl text-white">
            <Badge className="border-white/30 bg-white/10 text-white shadow-none backdrop-blur">
              Private UAE fintech workspace
            </Badge>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-none sm:text-7xl lg:text-8xl">
              Railora
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
              Exclusive escrow intelligence for UAE businesses that need every
              counterparty, milestone, and ledger movement to feel legible before
              money is ever at stake.
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
                href="/admin"
                variant="secondary"
                size="lg"
                className="w-full border-white/35 bg-white/12 text-white backdrop-blur hover:bg-white/18 sm:w-auto"
              >
                Open admin console
              </ButtonLink>
            </div>
            <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
              {[
                ["Demo volume", formatAED(totalVolume)],
                ["Verification", "5 / 6 checks"],
                ["Risk desk", "Live sandbox"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/20 bg-white/10 p-4 shadow-[0_18px_44px_rgba(0,0,0,0.12)] backdrop-blur"
                >
                  <p className="text-xs uppercase text-white/60">{label}</p>
                  <p className="mt-2 text-lg font-semibold">{value}</p>
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
              icon: ShieldCheck,
              label: "Verified counterparties",
              detail: "Identity, licence, tax, bank, owner, and risk signals in one calm profile.",
            },
            {
              icon: FileCheck2,
              label: "Concierge-grade orders",
              detail: "Milestones, evidence, invoice context, and audit history stay together.",
            },
            {
              icon: Banknote,
              label: "Escrow clarity",
              detail: `${formatAED(totalVolume)} demo AED protected across seed orders.`,
            },
            {
              icon: BadgeCheck,
              label: "Explainable trust",
              detail: "Scores surface verification depth, dispute behavior, and repeat trade.",
            },
          ].map((item) => (
            <Card key={item.label} className="min-h-36">
              <div className="flex size-10 items-center justify-center rounded-md border border-teal-100 bg-teal-50 text-brand">
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
            <p className="text-sm font-semibold uppercase text-brand">
              Trust layer over payments
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Built for high-confidence trade conversations.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Trade intent is captured before funds move.",
              "Ledger rows must balance before release is shown.",
              "Counterparties see verification depth and risk explanations.",
              "Admins can inspect disputes, freezes, and reconciliation moments.",
            ].map((text) => (
              <div
                key={text}
                className="rounded-lg border border-border bg-surface p-4 text-sm leading-6 shadow-sm"
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-12">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Private workspace",
              text: "Deal rooms feel curated, composed, and ready for high-stakes commercial review.",
            },
            {
              icon: LockKeyhole,
              title: "Sandbox boundaries",
              text: "No real funds, identity checks, sanctions, or reconciliation integrations are executed here.",
            },
            {
              icon: ArrowRight,
              title: "Operating rhythm",
              text: "Verification, escrow, invoices, scoring, disputes, and admin review share one calm flow.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border p-5">
              <div className="flex size-10 items-center justify-center rounded-md bg-ink text-accent">
                <item.icon className="size-5" aria-hidden />
              </div>
              <h2 className="mt-4 text-base font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
