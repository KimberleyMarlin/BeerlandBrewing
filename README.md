# Beerland Brewing website

The Beerland Brewing site, built with [Astro](https://astro.build) as a fast static site and hosted on GitHub Pages.

## Editing content

Most changes don't need any code. Edit these files directly on GitHub (pencil icon) and the site redeploys automatically when the change lands on `main`.

| What | File |
| --- | --- |
| Address, hours, social links, licence/ABN, next-drop countdown, accent colour, mailing list | `src/config/site.ts` |
| Beers (core range + limited releases) | `src/content/beers.yaml` |
| Merch products and prices | `src/content/merch.yaml` |
| Where to Buy locations and map pins | `src/content/locations.yaml` |
| Instagram grid photos | `src/content/instagram.yaml` |
| Privacy Policy / Terms | `src/pages/privacy.astro`, `src/pages/terms.astro` |

Things to know:

- **Order:** items appear on the site in the same order as in their YAML file.
- **Images:** upload the photo into the matching `src/assets/...` folder, then add an `image:` line pointing to it (there are commented-out examples in `beers.yaml`). Until a photo is added, a striped placeholder shows instead. Astro resizes and compresses images automatically.
- **Home page tiles:** add `src/assets/photos/venue.jpg` and `src/assets/photos/merch-flatlay.jpg` and they appear on the "Where to buy" and "Merch" tiles. No code change needed.
- **Placeholders:** anything in `[SQUARE BRACKETS]` still needs real details.
- **Search engines:** the site is hidden from Google until `indexable` is set to `true` in `src/config/site.ts`.

## Still to connect

- **Mailing list:** paste your provider's form URL into `mailingList.action` in `src/config/site.ts`. Until then the form shows a thank-you but saves nothing.
- **Merch checkout:** the cart works and is remembered per device, but checkout isn't connected yet.
- **Face Off vote:** remembered on the visitor's own device only; it isn't counted anywhere.

## Running it locally

Requires Node 22+.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # type-checks and builds to dist/
```

## Deploying

`.github/workflows/deploy.yml` builds and publishes the site on every push to `main`. One-time setup: in the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.

The site is served at `https://kimberleymarlin.github.io/BeerlandBrewing/`. To use a custom domain (e.g. beerland.com.au), add it under **Settings → Pages → Custom domain**. The workflow picks up the new address automatically.

## How it's put together

- `src/pages/`: one file per page (`index.astro` is the home page).
- `src/components/`: shared pieces (nav, footer, age gate, sign-up, beer carousel).
- `src/layouts/BaseLayout.astro`: page shell, meta tags, fonts and the 18+ age check.
- `src/styles/global.css`: colours, type and buttons.
- `public/videos/`: hero header videos.

Interactive bits (carousel, merch pop-ups, cart, countdown) are small vanilla scripts inside each component. There's no front-end framework to maintain.
