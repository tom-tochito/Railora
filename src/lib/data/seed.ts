import {
  buildFundingLedger,
  buildRefundLedger,
  buildReleaseLedger,
} from "@/lib/domain/ledger";
import {
  calculatePlatformFeeFils,
  calculateVatFils,
  parseAEDToFils,
} from "@/lib/domain/money";
import type {
  AuditEvent,
  Business,
  BusinessMember,
  Counterparty,
  Dispute,
  DisputeMessage,
  DocumentRecord,
  EscrowAccount,
  EscrowOrder,
  Invoice,
  LedgerTransaction,
  Notification,
  OrderMilestone,
  Payment,
  RiskScore,
  User,
  VerificationCheck,
} from "@/lib/domain/types";

const now = "2026-06-09T12:00:00.000Z";

export const businesses: Business[] = [
  {
    id: "biz-buyer-1",
    legalName: "Al Noor Retail Trading LLC",
    displayName: "Al Noor Retail",
    type: "mainland_llc",
    emirate: "Dubai",
    licenceNumber: "DED-884219",
    trn: "100482019300003",
    bankIbanLast4: "4821",
    tradeScore: 87,
    verificationStatus: "verified",
  },
  {
    id: "biz-buyer-2",
    legalName: "Gulf Clinics Procurement FZCO",
    displayName: "Gulf Clinics",
    type: "free_zone",
    emirate: "Dubai",
    licenceNumber: "DIFC-552901",
    trn: "100552901100003",
    bankIbanLast4: "1901",
    tradeScore: 78,
    verificationStatus: "verified",
  },
  {
    id: "biz-buyer-3",
    legalName: "Palm Media Ventures Sole Establishment",
    displayName: "Palm Media",
    type: "sole_establishment",
    emirate: "Abu Dhabi",
    licenceNumber: "ADDED-671244",
    trn: "100671244200003",
    bankIbanLast4: "7244",
    tradeScore: 71,
    verificationStatus: "requires_review",
  },
  {
    id: "biz-seller-1",
    legalName: "Jebel Ali Packaging FZE",
    displayName: "Jebel Ali Packaging",
    type: "free_zone",
    emirate: "Dubai",
    licenceNumber: "JAFZA-110934",
    trn: "100110934800003",
    bankIbanLast4: "0934",
    tradeScore: 91,
    verificationStatus: "verified",
  },
  {
    id: "biz-seller-2",
    legalName: "Desert Cloud Software Services LLC",
    displayName: "Desert Cloud",
    type: "mainland_llc",
    emirate: "Dubai",
    licenceNumber: "DED-440122",
    trn: "100440122100003",
    bankIbanLast4: "0122",
    tradeScore: 83,
    verificationStatus: "verified",
  },
  {
    id: "biz-seller-3",
    legalName: "Mina Logistics Brokerage Freelancer",
    displayName: "Mina Logistics",
    type: "freelancer",
    emirate: "Sharjah",
    licenceNumber: "SHAMS-993102",
    trn: "100993102700003",
    bankIbanLast4: "3102",
    tradeScore: 64,
    verificationStatus: "pending",
  },
];

export const users: User[] = [
  {
    id: "user-buyer-1",
    name: "Mariam Al Farsi",
    email: "mariam@alnoor.example",
    mobile: "+971501112233",
    role: "buyer",
    businessId: "biz-buyer-1",
    avatarInitials: "MA",
  },
  {
    id: "user-buyer-2",
    name: "Omar Rahman",
    email: "omar@gulfclinics.example",
    mobile: "+971522223344",
    role: "buyer",
    businessId: "biz-buyer-2",
    avatarInitials: "OR",
  },
  {
    id: "user-buyer-3",
    name: "Leila Haddad",
    email: "leila@palmmedia.example",
    mobile: "+971543334455",
    role: "business_admin",
    businessId: "biz-buyer-3",
    avatarInitials: "LH",
  },
  {
    id: "user-seller-1",
    name: "Saeed Mansoor",
    email: "saeed@jebelpack.example",
    mobile: "+971554445566",
    role: "seller",
    businessId: "biz-seller-1",
    avatarInitials: "SM",
  },
  {
    id: "user-seller-2",
    name: "Nadia Chen",
    email: "nadia@desertcloud.example",
    mobile: "+971566667788",
    role: "seller",
    businessId: "biz-seller-2",
    avatarInitials: "NC",
  },
  {
    id: "user-seller-3",
    name: "Faisal Khan",
    email: "faisal@minalogistics.example",
    mobile: "+971588887777",
    role: "seller",
    businessId: "biz-seller-3",
    avatarInitials: "FK",
  },
  {
    id: "user-admin-1",
    name: "Aisha Merchant",
    email: "risk@railora.example",
    mobile: "+971599991111",
    role: "platform_admin",
    businessId: "biz-buyer-1",
    avatarInitials: "AM",
  },
];

