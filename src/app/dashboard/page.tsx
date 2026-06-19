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
import { Sparkline } from "@/components/charts/sparkline";
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
  volumeTrend,
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

      <section className="mb-8 grid min-w-0 gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="animate-railora-rise overflow-hidden border-brand/20 bg-ink text-white">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="success">Sandbox</Badge>
                <Badge tone="privacy">Privacy Mode on</Badge>
                <Badge tone="neutral">AED</Badge>
              </div>
              <p className="eyebrow mt-8 text-white/55">Available operating balance</p>
              <p className="amount-mono mt-3 whitespace-nowrap text-4xl font-semibold leading-none text-white sm:text-5xl">
                {formatAED(railoraOneSummary.availableBalanceFils)}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
                <span className="inline-flex items-center gap-1 font-semibold text-success">
                  <TrendingUp className="size-4" aria-hidden />
                  12.4% vs previous period
                </span>
                <span>{settlementBatches[0].status}</span>
                <span>Provider fallback recovered {formatAED(railoraOneSummary.recoveredFils)}</span>
              </div>
            </div>
            <div className="w-full shrink-0 rounded-[var(--radius-card)] border border-white/10 bg-white/[0.06] p-4 lg:w-64">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-white/55">Volume · 14d</span>
                <span className="amount-mono text-xs font-semibold text-success">+24%</span>
              </div>
              <Sparkline
                data={volumeTrend}
                color="var(--brand)"
                id="dashboard-volume"
                className="mt-3 h-20 w-full"
              />
            </div>
          </div>
          <div className="mt-9 border-t border-white/10 pt-6">
            <p className="eyebrow mb-4 text-white/45">Quick actions</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {quickActions.map(({ label, icon: Icon, href }) => (
                <ButtonLink
                  key={label}
                  href={href}
                  variant="secondary"
                  className="hover-lift min-h-[5.25rem] flex-col justify-center gap-2.5 border-white/10 bg-white/[0.06] px-3 text-white hover:border-white/20 hover:bg-white/12"
                >
                  <span className="flex size-9 items-center justify-center rounded-[var(--radius-control)] bg-white/10 text-white">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold">{label}</span>
                </ButtonLink>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid gap-5">
          <InsightMetric
            label="Processed volume"
            value={formatAED(railoraOneSummary.activeVolumeFils)}
            detail={`${orders.length} seeded payment and escrow records powering this sandbox.`}
            icon={<Landmark className="size-4" aria-hidden />}
            tone="brand"
            className="hover-lift animate-railora-rise"
          />
          <InsightMetric
            label="Privacy exposure"
            value="Low"
            detail="Average provider route shares three identifying fields."
            icon={<EyeOff className="size-4" aria-hidden />}
            tone="accent"
            className="hover-lift animate-railora-rise"
          />
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Currency pockets</h2>
          <Badge tone="brand">{businesses.length} merchants connected</Badge>
        </div>
        <div className="grid auto-cols-[minmax(16rem,1fr)] grid-flow-col gap-4 overflow-x-auto pb-2 md:grid-flow-row md:grid-cols-3 md:overflow-visible">
          {pockets.map((pocket, index) => (
            <AmountDisplay
              key={pocket.currency}
              label={`${pocket.currency} pocket`}
              value={formatAED(pocket.available)}
              detail={`${formatAED(pocket.pending)} pending / ${pocket.state}`}
              masked
              className="hover-lift animate-railora-rise"
              style={{ animationDelay: `${index * 70}ms` }}
            />
          ))}
        </div>
      </section>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="animate-railora-rise">
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
            {transactionFeed.slice(0, 4).map((transaction, index) => (
              <div
                key={transaction.id}
                className="animate-railora-rise"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <TransactionCard {...transaction} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="animate-railora-rise">
          <CardHeader>
            <CardTitle>Insights</CardTitle>
            <CardDescription>
              Operational signals that keep payment movement legible.
            </CardDescription>
          </CardHeader>
          <div className="grid gap-3">
            {analyticsSummary.map(([label, value, detail], index) => (
              <div
                key={label}
                className="hover-lift animate-railora-rise flex items-center justify-between gap-4 rounded-[var(--radius-control)] border border-border bg-surface-soft p-3.5"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{label}</p>
                  <p className="text-xs text-muted">{detail}</p>
                </div>
                <p className="amount-mono shrink-0 font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
