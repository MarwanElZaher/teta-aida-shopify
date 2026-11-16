import { describe, expect, test } from 'vitest';
import {
  OFFER,
  cheapestOfferProducts,
  getOfferProgress,
  hasHeatChoice,
  isCheesePath,
  isOfferActive,
  isOfferProduct,
  offerProgressKey,
  suggestOfferProducts,
  summarizeCartOffer,
  type OfferLineInput,
  type OfferProduct,
} from './offers';

const cfg = { ...OFFER, enabled: true };

describe('offer window and eligibility', () => {
  test('isOfferActive boundaries', () => {
    const w = { ...cfg, startsAt: '2026-11-20T00:00:00+02:00', endsAt: '2026-12-31T23:59:59+02:00' };
    expect(isOfferActive(w, new Date('2026-11-19T21:59:59Z'))).toBe(false);
    expect(isOfferActive(w, new Date('2026-11-19T22:00:00Z'))).toBe(true);
    expect(isOfferActive(w, new Date('2026-12-31T21:59:59Z'))).toBe(true);
    expect(isOfferActive(w, new Date('2026-12-31T22:00:00Z'))).toBe(false);
    expect(isOfferActive({ ...w, enabled: false }, new Date('2026-12-01T00:00:00Z'))).toBe(false);
    expect(isOfferActive({ ...cfg, startsAt: null, endsAt: null }, new Date())).toBe(true);
  });

  test('isOfferProduct', () => {
    expect(isOfferProduct(cfg, ['all', 'pickles-products'])).toBe(true);
    expect(isOfferProduct(cfg, ['pickle-bundles'])).toBe(false);
    expect(isOfferProduct(cfg, [])).toBe(false);
  });
});

describe('offer progress', () => {
  test('progress through two groups', () => {
    expect(getOfferProgress(cfg, 0)).toMatchObject({ state: 'none', earned: 0, showGiftPicker: false });
    expect(getOfferProgress(cfg, 1)).toMatchObject({ state: 'progress', needed: 3, earned: 0 });
    expect(getOfferProgress(cfg, 3)).toMatchObject({ state: 'progress', needed: 1, showGiftPicker: true });
    expect(getOfferProgress(cfg, 4)).toMatchObject({ state: 'unlocked', needed: 0, earned: 1, showGiftPicker: false });
    expect(getOfferProgress(cfg, 7)).toMatchObject({ state: 'progress', needed: 1, earned: 1, showGiftPicker: true });
    expect(getOfferProgress(cfg, 8)).toMatchObject({ state: 'unlocked', earned: 2 });
  });

  test('stops nudging at maxPerOrder', () => {
    const once = { ...cfg, maxPerOrder: 1 };
    expect(getOfferProgress(once, 4)).toMatchObject({ state: 'unlocked', earned: 1 });
    expect(getOfferProgress(once, 7)).toMatchObject({ state: 'unlocked', needed: 0, earned: 1, showGiftPicker: false });
  });
});

const T = OFFER.discountTitle;
const J = ['pickles-products'];
const line = (
  id: string,
  qty: number,
  unit: number,
  handles: string[],
  allocs: Array<[string, number]> = [],
): OfferLineInput => ({
  id,
  quantity: qty,
  cost: { amountPerQuantity: { amount: String(unit) } },
  discountAllocations: allocs.map(([title, amount]) => ({ title, discountedAmount: { amount: String(amount) } })),
  merchandise: { product: { collections: { nodes: handles.map((handle) => ({ handle })) } } },
});

describe('cart offer summary', () => {
  test('four mixed jars, turnips free', () => {
    const s = summarizeCartOffer(cfg, [line('o', 1, 390, J), line('l', 1, 225, J), line('c', 1, 225, J), line('t', 1, 190, J, [[T, 190]])]);
    expect(s).toEqual({ eligibleQty: 4, offerSavings: 190, freeUnitsByLineId: { t: 1 } });
  });

  test('marks one unit free on a two-unit line', () => {
    const s = summarizeCartOffer(cfg, [line('t', 2, 190, J, [[T, 190]]), line('o', 2, 390, J)]);
    expect(s.freeUnitsByLineId).toEqual({ t: 1 });
    expect(s.eligibleQty).toBe(4);
  });

  test('freeUnits ignores allocations with another title', () => {
    const s = summarizeCartOffer(cfg, [line('t', 1, 190, J, [['TETA20', 38]])]);
    expect(s).toEqual({ eligibleQty: 1, offerSavings: 0, freeUnitsByLineId: {} });
  });

  test('lines without collections do not count', () => {
    const s = summarizeCartOffer(cfg, [{ id: 'opt', quantity: 2 }, line('box', 1, 950, ['pickle-bundles']), line('z', 1, 0, J, [[T, 0]])]);
    expect(s).toEqual({ eligibleQty: 1, offerSavings: 0, freeUnitsByLineId: {} });
  });
});

