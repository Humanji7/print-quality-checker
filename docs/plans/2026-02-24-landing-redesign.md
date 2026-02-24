# Landing Page Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Printable Quality Checker from a portfolio-style concept into a production-grade CF-style feature page.

**Architecture:** Single-file evolution of `index.html`. CSS cleanup first (remove decorations, update palette), then HTML restructure (full-width sections), then JS updates (smart CTA, empty state), then SEO/accessibility. Each task is independently verifiable.

**Tech Stack:** Vanilla HTML/CSS/JS, no build tools. Google Fonts (Bodoni Moda, IBM Plex Sans Condensed, IBM Plex Mono). JSON-LD schemas.

**Design doc:** `docs/plans/2026-02-24-landing-redesign-design.md`

---

## Task 1: CSS — Remove decorative elements

**Files:**
- Modify: `index.html` (CSS section, lines 16-905)

**Step 1: Remove body pseudo-element overlays**

Delete the `body::before` rule (grid overlay, lines 59-66) and `body::after` rule (grain dots, lines 68-73).

```css
/* DELETE entire body::before block (lines 59-66) */
/* DELETE entire body::after block (lines 68-73) */
```

**Step 2: Remove frame inner dashed borders**

Delete the `.frame::before` rule (lines 92-98).

```css
/* DELETE entire .frame::before block */
```

**Step 3: Remove hero "FREE TOOL" stamp**

Delete the `.hero-copy::after` rule (lines 171-185).

```css
/* DELETE entire .hero-copy::after block */
```

**Step 4: Remove tape-note decorations**

Delete `.tape-note::before` and `.tape-note::after` rules (lines 776-794).

```css
/* DELETE entire .tape-note::before, .tape-note::after block */
```

**Step 5: Remove scoreboard glow pseudo-element**

Delete `.scoreboard::after` rule (lines 336-345).

```css
/* DELETE entire .scoreboard::after block */
```

**Step 6: Verify in browser**

Open `http://127.0.0.1:4173/`. Page should render without grid overlay, grain texture, dashed inner borders, "FREE TOOL" stamp, tape strips, and scoreboard glow. Layout and colors unchanged.

**Step 7: Commit**

```bash
git add index.html
git commit -m "style: remove decorative pseudo-elements (grid, grain, stamp, tape, dashed borders)"
```

---

## Task 2: CSS — Update color palette and variables

**Files:**
- Modify: `index.html` (CSS `:root` block and body styles)

**Step 1: Update CSS custom properties**

Replace the `:root` variables block (lines 17-34):

```css
:root {
  --paper: #faf8f5;
  --paper-2: #ffffff;
  --ink: #181612;
  --muted: #4a4438;
  --line: rgba(24, 22, 18, 0.10);
  --line-strong: rgba(24, 22, 18, 0.18);
  --panel: rgba(255, 255, 255, 0.85);
  --shadow: 0 2px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04);
  --stamp: #e04d2d;
  --signal: #114b42;
  --signal-soft: #1f776a;
  --warn: #8f2f47;
  --mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  --sans: 'IBM Plex Sans Condensed', system-ui, sans-serif;
  --display: 'Bodoni Moda', Georgia, serif;
  --radius: 12px;
}
```

**Step 2: Simplify body background**

Replace body background (lines 40-48) with clean warm white:

```css
body {
  font-family: var(--sans);
  color: var(--ink);
  background: var(--paper);
  min-height: 100vh;
  line-height: 1.35;
  letter-spacing: .005em;
}
```

**Step 3: Update shadow references**

Find all hardcoded `box-shadow` values and replace with `var(--shadow)` where appropriate. Key locations:
- `.hero-shell` (line 107): `box-shadow: var(--shadow);`
- `.scoreboard` (line 331): will be removed in Task 4
- `.btn.primary` (line 244): keep gradient-specific shadow

**Step 4: Update theme-color meta tag**

In `<head>`, change:
```html
<meta name="theme-color" content="#faf8f5" />
```

**Step 5: Verify in browser**

Page should show warm white background, no grain/gradient blobs. Text contrast should be readable. Green and terracotta accents should pop on clean background.

**Step 6: Commit**

```bash
git add index.html
git commit -m "style: update palette to warm white, fix muted contrast for WCAG AA"
```

---

## Task 3: CSS — Update border-radius and shadows globally

**Files:**
- Modify: `index.html` (CSS section)

**Step 1: Replace hardcoded border-radius values**

