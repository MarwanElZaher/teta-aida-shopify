import { Money } from '@shopify/hydrogen';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';
import { useTranslation } from '~/lib/translations';
import { formatCurrency } from '~/lib/utils';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  const { locale } = useTranslation();
  const lang = locale.language;

  return (
    <div className="flex items-center gap-3">
      {price ? (
        <span className="text-primary font-bold text-3xl">
          {formatCurrency(parseFloat(price.amount), price.currencyCode, lang)}
        </span>
      ) : (
        <span>&nbsp;</span>
      )}
      {compareAtPrice && (
        <span className="text-dark/40 line-through text-xl">
          {formatCurrency(parseFloat(compareAtPrice.amount), compareAtPrice.currencyCode, lang)}
        </span>
      )}
    </div>
  );
}
