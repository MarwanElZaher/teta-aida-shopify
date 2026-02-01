import { useState, useEffect } from 'react';
import { useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Money, Image } from '@shopify/hydrogen';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
import { useScrollAnimation } from '~/hooks/useScrollAnimation';
import { useTranslation } from '~/lib/translations';
import { getLocalizedTitle } from '~/lib/localized-content';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    const locale = data?.locale || { language: 'EN' };
    const isArabic = locale.language === 'AR';

    if (isArabic) {
        return [
            { title: 'تشكيلة رمضان المميّزة | مخللات رمضان | تيتا عايدة' },
            { name: 'description', content: 'تشكيلة مختارة من زيتون تفاحي، ليمون معصفر بالهريسة، ولفت بلمسة بنجر… توصيل داخل القاهرة.' },
            { name: 'keywords', content: 'مخللات رمضان مصر، مخللات رمضان القاهرة، أكل رمضان فاخر، زيتون رمضان، ليمون رمضان، لفت رمضان, تيتا عايدة رمضان' }
        ];
    }

    return [
        { title: `${data?.product.title} | Premium Pickle Box for Ramadan | Teta Aida` },
        { name: 'description', content: data?.product.description || 'Discover the Ramadan Signature Box by Teta Aida.' },
        { name: 'keywords', content: 'Ramadan pickle box Egypt, premium Ramadan food Cairo, Tuffaahy olives box, lemon pickles Ramadan, turnip pickles Ramadan, Teta Aida Ramadan box' },
    ];
};

export async function loader({ context }: LoaderFunctionArgs) {
    const { storefront } = context;

    const { product } = await storefront.query(PRODUCT_QUERY, {
        variables: { handle: 'ramadan-signature-box' },
    });

    if (!product?.id) {
        throw new Response(null, { status: 404 });
    }

    return { product, locale: context.storefront.i18n };
}


