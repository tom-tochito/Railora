import { expect, test } from "@playwright/test";

test("buyer creates and funds escrow, seller submits proof, buyer releases, admin sees audit", async ({
  page,
}) => {
  await page.goto("/auth");
  await page.locator("#role").selectOption("buyer");
  await page.getByRole("button", { name: /Continue with mock UAE PASS/i }).click();
  await expect(page.getByRole("heading", { name: /Money movement is under control/i })).toBeVisible();

  await page.keyboard.press("Control+K");
  await expect(page.getByRole("dialog", { name: /Railora command palette/i })).toBeVisible();
  await page.getByPlaceholder(/Search transaction ID/i).fill("routing");
  await page.getByRole("button", { name: /Run routing simulation/i }).click();
  await expect(page.getByRole("heading", { name: /Routing decisions you can trust/i })).toBeVisible();

  await page.getByRole("link", { name: /^KYB$/i }).click();
  await page.getByRole("button", { name: /Run sandbox verification/i }).click();
  await expect(page.getByText(/Sandbox verification checks completed/i)).toBeVisible();

  await page.goto("/escrow/new");
  await page.getByRole("button", { name: /Create payment/i }).click();
  await expect(
    page.getByRole("heading", { name: /New supplier milestone order/i }),
  ).toBeVisible();
  await page.getByRole("button", { name: /^Fund payment$/i }).click();
  await expect(page.getByText(/Sandbox escrow funded/i)).toBeVisible();

  await page.goto("/auth");
  await page.locator("#role").selectOption("seller");
  await page.getByRole("button", { name: /Continue with mock UAE PASS/i }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/escrow/ord-006");
  await expect(
    page.getByRole("button", { name: /Seller submits proof/i }),
  ).toBeEnabled();
  await page.getByRole("button", { name: /Seller submits proof/i }).click();
  await expect(page.getByText(/Delivery proof submitted/i)).toBeVisible();
  await page.getByRole("button", { name: /Request release/i }).click();
  await expect(page.getByText(/Release requested from buyer/i)).toBeVisible();

  await page.goto("/auth");
  await page.locator("#role").selectOption("buyer");
  await page.getByRole("button", { name: /Continue with mock UAE PASS/i }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/escrow/ord-006");
  await expect(page.getByRole("button", { name: /Approve release/i })).toBeEnabled();
  await page.getByRole("button", { name: /Approve release/i }).click();
  await expect(page.getByText(/ledger balanced/i)).toBeVisible();
  await expect(page.getByText(/Debits AED/i)).toBeVisible();

  await page.goto("/auth");
  await page.locator("#role").selectOption("platform_admin");
  await page.getByRole("button", { name: /Continue with mock UAE PASS/i }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: /Railora risk and operations console/i }),
  ).toBeVisible();
  await expect(page.getByText(/Audit trail/i)).toBeVisible();

  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: /Visible controls/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Reveal customer mobile/i })).toBeVisible();
});
