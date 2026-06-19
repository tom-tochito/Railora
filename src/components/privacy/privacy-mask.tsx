"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function PrivacyMask({
  value,
  masked = "••••••",
  label = "Sensitive value",
  className,
}: {
  value: string;
  masked?: string;
  label?: string;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      <span className="amount-tabular min-w-0 truncate" aria-live="polite">
        {visible ? value : masked}
      </span>
      <button
        type="button"
        aria-label={visible ? `Mask ${label}` : `Reveal ${label}`}
        className="railora-focus inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-control)] text-muted transition hover:bg-surface-soft hover:text-foreground"
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </button>
    </span>
  );
}
