"use server";

import { redirect } from "next/navigation";
import { getCurrentUser, setDemoRole } from "@/lib/auth/session";
import { getAuditEvents, recordAuditEvent } from "@/lib/data/audit-store";
import {
  getOrder,
  invoices,
  orders,
  users,
} from "@/lib/data/seed";
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
import type { EscrowOrder, EscrowState } from "@/lib/domain/types";
import { transitionEscrowState } from "@/lib/domain/escrow";
import { verifyDubaiUnifiedLicence } from "@/lib/integrations/dul";
import { validateEInvoiceReadiness } from "@/lib/integrations/einvoice";
import { runKycCheck } from "@/lib/integrations/kyc";
import { enqueueNotification } from "@/lib/integrations/notifications";
import { railoraSandboxPayments } from "@/lib/integrations/payments";
import { runRiskModel } from "@/lib/integrations/risk";
import { verifyUaePassIdentity } from "@/lib/integrations/uae-pass";
import { checkRateLimitPlaceholder } from "@/lib/security/rate-limit";
import { requirePermission } from "@/lib/security/rbac";
import { verifyTurnstilePlaceholder } from "@/lib/security/turnstile";
import {
  convertInvoiceSchema,
  createBusinessSchema,
  createEscrowOrderSchema,
  createInvoiceSchema,
  inviteCounterpartySchema,
  openDisputeSchema,
  orderIdSchema,
  resolveDisputeSchema,
  roleSchema,
  uploadDocumentSchema,
  verificationCheckSchema,
} from "./schemas";

export interface ActionResult<T = unknown> {
  ok: boolean;
  message: string;
  data?: T;
}

function fail(message: string): ActionResult {
  return { ok: false, message };
}

async function actor() {
  return getCurrentUser();
}

function actionMessage(error: unknown) {
  return error instanceof Error ? error.message : "Railora action failed";
}

export async function signInWithRole(formData: FormData) {
  const role = roleSchema.parse(formData.get("role"));
  await checkRateLimitPlaceholder(`auth:${role}`);
  await verifyTurnstilePlaceholder(String(formData.get("turnstile") ?? ""));
  await setDemoRole(role);

  const user = users.find((item) => item.role === role);
  recordAuditEvent({
    actor: user?.name ?? role,
    action: "auth.demo_login",
    entityType: "user",
    entityId: user?.id ?? role,
    metadata: { role, sandbox: true },
  });

  redirect("/dashboard");
}

export async function createBusiness(input: unknown): Promise<ActionResult> {
  try {
    const user = await actor();
    requirePermission(user.role, "business:create");
    const payload = createBusinessSchema.parse(input);
    const dul = await verifyDubaiUnifiedLicence(payload.licenceNumber);

    recordAuditEvent({
      actor: user.name,
      action: "business.created_demo",
      entityType: "business",
      entityId: payload.licenceNumber,
      metadata: { dulActive: dul.active, sandbox: true },
    });

    return {
      ok: true,
      message: "Business created in sandbox workspace.",
      data: { payload, dul },
    };
  } catch (error) {
    return fail(actionMessage(error));
  }
}

export async function runVerificationCheck(input: unknown): Promise<ActionResult> {
  try {
    const user = await actor();
    requirePermission(user.role, "verification:run");
    const payload = verificationCheckSchema.parse(input);
    const [identity, dul, kyc] = await Promise.all([
      verifyUaePassIdentity(user.id),
      verifyDubaiUnifiedLicence("DED-884219"),
      runKycCheck(payload.businessId),
    ]);

    recordAuditEvent({
      actor: user.name,
      action: "verification.run_sandbox",
      entityType: "business",
      entityId: payload.businessId,
      metadata: { checkType: payload.checkType, status: kyc.status },
    });

    return {
      ok: true,
      message: "Sandbox verification checks completed.",
      data: { identity, dul, kyc },
    };
  } catch (error) {
    return fail(actionMessage(error));
  }
}

export async function createEscrowOrder(input: unknown): Promise<
  ActionResult<{ redirectTo: string; order: EscrowOrder }>
> {
  try {
    const user = await actor();
    requirePermission(user.role, "escrow:create");
    const payload = createEscrowOrderSchema.parse(input);
    const amountFils = parseAEDToFils(payload.amountAed);
    const vatFils = calculateVatFils(amountFils);
    const order: EscrowOrder = {
      id: "ord-006",
      reference: "RAE-2026-006",
      buyerBusinessId: user.businessId,
      sellerBusinessId: payload.counterpartyId.replace("cp-", ""),
      title: payload.title,
      description: payload.description,
      category: payload.category,
      amountFils,
      vatFils,
      feeFils: calculatePlatformFeeFils(amountFils + vatFils),
      deliveryLocation: payload.deliveryLocation,
      dueDate: payload.dueDate,
      state: "awaiting_funding",
      createdAt: new Date().toISOString(),
      riskLevel: "low",
      frozen: false,
    };

    recordAuditEvent({
      actor: user.name,
      action: "escrow.created_demo",
      entityType: "order",
      entityId: order.id,
      metadata: {
        amountFils,
        counterpartyId: payload.counterpartyId,
        sandbox: true,
      },
    });

    return {
      ok: true,
      message: "Escrow order created in sandbox mode.",
      data: {
        redirectTo: `/escrow/${order.id}?created=1&title=${encodeURIComponent(order.title)}`,
        order,
      },
    };
  } catch (error) {
    return fail(actionMessage(error)) as ActionResult<{
      redirectTo: string;
      order: EscrowOrder;
    }>;
  }
}

