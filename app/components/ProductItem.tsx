import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import { useVariantUrl } from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
  | CollectionItemFragment
  | ProductItemFragment
  | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  return (
    <Link
      className="group block hover-lift"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#F0EFEB] mb-4">
        {image && (
          <Image
            alt={image.altText || product.title}
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
        <h4 className="font-serif text-lg text-primary uppercase tracking-wide leading-tight group-hover:text-secondary transition-colors line-clamp-2 min-h-[3.5rem]">
          {product.title}
        </h4>
        <div className="flex justify-center items-center gap-2 text-sm font-sans font-medium pt-2">
          <span className="text-primary font-bold text-lg">
            <Money data={product.priceRange.minVariantPrice} />
          </span>
          {product.compareAtPriceRange?.minVariantPrice && (
            <span className="text-dark/40 line-through text-sm">
              <Money data={product.compareAtPriceRange.minVariantPrice} />
            </span>
          )}
        </div>
        <button className="w-full mt-3 h-[48px] rounded-[12px] border border-primary text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all">
          Shop
        </button>
      </div>
    </Link>
  );
}
