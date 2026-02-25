const { test, expect } = require('@playwright/test');

const PAGE_URL = 'file:///Users/admin/projects/FC/index.html';

test.describe('CF Studio Visual Alignment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test('page loads without JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto(PAGE_URL);
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });

  test('calculator still works', async ({ page }) => {
    await page.fill('#pxWidth', '3600');
    await page.fill('#pxHeight', '4800');
    await page.fill('#targetWidth', '8');
    await page.fill('#targetHeight', '10');
    // Trigger input event
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(200);
    const dpiText = await page.textContent('#dpiResult');
    expect(dpiText).toContain('DPI');
  });

  test('presets toggle', async ({ page }) => {
    const chip = page.locator('[data-preset="8x10"]');
    await chip.click();
    await expect(chip).toHaveClass(/active/);
    const targetW = await page.inputValue('#targetWidth');
    expect(targetW).toBe('8');
  });

  test('upload button exists and is clickable', async ({ page }) => {
    const uploadBtn = page.locator('#pickImageBtn');
    await expect(uploadBtn).toBeVisible();
    await expect(uploadBtn).toBeEnabled();
  });

  test('smart CTA shows after calculation', async ({ page }) => {
    await page.fill('#pxWidth', '3600');
    await page.fill('#pxHeight', '4800');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(300);
    const ctaBlock = page.locator('#smartCtaBlock');
    await expect(ctaBlock).toBeVisible();
  });

  test('copy share link button exists', async ({ page }) => {
    const btn = page.locator('#copyShareBtn');
    await expect(btn).toBeVisible();
  });

  test('font is Poppins everywhere — no Bodoni or IBM Plex', async ({ page }) => {
    const html = await page.content();
    expect(html).not.toContain('Bodoni');
    expect(html).not.toContain('IBM Plex');
    expect(html).toContain('Poppins');
  });

  test('purple CTA buttons, no teal/terracotta', async ({ page }) => {
    const html = await page.content();
    expect(html).not.toContain('#114b42');
    expect(html).not.toContain('#e04d2d');
    expect(html).toContain('#8559F9');
  });

  test('hero gradient is full-width', async ({ page }) => {
    const heroBand = page.locator('.hero-band');
    await expect(heroBand).toBeVisible();
    const box = await heroBand.boundingBox();
    const viewport = page.viewportSize();
    expect(box.width).toBe(viewport.width);
  });

  test('footer has 3 link columns', async ({ page }) => {
    const cols = page.locator('.footer-col');
    await expect(cols).toHaveCount(3);
  });

  test('header has Studio logo and CTA', async ({ page }) => {
    const logo = page.locator('.site-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveText('Studio');
    const cta = page.locator('.site-header-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText('Create a design');
  });

  test('screenshot at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'tests/screenshots/1440.png', fullPage: true });
  });

  test('screenshot at 768px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(PAGE_URL);
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'tests/screenshots/768.png', fullPage: true });
  });

  test('screenshot at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(PAGE_URL);
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'tests/screenshots/375.png', fullPage: true });
  });
});