Use find-and-replace:
- `border-radius: 18px` → `border-radius: var(--radius)` (for major containers)
- `border-radius: 22px` (`.hero-shell`, line 101) → `border-radius: var(--radius)`
- `border-radius: 16px` (`.ledger`, `.footer`) → `border-radius: var(--radius)`
- `border-radius: 14px` (`.upload-card`, `.result-box`, `.quality`, `.ops-item`) → `border-radius: var(--radius)`
- Keep `border-radius: 999px` for pills/chips (intentional full-round)
- Keep `border-radius: 12px` on inner elements (inputs, details, small cards) — these are now equal to `--radius`

**Step 2: Replace heavy shadows**

- `.hero-shell` box-shadow: replace with `var(--shadow)`
- `.tape-note` box-shadow: replace with `var(--shadow)`
- `.scoreboard` box-shadow: will be removed in Task 4
- `.btn.primary` box-shadow: keep (button-specific)

**Step 3: Simplify hero-copy background**

Replace `.hero-copy.frame` (lines 165-169) with:
```css
.hero-copy.frame {
  background: rgba(255,255,255,0.7);
}
```

**Step 4: Verify in browser**

All cards and panels should have consistent subtle shadows and 12px corners. No heavy drop shadows. Pills still fully rounded.

**Step 5: Commit**

```bash
git add index.html
git commit -m "style: unify border-radius to 12px, lighten shadows"
```

---

## Task 4: HTML — Rebuild header and hero

**Files:**
- Modify: `index.html` (HTML section, lines 918-967)

**Step 1: Add CSS for new header**

Add before `.wrap` rule:

```css
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  margin-bottom: 4px;
  font-size: 13px;
  color: var(--muted);
}

.site-nav {
  display: flex;
  gap: 20px;
  font-weight: 600;
}

.site-nav a {
  text-decoration: none;
  color: var(--muted);
  transition: color .15s;
}

.site-nav a:hover {
  color: var(--ink);
}

.breadcrumbs {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 16px;
}

.breadcrumbs a {
  color: var(--muted);
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.breadcrumbs span {
  margin: 0 6px;
  opacity: 0.5;
}
```

**Step 2: Add CSS for new hero layout**

```css
.hero {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 40px;
  padding: 32px 0;
}

.hero .eyebrow {
  margin-bottom: 14px;
}

.hero h1 {
  max-width: none;
  font-size: clamp(32px, 5vw, 52px);
  margin: 0 auto 16px;
}

.hero .lead {
  max-width: 52ch;
  margin: 0 auto 20px;
  font-size: 17px;
}

.benefit-pills {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.benefit-pill {
  font: 600 12px var(--mono);
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--signal);
  border: 1px solid rgba(17,75,66,0.2);
  background: rgba(17,75,66,0.04);
  border-radius: 999px;
  padding: 6px 14px;
}
```

**Step 3: Replace hero HTML**

Replace everything from `<section class="hero-shell ...">` through its closing `</section>` (lines 919-967) with:

```html
<header class="site-header">
  <nav class="site-nav">
    <a href="#">Studio</a>
    <a href="#">Features</a>
    <a href="#">Tools</a>
  </nav>
</header>

<div class="breadcrumbs" aria-label="Breadcrumb">
  <a href="#">Home</a><span>/</span>
  <a href="#">Tools</a><span>/</span>
  Printable Quality Checker
</div>

<section class="hero">
  <div class="eyebrow">Free online tool</div>
  <h1>Check Your Print Quality Before You Sell</h1>
  <p class="lead">
    Upload your image and instantly see if it's sharp enough to print at the size you need.
    Get DPI, max print size, and crop warnings — so you list with confidence.
  </p>
  <a class="btn primary" href="#tool">Check your image</a>
  <div class="benefit-pills">
    <span class="benefit-pill">Instant result</span>
    <span class="benefit-pill">No sign-up</span>
    <span class="benefit-pill">100% free</span>
  </div>
</section>
```

**Step 4: Remove old hero-shell, topbar, hero-grid, scoreboard, hero-note CSS**

Delete these CSS rules that are no longer referenced:
- `.hero-shell` (lines 100-108)
- `.topbar` (lines 110-116)
- `.brand`, `.brand-dot` (lines 118-139)
- `.tagline` (lines 141-151)
- `.hero-grid` (lines 152-157)
- `.hero-copy` (lines 159-169) — replace with `.hero` styles added in step 2
- `.hero-actions` (lines 213-218)
- `.micro-grid`, `.micro-card` (lines 252-276)
- `.hero-side` (lines 278-281)
- `.hero-note` (lines 283-321)
- `.scoreboard` and related (lines 323-383)

**Step 5: Verify in browser**

New clean header with nav + breadcrumbs. Centered hero with H1 in Bodoni Moda, lead text, green CTA button, 3 green-bordered pills below. No stamps, scoreboard, or 2-column layout.

