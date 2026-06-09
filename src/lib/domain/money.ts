export const FILS_PER_AED = 100;

export function parseAEDToFils(value: string | number): number {
  const normalized =
    typeof value === "number" ? value : Number(value.replace(/,/g, "").trim());

  if (!Number.isFinite(normalized) || normalized < 0) {
    throw new Error("AED amount must be a positive number");
  }

  return Math.round(normalized * FILS_PER_AED);
}

export function formatAED(fils: number): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 2,
  }).format(fils / FILS_PER_AED);
}

export function calculateVatFils(amountFils: number, vatBps = 500): number {
  return Math.round((amountFils * vatBps) / 10_000);
}

export function calculatePlatformFeeFils(amountFils: number): number {
  const fee = Math.round(amountFils * 0.0125);
  return Math.max(parseAEDToFils(35), Math.min(fee, parseAEDToFils(2500)));
}

export function percent(value: number): string {
  return `${Math.round(value)}%`;
}
