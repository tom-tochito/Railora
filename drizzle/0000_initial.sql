CREATE TABLE users (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mobile TEXT NOT NULL,
  role TEXT NOT NULL,
  business_id TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE businesses (
  id TEXT PRIMARY KEY NOT NULL,
  legal_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  type TEXT NOT NULL,
  emirate TEXT NOT NULL,
  licence_number TEXT NOT NULL UNIQUE,
  trn TEXT NOT NULL,
  bank_iban_last4 TEXT NOT NULL,
  trade_score INTEGER NOT NULL,
  verification_status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE business_members (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  role TEXT NOT NULL
);

CREATE TABLE verification_checks (
  id TEXT PRIMARY KEY NOT NULL,
  business_id TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  checked_at TEXT NOT NULL,
  notes TEXT NOT NULL
);

CREATE TABLE documents (
  id TEXT PRIMARY KEY NOT NULL,
  business_id TEXT NOT NULL,
  order_id TEXT,
  type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  status TEXT NOT NULL,
  uploaded_at TEXT NOT NULL
);

CREATE TABLE counterparties (
  id TEXT PRIMARY KEY NOT NULL,
  business_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  trade_score INTEGER NOT NULL,
  verification_status TEXT NOT NULL
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY NOT NULL,
  reference TEXT NOT NULL UNIQUE,
  buyer_business_id TEXT NOT NULL,
  seller_business_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  amount_fils INTEGER NOT NULL,
  vat_fils INTEGER NOT NULL,
  fee_fils INTEGER NOT NULL,
  delivery_location TEXT NOT NULL,
  due_date TEXT NOT NULL,
  state TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  frozen INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE order_milestones (
  id TEXT PRIMARY KEY NOT NULL,
  order_id TEXT NOT NULL,
  title TEXT NOT NULL,
  amount_fils INTEGER NOT NULL,
  due_date TEXT NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE escrow_accounts (
  id TEXT PRIMARY KEY NOT NULL,
  order_id TEXT NOT NULL,
  balance_fils INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE payments (
  id TEXT PRIMARY KEY NOT NULL,
  order_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT NOT NULL,
  amount_fils INTEGER NOT NULL,
  provider_reference TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE ledger_transactions (
  id TEXT PRIMARY KEY NOT NULL,
  reference_id TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE ledger_entries (
  id TEXT PRIMARY KEY NOT NULL,
  transaction_id TEXT NOT NULL,
  account TEXT NOT NULL,
  debit_fils INTEGER NOT NULL,
  credit_fils INTEGER NOT NULL,
  memo TEXT NOT NULL
);

CREATE TABLE invoices (
  id TEXT PRIMARY KEY NOT NULL,
  number TEXT NOT NULL UNIQUE,
  business_id TEXT NOT NULL,
  counterparty_id TEXT NOT NULL,
  status TEXT NOT NULL,
  amount_fils INTEGER NOT NULL,
  vat_fils INTEGER NOT NULL,
  due_date TEXT NOT NULL,
  e_invoice_ready INTEGER NOT NULL
);

CREATE TABLE disputes (
  id TEXT PRIMARY KEY NOT NULL,
  order_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL,
  proposed_resolution TEXT NOT NULL,
  opened_at TEXT NOT NULL
);

CREATE TABLE dispute_messages (
  id TEXT PRIMARY KEY NOT NULL,
  dispute_id TEXT NOT NULL,
  author TEXT NOT NULL,
  role TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE risk_scores (
  id TEXT PRIMARY KEY NOT NULL,
  business_id TEXT NOT NULL,
  order_id TEXT,
  score INTEGER NOT NULL,
  level TEXT NOT NULL,
  factors_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE audit_events (
  id TEXT PRIMARY KEY NOT NULL,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE notifications (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  channel TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
