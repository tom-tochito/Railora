import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  CircleDollarSign,
  Gauge,
  Scale,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { EscrowStatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TableScroll } from "@/components/ui/table-scroll";
import { businesses, getOrderParties, orders, riskScores } from "@/lib/data/seed";
import { formatAED } from "@/lib/domain/money";

export default function DashboardPage() {
  const escrowBalance = orders.reduce((sum, order) => {
    const active = ["funded", "in_progress", "proof_submitted", "release_requested", "disputed"].includes(
      order.state,
    );
    return active ? sum + order.amountFils + order.vatFils : sum;
  }, 0);
  const pendingRelease = orders
    .filter((order) => order.state === "release_requested")
    .reduce((sum, order) => sum + order.amountFils + order.vatFils, 0);
  const disputes = orders.filter((order) => order.state === "disputed").length;
  const monthlyVolume = orders.reduce(
    (sum, order) => sum + order.amountFils + order.vatFils,
    0,
  );

  return (
    <AppShell>
      <div className="mb-6 flex min-w-0 flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="min-w-0">
          <Badge tone="brand">AED · bilingual ready · sandbox/demo</Badge>
          <h1 className="mt-3 text-3xl font-semibold">Railora dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Escrow rooms, verification depth, trade score, disputes, and ledger
            health for UAE SME trade workflows.
          </p>
        </div>
        <ButtonLink href="/escrow/new">
          Create new escrow
          <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
      </div>

      <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-6">
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
          detail="Two rooms seeded for admin review"
          icon={<Scale className="size-4" aria-hidden />}
        />
        <MetricCard
          label="Verification"
          value="5 / 6"
          detail="One beneficial owner needs review"
          icon={<BadgeCheck className="size-4" aria-hidden />}
        />
        <MetricCard
          label="Trade score"
          value="87"
          detail="Buyer profile explainability"
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
          <TableScroll>
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th className="py-3 pr-4 font-semibold">Reference</th>
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
                      <td className="py-3 pr-4 font-medium">
                        <a href={`/escrow/${order.id}`} className="text-brand">
                          {order.reference}
                        </a>
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
                        <p className="mt-1 break-words text-xs text-muted">
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

          <Card className="border-amber-200 bg-amber-50">
            <AlertTriangle className="size-5 text-warning" aria-hidden />
            <h2 className="mt-3 text-base font-semibold">Sandbox limitation</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Railora is not licensed here and does not move money. All payment
              initiation, KYC, sanctions, DUL, and reconciliation events are mock
              adapters.
            </p>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
