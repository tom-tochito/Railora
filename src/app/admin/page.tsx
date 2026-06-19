import { AlertTriangle, Database, ShieldCheck, Users } from "lucide-react";
import { AdminActions } from "@/components/admin-actions";
import { AppShell } from "@/components/app-shell";
import { InsightMetric } from "@/components/insight-metric";
import { PageHeader } from "@/components/page-header";
import { RiskWorkQueue } from "@/components/risk/risk-work-queue";
import {
  DesktopRecordTable,
  RecordField,
  ResponsiveRecordCard,
  ResponsiveRecordList,
} from "@/components/responsive-record-list";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TableScroll } from "@/components/ui/table-scroll";
import { getAuditEvents } from "@/lib/data/audit-store";
import { businesses, disputes, orders, riskScores, users } from "@/lib/data/seed";
import { formatAED } from "@/lib/domain/money";

export default function AdminPage() {
  const auditEvents = getAuditEvents();
  const flaggedOrders = orders.filter(
    (order) => order.riskLevel !== "low" || order.state === "disputed",
  );
  const flaggedValue = flaggedOrders.reduce(
    (sum, order) => sum + order.amountFils + order.vatFils,
    0,
  );
  const workQueue = [
    {
      id: "risk-case-001",
      title: "High-value payout exception",
      detail: "Beneficiary account changed after approval",
      state: "review",
      sla: "42m",
    },
    {
      id: "risk-case-002",
      title: "Provider incident follow-up",
      detail: "Magnati card latency impacted routing",
      state: "degraded",
      sla: "1h",
    },
    {
      id: "risk-case-003",
      title: "Reconciliation discrepancy",
      detail: "Reserve timing differs from provider statement",
      state: "pending",
      sla: "2h",
    },
  ];

  return (
    <AppShell>
      <PageHeader
        badge="Risk operations"
        title="Railora risk and operations console"
        description="A dense but calm operating view for risk cases, provider incidents, reconciliation discrepancies, failed webhooks, ledger integrity, and audit evidence."
        tone="danger"
      />

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <InsightMetric
          label="Flagged value"
          value={formatAED(flaggedValue)}
          detail={`${flaggedOrders.length} payments and protected flows need risk attention.`}
          icon={<AlertTriangle className="size-4" aria-hidden />}
          tone="danger"
        />
        <InsightMetric
          label="Audit events"
          value={auditEvents.length}
          detail="Immutable demo events available for export."
          icon={<Database className="size-4" aria-hidden />}
          tone="brand"
        />
        <InsightMetric
          label="Workspace users"
          value={users.length}
          detail={`${businesses.length} businesses represented in seed data.`}
          icon={<Users className="size-4" aria-hidden />}
          tone="accent"
        />
      </div>

      <div className="mb-6">
        <RiskWorkQueue items={workQueue} />
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Flagged payments</CardTitle>
              <CardDescription>
                Payments and protected flows with disputes, verification friction, or elevated risk.
              </CardDescription>
            </CardHeader>
            <ResponsiveRecordList>
              {flaggedOrders.map((order) => (
                <ResponsiveRecordCard key={order.id}>
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words text-base font-semibold">
                        {order.reference}
                      </p>
                      <p className="mt-1 break-words text-sm text-muted">
                        {order.title}
                      </p>
                    </div>
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
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <RecordField
                      label="Amount"
                      value={formatAED(order.amountFils + order.vatFils)}
                    />
                    <RecordField label="State" value={order.state.replaceAll("_", " ")} />
                    <RecordField label="Due" value={order.dueDate} />
                  </div>
                </ResponsiveRecordCard>
              ))}
            </ResponsiveRecordList>
            <DesktopRecordTable>
              <TableScroll>
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-border text-xs uppercase text-muted">
                    <tr>
                      <th className="py-3 pl-4 pr-4">Reference</th>
                      <th className="py-3 pr-4">Amount</th>
                      <th className="py-3 pr-4">State</th>
                      <th className="py-3 pr-4">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {flaggedOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="py-3 pl-4 pr-4 font-semibold">
                          {order.reference}
                        </td>
                        <td className="py-3 pr-4">
                          {formatAED(order.amountFils + order.vatFils)}
                        </td>
                        <td className="py-3 pr-4">
                          {order.state.replaceAll("_", " ")}
                        </td>
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
              </TableScroll>
            </DesktopRecordTable>
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
                  <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                    <p className="min-w-0 break-words text-sm font-semibold">
                      {event.action}
                    </p>
                    <Badge tone="neutral">{event.entityType}</Badge>
                  </div>
                  <p className="mt-1 break-words text-xs text-muted">
                    {event.actor} · {event.entityId} · {event.createdAt}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin actions</CardTitle>
              <CardDescription>
                Platform-risk controls for review, reconciliation, and audit export.
              </CardDescription>
            </CardHeader>
            <AdminActions />
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search snapshots</CardTitle>
            </CardHeader>
            <div className="grid gap-3 text-sm">
              {[
                [`${users.length} users`, "Buyers, sellers, admins"],
                [`${businesses.length} businesses`, "Mainland, free-zone, freelancer"],
                [`${disputes.length} disputes`, "Active and under review"],
                [`${riskScores.length} risk scores`, "Low, medium, high examples"],
              ].map(([label, detail]) => (
                <div key={label} className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-brand" aria-hidden />
                    <p className="font-semibold">{label}</p>
                  </div>
                  <p className="mt-1 text-muted">{detail}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