export const businessMembers: BusinessMember[] = users.map((user) => ({
  id: `member-${user.id}`,
  userId: user.id,
  businessId: user.businessId,
  role: user.role,
}));

export const counterparties: Counterparty[] = businesses.map((business) => ({
  id: `cp-${business.id}`,
  businessId: business.id,
  name: business.displayName,
  email: `trade@${business.displayName.toLowerCase().replaceAll(" ", "")}.example`,
  mobile: "+971500000000",
  tradeScore: business.tradeScore,
  verificationStatus: business.verificationStatus,
}));

function order(input: Omit<EscrowOrder, "feeFils" | "vatFils">): EscrowOrder {
  const vatFils = calculateVatFils(input.amountFils);

  return {
    ...input,
    vatFils,
    feeFils: calculatePlatformFeeFils(input.amountFils + vatFils),
  };
}

export const orders: EscrowOrder[] = [
  order({
    id: "ord-001",
    reference: "RAE-2026-001",
    buyerBusinessId: "biz-buyer-1",
    sellerBusinessId: "biz-seller-1",
    title: "Retail packaging shipment",
    description:
      "Corrugated and premium retail packaging for four Dubai stores.",
    category: "Goods",
    amountFils: parseAEDToFils(146500),
    deliveryLocation: "Al Quoz, Dubai",
    dueDate: "2026-06-18",
    state: "release_requested",
    createdAt: "2026-06-01T08:00:00.000Z",
    riskLevel: "low",
    frozen: false,
  }),
  order({
    id: "ord-002",
    reference: "RAE-2026-002",
    buyerBusinessId: "biz-buyer-2",
    sellerBusinessId: "biz-seller-2",
    title: "Clinic booking platform sprint",
    description: "Milestone delivery for bilingual patient booking workflows.",
    category: "Services",
    amountFils: parseAEDToFils(92500),
    deliveryLocation: "DIFC, Dubai",
    dueDate: "2026-06-22",
    state: "funded",
    createdAt: "2026-06-03T10:30:00.000Z",
    riskLevel: "medium",
    frozen: false,
  }),
  order({
    id: "ord-003",
    reference: "RAE-2026-003",
    buyerBusinessId: "biz-buyer-1",
    sellerBusinessId: "biz-seller-3",
    title: "Cross-border freight clearance",
    description: "Forwarding support and import documentation coordination.",
    category: "Logistics",
    amountFils: parseAEDToFils(38500),
    deliveryLocation: "Jebel Ali Port",
    dueDate: "2026-06-16",
    state: "disputed",
    createdAt: "2026-05-28T11:00:00.000Z",
    riskLevel: "high",
    frozen: false,
  }),
  order({
    id: "ord-004",
    reference: "RAE-2026-004",
    buyerBusinessId: "biz-buyer-3",
    sellerBusinessId: "biz-seller-2",
    title: "Brand launch media kit",
    description: "Arabic and English launch assets for a hospitality client.",
    category: "Creative",
    amountFils: parseAEDToFils(24750),
    deliveryLocation: "Abu Dhabi Global Market",
    dueDate: "2026-06-30",
    state: "awaiting_verification",
    createdAt: "2026-06-06T09:15:00.000Z",
    riskLevel: "medium",
    frozen: false,
  }),
  order({
    id: "ord-005",
    reference: "RAE-2026-005",
    buyerBusinessId: "biz-buyer-2",
    sellerBusinessId: "biz-seller-1",
    title: "Medical supplies cartons",
    description: "Temperature-labelled cartons for clinic supply movement.",
    category: "Goods",
    amountFils: parseAEDToFils(68300),
    deliveryLocation: "Dubai Healthcare City",
    dueDate: "2026-06-25",
    state: "proof_submitted",
    createdAt: "2026-06-05T13:00:00.000Z",
    riskLevel: "low",
    frozen: false,
  }),
  order({
    id: "ord-006",
    reference: "RAE-2026-006",
    buyerBusinessId: "biz-buyer-1",
    sellerBusinessId: "biz-seller-2",
    title: "Supplier portal maintenance",
    description: "Support retainer for VAT invoice upload and vendor dashboard.",
    category: "Services",
    amountFils: parseAEDToFils(12000),
    deliveryLocation: "Remote / Dubai",
    dueDate: "2026-07-02",
    state: "awaiting_funding",
    createdAt: "2026-06-08T16:45:00.000Z",
    riskLevel: "low",
    frozen: false,
  }),
];

