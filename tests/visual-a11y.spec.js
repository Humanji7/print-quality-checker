const { test, expect } = require('@playwright/test');

const PAGE = '/index.html';

// --- DPI color coding ---

test.describe('DPI color coding', () => {
  test('green for DPI ≥ 300', async ({ page }) => {
    await page.goto(PAGE);
    await page.fill('#pxWidth', '3600');
    await page.fill('#pxHeight', '4800');
    await page.fill('#targetWidth', '8');
    await page.fill('#targetHeight', '10');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(200);

    const color = await page.locator('#dpiResult').evaluate(el => el.style.color);
    // rgb(22, 163, 74) = #16A34A
    expect(color).toContain('rgb(22, 163, 74)');
  });

  test('amber/yellow for DPI 180-299', async ({ page }) => {
    await page.goto(PAGE);
    // 2200/11 = 200 DPI
    await page.fill('#pxWidth', '2200');
    await page.fill('#pxHeight', '2800');
    await page.fill('#targetWidth', '11');
    await page.fill('#targetHeight', '14');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(200);

    const color = await page.locator('#dpiResult').evaluate(el => el.style.color);
    // rgb(217, 119, 6) = #D97706
    expect(color).toContain('rgb(217, 119, 6)');
  });

  test('red for DPI < 180', async ({ page }) => {
    await page.goto(PAGE);
    // 1200/11 ≈ 109 DPI
    await page.fill('#pxWidth', '1200');
    await page.fill('#pxHeight', '1600');
    await page.fill('#targetWidth', '11');
    await page.fill('#targetHeight', '14');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(200);

    const color = await page.locator('#dpiResult').evaluate(el => el.style.color);
    // rgb(220, 38, 38) = #DC2626
    expect(color).toContain('rgb(220, 38, 38)');
  });
});

// --- Quality bar ---

test.describe('Quality bar', () => {
  test('quality fill width > 0% after calculation', async ({ page }) => {
    await page.goto(PAGE);
    await page.fill('#pxWidth', '3600');
    await page.fill('#pxHeight', '4800');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(200);

    const width = await page.locator('#qualityFill').evaluate(el => el.style.width);
    expect(width).not.toBe('0%');
    expect(width).toBe('100%'); // 450 DPI = excellent = 100%
  });

  test('quality text shows band label', async ({ page }) => {
    await page.goto(PAGE);
    await page.fill('#pxWidth', '3600');
    await page.fill('#pxHeight', '4800');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(200);

    const text = await page.textContent('#qualityText');
    expect(text).toBe('Excellent print');
  });
});

// --- Sample notice ---

test.describe('Sample notice', () => {
  test('shows on fresh load without URL params', async ({ page }) => {
    await page.goto(PAGE);
    const notice = page.locator('#sampleNotice');
    await expect(notice).toBeVisible();
    const text = await notice.textContent();
    expect(text).toContain('sample');
  });

  test('disappears on first input interaction', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('#sampleNotice')).toBeVisible();

    await page.fill('#pxWidth', '2000');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(200);

    await expect(page.locator('#sampleNotice')).toHaveCount(0);
  });
});

// --- Scroll reveal ---

test.describe('Scroll reveal', () => {
  test('elements below fold have reveal class', async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForTimeout(500);

    const revealCount = await page.locator('.reveal').count();
    expect(revealCount).toBeGreaterThan(0);
  });

  test('elements become visible after scrolling', async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForTimeout(300);

    // Before scroll: benefit cards should have reveal but not visible
    const benefitCards = page.locator('.benefit-card.reveal');
    const countBefore = await benefitCards.count();
    expect(countBefore).toBeGreaterThan(0);

    // Scroll to bottom to trigger all reveals
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);

    const visibleCount = await page.locator('.reveal.visible').count();
    expect(visibleCount).toBeGreaterThan(0);
  });
});

// --- Hero gradient full-width ---

test.describe('Hero', () => {
  test('hero-band is full viewport width', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE);

    const heroBand = page.locator('.hero-band');
    await expect(heroBand).toBeVisible();
    const box = await heroBand.boundingBox();
    expect(box.width).toBe(1440);
  });

  test('hero-band full-width on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(PAGE);

    const box = await page.locator('.hero-band').boundingBox();
    expect(box.width).toBe(375);
  });
});

// --- Footer responsive: 3 → 2 → 1 columns ---

