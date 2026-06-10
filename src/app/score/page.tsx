import { Gauge, Repeat2, ShieldCheck, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { InsightMetric } from "@/components/insight-metric";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { businesses, riskScores } from "@/lib/data/seed";
import { percent } from "@/lib/domain/money";

const breakdown = [
  ["Completed orders", 88, "Successful release and refund history"],
  ["On-time delivery", 82, "Milestones completed before due date"],
  ["Dispute rate", 74, "Disputes weighted by value and recency"],
  ["Refund behaviour", 91, "Refund outcomes and cooperative resolution"],
  ["Verification depth", 95, "UAE PASS, DUL, TRN, bank and owner checks"],
  ["Repeat counterparties", 78, "Confidence from recurring buyer/seller pairs"],
];

export default function ScorePage() {
  const business = businesses[0];
  const averageRiskScore = Math.round(
    riskScores.reduce((sum, risk) => sum + risk.score, 0) / riskScores.length,
  );

  return (
    <AppShell>
      <PageHeader
        badge="Trade score"
        title={`${business.displayName} · score ${business.tradeScore}`}
        description="An explainable trust view shaped by verification depth, order outcomes, dispute behavior, refunds, and repeat counterparty history."
      />

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <InsightMetric
          label="Profile score"
          value={business.tradeScore}
          detail="Strong demo posture with room for owner-review completion."
          icon={<Gauge className="size-4" aria-hidden />}
          tone="brand"
        />
        <InsightMetric
          label="Network average"
          value={averageRiskScore}
          detail="Seeded risk examples across low, medium, and high scenarios."
          icon={<TrendingUp className="size-4" aria-hidden />}
          tone="accent"
        />
        <InsightMetric
          label="Verification"
          value={business.verificationStatus.replaceAll("_", " ")}
          detail="Identity, licence, TRN, bank, and owner context stay visible."
          icon={<ShieldCheck className="size-4" aria-hidden />}
          tone="success"
        />
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[1fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>Score breakdown</CardTitle>
            <CardDescription>
              These signals are demonstrative and are not a regulated credit score.
            </CardDescription>
          </CardHeader>
          <div className="mb-6 rounded-lg border border-border bg-ink p-5 text-white">
            <p className="text-xs font-semibold uppercase text-white/60">
              Private confidence profile
            </p>
            <div className="mt-3 flex min-w-0 items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="break-words text-5xl font-semibold">
                  {business.tradeScore}
                </p>
                <p className="mt-2 text-sm text-white/65">
                  Verified buyer profile with repeat trade signals.
                </p>
              </div>
              <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-accent text-ink">
                <Repeat2 className="size-7" aria-hidden />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {breakdown.map(([label, value, detail]) => (
              <div key={String(label)}>
                <div className="flex min-w-0 items-center justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="break-words font-semibold">{label}</p>
                    <p className="mt-1 break-words text-xs text-muted">{detail}</p>
                  </div>
                  <span className="font-semibold">{percent(Number(value))}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-soft">
                  <div
                    className="h-full origin-left rounded-full bg-brand motion-safe:animate-[railora-fill_700ms_ease-out]"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Explainability panel</CardTitle>
            </CardHeader>
            <div className="space-y-3 text-sm leading-6 text-muted">
              <p>
                Railora confidence rises when businesses complete verified
                escrows, release funds on time, upload consistent evidence, and
                build repeat trade with verified counterparties.
              </p>
              <p>
                The profile softens when disputes are frequent, refunds are
                delayed, verification remains shallow, or records require review.
              </p>
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Risk examples</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {riskScores.map((risk) => (
                <div
                  key={risk.id}
                  className="min-w-0 rounded-lg border border-border bg-surface-soft p-4"
                >
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <p className="text-sm font-semibold">Score {risk.score}</p>
                    <Badge
                      tone={
                        risk.level === "high"
                          ? "danger"
                          : risk.level === "medium"
                            ? "warning"
                            : "success"
                      }
                    >
                      {risk.level}
                    </Badge>
                  </div>
                  <p className="mt-2 break-words text-xs leading-5 text-muted">
                    {risk.factors.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
