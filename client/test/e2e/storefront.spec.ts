import { expect, test } from "@playwright/test";

test("catalogue to product page and basket lifecycle", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Shop all" })).toBeVisible();
  await expect(page.locator(".catalog-result-count")).toHaveText(/^\d+ products?$/);

  await page.getByRole("link", { name: "View Energy saving light bulb" }).first().click();
  await expect(page).toHaveURL(/\/product\?productId=\d+/);
  await expect(page.getByRole("heading", { name: "Energy saving light bulb" })).toBeVisible();

  await page.getByRole("button", { name: "Increase quantity" }).click();
  await page.getByRole("button", { name: "Add to cart" }).click();
  const basketButton = page.getByRole("button", { name: "Basket, 2 items" });
  await expect(basketButton).toBeVisible();
  await basketButton.click();

  const drawer = page.getByRole("dialog", { name: "Your basket" });
  await expect(drawer).toContainText("Energy saving light bulb");
  await expect(drawer).toContainText("£25.98");
  await expect(drawer.getByText("Subtotal").locator("..")).toContainText("£25.98");

  await drawer.getByRole("button", { name: "Decrease Energy saving light bulb quantity" }).click();
  await expect(page.getByRole("button", { name: "Basket, 1 items" })).toBeVisible();
  await expect(drawer.getByText("Subtotal").locator("..")).toContainText("£12.99");
  await drawer.getByRole("button", { name: "Checkout" }).click();
  await expect(drawer).toBeVisible();

  await drawer.getByRole("button", { name: "Remove Energy saving light bulb" }).click();
  await expect(drawer.getByText("Your basket is empty.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Basket, 0 items" })).toBeVisible();
});

test("basket uses a bottom sheet on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/product?productId=1");
  await expect(page.getByRole("heading", { name: "Energy saving light bulb" })).toBeVisible();
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.getByRole("button", { name: "Basket, 1 items" }).click();

  const drawer = page.getByRole("dialog", { name: "Your basket" });
  await expect(drawer).toBeVisible();
  await expect(drawer).toHaveCSS("border-top-left-radius", "18px");
  const bounds = await drawer.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.y + bounds!.height).toBeGreaterThanOrEqual(843);
});
