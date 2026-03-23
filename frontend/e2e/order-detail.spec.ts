import { expect, test } from "@playwright/test";

const orderId = process.env.E2E_ORDER_ID;

async function confirmAction(page: import("@playwright/test").Page) {
  await expect(
    page.getByText("Aksi ini akan mengubah status pesanan."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Lanjutkan" }).click();
}

test.describe("order detail (admin)", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ storageState: "e2e/.auth/admin.json" });
  test("shows key sections and actions for admin", async ({ page }) => {
    test.skip(!orderId, "Set E2E_ORDER_ID to run this test");
    await page.goto(`/orders/list/detail/${orderId}`);

    await expect(page.getByText("Detail Pesanan")).toBeVisible();
    await expect(page.getByText("Daftar Item Pesanan")).toBeVisible();
    await expect(page.getByText("Status Bayar")).toBeVisible();
    await expect(page.getByText("Status Ambil")).toBeVisible();

    await expect(page.getByLabel("Cetak Semua")).toBeVisible();
    await expect(page.getByLabel("Dibayar")).toBeVisible();
    await expect(page.getByLabel("Diambil")).toBeVisible();
  });

  test("opens confirm modal for cetak semua when enabled", async ({ page }) => {
    test.skip(!orderId, "Set E2E_ORDER_ID to run this test");
    await page.goto(`/orders/list/detail/${orderId}`);

    const cetakSemua = page.getByLabel("Cetak Semua");
    await expect(cetakSemua).toBeVisible();

    if (await cetakSemua.isDisabled()) {
      await expect(cetakSemua).toBeDisabled();
      return;
    }

    await cetakSemua.click();

    await expect(
      page.getByText("Aksi ini akan mengubah status pesanan."),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Lanjutkan" })).toBeVisible();
    await page.getByRole("button", { name: "Batal" }).click();

    await expect(
      page.getByText("Aksi ini akan mengubah status pesanan."),
    ).not.toBeVisible();
  });

  test("toggle status dibayar and update status card", async ({ page }) => {
    test.skip(!orderId, "Set E2E_ORDER_ID to run this test");
    await page.goto(`/orders/list/detail/${orderId}`);

    const statusBayarCard = page.getByText("Status Bayar").locator("..");
    const wasPaid = await statusBayarCard
      .getByText("Selesai")
      .isVisible()
      .catch(() => false);

    await page.getByLabel("Dibayar").click();
    await confirmAction(page);

    if (wasPaid) {
      await expect(statusBayarCard.getByText("Belum Dibayar")).toBeVisible();
    } else {
      await expect(statusBayarCard.getByText("Selesai")).toBeVisible();
    }
  });

  test("toggle status diambil when available", async ({ page }) => {
    test.skip(!orderId, "Set E2E_ORDER_ID to run this test");
    await page.goto(`/orders/list/detail/${orderId}`);

    const cetakSemua = page.getByLabel("Cetak Semua");
    if (await cetakSemua.isVisible()) {
      const disabled = await cetakSemua.isDisabled();
      if (!disabled && !(await cetakSemua.isChecked())) {
        await cetakSemua.click();
        await confirmAction(page);
        await expect(cetakSemua).toBeChecked();
      }
    }

    const diambil = page.getByLabel("Diambil");
    if (await diambil.isDisabled()) {
      return;
    }

    const statusAmbilCard = page.getByText("Status Ambil").locator("..");
    const wasTaken = await statusAmbilCard
      .getByText("Selesai")
      .isVisible()
      .catch(() => false);

    await diambil.click();
    await confirmAction(page);

    if (wasTaken) {
      await expect(statusAmbilCard.getByText("Belum Diambil")).toBeVisible();
    } else {
      await expect(statusAmbilCard.getByText("Selesai")).toBeVisible();
    }
  });

  test("toggle status dibayar and revert to original", async ({ page }) => {
    test.skip(!orderId, "Set E2E_ORDER_ID to run this test");
    await page.goto(`/orders/list/detail/${orderId}`);

    const statusBayarCard = page.getByText("Status Bayar").locator("..");
    const wasPaid = await statusBayarCard
      .getByText("Selesai")
      .isVisible()
      .catch(() => false);

    await page.getByLabel("Dibayar").click();
    await confirmAction(page);
    await page.getByLabel("Dibayar").click();
    await confirmAction(page);

    if (wasPaid) {
      await expect(statusBayarCard.getByText("Selesai")).toBeVisible();
    } else {
      await expect(statusBayarCard.getByText("Belum Dibayar")).toBeVisible();
    }
  });

});

test.describe("order detail (operator)", () => {
  test.use({ storageState: "e2e/.auth/operator.json" });

  test("operator cannot see Dibayar/Diambil actions", async ({ page }) => {
    test.skip(!orderId, "Set E2E_ORDER_ID to run this test");
    await page.goto(`/orders/list/detail/${orderId}`);

    await expect(page.getByLabel("Cetak Semua")).toBeVisible();
    await expect(page.getByLabel("Dibayar")).toHaveCount(0);
    await expect(page.getByLabel("Diambil")).toHaveCount(0);
  });
});
