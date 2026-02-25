const { test } = require('@playwright/test');

const PAGE = '/index.html';

/**
 * Portfolio screenshots at 3 breakpoints.
 * Scrolls to bottom first to trigger all scroll-reveal animations,
 * then scrolls back to top and takes full-page screenshot.
 */

async function triggerAllReveals(page) {
  // Scroll incrementally to trigger IntersectionObserver for all elements
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = 400;
  for (let y = 0; y <= totalHeight; y += step) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(100);
  }
  // Final wait for animations
  await page.waitForTimeout(600);
  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

test('portfolio screenshot — 1440px desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(PAGE);
  await page.waitForTimeout(500);
  await triggerAllReveals(page);
  await page.screenshot({ path: 'tests/screenshots/portfolio-1440.png', fullPage: true });
});

test('portfolio screenshot — 768px tablet', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(PAGE);
  await page.waitForTimeout(500);
  await triggerAllReveals(page);
  await page.screenshot({ path: 'tests/screenshots/portfolio-768.png', fullPage: true });
});

test('portfolio screenshot — 375px mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(PAGE);
  await page.waitForTimeout(500);
  await triggerAllReveals(page);
  await page.screenshot({ path: 'tests/screenshots/portfolio-375.png', fullPage: true });
});

// Feature state screenshots with scroll reveals activated
test('feature screenshot — excellent state (450 DPI)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(PAGE);
  await page.fill('#pxWidth', '3600');
  await page.fill('#pxHeight', '4800');
  await page.fill('#targetWidth', '8');
  await page.fill('#targetHeight', '10');
  await page.locator('#pxWidth').dispatchEvent('input');
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    const n = document.getElementById('sampleNotice');
    if (n) n.remove();
  });
  const panel = page.locator('#calculator');
  await panel.screenshot({ path: 'tests/screenshots/portfolio-excellent.png' });
});

test('feature screenshot — borderline state (200 DPI)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(PAGE);
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
  await panel.screenshot({ path: 'tests/screenshots/portfolio-borderline.png' });
});

test('feature screenshot — fail state (109 DPI)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(PAGE);
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
  await panel.screenshot({ path: 'tests/screenshots/portfolio-fail.png' });
});
