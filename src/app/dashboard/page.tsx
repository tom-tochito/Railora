import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  CircleDollarSign,
  Gauge,
  Scale,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { InsightMetric } from "@/components/insight-metric";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import {
  DesktopRecordTable,
  RecordField,
  ResponsiveRecordCard,
  ResponsiveRecordList,
} from "@/components/responsive-record-list";
import { EscrowStatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TableScroll } from "@/components/ui/table-scroll";
import { businesses, getOrderParties, orders, riskScores } from "@/lib/data/seed";
import { formatAED } from "@/lib/domain/money";

const activeStates = [
  "funded",
  "in_progress",
  "proof_submitted",
  "release_requested",
  "disputed",
];

export default function DashboardPage() {
  const activeOrders = orders.filter((order) => activeStates.includes(order.state));
  const escrowBalance = activeOrders.reduce(
    (sum, order) => sum + order.amountFils + order.vatFils,
    0,
  );
  const pendingRelease = orders
    .filter((order) => order.state === "release_requested")
    .reduce((sum, order) => sum + order.amountFils + order.vatFils, 0);
  const disputes = orders.filter((order) => order.state === "disputed").length;
  const monthlyVolume = orders.reduce(
    (sum, order) => sum + order.amountFils + order.vatFils,
    0,
  );
  const flaggedValue = orders
    .filter((order) => order.riskLevel !== "low" || order.state === "disputed")
    .reduce((sum, order) => sum + order.amountFils + order.vatFils, 0);
  const verifiedBusinesses = businesses.filter(
    (business) => business.verificationStatus === "verified",
  ).length;

  return (
    <AppShell>
      <PageHeader
        badge="AED command center"
        title="Railora dashboard"
        description="A private view of escrow exposure, counterparty confidence, dispute pressure, and ledger health across the UAE trade workspace."
        actions={
          <ButtonLink href="/escrow/new">
            Create new escrow
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        }
      />

      <div className="mb-6 grid min-w-0 gap-3 md:grid-cols-3">
        <InsightMetric
          label="Protected exposure"
          value={formatAED(escrowBalance)}
          detail={`${activeOrders.length} active rooms watched with balanced ledger previews.`}
          icon={<ShieldCheck className="size-4" aria-hidden />}
          tone="brand"
        />
        <InsightMetric
          label="Release queue"
          value={formatAED(pendingRelease)}
          detail="Buyer approval is the next high-value movement."
          icon={<Activity className="size-4" aria-hidden />}
          tone="accent"
        />
        <InsightMetric
          label="Verified network"
          value={`${verifiedBusinesses} / ${businesses.length}`}
          detail="Businesses with complete sandbox identity and licence depth."
          icon={<BadgeCheck className="size-4" aria-hidden />}
          tone="success"
        />
      </div>

      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <MetricCard
          label="Escrow balance"
          value={formatAED(escrowBalance)}
          detail="Sandbox liability across active orders"
          icon={<CircleDollarSign className="size-4" aria-hidden />}
        />
        <MetricCard
          label="Pending releases"
          value={formatAED(pendingRelease)}
          detail="Buyer approval required"
          icon={<Banknote className="size-4" aria-hidden />}
        />
        <MetricCard
          label="Disputes"
          value={String(disputes)}
          detail="Rooms under review"
          icon={<Scale className="size-4" aria-hidden />}
        />
        <MetricCard
          label="Verification"
          value="5 / 6"
          detail="One owner declaration needs review"
          icon={<BadgeCheck className="size-4" aria-hidden />}
        />
        <MetricCard
          label="Trade score"
          value="87"
          detail="Explainable buyer profile"
          icon={<Gauge className="size-4" aria-hidden />}
        />
        <MetricCard
          label="Monthly volume"
          value={formatAED(monthlyVolume)}
          detail="Demo AED order value"
          icon={<CircleDollarSign className="size-4" aria-hidden />}
        />
      </div>

      <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Recent escrow orders</CardTitle>
            <ButtonLink href="/escrow/ord-001" variant="secondary" size="sm">
              Open active room
            </ButtonLink>
          </CardHeader>
          <ResponsiveRecordList>
            {orders.map((order) => {
              const parties = getOrderParties(order);

              return (
                <ResponsiveRecordCard key={order.id}>
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/escrow/${order.id}`}
                        className="inline-flex min-h-11 items-center break-words text-sm font-semibold text-brand"
                      >
                        {order.reference}
                      </Link>
                      <p className="mt-1 break-words text-base font-semibold">
                        {order.title}
                      </p>
                    </div>
                    <EscrowStatusBadge state={order.state} />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <RecordField
                      label="Counterparty"
                      value={parties.seller?.displayName ?? "Invited seller"}
                    />
                    <RecordField
                      label="Value"
                      value={formatAED(order.amountFils + order.vatFils)}
                    />
                    <RecordField label="Delivery" value={order.deliveryLocation} />
                  </div>
                </ResponsiveRecordCard>
              );
            })}
          </ResponsiveRecordList>
          <DesktopRecordTable>
            <TableScroll>
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase text-muted">
                  <tr>
                    <th className="py-3 pl-4 pr-4 font-semibold">Reference</th>
                    <th className="py-3 pr-4 font-semibold">Trade</th>
                    <th className="py-3 pr-4 font-semibold">Counterparty</th>
                    <th className="py-3 pr-4 font-semibold">Amount</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => {
                    const parties = getOrderParties(order);
                    return (
                      <tr key={order.id} className="align-top">
                        <td className="py-3 pl-4 pr-4 font-medium">
                          <Link href={`/escrow/${order.id}`} className="text-brand">
                            {order.reference}
                          </Link>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="font-medium">{order.title}</p>
                          <p className="mt-1 text-xs text-muted">
                            {order.deliveryLocation}
                          </p>
                        </td>
                        <td className="py-3 pr-4">
                          {parties.seller?.displayName ?? "Invited seller"}
                        </td>
                        <td className="py-3 pr-4">
                          {formatAED(order.amountFils + order.vatFils)}
                        </td>
                        <td className="py-3 pr-4">
                          <EscrowStatusBadge state={order.state} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableScroll>
          </DesktopRecordTable>
        </Card>

        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk alerts</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {riskScores.map((risk) => {
                const business = businesses.find(
                  (item) => item.id === risk.businessId,
                );
                return (
                  <div
                    key={risk.id}
                    className="rounded-lg border border-border bg-surface-soft p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold">
                          {business?.displayName}
                        </p>
                        <p className="mt-1 break-words text-xs leading-5 text-muted">
                          {risk.factors.join(" · ")}
                        </p>
                      </div>
                      <Badge
                        tone={
                          risk.level === "high"
                            ? "danger"
                            : risk.level === "medium"
                              ? "warning"
                              : "success"
                        }
                      >
                        {risk.score}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="border-amber-200 bg-amber-50/80">
            <AlertTriangle className="size-5 text-warning" aria-hidden />
            <h2 className="mt-3 text-base font-semibold">Demo-safe by design</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Railora presents investor-ready workflows without moving real money.
              Payment, KYC, sanctions, DUL, and reconciliation providers remain
              sandbox adapters in this prototype.
            </p>
            <div className="mt-4 rounded-md border border-amber-200 bg-white/70 p-3 text-sm font-semibold text-foreground">
              Elevated exposure under review: {formatAED(flaggedValue)}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
