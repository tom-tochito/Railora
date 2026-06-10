import { CheckCircle2, Clock3, FileText, Landmark, UserCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { InsightMetric } from "@/components/insight-metric";
import { PageHeader } from "@/components/page-header";
import { VerificationActions } from "@/components/verification-actions";
import { VerificationBadge } from "@/components/status-badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { businesses, documents, verificationChecks } from "@/lib/data/seed";

export default function VerificationPage() {
  const business = businesses[0];
  const verifiedChecks = verificationChecks.filter(
    (check) => check.status === "verified",
  ).length;
  const reviewChecks = verificationChecks.filter(
    (check) => check.status === "pending" || check.status === "requires_review",
  ).length;
  const verifiedDocuments = documents.filter(
    (document) => document.status === "verified",
  ).length;

  return (
    <AppShell>
      <PageHeader
        badge="Verification center"
        title={business.legalName}
        description="A consolidated identity, licence, ownership, bank, tax, and watchlist profile for higher-confidence trade decisions."
      />

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <InsightMetric
          label="Checks complete"
          value={`${verifiedChecks} / ${verificationChecks.length}`}
          detail="Verified signals are ready for escrow context."
          icon={<CheckCircle2 className="size-4" aria-hidden />}
          tone="success"
        />
        <InsightMetric
          label="Review queue"
          value={reviewChecks}
          detail="Open items remain visible before funding decisions."
          icon={<Clock3 className="size-4" aria-hidden />}
          tone="accent"
        />
        <InsightMetric
          label="Documents verified"
          value={`${verifiedDocuments} / ${documents.length}`}
          detail="Records stay attached to the workspace audit story."
          icon={<FileText className="size-4" aria-hidden />}
          tone="brand"
        />
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>Verification checklist</CardTitle>
            <CardDescription>
              Provider signals are represented with seeded sandbox responses.
            </CardDescription>
          </CardHeader>
          <div className="grid gap-3">
            {verificationChecks.map((check) => (
              <div
                key={check.id}
                className="grid min-w-0 gap-3 rounded-lg border border-border p-4 md:grid-cols-[1fr_auto]"
              >
                <div className="flex min-w-0 gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-soft text-brand">
                    {check.type === "uae_pass_identity" ? (
                      <UserCheck className="size-4" aria-hidden />
                    ) : check.type === "business_licence" ? (
                      <Landmark className="size-4" aria-hidden />
                    ) : (
                      <FileText className="size-4" aria-hidden />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold">{check.label}</p>
                    <p className="mt-1 break-words text-sm leading-6 text-muted">
                      {check.notes}
                    </p>
                  </div>
                </div>
                <VerificationBadge status={check.status} />
              </div>
            ))}
          </div>
        </Card>

        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload documents</CardTitle>
              <CardDescription>
                Add supporting records for the demo scan queue.
              </CardDescription>
            </CardHeader>
            <VerificationActions businessId={business.id} />
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent document records</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="min-w-0 rounded-lg border border-border bg-surface-soft p-3"
                >
                  <p className="break-words text-sm font-semibold">
                    {document.fileName}
                  </p>
                  <p className="mt-1 break-words text-xs text-muted">
                    {document.type.replaceAll("_", " ")} · uploaded{" "}
                    {document.uploadedAt.slice(0, 10)}
                  </p>
                  <div className="mt-2">
                    <VerificationBadge status={document.status} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
