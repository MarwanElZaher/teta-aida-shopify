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

  // Get tagline from metafields
  const tagline = product.metafields?.find((m: any) => m?.key === 'tagline')?.value;

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
            className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        {/* Optional: Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
      </div>

      <div className="text-center space-y-2 flex-1 flex flex-col">
        <h4 className="font-serif text-sm sm:text-lg text-primary uppercase tracking-wide leading-tight group-hover:text-secondary transition-colors line-clamp-3 min-h-[4.5rem]">
          {displayTitle}
        </h4>
        {tagline && (
          <p className="text-[11px] sm:text-xs text-dark/70 font-sans line-clamp-2 px-2">{tagline}</p>
        )}
        <div className="flex-1" />
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
        <button className="w-full mt-3 h-[48px] rounded-[12px] bg-primary text-white font-bold uppercase tracking-widest text-xs hover:bg-[#143d24] transition-all shadow-sm group-hover:shadow-md">
          {t('product.viewProduct')}
        </button>
      </div>
    </Link>
  );
}
