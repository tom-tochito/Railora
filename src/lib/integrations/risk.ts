export async function runRiskModel(input: {
  businessId: string;
  orderAmountFils?: number;
  hasOpenDispute?: boolean;
}) {
  // TODO: Replace with sanctions, credit, behavioural, and reconciliation signals.
  const score = input.hasOpenDispute
    ? 58
    : input.orderAmountFils && input.orderAmountFils > 100_000_00
      ? 74
      : 88;

  return {
    score,
    level: score < 65 ? "high" : score < 80 ? "medium" : "low",
    factors: [
      "Sandbox licence confidence",
      "Trade history velocity",
      "Dispute and refund behaviour",
    ],
  };
}
