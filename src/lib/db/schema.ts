import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  mobile: text("mobile").notNull(),
  role: text("role").notNull(),
  businessId: text("business_id").notNull(),
  createdAt: text("created_at").notNull(),
});

export const businesses = sqliteTable("businesses", {
  id: text("id").primaryKey(),
  legalName: text("legal_name").notNull(),
  displayName: text("display_name").notNull(),
  type: text("type").notNull(),
  emirate: text("emirate").notNull(),
  licenceNumber: text("licence_number").notNull().unique(),
  trn: text("trn").notNull(),
  bankIbanLast4: text("bank_iban_last4").notNull(),
  tradeScore: integer("trade_score").notNull(),
  verificationStatus: text("verification_status").notNull(),
  createdAt: text("created_at").notNull(),
});

export const businessMembers = sqliteTable(
  "business_members",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    businessId: text("business_id").notNull(),
    role: text("role").notNull(),
  },
  (table) => [
    index("business_members_user_idx").on(table.userId),
    index("business_members_business_idx").on(table.businessId),
  ],
);

export const verificationChecks = sqliteTable(
  "verification_checks",
  {
    id: text("id").primaryKey(),
    businessId: text("business_id").notNull(),
    type: text("type").notNull(),
    status: text("status").notNull(),
    checkedAt: text("checked_at").notNull(),
    notes: text("notes").notNull(),
  },
  (table) => [index("verification_business_idx").on(table.businessId)],
);

export const documents = sqliteTable(
  "documents",
  {
    id: text("id").primaryKey(),
    businessId: text("business_id").notNull(),
    orderId: text("order_id"),
    type: text("type").notNull(),
    fileName: text("file_name").notNull(),
    storageKey: text("storage_key").notNull(),
    status: text("status").notNull(),
    uploadedAt: text("uploaded_at").notNull(),
  },
  (table) => [
    index("documents_business_idx").on(table.businessId),
    index("documents_order_idx").on(table.orderId),
  ],
);

export const counterparties = sqliteTable(
  "counterparties",
  {
    id: text("id").primaryKey(),
    businessId: text("business_id").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    mobile: text("mobile").notNull(),
    tradeScore: integer("trade_score").notNull(),
    verificationStatus: text("verification_status").notNull(),
  },
  (table) => [index("counterparty_business_idx").on(table.businessId)],
);

export const orders = sqliteTable(
  "orders",
  {
    id: text("id").primaryKey(),
    reference: text("reference").notNull().unique(),
    buyerBusinessId: text("buyer_business_id").notNull(),
    sellerBusinessId: text("seller_business_id").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    amountFils: integer("amount_fils").notNull(),
    vatFils: integer("vat_fils").notNull(),
    feeFils: integer("fee_fils").notNull(),
    deliveryLocation: text("delivery_location").notNull(),
    dueDate: text("due_date").notNull(),
    state: text("state").notNull(),
    riskLevel: text("risk_level").notNull(),
    frozen: integer("frozen", { mode: "boolean" }).notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("orders_buyer_idx").on(table.buyerBusinessId),
    index("orders_seller_idx").on(table.sellerBusinessId),
    index("orders_state_idx").on(table.state),
  ],
);

export const orderMilestones = sqliteTable(
  "order_milestones",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id").notNull(),
    title: text("title").notNull(),
    amountFils: integer("amount_fils").notNull(),
    dueDate: text("due_date").notNull(),
    status: text("status").notNull(),
  },
  (table) => [index("milestones_order_idx").on(table.orderId)],
);

export const escrowAccounts = sqliteTable(
  "escrow_accounts",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id").notNull(),
    balanceFils: integer("balance_fils").notNull(),
    currency: text("currency").notNull(),
    status: text("status").notNull(),
  },
  (table) => [index("escrow_accounts_order_idx").on(table.orderId)],
);

export const payments = sqliteTable(
  "payments",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id").notNull(),
    provider: text("provider").notNull(),
    status: text("status").notNull(),
    amountFils: integer("amount_fils").notNull(),
    providerReference: text("provider_reference").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("payments_order_idx").on(table.orderId)],
);

export const ledgerTransactions = sqliteTable(
  "ledger_transactions",
  {
    id: text("id").primaryKey(),
    referenceId: text("reference_id").notNull(),
    type: text("type").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("ledger_reference_idx").on(table.referenceId)],
);

export const ledgerEntries = sqliteTable(
  "ledger_entries",
  {
    id: text("id").primaryKey(),
    transactionId: text("transaction_id").notNull(),
    account: text("account").notNull(),
    debitFils: integer("debit_fils").notNull(),
    creditFils: integer("credit_fils").notNull(),
    memo: text("memo").notNull(),
  },
  (table) => [
    index("ledger_entries_transaction_idx").on(table.transactionId),
    index("ledger_entries_account_idx").on(table.account),
  ],
);

export const invoices = sqliteTable(
  "invoices",
  {
    id: text("id").primaryKey(),
    number: text("number").notNull().unique(),
    businessId: text("business_id").notNull(),
    counterpartyId: text("counterparty_id").notNull(),
    status: text("status").notNull(),
    amountFils: integer("amount_fils").notNull(),
    vatFils: integer("vat_fils").notNull(),
    dueDate: text("due_date").notNull(),
    eInvoiceReady: integer("e_invoice_ready", { mode: "boolean" }).notNull(),
  },
  (table) => [index("invoices_business_idx").on(table.businessId)],
);

export const disputes = sqliteTable(
  "disputes",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id").notNull(),
    reason: text("reason").notNull(),
    status: text("status").notNull(),
    proposedResolution: text("proposed_resolution").notNull(),
    openedAt: text("opened_at").notNull(),
  },
  (table) => [index("disputes_order_idx").on(table.orderId)],
);

export const disputeMessages = sqliteTable(
  "dispute_messages",
  {
    id: text("id").primaryKey(),
    disputeId: text("dispute_id").notNull(),
    author: text("author").notNull(),
    role: text("role").notNull(),
    body: text("body").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("dispute_messages_dispute_idx").on(table.disputeId)],
);

export const riskScores = sqliteTable(
  "risk_scores",
  {
    id: text("id").primaryKey(),
    businessId: text("business_id").notNull(),
    orderId: text("order_id"),
    score: integer("score").notNull(),
    level: text("level").notNull(),
    factorsJson: text("factors_json").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    index("risk_scores_business_idx").on(table.businessId),
    index("risk_scores_order_idx").on(table.orderId),
  ],
);

export const auditEvents = sqliteTable(
  "audit_events",
  {
    id: text("id").primaryKey(),
    actor: text("actor").notNull(),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    metadataJson: text("metadata_json").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("audit_entity_idx").on(table.entityType, table.entityId)],
);

export const notifications = sqliteTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    channel: text("channel").notNull(),
    title: text("title").notNull(),
    status: text("status").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("notifications_user_idx").on(table.userId)],
);
