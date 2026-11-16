/**
 * "Buy 3 jars, the 4th is on us" offer.
 *
 * Shopify owns the rule and the price: an automatic Buy X get Y discount in the
 * admin frees the cheapest jar. This module only describes that rule so the site
 * can show it. Keep OFFER in step with the admin discount:
 *   - collection  = collectionHandle (buys and gets from the same collection)
 *   - quantities  = buyQty / getQty, "maximum uses per order" = maxPerOrder
 *   - title       = discountTitle, character for character
 * Leave `enabled` false until the automatic discount is live in Shopify.
 */

export type OfferConfig = {
  enabled: boolean;
  /** ISO timestamps with offset (Cairo, +02:00); null = open-ended. */
  startsAt: string | null;
  endsAt: string | null;
  collectionHandle: string;
  buyQty: number;
  getQty: number;
  /** Free items allowed per order; null = repeats for every group. */
  maxPerOrder: number | null;
  discountTitle: string;
};

export const OFFER: OfferConfig = {
  enabled: true,
  startsAt: null,
  endsAt: '2026-12-31T23:59:59+02:00',
  collectionHandle: 'pickles-products',
  buyQty: 3,
  getQty: 1,
  maxPerOrder: null,
  // Matched loosely (see normalizeTitle). If it doesn't match the admin title,
  // the free tag and offer line disappear and the progress bar stops claiming a free jar.
  discountTitle: 'اشتري ٣ والرابع علينا',
};

export function isOfferActive(config: OfferConfig, now: Date = new Date()): boolean {
  if (!config.enabled) return false;
  const t = now.getTime();
  if (config.startsAt && t < Date.parse(config.startsAt)) return false;
  if (config.endsAt && t > Date.parse(config.endsAt)) return false;
  return true;
}

export function isOfferProduct(
  config: OfferConfig,
  collectionHandles: readonly string[],
): boolean {
  return collectionHandles.includes(config.collectionHandle);
}

export type OfferProgress = {
  state: 'none' | 'progress' | 'unlocked';
  /** Jars still to add for the next free one (0 when unlocked or maxed). */
  needed: number;
  /** Free jars earned, capped at maxPerOrder. */
  earned: number;
  showGiftPicker: boolean;
};

/**
 * @param offerApplied whether Shopify actually discounted anything through the
 * offer. When the cart has enough jars but Shopify applied nothing (a better
 * code won, the admin rule ended, a title mismatch), never claim a free jar.
 */
export function getOfferProgress(
  config: OfferConfig,
  eligibleQty: number,
  offerApplied = true,
): OfferProgress {
  const group = config.buyQty + config.getQty;
  const q = Math.max(0, Math.floor(eligibleQty));
  const none: OfferProgress = { state: 'none', needed: group, earned: 0, showGiftPicker: false };
  if (q === 0) return none;

  const groups = Math.floor(q / group);
  const max = config.maxPerOrder ?? Infinity;
  const earned = Math.min(groups * config.getQty, max);
  if (earned > 0 && !offerApplied) return none;
  const remainder = q % group;

  if (earned >= max || remainder === 0) {
    return { state: 'unlocked', needed: 0, earned, showGiftPicker: false };
  }
  const needed = group - remainder;
  return { state: 'progress', needed, earned, showGiftPicker: true };
}

/** A jar the cart can suggest as the free 4th item. */
export type OfferProduct = {
  id: string;
  handle: string;
  title: string;
  titleAr?: string | null;
  variantId: string;
  price: number;
  availableForSale: boolean;
  imageUrl?: string | null;
  /** Has a heat-level choice: send the customer to the product page instead of one-tap add. */
  hasOptions?: boolean;
};

/**
 * Whether a jar needs its product page to pick a heat level: it's sold as
 * several variants (Normal / Spicy / …) or lists heat levels in a metafield.
 */
export function hasHeatChoice(variantCount: number, heatLevelsJson: string | null | undefined): boolean {
  if (variantCount > 1) return true;
  if (!heatLevelsJson) return false;
  try {
    const levels: unknown = JSON.parse(heatLevelsJson);
    return Array.isArray(levels) && levels.length > 0;
  } catch {
    return false;
  }
}

