---
name: venue-website
description: Build a new hospitality venue or drinks-brand website (pub, hotel, brewery, restaurant, bar) using the Beerland Brewing site as the template — Astro static site, YAML content collections, GitHub Pages deploy. Use when asked to build, rebuild or spin up a site for another venue, to turn a design export or an existing static site into a proper build, or to "do what we did for Beerland" for another brand.
---

# Venue website from the Beerland template

The Beerland Brewing site (this repository) is the reference build: a fast static
Astro site where the content lives in plain YAML files, brand settings live in one
config file, and every interactive piece is a small vanilla script. New venue sites
start from a copy of it and swap the brand, content model and pages.

## 1. Intake — get these before writing code

Ask for whatever is missing; don't stall on it — build with clearly marked
`[PLACEHOLDERS]` and list them at the end.

- **Source of truth:** a design export, an existing site (repo or URL), or a written brief.
- **Brand:** logo files (SVG preferred, plus a light and dark version), colours, fonts, any texture/pattern.
- **Pages wanted** and the main action for visitors (book a table, find a stockist, buy merch, enquire about a function).
- **Content:** menus/products with prices, venue address and hours, booking link, social links, liquor licence number and ABN.
- **Media:** photos and video. Ask for a zip of everything — it is the fastest route.
- **Integrations:** booking widget, mailing list provider, online shop/checkout, loyalty program.
- **Compliance:** state/territory (liquor warning wording differs), Traditional Custodians for the acknowledgement, whether an 18+ gate is needed.

**Files from chat:** images pasted while you are mid-task are visible but are NOT saved to
disk. Ask the user to send photos in a fresh message (or as an `@` file / zip) once you've
replied, and check `/tmp/.../images/` and the uploads folder for what actually landed.

## 2. Start from the template

Create the new repo from this one (GitHub "Use this template", or copy the files), then:

1. Delete Beerland-only content: `src/content/*.yaml` entries, `src/assets/{beers,merch,photos}/*`,
   `public/videos/*`, and pages that don't apply.
2. Keep the framework pieces as-is: `astro.config.mjs`, `tsconfig.json`, `package.json`,
   `.github/workflows/deploy.yml`, `src/scripts/*`, `src/layouts/*`, `src/components/{Icon,Picture,Signup,AgeGate}.astro`.
3. Update `README.md` (editing guide table, still-to-connect list, live URL).

## 3. Brand swap (one pass, three files)

| What | Where |
| --- | --- |
| Colours, fonts, button/chip/tag styles, background texture | `src/styles/global.css` `:root` tokens |
| Google Fonts link, page title pattern, meta, age gate on/off | `src/layouts/BaseLayout.astro` |
| Name, address, hours, socials, licence/ABN, booking & mailing list URLs, `indexable` | `src/config/site.ts` |
| Logos | `src/assets/brand/` (wordmark for nav, badge/mark for footer and favicon → also `public/favicon.svg`) |

Map the brand's palette onto the existing token names (`--bg`, `--surface`, `--cream`,
`--accent`, `--text-muted`…) rather than inventing new ones, so every component picks it up.
For a light-background brand, flip `--bg`/`--cream` and set `color-scheme: light`.

## 4. Content model

Each repeating thing is a YAML collection in `src/content/`, declared in `src/content.config.ts`
with the `ordered()` loader (entries keep file order) and read with `getOrdered()`.
Images are optional `image()` fields — missing ones render a labelled placeholder via
`Picture.astro`, so the site always builds.

Reuse or adapt:

| Collection | Beerland use | Typical reuse |
| --- | --- | --- |
| `beers` | Core range + limited releases, tasting notes | Menu items, tap list, wines, cocktails |
| `merch` | Products with views, sizes, variants | Merch, gift vouchers, function packages |
| `locations` | Venue + event cards with map pins | Venue areas/rooms, other venues in a group |
| `instagram` | Hashtag photo grids | Gallery |

Add new collections the same way (schema + YAML file + `getOrdered`). Common ones for venues:
`specials` (day, dish, price, member price), `areas` (name, blurb, capacity, photo),
`events` (date, title, blurb), `menus` (section → items with price/notes).

## 5. Pages and components

Pages live in `src/pages/` (one `.astro` file per URL). Components to reuse:

