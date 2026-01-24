import { useState, useEffect } from 'react';
import { useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Money, Image } from '@shopify/hydrogen';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
import { useScrollAnimation } from '~/hooks/useScrollAnimation';
import { useTranslation } from '~/lib/translations';

export const meta: MetaFunction = () => {
    return [
        { title: 'Signature Box | All Four Premium Flavors | Teta Aida' },
        { name: 'description', content: 'Discover all four artisanal flavors in one curated premium bundle, including our Tuffaahy crushed Olives — Signature Mix.' },
        { name: 'keywords', content: 'signature box Egypt, premium pickles set, artisanal bundle Cairo' },
    ];
};

export async function loader({ context }: LoaderFunctionArgs) {
    const { storefront } = context;

    const { product } = await storefront.query(PRODUCT_QUERY, {
        variables: { handle: 'all-four-premium-flavors-one-elegant-box' },
    });

    if (!product?.id) {
        throw new Response(null, { status: 404 });
    }

    return { product };
}

type HeatLevels = {
    olives: 'mild' | 'normal' | 'spicy' | null;
    cucumbers: 'mild' | 'normal' | null;
    cabbage: 'mild' | 'normal' | null;
    harissa: 'mild' | 'spicy' | null;
};

export default function SignatureBoxALP() {
    const { product } = useLoaderData<typeof loader>();
    // Parse bundle_items from metafields
    const bundleItemsMetafield = product.metafields?.find((m: any) => m?.key === 'bundle_items')?.value;
    const bundleItems: { name: string; heatLevels: string[] }[] = bundleItemsMetafield
        ? JSON.parse(bundleItemsMetafield) as { name: string; heatLevels: string[] }[]
        : [];

    // State for selections: key = itemName, value = selectedHeatLevel
    const [selections, setSelections] = useState<Record<string, string>>({});

    const [isSticky, setIsSticky] = useState(false);
    const { open } = useAside();
    const { t, locale } = useTranslation();

    const selectedVariant = product.selectedOrFirstAvailableVariant?.nodes?.[0];
    const price = selectedVariant?.price;
    const compareAtPrice = selectedVariant?.compareAtPrice;
    const productImage = selectedVariant?.image || product.featuredImage;

    const section1 = useScrollAnimation();
    const section2 = useScrollAnimation();
    const section3 = useScrollAnimation();
    const section4 = useScrollAnimation();

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check if all items in the bundle have a selection
    const allHeatLevelsSelected = bundleItems.length > 0 && bundleItems.every((item) => selections[item.name]);

    const addToCartProps = {
        disabled: !selectedVariant?.availableForSale || !allHeatLevelsSelected,
        onClick: () => open('cart'),
        lines: selectedVariant && allHeatLevelsSelected ? [{
            merchandiseId: selectedVariant.id,
            quantity: 1,
            attributes: bundleItems.map(item => ({
                key: `${item.name} Heat`, // Using item name as key, similar to previous hardcoded logic
                value: t(`product.heatLevels.${selections[item.name]?.toLowerCase()}`)
            })),
        }] : [],
    };

    return (
        <div className="alp-page bg-[#F0EFEB] min-h-screen pb-24">
            {/* Hero Section */}
            <div className="bg-white">
                <div ref={section1.ref} className={`mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 transition-all duration-700 ${section1.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="text-center mb-8">
                        <h1 className="font-serif text-4xl sm:text-5xl text-primary uppercase tracking-wide">
                            {t('product.signature.name')}
                        </h1>
                        <p className="mt-3 text-xl text-dark/60 italic">
                            {t('product.signature.tagline')}
                        </p>
                    </div>

                    {/* Product Image */}
                    <div className="relative  overflow-hidden rounded-2xl bg-[#F0EFEB] mb-8">
                        {productImage && (
                            <Image
                                data={productImage}
                                className="h-full w-full object-contain"
                                sizes="100vw"
                            />
                        )}
                    </div>

                    {/* What's Inside */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
                        <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                            {t('product.signature.whatsInside')}
                        </h2>

                        {bundleItems.map((item, index) => {
                            // Map English names to translation keys
                            let displayName = item.name;
                            const nameLower = item.name.toLowerCase();

                            if (nameLower.includes('olives')) {
                                displayName = t('product.olives.name');
                            } else if (nameLower.includes('cucumber')) {
                                displayName = t('product.cucumbers.name');
                            } else if (nameLower.includes('cabbage')) {
                                displayName = t('product.cabbage.name');
                            } else if (nameLower.includes('lemon') || nameLower.includes('harissa')) {
                                displayName = t('product.lemons.name');
                            }

                            return (
                                <div key={item.name} className={`mb-6 pb-6 ${index !== bundleItems.length - 1 ? 'border-b border-dark/10' : ''}`}>
                                    <h3 className="font-bold text-dark mb-2">• {displayName}</h3>
                                    <div className="flex gap-2 mt-3">
                                        {item.heatLevels.map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => setSelections(prev => ({ ...prev, [item.name]: level }))}
                                                className={`flex-1 py-2 px-3 rounded-lg border-2 font-bold uppercase text-xs tracking-wide transition-all ${selections[item.name] === level
                                                    ? 'border-primary bg-primary text-white'
                                                    : 'border-dark/20 bg-white text-dark hover:border-primary'
                                                    }`}
                                            >
                                                {t(`product.heatLevels.${level.toLowerCase()}`)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {bundleItems.length === 0 && (
                            <p className="text-dark/60 italic text-center">
                                {t('product.loadingConfig') || "Loading bundle configuration..."}
                            </p>
                        )}

                    </div>

                    {/* Price & CTA */}
                    <div className="flex flex-col mb-6 text-center">
                        {price && (
                            <div className="mb-6">
                                {compareAtPrice && (
                                    <div className="text-lg text-dark/40 line-through mb-1">
                                        <Money data={compareAtPrice} />
                                    </div>
                                )}
                                <div className="text-3xl font-bold text-primary">
                                    <Money data={price} />
                                </div>
                            </div>
                        )}
                        <AddToCartButton {...addToCartProps} className="w-full h-14 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-sm hover:bg-secondary transition-all">
                            {!allHeatLevelsSelected ? t('product.healthyBox.selectAll') : t('product.addToCart')}
                        </AddToCartButton>
                        <p className="text-xs text-dark/60 mt-3">
                            {t('product.microTrust.freshWeekly')} · {t('product.microTrust.smallBatch')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Why You'll Love It */}
            <div ref={section2.ref} className={`mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-100 ${section2.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        {t('product.signature.why.title')}
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="text-primary font-bold">✓</span>
                                <span className="text-dark/80">{t(`product.signature.why.${i}`)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Serving Ideas */}
            <div ref={section3.ref} className={`mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-200 ${section3.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        {t('product.signature.serving.title')}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                {t(`product.signature.serving.${i}`)}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div ref={section4.ref} className={`mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-300 ${section4.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6 text-center">
                        {t('product.signature.reviews.title')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="text-center">
                                <div className="mb-2 text-yellow-400">★★★★★</div>
                                <p className="text-dark/60 italic">"{t(`product.signature.reviews.${i}`)}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Explore Link */}
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 text-center">
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
                            {!allHeatLevelsSelected ? t('product.healthyBox.selectAll') : t('product.addToCart')}
                        </AddToCartButton>
                    </div>
                </div>
            )}
        </div>
    );
}

const PRODUCT_QUERY = `#graphql
  query SignatureBoxProduct(
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
      featuredImage {
        id
        url
        altText
        width
        height
      }
      selectedOrFirstAvailableVariant: variants(first: 1) {
        nodes {
          id
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
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
    }
  }
` as const;
