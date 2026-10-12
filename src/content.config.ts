import { defineCollection, reference } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'yaml';

// Load a YAML list, remembering each entry's position so pages can keep file order.
const ordered = (path: string) =>
  file(path, {
    parser: (text) => (parse(text) as Record<string, unknown>[]).map((entry, order) => ({ ...entry, order })),
  });

// Each collection is a single YAML file in src/content/. Images are optional:
// leave `image` out and the site shows a branded placeholder until a photo is added.

const beers = defineCollection({
  loader: ordered('src/content/beers.yaml'),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      name: z.string(),
      range: z.enum(['core', 'limited']),
      style: z.string(),
      abv: z.number().nullable(),
      summary: z.string(),
      notes: z.array(z.string()).default([]),
      specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      tag: z.string().optional(),
      colour: z.string().default('#2A2119'),
      image: image().optional(),
      alt: z.string(),
      featured: z.boolean().default(false),
      faceOff: z.boolean().default(false),
    }),
});

const merch = defineCollection({
  loader: ordered('src/content/merch.yaml'),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      name: z.string(),
      category: z.enum(['Apparel', 'Headwear', 'Accessories']),
      price: z.number().nullable(),
      colour: z.string(),
      detail: z.string(),
      sizes: z.array(z.string()).optional(),
      /** true when each view is a different variant to choose from (e.g. reversible prints) */
      variants: z.boolean().default(false),
      views: z.array(z.object({ label: z.string(), image: image().optional() })).min(1),
    }),
});

const locations = defineCollection({
  loader: ordered('src/content/locations.yaml'),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      name: z.string(),
      kind: z.enum(['brewery', 'event', 'stockist']),
      badge: z.string(),
      address: z.array(z.string()),
      hours: z.string().optional(),
      blurb: z.string(),
      mapsUrl: z.url(),
      logo: image().optional(),
      beers: z.array(reference('beers')).default([]),
      /** Pin position on the illustrated map, as percentages from the top-left. */
      pin: z.object({ x: z.number(), y: z.number(), label: z.string() }),
      colour: z.string().optional(),
    }),
});

const instagram = defineCollection({
  loader: ordered('src/content/instagram.yaml'),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      posts: z.array(z.object({ image: image().optional(), url: z.url().optional() })),
    }),
});

export const collections = { beers, merch, locations, instagram };
