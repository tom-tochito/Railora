"use client";

import { Bell, Command, EyeOff, Search, ShieldCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { commandItems } from "@/lib/data/railora-one";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CommandPalette() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [privacyMode, setPrivacyMode] = useState(true);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return commandItems.slice(0, 12);
    }

    return commandItems
      .filter((item) => {
        return `${item.group} ${item.label}`.toLowerCase().includes(normalized);
      })
      .slice(0, 18);
  }, [query]);

  function runCommand(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <>
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          className="railora-focus hidden min-h-10 min-w-64 items-center gap-3 rounded-[var(--radius-control)] border border-border bg-surface-elevated px-3 text-left text-sm text-muted shadow-sm transition hover:border-brand/40 hover:text-foreground md:flex"
          onClick={() => setOpen(true)}
        >
          <Search className="size-4 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1 truncate">Search transactions, rails, merchants</span>
          <span className="rounded border border-border bg-surface-soft px-1.5 py-0.5 font-mono text-[0.65rem] text-muted">
            ⌘K
          </span>
        </button>
        <button
          type="button"
          className="railora-focus inline-flex size-10 items-center justify-center rounded-[var(--radius-control)] border border-border bg-surface-elevated text-muted shadow-sm transition hover:border-brand/40 hover:text-foreground md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open command palette"
        >
          <Search className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          className={cn(
            "railora-focus inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-control)] border px-3 text-sm font-semibold shadow-sm transition",
            privacyMode
              ? "border-privacy/20 bg-privacy-soft text-privacy"
              : "border-border bg-surface-elevated text-muted",
          )}
          onClick={() => setPrivacyMode((current) => !current)}
          aria-pressed={privacyMode}
        >
          <EyeOff className="size-4" aria-hidden />
          <span className="hidden sm:inline">Privacy</span>
        </button>
        <button
          type="button"
          className="railora-focus inline-flex size-10 items-center justify-center rounded-[var(--radius-control)] border border-border bg-surface-elevated text-muted shadow-sm transition hover:border-brand/40 hover:text-foreground"
          aria-label="Open notifications"
        >
          <Bell className="size-4" aria-hidden />
        </button>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-ink/35 px-3 py-6 backdrop-blur-sm sm:px-6"
          role="dialog"
          aria-modal="true"
          aria-label="Railora command palette"
        >
          <div className="mx-auto max-w-2xl overflow-hidden rounded-[var(--radius-panel)] border border-border bg-surface-elevated shadow-[var(--shadow-float)]">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Command className="size-4 text-brand" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search transaction ID, provider, merchant, API key, webhook"
                className="min-h-11 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
              />
              <button
                type="button"
                className="railora-focus inline-flex size-9 items-center justify-center rounded-[var(--radius-control)] text-muted transition hover:bg-surface-soft hover:text-foreground"
                onClick={() => setOpen(false)}
                aria-label="Close command palette"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="max-h-[65svh] overflow-y-auto p-2">
              <button
                type="button"
                className="railora-focus mb-2 flex w-full min-w-0 items-center justify-between gap-3 rounded-[var(--radius-control)] px-3 py-3 text-left transition hover:bg-surface-soft"
                onClick={() => setPrivacyMode((current) => !current)}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-privacy-soft text-privacy">
                    <ShieldCheck className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">Toggle Privacy Mode</span>
                    <span className="block truncate text-xs text-muted">
                      {privacyMode ? "Sensitive values are masked" : "Sensitive values may be visible"}
                    </span>
                  </span>
                </span>
                <Badge tone="privacy">{privacyMode ? "On" : "Off"}</Badge>
              </button>
              {matches.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-muted">
                  No command or record matched that search.
                </p>
              ) : (
                <div className="grid gap-1">
                  {matches.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="railora-focus flex min-h-12 min-w-0 items-center justify-between gap-3 rounded-[var(--radius-control)] px-3 py-2 text-left transition hover:bg-surface-soft"
                      onClick={() => runCommand(item.href)}
                    >
                      <span className="min-w-0 truncate text-sm font-semibold text-foreground">
                        {item.label}
                      </span>
                      <span className="shrink-0 text-xs text-muted">{item.group}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-xs text-muted">
              <span>Command-K / Control-K</span>
              <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
