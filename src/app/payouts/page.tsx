import { Send, Upload, UserPlus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AmountDisplay } from "@/components/finance/amount-display";
import { PageHeader } from "@/components/page-header";
import { PrivacyMask } from "@/components/privacy/privacy-mask";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TableScroll } from "@/components/ui/table-scroll";
import { beneficiaries, payoutBatches } from "@/lib/data/railora-one";
import { formatAED } from "@/lib/domain/money";

export default function PayoutsPage() {
  const total = payoutBatches.reduce((sum, batch) => sum + batch.total, 0);

  return (
    <AppShell>
      <PageHeader
        badge="Payouts"
        title="Move funds with approval clarity"
        description="A simple payout workspace for beneficiaries, batch uploads, approvals, exception recovery, and privacy classification."
        actions={
          <>
            <ButtonLink href="/payouts" variant="secondary"><UserPlus className="size-4" aria-hidden />Add beneficiary</ButtonLink>
            <ButtonLink href="/payouts"><Send className="size-4" aria-hidden />New payout</ButtonLink>
          </>
        }
      />

      <div className="mb-6 grid gap-3 lg:grid-cols-3">
        <AmountDisplay label="Payouts ready" value={formatAED(total)} detail="Across open batch and instant transfer runs." masked />
        <AmountDisplay label="Beneficiaries" value={String(beneficiaries.length)} detail="Verified bank, wallet, and instant-transfer endpoints." />
        <AmountDisplay label="Failed items" value="2" detail="Both have suggested recovery rails." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Payout batches</CardTitle>
              <CardDescription>Batch status, approval, payment methods, failures, and privacy classification.</CardDescription>
            </div>
            <ButtonLink href="/payouts" variant="secondary" size="sm"><Upload className="size-4" aria-hidden />Upload batch</ButtonLink>
          </CardHeader>
          <div className="grid gap-3">
            {payoutBatches.map((batch) => (
              <div key={batch.id} className="rounded-[var(--radius-card)] border border-border bg-surface-soft p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-muted">{batch.id}</p>
                    <h2 className="mt-1 text-base font-semibold">{batch.name}</h2>
                  </div>
                  <Badge tone={batch.approval.includes("Needs") ? "warning" : "success"}>{batch.approval}</Badge>
                </div>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
                  <span>{formatAED(batch.total)}</span>
                  <span>{batch.beneficiaries} beneficiaries</span>
                  <span>{batch.methods}</span>
                  <span>{batch.successRate}% success</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone={batch.failedItems ? "danger" : "success"}>{batch.failedItems} failed</Badge>
                  <Badge tone="privacy">{batch.privacy}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Beneficiaries</CardTitle>
            <CardDescription>Account values stay masked until a user reveals them.</CardDescription>
          </CardHeader>
          <TableScroll>
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-border text-xs text-muted">
                <tr>
                  <th className="py-3 pl-4 pr-4">Name</th>
                  <th className="py-3 pr-4">Method</th>
                  <th className="py-3 pr-4">Account</th>
                  <th className="py-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {beneficiaries.map((beneficiary) => (
                  <tr key={beneficiary.id}>
                    <td className="py-3 pl-4 pr-4 font-semibold">{beneficiary.name}</td>
                    <td className="py-3 pr-4">{beneficiary.method}</td>
                    <td className="py-3 pr-4"><PrivacyMask value={beneficiary.maskedAccount} masked="Account ****" label={`${beneficiary.name} account`} /></td>
                    <td className="py-3 pr-4"><Badge tone={beneficiary.status === "verified" ? "success" : "warning"}>{beneficiary.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroll>
        </Card>
      </div>
    </AppShell>
  );
}
