import { ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { getBusiness } from "@/lib/data/seed";
import { AppNavigation } from "./app-navigation";
import { ButtonLink } from "./ui/button";

export async function AppShell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const business = getBusiness(user.businessId);

  return (
    <div className="min-h-screen min-w-0 max-w-full bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-ink text-white shadow-[18px_0_44px_rgba(7,31,28,0.16)] lg:block">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex size-10 items-center justify-center rounded-md bg-accent text-sm font-bold text-ink">
            R
          </div>
          <div className="min-w-0">
            <p className="font-semibold">Railora</p>
            <p className="text-xs text-white/60">Sandbox trust layer</p>
          </div>
        </div>
        <AppNavigation variant="sidebar" />
        <div className="mx-3 mt-2 rounded-lg border border-white/10 bg-white/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles className="size-4 text-accent" aria-hidden />
            Private workspace
          </div>
          <p className="mt-2 text-xs leading-5 text-white/60">
            7 rooms monitored, 5 checks complete, audit ledger online.
          </p>
        </div>
      </aside>
      <div className="min-w-0 max-w-full lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-border bg-white/95 shadow-[0_10px_30px_rgba(7,31,28,0.04)] backdrop-blur">
          <div className="flex min-h-16 min-w-0 max-w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex min-h-11 items-center gap-2 lg:hidden">
              <span className="flex size-9 items-center justify-center rounded-md bg-ink text-sm font-bold text-accent">
                R
              </span>
              <span className="font-semibold">Railora</span>
            </Link>
            <div className="hidden items-center gap-3 text-sm text-muted lg:flex">
              <span className="inline-flex min-h-9 items-center gap-2 rounded-md border border-border bg-surface px-3 shadow-sm">
                <ShieldCheck className="size-4 text-brand" aria-hidden />
                Verified sandbox workspace
              </span>
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <ButtonLink href="/auth" variant="secondary" size="sm">
                Switch demo role
              </ButtonLink>
              <div className="hidden min-w-0 text-right sm:block">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted">
                  {business?.displayName} · {user.role.replaceAll("_", " ")}
                </p>
              </div>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand text-sm font-semibold text-white shadow-[0_10px_22px_rgba(11,122,117,0.22)]">
                {user.avatarInitials}
              </div>
            </div>
          </div>
        </header>
        <main className="min-w-0 max-w-full px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-8">
          {children}
        </main>
      </div>
      <AppNavigation variant="mobile" />
    </div>
  );
}