describe('progress message', () => {
  test('picks the message key for each state', () => {
    expect(offerProgressKey(getOfferProgress(cfg, 1))).toBe('offer.need3');
    expect(offerProgressKey(getOfferProgress(cfg, 2))).toBe('offer.need2');
    expect(offerProgressKey(getOfferProgress(cfg, 3))).toBe('offer.need1');
    expect(offerProgressKey(getOfferProgress(cfg, 4))).toBe('offer.unlocked');
    expect(offerProgressKey(getOfferProgress(cfg, 6))).toBe('offer.needMore2');
    expect(offerProgressKey(getOfferProgress(cfg, 0))).toBeNull();
  });
});

describe('gift picker', () => {
  test('cheapest available jars first', () => {
    const p = (title: string, price: number, availableForSale = true): OfferProduct => ({
      id: title, handle: title, title, variantId: `v-${title}`, price, availableForSale,
    });
    const list = [p('olives', 390), p('lemons', 225), p('turnips', 190, false), p('cucumbers', 190), p('cabbage', 225)];
    expect(cheapestOfferProducts(list).map((x) => x.title)).toEqual(['cucumbers', 'lemons']);
  });
});

describe('suggestions for the jars still missing', () => {
  const p = (handle: string, price: number, availableForSale = true): OfferProduct => ({
    id: handle, handle, title: handle, variantId: `v-${handle}`, price, availableForSale,
  });
  const all = [p('olives', 390), p('lemons', 225), p('cabbage', 225), p('cucumbers', 190), p('turnips', 190)];

  test('shows the picker whenever the cart is short of a group', () => {
    expect(getOfferProgress(cfg, 1)).toMatchObject({ state: 'progress', needed: 3, showGiftPicker: true });
    expect(getOfferProgress(cfg, 2)).toMatchObject({ state: 'progress', needed: 2, showGiftPicker: true });
    expect(getOfferProgress(cfg, 5)).toMatchObject({ state: 'progress', needed: 3, showGiftPicker: true });
  });

  test('suggests the other jars when X is already in the cart', () => {
    expect(suggestOfferProducts(all, ['cucumbers']).map((x) => x.handle)).toEqual(['turnips', 'lemons', 'cabbage']);
    expect(suggestOfferProducts(all, ['olives', 'lemons', 'cabbage']).map((x) => x.handle)).toEqual(['cucumbers', 'turnips']);
  });

  test('skips sold-out jars and falls back to cart jars when nothing else is left', () => {
    const soldOut = all.map((x) => (x.handle === 'turnips' ? { ...x, availableForSale: false } : x));
    expect(suggestOfferProducts(soldOut, ['cucumbers', 'olives']).map((x) => x.handle)).toEqual(['lemons', 'cabbage']);
    expect(suggestOfferProducts(all, all.map((x) => x.handle)).map((x) => x.handle)).toEqual(['cucumbers', 'turnips', 'lemons']);
  });
});

describe('jars with a heat-level choice', () => {
  test('a jar sold in several heat variants needs its product page', () => {
    expect(hasHeatChoice(3, null)).toBe(true);
    expect(hasHeatChoice(1, '["Normal","Spicy"]')).toBe(true);
    expect(hasHeatChoice(1, null)).toBe(false);
    expect(hasHeatChoice(1, '[]')).toBe(false);
    expect(hasHeatChoice(1, 'not json')).toBe(false);
  });
});

describe('offer ribbon placement', () => {
  test('hidden on cheese pages, shown elsewhere', () => {
    expect(isCheesePath('/collections/cheese-collection')).toBe(true);
    expect(isCheesePath('/ar/collections/cheese-collection')).toBe(true);
    expect(isCheesePath('/products/signature-cheese-duo')).toBe(true);
    expect(isCheesePath('/ar/products/cheese-no-13-asfar-lemon')).toBe(true);
    expect(isCheesePath('/collections/pickles-products')).toBe(false);
    expect(isCheesePath('/ar/cart')).toBe(false);
    expect(isCheesePath('/')).toBe(false);
  });
});

describe('review fixes', () => {
  test('no free-jar claim when Shopify applied no offer', () => {
    expect(getOfferProgress(cfg, 4, false)).toMatchObject({ state: 'none', showGiftPicker: false });
    expect(getOfferProgress(cfg, 7, false)).toMatchObject({ state: 'none', showGiftPicker: false });
    expect(getOfferProgress(cfg, 3, false)).toMatchObject({ state: 'progress', needed: 1, showGiftPicker: true });
    expect(getOfferProgress(cfg, 4, true)).toMatchObject({ state: 'unlocked', earned: 1 });
  });

  test('discount title matches despite everyday typing differences', () => {
    const typed = '  اشترى 3  والرابع علينا ';
    const s = summarizeCartOffer(cfg, [line('t', 1, 190, J, [[typed, 190]])]);
    expect(s.freeUnitsByLineId).toEqual({ t: 1 });
    expect(s.offerSavings).toBe(190);
  });
});
