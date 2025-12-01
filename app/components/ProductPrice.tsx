import { Money } from '@shopify/hydrogen';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  return (
    <div className="flex items-center gap-3">
      {price ? (
        <span className="text-primary font-bold text-3xl">
          <Money data={price} />
        </span>
      ) : (
        <span>&nbsp;</span>
      )}
      {compareAtPrice && (
        <span className="text-dark/40 line-through text-xl">
          <Money data={compareAtPrice} />
        </span>
      )}
    </div>
  );
}
