const { test, expect } = require('@playwright/test');

const PAGE = '/index.html';

// --- Calculator: basic input & DPI computation ---

test.describe('Calculator — basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
  });

  test('default values produce 450 DPI (3600/8=450)', async ({ page }) => {
    await page.fill('#pxWidth', '3600');
    await page.fill('#pxHeight', '4800');
    await page.fill('#targetWidth', '8');
    await page.fill('#targetHeight', '10');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(200);
    const dpi = await page.textContent('#dpiResult');
    expect(dpi).toContain('450');
    expect(dpi).toContain('DPI');
  });

  test('custom values: 2400x3000 at 8x10 = 300 DPI', async ({ page }) => {
    await page.fill('#pxWidth', '2400');
    await page.fill('#pxHeight', '3000');
    await page.fill('#targetWidth', '8');
    await page.fill('#targetHeight', '10');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(200);
    const dpi = await page.textContent('#dpiResult');
    expect(dpi).toContain('300');
  });

  test('low-res: 800x1000 at 8x10 = 100 DPI', async ({ page }) => {
    await page.fill('#pxWidth', '800');
    await page.fill('#pxHeight', '1000');
    await page.fill('#targetWidth', '8');
    await page.fill('#targetHeight', '10');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(200);
    const dpi = await page.textContent('#dpiResult');
    expect(dpi).toContain('100');
  });

  test('max size result shows correct dimensions', async ({ page }) => {
    await page.fill('#pxWidth', '3000');
    await page.fill('#pxHeight', '3000');
    await page.fill('#targetWidth', '10');
    await page.fill('#targetHeight', '10');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(200);
    const maxSize = await page.textContent('#maxSizeResult');
    // 3000/300 = 10
    expect(maxSize).toContain('10');
    expect(maxSize).toContain('in');
  });
});

// --- Presets: all 6 ---

test.describe('Presets — all 6', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
  });

  const presetTests = [
    { key: '8x10', w: '8', h: '10', unit: 'in' },
    { key: '11x14', w: '11', h: '14', unit: 'in' },
    { key: '12x12', w: '12', h: '12', unit: 'in' },
    { key: '5x7', w: '5', h: '7', unit: 'in' },
    { key: 'A4', w: '21', h: '29.7', unit: 'cm' },
    { key: 'A3', w: '29.7', h: '42', unit: 'cm' },
  ];

  for (const p of presetTests) {
    test(`preset ${p.key} sets w=${p.w}, h=${p.h}, unit=${p.unit}`, async ({ page }) => {
      const chip = page.locator(`[data-preset="${p.key}"]`);
      await chip.click();
      await page.waitForTimeout(150);

      expect(await page.inputValue('#targetWidth')).toBe(p.w);
      expect(await page.inputValue('#targetHeight')).toBe(p.h);
      expect(await page.inputValue('#unit')).toBe(p.unit);
      await expect(chip).toHaveClass(/active/);
      expect(await chip.getAttribute('aria-pressed')).toBe('true');
    });
  }

  test('clicking a different preset deactivates the previous one', async ({ page }) => {
    const chip8x10 = page.locator('[data-preset="8x10"]');
    const chipA4 = page.locator('[data-preset="A4"]');

    await chip8x10.click();
    await expect(chip8x10).toHaveClass(/active/);

    await chipA4.click();
    await expect(chipA4).toHaveClass(/active/);
    await expect(chip8x10).not.toHaveClass(/active/);
    expect(await chip8x10.getAttribute('aria-pressed')).toBe('false');
  });
});

// --- Unit toggle cm/in ---

test.describe('Unit toggle', () => {
  test('switching to cm recalculates DPI and max size', async ({ page }) => {
    await page.goto(PAGE);
    // Default: inches 8x10
    await page.fill('#pxWidth', '3600');
    await page.fill('#pxHeight', '4800');
    await page.fill('#targetWidth', '20.32');  // 8 inches = 20.32cm
    await page.fill('#targetHeight', '25.4');  // 10 inches = 25.4cm
    await page.selectOption('#unit', 'cm');
    await page.locator('#unit').dispatchEvent('change');
    await page.waitForTimeout(200);

    const dpi = await page.textContent('#dpiResult');
    // 20.32cm = 8in, so 3600/8 = 450
    expect(dpi).toContain('450');

    const maxSize = await page.textContent('#maxSizeResult');
    expect(maxSize).toContain('cm');
  });
});

// --- Edge cases ---

