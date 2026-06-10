import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ResponsiveRecordList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid min-w-0 gap-3 md:hidden", className)}>
      {children}
    </div>
  );
}

export function ResponsiveRecordCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-lg border border-border bg-white/85 p-4 shadow-[0_12px_30px_rgba(7,31,28,0.05)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DesktopRecordTable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("hidden md:block", className)}>{children}</div>;
}

export function RecordField({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <div className="mt-1 min-w-0 break-words text-sm font-medium text-foreground">
        {value}
      </div>
    </div>
  );
}
