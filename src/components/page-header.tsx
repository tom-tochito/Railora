import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PageHeader({
  badge,
  title,
  description,
  actions,
  tone = "brand",
  className,
}: {
  badge: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  tone?: "brand" | "danger" | "neutral" | "accent";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-6 flex min-w-0 flex-col justify-between gap-4 lg:flex-row lg:items-end",
        className,
      )}
    >
      <div className="min-w-0">
        <Badge tone={tone}>{badge}</Badge>
        <h1 className="mt-3 max-w-4xl break-words text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-muted">
          {description}
        </p>
      </div>
      {actions ? (
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row lg:justify-end">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
