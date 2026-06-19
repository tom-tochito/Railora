import {
  ArrowRight,
  CircleDollarSign,
  CreditCard,
  EyeOff,
  Landmark,
  Link2,
  Plus,
  Send,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AmountDisplay } from "@/components/finance/amount-display";
import { InsightMetric } from "@/components/insight-metric";
import { PageHeader } from "@/components/page-header";
import { TransactionCard } from "@/components/payments/transaction-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  analyticsSummary,
  railoraOneSummary,
  settlementBatches,
  transactionFeed,
} from "@/lib/data/railora-one";
import { businesses, orders } from "@/lib/data/seed";
import { formatAED } from "@/lib/domain/money";

const quickActions = [
  { label: "Collect", icon: CreditCard, href: "/payments" },
  { label: "Pay out", icon: Send, href: "/payouts" },
  { label: "Create link", icon: Link2, href: "/invoices" },
  { label: "Convert", icon: CircleDollarSign, href: "/payments" },
  { label: "Add funds", icon: Plus, href: "/settlement" },
  { label: "More", icon: ArrowRight, href: "/routing" },
];

export default function DashboardPage() {
  const pockets = [
    {
      currency: "AED",
      available: railoraOneSummary.availableBalanceFils,
      pending: railoraOneSummary.pendingSettlementFils,
      state: "Settlement expected tomorrow",
    },
    {
      currency: "USD",
      available: 74_200_00,
      pending: 12_800_00,
      state: "FX preview available",
    },
    {
      currency: "SAR",
      available: 41_900_00,
      pending: 6_500_00,
      state: "Provider healthy",
    },
  ];

  return (
    <AppShell>
      <PageHeader
        badge="Railora One"
        title="Good evening. Money movement is under control."
        description="A financial command center for balances, payment activity, settlement readiness, provider routing, risk pressure, and privacy exposure."
        actions={
          <>
            <ButtonLink href="/payments" variant="secondary">
              View payments
            </ButtonLink>
            <ButtonLink href="/escrow/new">
              Create payment
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </>
        }
      />

      <section className="mb-6 grid min-w-0 gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="overflow-hidden border-brand/20 bg-ink text-white">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="success">Sandbox</Badge>
                <Badge tone="privacy">Privacy Mode on</Badge>
                <Badge tone="neutral">AED</Badge>
              </div>
              <p className="mt-8 text-sm text-white/60">Available operating balance</p>
              <p className="amount-tabular mt-2 break-words text-5xl font-semibold leading-none text-white sm:text-6xl">
                {formatAED(railoraOneSummary.availableBalanceFils)}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/70">
                <span className="inline-flex items-center gap-1 text-success">
                  <TrendingUp className="size-4" aria-hidden />
                  12.4% vs previous period
                </span>
                <span>{settlementBatches[0].status}</span>
                <span>Provider fallback recovered {formatAED(railoraOneSummary.recoveredFils)}</span>
              </div>
            </div>
            <div className="grid min-w-40 gap-2 rounded-[var(--radius-card)] border border-white/10 bg-white/8 p-4">
              {[38, 44, 29, 58, 52, 70, 64, 78].map((height, index) => (
                <div key={index} className="h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${height}%` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {quickActions.map(({ label, icon: Icon, href }) => (
              <ButtonLink
                key={label}
                href={href}
                variant="secondary"
                className="border-white/10 bg-white/10 text-white hover:bg-white/15"
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </ButtonLink>
            ))}
          </div>
        </Card>

        <div className="grid gap-4">
          <InsightMetric
            label="Processed volume"
            value={formatAED(railoraOneSummary.activeVolumeFils)}
            detail={`${orders.length} seeded payment and escrow records powering this sandbox.`}
            icon={<Landmark className="size-4" aria-hidden />}
            tone="brand"
          />
          <InsightMetric
            label="Privacy exposure"
            value="Low"
            detail="Average provider route shares three identifying fields."
            icon={<EyeOff className="size-4" aria-hidden />}
            tone="accent"
          />
        </div>
      </section>

      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Currency pockets</h2>
          <Badge tone="brand">{businesses.length} merchants connected</Badge>
        </div>
        <div className="grid auto-cols-[minmax(16rem,1fr)] grid-flow-col gap-3 overflow-x-auto pb-2 md:grid-flow-row md:grid-cols-3 md:overflow-visible">
          {pockets.map((pocket) => (
            <AmountDisplay
              key={pocket.currency}
              label={`${pocket.currency} pocket`}
              value={formatAED(pocket.available)}
              detail={`${formatAED(pocket.pending)} pending / ${pocket.state}`}
              masked
            />
          ))}
        </div>
      </section>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>
                Human-readable transaction feed with rail, provider, privacy, status, and amount.
              </CardDescription>
            </div>
            <ButtonLink href="/payments" variant="secondary" size="sm">
              Open payments
            </ButtonLink>
          </CardHeader>
          <div className="grid gap-3">
            {transactionFeed.slice(0, 4).map((transaction) => (
              <TransactionCard key={transaction.id} {...transaction} />
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
            <CardDescription>
              Operational signals that keep payment movement legible.
            </CardDescription>
          </CardHeader>
          <div className="grid gap-3">
            {analyticsSummary.map(([label, value, detail]) => (
              <div key={label} className="flex items-center justify-between gap-4 rounded-[var(--radius-control)] border border-border bg-surface-soft p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{label}</p>
                  <p className="text-xs text-muted">{detail}</p>
                </div>
                <p className="amount-tabular shrink-0 font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
