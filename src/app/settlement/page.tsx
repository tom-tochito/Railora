import { Landmark, Scale, TimerReset } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AmountDisplay } from "@/components/finance/amount-display";
import { InsightMetric } from "@/components/insight-metric";
import { PageHeader } from "@/components/page-header";
import { SettlementBatchCard } from "@/components/settlement/settlement-batch-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { settlementBatches } from "@/lib/data/railora-one";
import { formatAED } from "@/lib/domain/money";

export default function SettlementPage() {
  const pending = settlementBatches.reduce((sum, batch) => sum + batch.gross - batch.fees - batch.refunds - batch.reserve, 0);
  const unmatched = 18_420_00;

  return (
    <AppShell>
      <PageHeader
        badge="Settlement and reconciliation"
        title="A financial timeline from authorization to arrival"
        description="Settlement batches, expected-versus-received matching, reserve visibility, discrepancies, comments, approvals, and audit evidence."
      />

      <div className="mb-6 grid gap-3 lg:grid-cols-4">
        <AmountDisplay label="Available to settle" value={formatAED(pending)} detail="Net AED after fees, refunds, and held reserve." masked icon={<Landmark className="size-4" aria-hidden />} />
        <InsightMetric label="Pending settlement" value={formatAED(pending)} detail="Across three visible batches." icon={<TimerReset className="size-4" aria-hidden />} tone="brand" />
        <InsightMetric label="Held reserve" value={formatAED(97_000_00)} detail="Risk-based reserve across providers." icon={<Scale className="size-4" aria-hidden />} tone="accent" />
        <InsightMetric label="Unmatched amount" value={formatAED(unmatched)} detail="Two items require reconciliation." icon={<Scale className="size-4" aria-hidden />} tone="danger" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <div className="grid gap-4">
          {settlementBatches.map((batch) => (
            <SettlementBatchCard key={batch.id} {...batch} />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reconciliation workspace</CardTitle>
            <CardDescription>
              Split expected-versus-received review with likely causes and manual adjustment controls.
            </CardDescription>
          </CardHeader>
          <div className="grid gap-4">
            {[
              ["Expected", formatAED(318_900_00), "Provider statement gross"],
              ["Received", formatAED(300_480_00), "Bank settlement received"],
              ["Difference", formatAED(unmatched), "Likely reserve timing and refund lag"],
            ].map(([label, value, detail]) => (
              <div key={label} className="rounded-[var(--radius-control)] border border-border bg-surface-soft p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="amount-tabular text-base font-semibold">{value}</p>
                </div>
                <p className="mt-1 text-xs text-muted">{detail}</p>
              </div>
            ))}
            <div className="rounded-[var(--radius-card)] border border-warning/25 bg-warning-soft p-4">
              <Badge tone="warning">Approval required</Badge>
              <p className="mt-3 text-sm leading-6 text-muted">
                Manual adjustment requires a reason, assignment, and second approval. The existing audit store records the action trail.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
