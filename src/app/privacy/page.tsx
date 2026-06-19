import { EyeOff, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { InsightMetric } from "@/components/insight-metric";
import { PageHeader } from "@/components/page-header";
import { PrivacyMask } from "@/components/privacy/privacy-mask";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { privacyScopes } from "@/lib/data/railora-one";

export default function PrivacyPage() {
  return (
    <AppShell>
      <PageHeader
        badge="Privacy Hub"
        title="Visible controls for data that should stay quiet"
        description="Railora One makes data-sharing scope understandable without interrupting the payment operations workflow."
      />

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <InsightMetric label="Privacy Mode" value="On" detail="Sensitive values are masked by default across the console." icon={<EyeOff className="size-4" aria-hidden />} tone="accent" />
        <InsightMetric label="Average provider fields" value="3" detail="Identifying fields shared by the selected route." icon={<ShieldCheck className="size-4" aria-hidden />} tone="brand" />
        <InsightMetric label="Endpoint scopes" value="Scoped" detail="Webhook endpoints declare permitted fields." icon={<ShieldCheck className="size-4" aria-hidden />} tone="success" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <div className="grid gap-4">
          {privacyScopes.map((scope) => (
            <Card key={scope.id} className="border-privacy/20">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold">{scope.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{scope.detail}</p>
                </div>
                <Badge tone="privacy">{scope.status}</Badge>
              </div>
              <div className="mt-4 rounded-[var(--radius-control)] border border-border bg-surface-soft p-3 text-sm">
                {scope.fields} identifying fields in current policy
              </div>
            </Card>
          ))}
        </div>

        <Card className="xl:sticky xl:top-24 xl:self-start">
          <CardHeader>
            <CardTitle>Reveal example</CardTitle>
            <CardDescription>
              Sensitive fields are masked until an authorized user explicitly reveals them.
            </CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <div className="rounded-[var(--radius-control)] border border-border bg-surface-soft p-4">
              <p className="text-sm font-semibold">Customer mobile</p>
              <p className="mt-2"><PrivacyMask value="+971501112233" masked="+971 ******" label="customer mobile" /></p>
            </div>
            <div className="rounded-[var(--radius-control)] border border-border bg-surface-soft p-4">
              <p className="text-sm font-semibold">API key</p>
              <p className="mt-2"><PrivacyMask value="rl_live_8K2_secret_demo_value" masked="rl_live_8K2_****" label="API key" /></p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-privacy/20 bg-privacy-soft p-4 text-sm leading-6 text-privacy">
              This integration will receive three identifying fields: merchant reference, masked customer contact, and provider token.
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
