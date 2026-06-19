"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, FilePlus2, SlidersHorizontal } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createEscrowOrder, inviteCounterparty } from "@/lib/actions/mutations";
import { createEscrowOrderSchema } from "@/lib/actions/schemas";
import type { Counterparty } from "@/lib/domain/types";
import {
  calculatePlatformFeeFils,
  calculateVatFils,
  formatAED,
  parseAEDToFils,
} from "@/lib/domain/money";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/field";

type FormInput = z.input<typeof createEscrowOrderSchema>;
type FormOutput = z.output<typeof createEscrowOrderSchema>;

export function CreateEscrowForm({
  counterparties,
}: {
  counterparties: Counterparty[];
}) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(createEscrowOrderSchema),
    defaultValues: {
      counterpartyId: "cp-biz-seller-1",
      title: "New supplier milestone order",
      description: "Verified UAE B2B escrow for goods or services delivery.",
      category: "Goods",
      amountAed: 45000,
      deliveryLocation: "Dubai South",
      dueDate: "2026-06-28",
      depositPercent: 30,
    },
  });
  const amountAed = watch("amountAed");
  const depositPercent = watch("depositPercent");
  const depositPercentValue = Number(depositPercent || 30);
  const totals = useMemo(() => {
    const amountFils = parseAEDToFils(Number(amountAed || 0));
    const vatFils = calculateVatFils(amountFils);
    const feeFils = calculatePlatformFeeFils(amountFils + vatFils);
    const depositFils = Math.round(amountFils * (depositPercentValue / 100));
    const shipmentFils = Math.round((amountFils - depositFils) * 0.6);
    const finalFils = amountFils - depositFils - shipmentFils;

    return { amountFils, vatFils, feeFils, depositFils, shipmentFils, finalFils };
  }, [amountAed, depositPercentValue]);

  return (
    <form
      className="grid min-w-0 gap-6 xl:grid-cols-[1.35fr_0.65fr]"
      onSubmit={handleSubmit((values: FormOutput) => {
        startTransition(async () => {
          const invite = await inviteCounterparty({
            orderId: "ord-006",
            email: "trade@jebelpack.example",
            mobile: "+971554445566",
          });
          const result = await createEscrowOrder(values);
          setMessage(result.ok ? invite.message : result.message);

          if (result.ok && result.data?.redirectTo) {
            window.location.assign(result.data.redirectTo);
          }
        });
      })}
    >
      <div className="min-w-0 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Recipient</CardTitle>
            <CardDescription>
              Choose a verified beneficiary or invite by UAE mobile/email.
            </CardDescription>
          </CardHeader>
          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            <div className="min-w-0 space-y-2">
              <Label htmlFor="counterpartyId">Recipient</Label>
              <Select id="counterpartyId" {...register("counterpartyId")}>
                {counterparties
                  .filter((counterparty) => counterparty.businessId.includes("seller"))
                  .map((counterparty) => (
                    <option key={counterparty.id} value={counterparty.id}>
                      {counterparty.name} · score {counterparty.tradeScore}
                    </option>
                  ))}
              </Select>
              {errors.counterpartyId && (
                <p className="text-xs text-danger">
                  {errors.counterpartyId.message}
                </p>
              )}
            </div>
            <div className="min-w-0 space-y-2">
              <Label htmlFor="invite">Invite email/mobile</Label>
              <Input
                id="invite"
                defaultValue="trade@jebelpack.example / +971554445566"
                readOnly
              />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Amount and route</CardTitle>
            <CardDescription>
              AED amounts are converted into integer fils for ledger safety. Routing preference is a sandbox preview.
            </CardDescription>
          </CardHeader>
          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            <div className="min-w-0 space-y-2 md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-xs text-danger">{errors.title.message}</p>
              )}
            </div>
            <div className="min-w-0 space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} />
            </div>
            <div className="min-w-0 space-y-2">
              <Label htmlFor="category">Goods/services</Label>
              <Select id="category" {...register("category")}>
                <option>Goods</option>
                <option>Services</option>
                <option>Logistics</option>
                <option>Creative</option>
              </Select>
            </div>
            <div className="min-w-0 space-y-2">
              <Label htmlFor="routingPreference">Routing preference</Label>
              <Select id="routingPreference" name="routingPreference" defaultValue="smart">
                <option value="smart">Smart</option>
                <option value="fastest">Fastest</option>
                <option value="lowest_cost">Lowest cost</option>
                <option value="highest_success">Highest success rate</option>
                <option value="privacy_first">Privacy first</option>
                <option value="manual">Manual provider selection</option>
              </Select>
            </div>
            <div className="min-w-0 space-y-2">
              <Label htmlFor="amountAed">AED amount before VAT</Label>
              <Input
                id="amountAed"
                type="number"
                min="1"
                step="0.01"
                {...register("amountAed", { valueAsNumber: true })}
              />
            </div>
            <div className="min-w-0 space-y-2">
              <Label htmlFor="deliveryLocation">Delivery location</Label>
              <Input id="deliveryLocation" {...register("deliveryLocation")} />
            </div>
            <div className="min-w-0 space-y-2">
              <Label htmlFor="dueDate">Due date</Label>
              <Input id="dueDate" type="date" {...register("dueDate")} />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Delivery and compliance</CardTitle>
            <CardDescription>
              Adjust the protected split and preview expected settlement, backup rail, and compliance requirements.
            </CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-surface-soft p-4">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0">
                  <Label htmlFor="depositPercent">Deposit percentage</Label>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Protected transfers usually start with 30-40% to balance trust.
                  </p>
                </div>
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white text-brand shadow-sm">
                  <SlidersHorizontal className="size-4" aria-hidden />
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_7rem] sm:items-center">
                <input
                  aria-label="Deposit percentage slider"
                  type="range"
                  min="10"
                  max="80"
                  value={depositPercentValue}
                  onChange={(event) =>
                    setValue("depositPercent", Number(event.target.value), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  className="h-2 w-full cursor-pointer accent-brand"
                />
                <Input
                  id="depositPercent"
                  type="number"
                  min="10"
                  max="80"
                  {...register("depositPercent", { valueAsNumber: true })}
                />
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-brand transition-all"
                  style={{ width: `${depositPercentValue}%` }}
                />
              </div>
            </div>
            <div className="grid min-w-0 gap-3 md:grid-cols-3">
              {[
                ["Deposit", totals.depositFils],
                ["Shipment / proof", totals.shipmentFils],
                ["Final acceptance", totals.finalFils],
              ].map(([label, amount]) => (
                <div
                  key={String(label)}
                  className="min-w-0 rounded-lg border border-border bg-white/80 p-4 shadow-sm"
                >
                  <p className="break-words text-sm font-semibold">{label}</p>
                  <p className="mt-2 break-words text-lg font-semibold">
                    {formatAED(Number(amount))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Data sharing</CardTitle>
            <CardDescription>
              Metadata only. Uploads are represented by a mock R2 abstraction and sensitive values remain masked by default.
            </CardDescription>
          </CardHeader>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            {[
              "Pro forma invoice",
              "Purchase order",
              "Delivery note",
              "Trade licence",
              "Provider receives three identifying fields",
              "Backup rail can be used automatically",
            ].map((document) => (
              <label
                key={document}
                className="flex min-w-0 items-center gap-3 rounded-lg border border-border p-3 text-sm"
              >
                <input type="checkbox" defaultChecked className="size-4" />
                {document}
              </label>
            ))}
          </div>
        </Card>
      </div>

      <aside className="min-w-0 space-y-6">
        <Card className="xl:sticky xl:top-24">
          <CardHeader>
            <CardTitle>5. Review and confirm</CardTitle>
            <CardDescription>
              Recipient, amount, fee, expected delivery, selected rail, backup rail, and data-sharing preview.
            </CardDescription>
          </CardHeader>
          <dl className="space-y-3 text-sm">
            <div className="flex min-w-0 justify-between gap-4">
              <dt className="text-muted">Subtotal</dt>
              <dd className="break-words text-right font-medium">
                {formatAED(totals.amountFils)}
              </dd>
            </div>
            <div className="flex min-w-0 justify-between gap-4">
              <dt className="text-muted">VAT 5%</dt>
              <dd className="break-words text-right font-medium">
                {formatAED(totals.vatFils)}
              </dd>
            </div>
            <div className="flex min-w-0 justify-between gap-4">
                <dt className="text-muted">Railora demo fee</dt>
              <dd className="break-words text-right font-medium">
                {formatAED(totals.feeFils)}
              </dd>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex min-w-0 justify-between gap-4">
                <dt className="font-semibold">Sandbox funding amount</dt>
                <dd className="break-words text-right font-semibold">
                  {formatAED(totals.amountFils + totals.vatFils + totals.feeFils)}
                </dd>
              </div>
            </div>
          </dl>
          <Button type="submit" className="mt-6 w-full" disabled={isPending}>
            <FilePlus2 className="size-4" aria-hidden />
            {isPending ? "Creating payment" : "Create payment"}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
          <p className="mt-3 break-words text-xs text-muted" role="status">
            {message || "Payment actions and ledger transitions appear after creation."}
          </p>
        </Card>
      </aside>
    </form>
  );
}
