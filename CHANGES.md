# Redesign of the home page — what changed

Four passes: pass 1 (“Rosé Arch”), pass 2 (“Rosé Nocturne”, dark), pass 3 (“Blush & Aubergine”: warm, light), then pass 4 (one photo, a new hero). The current files contain **pass 3 plus the pass 4 changes**. The audit is in `AUDIT.md`.

## What was not changed (all passes)
- Texts, prices, links (`href`), the phone number, `hreflang`/canonical. The booking and privacy modals are byte-for-byte identical to the original.
- `app.js` (languages, menu, form, Telegram/WhatsApp/SMS, the video pause button) is untouched.
- All local paths are relative; fonts are local in `assets/fonts/`; no external JS or CDN.

## Pass 4 — one photo, a hero without a portrait
**The client asked for:** one photo of Kateryna, in the “O meni” section only. Two photos in a row (hero + “O meni”) looked bad.

**Photo:**
- The only photo on the page is `assets/portrait-about.webp`:
  - `srcset`: `portrait-about-500.webp 500w, portrait-about.webp 1000w`;
  - `sizes="(min-width: 900px) 420px, 72vw"`;
  - `width="1000" height="1500"` (no layout shift), `alt="Kateryna Kovalenko"`, `loading="lazy"`.
- Shown whole (2:3) in an arch, with no oval crop:
  - `object-position: 50% 22%`; at 390/768/1440 the face, hair and folded hands are not cut off;
  - one frame: a thin gold line offset 16px behind the photo; the blob and ring are removed;
  - no CSS filter: the photo is already graded in the palette.
- From the page and the CSS, every reference to `assets/kateryna-kovalenko-portrait.webp` is removed (the hero image, the about image, the `preload`), and there is no `portrait-hero*` anywhere. The files remain on disk and are not deleted.

**Hero without a portrait:**
- The main visual element is **the treatment video in one large arch (2:3)**, 450–470px wide on desktop and 64vw on phones.
  - **Colour grade to the palette:** `sepia/saturate/hue-rotate`, plus a peach layer `#E6A68A` in `soft-light`. The cool violet clinic light turns warm and powdery.
  - One thin gold outline arch; the inner hairline frame and the “cameo” are removed.
  - Botanical line drawings that draw themselves: a peony behind the arch’s right shoulder and a sprig at the bottom left.
  - Soft light behind the arch (a light radial patch on the blush field); the arch “opens” with a mask as the page loads.
- The text is the same: the large name, the line from the site description, “Naročite se”.
- On a 390 phone, the arch, the name, the line and the button all fit on the first screen. At 768 the arch was made smaller so the button stays on the first screen too.

**From the audit:**
- **Pause/play button:** the “Ⅱ” glyph that `app.js` writes stays in the DOM but is hidden. The icon (two bars or a triangle) is drawn in CSS from `aria-pressed`, which app.js already toggles. The `aria-label` (“Zaustavi/Predvajaj animacijo”) comes from app.js; the button is 44×44 with a visible focus.
- **Extra frames removed:** in the hero (the inner hairline, the cameo ring) and in “O meni” (the blob, the double ring).
- **Mobile first screen:** checked with Playwright. At 390 and 768 the first screen has **one** “Naročite se” button and **one** `tel:` link. The floating booking bar appears only after the hero button scrolls out of view.
- **Tap targets:** no interactive elements under 44px at 390/768/1440 (the footer’s “Cenik” was 41px wide and now has `min-width:44px`). The social icons are 44×44.

**Checks:** Playwright at 390/768/1440 plus reduced motion.
- No horizontal scroll and no console errors; the contrast scan shows no failures.
- The booking modal opens and the Telegram link carries the selected service.
- The cards → price list, the FAQ and the mobile bar all work.
- With reduced motion the video is paused, the button shows the play icon, and all content is visible.
- `impeccable detect`: 6 findings, the same as after pass 3 (the static false positive `cramped-padding` and the dashes in the content).
- Versions bumped to `?v=37`.

## Pass 3 — “Blush & Aubergine” (base for pass 4)
**Why.** The client wants “tender, warm, human”. The impeccable audit and critique (two isolated assessments plus the `impeccable detect` detector) found that:
- version 2 was ~60% dark wine and the booking modal was the coldest screen;
- the cards, “Cenik” and “Celoten cenik” led back to their own section (dead links to prices);
- it carried a set of “AI tells”: gradient text, glass, glows, 01/02/03, marquees, a custom cursor.

