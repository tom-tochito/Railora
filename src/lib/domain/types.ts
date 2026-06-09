export type Role = "buyer" | "seller" | "business_admin" | "platform_admin";

export type BusinessType =
  | "mainland_llc"
  | "free_zone"
  | "freelancer"
  | "sole_establishment"
  | "foreign_supplier";

export type VerificationStatus =
  | "pending"
  | "verified"
  | "failed"
  | "requires_review";

export type VerificationCheckType =
  | "uae_pass_identity"
  | "business_licence"
  | "trn_vat"
  | "bank_account"
  | "beneficial_owner"
  | "sanctions_pep";

export type DocumentType =
  | "pro_forma_invoice"
  | "purchase_order"
  | "delivery_note"
  | "trade_licence"
  | "emirates_id"
  | "proof_of_delivery";

export type EscrowState =
  | "draft"
  | "awaiting_counterparty"
  | "awaiting_verification"
  | "awaiting_funding"
  | "funded"
  | "in_progress"
  | "proof_submitted"
  | "release_requested"
  | "released"
  | "disputed"
  | "partially_released"
  | "refunded"
  | "cancelled"
  | "frozen";

export type MilestoneStatus =
  | "pending"
  | "funded"
  | "in_progress"
  | "proof_submitted"
  | "approved"
  | "released"
  | "disputed";

export type LedgerAccount =
  | "buyer_cash_clearing"
  | "escrow_liability"
  | "seller_payable"
  | "platform_fee_revenue"
  | "refund_payable";

export type LedgerDirection = "debit" | "credit";

export type PaymentStatus =
  | "sandbox_pending"
  | "sandbox_authorized"
  | "sandbox_captured"
  | "sandbox_failed"
  | "sandbox_refunded";

export type InvoiceStatus = "draft" | "sent" | "escrow_created" | "paid";

export type DisputeStatus = "open" | "under_review" | "resolved";

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: Role;
  businessId: string;
  avatarInitials: string;
}

export interface Business {
  id: string;
  legalName: string;
  displayName: string;
  type: BusinessType;
  emirate: "Dubai" | "Abu Dhabi" | "Sharjah" | "Ras Al Khaimah";
  licenceNumber: string;
  trn: string;
  bankIbanLast4: string;
  tradeScore: number;
  verificationStatus: VerificationStatus;
}

export interface BusinessMember {
  id: string;
  userId: string;
  businessId: string;
  role: Role;
}

export interface VerificationCheck {
  id: string;
  businessId: string;
  type: VerificationCheckType;
  label: string;
  status: VerificationStatus;
  checkedAt: string;
  notes: string;
}

export interface DocumentRecord {
  id: string;
  businessId: string;
  orderId?: string;
  type: DocumentType;
  fileName: string;
  storageKey: string;
  status: VerificationStatus;
  uploadedAt: string;
}

export interface Counterparty {
  id: string;
  businessId: string;
  name: string;
  email: string;
  mobile: string;
  tradeScore: number;
  verificationStatus: VerificationStatus;
}

export interface OrderMilestone {
  id: string;
  orderId: string;
  title: string;
  amountFils: number;
  dueDate: string;
  status: MilestoneStatus;
}

export interface EscrowOrder {
  id: string;
  reference: string;
  buyerBusinessId: string;
  sellerBusinessId: string;
  title: string;
  description: string;
  category: string;
  amountFils: number;
  vatFils: number;
  feeFils: number;
  deliveryLocation: string;
  dueDate: string;
  state: EscrowState;
  createdAt: string;
  riskLevel: "low" | "medium" | "high";
  frozen: boolean;
}

export interface EscrowAccount {
  id: string;
  orderId: string;
  balanceFils: number;
  currency: "AED";
  status: "open" | "released" | "refunded" | "frozen";
}

export interface Payment {
  id: string;
  orderId: string;
  provider: "railora_sandbox";
  status: PaymentStatus;
  amountFils: number;
  providerReference: string;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  transactionId: string;
  account: LedgerAccount;
  debitFils: number;
  creditFils: number;
  memo: string;
}

export interface LedgerTransaction {
  id: string;
  referenceId: string;
  type: "funding" | "release" | "refund" | "fee" | "reconciliation";
  createdAt: string;
  entries: LedgerEntry[];
}

export interface Invoice {
  id: string;
  number: string;
  businessId: string;
  counterpartyId: string;
  status: InvoiceStatus;
  amountFils: number;
  vatFils: number;
  dueDate: string;
  eInvoiceReady: boolean;
}

export interface DisputeMessage {
  id: string;
  disputeId: string;
  author: string;
  role: Role;
  body: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  reason: string;
  status: DisputeStatus;
  proposedResolution:
    | "release"
    | "partial_release"
    | "refund"
    | "manual_review";
  openedAt: string;
}

export interface RiskScore {
  id: string;
  businessId: string;
  orderId?: string;
  score: number;
  level: "low" | "medium" | "high";
  factors: string[];
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  metadata: Record<string, string | number | boolean>;
}

export interface Notification {
  id: string;
  userId: string;
  channel: "email" | "sms" | "in_app";
  title: string;
  status: "queued" | "sent" | "failed";
  createdAt: string;
}
