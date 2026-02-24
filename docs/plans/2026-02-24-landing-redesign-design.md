# Printable Quality Checker — Landing Page Redesign

**Date:** 2026-02-24
**Approach:** Evolution of existing `index.html`
**Positioning:** CF-style standalone (no CF branding, real CF tool links)

---

## Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scope | Full redesign | Need production-grade feature page, not cosmetic fixes |
| Positioning | CF-style standalone | Shows competence without direct brand copying |
| Visual | Soften, keep warmth | Remove decorations, keep warm palette and font character |
| CTA flow | Smart context-aware CTA | Different label/link based on DPI result |
| Related tools | Grid with real CF links | 10 tools linking to actual CF feature pages |
| Display font | Keep Bodoni Moda for H1 | Serif/sans contrast gives visual hierarchy |
| Empty state | Placeholder values, no calculation | Show values but don't run calc until first interaction |
| Layout | Full-width sections | Replace 2-column with vertical CF-style flow |

---

## 1. Visual System

### Remove
- `body::before` — grid overlay
- `body::after` — grain dot texture
- `.frame::before` — dashed inner borders on all frames
- `.tape-note::before, ::after` — tape decoration strips
- `.hero-copy::after` — "FREE TOOL" rotated stamp
- `.scoreboard` — dark green dashboard block with glow
- `body` radial-gradient backgrounds (paper tint blobs)

