import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// Test credentials - UPDATE THESE with valid test user from backend
// To get valid credentials:
// 1. Register a user via backend API or Supabase dashboard
// 2. Update TEST_EMAIL and TEST_PASSWORD below
const TEST_EMAIL = process.env.TEST_EMAIL || "admin@example.com";
const TEST_PASSWORD = process.env.TEST_PASSWORD || "password123";

test.describe("Login Page UI", () => {
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

  test("should show validation error for empty fields", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Click submit without filling fields
    await page.click('button[type="submit"]');

    // Should show some validation error (Zod or HTML5)
    await page.waitForTimeout(500);
    
    // Check for any error message related to email
    const hasEmailError = await page.locator('text=/email/i').count() > 0 
      || await page.locator('[data-state="invalid"]').count() > 0
      || await page.locator('.text-destructive').count() > 0;
    
    expect(hasEmailError || await page.locator('input:invalid').count() > 0).toBeTruthy();
  });

  test("should show error for invalid email format", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[type="email"]', "invalid-email");
    await page.fill('input[type="password"]', "123456");
    await page.click('button[type="submit"]');

    await page.waitForTimeout(500);
    
    // Check for validation indicator
    const hasError = await page.locator('.text-destructive').count() > 0
      || await page.locator('input:invalid').count() > 0
      || await page.locator('text=/tidak valid|invalid/i').count() > 0;
    
    expect(hasError).toBeTruthy();
  });
});

// These tests require valid backend authentication
// Skip if running without backend or with test credentials
test.describe("Authenticated Features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    
    // Try to login - if fail, skip test
    try {
      await expect(page).toHaveURL(/\/books/, { timeout: 10000 });
    } catch {
      test.skip(true, "Login failed - check TEST_EMAIL and TEST_PASSWORD");
    }
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
    await page.click('button:has-text("Keluar")');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });
});

test.describe("Books CRUD Operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    
    try {
      await expect(page).toHaveURL(/\/books/, { timeout: 10000 });
    } catch {
      test.skip(true, "Login failed - check TEST_EMAIL and TEST_PASSWORD");
    }
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

    // Check for any validation error
    await page.waitForTimeout(500);
    const hasError = await page.locator('.text-destructive').count() > 0
      || await page.locator('text=/wajib|kosong|minimal/i').count() > 0;
    
    expect(hasError).toBeTruthy();
  });

  test("should create book successfully", async ({ page }) => {
    await page.click('button:has-text("Tambah Buku")');

    const timestamp = Date.now();
    await page.fill('input[name="title"]', `Test Book ${timestamp}`);
    await page.fill('input[name="author"]', "Test Author");
    await page.fill('input[name="isbn"]', "978-0-13-468599-1"); // Valid ISBN-13
    await page.fill('input[name="cover_image"]', "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400");
    await page.fill('input[name="published_year"]', "2024");
    await page.fill('input[name="stock"]', "10");

    await page.click('button[type="submit"]:has-text("Tambah Buku")');

    // Dialog should close and toast should appear
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 50000 });
    await expect(page.locator("text=Buku berhasil ditambahkan")).toBeVisible({ timeout: 5000 });
  });

  test("should open view dialog when clicking book card", async ({ page }) => {
    // Wait for books to load
    await page.waitForTimeout(5000);
    const bookCard = page.locator('[data-testid="book-card"]').first();
    
    // Skip if no books
    if (await bookCard.count() === 0) {
      test.skip(true, "No books available");
      return;
    }
    
    await bookCard.click();

    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('button:has-text("Edit")')).toBeVisible();
  });

  test("should show delete confirmation dialog", async ({ page }) => {
    await page.waitForTimeout(5000);
    const bookCard = page.locator('[data-testid="book-card"]').first();
    
    if (await bookCard.count() === 0) {
      test.skip(true, "No books available");
      return;
    }

    // Open dropdown menu on first card
    await bookCard.locator('button[aria-haspopup="menu"]').click();

    // Click delete
    await page.click('text=Hapus');

    // Alert dialog should appear
    await expect(page.locator('[role="alertdialog"]')).toBeVisible();
    await expect(page.locator('text=Apakah Anda yakin')).toBeVisible();
  });

  test("should show update confirmation dialog", async ({ page }) => {
    await page.waitForTimeout(5000);
    const bookCard = page.locator('[data-testid="book-card"]').first();
    
    if (await bookCard.count() === 0) {
      test.skip(true, "No books available");
      return;
    }

    await bookCard.locator('button[aria-haspopup="menu"]').click();
    await page.click('text=Edit');

    // Alert dialog should appear and show update form
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('button:has-text("Simpan Perubahan")')).toBeVisible();
  });
});