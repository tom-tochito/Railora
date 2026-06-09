export async function runKycCheck(businessId: string) {
  // TODO: Connect a regulated KYC/KYB provider with document and ownership checks.
  return {
    businessId,
    status: "requires_review" as const,
    reasons: ["Beneficial owner declaration pending manual review"],
  };
}