export async function inviteCounterparty(input: unknown): Promise<ActionResult> {
  try {
    const user = await actor();
    requirePermission(user.role, "escrow:invite");
    const payload = inviteCounterpartySchema.parse(input);

    await enqueueNotification({
      userId: user.id,
      title: `Sandbox invite sent for ${payload.orderId}`,
      channel: "email",
    });

    recordAuditEvent({
      actor: user.name,
      action: "escrow.counterparty_invited",
      entityType: "order",
      entityId: payload.orderId,
      metadata: { email: payload.email, mobile: payload.mobile },
    });

    return { ok: true, message: "Counterparty invite queued." };
  } catch (error) {
    return fail(actionMessage(error));
  }
}

export async function fundEscrowSandbox(input: unknown): Promise<
  ActionResult<{ state: EscrowState; ledgerBalanced: boolean }>
> {
  try {
    const user = await actor();
    requirePermission(user.role, "escrow:fund");
    const { orderId } = orderIdSchema.parse(input);
    const item = getOrder(orderId) ?? orders[5];
    const state = transitionEscrowState("awaiting_funding", "funded");
    const payment = await railoraSandboxPayments.initiateEscrowFunding({
      orderId,
      amountFils: item.amountFils + item.vatFils + item.feeFils,
    });
    const ledger = buildFundingLedger(item);

    recordAuditEvent({
      actor: user.name,
      action: "escrow.funded_sandbox",
      entityType: "order",
      entityId: orderId,
      metadata: {
        amountFils: payment.amountFils,
        ledgerDebits: ledger.entries.reduce((sum, entry) => sum + entry.debitFils, 0),
      },
    });

    return {
      ok: true,
      message: "Sandbox escrow funded. No real money moved.",
      data: { state, ledgerBalanced: true },
    };
  } catch (error) {
    return fail(actionMessage(error)) as ActionResult<{
      state: EscrowState;
      ledgerBalanced: boolean;
    }>;
  }
}

export async function uploadDocumentMetadata(input: unknown): Promise<ActionResult> {
  try {
    const user = await actor();
    requirePermission(user.role, "document:upload");
    const payload = uploadDocumentSchema.parse(input);

    recordAuditEvent({
      actor: user.name,
      action: "document.uploaded_metadata",
      entityType: "document",
      entityId: payload.fileName,
      metadata: { businessId: payload.businessId, type: payload.type },
    });

    return { ok: true, message: "Document metadata stored for mock R2 scan." };
  } catch (error) {
    return fail(actionMessage(error));
  }
}

export async function submitProof(input: unknown): Promise<ActionResult<{ state: EscrowState }>> {
  try {
    const user = await actor();
    requirePermission(user.role, "escrow:submit_proof");
    const { orderId } = orderIdSchema.parse(input);
    const state = transitionEscrowState("in_progress", "proof_submitted");

    recordAuditEvent({
      actor: user.name,
      action: "escrow.proof_submitted",
      entityType: "order",
      entityId: orderId,
      metadata: { sandbox: true },
    });

    return { ok: true, message: "Delivery proof submitted.", data: { state } };
  } catch (error) {
    return fail(actionMessage(error)) as ActionResult<{ state: EscrowState }>;
  }
}

export async function requestRelease(input: unknown): Promise<ActionResult<{ state: EscrowState }>> {
  try {
    const user = await actor();
    requirePermission(user.role, "escrow:request_release");
    const { orderId } = orderIdSchema.parse(input);
    const state = transitionEscrowState("proof_submitted", "release_requested");

    recordAuditEvent({
      actor: user.name,
      action: "escrow.release_requested",
      entityType: "order",
      entityId: orderId,
      metadata: { sandbox: true },
    });

    return { ok: true, message: "Release requested from buyer.", data: { state } };
  } catch (error) {
    return fail(actionMessage(error)) as ActionResult<{ state: EscrowState }>;
  }
}

export async function approveRelease(input: unknown): Promise<
  ActionResult<{ state: EscrowState; ledgerBalanced: boolean }>
