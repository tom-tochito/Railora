import { AppShell } from "@/components/app-shell";
import { AmountDisplay } from "@/components/finance/amount-display";
import { PageHeader } from "@/components/page-header";
import { TransactionCard } from "@/components/payments/transaction-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/field";
import { transactionFeed } from "@/lib/data/railora-one";

const colors = [
  ["Background", "bg-background"],
  ["Surface", "bg-surface"],
  ["Elevated", "bg-surface-elevated"],
  ["Primary", "bg-brand"],
  ["Privacy", "bg-privacy"],
  ["Success", "bg-success"],
  ["Warning", "bg-warning"],
  ["Danger", "bg-danger"],
];

export default function DesignSystemPage() {
  return (
    <AppShell>
      <PageHeader
        badge="Design system"
        title="Railora One components and states"
        description="Internal reference for tokens, typography, actions, inputs, chips, financial amounts, transactions, tables, loading, privacy, dark mode, and RTL-ready layout."
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Color tokens</CardTitle>
            <CardDescription>Use token-backed utilities, not hardcoded product colors.</CardDescription>
          </CardHeader>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {colors.map(([label, className]) => (
              <div key={label} className="rounded-[var(--radius-control)] border border-border p-3">
                <div className={`${className} h-16 rounded-[var(--radius-control)] border border-border`} />
                <p className="mt-2 text-sm font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
              <CardDescription>Buttons, fields, chips, and focus states.</CardDescription>
            </CardHeader>
            <div className="flex flex-wrap gap-2">
              <Button type="button">Primary</Button>
              <Button type="button" variant="secondary">Secondary</Button>
              <Button type="button" variant="privacy">Privacy</Button>
              <Button type="button" variant="danger">Danger</Button>
              <Button type="button" variant="ghost">Ghost</Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="brand">Brand</Badge>
              <Badge tone="privacy">Privacy</Badge>
              <Badge tone="success">Success</Badge>
              <Badge tone="warning">Review</Badge>
              <Badge tone="danger">Danger</Badge>
            </div>
            <div className="mt-5 grid gap-3">
              <div className="space-y-2">
                <Label htmlFor="ds-input">Input</Label>
                <Input id="ds-input" defaultValue="AED payment rail" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ds-select">Routing preference</Label>
                <Select id="ds-select" defaultValue="privacy">
                  <option value="smart">Smart</option>
                  <option value="privacy">Privacy first</option>
                  <option value="cost">Lowest cost</option>
                </Select>
              </div>
            </div>
          </Card>

          <div className="grid gap-4">
            <AmountDisplay label="Financial amount" value="AED 842,000.00" detail="Tabular numerals and optional masking." masked />
            <TransactionCard {...transactionFeed[0]} />
          </div>
        </div>

        <Card dir="rtl">
          <CardHeader>
            <CardTitle>RTL example</CardTitle>
            <CardDescription>
              Layout should remain stable when rendered right-to-left for Arabic operations teams.
            </CardDescription>
          </CardHeader>
          <div className="grid gap-3 sm:grid-cols-3">
            {["حالة التسوية", "مزود الدفع", "مراجعة الخصوصية"].map((item) => (
              <div key={item} className="rounded-[var(--radius-control)] border border-border bg-surface-soft p-4 text-sm font-semibold">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
