import { useState, useEffect } from 'react';
import { useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Money, Image } from '@shopify/hydrogen';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';

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
        variables: { handle: 'signature-box' },
    });

    if (!product?.id) {
        throw new Response(null, { status: 404 });
    }

    return { product };
}

type HeatLevels = {
    olives: 'mild' | 'normal' | 'spicy';
    cucumbers: 'mild' | 'normal';
    cabbage: 'mild' | 'normal';
    harissa: 'mild' | 'spicy';
};

export default function SignatureBoxALP() {
    const { product } = useLoaderData<typeof loader>();
    const [heatLevels, setHeatLevels] = useState<HeatLevels>({
        olives: 'normal',
        cucumbers: 'normal',
        cabbage: 'normal',
        harissa: 'spicy',
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
                { key: 'Olives Heat', value: heatLevels.olives },
                { key: 'Cucumbers Heat', value: heatLevels.cucumbers },
                { key: 'Cabbage Heat', value: heatLevels.cabbage },
                { key: 'Harissa Heat', value: heatLevels.harissa },
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
                            Signature Box
                        </h1>
                        <p className="mt-3 text-xl text-dark/60 italic">
                            All Four Premium Flavors — One Elegant Experience.
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
                            What's Inside
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
                        <div className="mb-6 pb-6 border-b border-dark/10">
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

                        {/* Harissa */}
                        <div className="mb-6">
                            <h3 className="font-bold text-dark mb-2">• Harissa Half-Preserved Lemons — 1 Kg</h3>
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
                    <div className="text-center mb-6">
                        {price && (
                            <div className="text-3xl font-bold text-primary mb-6">
                                <Money data={price} />
                            </div>
                        )}
                        <AddToCartButton {...addToCartProps} className="w-full max-w-md mx-auto h-14 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-sm hover:bg-secondary transition-all">
                            Add Signature Box to Cart
                        </AddToCartButton>
                        <p className="text-xs text-dark/60 mt-3">
                            Fresh weekly · Small-batch crafted
                        </p>
                    </div>
                </div>
            </div>

            {/* Why You'll Love It */}
            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        Why You'll Love It
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            'Perfect introduction to the full Teta Aida taste',
                            'Balanced flavor variety',
                            'Premium artisanal blends',
                            'Ideal for gifting & hosting',
                            'Clean ingredients only',
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="text-primary font-bold">✓</span>
                                <span className="text-dark/80">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Serving Ideas */}
            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        Serving Ideas
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {[
                            'Mezze tables',
                            'Family gatherings',
                            'Dinner parties',
                            'Cheese boards',
                            'Healthy lunches',
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            'Unbelievably premium.',
                            'The perfect first purchase.',
                            'Every jar tastes different and amazing.',
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
                <p className="text-dark/60 mb-4">Still want to browse?</p>
                <Link to="/collections/all" className="text-primary font-bold hover:text-secondary transition-colors">
                    See full collection →
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