### Change
| Property | From | To |
|----------|------|----|
| Background | `#efe6d3` + grain | `#faf8f5` (warm white, clean) |
| Display font | `Bodoni Moda` everywhere | `Bodoni Moda` for H1 + large result numbers only |
| Border radius | `18px` | `12px` |
| Shadows | `0 12px 40px rgba(53,42,25,.13)` | `0 2px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)` |
| `--muted` | `#5f584c` | `#4a4438` (WCAG AA compliant on #faf8f5) |
| `--paper` | `#efe6d3` | `#faf8f5` |
| `--paper-2` | `#f7f1e4` | `#ffffff` |
| theme-color | `#f1ebdc` | `#faf8f5` |

### Keep
- `Bodoni Moda` — H1 and DPI result display (serif accent)
- `IBM Plex Sans Condensed` — body text
- `IBM Plex Mono` — labels, hints, technical values
- Color pair: `--signal: #114b42` (green) + `--stamp: #e04d2d` (terracotta)
- Warm undertone in background
- Rounded card corners (now 12px)

---

## 2. Page Structure

```
1. HEADER
   ├─ Lightweight nav bar (logo placeholder + "Studio" + "Features" + "Tools")
   └─ Breadcrumbs: Home > Tools > Printable Quality Checker

2. HERO (full-width, centered)
   ├─ Eyebrow: "FREE ONLINE TOOL" (mono, uppercase)
   ├─ H1: "Check Your Print Quality Before You Sell" (Bodoni Moda)
   ├─ Lead: "Upload your image and instantly see if it's sharp enough
   │         to print at the size you need. Get DPI, max print size,
   │         and crop warnings — so you list with confidence."
   ├─ Primary CTA: "Check your image ↓" (anchor to #tool)
   └─ Benefit pills: "Instant result" · "No sign-up" · "100% free"

3. TOOL SECTION (full-width, form max-width: 680px centered)
   ├─ Section title: "Printable Quality Check" + "Free tool" chip
   ├─ Upload zone (drag & drop + button)
   │   └─ Upload meta row (file name, detected size, file size) — hidden until upload
   ├─ Manual input: Image width (px) + Image height (px)
   │   └─ Placeholder values: 3600 / 4800 (shown but calc NOT run)
   ├─ Target section: width + height + units
   ├─ Preset chips: 8×10, 11×14, 12×12, A4, A3, 5×7
   ├─ Quality threshold + Selling context dropdowns
   ├─ Results block (aria-live on verdict only):
   │   ├─ Actual DPI (Bodoni Moda, large)
   │   ├─ Max Recommended Size
   │   ├─ Quality bar + quality text
   │   ├─ Aspect ratio warning (conditional)
   │   ├─ Recommended Next Step text
   │   ├─ Smart CTA button (hidden until first result)
   │   │   └─ Explanation line below: "Your image is sharp — ready for mockup"
   │   └─ "Copy result link" button (moved here from hero)
   └─ Share success flash

4. HOW IT WORKS (full-width, 3 columns on desktop → stack on mobile)
   ├─ Step 1: "Upload or enter dimensions"
   │   └─ "Drop an image file or type your pixel dimensions manually."
   ├─ Step 2: "Pick your print size"
   │   └─ "Choose a preset like 8×10 or A4, or enter custom dimensions."
   └─ Step 3: "Get your verdict"
       └─ "Instantly see DPI, max safe print size, quality score, and what to do next."

5. USE CASES (full-width, 4 cards in grid)
   ├─ "Wall Art Printable Listings" — for Etsy sellers
   │   └─ "Test multiple listing sizes (8×10, 11×14, A4) before publishing digital download bundles."
   ├─ "POD Artwork Validation" — for POD creators
   │   └─ "Check if a design can scale to the target product without becoming visibly soft."
   ├─ "Client File Review" — for designers
   │   └─ "Quickly answer 'can this print at this size?' with a shared result link."
   └─ "Multi-Size Bundle Testing" — for printable sellers
       └─ "Verify every size variant in a bundle meets quality threshold before listing."

6. FAQ (full-width, 8 questions, all collapsed by default)
   ├─ "What DPI is good for Etsy printables?"
   ├─ "Is this tool free?"
   ├─ "Do you store my uploaded images?"
   ├─ "Why can a file look fine on screen but fail in print?"
   ├─ "What print sizes can I check?"
   ├─ "Why does aspect ratio mismatch matter for listings?"
   ├─ "What should I do if my image fails the check?"
   └─ "Can I share my results with a client or team?"

7. RELATED TOOLS (full-width grid, 5×2 desktop / 3-col tablet / 2-col mobile)
   ├─ Background Remover → creativefabrica.com/studio/features/background-remover/
   ├─ Image Resizer → .../image-resizer/
   ├─ Image Upscaler → .../ai-image-upscaler/
   ├─ Crop Image → .../crop-image/
   ├─ Add Text on Image → .../add-text-on-image/
   ├─ AI Logo Maker → .../ai-logo-maker/
   ├─ PNG to JPG → .../png-to-jpg/
   ├─ Image Compressor → .../compress-image/
   ├─ Mockup Generator → .../mockup-generator/
   └─ Etsy Shop Logo Maker → .../etsy-shop-logo-maker/

8. FOOTER
   ├─ "Free print quality checker for Etsy sellers, POD creators, and designers."
   └─ Links: Studio · Features · Help
```

---

## 3. Smart CTA Logic

Located inside tool section results. Hidden until first calculation runs.

```
if (dpi >= targetQuality):
  label: "Create a mockup with this image →"
  url:   https://www.creativefabrica.com/studio/features/mockup-generator/
  hint:  "Your image is sharp enough — ready for mockup"

elif (dpi >= 180):
  label: "Upscale to hit target quality →"
  url:   https://www.creativefabrica.com/studio/features/ai-image-upscaler/
  hint:  "DPI is borderline — upscaling may help"

else:
  label: "Enhance this image first →"
  url:   https://www.creativefabrica.com/studio/features/ai-image-upscaler/
  hint:  "Resolution is too low for this size — try enhancing"

if (ratioDiffPct > 1.5):
  secondary CTA:
    label: "Crop to fit target ratio →"
    url:   https://www.creativefabrica.com/studio/features/crop-image/
```

Smart CTA button: same visual style always, label changes. Explanation line below in muted text.

---

## 4. JS Changes

### Modify
- **Empty state on load:** Set placeholder values in inputs (3600/4800, 8/10) but do NOT call `updateCalculator()` on page load. Results show "Upload or enter dimensions to check" until first user interaction.
- **Smart CTA function:** New `smartCtaFor({dpi, targetQuality, ratioDiffPct})` returns `{label, url, hint, secondary?}`. Rendered inside results block.
- **Smart CTA visibility:** Hidden (`display: none`) until first calculation. Appears with results.
- **Upload loading state:** Disable "Upload image" button and show "Reading..." text while `readImageDimensions()` promise is pending.
- **`aria-live` scope:** Move from `.results` div to verdict-specific element only (recommended next step + smart CTA area).
- **Preset chips:** Add `aria-pressed="true/false"` toggling.

### Remove
- `openWorkflowCta()` function and its event listener
- `ctaStudioBtn` element and references
- `eventFeed` div and all references to `els.eventFeed`
- "Continue to editor" button from HTML
- "Copy result link" button from hero (moved to results)

### Keep (unchanged)
- All calculator math (`updateCalculator`, `qualityBand`, `recommendationFor`, `toInches`, `parsePositive`)
- Upload/drag-drop logic (`handleImageFile`, `readImageDimensions`, drop zone events)
- Preset system (`presets` object, `setPreset`, chip click handler)
- Share URL logic (`buildShareUrl`, `syncUrlState`, `applyQueryParams`, `copyShareLink`)
- Tracking (`track` function, `dataLayer`, `plausible` hooks)

---

## 5. SEO & Meta

### Add
- `<link rel="canonical" href="https://www.creativefabrica.com/studio/features/printable-quality-checker/" />`
- `<meta property="og:image" content="og-printable-checker.png" />` (placeholder, needs actual image)
- BreadcrumbList schema (JSON-LD)
- FAQPage schema (JSON-LD) for all 8 FAQ questions
- Update `<meta name="theme-color" content="#faf8f5" />`

### Change
- Title: `"Free Print Quality Checker (DPI) — Check Before You Sell | Creative Fabrica"`
- Meta description: `"Is your image sharp enough to print? Free DPI checker for Etsy printables and POD. Upload, pick a size, get instant quality verdict. No sign-up."`
- H1: `"Check Your Print Quality Before You Sell"`

---

## 6. Accessibility Fixes

- `--muted` color: `#5f584c` → `#4a4438` (WCAG AA on #faf8f5)
- Preset chips: add `aria-pressed="true/false"`
- Drop zone: add `tabindex="0"`, `role="button"`, keydown handler (Enter/Space → file picker)
- `aria-live="polite"` → move to verdict summary element only, not entire results block
- FAQ: all `<details>` closed by default (remove `open` from first)
- Upload loading: disable button, add `aria-busy="true"` during file read

---

## 7. Responsive Strategy

| Breakpoint | Layout |
|------------|--------|
| > 1024px | Full-width sections, form max-width 680px centered, related tools 5×2 grid, how-it-works 3 columns, use cases 2×2 grid |
| 641-1024px | Same structure, related tools 3-col, use cases stack to 1 column, how-it-works 3 columns |
| ≤ 640px | Everything stacks. Related tools 2-col. Hero pills wrap. Inputs full-width. FAQ full-width. |

Tool section form: `max-width: 680px; margin: 0 auto;` at all breakpoints.

---

## 8. Files Changed

Only `index.html` — single file evolution. No new files except this design doc.

Estimated line count after redesign: ~1600-1800 lines (CSS cleanup offsets new HTML sections).