**Step 6: Commit**

```bash
git add index.html
git commit -m "feat: rebuild header and hero — CF-style centered layout with nav and breadcrumbs"
```

---

## Task 5: HTML — Restructure tool section to full-width

**Files:**
- Modify: `index.html` (HTML section, lines 969-1094 and CSS)

**Step 1: Add CSS for full-width tool section**

```css
.tool-section {
  max-width: 680px;
  margin: 0 auto 48px;
}
```

**Step 2: Replace 2-column main-grid with single tool section**

Remove `<section class="main-grid">` wrapper. Change the calculator panel:

```html
<section class="tool-section" id="tool">
  <div class="panel" id="calculator" aria-labelledby="calc-title">
    <!-- Keep existing calc-head, form, and all form contents unchanged -->
    <!-- ... all calculator form content stays ... -->
  </div>
</section>
```

Remove the wrapping `<section class="main-grid">` and `<aside class="side-stack">` — the sidebar content (how-it-works, use-cases, related-tools, FAQ) moves to their own sections in Task 6.

**Step 3: Remove main-grid CSS**

Delete `.main-grid` rule (lines 385-390).

**Step 4: Add smart CTA container to results block**

Inside the results div, after the recommendation text result-box, add:

```html
<div id="smartCtaBlock" class="smart-cta" style="display:none">
  <a id="smartCtaLink" class="btn primary smart-cta-btn" href="#" target="_blank" rel="noopener">-</a>
  <div id="smartCtaHint" class="smart-cta-hint">-</div>
  <a id="smartCtaSecondary" class="btn smart-cta-secondary" href="#" target="_blank" rel="noopener" style="display:none">-</a>
</div>

<button class="btn" id="copyShareBtn" type="button">Copy result link</button>
<div id="shareSuccess" class="success">Share link copied.</div>
```

**Step 5: Add smart CTA CSS**

```css
.smart-cta {
  display: grid;
  gap: 8px;
  padding-top: 4px;
}

.smart-cta-btn {
  justify-self: start;
}

.smart-cta-hint {
  font-size: 13px;
  color: var(--muted);
}

.smart-cta-secondary {
  justify-self: start;
}
```

**Step 6: Remove "Copy result link" and "Continue to editor" from hero**

These buttons were in the old hero-actions block (already removed in Task 4). Confirm they don't exist in the new HTML. The "Copy result link" is now inside the tool results block.

**Step 7: Verify in browser**

Calculator should be centered, max-width 680px. All inputs, presets, results work. Smart CTA block hidden (no results yet). "Copy result link" button visible below results.

**Step 8: Commit**

```bash
git add index.html
git commit -m "feat: restructure tool section — full-width centered, add smart CTA container"
```

---

## Task 6: HTML — Add content sections (how-it-works, use-cases, FAQ, related tools, footer)

**Files:**
- Modify: `index.html` (HTML after tool section, before footer)

**Step 1: Add section CSS**

```css
.content-section {
  max-width: 900px;
  margin: 0 auto 48px;
}

.content-section h2 {
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 20px;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.step-card {
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: #fff;
  padding: 20px;
  box-shadow: var(--shadow);
}

.step-card .step-num {
  font: 700 11px var(--mono);
  color: var(--signal);
  letter-spacing: .1em;
  margin-bottom: 8px;
}

.step-card b {
  display: block;
  font-size: 15px;
  margin-bottom: 6px;
}

.step-card p {
  margin: 0;
  font-size: 13px;
  color: var(--muted);
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.case-card {
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: #fff;
  padding: 20px;
  box-shadow: var(--shadow);
}

.case-card b {
  display: block;
  font-size: 15px;
  margin-bottom: 4px;
}

.case-card .case-audience {
  font: 600 11px var(--mono);
  color: var(--signal);
  letter-spacing: .06em;
  text-transform: uppercase;
  margin-bottom: 8px;
  display: block;
}

.case-card p {
  margin: 0;
  font-size: 13px;
  color: var(--muted);
}

.faq-section {
  max-width: 680px;
  margin: 0 auto 48px;
}

.faq-section details {
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: #fff;
  padding: 14px 16px;
  box-shadow: var(--shadow);
}

.faq-section details + details {
  margin-top: 10px;
}

.faq-section summary {
  cursor: pointer;
  font: 700 14px var(--sans);
  letter-spacing: .01em;
}

.faq-section p {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.5;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.tool-card {
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: #fff;
  padding: 16px;
  text-decoration: none;
  color: var(--ink);
  box-shadow: var(--shadow);
  transition: transform .15s ease, box-shadow .15s ease;
}

.tool-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.tool-card b {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
}

.tool-card span {
  font-size: 12px;
  color: var(--muted);
}
```

