# Buy 3 jars, the 4th is on us — design

Date: 2026-11-16 · Store: teta3ayda.com (Hydrogen 2025.7 on Oxygen, Shopify Basic)
Proposal shown to the owner: https://claude.ai/artifact/PA1CpGEFPBVZf9vJV99zob

## Intent

Teta Aida wants a "buy 3, get 1 free" offer where the free item is always the
cheapest jar in the cart. The goal is bigger baskets (4 jars instead of 1–2)
without a code customers have to find and type, and without the website and
checkout ever showing different totals.

## Goals

- Any 4 eligible jars in the cart → the cheapest one costs 0, in the cart and at
  Shopify checkout, with no code.
- Customers can see the offer before, during and after adding to cart: ribbon,
  badge on jars, product-page note, cart progress, the free line marked "هدية".
- Works in Arabic and English, desktop and phone, cart page and cart drawer.
- Reaching the end date removes every trace of the offer from the site without a
  deploy. Stopping it early is a one-line flag change plus a push (~3 minutes).

## Non-goals

- No custom pricing logic on our side. Shopify decides the price; the site only
  displays what Shopify's cart returns.
- No paid app, no Shopify Plus features.
- Boxes (bundles) are not part of the offer (default, see owner decisions).
- No auto-adding the free jar to the cart. The customer picks it.

## Anti-goals (failure even if it "works")

- The site shows a free jar that checkout then charges for.
- A customer with 4 jars sees no sign of the offer, or can't tell which jar is free.
- The existing discount Apply flow (fixed in 95b32dc) breaks or shows a misleading
  "invalid code" message when a code loses to the offer.

## Approaches considered

| | Approach | Verdict |
|---|---|---|
| **A** | Shopify admin automatic "Buy X get Y" discount sets the price; Hydrogen code only displays it | **Picked by the user.** Shopify's help page states that when buy and get use the same collection, "the lower-priced item that the customer chooses is the item that the customer gets at a discount". Free on Basic, enforced at checkout. |
| B | Hydrogen code only (or the site auto-applying a hidden code at 4 jars) | Ruled out. The storefront can't set prices; checkout recalculates. The hidden-code variant still depends on Shopify's discount, adds failure points, and exposes a shareable code at checkout. |
| C | Custom Shopify Function | Fallback only. Custom apps with Functions are Plus-only; on Basic it means a paid public app (e.g. BOGOS). Use only if A fails the cheapest-jar test. |

## Constraints

- Shopify Basic: products in a Buy X get Y discount can't receive further product
  discounts; Shopify gives the customer the best single discount. Max 25 active
  automatic discounts.
- The cart must contain the paid jars and the free jar (4 for one free jar).
  Shopify never adds the free item itself.
- The help page states the cheapest-item rule in the automatic-discount steps;
  it's not stated for codes. So the final proof is a short live check after the
  discount is switched to automatic.
- Hydrogen 2025.7's built-in discount mutation is broken (see
  `app/lib/cartDiscounts.ts`); don't regress that workaround.

## Design

### 1. The rule (Shopify admin)

Automatic discount, type Buy X get Y:

- Title (shown to customers in cart data and checkout): `اشتري ٣ والرابع علينا`
- Customer buys: minimum quantity 3, from collection `pickles-products`
- Customer gets: quantity 1, from collection `pickles-products`, Free
- Maximum uses per order: per owner decision 2 (default: empty = every 4 jars)
- Combinations: none (owner decision 3)
- Start/end dates: owner decision 5

Before launch, confirm `pickles-products` contains exactly the 5 jars
(olives 390, lemons 225, cabbage 225, turnips 190, cucumbers 190) and no boxes.

### 2. Offer config (code)

One file, e.g. `app/lib/offers.ts`, holding the offer's settings so the UI and the
admin rule stay described in one place:

- `enabled`, `startsAt`, `endsAt` — the UI shows only inside the window.
- `collectionHandle: 'pickles-products'`, `buyQty: 3`, `getQty: 1`,
  `maxPerOrder` (null = repeats).
- `discountTitle` — used to recognise the offer's allocation on cart lines.
- Ribbon/badge copy lives in `translations.ts` (AR + EN).

