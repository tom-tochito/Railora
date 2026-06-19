import { ChevronDown, Globe2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { getBusiness } from "@/lib/data/seed";
import { ButtonLink } from "@/components/ui/button";
import { AppNavigation } from "./app-navigation";
import { CommandPalette } from "./command-palette";
import { ThemeToggle } from "./theme-toggle";

function HeaderDivider({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`h-6 w-px shrink-0 bg-border ${className}`.trim()}
    />
  );
}

export async function AppShell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const business = getBusiness(user.businessId);

  return (
    <div className="min-h-screen min-w-0 max-w-full bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-ink text-white shadow-[var(--shadow-float)] lg:block">
        <AppNavigation variant="sidebar" />
      </aside>
      <div className="min-w-0 max-w-full lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-surface/80 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <div className="flex min-h-16 min-w-0 max-w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            {/* LEFT: two stacked, left-aligned rows */}
            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
              {/* Row 1: brand / workspace + environment */}
              <div className="flex min-w-0 items-center gap-3">
                <Link href="/dashboard" className="flex min-h-9 min-w-0 items-center gap-2 lg:hidden">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-brand text-sm font-bold text-white">
                    R
                  </span>
                  <span className="min-w-0 truncate font-semibold">Railora</span>
                </Link>
                <div className="hidden min-w-0 items-center gap-3 lg:flex">
                  <button
                    type="button"
                    className="railora-focus inline-flex min-h-9 max-w-64 items-center gap-2 rounded-[var(--radius-control)] border border-border bg-surface-elevated px-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-brand/40"
                  >
                    <Globe2 className="size-4 text-brand" aria-hidden />
                    <span className="min-w-0 truncate">{business?.displayName ?? "Railora workspace"}</span>
                    <ChevronDown className="size-4 text-muted" aria-hidden />
                  </button>
                  <HeaderDivider />
                  <span className="inline-flex min-h-9 items-center gap-2 rounded-[var(--radius-control)] border border-success/25 bg-success-soft px-3 shadow-sm">
                    <span className="relative flex size-2" aria-hidden>
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                      <span className="relative inline-flex size-2 rounded-full bg-success" />
                    </span>
                    <span className="eyebrow text-success">Sandbox · Sim online</span>
                  </span>
                </div>
              </div>
              {/* Row 2: search + controls */}
              <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                <CommandPalette />
                <ThemeToggle />
                <ButtonLink href="/auth" variant="secondary" size="sm" className="hidden sm:inline-flex">
                  Switch role
                </ButtonLink>
              </div>
            </div>
            {/* RIGHT: user section, right-aligned */}
            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden min-w-0 text-right sm:block">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted">
                  {business?.displayName} / {user.role.replaceAll("_", " ")}
                </p>
              </div>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-brand/30 bg-brand text-sm font-semibold text-white shadow-[var(--shadow-soft)]">
                {user.avatarInitials}
              </div>
            </div>
          </div>
        </header>
        <main className="min-w-0 max-w-full px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          {children}
        </main>
      </div>
      <AppNavigation variant="mobile" />
    </div>
  );
}
