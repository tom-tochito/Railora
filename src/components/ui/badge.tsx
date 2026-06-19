import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const toneClasses = {
  neutral: "border-border bg-surface-elevated text-foreground",
  success: "border-success/25 bg-success-soft text-success",
  warning: "border-warning/25 bg-warning-soft text-warning",
  danger: "border-danger/25 bg-danger-soft text-danger",
  brand: "border-brand/25 bg-brand-soft text-brand",
  accent: "border-brand/25 bg-brand-soft text-brand",
  privacy: "border-privacy/25 bg-privacy-soft text-privacy",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: ComponentPropsWithoutRef<"span"> & {
  tone?: keyof typeof toneClasses;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 max-w-full items-center gap-1 rounded-[var(--radius-control)] border px-2 py-0.5 font-mono text-[0.6875rem] font-semibold uppercase leading-5 tracking-wide shadow-sm",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