### 3. Cart data

Extend the `CartLine` fragment in `app/lib/fragments.ts`:

- `discountAllocations { discountedAmount { ...Money } ... on CartAutomaticDiscountAllocation { title } }`
  — tells us which line Shopify made free and by how much.
- `product { collections(first: 10) { nodes { handle } } }` — tells us which lines
  count toward the offer, from the same collection the admin rule uses (no
  hard-coded product list to drift).

Regenerate `storefrontapi.generated.d.ts` with codegen.

### 4. What the customer sees

- **Ribbon** — the existing `PromoRibbon` (uncommitted, local) shows the offer text
  while the offer is live. Replaces the White Friday text unless the owner decides
  otherwise (owner decision 4).
- **Badge** — gold "٣ + ١ هدية" / "3 + 1 free" on product cards (`ProductItem`) for
  products in the collection. Cards need `collections` handles in their fragment, or
  the badge is driven by the collection the page is rendering (builder's call).
- **Product page + ad landing pages (`alp.*`)** — one line above Add to cart for
  eligible products: "اختار أي ٤ برطمانات والأرخص هدية".
- **Cart progress** (drawer and page, top of the line list) — counts eligible units
  `q`:
  - `q % 4 === 0 && q > 0` → "🎉 أرخص برطمان بقى هدية" (full bar)
  - otherwise → "ضيف N برطمان والرابع هدية" with N = 4 − (q % 4), bar at (q % 4)/4
  - once `maxPerOrder` free jars are earned, show the success message and stop nudging.
- **Pick your gift** — when N = 1, show the two cheapest available eligible jars with
  a one-tap Add (data from the `pickles-products` collection; loading approach is the
  builder's call).
- **Free line** — a line with an allocation whose title matches the offer gets a gold
  "هدية" tag and its price crossed out. If quantity > 1 and only part is free,
  show "١ هدية" (free units = discountedAmount ÷ amountPerQuantity).
- **Summary** — the existing savings logic already shows the total saved; add an
  "عرض ٣ + ١ −X" line for the offer's part, separate from code discounts.
- **Codes vs. offer** — when a code comes back `applicable: false` while the offer is
  applied, say "الكود ده مش بيتجمع مع عرض ٣ + ١" instead of "invalid".

### 5. WhatsApp agent (gawebly, tenant tetaaidapickles)

Add a knowledge item with the same offer wording, the dates, that boxes don't count,
and delivery 100 EGP. Remove it when the offer ends.

## Test plan

1. Create the rule first as a limited discount code (e.g. `T3P1TEST`, 10 uses) and
   apply it in the live cart:
   - olives + lemons + cabbage + turnips → turnips free (1,030 → 840)
   - 3 olives + 1 cucumber → cucumber free (1,360 → 1,170)
   - 4 olives → one olive free (1,560 → 1,170)
   - 2 turnips + 2 olives → one turnip free
   - box + 3 jars → nothing free
   - 8 jars → 2 free (if repeating)
2. Delete the code, create the automatic version, re-run cases 1 and 3 live within
   minutes, and check Shopify checkout matches the cart (AR + EN, phone + desktop).
3. TETA20 with 4 jars → Shopify keeps the better discount; message reads correctly.
4. Offer disabled or past `endsAt` → no ribbon, badge, progress or tag.
5. Existing flows: code apply/remove, bundle lines, empty cart.

If Shopify does not free the cheapest jar in step 1 or 2 → stop, switch to approach C.

## Owner decisions (defaults used until answered)

1. Products: **jars only** (boxes already discounted).
2. Repeat: **every 4 jars** (optionally cap at 3 free per order).
3. Stacking with codes: **no**.
4. White Friday: **pick one message**; default is 3 + 1 replaces the ribbon text.
5. Dates/wording: "اشتري ٣ والرابع علينا" / "Buy 3, the 4th is on us", until 31 Dec.

All five change settings (admin rule + offer config), not the build.

## Left to the builder

- Component structure, where the progress bar and gift picker live, styling within the
  current site look.
- How "pick your gift" products are loaded.
- Whether badges come from a fragment field or the page's collection.