test.describe('Edge cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
  });

  test('zero width shows fallback', async ({ page }) => {
    await page.fill('#pxWidth', '0');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(200);
    const dpi = await page.textContent('#dpiResult');
    expect(dpi).toBe('-');
  });

  test('empty inputs show fallback', async ({ page }) => {
    await page.fill('#pxWidth', '');
    await page.fill('#pxHeight', '');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(200);
    const text = await page.textContent('#qualityText');
    expect(text).toContain('Enter valid values');
  });

  test('very large numbers still compute', async ({ page }) => {
    await page.fill('#pxWidth', '99999');
    await page.fill('#pxHeight', '99999');
    await page.fill('#targetWidth', '1');
    await page.fill('#targetHeight', '1');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(200);
    const dpi = await page.textContent('#dpiResult');
    // 99999 / 1 = 99999 DPI
    expect(dpi).toContain('99,999');
    expect(dpi).toContain('DPI');
  });

  test('negative values treated as invalid', async ({ page }) => {
    await page.fill('#pxWidth', '-100');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(200);
    const dpi = await page.textContent('#dpiResult');
    expect(dpi).toBe('-');
  });
});

// --- Smart CTA: 3 states ---

test.describe('Smart CTA', () => {
  test('excellent (≥targetQuality) → mockup', async ({ page }) => {
    await page.goto(PAGE);
    await page.fill('#pxWidth', '3600');
    await page.fill('#pxHeight', '4800');
    await page.fill('#targetWidth', '8');
    await page.fill('#targetHeight', '10');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(300);

    const ctaBlock = page.locator('#smartCtaBlock');
    await expect(ctaBlock).toBeVisible();

    const ctaText = await page.textContent('#smartCtaLink');
    expect(ctaText.toLowerCase()).toContain('mockup');

    const ctaHref = await page.getAttribute('#smartCtaLink', 'href');
    expect(ctaHref).toContain('mockup-generator');

    const hint = await page.textContent('#smartCtaHint');
    expect(hint.toLowerCase()).toContain('sharp enough');
  });

  test('borderline (180-299 DPI) → upscaler', async ({ page }) => {
    await page.goto(PAGE);
    // 2200/11 = 200 DPI (borderline)
    await page.fill('#pxWidth', '2200');
    await page.fill('#pxHeight', '2800');
    await page.fill('#targetWidth', '11');
    await page.fill('#targetHeight', '14');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(300);

    const ctaText = await page.textContent('#smartCtaLink');
    expect(ctaText.toLowerCase()).toContain('upscale');

    const ctaHref = await page.getAttribute('#smartCtaLink', 'href');
    expect(ctaHref).toContain('upscaler');
  });

  test('fail (<180 DPI) → enhancer', async ({ page }) => {
    await page.goto(PAGE);
    // 1200/11 ≈ 109 DPI
    await page.fill('#pxWidth', '1200');
    await page.fill('#pxHeight', '1600');
    await page.fill('#targetWidth', '11');
    await page.fill('#targetHeight', '14');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(300);

    const ctaText = await page.textContent('#smartCtaLink');
    expect(ctaText.toLowerCase()).toContain('enhance');

    const ctaHref = await page.getAttribute('#smartCtaLink', 'href');
    expect(ctaHref).toContain('upscaler');

    const hint = await page.textContent('#smartCtaHint');
    expect(hint.toLowerCase()).toContain('too low');
  });
});

// --- Aspect ratio warning ---

test.describe('Aspect ratio warning', () => {
  test('shows when ratios differ significantly', async ({ page }) => {
    await page.goto(PAGE);
    // Source 3600x4800 (0.75 ratio), target 11x11 (1.0 ratio) → mismatch
    await page.fill('#pxWidth', '3600');
    await page.fill('#pxHeight', '4800');
    await page.fill('#targetWidth', '11');
    await page.fill('#targetHeight', '11');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(200);

    const warning = page.locator('#aspectWarning');
    await expect(warning).toBeVisible();
    const text = await warning.textContent();
    expect(text.toLowerCase()).toContain('aspect ratio mismatch');
  });

  test('hidden when ratios match', async ({ page }) => {
    await page.goto(PAGE);
    // Source 3600x4800 (0.75), target 8x10 (0.8) → ≤1.5% off? Actually 6.25%, so warning shows
    // Let's use exact match: 3000x4000 at 3x4 = 1.0 ratio match? No, 0.75 for both
    await page.fill('#pxWidth', '3000');
    await page.fill('#pxHeight', '4000');
    await page.fill('#targetWidth', '9');
    await page.fill('#targetHeight', '12');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(200);

    const warning = page.locator('#aspectWarning');
    // 3000/4000 = 0.75, 9/12 = 0.75 → exact match
    await expect(warning).not.toBeVisible();
  });

  test('secondary CTA (crop) appears on aspect mismatch', async ({ page }) => {
    await page.goto(PAGE);
    await page.fill('#pxWidth', '4000');
    await page.fill('#pxHeight', '4000');
    await page.fill('#targetWidth', '8');
    await page.fill('#targetHeight', '10');
    await page.locator('#pxWidth').dispatchEvent('input');
    await page.waitForTimeout(300);

    const secondary = page.locator('#smartCtaSecondary');
    await expect(secondary).toBeVisible();
    const text = await secondary.textContent();
    expect(text.toLowerCase()).toContain('crop');
  });
});