**Step 2: Replace old sidebar HTML with new full-width sections**

After the `</section>` of tool-section, remove the old `<aside class="side-stack">` and all its children. Replace with:

```html
<!-- How It Works -->
<section class="content-section">
  <h2>How It Works</h2>
  <div class="steps-grid">
    <div class="step-card">
      <div class="step-num">STEP 01</div>
      <b>Upload or enter dimensions</b>
      <p>Drop an image file or type your pixel dimensions manually.</p>
    </div>
    <div class="step-card">
      <div class="step-num">STEP 02</div>
      <b>Pick your print size</b>
      <p>Choose a preset like 8×10 or A4, or enter custom dimensions.</p>
    </div>
    <div class="step-card">
      <div class="step-num">STEP 03</div>
      <b>Get your verdict</b>
      <p>Instantly see DPI, max safe print size, quality score, and what to do next.</p>
    </div>
  </div>
</section>

<!-- Use Cases -->
<section class="content-section">
  <h2>Popular Use Cases</h2>
  <div class="cases-grid">
    <div class="case-card">
      <span class="case-audience">For Etsy sellers</span>
      <b>Wall Art Printable Listings</b>
      <p>Test multiple listing sizes (8×10, 11×14, A4) before publishing digital download bundles.</p>
    </div>
    <div class="case-card">
      <span class="case-audience">For POD creators</span>
      <b>POD Artwork Validation</b>
      <p>Check if a design can scale to the target product without becoming visibly soft.</p>
    </div>
    <div class="case-card">
      <span class="case-audience">For designers</span>
      <b>Client File Review</b>
      <p>Quickly answer "can this print at this size?" with a shared result link.</p>
    </div>
    <div class="case-card">
      <span class="case-audience">For printable sellers</span>
      <b>Multi-Size Bundle Testing</b>
      <p>Verify every size variant in a bundle meets quality threshold before listing.</p>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="faq-section">
  <h2>Frequently Asked Questions</h2>
  <details>
    <summary>What DPI is good for Etsy printables?</summary>
    <p>300 DPI is the standard for premium printable products. 240 DPI is acceptable for most buyers. Below 200 DPI, prints may look soft or pixelated at close viewing distance.</p>
  </details>
  <details>
    <summary>Is this tool free?</summary>
    <p>Yes, completely free. No sign-up, no watermarks, no usage limits. Check as many images as you need.</p>
  </details>
  <details>
    <summary>Do you store my uploaded images?</summary>
    <p>No. All processing happens in your browser. Your files never leave your device — nothing is uploaded to any server.</p>
  </details>
  <details>
    <summary>Why can a file look fine on screen but fail in print?</summary>
    <p>Screens display at 72-96 PPI. A large print requires much higher pixel density. An image that looks sharp on a phone can appear soft when printed at 11×14 inches.</p>
  </details>
  <details>
    <summary>What print sizes can I check?</summary>
    <p>Any size. Use presets for common formats (8×10, 11×14, A4, A3, 5×7) or enter custom dimensions in inches or centimeters.</p>
  </details>
  <details>
    <summary>Why does aspect ratio mismatch matter for listings?</summary>
    <p>If the source ratio differs from the target, you'll need cropping or padding. That changes composition and may surprise the buyer.</p>
  </details>
  <details>
    <summary>What should I do if my image fails the check?</summary>
    <p>Try a smaller print size, or use an image upscaler to increase resolution before listing. You can also adjust your quality threshold to 240 DPI for acceptable results.</p>
  </details>
  <details>
    <summary>Can I share my results with a client or team?</summary>
    <p>Yes. Click "Copy result link" to get a URL with your exact settings and results. Anyone with the link sees the same configuration.</p>
  </details>
</section>

<!-- Related Tools -->
<section class="content-section">
  <h2>Related Tools</h2>
  <div class="tools-grid">
    <a class="tool-card" href="https://www.creativefabrica.com/studio/features/background-remover/" target="_blank" rel="noopener">
      <b>Background Remover</b>
      <span>Remove image backgrounds instantly</span>
    </a>
    <a class="tool-card" href="https://www.creativefabrica.com/studio/features/image-resizer/" target="_blank" rel="noopener">
      <b>Image Resizer</b>
      <span>Resize images to exact dimensions</span>
    </a>
    <a class="tool-card" href="https://www.creativefabrica.com/studio/features/ai-image-upscaler/" target="_blank" rel="noopener">
      <b>Image Upscaler</b>
      <span>Enhance resolution with AI</span>
    </a>
    <a class="tool-card" href="https://www.creativefabrica.com/studio/features/crop-image/" target="_blank" rel="noopener">
      <b>Crop Image</b>
      <span>Crop to any aspect ratio</span>
    </a>
    <a class="tool-card" href="https://www.creativefabrica.com/studio/features/add-text-on-image/" target="_blank" rel="noopener">
      <b>Add Text on Image</b>
      <span>Add text, fonts, and captions</span>
    </a>
    <a class="tool-card" href="https://www.creativefabrica.com/studio/features/ai-logo-maker/" target="_blank" rel="noopener">
      <b>AI Logo Maker</b>
      <span>Generate logos with AI</span>
    </a>
    <a class="tool-card" href="https://www.creativefabrica.com/studio/features/png-to-jpg/" target="_blank" rel="noopener">
      <b>PNG to JPG</b>
      <span>Convert image formats</span>
    </a>
    <a class="tool-card" href="https://www.creativefabrica.com/studio/features/compress-image/" target="_blank" rel="noopener">
      <b>Image Compressor</b>
      <span>Reduce file size for web</span>
    </a>
    <a class="tool-card" href="https://www.creativefabrica.com/studio/features/mockup-generator/" target="_blank" rel="noopener">
      <b>Mockup Generator</b>
      <span>Create product mockups</span>
    </a>
    <a class="tool-card" href="https://www.creativefabrica.com/studio/features/etsy-shop-logo-maker/" target="_blank" rel="noopener">
      <b>Etsy Shop Logo Maker</b>
      <span>Design your Etsy store brand</span>
    </a>
  </div>
</section>
```

