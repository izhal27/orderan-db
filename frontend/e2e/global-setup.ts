import { chromium, type FullConfig, expect } from "@playwright/test";

const username = process.env.E2E_USERNAME;
const password = process.env.E2E_PASSWORD;
const operatorUsername = process.env.E2E_OPERATOR_USERNAME;
const operatorPassword = process.env.E2E_OPERATOR_PASSWORD;

async function loginAndSaveState(
  baseURL: string,
  user: string,
  pass: string,
  storagePath: string,
) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${baseURL}/auth/signin`);
  await page.getByLabel("Username anda").fill(user);
  await page.getByLabel("Password anda").fill(pass);
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
  await page.context().storageState({ path: storagePath });
  await browser.close();
}

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL as string;

  if (username && password) {
    await loginAndSaveState(
      baseURL,
      username,
      password,
      "e2e/.auth/admin.json",
    );
  }

  if (operatorUsername && operatorPassword) {
    await loginAndSaveState(
      baseURL,
      operatorUsername,
      operatorPassword,
      "e2e/.auth/operator.json",
    );
  }
}
