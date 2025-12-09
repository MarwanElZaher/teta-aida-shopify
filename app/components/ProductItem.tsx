import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import { useVariantUrl } from '~/lib/variants';
import { useTranslation } from '~/lib/translations';
import { getLocalizedTitle } from '~/lib/localized-content';
import { formatCurrency } from '~/lib/utils';

export function ProductItem({
  product,
  loading,
}: {
  product:
  | CollectionItemFragment
  | ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const { t, locale } = useTranslation();

  // Get localized title (Arabic if available, otherwise English)
  const displayTitle = getLocalizedTitle(
    product.title,
    product.metafields as any,
    locale.language
  );

  return (
    <Link
      className="group flex flex-col h-full min-h-[450px] hover-lift"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#F0EFEB] mb-4">
        {image && (
          <Image
            alt={image.altText || displayTitle}
            aspectRatio="4/5"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        {/* Optional: Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
      </div>

      <div className="text-center space-y-2">
        <h4 className="font-serif text-lg text-primary uppercase tracking-wide leading-tight group-hover:text-secondary transition-colors line-clamp-3 min-h-[4.5rem]">
          {displayTitle}
        </h4>
        <div className="flex justify-center items-center gap-2 text-sm font-sans font-medium pt-2">
          <span className="text-primary font-bold text-lg">
            {formatCurrency(
              parseFloat(product.priceRange.minVariantPrice.amount),
              product.priceRange.minVariantPrice.currencyCode,
              locale.language
            )}
          </span>
          {product.compareAtPriceRange?.minVariantPrice &&
            parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > 0 && (
              <span className="text-dark/40 line-through text-sm">
                {formatCurrency(
                  parseFloat(product.compareAtPriceRange.minVariantPrice.amount),
                  product.compareAtPriceRange.minVariantPrice.currencyCode,
                  locale.language
                )}
              </span>
            )}
        </div>
        <button className="w-full mt-2 h-[48px] rounded-[12px] border border-primary text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all">
          {t('product.viewProduct')}
        </button>
      </div>
    </Link>
  );
}
