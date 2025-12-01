import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type { Product } from '@shopify/hydrogen/storefront-api-types';

interface BundleCardProps {
    product: Product;
}

export function BundleCard({ product }: BundleCardProps) {
    const { title, handle, featuredImage } = product;
    const price = product.priceRange?.minVariantPrice;
    const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;

    // Parse tagline from metafields if available
    const tagline = product.metafields?.find((m: any) => m?.key === 'tagline')?.value;

    return (
        <Link to={`/products/${handle}`} className="group block hover-lift">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#F0EFEB] mb-4">
                {featuredImage && (
                    <Image
                        data={featuredImage}
                        aspectRatio="4/5"
                        sizes="(min-width: 45em) 20vw, 50vw"
                        className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                )}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />

                {/* Optional: "Bundle" Badge */}
                <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
                    Bundle
                </div>
            </div>

            <div className="text-center space-y-2">
                <h3 className="font-serif text-lg text-primary uppercase tracking-wide leading-tight group-hover:text-secondary transition-colors">
                    {title}
                </h3>
                {tagline && (
                    <p className="text-xs text-dark/60 font-sans italic line-clamp-1">{tagline}</p>
                )}
                <div className="flex justify-center items-center gap-2 text-sm font-sans font-medium pt-2">
                    <span className="text-primary font-bold text-lg">
                        <Money data={price} />
                    </span>
                    {compareAtPrice && (
                        <span className="text-dark/40 line-through text-sm">
                            <Money data={compareAtPrice} />
                        </span>
                    )}
                </div>
                <button className="w-full mt-3 h-[48px] rounded-[12px] bg-primary text-white font-bold uppercase tracking-widest text-xs hover:bg-[#143d24] transition-all shadow-sm group-hover:shadow-md">
                    Shop Now
                </button>
            </div>
        </Link>
    );
}

