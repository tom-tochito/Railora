import { BadgeCheck, Building2, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { InsightMetric } from "@/components/insight-metric";
import { MerchantProfileCard } from "@/components/merchants/merchant-profile-card";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { businesses, verificationChecks } from "@/lib/data/seed";

export default function MerchantsPage() {
  const verified = businesses.filter((business) => business.verificationStatus === "verified").length;

  return (
    <AppShell>
      <PageHeader
        badge="Merchants and KYB"
        title="Verified business profiles with operational depth"
        description="Merchant records combine legal identity, trading profile, enabled rails, settlement posture, risk tier, privacy grade, and KYB evidence."
      />

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <InsightMetric label="Verified merchants" value={`${verified} / ${businesses.length}`} detail="Businesses with complete sandbox identity and licence depth." icon={<BadgeCheck className="size-4" aria-hidden />} tone="success" />
        <InsightMetric label="Manual reviews" value="2" detail="Owner declaration and activity classification need attention." icon={<ShieldAlert className="size-4" aria-hidden />} tone="warning" />
        <InsightMetric label="Enabled rails" value="8" detail="Cards, bank transfer, instant transfer, wallets, payouts, and invoice rails." icon={<Building2 className="size-4" aria-hidden />} tone="brand" />
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[1fr_0.78fr]">
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          {businesses.map((merchant) => (
            <MerchantProfileCard key={merchant.id} merchant={merchant} />
          ))}
        </div>

        <Card className="min-w-0 xl:sticky xl:top-24 xl:self-start">
          <CardHeader>
            <CardTitle>KYB checklist</CardTitle>
            <CardDescription>
              Licence, owners, signatories, bank account, sanctions, activity, documents, and manual review states.
            </CardDescription>
          </CardHeader>
          <div className="grid gap-3">
            {verificationChecks.map((check) => (
              <div key={check.id} className="min-w-0 rounded-[var(--radius-control)] border border-border bg-surface-soft p-3">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{check.label}</p>
                    <p className="mt-1 truncate text-xs text-muted">{check.notes}</p>
                  </div>
                  <Badge tone={check.status === "verified" ? "success" : check.status === "failed" ? "danger" : "warning"}>{check.status.replaceAll("_", " ")}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
