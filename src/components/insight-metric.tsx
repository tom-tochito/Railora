import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

const toneClasses = {
  brand: "border-brand/20 bg-brand-soft/80 text-brand",
  accent: "border-privacy/20 bg-privacy-soft/80 text-privacy",
  success: "border-success/20 bg-success-soft/80 text-success",
  warning: "border-warning/20 bg-warning-soft/80 text-warning",
  danger: "border-danger/20 bg-danger-soft/80 text-danger",
  neutral: "border-border bg-surface-elevated/75 text-foreground",
};

export function InsightMetric({
  label,
  value,
  detail,
  icon,
  tone = "neutral",
  className,
  style,
}: {
  label: string;
  value: ReactNode;
  detail: ReactNode;
  icon?: ReactNode;
  tone?: keyof typeof toneClasses;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-[var(--radius-card)] border p-4 shadow-[var(--shadow-soft)]",
        toneClasses[tone],
        className,
      )}
      style={style}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow break-words text-current/70">
            {label}
          </p>
          <p className="amount-mono mt-2 break-words text-2xl font-semibold tracking-normal text-foreground">
            {value}
          </p>
        </div>
        {icon ? (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-surface-elevated/70 text-current shadow-sm">
            {icon}
          </div>
        ) : null}
      </div>
      <p className="mt-2 break-words text-xs leading-5 text-muted">{detail}</p>
    </div>
  );
}
