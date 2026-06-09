import type { Role } from "@/lib/domain/types";

export class AuthorizationError extends Error {
  constructor(message = "You do not have permission to perform this action") {
    super(message);
    this.name = "AuthorizationError";
  }
}

const rolePermissions: Record<Role, string[]> = {
  buyer: [
    "business:create",
    "verification:run",
    "escrow:create",
    "escrow:invite",
    "escrow:fund",
    "escrow:approve_release",
    "escrow:open_dispute",
    "document:upload",
    "invoice:create",
    "invoice:convert",
    "risk:run",
  ],
  seller: [
    "verification:run",
    "escrow:submit_proof",
    "escrow:request_release",
    "escrow:open_dispute",
    "document:upload",
    "invoice:create",
    "invoice:convert",
  ],
  business_admin: [
    "business:create",
    "verification:run",
    "escrow:create",
    "escrow:invite",
    "escrow:fund",
    "escrow:submit_proof",
    "escrow:request_release",
    "escrow:approve_release",
    "escrow:open_dispute",
    "document:upload",
    "invoice:create",
    "invoice:convert",
    "risk:run",
  ],
  platform_admin: [
    "business:create",
    "verification:run",
    "escrow:create",
    "escrow:invite",
    "escrow:fund",
    "escrow:submit_proof",
    "escrow:request_release",
    "escrow:approve_release",
    "escrow:open_dispute",
    "escrow:resolve_dispute",
    "order:freeze",
    "risk:run",
    "reconciliation:run",
    "audit:export",
    "document:upload",
    "invoice:create",
    "invoice:convert",
  ],
};

export function hasPermission(role: Role, permission: string): boolean {
  return rolePermissions[role].includes(permission);
}

export function requirePermission(role: Role, permission: string): void {
  if (!hasPermission(role, permission)) {
    throw new AuthorizationError();
  }
}
