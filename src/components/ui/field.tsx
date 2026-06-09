import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Label(props: ComponentPropsWithoutRef<"label">) {
  return (
    <label
      {...props}
      className={cn("text-sm font-medium text-foreground", props.className)}
    />
  );
}

export function Input(props: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      {...props}
      className={cn(
        "min-h-11 w-full rounded-md border border-border bg-white px-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-teal-100",
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
        "min-h-28 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-teal-100",
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
        "min-h-11 w-full rounded-md border border-border bg-white px-3 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100",
        props.className,
      )}
    />
  );
}
