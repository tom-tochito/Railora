"use client";

import {
  BadgeCheck,
  Banknote,
  BarChart3,
  Braces,
  Building2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Gauge,
  Home,
  Landmark,
  Map,
  MoreHorizontal,
  Scale,
  Send,
  ShieldCheck,
  WalletCards,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/escrow/new", label: "Move money", icon: Send },
  { href: "/routing", label: "Rail Map", icon: Map },
  { href: "/settlement", label: "Settlement", icon: Landmark },
  { href: "/payouts", label: "Payouts", icon: WalletCards },
  { href: "/merchants", label: "Merchants", icon: Building2 },
  { href: "/verify", label: "KYB", icon: BadgeCheck },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/score", label: "Insights", icon: BarChart3 },
  { href: "/developer", label: "Developer", icon: Braces },
  { href: "/privacy", label: "Privacy Hub", icon: ShieldCheck },
  { href: "/admin", label: "Risk ops", icon: Gauge },
  { href: "/disputes/disp-001", label: "Disputes", icon: Scale },
  { href: "/design-system", label: "Design system", icon: Banknote },
];

const primaryMobileItems = [
  { href: "/dashboard", label: "Home", shortLabel: "Home", icon: Home },
  { href: "/payments", label: "Payments", shortLabel: "Payments", icon: CreditCard },
  { href: "/escrow/new", label: "Move money", shortLabel: "Move", icon: Send },
  { href: "/score", label: "Insights", shortLabel: "Insights", icon: BarChart3 },
];

const secondaryMobileItems = navItems.filter(
  (item) => !primaryMobileItems.some((primary) => primary.href === item.href),
);

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  if (href === "/escrow/new") {
    return pathname === href;
  }

  const section = href.split("/")[1];
  return pathname === href || pathname.startsWith(`/${section}/`);
}

export function AppNavigation({ variant }: { variant: "sidebar" | "mobile" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  if (variant === "mobile") {
    return (
      <>
        {open ? (
          <div
            id="mobile-more-navigation"
            className="fixed inset-x-3 bottom-24 z-40 max-h-[70svh] overflow-y-auto rounded-[var(--radius-panel)] border border-border bg-surface-elevated/98 p-3 shadow-[var(--shadow-float)] backdrop-blur lg:hidden"
            data-mobile-more-menu
          >
            <div className="mb-2 flex items-center justify-between gap-3 px-1">
              <p className="text-xs font-semibold text-muted">More Railora routes</p>
              <button
                type="button"
                className="railora-focus inline-flex size-9 items-center justify-center rounded-[var(--radius-control)] text-muted transition hover:bg-surface-soft hover:text-foreground"
                onClick={() => setOpen(false)}
                aria-label="Close more navigation"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="grid gap-2">
              {secondaryMobileItems.map((item) => {
                const active = isActive(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "railora-focus flex min-h-12 min-w-0 items-center gap-3 rounded-[var(--radius-control)] border px-3 text-sm font-semibold transition",
                      active
                        ? "border-brand/30 bg-brand-soft text-brand shadow-sm"
                        : "border-border bg-surface-elevated text-foreground hover:border-brand/40 hover:bg-surface-soft",
                    )}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-surface-soft text-brand">
                      <item.icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
        <nav
          className="fixed inset-x-3 bottom-3 z-40 rounded-[var(--radius-panel)] border border-white/10 bg-ink/95 px-2 py-2 shadow-[var(--shadow-float)] backdrop-blur lg:hidden"
          aria-label="Primary mobile navigation"
          data-mobile-nav
        >
          <div className="grid grid-cols-5 gap-1">
            {primaryMobileItems.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  className={cn(
                    "railora-focus flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-[var(--radius-control)] px-1 text-[0.68rem] font-semibold leading-none transition",
                    active
                      ? "bg-brand text-white shadow-sm"
                      : "text-white/72 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <item.icon className="size-4" aria-hidden />
                  <span className="w-full truncate text-center">{item.shortLabel}</span>
                </Link>
              );
            })}
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-more-navigation"
              className={cn(
                "railora-focus flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-[var(--radius-control)] px-1 text-[0.68rem] font-semibold leading-none transition",
                open ? "bg-brand text-white shadow-sm" : "text-white/72 hover:bg-white/10 hover:text-white",
              )}
              onClick={() => setOpen((current) => !current)}
            >
              <MoreHorizontal className="size-4" aria-hidden />
              <span>More</span>
            </button>
          </div>
        </nav>
      </>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-5">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3 text-white">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-brand text-sm font-bold text-white">
            R
          </span>
          {!compact ? (
            <span className="min-w-0">
              <span className="block truncate font-semibold">Railora</span>
              <span className="block truncate text-xs text-white/58">One sandbox</span>
            </span>
          ) : null}
        </Link>
        <button
          type="button"
          className="railora-focus hidden size-9 shrink-0 items-center justify-center rounded-[var(--radius-control)] text-white/70 transition hover:bg-white/10 hover:text-white xl:inline-flex"
          onClick={() => setCompact((current) => !current)}
          aria-label={compact ? "Expand navigation" : "Collapse navigation"}
        >
          {compact ? (
            <ChevronRight className="size-4" aria-hidden />
          ) : (
            <ChevronLeft className="size-4" aria-hidden />
          )}
        </button>
      </div>
      <nav className="space-y-1 px-3 py-5" aria-label="Workspace navigation">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "railora-focus group flex min-h-11 items-center gap-3 rounded-[var(--radius-control)] px-3 text-sm font-medium transition",
                active
                  ? "bg-white/12 text-white shadow-[inset_3px_0_0_var(--brand)]"
                  : "text-white/68 hover:bg-white/10 hover:text-white",
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-control)] transition",
                  active
                    ? "bg-brand text-white"
                    : "bg-white/5 text-white/80 group-hover:bg-white/10 group-hover:text-white",
                )}
              >
                <item.icon className="size-4" aria-hidden />
              </span>
              {!compact ? <span className="min-w-0 truncate">{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-3">
        <div className="rounded-[var(--radius-card)] border border-white/10 bg-white/8 p-4 text-white">
          <p className="text-sm font-semibold">Routing intelligence</p>
          {!compact ? (
            <p className="mt-2 text-xs leading-5 text-white/58">
              4 providers watched, 3 fallback rules active, privacy mode on.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