**Step 3: Replace footer HTML**

```html
<footer class="footer">
  <div>Free print quality checker for Etsy sellers, POD creators, and designers.</div>
  <nav class="site-nav">
    <a href="#">Studio</a>
    <a href="#">Features</a>
    <a href="#">Help</a>
  </nav>
</footer>
```

**Step 4: Remove old sidebar CSS**

Delete these rules no longer referenced:
- `.side-stack`
- `.ops-board`, `.ops-item`
- `.ledger`, `.ledger-row`
- `.tape-note` (now replaced by content-section)
- Old `.faq` styles (replaced by `.faq-section`)
- Old `.panel h3` (keep `.panel` itself for tool section)

**Step 5: Verify in browser**

All sections stack vertically. How-it-works shows 3-column cards. Use cases shows 2×2 grid. FAQ shows 8 collapsed questions. Related tools shows 5×2 grid of linked cards. Footer is clean.

**Step 6: Commit**

```bash
git add index.html
git commit -m "feat: add full-width content sections — how-it-works, use cases, FAQ, related tools, footer"
```

---

## Task 7: JS — Implement empty state and smart CTA

**Files:**
- Modify: `index.html` (JS section, lines 1149-1521)

**Step 1: Add smartCtaFor function**

Add after the `recommendationFor` function:

```javascript
function smartCtaFor({ dpi, targetQuality, ratioDiffPct }) {
  const BASE = 'https://www.creativefabrica.com/studio/features';
  const result = { label: '', url: '', hint: '', secondary: null };

  if (dpi >= targetQuality) {
    result.label = 'Create a mockup with this image \u2192';
    result.url = `${BASE}/mockup-generator/`;
    result.hint = 'Your image is sharp enough \u2014 ready for mockup';
  } else if (dpi >= 180) {
    result.label = 'Upscale to hit target quality \u2192';
    result.url = `${BASE}/ai-image-upscaler/`;
    result.hint = 'DPI is borderline \u2014 upscaling may help';
  } else {
    result.label = 'Enhance this image first \u2192';
    result.url = `${BASE}/ai-image-upscaler/`;
    result.hint = 'Resolution is too low for this size \u2014 try enhancing';
  }

  if (ratioDiffPct > 1.5) {
    result.secondary = {
      label: 'Crop to fit target ratio \u2192',
      url: `${BASE}/crop-image/`
    };
  }

  return result;
}
```

**Step 2: Update els object**

Add new element references, remove old ones:

```javascript
// ADD:
smartCtaBlock: document.getElementById('smartCtaBlock'),
smartCtaLink: document.getElementById('smartCtaLink'),
smartCtaHint: document.getElementById('smartCtaHint'),
smartCtaSecondary: document.getElementById('smartCtaSecondary'),

// REMOVE:
ctaStudioBtn: document.getElementById('ctaStudioBtn'),
eventFeed: document.querySelector('#eventFeed span'),
```

