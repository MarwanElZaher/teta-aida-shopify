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
  enabled: false,
  startsAt: null,
  endsAt: '2026-12-31T23:59:59+02:00',
  collectionHandle: 'pickles-products',
  buyQty: 3,
  getQty: 1,
  maxPerOrder: null,
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

export function getOfferProgress(config: OfferConfig, eligibleQty: number): OfferProgress {
  const group = config.buyQty + config.getQty;
  const q = Math.max(0, Math.floor(eligibleQty));
  if (q === 0) return { state: 'none', needed: group, earned: 0, showGiftPicker: false };

  const groups = Math.floor(q / group);
  const max = config.maxPerOrder ?? Infinity;
  const earned = Math.min(groups * config.getQty, max);
  const remainder = q % group;

  if (earned >= max || remainder === 0) {
    return { state: 'unlocked', needed: 0, earned, showGiftPicker: false };
  }
  const needed = group - remainder;
  return { state: 'progress', needed, earned, showGiftPicker: needed === 1 };
}
