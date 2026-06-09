import {
  BadgeCheck,
  Banknote,
  FileText,
  Gauge,
  LayoutDashboard,
  Scale,
  ShieldCheck,
  Siren,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { getBusiness } from "@/lib/data/seed";
import { ButtonLink } from "./ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/verify", label: "Verification", icon: BadgeCheck },
  { href: "/escrow/new", label: "Create escrow", icon: Banknote },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/score", label: "Trade score", icon: Gauge },
  { href: "/disputes/disp-001", label: "Disputes", icon: Scale },
  { href: "/admin", label: "Admin console", icon: Siren },
];

export async function AppShell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const business = getBusiness(user.businessId);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-[#10211f] text-white lg:block">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex size-10 items-center justify-center rounded-md bg-accent text-sm font-bold text-[#10211f]">
            R
          </div>
          <div>
            <p className="font-semibold">Railora</p>
            <p className="text-xs text-white/65">Sandbox trust layer</p>
          </div>
        </div>
        <nav className="space-y-1 px-3 py-5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-white/78 transition hover:bg-white/10 hover:text-white"
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <span className="flex size-9 items-center justify-center rounded-md bg-brand text-sm font-bold text-white">
                R
              </span>
              <span className="font-semibold">Railora</span>
            </Link>
            <div className="hidden items-center gap-2 text-sm text-muted lg:flex">
              <ShieldCheck className="size-4 text-brand" aria-hidden />
              Sandbox/demo. No real money movement.
            </div>
            <div className="flex items-center gap-3">
              <ButtonLink href="/auth" variant="secondary" size="sm">
                Switch demo role
              </ButtonLink>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-muted">
                  {business?.displayName} · {user.role.replaceAll("_", " ")}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-md bg-brand text-sm font-semibold text-white">
                {user.avatarInitials}
              </div>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
