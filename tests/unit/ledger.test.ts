import { describe, expect, it } from "vitest";
import {
  assertBalanced,
  buildFundingLedger,
  createLedgerTransaction,
  LedgerBalanceError,
} from "@/lib/domain/ledger";
import { orders } from "@/lib/data/seed";

describe("ledger balancing", () => {
  it("creates balanced funding transactions", () => {
    const transaction = buildFundingLedger(orders[0]);
    const debits = transaction.entries.reduce(
      (sum, entry) => sum + entry.debitFils,
      0,
    );
    const credits = transaction.entries.reduce(
      (sum, entry) => sum + entry.creditFils,
      0,
    );

    expect(debits).toBe(credits);
    expect(() => assertBalanced(transaction.entries)).not.toThrow();
  });

  it("rejects unbalanced ledger writes", () => {
    expect(() =>
      createLedgerTransaction({
        id: "bad-ledger",
        referenceId: "ord-test",
        type: "funding",
        entries: [
          {
            id: "one",
            account: "buyer_cash_clearing",
            debitFils: 100,
            creditFils: 0,
            memo: "bad debit",
          },
          {
            id: "two",
            account: "escrow_liability",
            debitFils: 0,
            creditFils: 90,
            memo: "bad credit",
          },
        ],
      }),
    ).toThrow(LedgerBalanceError);
  });
});
