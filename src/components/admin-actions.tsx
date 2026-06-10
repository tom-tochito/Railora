"use client";

import { useState, useTransition } from "react";
import { Download, RefreshCw, Snowflake } from "lucide-react";
import { runReconciliation, runRiskCheck } from "@/lib/actions/mutations";
import { Button } from "@/components/ui/button";

export function AdminActions() {
  const [message, setMessage] = useState("Admin console ready.");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Button
        type="button"
        className="w-full sm:w-auto"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const result = await runRiskCheck({ orderId: "ord-003" });
            setMessage(result.message);
          })
        }
      >
        <Snowflake className="size-4" aria-hidden />
        {isPending ? "Working" : "Freeze review"}
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="w-full sm:w-auto"
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
        className="w-full sm:w-auto"
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
