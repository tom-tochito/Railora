"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, FilePlus2 } from "lucide-react";
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
  const totals = useMemo(() => {
    const amountFils = parseAEDToFils(Number(amountAed || 0));
    const vatFils = calculateVatFils(amountFils);
    const feeFils = calculatePlatformFeeFils(amountFils + vatFils);
    const depositFils = Math.round(amountFils * (Number(depositPercent) / 100));
    const shipmentFils = Math.round((amountFils - depositFils) * 0.6);
    const finalFils = amountFils - depositFils - shipmentFils;

    return { amountFils, vatFils, feeFils, depositFils, shipmentFils, finalFils };
  }, [amountAed, depositPercent]);

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
            <CardTitle>1. Counterparty</CardTitle>
            <CardDescription>
              Choose a verified seller or invite by UAE mobile/email.
            </CardDescription>
          </CardHeader>
          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            <div className="min-w-0 space-y-2">
              <Label htmlFor="counterpartyId">Seller</Label>
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
            <CardTitle>2. Order details</CardTitle>
            <CardDescription>
              AED amounts are converted into integer fils for ledger safety.
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
            <CardTitle>3. Milestones</CardTitle>
            <CardDescription>
              Deposit, proof milestone, and final acceptance.
            </CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="depositPercent">Deposit percentage</Label>
              <Input
                id="depositPercent"
                type="number"
                min="10"
                max="80"
                {...register("depositPercent", { valueAsNumber: true })}
              />
            </div>
            <div className="grid min-w-0 gap-3 md:grid-cols-3">
              {[
                ["Deposit", totals.depositFils],
                ["Shipment / proof", totals.shipmentFils],
                ["Final acceptance", totals.finalFils],
              ].map(([label, amount]) => (
                <div
                  key={String(label)}
                  className="min-w-0 rounded-lg border border-border bg-surface-soft p-4"
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
            <CardTitle>4. Documents</CardTitle>
            <CardDescription>
              Metadata only. Uploads are represented by a mock R2 abstraction.
            </CardDescription>
          </CardHeader>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            {[
              "Pro forma invoice",
              "Purchase order",
              "Delivery note",
              "Trade licence",
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
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>5. Fee review</CardTitle>
            <CardDescription>
              Sandbox payment adapter preview. No real money movement.
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
            Create order
            <ArrowRight className="size-4" aria-hidden />
          </Button>
          <p className="mt-3 break-words text-xs text-muted" role="status">
            {message || "Invalid transitions will be shown inside escrow rooms."}
          </p>
        </Card>
      </aside>
    </form>
  );
}
