"use client";

import {
  CheckCircle2,
  Circle,
  FileUp,
  HandCoins,
  LockKeyhole,
  ShieldAlert,
  UploadCloud,
} from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  approveRelease,
  fundEscrowSandbox,
  openDispute,
  requestRelease,
  runRiskCheck,
  submitProof,
} from "@/lib/actions/mutations";
import { buildFundingLedger, buildReleaseLedger } from "@/lib/domain/ledger";
import { escrowTimeline, statusLabel, transitionEscrowState } from "@/lib/domain/escrow";
import { formatAED } from "@/lib/domain/money";
import type {
  Business,
  DocumentRecord,
  EscrowOrder,
  EscrowState,
  LedgerTransaction,
  OrderMilestone,
} from "@/lib/domain/types";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { TableScroll } from "@/components/ui/table-scroll";
import { EscrowStatusBadge, VerificationBadge } from "@/components/status-badge";

export function EscrowRoomClient({
  order,
  buyer,
  seller,
  milestones,
  documents,
  ledgerPreview,
  created,
}: {
  order: EscrowOrder;
  buyer?: Business;
  seller?: Business;
  milestones: OrderMilestone[];
  documents: DocumentRecord[];
  ledgerPreview: LedgerTransaction[];
  created: boolean;
}) {
  const storageKey = `railora:${order.id}:state`;
  const [state, setState] = useState<EscrowState>(
    created ? "awaiting_funding" : order.state,
  );
  const [message, setMessage] = useState(
    created
      ? "Order created. Invite queued; fund escrow in sandbox mode."
      : "Escrow room ready.",
  );
  const [hydrated, setHydrated] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setHydrated(true);
    const stored = window.localStorage.getItem(storageKey) as EscrowState | null;

    if (stored && !created) {
      setState(stored);
    }

    if (created) {
      window.localStorage.setItem(storageKey, "awaiting_funding");
    }
  }, [created, storageKey]);
  const ledgerRows = useMemo(() => {
    if (state === "released") {
      return [buildFundingLedger(order), buildReleaseLedger(order)];
    }

    if (state === "funded" || state === "proof_submitted" || state === "release_requested") {
      return [buildFundingLedger(order)];
    }

    return ledgerPreview;
  }, [ledgerPreview, order, state]);
  const debits = ledgerRows.flatMap((row) => row.entries).reduce((sum, entry) => sum + entry.debitFils, 0);
  const credits = ledgerRows.flatMap((row) => row.entries).reduce((sum, entry) => sum + entry.creditFils, 0);

  function resultState(data: unknown): EscrowState | undefined {
    if (!data || typeof data !== "object" || !("state" in data)) {
      return undefined;
    }

    return (data as { state?: EscrowState }).state;
  }

  function runAction(action: () => Promise<{ ok: boolean; message: string; data?: unknown }>) {
    startTransition(async () => {
      const result = await action();
      const nextState = resultState(result.data);
      setMessage(result.message);

      if (result.ok && nextState) {
        setState(nextState);
        window.localStorage.setItem(storageKey, nextState);
      }
    });
  }

  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[1.4fr_0.75fr]">
      <div className="min-w-0 space-y-6">
        <Card>
          <div className="flex min-w-0 flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div className="min-w-0">
              <Badge tone="brand">{order.reference}</Badge>
              <h1 className="mt-3 break-words text-3xl font-semibold">
                {order.title}
              </h1>
              <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-muted">
                {order.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <EscrowStatusBadge state={state} />
                <Badge tone="neutral">{order.category}</Badge>
                <Badge tone={order.riskLevel === "high" ? "danger" : order.riskLevel === "medium" ? "warning" : "success"}>
                  {order.riskLevel} risk
                </Badge>
              </div>
            </div>
            <div className="min-w-0 rounded-lg border border-border bg-surface-soft p-4 lg:min-w-64">
              <p className="text-xs uppercase text-muted">Escrow value</p>
              <p className="mt-2 text-2xl font-semibold">
                {formatAED(order.amountFils + order.vatFils)}
              </p>
              <p className="mt-1 text-xs text-muted">
                Fee preview {formatAED(order.feeFils)} · sandbox only
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status timeline</CardTitle>
            <CardDescription>
              Explicit state machine from draft through release or dispute.
            </CardDescription>
          </CardHeader>
          <div className="grid min-w-0 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {escrowTimeline.map((step) => {
              const currentIndex = escrowTimeline.indexOf(state);
              const stepIndex = escrowTimeline.indexOf(step);
              const complete = stepIndex <= currentIndex && currentIndex >= 0;

              return (
                <div
                  key={step}
                  className="flex min-h-20 min-w-0 items-center gap-3 rounded-lg border border-border p-3"
                >
                  {complete ? (
                    <CheckCircle2 className="size-5 text-success" aria-hidden />
                  ) : (
                    <Circle className="size-5 text-muted" aria-hidden />
                  )}
                  <span className="min-w-0 break-words text-sm font-medium">
                    {statusLabel(step)}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
            <CardDescription>
              Deposit, proof, and final acceptance split in integer fils.
            </CardDescription>
          </CardHeader>
          <div className="grid min-w-0 gap-4 md:grid-cols-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="min-w-0 rounded-lg border border-border bg-surface-soft p-4"
              >
                <p className="break-words text-sm font-semibold">{milestone.title}</p>
                <p className="mt-2 text-xl font-semibold">
                  {formatAED(milestone.amountFils)}
                </p>
                <p className="mt-2 break-words text-xs text-muted">
                  Due {milestone.dueDate} · {milestone.status.replaceAll("_", " ")}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sandbox actions</CardTitle>
            <CardDescription>
              Buttons call server actions, enforce role checks, and record audit events.
            </CardDescription>
          </CardHeader>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              disabled={!hydrated || isPending || state !== "awaiting_funding"}
              onClick={() => runAction(() => fundEscrowSandbox({ orderId: order.id }))}
            >
              <LockKeyhole className="size-4" aria-hidden />
              Fund escrow
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={
                !hydrated || isPending || !["funded", "in_progress"].includes(state)
              }
              onClick={() => runAction(() => submitProof({ orderId: order.id }))}
            >
              <FileUp className="size-4" aria-hidden />
              Seller submits proof
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={!hydrated || isPending || state !== "proof_submitted"}
              onClick={() => runAction(() => requestRelease({ orderId: order.id }))}
            >
              <HandCoins className="size-4" aria-hidden />
              Request release
            </Button>
            <Button
              type="button"
              disabled={!hydrated || isPending || state !== "release_requested"}
              onClick={() => runAction(() => approveRelease({ orderId: order.id }))}
            >
              <CheckCircle2 className="size-4" aria-hidden />
              Approve release
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={!hydrated || isPending}
              onClick={() =>
                runAction(() =>
                  openDispute({
                    orderId: order.id,
                    reason: "Demo buyer opened a discrepancy review.",
                  }),
                )
              }
            >
              <ShieldAlert className="size-4" aria-hidden />
              Open dispute
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                try {
                  transitionEscrowState(state, "refunded");
                  setMessage("Unexpectedly allowed refund.");
                } catch (error) {
                  setMessage(error instanceof Error ? error.message : "Invalid transition");
                }
              }}
            >
              Try invalid transition
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={!hydrated || isPending}
              onClick={() => runAction(() => runRiskCheck({ orderId: order.id }))}
            >
              Run risk check
            </Button>
          </div>
          <p className="mt-4 break-words text-sm text-muted" role="status">
            {message}
          </p>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ledger preview</CardTitle>
            <CardDescription>
              Every money event has balanced debits and credits.
            </CardDescription>
          </CardHeader>
          <TableScroll>
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th className="py-3 pr-4">Transaction</th>
                  <th className="py-3 pr-4">Account</th>
                  <th className="py-3 pr-4">Debit</th>
                  <th className="py-3 pr-4">Credit</th>
                  <th className="py-3 pr-4">Memo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ledgerRows.flatMap((transaction) =>
                  transaction.entries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="py-3 pr-4">{transaction.type}</td>
                      <td className="py-3 pr-4 font-medium">{entry.account}</td>
                      <td className="py-3 pr-4">{formatAED(entry.debitFils)}</td>
                      <td className="py-3 pr-4">{formatAED(entry.creditFils)}</td>
                      <td className="py-3 pr-4 text-muted">{entry.memo}</td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </TableScroll>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Badge tone={debits === credits ? "success" : "danger"}>
              Debits {formatAED(debits)}
            </Badge>
            <Badge tone={debits === credits ? "success" : "danger"}>
              Credits {formatAED(credits)}
            </Badge>
          </div>
        </Card>
      </div>

      <aside className="min-w-0 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Counterparty profile</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {([
              ["Buyer", buyer],
              ["Seller", seller],
            ] satisfies Array<[string, Business | undefined]>).map(([label, item]) => {
              return (
                <div
                  key={String(label)}
                  className="min-w-0 rounded-lg border border-border p-4"
                >
                  <p className="text-xs uppercase text-muted">{label}</p>
                  <p className="mt-2 break-words text-sm font-semibold">
                    {item?.displayName}
                  </p>
                  <p className="mt-1 break-words text-xs text-muted">
                    {item?.licenceNumber} · TRN {item?.trn}
                  </p>
                  <div className="mt-3 flex min-w-0 items-center justify-between gap-3">
                    {item && <VerificationBadge status={item.verificationStatus} />}
                    <Badge tone="brand">Score {item?.tradeScore}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evidence upload</CardTitle>
            <CardDescription>
              Uploads are metadata-only and queued for mock scan jobs.
            </CardDescription>
          </CardHeader>
          <div className="space-y-3">
            <Label htmlFor="evidence">Proof file</Label>
            <Input id="evidence" defaultValue="signed-delivery-note.pdf" />
            <Button variant="secondary" className="w-full" type="button">
              <UploadCloud className="size-4" aria-hidden />
              Queue evidence scan
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity feed</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              "Order created with VAT and fee preview.",
              "Counterparty invite sent by email and UAE mobile.",
              "Verification checks attached to both businesses.",
              "Sandbox payment and ledger rows visible before release.",
            ].map((activity) => (
              <div
                key={activity}
                className="min-w-0 break-words rounded-lg border border-border bg-surface-soft p-3 text-sm leading-6"
              >
                {activity}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {documents.length === 0 ? (
              <p className="text-sm text-muted">No document records yet.</p>
            ) : (
              documents.map((document) => (
                <div key={document.id} className="min-w-0 text-sm">
                  <p className="break-words font-medium">{document.fileName}</p>
                  <p className="break-words text-xs text-muted">{document.type}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </aside>
    </div>
  );
}
