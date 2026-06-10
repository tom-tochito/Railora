"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { resolveDispute } from "@/lib/actions/mutations";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";

export function DisputeActions({ disputeId }: { disputeId: string }) {
  const [resolution, setResolution] = useState("partial_release");
  const [message, setMessage] = useState("Awaiting admin decision.");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <Select
        value={resolution}
        onChange={(event) => setResolution(event.target.value)}
      >
        <option value="release">Release</option>
        <option value="partial_release">Partial release</option>
        <option value="refund">Refund</option>
        <option value="manual_review">Manual review</option>
      </Select>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          className="w-full sm:w-auto"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const result = await resolveDispute({ disputeId, resolution });
              setMessage(result.message);
            })
          }
        >
          <CheckCircle2 className="size-4" aria-hidden />
          {isPending ? "Resolving" : "Resolve dispute"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          disabled={isPending}
        >
          <RotateCcw className="size-4" aria-hidden />
          Manual review
        </Button>
      </div>
      <p className="text-sm text-muted" role="status">
        {message}
      </p>
    </div>
  );
}
