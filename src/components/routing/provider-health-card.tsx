import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { riskTone } from "@/lib/data/railora-one";

export function ProviderHealthCard({
  name,
  rail,
  status,
  successRate,
  authorizationMs,
  costBps,
  privacyFields,
}: {
  name: string;
  rail: string;
  status: string;
  successRate: number;
  authorizationMs: number;
  costBps: number;
  privacyFields: number;
}) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold">{name}</p>
          <p className="mt-1 text-sm text-muted">{rail}</p>
        </div>
        <Badge tone={riskTone(status)}>{status}</Badge>
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="amount-tabular font-semibold">{successRate}%</p>
          <p className="text-xs text-muted">Success</p>
        </div>
        <div>
          <p className="amount-tabular font-semibold">{authorizationMs}ms</p>
          <p className="text-xs text-muted">Auth time</p>
        </div>
        <div>
          <p className="amount-tabular font-semibold">{costBps} bps</p>
          <p className="text-xs text-muted">Cost</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-[var(--radius-control)] border border-border bg-surface-soft p-3 text-sm">
        <Activity className="size-4 text-privacy" aria-hidden />
        <span>{privacyFields} identifying fields required</span>
      </div>
    </Card>
  );
}
