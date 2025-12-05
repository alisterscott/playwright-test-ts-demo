import { expect, test } from "../fixtures";
import { goToPath } from "../lib/actions/nav";

test.describe("Unauthenticated tests", () => {
  test("can view as guest", async ({ page }) => {
    await goToPath(page, "auth");
    await expect(page.locator("text=Hello Please Sign In")).toBeVisible();
  });
});

test.describe("Admin tests", () => {
  test("can view as admin", async ({ pageAdmin }) => {
    await goToPath(pageAdmin, "auth");
    await expect(pageAdmin.locator("text=Welcome Admin User")).toBeVisible();
  });
});

test.describe("User tests", () => {
  test("can view as standard user", async ({ pageUser }) => {
    await goToPath(pageUser, "auth");
    await expect(
      pageUser.locator("text=Welcome Standard Person")
    ).toBeVisible();
  });
});
