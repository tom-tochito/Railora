import {
  auditEvents,
  businesses,
  documents,
  invoices,
  ledgerTransactions,
  orders,
  riskScores,
  users,
} from "../src/lib/data/seed";

const summary = {
  users: users.length,
  businesses: businesses.length,
  orders: orders.length,
  invoices: invoices.length,
  documents: documents.length,
  riskScores: riskScores.length,
  ledgerTransactions: ledgerTransactions.length,
  auditEvents: auditEvents.length,
};

console.log(JSON.stringify(summary, null, 2));
