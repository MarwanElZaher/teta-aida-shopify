import { describe, expect, test } from 'vitest';
import { OFFER, getOfferProgress, isOfferActive, isOfferProduct } from './offers';

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
