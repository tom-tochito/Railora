import type { Payment } from "@/lib/domain/types";

export interface PaymentAdapter {
  initiateEscrowFunding(input: {
    orderId: string;
    amountFils: number;
  }): Promise<Payment>;
  refundEscrow(input: { orderId: string; amountFils: number }): Promise<Payment>;
}

export const railoraSandboxPayments: PaymentAdapter = {
  async initiateEscrowFunding(input) {
    // TODO: Add real payment provider adapter after licensing and provider onboarding.
    return {
      id: `pay-sandbox-${input.orderId}`,
      orderId: input.orderId,
      provider: "railora_sandbox",
      status: "sandbox_captured",
      amountFils: input.amountFils,
      providerReference: `sandbox_${input.orderId}_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
  },
  async refundEscrow(input) {
    return {
      id: `refund-sandbox-${input.orderId}`,
      orderId: input.orderId,
      provider: "railora_sandbox",
      status: "sandbox_refunded",
      amountFils: input.amountFils,
      providerReference: `sandbox_refund_${input.orderId}_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
  },
};
