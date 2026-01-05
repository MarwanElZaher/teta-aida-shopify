import { useState, useEffect } from 'react';
import { useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Money, Image } from '@shopify/hydrogen';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
import { useScrollAnimation } from '~/hooks/useScrollAnimation';
import { ImageGallery } from '~/components/ImageGallery';
import { useTranslation } from '~/lib/translations';

export const meta: MetaFunction = () => {
    return [
        { title: 'Vintage-Style Turnips | Naturally Beetroot Colored | Teta Aida' },
        { name: 'description', content: 'Crisp, hand-cut turnips pickled with natural beetroot. A nostalgic, clean Egyptian classic.' },
        { name: 'keywords', content: 'turnip pickles egypt, liffet beetroot, beetroot turnip, pickled turnips cairo, premium pickles egypt' },
    ];
};

export async function loader({ context }: LoaderFunctionArgs) {
    const { storefront } = context;

    const { product } = await storefront.query(PRODUCT_QUERY, {
        variables: { handle: 'vintage-style-turnips' },
    });

    if (!product?.id) {
        throw new Response(null, { status: 404 });
    }

    return { product };
}

export default function TurnipsALP() {
    const { product } = useLoaderData<typeof loader>();
    // Parse bundle_items from metafields (expected to be an array with 1 item for single products)
    const bundleItemsMetafield = product.metafields?.find((m: any) => m?.key === 'bundle_items')?.value;
    const bundleItems: { name: string; heatLevels: string[] }[] = bundleItemsMetafield
        ? JSON.parse(bundleItemsMetafield) as { name: string; heatLevels: string[] }[]
        : [];

    const productItem = bundleItems[0];

    let availableHeatLevels: string[] = [];
    if (productItem?.heatLevels) {
        availableHeatLevels = productItem.heatLevels;
    } else if (product.options) {
        // Fallback
        const heatOption = product.options.find((o: any) =>
            o.name.toLowerCase().includes('heat') || o.name.toLowerCase().includes('spice') || o.name.toLowerCase().includes('level')
        ) || product.options[0];

        if (heatOption?.values) {
            availableHeatLevels = heatOption.values;
        }
    }

    const [selectedHeat, setSelectedHeat] = useState<string | null>(null);
    const [isSticky, setIsSticky] = useState(false);
    const { open } = useAside();
    const { t } = useTranslation();

    const section1 = useScrollAnimation();
    const section2 = useScrollAnimation();
    const section3 = useScrollAnimation();
    const section4 = useScrollAnimation();

    // Determine which variant to use
    const hasBundleConfig = bundleItems.length > 0;
    let effectiveVariant = product.selectedOrFirstAvailableVariant?.nodes?.[0];

    if (!hasBundleConfig && selectedHeat && product.variants?.nodes) {
        const matchedVariant = product.variants.nodes.find((v: any) =>
            v.selectedOptions.some((opt: any) => opt.value === selectedHeat)
        );
        if (matchedVariant) {
            effectiveVariant = matchedVariant;
        }
    }

    const price = effectiveVariant?.price;

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const addToCartProps = {
        disabled: !effectiveVariant?.availableForSale || !selectedHeat,
        onClick: () => open('cart'),
        lines: effectiveVariant && selectedHeat ? [{
            merchandiseId: effectiveVariant.id,
            quantity: 1,
            selectedVariant: effectiveVariant,
            attributes: hasBundleConfig
                ? [{
                    key: t('product.attributes.Heat Level'),
                    value: ['mild', 'normal', 'spicy'].includes(selectedHeat.toLowerCase())
                        ? t(`product.heatLevels.${selectedHeat.toLowerCase()}`)
                        : selectedHeat
                }]
                : [],
        }] : [],
    };

    return (
        <div className="alp-page bg-[#F0EFEB] min-h-screen pb-24">
            {/* Hero Section */}
            <div className="bg-white">
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Product Image Gallery */}
                        <div>
                            <ImageGallery
                                images={product.media?.nodes || []}
                                productTitle={product.title}
                            />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="font-serif text-3xl sm:text-4xl text-primary uppercase tracking-wide">
                                    {t('product.turnips.name')}
                                </h1>
                                <p className="mt-2 text-lg text-dark/60 italic">
                                    {t('product.turnips.tagline')}
                                </p>
                            </div>

                            <div className="text-sm text-dark/60">
                                <span className="font-bold">{t('product.grossWeight')}:</span> 1 Kg
                            </div>

                            {/* Heat Level Selector */}
                            {availableHeatLevels.length > 0 && (
                                <div className="space-y-3">
                                    <label className="block text-sm font-bold text-dark uppercase tracking-wide">
                                        {t('product.selectHeatLevel')}:
                                    </label>
                                    <div className="flex gap-3">
                                        {availableHeatLevels.map((level) => {
                                            const heatKey = level.toLowerCase();
                                            const isKnownKey = ['mild', 'normal', 'spicy'].includes(heatKey);
                                            const label = isKnownKey ? t(`product.heatLevels.${heatKey}`) : level;

                                            return (
                                                <button
                                                    key={level}
                                                    onClick={() => setSelectedHeat(level)}
                                                    className={`flex-1 py-3 px-4 rounded-lg border-2 font-bold uppercase text-sm tracking-wide transition-all ${selectedHeat === level
                                                        ? 'border-primary bg-primary text-white'
                                                        : 'border-dark/20 bg-white text-dark hover:border-primary'
                                                        }`}
                                                >
                                                    {label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {availableHeatLevels.length === 0 && (
                                <p className="text-sm text-dark/40 italic">
                                    {t('product.loadingConfig') || "Loading options..."}
                                </p>
                            )}

                            {/* Price */}
                            {price && (
                                <div className="text-2xl font-bold text-primary">
                                    <Money data={price} />
                                </div>
                            )}

                            {/* Add to Cart */}
                            <AddToCartButton {...addToCartProps} className="w-full h-14 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-sm hover:bg-secondary transition-all">
                                {!selectedHeat ? t('product.selectHeatLevel') : t('product.addToCart')}
                            </AddToCartButton>

                            <div className="flex justify-center gap-4 text-xs text-dark/60">
                                <span>{t('product.microTrust.cleanIngredients')}</span>
                                <span>•</span>
                                <span>{t('product.microTrust.naturalColor')}</span>
                                <span>•</span>
                                <span>{t('product.microTrust.smallBatch')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Benefits */}
            <div ref={section1.ref} className={`mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 ${section1.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        {t('product.turnips.benefits.title')}
                    </h2>
                    <ul className="space-y-3">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                <span className="text-dark/80">{t(`product.turnips.benefits.${i}`)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Flavor Profile */}
            <div ref={section2.ref} className={`mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-100 ${section2.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        {t('product.turnips.flavorProfile.title')}
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['texture', 'taste', 'aroma', 'color'].map((key) => (
                            <li key={key} className="flex flex-col gap-1">
                                <span className="text-primary font-bold uppercase text-xs tracking-wider">{key}</span>
                                <span className="text-dark/80">{t(`product.turnips.flavorProfile.${key}`)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* How to Use */}
            <div ref={section3.ref} className={`mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-200 ${section3.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        {t('product.turnips.usage.title')}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <span key={i} className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                {t(`product.turnips.usage.${i}`)}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div ref={section4.ref} className={`mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-300 ${section4.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6 text-center">
                        {t('product.turnips.reviews.title')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="text-center">
                                <div className="mb-2 text-yellow-400">★★★★★</div>
                                <p className="text-dark/60 italic">"{t(`product.turnips.reviews.${i}`)}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Explore Link */}
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 text-center">
                <p className="text-dark/60 mb-4">{t('nav.shop')}</p>
                <Link to="/collections/all" className="text-primary font-bold hover:text-secondary transition-colors">
                    {t('home.bestsellers.viewAll')}
                </Link>
            </div>

            {/* Sticky CTA */}
            {isSticky && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-dark/10 shadow-lg z-40 md:hidden">
                    <div className="px-4 py-3">
                        <AddToCartButton {...addToCartProps} className="w-full h-12 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-sm">
                            {t('product.addToCart')}
                        </AddToCartButton>
                    </div>
                </div>
            )}
        </div>
    );
}

const PRODUCT_QUERY = `#graphql
  query TurnipsProduct(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      metafields(identifiers: [{namespace: "custom", key: "bundle_items"}]) {
        key
        value
      }
      media(first: 10) {
        nodes {
          ... on MediaImage {
            id
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
      selectedOrFirstAvailableVariant: variants(first: 1) {
        nodes {
          id
          availableForSale
          selectedOptions {
             name
             value
          }
          price {
            amount
            currencyCode
          }
          image {
            id
            url
            altText
            width
            height
          }
          product {
            handle
            title
          }
        }
      }
      options {
        name
        values
      }
      variants(first: 20) {
        nodes {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          product {
            handle
            title
          }
        }
      }
    }
  }
` as const;
