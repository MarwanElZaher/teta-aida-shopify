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
        { title: 'Hosting Box | Premium Table Bundle | Teta Aida' },
        { name: 'description', content: 'A hosting-ready gourmet selection including Tuffaahy Crushed Olives — Signature Mix and complementary premium jars.' },
        { name: 'keywords', content: 'hosting box Egypt, dinner party food bundle, gourmet table set' },
    ];
};

export async function loader({ context }: LoaderFunctionArgs) {
    const { storefront } = context;

    const { product } = await storefront.query(PRODUCT_QUERY, {
        variables: { handle: 'hosting-box' },
    });

    if (!product?.id) {
        throw new Response(null, { status: 404 });
    }

    return { product };
}

type HeatLevels = {
    olives1: 'mild' | 'normal' | 'spicy' | null;
    olives2: 'mild' | 'normal' | 'spicy' | null;
    harissa: 'mild' | 'spicy' | null;
    choice: 'mild' | 'normal' | null;
};

export default function HostingBoxALP() {
    const { product } = useLoaderData<typeof loader>();
    const [heatLevels, setHeatLevels] = useState<HeatLevels>({
        olives1: null,
        olives2: null,
        harissa: null,
        choice: null,
    });
    const [isSticky, setIsSticky] = useState(false);
    const { open } = useAside();
    const { t, locale, isRtl } = useTranslation();

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

    const allHeatLevelsSelected = heatLevels.olives1 !== null && heatLevels.olives2 !== null && heatLevels.harissa !== null && heatLevels.choice !== null;

    const addToCartProps = {
        disabled: !selectedVariant?.availableForSale || !allHeatLevelsSelected,
        onClick: () => open('cart'),
        lines: selectedVariant && allHeatLevelsSelected ? [{
            merchandiseId: selectedVariant.id,
            quantity: 1,
            attributes: [
                { key: t('product.attributes.Olives 1 Heat'), value: t(`product.heatLevels.${heatLevels.olives1}`) },
                { key: t('product.attributes.Olives 2 Heat'), value: t(`product.heatLevels.${heatLevels.olives2}`) },
                { key: t('product.attributes.Harissa Heat'), value: t(`product.heatLevels.${heatLevels.harissa}`) },
                { key: t('product.attributes.Cabbage/Cucumbers Heat'), value: t(`product.heatLevels.${heatLevels.choice}`) },
            ],
        }] : [],
    };

    return (
        <div className={`alp-page bg-[#F0EFEB] min-h-screen pb-24 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Hero Section */}
            <div className="bg-white">
                <div ref={section1.ref} className={`mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 transition-all duration-700 ${section1.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="text-center mb-8">
                        <h1 className="font-serif text-4xl sm:text-5xl text-primary uppercase tracking-wide">
                            {t('product.hostingBox.title')}
                        </h1>
                        <p className="mt-3 text-xl text-dark/60 italic">
                            {t('product.hostingBox.tagline')}
                        </p>
                    </div>

                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F0EFEB] mb-8">
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
                            {t('product.hostingBox.included')}
                        </h2>

                        {/* Olives 1 */}
                        <div className="mb-6 pb-6 border-b border-dark/10">
                            <h3 className="font-bold text-dark mb-2">• {t('product.hostingBox.olives1')}</h3>
                            <div className="flex gap-2 mt-3">
                                {(['mild', 'normal', 'spicy'] as const).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setHeatLevels({ ...heatLevels, olives1: level })}
                                        className={`flex-1 py-2 px-3 rounded-lg border-2 font-bold uppercase text-xs tracking-wide transition-all ${heatLevels.olives1 === level
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-dark/20 bg-white text-dark hover:border-primary'
                                            }`}
                                    >
                                        {t(`product.heatLevels.${level}`)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Olives 2 */}
                        <div className="mb-6 pb-6 border-b border-dark/10">
                            <h3 className="font-bold text-dark mb-2">• {t('product.hostingBox.olives2')}</h3>
                            <div className="flex gap-2 mt-3">
                                {(['mild', 'normal', 'spicy'] as const).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setHeatLevels({ ...heatLevels, olives2: level })}
                                        className={`flex-1 py-2 px-3 rounded-lg border-2 font-bold uppercase text-xs tracking-wide transition-all ${heatLevels.olives2 === level
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-dark/20 bg-white text-dark hover:border-primary'
                                            }`}
                                    >
                                        {t(`product.heatLevels.${level}`)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Harissa */}
                        <div className="mb-6 pb-6 border-b border-dark/10">
                            <h3 className="font-bold text-dark mb-2">• {t('product.hostingBox.harissa')}</h3>
                            <div className="flex gap-2 mt-3">
                                {(['mild', 'spicy'] as const).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setHeatLevels({ ...heatLevels, harissa: level })}
                                        className={`flex-1 py-2 px-3 rounded-lg border-2 font-bold uppercase text-xs tracking-wide transition-all ${heatLevels.harissa === level
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-dark/20 bg-white text-dark hover:border-primary'
                                            }`}
                                    >
                                        {t(`product.heatLevels.${level}`)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Choice */}
                        <div className="mb-6">
                            <h3 className="font-bold text-dark mb-2">• {t('product.hostingBox.choice')}</h3>
                            <div className="flex gap-2 mt-3">
                                {(['mild', 'normal'] as const).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setHeatLevels({ ...heatLevels, choice: level })}
                                        className={`flex-1 py-2 px-3 rounded-lg border-2 font-bold uppercase text-xs tracking-wide transition-all ${heatLevels.choice === level
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-dark/20 bg-white text-dark hover:border-primary'
                                            }`}
                                    >
                                        {t(`product.heatLevels.${level}`)}
                                    </button>
                                ))}
                            </div>
                        </div>
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
                            {!allHeatLevelsSelected ? t('product.hostingBox.selectAll') : t('product.hostingBox.addToCart')}
                        </AddToCartButton>
                        <p className="text-xs text-dark/60 mt-3">
                            {t('product.hostingBox.trust')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Why It's Perfect for Hosting */}
            <div ref={section2.ref} className={`mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-100 ${section2.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        {t('product.hostingBox.why.title')}
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className={`text-primary font-bold ${isRtl ? 'ml-2' : 'mr-2'}`}>✓</span>
                                <span className="text-dark/80">{t(`product.hostingBox.why.${i}`)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Best Uses */}
            <div ref={section3.ref} className={`mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-200 ${section3.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        {t('product.hostingBox.uses.title')}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                {t(`product.hostingBox.uses.${i}`)}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div ref={section4.ref} className={`mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-300 ${section4.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6 text-center">
                        {t('product.hostingBox.reviews.title')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="text-center">
                                <div className="mb-2 text-yellow-400">★★★★★</div>
                                <p className="text-dark/60 italic">"{t(`product.hostingBox.reviews.${i}`)}"</p>
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
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-dark/10 shadow-lg z-50 md:hidden">
                    <div className="px-4 py-3">
                        <AddToCartButton {...addToCartProps} className="w-full h-12 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-sm">
                            {!allHeatLevelsSelected ? t('product.hostingBox.selectAll') : t('product.hostingBox.addToCart')}
                        </AddToCartButton>
                    </div>
                </div>
            )}
        </div>
    );
}

const PRODUCT_QUERY = `#graphql
  query HostingBoxProduct(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
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
