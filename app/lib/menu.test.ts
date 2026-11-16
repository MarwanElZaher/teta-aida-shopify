import { describe, expect, test } from 'vitest';
import { ensureCheeseItem } from './menu';

const item = (title: string, url: string) => ({ id: title, title, url, items: [] });
const shopifyMenu = [
  item('Home', '/'),
  item('Pickles Collection', '/collections/pickles-products'),
  item('All Bundles', '/collections/bundles'),
  item('About Us', '/pages/about-us'),
  item('Contact', '/pages/contact'),
];

describe('cheese link in the main menu', () => {
  test('adds Cheese Collection right after the bundles link', () => {
    const titles = ensureCheeseItem(shopifyMenu, 'Cheese Collection').map((i) => i.title);
    expect(titles).toEqual(['Home', 'Pickles Collection', 'All Bundles', 'Cheese Collection', 'About Us', 'Contact']);
    const cheese = ensureCheeseItem(shopifyMenu, 'تشكيلة الأجبان').find((i) => i.title === 'تشكيلة الأجبان');
    expect(cheese?.url).toBe('/collections/cheese-collection');
  });

  test('never duplicates a cheese link that Shopify already sends', () => {
    const withCheese = [...shopifyMenu.slice(0, 3), item('تشكيلة الأجبان', 'https://teta3ayda.com/collections/cheese-collection'), ...shopifyMenu.slice(3)];
    expect(ensureCheeseItem(withCheese, 'Cheese Collection')).toHaveLength(6);
  });

  test('appends at the end when there is no bundles link', () => {
    const titles = ensureCheeseItem([item('Home', '/')], 'Cheese Collection').map((i) => i.title);
    expect(titles).toEqual(['Home', 'Cheese Collection']);
  });
});
