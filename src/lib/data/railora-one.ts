import {
  businesses,
  getOrderParties,
  invoices,
  orders,
  payments,
  riskScores,
} from "@/lib/data/seed";
import { formatAED } from "@/lib/domain/money";

const settledStates = new Set(["released", "refunded"]);

export const providerHealth = [
  {
    id: "stripe-mena",
    name: "Stripe MENA",
    rail: "Cards",
    status: "healthy",
    successRate: 98.7,
    authorizationMs: 420,
    costBps: 148,
    privacyFields: 4,
  },
  {
    id: "magnati",
    name: "Magnati",
    rail: "Cards",
    status: "degraded",
    successRate: 93.8,
    authorizationMs: 710,
    costBps: 132,
    privacyFields: 5,
  },
  {
    id: "aani",
    name: "Aani instant",
    rail: "Instant transfer",
    status: "healthy",
    successRate: 99.1,
    authorizationMs: 180,
    costBps: 22,
    privacyFields: 2,
  },
  {
    id: "network-intl",
    name: "Network International",
    rail: "Cards",
    status: "review",
    successRate: 96.2,
    authorizationMs: 540,
    costBps: 140,
    privacyFields: 4,
  },
];

export const railMapRules = [
  {
    id: "rule-smart-aed",
    name: "AED smart acceptance",
    state: "active",
    condition:
      "If currency is AED and provider health is good, route cards through Stripe MENA; otherwise fall back to Network International.",
    impact: "+2.1% expected success",
  },
  {
    id: "rule-privacy-first",
    name: "Privacy-first transfers",
    state: "review",
    condition:
      "If customer detail sharing exceeds three fields, prefer Aani instant where available before card providers.",
    impact: "-36% identifying fields shared",
  },
  {
    id: "rule-cost-guardrail",
    name: "Cost guardrail",
    state: "draft",
    condition:
      "If estimated provider cost is above 150 bps, simulate lowest-cost backup before authorization.",
    impact: "AED 18,420 monthly savings forecast",
  },
];

export const settlementBatches = [
  {
    id: "set-2026-0618-aed",
    provider: "Aani instant",
    currency: "AED",
    gross: 487_400_00,
    fees: 18_200_00,
    refunds: 7_000_00,
    reserve: 42_000_00,
    expectedArrival: "2026-06-19",
    status: "matched",
  },
  {
    id: "set-2026-0618-card",
    provider: "Stripe MENA",
    currency: "AED",
    gross: 318_900_00,
    fees: 21_460_00,
    refunds: 4_200_00,
    reserve: 31_000_00,
    expectedArrival: "2026-06-20",
    status: "two items need review",
  },
  {
    id: "set-2026-0617-card",
    provider: "Magnati",
    currency: "AED",
    gross: 224_100_00,
    fees: 15_880_00,
    refunds: 12_500_00,
    reserve: 24_000_00,
    expectedArrival: "2026-06-18",
    status: "received",
  },
];

export const payoutBatches = [
  {
    id: "po-8842",
    name: "Marketplace seller payouts",
    total: 214_500_00,
    beneficiaries: 48,
    methods: "Bank transfer, wallet",
    approval: "Needs second approval",
    successRate: 97.9,
    failedItems: 2,
    privacy: "Restricted",
  },
  {
    id: "po-8843",
    name: "Supplier settlement run",
    total: 128_750_00,
    beneficiaries: 12,
    methods: "Instant transfer",
    approval: "Ready",
    successRate: 99.4,
    failedItems: 0,
    privacy: "Standard",
  },
];

export const beneficiaries = [
  {
    id: "ben-001",
    name: "Jebel Ali Packaging",
    method: "AED bank account",
    maskedAccount: "AE••••0934",
    status: "verified",
  },
  {
    id: "ben-002",
    name: "Desert Cloud",
    method: "Instant transfer",
    maskedAccount: "AE••••0122",
    status: "verified",
  },
  {
    id: "ben-003",
    name: "Mina Logistics",
    method: "Wallet",
    maskedAccount: "+971••••7777",
    status: "requires review",
  },
];

export const apiKeys = [
  {
    id: "key-live-01",
    name: "Live collections API",
    prefix: "rl_live_8K2",
    scopes: "payments:write, webhooks:read",
    lastUsed: "11 minutes ago",
    privacyScope: "Customer name, masked contact",
    environment: "Live",
  },
  {
    id: "key-sandbox-01",
    name: "Sandbox simulator",
    prefix: "rl_test_4Qa",
    scopes: "payments:write, routing:simulate",
    lastUsed: "Today",
    privacyScope: "Synthetic data only",
    environment: "Sandbox",
  },
];

export const webhookEvents = [
  {
    id: "evt-001",
    endpoint: "https://merchant.example/webhooks/railora",
    event: "payment.received",
    status: "delivered",
    latencyMs: 320,
    fields: "3 identifying fields",
  },
  {
    id: "evt-002",
    endpoint: "https://ops.example/hooks/settlement",
    event: "settlement.matched",
    status: "retrying",
    latencyMs: 1480,
    fields: "No customer fields",
  },
  {
    id: "evt-003",
    endpoint: "https://risk.example/cases",
    event: "risk.review_required",
    status: "delivered",
    latencyMs: 510,
    fields: "Merchant and transaction reference",
  },
];