export const milestones: OrderMilestone[] = orders.flatMap((item) => {
  const deposit = Math.round(item.amountFils * 0.3);
  const shipment = Math.round(item.amountFils * 0.4);
  const final = item.amountFils - deposit - shipment;

  return [
    {
      id: `${item.id}-ms-1`,
      orderId: item.id,
      title: "Deposit",
      amountFils: deposit,
      dueDate: item.createdAt.slice(0, 10),
      status: item.state === "awaiting_funding" ? "pending" : "funded",
    },
    {
      id: `${item.id}-ms-2`,
      orderId: item.id,
      title: "Shipment / proof",
      amountFils: shipment,
      dueDate: item.dueDate,
      status:
        item.state === "proof_submitted" || item.state === "release_requested"
          ? "proof_submitted"
          : item.state === "disputed"
            ? "disputed"
            : "in_progress",
    },
    {
      id: `${item.id}-ms-3`,
      orderId: item.id,
      title: "Final acceptance",
      amountFils: final,
      dueDate: item.dueDate,
      status: item.state === "released" ? "released" : "pending",
    },
  ];
});

export const escrowAccounts: EscrowAccount[] = orders.map((item) => ({
  id: `esc-${item.id}`,
  orderId: item.id,
  balanceFils:
    item.state === "released" || item.state === "refunded"
      ? 0
      : item.amountFils + item.vatFils,
  currency: "AED",
  status: item.frozen
    ? "frozen"
    : item.state === "released"
      ? "released"
      : item.state === "refunded"
        ? "refunded"
        : "open",
}));

export const payments: Payment[] = orders
  .filter((item) => item.state !== "awaiting_verification")
  .map((item) => ({
    id: `pay-${item.id}`,
    orderId: item.id,
    provider: "railora_sandbox",
    status:
      item.state === "awaiting_funding" ? "sandbox_pending" : "sandbox_captured",
    amountFils: item.amountFils + item.vatFils + item.feeFils,
    providerReference: `sandbox_${item.reference.toLowerCase()}`,
    createdAt: item.createdAt,
  }));

export const ledgerTransactions: LedgerTransaction[] = [
  buildFundingLedger(orders[0]),
  buildReleaseLedger({ ...orders[0], state: "released" }),
  buildFundingLedger(orders[2]),
  buildRefundLedger({ ...orders[2], state: "refunded" }),
];

export const invoices: Invoice[] = [
  {
    id: "inv-001",
    number: "INV-2026-041",
    businessId: "biz-seller-1",
    counterpartyId: "cp-biz-buyer-1",
    status: "escrow_created",
    amountFils: parseAEDToFils(146500),
    vatFils: calculateVatFils(parseAEDToFils(146500)),
    dueDate: "2026-06-18",
    eInvoiceReady: true,
  },
  {
    id: "inv-002",
    number: "INV-2026-047",
    businessId: "biz-seller-2",
    counterpartyId: "cp-biz-buyer-2",
    status: "sent",
    amountFils: parseAEDToFils(92500),
    vatFils: calculateVatFils(parseAEDToFils(92500)),
    dueDate: "2026-06-22",
    eInvoiceReady: true,
  },
  {
    id: "inv-003",
    number: "INV-2026-052",
    businessId: "biz-seller-3",
    counterpartyId: "cp-biz-buyer-1",
    status: "draft",
    amountFils: parseAEDToFils(38500),
    vatFils: calculateVatFils(parseAEDToFils(38500)),
    dueDate: "2026-06-16",
    eInvoiceReady: false,
  },
  {
    id: "inv-004",
    number: "INV-2026-055",
    businessId: "biz-seller-2",
    counterpartyId: "cp-biz-buyer-3",
    status: "paid",
    amountFils: parseAEDToFils(12000),
    vatFils: calculateVatFils(parseAEDToFils(12000)),
    dueDate: "2026-07-02",
    eInvoiceReady: true,
  },
];

