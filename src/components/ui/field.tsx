import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Label(props: ComponentPropsWithoutRef<"label">) {
  return (
    <label
      {...props}
      className={cn("text-sm font-medium leading-5 text-foreground", props.className)}
    />
  );
}

export function Input(props: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      {...props}
      className={cn(
        "min-h-11 w-full min-w-0 max-w-full rounded-[var(--radius-control)] border border-border bg-surface-elevated px-3 text-sm text-foreground shadow-inner outline-none transition duration-[var(--duration-fast)] placeholder:text-muted focus:border-focus focus:ring-2 focus:ring-focus/15 disabled:bg-surface-soft disabled:text-muted",
        props.className,
      )}
    />
  );
}

export function Textarea(props: ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full min-w-0 max-w-full rounded-[var(--radius-control)] border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground shadow-inner outline-none transition duration-[var(--duration-fast)] placeholder:text-muted focus:border-focus focus:ring-2 focus:ring-focus/15 disabled:bg-surface-soft disabled:text-muted",
        props.className,
      )}
    />
  );
}

export function Select(props: ComponentPropsWithoutRef<"select">) {
  return (
    <select
      {...props}
      className={cn(
        "min-h-11 w-full min-w-0 max-w-full rounded-[var(--radius-control)] border border-border bg-surface-elevated px-3 text-sm text-foreground shadow-inner outline-none transition duration-[var(--duration-fast)] focus:border-focus focus:ring-2 focus:ring-focus/15 disabled:bg-surface-soft disabled:text-muted",
        props.className,
      )}
    />
  );
}
