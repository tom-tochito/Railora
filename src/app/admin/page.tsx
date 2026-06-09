import { AdminActions } from "@/components/admin-actions";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuditEvents } from "@/lib/data/audit-store";
import { businesses, disputes, orders, riskScores, users } from "@/lib/data/seed";
import { formatAED } from "@/lib/domain/money";

export default function AdminPage() {
  const auditEvents = getAuditEvents();
  const flaggedOrders = orders.filter(
    (order) => order.riskLevel !== "low" || order.state === "disputed",
  );

  return (
    <AppShell>
      <div className="mb-6">
        <Badge tone="danger">Platform risk/admin</Badge>
        <h1 className="mt-3 text-3xl font-semibold">Railora admin console</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Search demo users, businesses, orders, review flags, freeze/unfreeze
          orders, trigger reconciliation, and export audit logs.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Flagged transactions</CardTitle>
              <CardDescription>
                Orders with disputes, verification friction, or elevated risk.
              </CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase text-muted">
                  <tr>
                    <th className="py-3 pr-4">Reference</th>
                    <th className="py-3 pr-4">Amount</th>
                    <th className="py-3 pr-4">State</th>
                    <th className="py-3 pr-4">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {flaggedOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-3 pr-4 font-semibold">{order.reference}</td>
                      <td className="py-3 pr-4">
                        {formatAED(order.amountFils + order.vatFils)}
                      </td>
                      <td className="py-3 pr-4">{order.state.replaceAll("_", " ")}</td>
                      <td className="py-3 pr-4">
                        <Badge
                          tone={
                            order.riskLevel === "high"
                              ? "danger"
                              : order.riskLevel === "medium"
                                ? "warning"
                                : "success"
                          }
                        >
                          {order.riskLevel}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit trail</CardTitle>
              <CardDescription>
                Important actions are recorded as immutable demo events.
              </CardDescription>
            </CardHeader>
            <div className="space-y-3">
              {auditEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-border bg-surface-soft p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{event.action}</p>
                    <Badge tone="neutral">{event.entityType}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {event.actor} · {event.entityId} · {event.createdAt}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin actions</CardTitle>
              <CardDescription>
                Platform operator permissions are enforced by server actions.
              </CardDescription>
            </CardHeader>
            <AdminActions />
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search snapshots</CardTitle>
            </CardHeader>
            <div className="grid gap-3 text-sm">
              <div className="rounded-lg border border-border p-4">
                <p className="font-semibold">{users.length} users</p>
                <p className="mt-1 text-muted">Buyers, sellers, admins</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="font-semibold">{businesses.length} businesses</p>
                <p className="mt-1 text-muted">Mainland, free-zone, freelancer</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="font-semibold">{disputes.length} disputes</p>
                <p className="mt-1 text-muted">Active and under review</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="font-semibold">{riskScores.length} risk scores</p>
                <p className="mt-1 text-muted">Low, medium, high examples</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