export const documents: DocumentRecord[] = [
  {
    id: "doc-001",
    businessId: "biz-seller-1",
    orderId: "ord-001",
    type: "pro_forma_invoice",
    fileName: "pro-forma-rae-001.pdf",
    storageKey: "r2/demo/pro-forma-rae-001.pdf",
    status: "verified",
    uploadedAt: "2026-06-01T09:05:00.000Z",
  },
  {
    id: "doc-002",
    businessId: "biz-buyer-1",
    orderId: "ord-001",
    type: "purchase_order",
    fileName: "al-noor-po-44821.pdf",
    storageKey: "r2/demo/al-noor-po-44821.pdf",
    status: "verified",
    uploadedAt: "2026-06-01T09:12:00.000Z",
  },
  {
    id: "doc-003",
    businessId: "biz-seller-1",
    orderId: "ord-005",
    type: "delivery_note",
    fileName: "dhcc-delivery-note.pdf",
    storageKey: "r2/demo/dhcc-delivery-note.pdf",
    status: "pending",
    uploadedAt: "2026-06-08T15:20:00.000Z",
  },
  {
    id: "doc-004",
    businessId: "biz-seller-2",
    type: "trade_licence",
    fileName: "desert-cloud-ded-licence.pdf",
    storageKey: "r2/demo/desert-cloud-ded-licence.pdf",
    status: "verified",
    uploadedAt: "2026-05-25T13:18:00.000Z",
  },
  {
    id: "doc-005",
    businessId: "biz-buyer-3",
    type: "emirates_id",
    fileName: "beneficial-owner-eid-placeholder.pdf",
    storageKey: "r2/demo/bo-eid-placeholder.pdf",
    status: "requires_review",
    uploadedAt: "2026-06-06T10:31:00.000Z",
  },
];

export const verificationChecks: VerificationCheck[] = [
  {
    id: "vc-001",
    businessId: "biz-buyer-1",
    type: "uae_pass_identity",
    label: "UAE PASS identity",
    status: "verified",
    checkedAt: now,
    notes: "Sandbox identity assertion matched demo user.",
  },
  {
    id: "vc-002",
    businessId: "biz-buyer-1",
    type: "business_licence",
    label: "Business licence / DUL",
    status: "verified",
    checkedAt: now,
    notes: "DED licence active in mock Dubai Unified Licence registry.",
  },
  {
    id: "vc-003",
    businessId: "biz-buyer-1",
    type: "trn_vat",
    label: "TRN / VAT number",
    status: "verified",
    checkedAt: now,
    notes: "TRN format valid and linked to buyer legal name.",
  },
  {
    id: "vc-004",
    businessId: "biz-buyer-1",
    type: "bank_account",
    label: "Bank account ownership",
    status: "pending",
    checkedAt: now,
    notes: "Sandbox penny-check placeholder queued.",
  },
  {
    id: "vc-005",
    businessId: "biz-buyer-1",
    type: "beneficial_owner",
    label: "Beneficial owner declaration",
    status: "requires_review",
    checkedAt: now,
    notes: "Manual review needed for ownership declaration.",
  },
  {
    id: "vc-006",
    businessId: "biz-buyer-1",
    type: "sanctions_pep",
    label: "Sanctions / PEP check",
    status: "verified",
    checkedAt: now,
    notes: "No sandbox watchlist hits.",
  },
];

export const disputes: Dispute[] = [
  {
    id: "disp-001",
    orderId: "ord-003",
    reason: "Delivery documents do not match customs handoff timestamp.",
    status: "under_review",
    proposedResolution: "partial_release",
    openedAt: "2026-06-07T08:40:00.000Z",
  },
  {
    id: "disp-002",
    orderId: "ord-004",
    reason: "Buyer verification delayed after beneficial owner review.",
    status: "open",
    proposedResolution: "manual_review",
    openedAt: "2026-06-08T14:10:00.000Z",
  },
];

