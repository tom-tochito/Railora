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
