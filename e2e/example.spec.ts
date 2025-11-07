import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
});

test("signin page shows welcome heading", async ({ page }) => {
  await page.goto("/auth/signin");
  await expect(page.getByText(/welcome back/i)).toBeVisible();
});