export const disputeMessages: DisputeMessage[] = [
  {
    id: "dm-001",
    disputeId: "disp-001",
    author: "Mariam Al Farsi",
    role: "buyer",
    body: "The proof shows a different handoff window than our warehouse slot.",
    createdAt: "2026-06-07T08:42:00.000Z",
  },
  {
    id: "dm-002",
    disputeId: "disp-001",
    author: "Faisal Khan",
    role: "seller",
    body: "Courier submitted the original manifest; adding stamped delivery note.",
    createdAt: "2026-06-07T09:00:00.000Z",
  },
  {
    id: "dm-003",
    disputeId: "disp-001",
    author: "Aisha Merchant",
    role: "platform_admin",
    body: "Railora risk review proposes 70% release and 30% holdback.",
    createdAt: "2026-06-07T10:16:00.000Z",
  },
];

export const riskScores: RiskScore[] = [
  {
    id: "risk-001",
    businessId: "biz-seller-1",
    orderId: "ord-001",
    score: 91,
    level: "low",
    factors: ["Verified DUL", "Low dispute rate", "Repeat buyer"],
    updatedAt: now,
  },
  {
    id: "risk-002",
    businessId: "biz-seller-3",
    orderId: "ord-003",
    score: 58,
    level: "high",
    factors: ["Pending verification", "First trade", "Open dispute"],
    updatedAt: now,
  },
  {
    id: "risk-003",
    businessId: "biz-buyer-3",
    orderId: "ord-004",
    score: 67,
    level: "medium",
    factors: ["Beneficial owner review", "New counterparty", "Moderate value"],
    updatedAt: now,
  },
];

export const auditEvents: AuditEvent[] = [
  {
    id: "audit-001",
    actor: "system",
    action: "seed.demo_loaded",
    entityType: "workspace",
    entityId: "railora-demo",
    createdAt: now,
    metadata: { sandbox: true },
  },
  {
    id: "audit-002",
    actor: "Mariam Al Farsi",
    action: "escrow.funded_sandbox",
    entityType: "order",
    entityId: "ord-001",
    createdAt: "2026-06-01T10:12:00.000Z",
    metadata: { amountFils: orders[0].amountFils + orders[0].vatFils },
  },
  {
    id: "audit-003",
    actor: "Aisha Merchant",
    action: "risk.review_opened",
    entityType: "dispute",
    entityId: "disp-001",
    createdAt: "2026-06-07T10:11:00.000Z",
    metadata: { riskLevel: "high" },
  },
];

export const notifications: Notification[] = [
  {
    id: "notif-001",
    userId: "user-buyer-1",
    channel: "email",
    title: "Release requested for RAE-2026-001",
    status: "sent",
    createdAt: now,
  },
  {
    id: "notif-002",
    userId: "user-admin-1",
    channel: "in_app",
    title: "High-risk dispute awaiting review",
    status: "queued",
    createdAt: now,
  },
];

export function getBusiness(id: string) {
  return businesses.find((business) => business.id === id);
}

export function getOrder(id: string) {
  return orders.find((item) => item.id === id);
}

export function getOrderParties(item: EscrowOrder) {
  return {
    buyer: getBusiness(item.buyerBusinessId),
    seller: getBusiness(item.sellerBusinessId),
  };
}

export function getMilestonesForOrder(orderId: string) {
  return milestones.filter((milestone) => milestone.orderId === orderId);
}

export function getDocumentsForOrder(orderId: string) {
  return documents.filter((document) => document.orderId === orderId);
}

export function getDispute(id: string) {
  return disputes.find((dispute) => dispute.id === id);
}

export function getDisputeMessages(disputeId: string) {
  return disputeMessages.filter((message) => message.disputeId === disputeId);
}

export function getLedgerPreview(orderId: string) {
  const seeded = ledgerTransactions.filter(
    (transaction) => transaction.referenceId === orderId,
  );
  const item = getOrder(orderId);

  if (seeded.length > 0 || !item) {
    return seeded;
  }

  return [buildFundingLedger(item), buildReleaseLedger(item)];
}

export function getDemoUser(role = "buyer") {
  return users.find((user) => user.role === role) ?? users[0];
}