**Step 3: Add smart CTA rendering to updateCalculator**

Inside `updateCalculator`, after the `recommendationText` assignment, add:

```javascript
// Smart CTA
const cta = smartCtaFor({ dpi: actualDpi, targetQuality, ratioDiffPct });
els.smartCtaBlock.style.display = 'grid';
els.smartCtaLink.textContent = cta.label;
els.smartCtaLink.href = cta.url;
els.smartCtaHint.textContent = cta.hint;

if (cta.secondary) {
  els.smartCtaSecondary.style.display = 'inline-flex';
  els.smartCtaSecondary.textContent = cta.secondary.label;
  els.smartCtaSecondary.href = cta.secondary.url;
} else {
  els.smartCtaSecondary.style.display = 'none';
}
```

**Step 4: Implement empty state on load**

At the end of the script, replace:

```javascript
// OLD:
applyQueryParams();
updateCalculator();
track('page_view', { app: 'printable_quality_checker' });

// NEW:
applyQueryParams();

// Only run calculator if URL has params (shared link), otherwise show empty state
const hasUrlParams = new URLSearchParams(location.search).has('pw');
if (hasUrlParams) {
  updateCalculator();
} else {
  els.dpiResult.textContent = '\u2014';
  els.maxSizeResult.textContent = '\u2014';
  els.qualityFill.style.width = '0%';
  els.qualityText.textContent = 'Waiting for input';
  els.recommendationText.textContent = 'Upload an image or enter dimensions to check.';
  els.smartCtaBlock.style.display = 'none';
}

track('page_view', { app: 'printable_quality_checker' });
```

**Step 5: Remove dead code**

Delete:
- `openWorkflowCta()` function (lines 1466-1475)
- `els.ctaStudioBtn.addEventListener('click', openWorkflowCta);` (line 1516)
- Remove `eventFeed` related code from `track()` function:
  ```javascript
  // DELETE this line from track():
  els.eventFeed.textContent = `${eventName}${...}`;
  ```

**Step 6: Add upload loading state**

In `handleImageFile`, wrap the try block:

```javascript
async function handleImageFile(file) {
  if (!file) return;
  if (file.type && !file.type.startsWith('image/')) {
    flashNotice('Please upload an image file.');
    return;
  }

  els.pickImageBtn.disabled = true;
  els.pickImageBtn.textContent = 'Reading...';
  els.uploadDropZone.setAttribute('aria-busy', 'true');

  try {
    const dims = await readImageDimensions(file);
    els.pxWidth.value = String(dims.width);
    els.pxHeight.value = String(dims.height);
    clearPresetSelection();
    setUploadMeta(file, dims.width, dims.height);
    updateCalculator({ trackEvent: true });
    track('image_upload', {
      mime: file.type || 'unknown',
      width_bucket: dims.width >= 4000 ? '4k+' : dims.width >= 2000 ? '2k+' : 'small'
    });
  } catch (err) {
    flashNotice('Could not read this image file.');
  } finally {
    els.pickImageBtn.disabled = false;
    els.pickImageBtn.textContent = 'Upload image';
    els.uploadDropZone.removeAttribute('aria-busy');
  }
}
```

**Step 7: Verify in browser**

1. Page loads → results show dashes, "Waiting for input", no smart CTA
2. Type in values → results calculate, smart CTA appears with correct label
3. High DPI (e.g. 3600×4800 at 8×10) → "Create a mockup..." CTA
4. Low DPI (e.g. 800×600 at 8×10) → "Enhance this image..." CTA
5. Ratio mismatch → secondary "Crop to fit" CTA appears
6. Shared URL with params → loads with calculation pre-run

**Step 8: Commit**

```bash
git add index.html
git commit -m "feat: implement smart CTA, empty state, upload loading, remove dead code"
```

---

## Task 8: SEO — Add schemas, canonical, update meta

**Files:**
- Modify: `index.html` (`<head>` section)

**Step 1: Update title and meta description**

```html
<title>Free Print Quality Checker (DPI) — Check Before You Sell | Creative Fabrica</title>
<meta name="description" content="Is your image sharp enough to print? Free DPI checker for Etsy printables and POD. Upload, pick a size, get instant quality verdict. No sign-up." />
```

**Step 2: Add canonical and og:image**

After og:type meta:

```html
<link rel="canonical" href="https://www.creativefabrica.com/studio/features/printable-quality-checker/" />
<meta property="og:image" content="og-printable-checker.png" />
```

**Step 3: Update og:title and og:description**

```html
<meta property="og:title" content="Free Print Quality Checker — DPI Calculator for Etsy & POD" />
<meta property="og:description" content="Is your image sharp enough to print? Free DPI checker. Upload, pick a size, get instant verdict." />
```

