const { test, expect } = require('@playwright/test');

const PAGE_URL = 'file:///Users/admin/projects/FC/index.html';

test('capture excellent state', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 });
  await page.goto(PAGE_URL);
  // Default: 3600x4800 at 8x10 = 450 DPI = Excellent
  await page.fill('#pxWidth', '3600');
  await page.fill('#pxHeight', '4800');
  await page.fill('#targetWidth', '8');
  await page.fill('#targetHeight', '10');
  await page.locator('#pxWidth').dispatchEvent('input');
  await page.waitForTimeout(400);
  // Remove sample notice if present
  await page.evaluate(() => {
    const n = document.getElementById('sampleNotice');
    if (n) n.remove();
  });
  const panel = page.locator('#calculator');
  await panel.screenshot({ path: 'tests/screenshots/feature-excellent.png' });
});

test('capture borderline state', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 });
  await page.goto(PAGE_URL);
  await page.fill('#pxWidth', '2200');
  await page.fill('#pxHeight', '2800');
  await page.fill('#targetWidth', '11');
  await page.fill('#targetHeight', '14');
  await page.locator('#pxWidth').dispatchEvent('input');
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    const n = document.getElementById('sampleNotice');
    if (n) n.remove();
  });
  const panel = page.locator('#calculator');
  await panel.screenshot({ path: 'tests/screenshots/feature-borderline.png' });
});

test('capture fail state', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 });
  await page.goto(PAGE_URL);
  await page.fill('#pxWidth', '1200');
  await page.fill('#pxHeight', '1600');
  await page.fill('#targetWidth', '11');
  await page.fill('#targetHeight', '14');
  await page.locator('#pxWidth').dispatchEvent('input');
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    const n = document.getElementById('sampleNotice');
    if (n) n.remove();
  });
  const panel = page.locator('#calculator');
  await panel.screenshot({ path: 'tests/screenshots/feature-fail.png' });
});
