/**
 * Extracts a URL-safe slug from a content collection entry ID or file path.
 * Removes the file extension (.md, .mdx) and optionally the collection prefix.
 *
 * @param id - The collection entry ID or file path (e.g., 'news/my-post.md' or 'my-post.md')
 * @param collectionPrefix - Optional collection prefix to remove (e.g., 'news/')
 * @returns The slug without extension and prefix
 */

const slugCache: Map<string, string> = new Map();

export function slugFromId(id: string, collectionPrefix?: string): string {
  // Use cache to avoid repeated work for the same id + prefix
  const cacheKey = `${collectionPrefix ?? ''}|${id}`;
  const cached = slugCache.get(cacheKey);
  if (cached) return cached;

  let slug = id;

  // Remove collection prefix if provided
  if (collectionPrefix) {
    slug = slug.replace(`${collectionPrefix}/`, '');
  }

  // Remove file extension (.md or .mdx)
  const result =
    slug
      .split('/')
      .pop()
      ?.replace(/\.mdx?$/, '') ?? slug;

  slugCache.set(cacheKey, result);
  return result;
}

/**
 * Precompute slugs for a list of ids and store them in the cache.
 * Useful for build-time precomputation to avoid runtime work.
 * Returns a map of original id -> slug.
 */
export function precomputeSlugs(
  ids: string[],
  collectionPrefix?: string
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const id of ids) {
    const s = slugFromId(id, collectionPrefix);
    out[id] = s;
  }
  return out;
}

/**
 * Clear the internal slug cache. Exported for testability.
 */
export function clearSlugCache(): void {
  slugCache.clear();
}

/**
 * Universal slug resolver for any collection entry
 * Works for news, holiday, file - all content types
 */
type EntryLike = { slug?: string; filePath?: string; id?: string };

export function getEntrySlug(
  entry: EntryLike | null | undefined,
  collectionPrefix?: string
): string {
  if (!entry) return '';

  // 1. Use explicit slug if defined
  if (typeof entry.slug === 'string' && entry.slug.length > 0)
    return entry.slug;

  // 2. Get ID (filePath or id property)
  const idOrPath = entry.filePath ?? entry.id;
  if (idOrPath == null) return '';

  // 3. Generate slug (uses internal cache via slugFromId)
  return slugFromId(String(idOrPath), collectionPrefix);
}

/**
 * Batch version for multiple entries
 */
export function getEntrySlugs(
  entries: EntryLike[] = [],
  collectionPrefix?: string
): Map<EntryLike, string> {
  const slugMap = new Map<EntryLike, string>();

  if (!entries || entries.length === 0) return slugMap;

  // Precompute all ids at once for performance
  const ids = entries.map((e) => e.filePath ?? e.id ?? '').map(String);
  const computed = precomputeSlugs(ids, collectionPrefix);

  entries.forEach((entry) => {
    const idOrPath = entry.filePath ?? entry.id ?? '';
    const key = String(idOrPath);
    const slug =
      typeof entry.slug === 'string' && entry.slug.length > 0
        ? entry.slug
        : computed[key];
    slugMap.set(entry, slug ?? '');
  });

  return slugMap;
}
