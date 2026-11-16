/** Matches menu links that already point at cheese (by URL or title). */
export const CHEESE_PATTERN = /cheese|جبن|أجبان|اجبان/i;

export function isCheeseMenuItem(item: { url?: string | null; title?: string | null }): boolean {
  return CHEESE_PATTERN.test(item.url || '') || CHEESE_PATTERN.test(item.title || '');
}

type MenuItemLike = { id: string; title: string; url?: string | null };

/**
 * Makes sure the main menu links to the cheese page, right after the bundles
 * link. The Shopify menu is cached for up to an hour, so the site adds the
 * link itself; once Shopify sends its own cheese link this adds nothing.
 */
export function ensureCheeseItem<T extends MenuItemLike>(items: readonly T[], label: string): T[] {
  if (items.some(isCheeseMenuItem)) return [...items];
  const cheese = {
    ...(items[0] ?? {}),
    id: 'gid://shopify/MenuItem/cheese-collection',
    title: label,
    url: '/collections/cheese-collection',
    items: [],
    type: 'HTTP',
    resourceId: null,
    tags: [],
  } as unknown as T;
  const bundlesIndex = items.findIndex((i) => /\/collections\/bundles/i.test(i.url || ''));
  const at = bundlesIndex === -1 ? items.length : bundlesIndex + 1;
  return [...items.slice(0, at), cheese, ...items.slice(at)];
}
