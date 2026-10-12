/** "Session IPA · 4.2%", or "Pale Lager · [X.X]%" while the ABV is unknown. */
export function formatStyle(style: string, abv: number | null): string {
  return `${style} · ${abv == null ? '[X.X]' : abv.toFixed(1)}%`;
}

/** "$40", or "Price TBC" while the price is unknown. */
export function formatPrice(price: number | null): string {
  return price == null ? 'Price TBC' : `$${price % 1 ? price.toFixed(2) : price}`;
}