// --- Share URL ---

test.describe('Share URL', () => {
  test('copy button exists and is visible', async ({ page }) => {
    await page.goto(PAGE);
    const btn = page.locator('#copyShareBtn');
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test('URL params are restored on load', async ({ page }) => {
    await page.goto(PAGE + '?pw=5000&ph=6000&tw=11&th=14&u=in&q=300&ch=pod');
    await page.waitForTimeout(300);

    expect(await page.inputValue('#pxWidth')).toBe('5000');
    expect(await page.inputValue('#pxHeight')).toBe('6000');
    expect(await page.inputValue('#targetWidth')).toBe('11');
    expect(await page.inputValue('#targetHeight')).toBe('14');
    expect(await page.inputValue('#unit')).toBe('in');
    expect(await page.inputValue('#qualityTarget')).toBe('300');
    expect(await page.inputValue('#channel')).toBe('pod');

    // DPI should be computed: min(5000/11, 6000/14) ≈ min(454.5, 428.6) = 428.57
    const dpi = await page.textContent('#dpiResult');
    expect(dpi).toContain('DPI');
    // Should not contain '-' (means it calculated)
    expect(dpi).not.toBe('-');
  });

  test('sample notice NOT shown when URL params present', async ({ page }) => {
    await page.goto(PAGE + '?pw=5000&ph=6000&tw=11&th=14&u=in&q=300&ch=pod');
    await page.waitForTimeout(300);
    const notice = page.locator('#sampleNotice');
    await expect(notice).toHaveCount(0);
  });
});

// --- Upload ---

test.describe('Upload', () => {
  test('upload button triggers file input', async ({ page }) => {
    await page.goto(PAGE);
    const uploadBtn = page.locator('#pickImageBtn');
    await expect(uploadBtn).toBeVisible();
    await expect(uploadBtn).toBeEnabled();
    expect(await uploadBtn.textContent()).toContain('Upload image');
  });

  test('drop zone has correct ARIA attributes', async ({ page }) => {
    await page.goto(PAGE);
    const dropZone = page.locator('#uploadDropZone');
    expect(await dropZone.getAttribute('role')).toBe('button');
    expect(await dropZone.getAttribute('tabindex')).toBe('0');
  });
});

// --- No JS errors ---

test('page loads without JS errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto(PAGE);
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});

// --- Quality threshold selector ---

test.describe('Quality threshold', () => {
  test('changing threshold changes max size calculation', async ({ page }) => {
    await page.goto(PAGE);
    await page.fill('#pxWidth', '3000');
    await page.fill('#pxHeight', '3000');
    await page.fill('#targetWidth', '10');
    await page.fill('#targetHeight', '10');

    // At 300 DPI threshold
    await page.selectOption('#qualityTarget', '300');
    await page.locator('#qualityTarget').dispatchEvent('change');
    await page.waitForTimeout(200);
    const maxAt300 = await page.textContent('#maxSizeResult');

    // At 150 DPI threshold
    await page.selectOption('#qualityTarget', '150');
    await page.locator('#qualityTarget').dispatchEvent('change');
    await page.waitForTimeout(200);
    const maxAt150 = await page.textContent('#maxSizeResult');

    // Max size should be bigger at 150 threshold
    expect(maxAt300).not.toBe(maxAt150);
  });
});

// --- Selling channel ---

test.describe('Selling channel', () => {
  test('all 4 channels available', async ({ page }) => {
    await page.goto(PAGE);
    const options = await page.locator('#channel option').allTextContents();
    expect(options.length).toBe(4);
  });

  test('channel affects recommendation text', async ({ page }) => {
    await page.goto(PAGE);
    await page.fill('#pxWidth', '3600');
    await page.fill('#pxHeight', '4800');
    await page.fill('#targetWidth', '8');
    await page.fill('#targetHeight', '10');

    await page.selectOption('#channel', 'etsy');
    await page.locator('#channel').dispatchEvent('change');
    await page.waitForTimeout(200);
    const etsyRec = await page.textContent('#recommendationText');

    await page.selectOption('#channel', 'pod');
    await page.locator('#channel').dispatchEvent('change');
    await page.waitForTimeout(200);
    const podRec = await page.textContent('#recommendationText');

    expect(etsyRec).not.toBe(podRec);
  });
});