export default function RamadanSignatureALP() {
    const { product } = useLoaderData<typeof loader>();
    const { t, locale } = useTranslation();
    const { open } = useAside();
    const [isSticky, setIsSticky] = useState(false);
    const [selections, setSelections] = useState<Record<string, string>>({});

    // Parse Metafields
    const getMetafield = (key: string) => product.metafields?.find((m: any) => m?.key === key)?.value;
    const getJsonMetafield = (key: string) => {
        const val = getMetafield(key);
        try { return val ? JSON.parse(val) : []; } catch (e) { return []; }
    };

    const tagline = getMetafield('tagline');
    const microTrust = getMetafield('micro_trust');
    const bundleContents = getJsonMetafield('bundle_contents') as (string | { name: string, description: string })[] | null;
    const keyBenefits = getJsonMetafield('key_benefits') as string[]; // Cast to strings
    const usageMoments = getJsonMetafield('usage_moments') as string[]; // Cast to strings
    const reviews = getJsonMetafield('reviews') as string[]; // Cast to strings

    // Bundle Items for Heat Selection logic
    const bundleItemsMetafield = getMetafield('bundle_items');
    const bundleItems: { name: string; heatLevels: string[] }[] = bundleItemsMetafield
        ? (JSON.parse(bundleItemsMetafield) as { name: string; heatLevels: string[] }[])
        : [];

    const hasBundleConfig = bundleItems.length > 0;

    // Logic to treat product as single item if no bundle config found (fallback)
    // (Simplified vs Winter Box as this is specifically a bundle)

    // Variant Selection Logic
    const selectedHeat = Object.values(selections)[0] || '';
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

    const allHeatLevelsSelected = bundleItems.length > 0 ? bundleItems.every((item) => selections[item.name]) : true;

    const addToCartProps = {
        disabled: !selectedVariant?.availableForSale || !allHeatLevelsSelected,
        onClick: () => open('cart'),
        lines: selectedVariant && allHeatLevelsSelected ? [{
            merchandiseId: selectedVariant.id,
            quantity: 1,
            selectedVariant: selectedVariant,
            attributes: hasBundleConfig
                ? bundleItems.map(item => ({
                    key: `${item.name} Heat`,
                    value: selections[item.name]
                }))
                : [],
        }] : [],
    };

    return (
        <div className="alp-page bg-[#F0EFEB] min-h-screen pb-24">
            {/* Hero Section */}
            <div className="bg-white">
                <div ref={section1.ref} className={`mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 transition-all duration-700 ${section1.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="text-center mb-8">
                        <h1 className="font-serif text-4xl sm:text-5xl text-primary uppercase tracking-wide">
                            {product.title}
                        </h1>
                        {tagline && (
                            <p className="mt-3 text-xl text-dark/60 italic">
                                {tagline}
                            </p>
                        )}
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

                    {/* What's Inside (Generated from Bundle Contents text array OR Bundle Items config) */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
                        <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                            {t('product.whatsInside') || "What's Inside"}
                        </h2>

                        {/* If we have bundle items config (selectors), show them. 
                            If not, show the simple description list from `bundle_contents` metafield. */}

                        {hasBundleConfig ? (
                            bundleItems.map((item, index) => (
                                <div key={item.name} className={`mb-6 pb-6 ${index !== bundleItems.length - 1 ? 'border-b border-dark/10' : ''}`}>
                                    <h3 className="font-bold text-dark mb-2 text-center">• {item.name}</h3>
                                    <div className="flex gap-2 mt-3 justify-center">
                                        {item.heatLevels.map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => setSelections(prev => ({ ...prev, [item.name]: level }))}
                                                className={`flex-1 py-2 px-3 rounded-lg border-2 font-bold uppercase text-xs tracking-wide transition-all ${selections[item.name] === level
                                                    ? 'border-primary bg-primary text-white'
                                                    : 'border-dark/20 bg-white text-dark hover:border-primary'
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="mt-10 border-t border-gray-200 pt-10">
                                <ul className="mt-4 space-y-2">
                                    {bundleContents?.map((item, i) => {
                                        // Handle both string format and object format
                                        const rawName = typeof item === 'string' ? item : item.name;
                                        const name = getLocalizedTitle(rawName, [], locale.language);
                                        const description = typeof item === 'object' ? item.description : null;

                                        return (
                                            <li key={i} className="flex items-start gap-2 text-gray-600">
                                                <span className="h-1.5 w-1.5 rounded-full bg-green-800 mt-2 flex-shrink-0" />
                                                <div>
                                                    <span className="font-medium">{name}</span>
                                                    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>

                            </div>
                        )}

                        {!hasBundleConfig && (!bundleContents || bundleContents.length === 0) && (
                            <p className="text-dark/60 italic text-center">
                                Bundle details coming soon...
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
                        <AddToCartButton {...addToCartProps} className="w-full h-14 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-sm hover:bg-secondary transition-all flex items-center justify-center">
                            {!allHeatLevelsSelected ? (t('product.selectHeatLevel') || 'Select Options') : (t('product.addToCart') || 'Add to Cart')}
                        </AddToCartButton>
                        {microTrust && (
                            <p className="text-xs text-dark/60 mt-3">
                                {microTrust}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Why You'll Love It */}
            {keyBenefits && keyBenefits.length > 0 && (
                <div ref={section2.ref} className={`mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-100 ${section2.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                            {t('product.whyLoveIt') || "Why You'll Love It"}
                        </h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(keyBenefits as string[]).map((benefit, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-primary font-bold">✓</span>
                                    <span className="text-dark/80">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Usage Moments */}
            {usageMoments && usageMoments.length > 0 && (
                <div ref={section3.ref} className={`mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-200 ${section3.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                            {t('product.usageMoments') || "Usage Moments"}
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {(usageMoments as string[]).map((moment, i) => (
                                <span key={i} className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                    {moment}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews */}
            {reviews && reviews.length > 0 && (
                <div ref={section4.ref} className={`mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-300 ${section4.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6 text-center">
                            {t('product.reviews') || "Reviews"}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {(reviews as string[]).map((review, i) => (
                                <div key={i} className="text-center">
                                    <div className="mb-2 text-yellow-400">★★★★★</div>
                                    <p className="text-dark/60 italic">"{review}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Explore Link */}
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 text-center">
                <p className="text-dark/60 mb-4">{t('nav.shop')}</p>
                <Link to="/collections/ramadan-collections" className="text-primary font-bold hover:text-secondary transition-colors">
                    View All Ramadan Collections
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
  query RamadanSignatureProduct(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      description
      handle
      featuredImage {
        id
        url
        altText
        width
        height
      }
      metafields(identifiers: [
          {namespace: "custom", key: "tagline"},
          {namespace: "custom", key: "micro_trust"},
          {namespace: "custom", key: "bundle_contents"},
          {namespace: "custom", key: "key_benefits"},
          {namespace: "custom", key: "usage_moments"},
          {namespace: "custom", key: "reviews"},
          {namespace: "custom", key: "bundle_items"}
      ]) {
        key
        value
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
        }
      }
    }
  }
` as const;
