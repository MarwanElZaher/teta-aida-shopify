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
    const [selectedHeat, setSelectedHeat] = useState<'mild' | null>('mild'); // Default to Mild/Light Spicy
    const [isSticky, setIsSticky] = useState(false);
    const { open } = useAside();
    const { t } = useTranslation();

    const section1 = useScrollAnimation();
    const section2 = useScrollAnimation();
    const section3 = useScrollAnimation();
    const section4 = useScrollAnimation();

    const selectedVariant = product.selectedOrFirstAvailableVariant?.nodes?.[0];
    const price = selectedVariant?.price;

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const addToCartProps = {
        disabled: !selectedVariant?.availableForSale,
        onClick: () => open('cart'),
        lines: selectedVariant ? [{
            merchandiseId: selectedVariant.id,
            quantity: 1,
            selectedVariant,
            attributes: [{ key: t('product.attributes.Heat Level'), value: t('product.heatLevels.Mild') }],
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

                            {/* Heat Level Display (Fixed) */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-dark uppercase tracking-wide">
                                    {t('product.heatLevel')}:
                                </label>
                                <div className="inline-block py-2 px-4 rounded-lg border-2 border-primary bg-primary text-white font-bold uppercase text-sm tracking-wide">
                                    {t('product.heatLevels.mild')}
                                </div>
                            </div>

                            {/* Price */}
                            {price && (
                                <div className="text-2xl font-bold text-primary">
                                    <Money data={price} />
                                </div>
                            )}

                            {/* Add to Cart */}
                            <AddToCartButton {...addToCartProps} className="w-full h-14 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-sm hover:bg-secondary transition-all">
                                {t('product.addToCart')}
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
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-dark/10 shadow-lg z-50 md:hidden">
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
    }
  }
` as const;
