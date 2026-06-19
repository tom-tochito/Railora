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
        "inline-flex min-h-6 max-w-full items-center rounded-[var(--radius-control)] border px-2 py-0.5 text-xs font-semibold leading-5 shadow-sm",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
