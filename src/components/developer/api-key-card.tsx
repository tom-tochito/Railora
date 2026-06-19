import { Copy, RotateCw, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PrivacyMask } from "@/components/privacy/privacy-mask";

export function ApiKeyCard({
  name,
  prefix,
  scopes,
  lastUsed,
  privacyScope,
  environment,
}: {
  name: string;
  prefix: string;
  scopes: string;
  lastUsed: string;
  privacyScope: string;
  environment: string;
}) {
  return (
    <Card className="space-y-4">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">{name}</h2>
          <p className="mt-1 font-mono text-sm text-muted">
            <PrivacyMask value={`${prefix}_************************`} masked={`${prefix}_****`} label={name} />
          </p>
        </div>
        <Badge tone={environment === "Live" ? "success" : "brand"}>{environment}</Badge>
      </div>
      <p className="text-sm leading-6 text-muted">{scopes}</p>
      <div className="rounded-[var(--radius-control)] border border-privacy/20 bg-privacy-soft p-3 text-sm text-privacy">
        <ShieldCheck className="mr-2 inline size-4" aria-hidden />
        {privacyScope}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" variant="secondary">
          <Copy className="size-4" aria-hidden />
          Copy once
        </Button>
        <Button type="button" size="sm" variant="secondary">
          <RotateCw className="size-4" aria-hidden />
          Rotate
        </Button>
        <span className="text-xs text-muted">Last used {lastUsed}</span>
      </div>
    </Card>
  );
}
