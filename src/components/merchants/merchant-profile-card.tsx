import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PrivacyMask } from "@/components/privacy/privacy-mask";
import type { Business } from "@/lib/domain/types";

export function MerchantProfileCard({ merchant }: { merchant: Business }) {
  const tone = merchant.verificationStatus === "verified" ? "success" : "warning";

  return (
    <Card className="min-w-0 space-y-4 overflow-hidden">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-brand-soft text-brand">
          <Building2 className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">{merchant.displayName}</h2>
          <p className="mt-1 truncate text-sm text-muted">{merchant.legalName}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge tone={tone}>{merchant.verificationStatus.replaceAll("_", " ")}</Badge>
        <Badge tone="privacy">Privacy grade A-</Badge>
        <Badge tone={merchant.tradeScore > 80 ? "success" : "warning"}>
          Score {merchant.tradeScore}
        </Badge>
      </div>
      <dl className="grid min-w-0 gap-3 text-sm sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-muted">Licence</dt>
          <dd className="mt-1 break-all font-mono">{merchant.licenceNumber}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-muted">TRN</dt>
          <dd className="mt-1 min-w-0">
            <PrivacyMask value={merchant.trn} masked="TRN ****" label="TRN" />
          </dd>
        </div>
      </dl>
    </Card>
  );
}
