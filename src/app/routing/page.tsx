import { Activity, ArrowRight, GitBranch, Route } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { InsightMetric } from "@/components/insight-metric";
import { PageHeader } from "@/components/page-header";
import { ProviderHealthCard } from "@/components/routing/provider-health-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { providerHealth, railMapRules, railoraOneSummary } from "@/lib/data/railora-one";
import { formatAED } from "@/lib/domain/money";

export default function RoutingPage() {
  return (
    <AppShell>
      <PageHeader
        badge="Rail Map"
        title="Routing decisions you can trust"
        description="Live provider health, fallback behavior, route objectives, and human-readable rules for cards, instant transfer, wallets, and settlement destinations."
      />

      <div className="mb-6 grid gap-3 md:grid-cols-4">
        <InsightMetric label="Overall success" value="98.1%" detail="Weighted authorization rate." icon={<Activity className="size-4" aria-hidden />} tone="success" />
        <InsightMetric label="Average auth time" value="362ms" detail="Across healthy providers." icon={<Route className="size-4" aria-hidden />} tone="brand" />
        <InsightMetric label="Recovered by fallback" value={formatAED(railoraOneSummary.recoveredFils)} detail="Automatically retried this month." icon={<GitBranch className="size-4" aria-hidden />} tone="accent" />
        <InsightMetric label="Current incidents" value="1" detail="Magnati card latency degraded." icon={<Activity className="size-4" aria-hidden />} tone="danger" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>Live route trace</CardTitle>
            <CardDescription>
              Payment methods flow through Railora orchestration into providers and destinations.
            </CardDescription>
          </CardHeader>
          <div className="grid min-w-0 gap-4 md:grid-cols-[0.9fr_auto_1fr_auto_1fr] md:items-center">
            <div className="grid gap-3">
              {["Cards", "Instant transfer", "Wallets", "Bank transfer"].map((method) => (
                <div key={method} className="rounded-[var(--radius-control)] border border-border bg-surface-soft p-3 text-sm font-semibold">
                  {method}
                </div>
              ))}
            </div>
            <ArrowRight className="hidden size-5 text-muted md:block" aria-hidden />
            <div className="rounded-[var(--radius-panel)] border border-brand/20 bg-brand-soft p-6 text-center">
              <p className="text-sm font-semibold text-brand">Railora orchestration</p>
              <p className="mt-2 text-xs leading-5 text-muted">Smart, fastest, lowest cost, highest success, privacy first, or manual provider.</p>
            </div>
            <ArrowRight className="hidden size-5 text-muted md:block" aria-hidden />
            <div className="grid gap-3">
              {providerHealth.map((provider) => (
                <div key={provider.id} className="rounded-[var(--radius-control)] border border-border bg-surface-elevated p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{provider.name}</span>
                    <Badge tone={provider.status === "healthy" ? "success" : "warning"}>{provider.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          {providerHealth.map((provider) => (
            <ProviderHealthCard key={provider.id} {...provider} />
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>Routing rule builder</CardTitle>
            <CardDescription>
              Human-readable IF, AND, OR, THEN, FALLBACK rules with simulation before publishing.
            </CardDescription>
          </CardHeader>
          <div className="grid gap-3">
            {railMapRules.map((rule) => (
              <div key={rule.id} className="rounded-[var(--radius-card)] border border-border bg-surface-soft p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold">{rule.name}</h2>
                  <Badge tone={rule.state === "active" ? "success" : rule.state === "review" ? "warning" : "neutral"}>{rule.state}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground">{rule.condition}</p>
                <p className="mt-2 text-xs font-semibold text-brand">{rule.impact}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="border-privacy/20 bg-privacy-soft/60">
          <CardHeader>
            <CardTitle>Privacy-first objective</CardTitle>
            <CardDescription>
              Railora can minimize provider data sharing while maintaining success-rate and settlement guarantees.
            </CardDescription>
          </CardHeader>
          <p className="text-sm leading-6 text-muted">
            Simulation estimates field exposure before a rule is activated. Operators see the tradeoff between authorization success, cost, latency, and identifying fields shared.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
