import { FileText, Landmark, UserCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { VerificationActions } from "@/components/verification-actions";
import { VerificationBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { businesses, documents, verificationChecks } from "@/lib/data/seed";

export default function VerificationPage() {
  const business = businesses[0];

  return (
    <AppShell>
      <div className="mb-6">
        <Badge tone="brand">Verification center</Badge>
        <h1 className="mt-3 text-3xl font-semibold">{business.legalName}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Mock UAE PASS, Dubai Unified Licence, VAT/TRN, bank ownership,
          beneficial owner, and sanctions/PEP checks. Real providers are not
          connected in this prototype.
        </p>
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>Verification checklist</CardTitle>
            <CardDescription>
              Status chips are seeded and can be refreshed through mock adapters.
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
                Metadata is stored against a mock R2 key for document scan jobs.
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
                  <p className="mt-1 break-all text-xs text-muted">
                    {document.storageKey}
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
