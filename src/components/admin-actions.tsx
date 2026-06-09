"use client";

import { useState, useTransition } from "react";
import { Download, RefreshCw, Snowflake } from "lucide-react";
import { runReconciliation, runRiskCheck } from "@/lib/actions/mutations";
import { Button } from "@/components/ui/button";

export function AdminActions() {
  const [message, setMessage] = useState("Admin console ready.");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const result = await runRiskCheck({ orderId: "ord-003" });
            setMessage(result.message);
          })
        }
      >
        <Snowflake className="size-4" aria-hidden />
        Freeze review
      </Button>
      <Button
        type="button"
        variant="secondary"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const result = await runReconciliation();
            setMessage(result.message);
          })
        }
      >
        <RefreshCw className="size-4" aria-hidden />
        Trigger reconciliation
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          window.location.href = "/api/audit";
        }}
      >
        <Download className="size-4" aria-hidden />
        Export audit log
      </Button>
      <p className="basis-full text-sm text-muted" role="status">
        {message}
      </p>
    </div>
  );
}
