import { ChevronDown, Globe2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { getBusiness } from "@/lib/data/seed";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { AppNavigation } from "./app-navigation";
import { CommandPalette } from "./command-palette";

export async function AppShell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const business = getBusiness(user.businessId);

  return (
    <div className="min-h-screen min-w-0 max-w-full bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-ink text-white shadow-[var(--shadow-float)] lg:block">
        <AppNavigation variant="sidebar" />
      </aside>
      <div className="min-w-0 max-w-full lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-surface/92 shadow-[var(--shadow-soft)] backdrop-blur">
          <div className="flex min-h-16 min-w-0 max-w-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <Link href="/dashboard" className="flex min-h-11 min-w-0 items-center gap-2 lg:hidden">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-ink text-sm font-bold text-white">
                R
              </span>
              <span className="min-w-0 truncate font-semibold">Railora</span>
            </Link>
            <div className="hidden min-w-0 items-center gap-3 lg:flex">
              <button
                type="button"
                className="railora-focus inline-flex min-h-10 max-w-64 items-center gap-2 rounded-[var(--radius-control)] border border-border bg-surface-elevated px-3 text-sm font-semibold text-foreground shadow-sm"
              >
                <Globe2 className="size-4 text-brand" aria-hidden />
                <span className="min-w-0 truncate">{business?.displayName ?? "Railora workspace"}</span>
                <ChevronDown className="size-4 text-muted" aria-hidden />
              </button>
              <Badge tone="success">Sandbox</Badge>
              <span className="inline-flex min-h-9 items-center gap-2 rounded-[var(--radius-control)] border border-border bg-surface-elevated px-3 text-sm text-muted shadow-sm">
                <ShieldCheck className="size-4 text-success" aria-hidden />
                Provider simulation online
              </span>
            </div>
            <div className="ml-auto flex min-w-0 items-center gap-3">
              <CommandPalette />
              <ButtonLink href="/auth" variant="secondary" size="sm" className="hidden sm:inline-flex">
                Switch role
              </ButtonLink>
              <div className="hidden min-w-0 text-right sm:block">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted">
                  {business?.displayName} / {user.role.replaceAll("_", " ")}
                </p>
              </div>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-brand text-sm font-semibold text-white shadow-[var(--shadow-soft)]">
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
