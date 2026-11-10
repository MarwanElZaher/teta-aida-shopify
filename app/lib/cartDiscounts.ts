import type { HydrogenCart, Storefront } from '@shopify/hydrogen';

/**
 * Hydrogen 2025.7's built-in `cart.updateDiscountCodes` declares
 * `$discountCodes: [String!]`, but the Storefront API requires `[String!]!`.
 * Every request fails GraphQL validation ("Nullability mismatch"), so the cart's
 * discount "Apply" silently did nothing and customers could only use codes at
 * Shopify checkout. Fixed upstream only in Hydrogen 2026.4+, so until that
 * upgrade the cart action uses this corrected mutation instead.
 */
export const CART_DISCOUNT_CODES_UPDATE_MUTATION = `#graphql
  mutation CartDiscountCodesUpdateFixed(
    $cartId: ID!
    $discountCodes: [String!]!
    $language: LanguageCode
    $country: CountryCode
  ) @inContext(country: $country, language: $language) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id
      }
      userErrors {
        code
        field
        message
      }
      warnings {
        code
        message
      }
    }
  }
` as const;

/** Trim, drop empties and duplicates (case-insensitive, first spelling wins). */
export function normalizeDiscountCodes(codes: unknown[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of codes) {
    if (typeof raw !== 'string') continue;
    const code = raw.trim();
    if (!code || seen.has(code.toLowerCase())) continue;
    seen.add(code.toLowerCase());
    out.push(code);
  }
  return out;
}

export async function updateCartDiscountCodes(
  { storefront, cart }: { storefront: Storefront; cart: HydrogenCart },
  codes: unknown[],
) {
  const { cartDiscountCodesUpdate, errors } = await storefront.mutate(
    CART_DISCOUNT_CODES_UPDATE_MUTATION,
    {
      variables: {
        cartId: cart.getCartId() ?? '',
        discountCodes: normalizeDiscountCodes(codes),
      },
    },
  );

  return {
    cart: cartDiscountCodesUpdate?.cart ?? null,
    userErrors: cartDiscountCodesUpdate?.userErrors ?? [],
    warnings: cartDiscountCodesUpdate?.warnings ?? [],
    errors,
  };
}
