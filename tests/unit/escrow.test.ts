import { describe, expect, it } from "vitest";
import {
  canTransition,
  InvalidEscrowTransitionError,
  transitionEscrowState,
} from "@/lib/domain/escrow";

describe("escrow state machine", () => {
  it("allows valid state transitions", () => {
    expect(canTransition("awaiting_funding", "funded")).toBe(true);
    expect(transitionEscrowState("release_requested", "released")).toBe(
      "released",
    );
  });

  it("rejects invalid state transitions", () => {
    expect(canTransition("draft", "released")).toBe(false);
    expect(() => transitionEscrowState("draft", "released")).toThrow(
      InvalidEscrowTransitionError,
    );
  });
});