export const privacyScopes = [
  {
    id: "privacy-provider",
    name: "Provider data sharing",
    status: "Masked by default",
    detail: "Providers receive only the fields required for the selected rail.",
    fields: 3,
  },
  {
    id: "privacy-webhooks",
    name: "Webhook field controls",
    status: "Scoped endpoints",
    detail: "Each webhook endpoint declares the fields it is permitted to receive.",
    fields: 2,
  },
  {
    id: "privacy-ops",
    name: "Operations reveal controls",
    status: "Role gated",
    detail: "Sensitive customer and beneficiary values require explicit reveal intent.",
    fields: 5,
  },
];

export const volumeTrend = [
  42, 38, 51, 47, 63, 55, 71, 66, 82, 74, 79, 91, 86, 104,
];

export const successTrend = [
  96.2, 97.1, 96.6, 98.0, 97.4, 98.4, 98.0, 98.7, 98.2, 99.0, 98.6, 99.1,
];

export const settlementTrend = [58, 64, 49, 72, 66, 81, 77, 92, 88];

export const analyticsSummary = [
  ["Payment volume", "AED 8.42M", "+12.4%"],
  ["Success rate", "98.1%", "+1.8%"],
  ["Provider cost", "1.21%", "-0.18%"],
  ["Recovered payments", "AED 142K", "+8.6%"],
  ["Privacy exposure", "Low", "3 fields avg"],
];

export const railoraOneSummary = {
  activeVolumeFils: orders.reduce((sum, order) => sum + order.amountFils + order.vatFils, 0),
  availableBalanceFils: orders
    .filter((order) => !settledStates.has(order.state))
    .reduce((sum, order) => sum + order.amountFils + order.vatFils, 0),
  pendingSettlementFils: settlementBatches.reduce((sum, batch) => sum + batch.gross - batch.fees - batch.refunds - batch.reserve, 0),
  failedPayments: payments.filter((payment) => payment.status === "sandbox_failed").length + 2,
  successRate: "98.1%",
  recoveredFils: 142_000_00,
};

export const transactionFeed = orders.map((order, index) => {
  const parties = getOrderParties(order);
  const payment = payments.find((item) => item.orderId === order.id);
  const provider = providerHealth[index % providerHealth.length];

  return {
    id: order.id,
    reference: payment?.providerReference ?? order.reference,
    title: order.title,
    merchant: parties.seller?.displayName ?? "Invited merchant",
    customer: parties.buyer?.displayName ?? "Customer",
    amount: formatAED(order.amountFils + order.vatFils),
    amountFils: order.amountFils + order.vatFils,
    status: order.state.replaceAll("_", " "),
    rail: provider.rail,
    provider: provider.name,
    currency: "AED",
    time: order.createdAt.slice(0, 10),
    privacy: provider.privacyFields <= 3 ? "Low exposure" : "Review sharing",
    risk: order.riskLevel,
  };
});

export const commandItems = [
  { id: "create-payment", label: "Create payment", href: "/escrow/new", group: "Actions" },
  { id: "create-link", label: "Create payment link", href: "/invoices", group: "Actions" },
  { id: "add-merchant", label: "Add merchant", href: "/merchants", group: "Actions" },
  { id: "add-beneficiary", label: "Add beneficiary", href: "/payouts", group: "Actions" },
  { id: "start-payout", label: "Start payout", href: "/payouts", group: "Actions" },
  { id: "upload-batch", label: "Upload payout batch", href: "/payouts", group: "Actions" },
  { id: "routing-sim", label: "Run routing simulation", href: "/routing", group: "Actions" },
  { id: "reconciliation", label: "Open reconciliation", href: "/settlement", group: "Workspace" },
  { id: "provider-health", label: "View provider health", href: "/routing", group: "Workspace" },
  { id: "privacy-hub", label: "Open Privacy Hub", href: "/privacy", group: "Workspace" },
  ...transactionFeed.map((transaction) => ({
    id: `txn-${transaction.id}`,
    label: `${transaction.reference} · ${transaction.merchant}`,
    href: `/payments?transaction=${transaction.id}`,
    group: "Transactions",
  })),
  ...businesses.map((business) => ({
    id: `merchant-${business.id}`,
    label: business.displayName,
    href: `/merchants?merchant=${business.id}`,
    group: "Merchants",
  })),
  ...invoices.map((invoice) => ({
    id: `invoice-${invoice.id}`,
    label: invoice.number,
    href: "/invoices",
    group: "Invoices",
  })),
  ...apiKeys.map((key) => ({
    id: key.id,
    label: `${key.prefix} · ${key.name}`,
    href: "/developer",
    group: "API keys",
  })),
  ...webhookEvents.map((event) => ({
    id: event.id,
    label: `${event.event} · ${event.status}`,
    href: "/developer",
    group: "Webhooks",
  })),
];

export function riskTone(level: string) {
  if (level.includes("high") || level.includes("review") || level.includes("degraded")) {
    return "danger" as const;
  }

  if (level.includes("medium") || level.includes("pending") || level.includes("retry")) {
    return "warning" as const;
  }

  return "success" as const;
}

export function averageRiskScore() {
  return Math.round(riskScores.reduce((sum, risk) => sum + risk.score, 0) / riskScores.length);
}
