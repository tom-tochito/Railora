"use client";

import { useState, useTransition } from "react";
import { FileDown, Link2, Plus } from "lucide-react";
import {
  convertInvoiceToEscrow,
  createInvoice,
} from "@/lib/actions/mutations";
import { Button } from "@/components/ui/button";

export function InvoiceActions({ invoiceId }: { invoiceId: string }) {
  const [message, setMessage] = useState("Invoice actions are sandbox-only.");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const result = await createInvoice({
              counterpartyId: "cp-biz-buyer-1",
              amountAed: 12000,
              dueDate: "2026-07-12",
            });
            setMessage(result.message);
          })
        }
      >
        <Plus className="size-4" aria-hidden />
        Create invoice
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const result = await convertInvoiceToEscrow({ invoiceId });
            setMessage(result.message);
          })
        }
      >
        <Link2 className="size-4" aria-hidden />
        Convert to escrow
      </Button>
      <Button type="button" variant="ghost" size="sm">
        <FileDown className="size-4" aria-hidden />
        Mock PDF
      </Button>
      <span className="text-xs text-muted" role="status">
        {message}
      </span>
    </div>
  );
}
