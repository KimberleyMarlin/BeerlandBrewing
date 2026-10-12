/**
 * Site-wide settings. Edit the values here — every page reads from this file.
 * Anything in [SQUARE BRACKETS] is a placeholder still waiting on real details.
 */
export const site = {
  name: 'Beerland Brewing',
  description: 'Small-batch beer from Beerland Brewing, brewed at Whitfords Brewing Co. in Hillarys, WA.',

  /** Brand accent colour used for buttons, labels and highlights. */
  accent: '#D99A3E',

  /**
   * Keep search engines out while the site still has placeholders.
   * Flip to `true` when it's ready to go public.
   */
  indexable: false,

  /** The countdown bar on the home page. Once the date passes it shows "Online now!". */
  nextDrop: {
    title: 'Jurassic Fog & Guava Lava',
    date: '2026-11-13T12:00:00+08:00',
  },

  brewery: {
    name: 'Whitfords Brewing Co.',
    address: ['Shop MM6, Westfield Whitford City', 'Cnr Marmion & Whitfords Ave, Hillarys WA 6025'],
    hours: '11am – late, every day',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Whitfords+Brewing+Co+Westfield+Whitford+City+Hillarys',
    bookingUrl: '', // [BOOKING LINK] — the "Book a table" button is hidden until this is set
  },

  social: {
    instagram: 'https://www.instagram.com/beerlandbrewing/',
    facebook: '', // [FACEBOOK URL]
  },

  legal: {
    licence: '[LICENCE NO.]',
    abn: '[ABN]',
  },

  /**
   * Mailing list. Paste the form "action" URL from your email provider
   * (e.g. Mailchimp → Audience → Signup forms → Embedded forms) and sign-ups
   * will be sent there. While it's empty, the form only shows a thank-you
   * message and nothing is saved.
   */
  mailingList: {
    action: '',
    emailField: 'EMAIL',
    firstNameField: 'FNAME',
  },
} as const;

export const nav = [
  { href: 'our-beers/', label: 'Our Beers' },
  { href: 'where-to-buy/', label: 'Where to Buy' },
  { href: 'merch/', label: 'Merch' },
] as const;
