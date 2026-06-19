import type { CSSProperties, ReactNode } from "react";
import { PrivacyMask } from "@/components/privacy/privacy-mask";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AmountDisplay({
  label,
  value,
  detail,
  masked,
  icon,
  className,
  style,
}: {
  label: string;
  value: string;
  detail?: ReactNode;
  masked?: boolean;
  icon?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Card className={cn("space-y-4", className)} style={style}>
      <div className="flex min-w-0 items-center justify-between gap-3">
        <p className="eyebrow text-muted">{label}</p>
        {icon ? (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-brand-soft text-brand">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="min-w-0">
        <p className="amount-mono break-words text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          {masked ? <PrivacyMask value={value} label={label} /> : value}
        </p>
        {detail ? <p className="mt-2 break-words text-sm leading-6 text-muted">{detail}</p> : null}
      </div>
    </Card>
  );
}