/** Available jars, cheapest first (ties keep their collection order). */
export function cheapestOfferProducts(products: readonly OfferProduct[], n = 2): OfferProduct[] {
  return products
    .filter((p) => p.availableForSale)
    .map((p, i) => ({ p, i }))
    .sort((a, b) => a.p.price - b.p.price || a.i - b.i)
    .slice(0, n)
    .map(({ p }) => p);
}

/**
 * Jars to suggest while the cart is short of a group: the ones the customer
 * hasn't added yet. When every available jar is already in the cart, suggest
 * those again so there's still something to add.
 */
export function suggestOfferProducts(
  products: readonly OfferProduct[],
  inCartHandles: readonly string[],
  n = 3,
): OfferProduct[] {
  const inCart = new Set(inCartHandles);
  const missing = products.filter((p) => !inCart.has(p.handle));
  const picks = cheapestOfferProducts(missing, n);
  return picks.length > 0 ? picks : cheapestOfferProducts(products, n);
}

/**
 * Cheese pages (the cheese collection and cheese product pages) aren't part of
 * the jar offer, so the offer ribbon stays off there. Cheese handles all
 * contain "cheese".
 */
export function isCheesePath(pathname: string): boolean {
  return /\/(collections|products)\/[^/]*cheese/i.test(pathname);
}

/** Translation key for the cart progress message; null when nothing to say. */
export function offerProgressKey(progress: OfferProgress): string | null {
  if (progress.state === 'none') return null;
  if (progress.state === 'unlocked') return 'offer.unlocked';
  return `offer.${progress.earned === 0 ? 'need' : 'needMore'}${progress.needed}`;
}

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/**
 * The admin title is typed by hand, so compare loosely: trim, collapse spaces,
 * Arabic-Indic digits → ASCII, ى → ي, أ/إ/آ → ا.
 */
export function normalizeTitle(title: string | null | undefined): string {
  return (title ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
    .replace(/ى/g, 'ي')
    .replace(/[أإآ]/g, 'ا');
}

/** The slice of a Storefront API cart line this module reads. */
export type OfferLineInput = {
  id: string;
  quantity: number;
  cost?: { amountPerQuantity?: { amount: string } | null } | null;
  discountAllocations?: ReadonlyArray<{
    title?: string | null;
    discountedAmount: { amount: string };
  }> | null;
  merchandise?: {
    product?: {
      collections?: { nodes: ReadonlyArray<{ handle: string }> } | null;
    } | null;
  } | null;
};

export type CartOfferSummary = {
  eligibleQty: number;
  /** Sum of the offer's allocations (matched by discount title). */
  offerSavings: number;
  /** Only lines with at least one free unit. */
  freeUnitsByLineId: Record<string, number>;
};

/**
 * Reads what Shopify already decided: which lines count toward the offer and
 * which units it made free. Lines missing product data (optimistic lines,
 * bundle components) don't count.
 */
export function summarizeCartOffer(
  config: OfferConfig,
  lines: readonly OfferLineInput[],
): CartOfferSummary {
  const wanted = normalizeTitle(config.discountTitle);
  let eligibleQty = 0;
  let offerCents = 0;
  const freeUnitsByLineId: Record<string, number> = {};

  for (const line of lines) {
    const handles = line.merchandise?.product?.collections?.nodes?.map((n) => n.handle) ?? [];
    if (isOfferProduct(config, handles)) eligibleQty += line.quantity;

    const lineOffer = (line.discountAllocations ?? [])
      .filter((a) => normalizeTitle(a.title) === wanted)
      .reduce((sum, a) => sum + parseFloat(a.discountedAmount.amount || '0'), 0);
    if (lineOffer <= 0) continue;
    offerCents += Math.round(lineOffer * 100);

    const unit = parseFloat(line.cost?.amountPerQuantity?.amount ?? '0');
    if (unit > 0) {
      const free = Math.min(line.quantity, Math.round(lineOffer / unit));
      if (free > 0) freeUnitsByLineId[line.id] = free;
    }
  }

  return { eligibleQty, offerSavings: offerCents / 100, freeUnitsByLineId };
}
