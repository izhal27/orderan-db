import { expect, test } from "@playwright/test";

const username = process.env.E2E_USERNAME;
const password = process.env.E2E_PASSWORD;

console.log(username);
console.log(password);

test.describe("auth", () => {
  test("signin validation shows errors", async ({ page }) => {
    await page.goto("/auth/signin");
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page.getByText("Username minimal 3 karakter")).toBeVisible();
    await expect(page.getByText("Password minimal 3 karakter")).toBeVisible();
  });

  test("signin succeeds with valid credentials", async ({ page }) => {
    test.skip(
      !username || !password,
      "Set E2E_USERNAME and E2E_PASSWORD to run this test",
    );

    await page.goto("/auth/signin");
    await page.getByLabel("Username anda").fill(username ?? "");
    await page.getByLabel("Password anda").fill(password ?? "");
    await page.getByRole("button", { name: /log in/i }).click();

    const loginError = page.getByText(
      "Gagal Log In, periksa username dan password anda.",
    );
    const dashboardTitle = page.getByText("Digital Berkah");

    await Promise.race([
      dashboardTitle.waitFor({ state: "visible", timeout: 20000 }),
      loginError.waitFor({ state: "visible", timeout: 20000 }),
    ]);

    if (await loginError.isVisible()) {
      throw new Error("Login failed: username/password invalid");
    }

    await expect(dashboardTitle).toBeVisible();
  });
});
