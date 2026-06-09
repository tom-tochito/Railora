import { describe, expect, it } from "vitest";
import {
  calculatePlatformFeeFils,
  calculateVatFils,
  formatAED,
  parseAEDToFils,
} from "@/lib/domain/money";

describe("AED money helpers", () => {
  it("keeps money in integer fils", () => {
    expect(parseAEDToFils("1,234.56")).toBe(123456);
    expect(calculateVatFils(parseAEDToFils(100))).toBe(500);
  });

  it("formats AED for UAE users", () => {
    expect(formatAED(123456)).toContain("AED");
  });

  it("calculates a bounded platform fee", () => {
    expect(calculatePlatformFeeFils(parseAEDToFils(100))).toBe(
      parseAEDToFils(35),
    );
  });
});
