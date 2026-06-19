import { FileText, Scale, ShieldAlert } from "lucide-react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { DisputeActions } from "@/components/dispute-actions";
import { InsightMetric } from "@/components/insight-metric";
import { PageHeader } from "@/components/page-header";
import { EscrowStatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  documents,
  getDispute,
  getDisputeMessages,
  getOrder,
  getOrderParties,
} from "@/lib/data/seed";
import { formatAED } from "@/lib/domain/money";

export default async function DisputePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dispute = getDispute(id);

  if (!dispute) {
    notFound();
  }

  const order = getOrder(dispute.orderId);
  const parties = order ? getOrderParties(order) : undefined;
  const messages = getDisputeMessages(dispute.id);
  const evidence = documents.filter((document) => document.orderId === dispute.orderId);

  return (
    <AppShell>
      <PageHeader
        badge="Exception case"
        title={dispute.reason}
        description="Evidence, conversation history, proposed resolution, privacy-safe context, and admin controls stay together for a calm exception workflow."
        tone="danger"
      />

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <InsightMetric
          label="Dispute status"
          value={dispute.status.replaceAll("_", " ")}
          detail={`Opened ${dispute.openedAt.slice(0, 10)} for active review.`}
          icon={<ShieldAlert className="size-4" aria-hidden />}
          tone="danger"
        />
        <InsightMetric
          label="Proposed path"
          value={dispute.proposedResolution.replaceAll("_", " ")}
          detail="Resolution remains sandbox-only until an admin action is run."
          icon={<Scale className="size-4" aria-hidden />}
          tone="accent"
        />
        <InsightMetric
          label="Evidence"
          value={evidence.length}
          detail={`${messages.length} event-log messages attached.`}
          icon={<FileText className="size-4" aria-hidden />}
          tone="brand"
        />
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[1.35fr_0.7fr]">
        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment context</CardTitle>
              <CardDescription>
                {parties?.buyer?.displayName} buying from{" "}
                {parties?.seller?.displayName}
              </CardDescription>
            </CardHeader>
            {order && (
              <div className="grid min-w-0 gap-4 md:grid-cols-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted">Reference</p>
                  <p className="mt-1 break-words text-sm font-semibold">
                    {order.reference}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted">Value</p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatAED(order.amountFils + order.vatFils)}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted">Status</p>
                  <div className="mt-1">
                    <EscrowStatusBadge state={order.state} />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted">Resolution</p>
                  <p className="mt-1 break-words text-sm font-semibold">
                    {dispute.proposedResolution.replaceAll("_", " ")}
                  </p>
                </div>
              </div>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evidence gallery</CardTitle>
            </CardHeader>
            <div className="grid min-w-0 gap-4 md:grid-cols-3">
              {evidence.map((document) => (
                <div
                  key={document.id}
                  className="min-h-32 min-w-0 rounded-lg border border-border bg-surface-soft p-4"
                >
                  <p className="break-words text-sm font-semibold">
                    {document.fileName}
                  </p>
                  <p className="mt-2 break-words text-xs leading-5 text-muted">
                    {document.type.replaceAll("_", " ")} · uploaded{" "}
                    {document.uploadedAt.slice(0, 10)}
                  </p>
                  <div className="mt-4">
                    <Badge tone="neutral">{document.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event log</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="min-w-0 rounded-lg border border-border bg-surface-soft p-4"
                >
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <p className="min-w-0 break-words text-sm font-semibold">
                      {message.author}
                    </p>
                    <Badge tone="neutral">{message.role.replaceAll("_", " ")}</Badge>
                  </div>
                  <p className="mt-2 break-words text-sm leading-6 text-muted">
                    {message.body}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="xl:sticky xl:top-24 xl:self-start">
          <CardHeader>
            <CardTitle>Admin resolution</CardTitle>
            <CardDescription>
              Platform-risk actions record audit events in the demo ledger.
            </CardDescription>
          </CardHeader>
          <DisputeActions disputeId={dispute.id} />
        </Card>
      </div>
    </AppShell>
  );
}
