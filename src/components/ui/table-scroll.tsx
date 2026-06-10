import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function TableScroll({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "max-w-full overflow-x-auto overscroll-x-contain rounded-md border border-border bg-white/90 scrollbar-thin shadow-inner",
        className,
      )}
      {...props}
    />
  );
}
