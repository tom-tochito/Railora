import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { riskTone } from "@/lib/data/railora-one";

export function RiskWorkQueue({
  items,
}: {
  items: Array<{ id: string; title: string; detail: string; state: string; sla: string }>;
}) {
  return (
    <Card>
      <h2 className="text-base font-semibold">Operations work queue</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid min-w-0 gap-3 rounded-[var(--radius-control)] border border-border bg-surface-soft p-3 sm:grid-cols-[1fr_auto]"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{item.title}</p>
              <p className="mt-1 truncate text-xs text-muted">{item.detail}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={riskTone(item.state)}>{item.state}</Badge>
              <span className="text-xs font-semibold text-muted">{item.sla}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
