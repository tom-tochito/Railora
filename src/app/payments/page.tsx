import { ArrowRight, CheckCircle2, Clock3, Download, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AmountDisplay } from "@/components/finance/amount-display";
import { InsightMetric } from "@/components/insight-metric";
import { PageHeader } from "@/components/page-header";
import { TransactionCard } from "@/components/payments/transaction-card";
import { PrivacyMask } from "@/components/privacy/privacy-mask";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TableScroll } from "@/components/ui/table-scroll";
import { railoraOneSummary, transactionFeed } from "@/lib/data/railora-one";
import { formatAED } from "@/lib/domain/money";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ transaction?: string }>;
}) {
  const query = await searchParams;
  const selected =
    transactionFeed.find((transaction) => transaction.id === query.transaction) ??
    transactionFeed[0];

  return (
    <AppShell>
      <PageHeader
        badge="Payments"
        title="Transactions that explain themselves"
        description="Searchable payment activity with privacy-aware customer display, provider routing context, settlement state, and audit-ready detail."
        actions={
          <ButtonLink href="/escrow/new">
            Create payment
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        }
      />

      <div className="mb-6 grid gap-3 lg:grid-cols-4">
        <AmountDisplay
          label="Processed volume"
          value={formatAED(railoraOneSummary.activeVolumeFils)}
          detail="Across cards, instant transfer, escrow, invoices, and protected payout movements."
          masked
        />
        <InsightMetric
          label="Success rate"
          value={railoraOneSummary.successRate}
          detail="Weighted by recent provider health and fallback recovery."
          icon={<CheckCircle2 className="size-4" aria-hidden />}
          tone="success"
        />
        <InsightMetric
          label="Pending settlement"
          value={formatAED(railoraOneSummary.pendingSettlementFils)}
          detail="Net amount expected across open batches."
          icon={<Clock3 className="size-4" aria-hidden />}
          tone="brand"
        />
        <InsightMetric
          label="Failed payments"
          value={railoraOneSummary.failedPayments}
          detail="Two can be retried through backup rails."
          icon={<SlidersHorizontal className="size-4" aria-hidden />}
          tone="danger"
        />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {["All", "Succeeded", "Review", "Cards", "Instant transfer", "AED", "Provider", "Today"].map(
          (filter) => (
            <Badge key={filter} tone={filter === "All" ? "brand" : "neutral"}>
              {filter}
            </Badge>
          ),
        )}
        <ButtonLink href="/api/audit" variant="secondary" size="sm" className="ml-auto">
          <Download className="size-4" aria-hidden />
          Export CSV
        </ButtonLink>
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[1.35fr_0.8fr]">
        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Feed view</CardTitle>
                <CardDescription>
                  Accessible transaction feed with provider, rail, risk, privacy, and amount context.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge tone="brand">Feed</Badge>
                <Badge tone="neutral">Table</Badge>
                <Badge tone="neutral">Analytics</Badge>
              </div>
            </CardHeader>
            <div className="grid gap-3">
              {transactionFeed.map((transaction) => (
                <TransactionCard key={transaction.id} {...transaction} />
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Table mode</CardTitle>
              <CardDescription>
                Sticky-header operations table with privacy-aware customer and provider columns.
              </CardDescription>
            </CardHeader>
            <TableScroll>
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="sticky top-0 border-b border-border bg-surface-elevated text-xs text-muted">
                  <tr>
                    <th className="py-3 pl-4 pr-4 font-semibold">Reference</th>
                    <th className="py-3 pr-4 font-semibold">Merchant</th>
                    <th className="py-3 pr-4 font-semibold">Customer</th>
                    <th className="py-3 pr-4 font-semibold">Rail</th>
                    <th className="py-3 pr-4 font-semibold">Provider</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                    <th className="py-3 pr-4 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactionFeed.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="py-3 pl-4 pr-4 font-mono text-xs">
                        {transaction.reference}
                      </td>
                      <td className="py-3 pr-4">{transaction.merchant}</td>
                      <td className="py-3 pr-4">
                        <PrivacyMask value={transaction.customer} masked="Customer ****" label="customer" />
                      </td>
                      <td className="py-3 pr-4">{transaction.rail}</td>
                      <td className="py-3 pr-4">{transaction.provider}</td>
                      <td className="py-3 pr-4">
                        <Badge tone="brand">{transaction.status}</Badge>
                      </td>
                      <td className="amount-tabular py-3 pr-4 font-semibold">
                        {transaction.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroll>
          </Card>
        </div>

        <aside className="min-w-0 xl:sticky xl:top-24 xl:self-start">
          <Card className="space-y-5">
            <CardHeader>
              <CardTitle>Transaction detail</CardTitle>
              <CardDescription>
                Main status, routing explanation, fees, settlement, risk, webhook, privacy, and audit context.
              </CardDescription>
            </CardHeader>
            <div className="rounded-[var(--radius-card)] border border-brand/20 bg-brand-soft p-5">
              <p className="font-mono text-xs text-brand">{selected.reference}</p>
              <h2 className="mt-2 text-xl font-semibold">{selected.title}</h2>
              <p className="amount-tabular mt-3 text-3xl font-semibold">{selected.amount}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="brand">{selected.status}</Badge>
                <Badge tone="privacy">{selected.privacy}</Badge>
              </div>
            </div>
            {[
              ["Customer", <PrivacyMask key="customer" value={selected.customer} masked="Customer ****" label="customer" />],
              ["Merchant", selected.merchant],
              ["Selected rail", selected.rail],
              ["Provider", selected.provider],
              ["Routing explanation", "Smart objective selected the highest-success healthy provider with an instant-transfer backup."],
              ["Settlement", "Expected in next batch"],
              ["Webhook deliveries", "2 delivered, 1 retrying"],
              ["Audit", "Created, routed, authorized, ledger preview generated"],
            ].map(([label, value]) => (
              <div key={String(label)} className="border-t border-border pt-3">
                <p className="text-xs font-semibold text-muted">{label}</p>
                <div className="mt-1 text-sm leading-6">{value}</div>
              </div>
            ))}
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
