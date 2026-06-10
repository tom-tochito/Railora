import { expect, test } from "@playwright/test";

const routes = [
  { path: "/", hasTable: false },
  { path: "/auth", hasTable: false },
  { path: "/dashboard", hasTable: true },
  { path: "/verify", hasTable: false },
  { path: "/escrow/new", hasTable: false },
  { path: "/escrow/ord-001", hasTable: true },
  { path: "/invoices", hasTable: true },
  { path: "/score", hasTable: false },
  { path: "/disputes/disp-001", hasTable: false },
  { path: "/admin", hasTable: true },
];

const viewports = [
  { name: "compact", width: 320, height: 720 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small", width: 640, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 1000 },
];

for (const viewport of viewports) {
  test.describe(`responsive layout at ${viewport.name}`, () => {
    test.use({ viewport });

    for (const route of routes) {
      test(`${route.path} does not create page-level horizontal scroll`, async ({
        page,
      }) => {
        await page.goto(route.path);
        await page.waitForLoadState("networkidle");

        const overflow = await page.evaluate(() => {
          const documentElement = document.documentElement;
          const body = document.body;

          return {
            bodyScrollWidth: body.scrollWidth,
            clientWidth: documentElement.clientWidth,
            documentScrollWidth: documentElement.scrollWidth,
          };
        });

        expect(overflow.documentScrollWidth).toBeLessThanOrEqual(
          overflow.clientWidth + 1,
        );
        expect(overflow.bodyScrollWidth).toBeLessThanOrEqual(
          overflow.clientWidth + 1,
        );

        if (!route.hasTable) {
          return;
        }

        const tableScrollState = await page.locator("table").evaluateAll((tables) =>
          tables.map((table) => {
            let element = table.parentElement;

            while (element && element !== document.body) {
              const overflowX = window.getComputedStyle(element).overflowX;

              if (overflowX === "auto" || overflowX === "scroll") {
                return true;
              }

              element = element.parentElement;
            }

            return false;
          }),
        );

        expect(tableScrollState.length).toBeGreaterThan(0);
        expect(tableScrollState.every(Boolean)).toBe(true);
      });
    }
  });
}

test.describe("mobile workspace navigation", () => {
  test.use({ viewport: { width: 320, height: 720 } });

  test("bottom navigation is visible, touchable, and exposes secondary routes", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const nav = page.locator("[data-mobile-nav]");
    await expect(nav).toBeVisible();

    const targetSizes = await nav.locator("a, button").evaluateAll((items) =>
      items.map((item) => {
        const rect = item.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      }),
    );

    expect(targetSizes.length).toBeGreaterThanOrEqual(5);
    expect(targetSizes.every((item) => item.width >= 44 && item.height >= 44)).toBe(
      true,
    );

    await page.getByRole("button", { name: "More" }).click();
    await expect(page.locator("[data-mobile-more-menu]")).toBeVisible();
    await expect(page.getByRole("link", { name: /Trade score/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Admin console/i })).toBeVisible();
  });

  test("primary create-order action scrolls clear of the fixed nav", async ({
    page,
  }) => {
    await page.goto("/escrow/new");
    await page.waitForLoadState("networkidle");

    const nav = page.locator("[data-mobile-nav]");
    const createOrder = page.getByRole("button", { name: /Create order/i });

    await createOrder.scrollIntoViewIfNeeded();

    const navBox = await nav.boundingBox();
    const actionBox = await createOrder.boundingBox();

    expect(navBox).not.toBeNull();
    expect(actionBox).not.toBeNull();
    expect(actionBox!.y + actionBox!.height).toBeLessThanOrEqual(navBox!.y - 8);
  });
});

test.describe("desktop workspace navigation", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test("mobile navigation is hidden on desktop", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("[data-mobile-nav]")).toBeHidden();
  });
});