**Step 4: Replace WebApplication schema with expanded version + BreadcrumbList + FAQPage**

Replace the existing `<script type="application/ld+json">` block with:

```html
<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Printable Quality Checker",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "description": "Free online DPI calculator for Etsy printables and print-on-demand. Check print quality, max size, and aspect ratio fit before listing."
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.creativefabrica.com/" },
      { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://www.creativefabrica.com/studio/features/" },
      { "@type": "ListItem", "position": 3, "name": "Printable Quality Checker" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What DPI is good for Etsy printables?",
        "acceptedAnswer": { "@type": "Answer", "text": "300 DPI is the standard for premium printable products. 240 DPI is acceptable for most buyers. Below 200 DPI, prints may look soft or pixelated at close viewing distance." }
      },
      {
        "@type": "Question",
        "name": "Is this tool free?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes, completely free. No sign-up, no watermarks, no usage limits." }
      },
      {
        "@type": "Question",
        "name": "Do you store my uploaded images?",
        "acceptedAnswer": { "@type": "Answer", "text": "No. All processing happens in your browser. Your files never leave your device." }
      },
      {
        "@type": "Question",
        "name": "Why can a file look fine on screen but fail in print?",
        "acceptedAnswer": { "@type": "Answer", "text": "Screens display at 72-96 PPI. A large print requires much higher pixel density. An image that looks sharp on a phone can appear soft when printed at 11x14 inches." }
      },
      {
        "@type": "Question",
        "name": "What print sizes can I check?",
        "acceptedAnswer": { "@type": "Answer", "text": "Any size. Use presets for common formats (8x10, 11x14, A4, A3, 5x7) or enter custom dimensions in inches or centimeters." }
      },
      {
        "@type": "Question",
        "name": "Why does aspect ratio mismatch matter for listings?",
        "acceptedAnswer": { "@type": "Answer", "text": "If the source ratio differs from the target, you'll need cropping or padding. That changes composition and may surprise the buyer." }
      },
      {
        "@type": "Question",
        "name": "What should I do if my image fails the check?",
        "acceptedAnswer": { "@type": "Answer", "text": "Try a smaller print size, or use an image upscaler to increase resolution before listing." }
      },
      {
        "@type": "Question",
        "name": "Can I share my results with a client or team?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. Click Copy result link to get a URL with your exact settings and results. Anyone with the link sees the same configuration." }
      }
    ]
  }
]
</script>
```

**Step 5: Verify**

Check page source. Validate JSON-LD with Google Rich Results Test (paste schema). Title in browser tab should read "Free Print Quality Checker (DPI)...".

**Step 6: Commit**

```bash
git add index.html
git commit -m "seo: update title/meta, add canonical, BreadcrumbList and FAQPage schemas"
```

---

## Task 9: Accessibility — Fix ARIA, contrast, keyboard access

**Files:**
- Modify: `index.html` (HTML + CSS + JS)

**Step 1: Add aria-pressed to preset chips**

In `setPreset` function, after `clearPresetSelection()`:
```javascript
// In clearPresetSelection():
function clearPresetSelection() {
  document.querySelectorAll('.chip').forEach(chip => {
    chip.classList.remove('active');
    chip.setAttribute('aria-pressed', 'false');
  });
}

// In setPreset(), after clearPresetSelection():
if (btn) {
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');
}
```

In HTML, add `aria-pressed="false"` to each chip button:
```html
<button type="button" class="chip" data-preset="8x10" aria-pressed="false">8x10 art print</button>
<!-- ... same for all chips -->
```

**Step 2: Make drop zone keyboard-accessible**

Add to the upload drop zone HTML:
```html
<div class="upload-drop" id="uploadDropZone" aria-label="Image upload area" tabindex="0" role="button">
```

Add keydown handler in JS:
```javascript
els.uploadDropZone.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    els.imageFileInput.click();
  }
});
```

**Step 3: Move aria-live to verdict only**

Remove `aria-live="polite"` from `.results` div. Add it to the verdict container:

```html
<div class="results">
  <!-- ... result boxes without aria-live ... -->
  <div id="verdictArea" aria-live="polite">
    <div class="result-box">
      <small>Recommended Next Step</small>
      <div id="recommendationText" class="note">Upload an image or enter dimensions to check.</div>
    </div>
    <div id="smartCtaBlock" class="smart-cta" style="display:none">
      <!-- smart CTA content -->
    </div>
  </div>
</div>
```

**Step 4: Remove open from first FAQ details**

Ensure no `<details open>` in the FAQ section (already handled in Task 6 — all details are closed by default).

