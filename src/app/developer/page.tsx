import { Braces, Radio, ServerCog } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ApiKeyCard } from "@/components/developer/api-key-card";
import { InsightMetric } from "@/components/insight-metric";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TableScroll } from "@/components/ui/table-scroll";
import { apiKeys, webhookEvents } from "@/lib/data/railora-one";

export default function DeveloperPage() {
  return (
    <AppShell>
      <PageHeader
        badge="Developer portal"
        title="Sandbox and live integration controls"
        description="API keys, request logs, webhook permissions, event catalogue, provider simulator, SDK guidance, and status visibility."
      />

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <InsightMetric label="API keys" value={apiKeys.length} detail="Live and sandbox keys with scoped permissions." icon={<Braces className="size-4" aria-hidden />} tone="brand" />
        <InsightMetric label="Webhook events" value={webhookEvents.length} detail="Endpoint permissions show exactly which fields are shared." icon={<Radio className="size-4" aria-hidden />} tone="accent" />
        <InsightMetric label="Simulator" value="Online" detail="Provider status and test data are sandbox-only." icon={<ServerCog className="size-4" aria-hidden />} tone="success" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1fr]">
        <div className="grid gap-4">
          {apiKeys.map((key) => (
            <ApiKeyCard key={key.id} {...key} />
          ))}
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook delivery log</CardTitle>
              <CardDescription>Each endpoint declares the fields it is permitted to receive.</CardDescription>
            </CardHeader>
            <TableScroll>
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b border-border text-xs text-muted">
                  <tr>
                    <th className="py-3 pl-4 pr-4">Event</th>
                    <th className="py-3 pr-4">Endpoint</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Latency</th>
                    <th className="py-3 pr-4">Fields</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {webhookEvents.map((event) => (
                    <tr key={event.id}>
                      <td className="py-3 pl-4 pr-4 font-mono text-xs">{event.event}</td>
                      <td className="py-3 pr-4 text-muted">{event.endpoint}</td>
                      <td className="py-3 pr-4"><Badge tone={event.status === "delivered" ? "success" : "warning"}>{event.status}</Badge></td>
                      <td className="py-3 pr-4">{event.latencyMs}ms</td>
                      <td className="py-3 pr-4">{event.fields}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroll>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick start</CardTitle>
              <CardDescription>Prototype-only integration guide.</CardDescription>
            </CardHeader>
            <pre className="overflow-x-auto rounded-[var(--radius-control)] border border-border bg-ink p-4 text-sm text-white">
{`POST /payments
Authorization: Bearer rl_test_****

{
  "amount": 42500,
  "currency": "AED",
  "routingPreference": "privacy_first"
}`}
            </pre>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
