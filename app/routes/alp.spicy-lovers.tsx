import { useState, useEffect } from 'react';
import { useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Money, Image } from '@shopify/hydrogen';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
import { useScrollAnimation } from '~/hooks/useScrollAnimation';

export const meta: MetaFunction = () => {
    return [
        { title: 'Spicy Lovers Box | Bold & Fiery Flavors | Teta Aida' },
        { name: 'description', content: 'A premium bundle for spice lovers featuring Tuffaahy Crushed Olives — Signature Mix and Harissa Lemons.' },
        { name: 'keywords', content: 'spicy pickles Egypt, harissa lemon box, bold flavors Egypt' },
    ];
};

export async function loader({ context }: LoaderFunctionArgs) {
    const { storefront } = context;

    const { product } = await storefront.query(PRODUCT_QUERY, {
        variables: { handle: 'spicy-lovers-box' },
    });

    if (!product?.id) {
        throw new Response(null, { status: 404 });
    }

    return { product };
}

type HeatLevels = {
    olives: 'mild' | 'normal' | 'spicy' | null;
    harissa: 'mild' | 'spicy' | null;
};

export default function SpicyLoversALP() {
    const { product } = useLoaderData<typeof loader>();
    const [heatLevels, setHeatLevels] = useState<HeatLevels>({
        olives: null,
        harissa: null,
    });
    const [isSticky, setIsSticky] = useState(false);
    const { open } = useAside();

    const selectedVariant = product.selectedOrFirstAvailableVariant?.nodes?.[0];
    const price = selectedVariant?.price;
    const compareAtPrice = selectedVariant?.compareAtPrice;
    const productImage = selectedVariant?.image || product.featuredImage;

    const section1 = useScrollAnimation();
    const section2 = useScrollAnimation();
    const section3 = useScrollAnimation();
    const section4 = useScrollAnimation();
    const section5 = useScrollAnimation();
    const section6 = useScrollAnimation();
    const section7 = useScrollAnimation();


    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const allHeatLevelsSelected = heatLevels.olives !== null && heatLevels.harissa !== null;

    const addToCartProps = {
        disabled: !selectedVariant?.availableForSale || !allHeatLevelsSelected,
        onClick: () => open('cart'),
        lines: selectedVariant && allHeatLevelsSelected ? [{
            merchandiseId: selectedVariant.id,
            quantity: 1,
            attributes: [
                { key: 'Olives Heat', value: heatLevels.olives! },
                { key: 'Harissa Heat', value: heatLevels.harissa! },
            ],
        }] : [],
    };

    return (
        <div className="alp-page bg-[#F0EFEB] min-h-screen pb-24">
            {/* Hero Section */}
            <div ref={section1.ref} className={`${section1.isVisible ? 'animate-fadeIn' : ''} bg-white`}>
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="font-serif text-4xl sm:text-5xl text-primary uppercase tracking-wide">
                            Spicy Lovers Box
                        </h1>
                        <p className="mt-3 text-xl text-dark/60 italic">
                            Bold. Fiery. Unforgettable.
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
                    <div ref={section2.ref} className={`${section2.isVisible ? 'animate-fadeIn' : ''} bg-white rounded-2xl p-8 shadow-sm mb-8`}>
                        <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                            Included
                        </h2>

                        {/* Olives */}
                        <div className="mb-6 pb-6 border-b border-dark/10">
                            <h3 className="font-bold text-dark mb-2">• Tuffaahy Olives — 1 Kg</h3>
                            <div className="flex gap-2 mt-3">
                                {(['mild', 'normal', 'spicy'] as const).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setHeatLevels({ ...heatLevels, olives: level })}
                                        className={`flex-1 py-2 px-3 rounded-lg border-2 font-bold uppercase text-xs tracking-wide transition-all ${heatLevels.olives === level
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-dark/20 bg-white text-dark hover:border-primary'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Harissa */}
                        <div className="mb-6">
                            <h3 className="font-bold text-dark mb-2">• Harissa Lemons — 1 Kg</h3>
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
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Price & CTA */}
                    {/* Price & CTA */}
                    <div ref={section3.ref} className={`${section3.isVisible ? 'animate-fadeIn' : ''} flex flex-col mb-6 text-center`}>
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
                            {!allHeatLevelsSelected ? 'Select All Heat Levels' : 'Add Spicy Box to Cart'}
                        </AddToCartButton>
                        <p className="text-xs text-dark/60 mt-3">
                            Bold flavors · Aromatic blends
                        </p>
                    </div>
                </div>
            </div>

            {/* Why You'll Love It */}
            <div ref={section4.ref} className={`${section4.isVisible ? 'animate-fadeIn' : ''} mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        Why You'll Love It
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            'Perfect for heat lovers',
                            'Rich spicy citrus from harissa lemons',
                            'Deep aromatic olive blend',
                            'Premium small-batch heat',
                            'Elevates every dish',
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="text-primary font-bold">✓</span>
                                <span className="text-dark/80">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Best Uses */}
            <div ref={section5.ref} className={`${section5.isVisible ? 'animate-fadeIn' : ''} mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        Best Uses
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {[
                            'Marinades for chicken & meat',
                            'Mezze tables',
                            'BBQ plates',
                            'Sandwiches & wraps',
                            'Pasta sauces',
                        ].map((item, i) => (
                            <span key={i} className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div ref={section6.ref} className={`${section6.isVisible ? 'animate-fadeIn' : ''} mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6 text-center">
                        Reviews
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            'Insane flavor.',
                            'The harissa lemons are addictive.',
                            'Best spicy bundle I ever bought.',
                        ].map((review, i) => (
                            <div key={i} className="text-center">
                                <div className="mb-2 text-yellow-400">★★★★★</div>
                                <p className="text-dark/60 italic">"{review}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Explore Link */}
            <div ref={section7.ref} className={`${section7.isVisible ? 'animate-fadeIn' : ''} mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 text-center`}>
                <p className="text-dark/60 mb-4">Explore all products →</p>
                <Link to="/collections/all" className="text-primary font-bold hover:text-secondary transition-colors">
                    View All Products
                </Link>
            </div>

            {/* Sticky CTA */}
            {isSticky && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-dark/10 shadow-lg z-50 md:hidden">
                    <div className="px-4 py-3">
                        <AddToCartButton {...addToCartProps} className="w-full h-12 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-sm">
                            Add to Cart
                        </AddToCartButton>
                    </div>
                </div>
            )}
        </div>
    );
}

const PRODUCT_QUERY = `#graphql
  query SpicyLoversProduct(
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
