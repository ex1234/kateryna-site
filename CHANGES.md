# Redesign of the home page — what changed

Two passes: pass 1 (“Rosé Arch”, light and powdery), then pass 2 (“Rosé Nocturne”), which is bolder and more luxurious. The current files contain **pass 2**.

## What was not changed
- Texts, prices, links, the phone number, and the `hreflang`/canonical links.
- The structure of the booking modal and the privacy modal (byte-for-byte identical to the original).
- `app.js` (languages, menu, form, Telegram/WhatsApp/SMS, the reveal observer) is untouched.
- A script compares the visible text with the original. The only difference is that the “Ⅱ” glyph on the video pause button moved, because the button now sits inside the video frame.
- All local paths are relative (`styles.css`, `assets/...`), so the site works from a GitHub Pages subfolder.

## Pass 2 — “Rosé Nocturne”
**Palette.** Night wine `#3A0F22` / `#2A0B18` / `#1F0811` against cream `#F7EEE8` and powder `#EFDCD3`. The brand metal is a **rose-gold gradient**, used on lines, buttons, numbers, the italic part of the name and the footer headings. A slow shine travels across it. Every gradient stop passes AA: at least 5.8:1 on wine and at least 4.5:1 for the dark version on cream.

**Type.** Noto Serif Display, a thin high-contrast Didone in the Bodoni family, with italic accents; Jost for body text. Cormorant was rejected: its carons sit above the letters in `č š ž`, which is unacceptable for Slovene.

**By section:**
1. **Hero, full screen** (`100svh`). On desktop the header lies transparently over the hero.
   - A huge name. “Kateryna” rises letter by letter from behind a mask. “*Kovalenko*” is italic rose gold and appears with an “ink” wipe.
   - The portrait sits in a tall arch with a gradient gold outline and an inner hairline. The treatment video is in an oval “cameo” with a gold ring; the pause button stays.
   - Also: a botanical sprig that draws itself, three floating blobs (champagne, rose gold, powder), slow parallax and a scroll cue.
2. **Marquees**: one on cream, and one metallic in reverse, between the services and the FAQ.
   - The words are taken from existing service names: Glass Skin, RF lifting, Microneedling, LED… The separators are small line-drawn flowers.
   - Marked `aria-hidden` so screen readers don’t read duplicates. They pause on hover and are static with reduced motion.
3. **Facts**: large rose-gold italic headings, gradient dividers, staggered reveal.
4. **About**: a curved arch-shaped top edge; an oval portrait with a gradient gold ring, a blob and a large line-drawn peony that draws on scroll.
5. **Services** on wine. Glass arch-shaped cards (`backdrop-filter`) with a gradient gold frame.
   - Large outline numbers 01/02/03 that fill with rose gold on hover.
   - 3D tilt and a highlight that follows the pointer.
6. **FAQ**: glass cards on cream. The accordion opens and closes smoothly, and the gold “+” rotates into “×”.
7. **Banner**: wine with a faint peony and sprigs (all drawing themselves); large serif text and a metallic button.
8. **Footer**: night, rose-gold headings, animated underlines, a metallic seal.
9. **“Naročite se” buttons**: metal or wine with a thin double frame and a gold shimmer on hover. On mouse they are “magnetic” and lean towards the cursor.
10. **Header**: sticky dark glass on phones. On desktop it is a centred masthead over the hero, and from 228px of scroll a slim glass bar (the `.is-compact` class from app.js).
11. **Booking modal**: dark glass, gold accents and an opening animation (scale and mask), with the contents appearing one by one. The fields are dark with `color-scheme: dark`; the dropdown option lists stay light for readability.
12. **Cursor ring** on desktop only (fine pointer). It is hidden on touch devices, with reduced motion and while a modal is open. The system cursor is not hidden.
13. **Film grain** is a static overlay over the whole page (`pointer-events: none`).

**JS (`decor.js`, no libraries)**: letter splitting (the h1 keeps the accessible name “Kateryna Kovalenko” via `aria-label`), line drawing via IntersectionObserver, parallax, magnetic buttons, card tilt and highlight, the cursor ring and the smooth FAQ. With `prefers-reduced-motion` all of these are switched off: the content is shown immediately and the drawings are already complete.

## Pass 1 (base, still in place)
- Self-hosted fonts in `assets/fonts/` (SIL OFL licences next to them).
  - No requests go to Google, so the privacy text in the modal (“no third-party scripts”) stays true. This matters for the EU/GDPR.
  - The `latin-ext` subsets were trimmed to Latin Extended-A (č š ž ć đ ő ű ș ț): 174→19 KB and 209→21 KB. There is Cyrillic for `/uk/`.
- Mobile-first CSS: `styles.css` holds the base, `responsive.css` the breakpoints 600/760/900/1100/1440.
- The shared rules for the price list and treatment pages (categories, search, price rows) are kept and recoloured; checked against the live `/sl/prices/` page.
- Asset versions bumped to `?v=35` to reset the cache.

## Checks
Playwright (Chromium) at 390×844 and 1440×900, plus the price page:
- No horizontal overflow and no JS errors.
- The booking modal opens, and the Telegram link includes the selected service.
- The FAQ closes and opens.
- Mobile menu, card hover and compact header all checked.
- With reduced motion all content is visible and the drawings are complete.

## Needs your attention
1. **`booking-utils.mjs` is missing from the repository.** `app.js` imports it, so on GitHub Pages **the menu, the booking modal and the languages will not work** until the file is added (it exists on the production site). The hero video (`assets/kateryna-treatment-refined.mp4`) and its poster are also missing from the repo. For the checks I substituted them from production in the test only; the repository is unchanged.
2. Other language pages (`/uk/`, `/en/`…) and subpages share the new CSS.
   - On language versions of the home page the hero only gets its new look after the same markup is applied (the hero stage with the portrait, the marquees, `data-reveal`, `decor.js`). This file was the template for the change.
   - On those pages also bump `?v=` for `styles.css` and `responsive.css`.
3. The marquee adds repeated words from the service names: this is new visual text (it is hidden from screen readers). If the client wants exactly the original wording, remove the two `.marquee` blocks.
