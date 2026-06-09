import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const toneClasses = {
  neutral: "border-border bg-surface-soft text-foreground",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  danger: "border-red-200 bg-red-50 text-red-800",
  brand: "border-teal-200 bg-teal-50 text-teal-800",
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
        "inline-flex min-h-6 items-center rounded-md border px-2 py-0.5 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