> {
  try {
    const user = await actor();
    requirePermission(user.role, "escrow:approve_release");
    const { orderId } = orderIdSchema.parse(input);
    const item = getOrder(orderId) ?? orders[5];
    const state = transitionEscrowState("release_requested", "released");
    const ledger = buildReleaseLedger(item);

    recordAuditEvent({
      actor: user.name,
      action: "escrow.release_approved",
      entityType: "order",
      entityId: orderId,
      metadata: {
        ledgerEntries: ledger.entries.length,
        amountFils: item.amountFils + item.vatFils,
      },
    });

    return {
      ok: true,
      message: "Sandbox release approved and ledger balanced.",
      data: { state, ledgerBalanced: true },
    };
  } catch (error) {
    return fail(actionMessage(error)) as ActionResult<{
      state: EscrowState;
      ledgerBalanced: boolean;
    }>;
  }
}

export async function openDispute(input: unknown): Promise<ActionResult> {
  try {
    const user = await actor();
    requirePermission(user.role, "escrow:open_dispute");
    const payload = openDisputeSchema.parse(input);

    recordAuditEvent({
      actor: user.name,
      action: "dispute.opened",
      entityType: "order",
      entityId: payload.orderId,
      metadata: { reason: payload.reason },
    });

    return { ok: true, message: "Dispute opened for admin review." };
  } catch (error) {
    return fail(actionMessage(error));
  }
}

export async function resolveDispute(input: unknown): Promise<ActionResult> {
  try {
    const user = await actor();
    requirePermission(user.role, "escrow:resolve_dispute");
    const payload = resolveDisputeSchema.parse(input);
    const order = getOrder("ord-003") ?? orders[2];

    if (payload.resolution === "refund") {
      buildRefundLedger(order);
    } else if (payload.resolution === "release") {
      buildReleaseLedger(order);
    }

    recordAuditEvent({
      actor: user.name,
      action: "dispute.resolved_demo",
      entityType: "dispute",
      entityId: payload.disputeId,
      metadata: { resolution: payload.resolution },
    });

    return { ok: true, message: "Dispute resolution recorded." };
  } catch (error) {
    return fail(actionMessage(error));
  }
}

export async function createInvoice(input: unknown): Promise<ActionResult> {
  try {
    const user = await actor();
    requirePermission(user.role, "invoice:create");
    const payload = createInvoiceSchema.parse(input);
    const readiness = await validateEInvoiceReadiness("inv-runtime");

    recordAuditEvent({
      actor: user.name,
      action: "invoice.created_demo",
      entityType: "invoice",
      entityId: "inv-runtime",
      metadata: {
        amountFils: parseAEDToFils(payload.amountAed),
        eInvoiceReady: readiness.ready,
      },
    });

    return { ok: true, message: "Invoice created with e-invoicing fields." };
  } catch (error) {
    return fail(actionMessage(error));
  }
}

export async function convertInvoiceToEscrow(input: unknown): Promise<ActionResult> {
  try {
    const user = await actor();
    requirePermission(user.role, "invoice:convert");
    const payload = convertInvoiceSchema.parse(input);
    const invoice = invoices.find((item) => item.id === payload.invoiceId);

    recordAuditEvent({
      actor: user.name,
      action: "invoice.converted_to_escrow",
      entityType: "invoice",
      entityId: payload.invoiceId,
      metadata: { amountFils: invoice?.amountFils ?? 0 },
    });

    return { ok: true, message: "Invoice converted into sandbox escrow." };
  } catch (error) {
    return fail(actionMessage(error));
  }
}

export async function runRiskCheck(input: unknown): Promise<ActionResult> {
  try {
    const user = await actor();
    requirePermission(user.role, "risk:run");
    const { orderId } = orderIdSchema.parse(input);
    const item = getOrder(orderId);
    const score = await runRiskModel({
      businessId: item?.sellerBusinessId ?? user.businessId,
      orderAmountFils: item?.amountFils,
      hasOpenDispute: item?.state === "disputed",
    });

    recordAuditEvent({
      actor: user.name,
      action: "risk.check_run",
      entityType: "order",
      entityId: orderId,
      metadata: { score: score.score, level: score.level },
    });

    return { ok: true, message: "Risk model completed.", data: score };
  } catch (error) {
    return fail(actionMessage(error));
  }
}

export async function runReconciliation(): Promise<ActionResult> {
  try {
    const user = await actor();
    requirePermission(user.role, "reconciliation:run");

    recordAuditEvent({
      actor: user.name,
      action: "ledger.reconciliation_run",
      entityType: "ledger",
      entityId: "railora-sandbox",
      metadata: { auditEvents: getAuditEvents().length, sandbox: true },
    });

    return {
      ok: true,
      message: "Mock reconciliation completed. All demo ledger rows balance.",
    };
  } catch (error) {
    return fail(actionMessage(error));
  }
}
