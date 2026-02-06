import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

// Test credentials - should match test user in backend
const TEST_EMAIL = "test@example.com";
const TEST_PASSWORD = "password123";

test.describe("Authentication Flow", () => {
  test("should redirect to login page when accessing protected route without session", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/books`);
    await expect(page).toHaveURL(/\/login/);
  });

  test("should show login form elements", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should show validation error for invalid email", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[type="email"]', "invalid-email");
    await page.fill('input[type="password"]', "123456");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Email tidak valid")).toBeVisible();
  });

  test("should show error for wrong credentials", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[type="email"]', "wrong@email.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Wait for API response and error message
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10000 });
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    // Should redirect to books page after successful login
    await expect(page).toHaveURL(/\/books/, { timeout: 10000 });
  });
});

test.describe("Dashboard & Navigation", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/books/, { timeout: 10000 });
  });

  test("should display books page with header", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Daftar Buku");
  });

  test("should have search input", async ({ page }) => {
    await expect(page.locator('input[placeholder="Cari buku..."]')).toBeVisible();
  });

  test("should have add book button", async ({ page }) => {
    await expect(page.locator("button", { hasText: "Tambah Buku" })).toBeVisible();
  });

  test("should update URL when searching", async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Cari buku..."]');
    await searchInput.fill("Harry");

    // Wait for debounce
    await page.waitForTimeout(600);

    await expect(page).toHaveURL(/search=Harry/);
  });

  test("should update URL when changing sort", async ({ page }) => {
    // Click sort dropdown
    await page.click('button:has-text("Urutkan")');

    // Click sort option
    await page.click('text=Judul (Z-A)');

    await expect(page).toHaveURL(/order=desc/);
  });

  test("should logout successfully", async ({ page }) => {
    // Click logout button
    await page.click('button:has-text("Logout")');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });
});

test.describe("Books CRUD Operations", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/books/, { timeout: 10000 });
  });

  test("should open create dialog when clicking add button", async ({ page }) => {
    await page.click('button:has-text("Tambah Buku")');

    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=Tambah Buku Baru')).toBeVisible();
  });

  test("should show validation errors on empty form submit", async ({ page }) => {
    await page.click('button:has-text("Tambah Buku")');

    // Clear default values and submit
    await page.fill('input[name="title"]', "");
    await page.click('button[type="submit"]:has-text("Tambah Buku")');

    await expect(page.locator("text=Judul minimal 3 karakter")).toBeVisible();
  });

  test("should create book successfully", async ({ page }) => {
    await page.click('button:has-text("Tambah Buku")');

    await page.fill('input[name="title"]', "Test Book E2E");
    await page.fill('input[name="author"]', "Test Author");
    await page.fill('input[name="isbn"]', "1234567890");
    await page.fill('input[name="published_year"]', "2024");
    await page.fill('input[name="stock"]', "10");

    await page.click('button[type="submit"]:has-text("Tambah Buku")');

    // Dialog should close and toast should appear
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=Buku berhasil ditambahkan")).toBeVisible();
  });

  test("should open view dialog when clicking book card", async ({ page }) => {
    // Wait for books to load
    await page.waitForSelector('[data-testid="book-card"]', { timeout: 10000 });

    // Click first book card
    await page.click('[data-testid="book-card"]:first-child');

    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('button:has-text("Edit")')).toBeVisible();
  });

  test("should show delete confirmation dialog", async ({ page }) => {
    // Wait for books to load
    await page.waitForSelector('[data-testid="book-card"]', { timeout: 10000 });

    // Open dropdown menu on first card
    await page.click('[data-testid="book-card"]:first-child button[aria-haspopup="menu"]');

    // Click delete
    await page.click('text=Hapus');

    // Alert dialog should appear
    await expect(page.locator('[role="alertdialog"]')).toBeVisible();
    await expect(page.locator('text=Apakah Anda yakin')).toBeVisible();
  });

  test("should cancel delete when clicking cancel button", async ({ page }) => {
    await page.waitForSelector('[data-testid="book-card"]', { timeout: 10000 });

    await page.click('[data-testid="book-card"]:first-child button[aria-haspopup="menu"]');
    await page.click('text=Hapus');

    // Click cancel
    await page.click('button:has-text("Batal")');

    // Alert dialog should close
    await expect(page.locator('[role="alertdialog"]')).not.toBeVisible();
  });
});

test.describe("Pagination", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/books/, { timeout: 10000 });
  });

  test("should navigate to next page", async ({ page }) => {
    // Only test if there are multiple pages
    const nextButton = page.locator('button[aria-label="Next page"]');

    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await expect(page).toHaveURL(/page=2/);
    }
  });

  test("should navigate to specific page number", async ({ page }) => {
    // Check if page 2 button exists
    const page2Button = page.locator("button", { hasText: "2" });

    if (await page2Button.isVisible()) {
      await page2Button.click();
      await expect(page).toHaveURL(/page=2/);
    }
  });
});
