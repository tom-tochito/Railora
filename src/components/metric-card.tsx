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
    <Card className="space-y-3">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <p className="min-w-0 break-words text-sm font-medium text-muted">{label}</p>
        <div className="flex size-9 items-center justify-center rounded-md bg-surface-soft text-brand">
          {icon}
        </div>
      </div>
      <div className="min-w-0">
        <p className="break-words text-2xl font-semibold text-foreground">{value}</p>
        <p className="mt-1 break-words text-xs text-muted">{detail}</p>
      </div>
    </Card>
  );
}
