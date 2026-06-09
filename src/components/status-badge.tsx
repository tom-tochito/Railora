import { Badge } from "@/components/ui/badge";
import type { EscrowState, VerificationStatus } from "@/lib/domain/types";
import { statusLabel } from "@/lib/domain/escrow";

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const tone =
    status === "verified"
      ? "success"
      : status === "failed"
        ? "danger"
        : status === "requires_review"
          ? "warning"
          : "neutral";

  return <Badge tone={tone}>{status.replaceAll("_", " ")}</Badge>;
}

export function EscrowStatusBadge({ state }: { state: EscrowState }) {
  const tone =
    state === "released"
      ? "success"
      : state === "disputed" || state === "frozen"
        ? "danger"
        : state === "awaiting_funding" || state === "release_requested"
          ? "warning"
          : "brand";

  return <Badge tone={tone}>{statusLabel(state)}</Badge>;
}
