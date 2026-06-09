import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { businesses, riskScores } from "@/lib/data/seed";
import { percent } from "@/lib/domain/money";

const breakdown = [
  ["Completed orders", 88, "Successful release and refund history"],
  ["On-time delivery", 82, "Milestones completed before due date"],
  ["Dispute rate", 74, "Disputes weighted by value and recency"],
  ["Refund behaviour", 91, "Refund outcomes and cooperative resolution"],
  ["Verification depth", 95, "UAE PASS, DUL, TRN, bank and BO checks"],
  ["Repeat counterparties", 78, "Trust from recurring buyer/seller pairs"],
];

export default function ScorePage() {
  const business = businesses[0];

  return (
    <AppShell>
      <div className="mb-6">
        <Badge tone="brand">Trade score</Badge>
        <h1 className="mt-3 text-3xl font-semibold">
          {business.displayName} · score {business.tradeScore}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Explainable SME trade score built from verification depth, order
          outcomes, dispute behaviour, refunds, and repeat counterparties.
        </p>
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[1fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>Score breakdown</CardTitle>
            <CardDescription>
              Percentages are demonstrative and not a regulated credit score.
            </CardDescription>
          </CardHeader>
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
                <div className="mt-2 h-2 rounded-full bg-surface-soft">
                  <div
                    className="h-full rounded-full bg-brand"
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
                Railora scores increase when businesses complete verified
                escrows, release funds on time, upload consistent evidence, and
                trade repeatedly with verified counterparties.
              </p>
              <p>
                Scores decrease when disputes are frequent, refunds are delayed,
                verification remains shallow, or document checks require review.
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
                  <p className="mt-2 break-words text-xs text-muted">
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
