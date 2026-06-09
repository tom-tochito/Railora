import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand text-white shadow-sm hover:bg-brand-dark focus-visible:outline-brand",
        secondary:
          "border border-border bg-surface text-foreground hover:bg-surface-soft focus-visible:outline-brand",
        ghost: "text-foreground hover:bg-surface-soft focus-visible:outline-brand",
        danger:
          "bg-danger text-white hover:bg-red-800 focus-visible:outline-danger",
      },
      size: {
        sm: "min-h-8 px-3 text-xs",
        md: "min-h-10 px-4 text-sm",
        lg: "min-h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: ComponentPropsWithoutRef<typeof Link> &
  VariantProps<typeof buttonVariants>) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
