import { z } from "zod";

export const roleSchema = z.enum([
  "buyer",
  "seller",
  "business_admin",
  "platform_admin",
]);

export const createBusinessSchema = z.object({
  legalName: z.string().min(2),
  licenceNumber: z.string().min(4),
  trn: z.string().min(8),
  type: z.enum([
    "mainland_llc",
    "free_zone",
    "freelancer",
    "sole_establishment",
    "foreign_supplier",
  ]),
});

export const verificationCheckSchema = z.object({
  businessId: z.string().min(1),
  checkType: z.string().min(1),
});

export const createEscrowOrderSchema = z.object({
  counterpartyId: z.string().min(1),
  title: z.string().min(4),
  description: z.string().min(8),
  category: z.string().min(2),
  amountAed: z.coerce.number().positive(),
  deliveryLocation: z.string().min(3),
  dueDate: z.string().min(8),
  depositPercent: z.coerce.number().min(10).max(80),
});

export const inviteCounterpartySchema = z.object({
  orderId: z.string().min(1),
  email: z.string().email(),
  mobile: z.string().min(8),
});

export const orderIdSchema = z.object({
  orderId: z.string().min(1),
});

export const uploadDocumentSchema = z.object({
  businessId: z.string().min(1),
  orderId: z.string().optional(),
  type: z.string().min(1),
  fileName: z.string().min(3),
});

export const openDisputeSchema = z.object({
  orderId: z.string().min(1),
  reason: z.string().min(8),
});

export const resolveDisputeSchema = z.object({
  disputeId: z.string().min(1),
  resolution: z.enum(["release", "partial_release", "refund", "manual_review"]),
});

export const createInvoiceSchema = z.object({
  counterpartyId: z.string().min(1),
  amountAed: z.coerce.number().positive(),
  dueDate: z.string().min(8),
});

export const convertInvoiceSchema = z.object({
  invoiceId: z.string().min(1),
});
