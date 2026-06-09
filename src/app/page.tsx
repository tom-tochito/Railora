import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  FileCheck2,
  ShieldCheck,
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
      <section className="railora-hero flex min-h-[92vh] items-end">
        <div className="w-full px-4 pb-16 pt-24 sm:px-6 lg:px-12">
          <div className="max-w-4xl text-white">
            <Badge className="border-white/30 bg-white/12 text-white backdrop-blur">
              UAE sandbox prototype · no real money movement
            </Badge>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
              Secure B2B trade in the UAE with verified escrow.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">
              Railora helps buyers and sellers verify each other, create
              structured orders, fund milestone escrow in sandbox mode, upload
              delivery evidence, resolve disputes, and build a transparent trade
              score.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/auth" size="lg">
                Create demo order
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/dashboard" variant="secondary" size="lg">
                View seller demo
              </ButtonLink>
              <ButtonLink href="/admin" variant="secondary" size="lg">
                Open admin console
              </ButtonLink>
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
              detail: "UAE PASS, DUL, TRN, bank ownership, BO and sanctions placeholders.",
            },
            {
              icon: FileCheck2,
              label: "Legible order structure",
              detail: "Milestones, delivery evidence, invoice context, and audit trail.",
            },
            {
              icon: Banknote,
              label: "Sandbox escrow",
              detail: `${formatAED(totalVolume)} demo AED protected across seed orders.`,
            },
            {
              icon: BadgeCheck,
              label: "Trade score",
              detail: "Explainable signals for verification depth, disputes, and repeat trade.",
            },
          ].map((item) => (
            <Card key={item.label} className="min-h-36">
              <item.icon className="size-5 text-brand" aria-hidden />
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
              Not a wallet, payment link, or bank.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Railora records trade intent before money moves.",
              "Ledger rows balance before any sandbox release is shown.",
              "Counterparties see verification depth and risk explanations.",
              "Admins can inspect disputes, freezes, and reconciliation events.",
            ].map((text) => (
              <div key={text} className="rounded-lg bg-surface p-4 text-sm leading-6">
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
