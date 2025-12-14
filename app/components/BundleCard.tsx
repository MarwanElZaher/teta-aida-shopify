import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type { Product } from '@shopify/hydrogen/storefront-api-types';
import { useTranslation } from '~/lib/translations';
import { getLocalizedTitle } from '~/lib/localized-content';
import { formatCurrency } from '~/lib/utils';

interface BundleCardProps {
    product: Product;
}

export function BundleCard({ product }: BundleCardProps) {
    const { title, handle, featuredImage } = product;
    const price = product.priceRange?.minVariantPrice;
    const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
    const { locale, t } = useTranslation();

    // Get localized title (Arabic if available, otherwise English)
    const displayTitle = getLocalizedTitle(
        title,
        product.metafields as any,
        locale.language
    );

    // Map handles to dictionary keys
    const handleMap: Record<string, string> = {
        'signature-box': 'signature',
        'signature': 'signature',
        'the-signature-box': 'signature',
        'all-four-premium-flavors-one-elegant-box': 'signature',
        'healthy-living-box': 'healthyBox',
        'spicy-lovers-box': 'spicyBox',
        'hosting-box': 'hostingBox',
        'winter-comfort-box': 'winterBox',
        // Add other bundles here
    };

    const dictionaryKey = handleMap[handle];

    // Parse tagline from metafields OR dictionary
    const metaTagline = product.metafields?.find((m: any) => m?.key === 'tagline')?.value;
    const tagline = (dictionaryKey && t(`product.${dictionaryKey}.tagline`) !== `product.${dictionaryKey}.tagline`)
        ? t(`product.${dictionaryKey}.tagline`)
        : metaTagline;

    // Get micro-trust badge (e.g., "Seasonal limited release")
    const metaMicroTrust = product.metafields?.find((m: any) => m?.key === 'micro_trust')?.value;
    const microTrust = (dictionaryKey && t(`product.${dictionaryKey}.microTrust.seasonal`) !== `product.${dictionaryKey}.microTrust.seasonal`)
        ? t(`product.${dictionaryKey}.microTrust.seasonal`)
        : metaMicroTrust;

    return (
        <Link to={`${locale.pathPrefix}/products/${handle}`} className="group flex flex-col h-full min-h-[450px] hover-lift">
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

                {/* Micro-trust Badge or Bundle Badge */}
                <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
                    {microTrust || t('product.bundle')}
                </div>
            </div>

            <div className="text-center space-y-2 flex-1 flex flex-col">
                <h3 className="font-serif text-lg text-primary uppercase tracking-wide leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                    {displayTitle}
                </h3>
                {tagline && (
                    <p className="text-sm text-dark/70 font-sans line-clamp-2 px-2">{tagline}</p>
                )}
                <div className="flex-1" />
                <div className="flex justify-center items-center gap-2 text-sm font-sans font-medium pt-2">
                    <span className="text-primary font-bold text-lg">
                        {formatCurrency(
                            parseFloat(price.amount),
                            price.currencyCode,
                            locale.language
                        )}
                    </span>
                    {compareAtPrice && (
                        <span className="text-dark/40 line-through text-sm">
                            {formatCurrency(
                                parseFloat(compareAtPrice.amount),
                                compareAtPrice.currencyCode,
                                locale.language
                            )}
                        </span>
                    )}
                </div>
                <button className="w-full mt-3 h-[48px] rounded-[12px] bg-primary text-white font-bold uppercase tracking-widest text-xs hover:bg-[#143d24] transition-all shadow-sm group-hover:shadow-md">
                    {t('product.shopNow')}
                </button>
            </div>
        </Link>
    );
}

