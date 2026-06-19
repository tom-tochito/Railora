import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { riskTone } from "@/lib/data/railora-one";
import { formatAED } from "@/lib/domain/money";

export function SettlementBatchCard({
  id,
  provider,
  currency,
  gross,
  fees,
  refunds,
  reserve,
  expectedArrival,
  status,
}: {
  id: string;
  provider: string;
  currency: string;
  gross: number;
  fees: number;
  refunds: number;
  reserve: number;
  expectedArrival: string;
  status: string;
}) {
  const net = gross - fees - refunds - reserve;

  return (
    <Card className="space-y-4">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs text-muted">{id}</p>
          <h2 className="mt-1 truncate text-base font-semibold">{provider}</h2>
        </div>
        <Badge tone={riskTone(status)}>{status}</Badge>
      </div>
      <dl className="grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted">Gross</dt>
          <dd className="amount-tabular mt-1 font-semibold">{formatAED(gross)}</dd>
        </div>
        <div>
          <dt className="text-muted">Fees/refunds/reserve</dt>
          <dd className="amount-tabular mt-1 font-semibold">
            {formatAED(fees + refunds + reserve)}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Net {currency}</dt>
          <dd className="amount-tabular mt-1 font-semibold">{formatAED(net)}</dd>
        </div>
      </dl>
      <p className="text-sm text-muted">Expected arrival {expectedArrival}</p>
    </Card>
  );
}
