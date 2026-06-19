import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-[var(--radius-control)] px-4 py-2 text-center text-sm font-semibold transition duration-[var(--duration-base)] ease-[var(--ease-railora)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transform-none disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-55",
  {
    variants: {
      variant: {
        primary:
          "border border-brand/20 bg-brand text-white shadow-[0_12px_28px_color-mix(in_srgb,var(--brand)_26%,transparent)] motion-safe:hover:-translate-y-0.5 hover:bg-brand-dark focus-visible:outline-focus active:translate-y-0",
        secondary:
          "border border-border bg-surface-elevated text-foreground motion-safe:hover:-translate-y-0.5 hover:border-brand/40 hover:bg-surface-soft focus-visible:outline-focus active:translate-y-0",
        ghost:
          "text-foreground shadow-none hover:bg-surface-soft focus-visible:outline-focus",
        danger:
          "border border-danger/20 bg-danger text-white shadow-[0_12px_28px_color-mix(in_srgb,var(--danger)_22%,transparent)] motion-safe:hover:-translate-y-0.5 hover:brightness-95 focus-visible:outline-danger active:translate-y-0",
        privacy:
          "border border-privacy/20 bg-privacy text-white shadow-[0_12px_28px_color-mix(in_srgb,var(--privacy)_22%,transparent)] motion-safe:hover:-translate-y-0.5 hover:brightness-95 focus-visible:outline-privacy active:translate-y-0",
      },
      size: {
        sm: "min-h-11 px-3 text-xs sm:min-h-9",
        md: "min-h-11 px-4 text-sm",
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
