import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function TableScroll({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "max-w-full overflow-x-auto overscroll-x-contain scrollbar-thin",
        className,
      )}
      {...props}
    />
  );
}
