// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages serves this repo from a sub-path (e.g. /BeerlandBrewing/) until a
// custom domain is set up. The deploy workflow passes SITE_URL and BASE_PATH in;
// locally both fall back to serving from the root.
export default defineConfig({
  site: process.env.SITE_URL || 'https://kimberleymarlin.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
});
