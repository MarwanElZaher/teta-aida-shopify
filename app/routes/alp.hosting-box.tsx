import { useState, useEffect } from 'react';
import { useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Money, Image } from '@shopify/hydrogen';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';

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
    olives1: 'mild' | 'normal' | 'spicy';
    olives2: 'mild' | 'normal' | 'spicy';
    harissa: 'mild' | 'spicy';
    choice: 'mild' | 'normal';
};

export default function HostingBoxALP() {
    const { product } = useLoaderData<typeof loader>();
    const [heatLevels, setHeatLevels] = useState<HeatLevels>({
        olives1: 'normal',
        olives2: 'normal',
        harissa: 'spicy',
        choice: 'normal',
    });
    const [isSticky, setIsSticky] = useState(false);
    const { open } = useAside();

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
            attributes: [
                { key: 'Olives 1 Heat', value: heatLevels.olives1 },
                { key: 'Olives 2 Heat', value: heatLevels.olives2 },
                { key: 'Harissa Heat', value: heatLevels.harissa },
                { key: 'Cabbage/Cucumbers Heat', value: heatLevels.choice },
            ],
        }] : [],
    };

    return (
        <div className="alp-page bg-[#F0EFEB] min-h-screen pb-24">
            {/* Hero Section */}
            <div className="bg-white">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="font-serif text-4xl sm:text-5xl text-primary uppercase tracking-wide">
                            Hosting Box
                        </h1>
                        <p className="mt-3 text-xl text-dark/60 italic">
                            Made for Elegant Tables & Gatherings.
                        </p>
                    </div>

                    {/* Product Image */}
                    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[#F0EFEB] mb-8">
                        {selectedVariant?.image && (
                            <Image
                                data={selectedVariant.image}
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

                        {/* Olives 1 */}
                        <div className="mb-6 pb-6 border-b border-dark/10">
                            <h3 className="font-bold text-dark mb-2">• Tuffaahy Olives #1 — 1 Kg</h3>
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
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Olives 2 */}
                        <div className="mb-6 pb-6 border-b border-dark/10">
                            <h3 className="font-bold text-dark mb-2">• Tuffaahy Olives #2 — 1 Kg</h3>
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
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Harissa */}
                        <div className="mb-6 pb-6 border-b border-dark/10">
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

                        {/* Choice */}
                        <div className="mb-6">
                            <h3 className="font-bold text-dark mb-2">• Tangerine Cabbage OR Cucumbers — 1 Kg</h3>
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
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="text-center mb-6">
                        {price && (
                            <div className="text-3xl font-bold text-primary mb-6">
                                <Money data={price} />
                            </div>
                        )}
                        <AddToCartButton {...addToCartProps} className="w-full max-w-md mx-auto h-14 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-sm hover:bg-secondary transition-all">
                            Add Hosting Box to Cart
                        </AddToCartButton>
                        <p className="text-xs text-dark/60 mt-3">
                            Premium · Clean · Guest-approved
                        </p>
                    </div>
                </div>
            </div>

            {/* Why It's Perfect for Hosting */}
            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        Why It's Perfect for Hosting
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            'Beautiful presentation',
                            'Balanced taste selection',
                            'Ideal for cheese boards & mezze',
                            'Impresses guests instantly',
                            'Luxury jars elevate the table',
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
            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        Best Uses
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {[
                            'Brunch',
                            'Dinner parties',
                            'Family events',
                            'Gift tables',
                            'Special occasions',
                        ].map((item, i) => (
                            <span key={i} className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6 text-center">
                        Reviews
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            'Transformed our table.',
                            'Guests kept asking for the brand.',
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
                <p className="text-dark/60 mb-4">Browse our full collection →</p>
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
  query Product(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
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
