import { getCollection, type CollectionKey, type CollectionEntry } from 'astro:content';

/** getCollection, but in the order entries appear in their YAML file. */
export async function getOrdered<C extends CollectionKey>(
  name: C,
  filter?: (entry: CollectionEntry<C>) => boolean,
): Promise<CollectionEntry<C>[]> {
  const entries = (await getCollection(name, filter)) as CollectionEntry<C>[];
  return entries.sort((a, b) => (a.data as { order: number }).order - (b.data as { order: number }).order);
}
