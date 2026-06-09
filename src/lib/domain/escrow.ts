import type { EscrowState } from "./types";

export class InvalidEscrowTransitionError extends Error {
  constructor(from: EscrowState, to: EscrowState) {
    super(`Cannot transition escrow from ${from} to ${to}`);
    this.name = "InvalidEscrowTransitionError";
  }
}

export const escrowTransitions: Record<EscrowState, EscrowState[]> = {
  draft: ["awaiting_counterparty", "cancelled"],
  awaiting_counterparty: ["awaiting_verification", "cancelled"],
  awaiting_verification: ["awaiting_funding", "cancelled", "frozen"],
  awaiting_funding: ["funded", "cancelled", "frozen"],
  funded: ["in_progress", "disputed", "frozen"],
  in_progress: ["proof_submitted", "disputed", "frozen"],
  proof_submitted: ["release_requested", "disputed", "frozen"],
  release_requested: ["released", "partially_released", "disputed", "frozen"],
  released: [],
  disputed: ["released", "partially_released", "refunded", "frozen"],
  partially_released: ["released", "refunded"],
  refunded: [],
  cancelled: [],
  frozen: ["awaiting_funding", "funded", "in_progress", "disputed", "cancelled"],
};

export function canTransition(from: EscrowState, to: EscrowState): boolean {
  return escrowTransitions[from].includes(to);
}

export function transitionEscrowState(
  from: EscrowState,
  to: EscrowState,
): EscrowState {
  if (!canTransition(from, to)) {
    throw new InvalidEscrowTransitionError(from, to);
  }

  return to;
}

export function statusLabel(state: EscrowState): string {
  return state
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export const escrowTimeline: EscrowState[] = [
  "draft",
  "awaiting_counterparty",
  "awaiting_verification",
  "awaiting_funding",
  "funded",
  "in_progress",
  "proof_submitted",
  "release_requested",
  "released",
];