- `BaseLayout` — head/meta, fonts, skip link, nav, footer, age gate, optional cart.
- `Nav` / `Footer` — driven by `nav` in `site.ts`; footer carries the liquor warning and acknowledgement.
- `Picture` — optimised image or placeholder.
- `BeerCarousel` — any "featured items" slider (prev/next, dots, read more).
- `Signup` — mailing list (`feature` and `bar` variants); posts to `site.mailingList.action` when set.
- `AgeGate` — 18+ overlay on every page, remembers per session or device.
- Home hero pattern in `src/pages/index.astro` — background video with poster, autoplay
  with fallbacks, pause button. For a photo hero, swap the `<video>` for rotating images.
- Merch page — filter chips, `<dialog>` product pop-ups, cart in localStorage.
- Where to Buy — location cards + illustrated SVG map with pins.

Interactivity is plain `<script>` per component. No UI framework — keep it that way.

## 6. Media recipes

- Put photos in `src/assets/...` (Astro converts to WebP and resizes). Keep files under ~2–3 MB.
- Large background textures: convert to WebP (`sharp`) and reference from CSS with a relative path.
- **Hero video** (muted, no audio track, H.264, faststart, ~9 MB max). Remove letterbox bars
  with `cropdetect`, then make a wide and a tall cut:

```sh
ffmpeg -i in.mp4 -vf cropdetect=limit=24:round=2 -f null - 2>&1 | grep -o 'crop=[0-9:]*' | sort | uniq -c | sort -rn | head -1
# wide 16:9 and tall 9:16 from the detected content box (example: 1920x820 at y=130)
ffmpeg -i in.mp4 -an -vf "crop=1458:820:231:130,scale=1280:720" -c:v libx264 -crf 26 -maxrate 1.8M -bufsize 3.6M -movflags +faststart hero-wide.mp4
ffmpeg -i in.mp4 -an -vf "crop=462:820:729:130,scale=720:1280"  -c:v libx264 -crf 26 -maxrate 1.8M -bufsize 3.6M -movflags +faststart hero-tall.mp4
```

  Use `-t <seconds>` to trim promo end cards, `xfade` to join clips, and bump a `?v=N`
  on the `<source>` URL when replacing a video so browsers don't play a cached copy.
- The sandbox Chromium can't decode H.264 — to test autoplay, encode a short WebM stand-in.

## 7. Compliance checklist (Australia)

- Liquor warning in the footer — use the wording required by the venue's state/territory Act.
- Liquor licence number and ABN in the footer.
- Acknowledgement of Country naming the right Traditional Custodians for the venue's location.
- 18+ age gate for alcohol brands; mailing list consent checkbox includes "I'm 18 or over".
- Third-party trademarks (e.g. old beer signage) need the owner's OK before publishing — keep the file, hide it.
- Price/discount promos (happy hours, member pricing) — check against the state liquor promotion guidelines.
- Keep `indexable: false` until placeholders are gone.

## 8. QA before every push

1. `npm run build` (runs `astro check` — must be 0 errors).
2. Build with the Pages base path and serve it: `BASE_PATH=/<repo> npx astro build`, copy `dist`
   into `<tmp>/site/<repo>/`, `python3 -m http.server`.
3. Playwright (`/opt/node22/lib/node_modules/playwright`) at 1440×900 and 390×844: no console
   errors, no 4xx responses, `scrollWidth` equals viewport width, every interactive piece clicked
   through. Set `sessionStorage.bl_age` in an init script to get past the age gate.
4. Screenshot the changed sections and look at them. Scroll lazy images into view first, or
   full-page screenshots show them blank.

## 9. Deploy (GitHub Pages)

- `.github/workflows/deploy.yml` builds and publishes on push to `main` and on manual dispatch.
- One-time, by the repo owner: **Settings → Pages → Source: GitHub Actions**.
- The `github-pages` environment only allows the repo's **default branch** to deploy. If the
  default branch isn't `main`, pushes to `main` fail at the deploy step with no logs — set
  **Settings → General → Default branch** to `main` (or add `main` under Settings → Environments).
- The sandbox can't reach `*.github.io`; confirm deploys through the Actions run status instead.
- Custom domain: Settings → Pages → Custom domain; the workflow picks up the new base path.

## 10. Wrap-up for the user

Give them: the live link, what changed, what's still a placeholder, what's for show only
(mailing list, cart, votes) and the one or two decisions you need from them.
