import { test, expect } from "@playwright/test";

test.describe("Liaison Permissions page", () => {
  test.beforeEach(async ({ page }) => {
    const refreshToken = process.env["E2E_REFRESH_TOKEN"];

    await page.addInitScript((rt) => {
      window.localStorage.setItem("refresh-token", rt);
    }, refreshToken);

    await page.goto("/liaison-permissions");
  });

  // TODO: Remove John's info from E2E tests
  test("view liaison permissions, add a permission, and remove a permission", async ({
    page,
  }) => {
    await page.locator("#TagInput-2").fill("jtchampi");
    await page
      .getByText("John Champion (jtchampi@ncsu.edu) [200103374]")
      .click();

    await page.locator("#TagInput-4").fill("vrb");
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click();

    await page.locator("[test-id=assign-permission-btn]").click();

    await page.locator("[test-id=revoke-permission-btn]").first().click();

    await expect(
      page.getByRole("heading", { name: "Revoke Succeeded" })
    ).toBeVisible();
  });
});
