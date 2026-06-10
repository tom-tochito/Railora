"use client";

import {
  BadgeCheck,
  Banknote,
  FileText,
  Gauge,
  LayoutDashboard,
  MoreHorizontal,
  Scale,
  Siren,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/verify", label: "Verification", icon: BadgeCheck },
  { href: "/escrow/new", label: "Create escrow", icon: Banknote },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/score", label: "Trade score", icon: Gauge },
  { href: "/disputes/disp-001", label: "Disputes", icon: Scale },
  { href: "/admin", label: "Admin console", icon: Siren },
];

const primaryMobileItems = [
  { href: "/dashboard", label: "Dashboard", shortLabel: "Home", icon: LayoutDashboard },
  { href: "/verify", label: "Verification", shortLabel: "Verify", icon: BadgeCheck },
  { href: "/escrow/new", label: "Create escrow", shortLabel: "Escrow", icon: Banknote },
  { href: "/invoices", label: "Invoices", shortLabel: "Invoices", icon: FileText },
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

  if (variant === "mobile") {
    return (
      <>
        {open ? (
          <div
            id="mobile-more-navigation"
            className="fixed inset-x-3 bottom-24 z-40 rounded-lg border border-border bg-white/95 p-3 shadow-[0_24px_80px_rgba(7,31,28,0.24)] backdrop-blur lg:hidden"
            data-mobile-more-menu
          >
            <div className="mb-2 flex items-center justify-between gap-3 px-1">
              <p className="text-xs font-semibold uppercase text-muted">
                Workspace routes
              </p>
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-md text-muted transition hover:bg-surface-soft hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
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
                      "flex min-h-12 min-w-0 items-center gap-3 rounded-md border px-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                      active
                        ? "border-brand bg-teal-50 text-brand shadow-sm"
                        : "border-border bg-white text-foreground hover:border-brand/40 hover:bg-surface-soft",
                    )}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-soft text-brand">
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
          className="fixed inset-x-3 bottom-3 z-40 rounded-lg border border-white/70 bg-ink/95 px-2 py-2 shadow-[0_20px_70px_rgba(7,31,28,0.28)] backdrop-blur lg:hidden"
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
                    "flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-md px-1 text-[0.68rem] font-semibold leading-none transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    active
                      ? "bg-accent text-ink shadow-sm"
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
                "flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-md px-1 text-[0.68rem] font-semibold leading-none transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                open ? "bg-accent text-ink shadow-sm" : "text-white/72 hover:bg-white/10 hover:text-white",
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
    <nav className="space-y-1 px-3 py-5">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition",
              active
                ? "bg-white/10 text-white shadow-[inset_3px_0_0_var(--accent)]"
                : "text-white/70 hover:bg-white/10 hover:text-white",
            )}
          >
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-md transition",
                active
                  ? "bg-accent text-ink"
                  : "bg-white/5 text-white/80 group-hover:bg-white/10 group-hover:text-white",
              )}
            >
              <item.icon className="size-4" aria-hidden />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