**Step 5: Verify**

- Tab through page: focus should reach drop zone, all chips, all buttons
- Press Enter on drop zone: file picker opens
- Screen reader: only verdict area announces changes, not every DPI recalculation
- Check text contrast with browser DevTools Accessibility panel

**Step 6: Commit**

```bash
git add index.html
git commit -m "a11y: add aria-pressed to chips, keyboard drop zone, scoped aria-live, WCAG AA contrast"
```

---

## Task 10: CSS — Responsive breakpoints for new layout

**Files:**
- Modify: `index.html` (CSS media queries)

**Step 1: Replace old media queries with new ones**

Delete existing `@media (max-width: 980px)` and `@media (max-width: 640px)` blocks. Replace with:

```css
@media (max-width: 1024px) {
  .tools-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .cases-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .steps-grid {
    grid-template-columns: 1fr;
  }
  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .site-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .hero h1 {
    font-size: 28px;
  }
  .hero .lead {
    font-size: 15px;
  }
  .benefit-pills {
    gap: 6px;
  }
  .benefit-pill {
    font-size: 11px;
    padding: 5px 10px;
  }
  .row,
  .row.three,
  .quality,
  .calc-head {
    grid-template-columns: 1fr;
  }
  .upload-meta {
    grid-template-columns: 1fr;
  }
  .quality-text {
    text-align: left;
    min-width: 0;
  }
  .footer {
    grid-template-columns: 1fr;
  }
  .footer .site-nav {
    justify-content: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  * { scroll-behavior: auto !important; }
  .btn, .chip, .tool-card, .quality-fill {
    animation: none !important;
    transition: none !important;
  }
}
```

**Step 2: Verify at all breakpoints**

Test at: 1440px, 1024px, 768px, 640px, 375px (iPhone SE).
- 375px: all stacked, 2-col related tools, readable text
- 768px: steps stack, 2-col tools
- 1024px: steps 3-col, tools 3-col, cases 1-col
- 1440px: full layout, tool form stays 680px centered

**Step 3: Commit**

```bash
git add index.html
git commit -m "style: responsive breakpoints for full-width section layout"
```

---

## Task 11: Cleanup — Remove unused CSS and final HTML audit

**Files:**
- Modify: `index.html`

**Step 1: Remove all CSS rules with no matching HTML**

Scan for orphaned selectors. Likely candidates:
- `.hero-shell`, `.topbar`, `.brand`, `.brand-dot`, `.tagline`
- `.hero-grid`, `.hero-copy`, `.hero-actions`, `.hero-side`
- `.micro-grid`, `.micro-card`
- `.scoreboard` and all `.score-grid`, `.tile` rules
- `.hero-note`
- `.main-grid`
- `.side-stack`, `.ops-board`, `.ops-item`
- `.ledger`, `.ledger-row`
- `.tape-note`
- Old `.faq` (replaced by `.faq-section`)
- `.animate-in`, `.d1-.d4`, `@keyframes rise` — evaluate if still used; if hero no longer uses them, remove

**Step 2: Remove eventFeed HTML**

Delete:
```html
<div id="eventFeed" hidden>Events: <span aria-live="polite">ready</span></div>
```

**Step 3: Verify nothing is broken**

Full page test: all sections render, calculator works, upload works, presets work, smart CTA works, share URL works, responsive works.

**Step 4: Commit**

```bash
git add index.html
git commit -m "chore: remove unused CSS rules and dead HTML elements"
```

---

## Task 12: Final verification

**Step 1: Full functional test**

1. Open page → empty state, hero visible, CTA scrolls to tool
2. Enter 3600×4800, select 8×10 → DPI 360, "Excellent", mockup CTA
3. Enter 800×600, select 8×10 → low DPI, "Enhance" CTA
4. Enter 3600×4800, select 12×12 → ratio warning + secondary crop CTA
5. Upload image → auto-fill, loading state, meta row shows
6. Click preset chip → values update, chip highlighted
7. Copy result link → URL copied, flash message
8. Shared URL (add ?pw=3600&ph=4800&tw=8&th=10&u=in&q=300&ch=etsy) → loads with results

**Step 2: Responsive test**

Test at 375px, 640px, 768px, 1024px, 1440px.

**Step 3: Accessibility test**

Tab through entire page. Verify focus order makes sense. Check screen reader output on verdict.

**Step 4: Schema validation**

Copy JSON-LD, paste into https://validator.schema.org/ or use Google Rich Results Test.

**Step 5: Final commit if any fixes needed**

```bash
git add index.html
git commit -m "fix: final adjustments from QA pass"
```
