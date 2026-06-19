import { ArrowRight, CreditCard } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { riskTone } from "@/lib/data/railora-one";

export function TransactionCard({
  id,
  reference,
  title,
  merchant,
  amount,
  status,
  provider,
  rail,
  privacy,
  risk,
}: {
  id: string;
  reference: string;
  title: string;
  merchant: string;
  amount: string;
  status: string;
  provider: string;
  rail: string;
  privacy: string;
  risk: string;
}) {
  return (
    <Link
      href={`/payments?transaction=${id}`}
      className="railora-focus grid min-w-0 gap-3 rounded-[var(--radius-card)] border border-border bg-surface-elevated p-4 shadow-[var(--shadow-soft)] transition hover:border-brand/35 hover:bg-surface"
    >
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-brand-soft text-brand">
              <CreditCard className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{title}</p>
              <p className="mt-0.5 truncate font-mono text-xs text-muted">{reference}</p>
            </div>
          </div>
          <p className="mt-3 truncate text-sm text-muted">{merchant} / {rail} / {provider}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="amount-tabular text-base font-semibold">{amount}</p>
          <Badge tone={riskTone(status)}>{status}</Badge>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <Badge tone={riskTone(risk)}>{risk} risk</Badge>
        <Badge tone={privacy.includes("Low") ? "privacy" : "warning"}>{privacy}</Badge>
        <span className="ml-auto inline-flex items-center gap-1 font-semibold text-brand">
          Details <ArrowRight className="size-3.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