**Palette.** Taken from the taste-skill library (“Blush and aubergine”) and checked against the skin tones in the portrait (`#E9BCA8`/`#E6A68A`).
- Blush fields `#F8ECE6` / `#F3DDD3` / `#EDCCBE` / `#FBF4F0`.
- Aubergine `#351A2B` only as the ink, the button, one top band and the booking band.
- Contrast: text 9.6–14.5:1, secondary 4.7–7.1:1, blush on aubergine 10.5:1.
- The ui-ux-pro-max database for Beauty/Spa confirms: a light theme, “dark — avoid for this product”.

**Tokens** in three layers (uipm-design-system): primitives (`--blush-*`, `--aubergine-*`, `--gold-*`) → semantic (`--bg`, `--ink`, `--accent`…) → component (`--btn-*`, `--card-*`, `--photo-glow`).

**What changed on the page:**
1. **Hero**, a blush field:
   - the portrait in an arch with a thin gold frame, a warm grade (the photo’s cold teal cast removed) and soft light;
   - the video in a small oval, also warmed;
   - the name rises letter by letter. This is the page’s only authored motion; the italic accent and gradient text are gone, and the name no longer breaks mid-word.
   - Under the name is a line from the site’s own description (meta description): “Čiščenje, pilingi in aparaturna nega obraza. Salon Diosa, Maribor · Ulica zmage 94.”
   - The text now comes before the media in the DOM, so Tab reaches the main button first.
2. **Trust row**:
   - a large serif “10” (decorative, hidden from screen readers) with the existing sentence “Ima deset let izkušenj na področju kozmetične nege.”;
   - DOBA · Maribor / Salon Diosa / Ukrajina with thin-line icons (cap, pin, cross).
3. **“O meni”**: a light ground, an oval portrait with a different crop and warm grade, a single sprig. The “Izobrazba” block sits on a soft tonal card.
4. **Services**:
   - arched cards without glass or shadow at rest; they lift on hover;
   - thin-line icons (drop, waves, face) instead of the repeated lotus;
   - large prices (`50–80` in serif, € in sans);
   - 01/02/03 reduced to a quiet small label.
5. **Full price list (new)**:
   - all 22 treatments with prices are shown on the page. They are built from the texts already in the modal’s `<select>`, word for word.
   - Each row is a booking button (`data-book data-service`, the same pattern as on the production price page), so the modal opens with that treatment selected.
   - Two balanced columns on desktop.
   - The service cards and “Celoten cenik” take you to their group in the list via `decor.js`; the hrefs are unchanged.
6. **FAQ**: a heading plus two columns of light cards. The plus is drawn and turns into a minus, and items open and close smoothly.
7. **Booking band**: the single aubergine field, text at 38px max (3 lines), a blush button.
8. **Footer as a calling card**:
   - a drawn mini-map of Maribor with the Drava, the streets and a pin, linked to the existing route link;
   - the phone, the address;
   - a large “Kateryna Kovalenko” wordmark at the close.
9. **Mobile CTA**: a floating “pill” (phone + “Naročite se”) that appears only after the hero button scrolls out of view, so there are no longer two identical buttons on the first screen.
10. **Booking modal**: light, warm, with a floating shadow and a soft open animation. The channels have equal weight (Telegram is no longer highlighted).
11. **Removed**:
    - gradient text, glass on content and glows;
    - the blobs and both marquees;
    - the cursor ring, the “magnetic” buttons and the 3D tilt;
    - the duplicated peonies and the ornament under every heading.
    - Reveal on scroll is kept only on the card groups and the trust row.
12. **Typography**:
    - body 17px with leading 1.65 (it was ~2.0), and no text below 13px;
    - prices with tabular figures;
    - Noto Serif Display 400 instead of 300 on the light ground;
    - wide tracking removed.

**Checks:** Playwright at 390/768/1440 plus reduced motion.
- No horizontal scroll and no console errors.
- The contrast scan shows no failures.
- The booking modal works and carries the selected service.
- The FAQ, the cards → price list, and the mobile bar all work.
- `impeccable detect`: 17 → 6 findings; the remaining ones are a static false positive and the dashes in the content texts.

**Needs your attention:**
- The page still has one photo of Kateryna (used in the hero and in “O meni”). For real warmth and trust it needs one or two more shots: hands at work, the Diosa interior, a portrait in natural light.
- New files `assets/portrait-hero*.webp` and `assets/portrait-about*.webp` appeared during this pass. I did not create them and the page does not use them.
- The hero video (3.4 MB) loads on first visit because of `autoplay`; it is worth compressing to ~1 MB.
- Other language pages need the same markup (hero, trust row, price list, footer map) and `?v=36`.

## Pass 2 — “Rosé Nocturne” (archive; replaced by pass 3)
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
