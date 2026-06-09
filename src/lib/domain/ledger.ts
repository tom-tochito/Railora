import type {
  EscrowOrder,
  LedgerAccount,
  LedgerEntry,
  LedgerTransaction,
} from "./types";

export class LedgerBalanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LedgerBalanceError";
  }
}

export function sumDebits(entries: LedgerEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.debitFils, 0);
}

export function sumCredits(entries: LedgerEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.creditFils, 0);
}

export function assertBalanced(entries: LedgerEntry[]): void {
  if (entries.length < 2) {
    throw new LedgerBalanceError("A ledger transaction needs at least two entries");
  }

  for (const entry of entries) {
    if (entry.debitFils < 0 || entry.creditFils < 0) {
      throw new LedgerBalanceError("Ledger entries cannot be negative");
    }

    if (entry.debitFils > 0 && entry.creditFils > 0) {
      throw new LedgerBalanceError("A ledger entry cannot be both debit and credit");
    }
  }

  if (sumDebits(entries) !== sumCredits(entries)) {
    throw new LedgerBalanceError("Debits must equal credits");
  }
}

export function createLedgerTransaction(input: {
  id: string;
  referenceId: string;
  type: LedgerTransaction["type"];
  createdAt?: string;
  entries: Omit<LedgerEntry, "transactionId">[];
}): LedgerTransaction {
  const entries = input.entries.map((entry) => ({
    ...entry,
    transactionId: input.id,
  }));

  assertBalanced(entries);

  return {
    id: input.id,
    referenceId: input.referenceId,
    type: input.type,
    createdAt: input.createdAt ?? new Date().toISOString(),
    entries,
  };
}

function entry(
  id: string,
  account: LedgerAccount,
  debitFils: number,
  creditFils: number,
  memo: string,
): Omit<LedgerEntry, "transactionId"> {
  return { id, account, debitFils, creditFils, memo };
}

export function buildFundingLedger(order: EscrowOrder): LedgerTransaction {
  const totalDebit = order.amountFils + order.vatFils + order.feeFils;

  return createLedgerTransaction({
    id: `ltx-fund-${order.id}`,
    referenceId: order.id,
    type: "funding",
    entries: [
      entry(
        `le-${order.id}-buyer-cash`,
        "buyer_cash_clearing",
        totalDebit,
        0,
        "Sandbox buyer cash clearing debit",
      ),
      entry(
        `le-${order.id}-escrow`,
        "escrow_liability",
        0,
        order.amountFils + order.vatFils,
        "Escrow liability for funded order",
      ),
      entry(
        `le-${order.id}-fee`,
        "platform_fee_revenue",
        0,
        order.feeFils,
        "Railora sandbox platform fee",
      ),
    ],
  });
}

export function buildReleaseLedger(order: EscrowOrder): LedgerTransaction {
  return createLedgerTransaction({
    id: `ltx-release-${order.id}`,
    referenceId: order.id,
    type: "release",
    entries: [
      entry(
        `le-${order.id}-liability-release`,
        "escrow_liability",
        order.amountFils + order.vatFils,
        0,
        "Reduce escrow liability on approval",
      ),
      entry(
        `le-${order.id}-seller-payable`,
        "seller_payable",
        0,
        order.amountFils + order.vatFils,
        "Sandbox seller payable",
      ),
    ],
  });
}

export function buildRefundLedger(order: EscrowOrder): LedgerTransaction {
  return createLedgerTransaction({
    id: `ltx-refund-${order.id}`,
    referenceId: order.id,
    type: "refund",
    entries: [
      entry(
        `le-${order.id}-liability-refund`,
        "escrow_liability",
        order.amountFils + order.vatFils,
        0,
        "Reduce escrow liability for buyer refund",
      ),
      entry(
        `le-${order.id}-refund-payable`,
        "refund_payable",
        0,
        order.amountFils + order.vatFils,
        "Sandbox buyer refund payable",
      ),
    ],
  });
}
