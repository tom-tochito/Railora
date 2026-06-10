"use client";

import { useState, useTransition } from "react";
import { UploadCloud, Wand2 } from "lucide-react";
import {
  runVerificationCheck,
  uploadDocumentMetadata,
} from "@/lib/actions/mutations";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/field";

export function VerificationActions({ businessId }: { businessId: string }) {
  const [message, setMessage] = useState("Ready to run sandbox checks.");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <Button
        type="button"
        className="w-full sm:w-auto"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const result = await runVerificationCheck({
              businessId,
              checkType: "full_checklist",
            });
            setMessage(result.message);
          })
        }
      >
        <Wand2 className="size-4" aria-hidden />
        Run sandbox verification
      </Button>
      <form
        className="grid gap-3 rounded-lg border border-border bg-surface-soft p-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          startTransition(async () => {
            const result = await uploadDocumentMetadata({
              businessId,
              type: form.get("type"),
              fileName: form.get("fileName"),
            });
            setMessage(result.message);
          });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="type">Document type</Label>
          <Select id="type" name="type" defaultValue="trade_licence">
            <option value="trade_licence">Trade licence</option>
            <option value="emirates_id">Emirates ID / passport</option>
            <option value="proof_of_delivery">Proof of delivery</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fileName">File name</Label>
          <Input
            id="fileName"
            name="fileName"
            defaultValue="railora-demo-upload.pdf"
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          className="w-full sm:w-auto"
          disabled={isPending}
        >
          <UploadCloud className="size-4" aria-hidden />
          Queue document
        </Button>
        <p className="self-center text-sm text-muted" role="status">
          {message}
        </p>
      </form>
    </div>
  );
}
