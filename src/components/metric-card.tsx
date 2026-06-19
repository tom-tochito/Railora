import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  icon,
  detail,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  detail: string;
}) {
  return (
    <Card className="premium-panel relative space-y-3 overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-1 bg-brand"
        aria-hidden
      />
      <div className="flex min-w-0 items-center justify-between gap-3">
        <p className="min-w-0 break-words text-sm font-medium text-muted">{label}</p>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-brand/15 bg-surface-elevated/80 text-brand shadow-sm">
          {icon}
        </div>
      </div>
      <div className="min-w-0">
        <p className="amount-tabular break-words text-2xl font-semibold leading-tight text-foreground">
          {value}
        </p>
        <p className="mt-1 break-words text-xs text-muted">{detail}</p>
      </div>
    </Card>
  );
}