test.describe('Footer responsive', () => {
  test('3 footer-col present in DOM', async ({ page }) => {
    await page.goto(PAGE);
    const cols = page.locator('.footer-col');
    await expect(cols).toHaveCount(3);
  });

  test('desktop: footer columns layout', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const cols = await page.locator('.footer-col').all();
    const tops = [];
    for (const col of cols) {
      const box = await col.boundingBox();
      tops.push(Math.round(box.y));
    }
    // On desktop, all 3 columns should be roughly same top (same row)
    expect(Math.abs(tops[0] - tops[1])).toBeLessThan(5);
    expect(Math.abs(tops[1] - tops[2])).toBeLessThan(5);
  });

  test('480px: footer stacks to 1 column', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(PAGE);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const cols = await page.locator('.footer-col').all();
    const tops = [];
    for (const col of cols) {
      const box = await col.boundingBox();
      tops.push(Math.round(box.y));
    }
    // In single-column layout, each column should have different top
    expect(tops[0]).toBeLessThan(tops[1]);
    expect(tops[1]).toBeLessThan(tops[2]);
  });
});

// --- Brand check ---

test.describe('Brand consistency', () => {
  test('Poppins font, no Bodoni/IBM Plex', async ({ page }) => {
    await page.goto(PAGE);
    const html = await page.content();
    expect(html).toContain('Poppins');
    expect(html).not.toContain('Bodoni');
    expect(html).not.toContain('IBM Plex');
  });

  test('purple buttons (#8559F9), no teal (#114b42)', async ({ page }) => {
    await page.goto(PAGE);
    const html = await page.content();
    expect(html).toContain('#8559F9');
    expect(html).not.toContain('#114b42');
    expect(html).not.toContain('#e04d2d');
  });

  test('header has Studio logo and CTA', async ({ page }) => {
    await page.goto(PAGE);
    const logo = page.locator('.site-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveText('Studio');

    const cta = page.locator('.site-header-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText('Create a design');
  });
});

// --- Responsive: nav hides on mobile ---

test.describe('Responsive layout', () => {
  test('nav visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE);
    await expect(page.locator('.site-nav')).toBeVisible();
  });

  test('nav hidden on mobile (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(PAGE);
    await expect(page.locator('.site-nav')).not.toBeVisible();
  });

  test('subhead hints hidden on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(PAGE);
    const hints = page.locator('.subhead .hint');
    const count = await hints.count();
    for (let i = 0; i < count; i++) {
      await expect(hints.nth(i)).not.toBeVisible();
    }
  });
});

// --- A11y ---

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
  });

  test('preset chips have aria-pressed', async ({ page }) => {
    const chips = page.locator('[data-preset]');
    const count = await chips.count();
    expect(count).toBe(6);
    for (let i = 0; i < count; i++) {
      const pressed = await chips.nth(i).getAttribute('aria-pressed');
      expect(['true', 'false']).toContain(pressed);
    }
  });

  test('preset grid has role=group and aria-label', async ({ page }) => {
    const grid = page.locator('#presetGrid');
    expect(await grid.getAttribute('role')).toBe('group');
    expect(await grid.getAttribute('aria-label')).toContain('presets');
  });

  test('upload drop zone has role=button and tabindex', async ({ page }) => {
    const zone = page.locator('#uploadDropZone');
    expect(await zone.getAttribute('role')).toBe('button');
    expect(await zone.getAttribute('tabindex')).toBe('0');
  });

  test('verdict area has aria-live', async ({ page }) => {
    const verdict = page.locator('#verdictArea');
    expect(await verdict.getAttribute('aria-live')).toBe('polite');
  });

  test('calculator panel has aria-labelledby', async ({ page }) => {
    const panel = page.locator('#calculator');
    expect(await panel.getAttribute('aria-labelledby')).toBe('calc-title');
  });

  test('quality score section has aria-label', async ({ page }) => {
    const quality = page.locator('.quality');
    expect(await quality.getAttribute('aria-label')).toContain('Quality');
  });

  test('keyboard: Enter on drop zone triggers file input focus', async ({ page }) => {
    const zone = page.locator('#uploadDropZone');
    await zone.focus();
    // Just verify focus works (Enter would trigger file dialog which we can't test directly)
    await expect(zone).toBeFocused();
  });

  test('keyboard: Tab navigation through calculator inputs', async ({ page }) => {
    // Focus first input and tab through
    await page.locator('#pxWidth').focus();
    await expect(page.locator('#pxWidth')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('#pxHeight')).toBeFocused();
  });

  test('prefers-reduced-motion disables animations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(PAGE);

    // .reveal elements should be visible (opacity: 1) without animation
    const revealStyle = await page.locator('.reveal').first().evaluate(el => {
      const computed = window.getComputedStyle(el);
      return { opacity: computed.opacity, transform: computed.transform };
    });
    expect(revealStyle.opacity).toBe('1');
  });
});
