import { useState, useEffect } from 'react';
import { useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Money, Image } from '@shopify/hydrogen';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
import { useScrollAnimation } from '~/hooks/useScrollAnimation';

export const meta: MetaFunction = () => {
    return [
        { title: 'Healthy Living Box | Low-Salt & Probiotic | Teta Aida' },
        { name: 'description', content: 'A wellness bundle featuring low-salt cucumbers and probiotic Tangerine cabbage.' },
        { name: 'keywords', content: 'healthy pickles Egypt, low salt pickles Cairo, probiotic pickles bundle, probiotics, stomach & colon relief' },
    ];
};

export async function loader({ context }: LoaderFunctionArgs) {
    const { storefront } = context;

    const { product } = await storefront.query(PRODUCT_QUERY, {
        variables: { handle: 'healthy-living-box' },
    });

    if (!product?.id) {
        throw new Response(null, { status: 404 });
    }

    return { product };
}

type HeatLevels = {
    cucumbers: 'mild' | 'normal' | null;
    cabbage: 'mild' | 'normal' | null;
};

export default function HealthyLivingALP() {
    const { product } = useLoaderData<typeof loader>();
    const [heatLevels, setHeatLevels] = useState<HeatLevels>({
        cucumbers: null,
        cabbage: null,
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

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const allHeatLevelsSelected = heatLevels.cucumbers !== null && heatLevels.cabbage !== null;

    const addToCartProps = {
        disabled: !selectedVariant?.availableForSale || !allHeatLevelsSelected,
        onClick: () => open('cart'),
        lines: selectedVariant && allHeatLevelsSelected ? [{
            merchandiseId: selectedVariant.id,
            quantity: 1,
            attributes: [
                { key: 'Cucumbers Heat', value: heatLevels.cucumbers! },
                { key: 'Cabbage Heat', value: heatLevels.cabbage! },
            ],
        }] : [],
    };

    return (
        <div className="alp-page bg-[#F0EFEB] min-h-screen pb-24">
            {/* Hero Section */}
            <div className="bg-white">
                <div ref={section1.ref} className={`mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 transition-all duration-700 ${section1.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="text-center mb-8">
                        <h1 className="font-serif text-4xl sm:text-5xl text-primary uppercase tracking-wide">
                            Healthy Living Box
                        </h1>
                        <p className="mt-3 text-xl text-dark/60 italic">
                            Crisp. Light. Clean-eating perfection.
                        </p>
                    </div>

                    {/* Product Image */}
                    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[#F0EFEB] mb-8">
                        {productImage && (
                            <Image
                                data={productImage}
                                className="h-full w-full object-cover"
                                sizes="100vw"
                            />
                        )}
                    </div>

                    {/* What's Inside */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
                        <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                            Included
                        </h2>

                        {/* Cucumbers */}
                        <div className="mb-6 pb-6 border-b border-dark/10">
                            <h3 className="font-bold text-dark mb-2">• Low-Salt Cucumbers — 1 Kg</h3>
                            <div className="flex gap-2 mt-3">
                                {(['mild', 'normal'] as const).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setHeatLevels({ ...heatLevels, cucumbers: level })}
                                        className={`flex-1 py-2 px-3 rounded-lg border-2 font-bold uppercase text-xs tracking-wide transition-all ${heatLevels.cucumbers === level
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-dark/20 bg-white text-dark hover:border-primary'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cabbage */}
                        <div className="mb-6">
                            <h3 className="font-bold text-dark mb-2">• Tangerine-Infused Cabbage — 1 Kg</h3>
                            <div className="flex gap-2 mt-3">
                                {(['mild', 'normal'] as const).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setHeatLevels({ ...heatLevels, cabbage: level })}
                                        className={`flex-1 py-2 px-3 rounded-lg border-2 font-bold uppercase text-xs tracking-wide transition-all ${heatLevels.cabbage === level
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
                    <div className="text-center mb-6">
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
                        <AddToCartButton {...addToCartProps} className="w-full max-w-md mx-auto h-14 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-sm hover:bg-secondary transition-all">
                            {!allHeatLevelsSelected ? 'Select All Heat Levels' : 'Add Healthy Box to Cart'}
                        </AddToCartButton>
                        <p className="text-xs text-dark/60 mt-3">
                            Low salt · Probiotic · Clean ingredients
                        </p>
                    </div>
                </div>
            </div>

            {/* Why You'll Love It */}
            <div ref={section2.ref} className={`mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-100 ${section2.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        Why You'll Love It
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            'Light on the stomach',
                            'Probiotic & low-salt combo',
                            'Clean, refreshing flavors',
                            'Perfect daily healthy pickles',
                            'Small-batch craft quality',
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="text-primary font-bold">✓</span>
                                <span className="text-dark/80">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* How to Enjoy It */}
            <div ref={section3.ref} className={`mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-200 ${section3.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        How to Enjoy It
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {[
                            'Healthy bowls',
                            'Lunchboxes',
                            'Post-gym meals',
                            'Sandwiches',
                            'Light dinners',
                        ].map((item, i) => (
                            <span key={i} className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div ref={section4.ref} className={`mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-300 ${section4.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6 text-center">
                        Reviews
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            'Finally — a healthy pickle that tastes amazing.',
                            'Fresh, clean, crisp.',
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
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 text-center">
                <p className="text-dark/60 mb-4">See more products →</p>
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
  query HealthyLivingProduct(
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
