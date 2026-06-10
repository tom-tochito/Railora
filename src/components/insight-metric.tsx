import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const toneClasses = {
  brand: "border-teal-200/80 bg-teal-50/80 text-brand",
  accent: "border-amber-200/80 bg-amber-50/80 text-amber-800",
  success: "border-emerald-200/80 bg-emerald-50/80 text-emerald-800",
  danger: "border-red-200/80 bg-red-50/80 text-red-800",
  neutral: "border-border bg-white/75 text-foreground",
};

export function InsightMetric({
  label,
  value,
  detail,
  icon,
  tone = "neutral",
  className,
}: {
  label: string;
  value: ReactNode;
  detail: ReactNode;
  icon?: ReactNode;
  tone?: keyof typeof toneClasses;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-lg border p-4 shadow-[0_14px_34px_rgba(7,31,28,0.05)]",
        toneClasses[tone],
        className,
      )}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-xs font-semibold uppercase text-current/70">
            {label}
          </p>
          <p className="mt-2 break-words text-2xl font-semibold tracking-normal text-foreground">
            {value}
          </p>
        </div>
        {icon ? (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white/70 text-current shadow-sm">
            {icon}
          </div>
        ) : null}
      </div>
      <p className="mt-2 break-words text-xs leading-5 text-muted">{detail}</p>
    </div>
  );
}
