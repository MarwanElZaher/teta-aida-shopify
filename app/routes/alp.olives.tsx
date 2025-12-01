import { useState, useEffect } from 'react';
import { useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Money, Image } from '@shopify/hydrogen';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
import { useScrollAnimation } from '~/hooks/useScrollAnimation';

export const meta: MetaFunction = () => {
    return [
        { title: 'Tuffaahy Crashed Olives | Signature Mix | Teta Aida' },
        { name: 'description', content: 'Premium crushed Tuffaahy olives mixed with diced vegetables and aromatic brine. A gourmet small-batch blend perfect for mezze and hosting.' },
        { name: 'keywords', content: 'crushed olives Egypt, Tuffaahy olives, olive mix Egypt, premium olives Cairo' },
    ];
};

export async function loader({ context }: LoaderFunctionArgs) {
    const { storefront } = context;

    // Fetch the olives product by handle
    const { product } = await storefront.query(PRODUCT_QUERY, {
        variables: { handle: 'tuffaahy-olives-signature-mix' },
    });

    if (!product?.id) {
        throw new Response(null, { status: 404 });
    }

    return { product };
}

export default function OlivesALP() {
    const { product } = useLoaderData<typeof loader>();
    const [selectedHeat, setSelectedHeat] = useState<'mild' | 'normal' | 'spicy' | null>(null);
    const [isSticky, setIsSticky] = useState(false);
    const { open } = useAside();

    // Scroll animations
    const section1 = useScrollAnimation();
    const section2 = useScrollAnimation();
    const section3 = useScrollAnimation();
    const section4 = useScrollAnimation();

    // Access the first variant from the product's variants connection
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
        disabled: !selectedVariant?.availableForSale || !selectedHeat,
        onClick: () => open('cart'),
        lines: selectedVariant && selectedHeat ? [{
            merchandiseId: selectedVariant.id,
            quantity: 1,
            selectedVariant,
            attributes: [{ key: 'Heat Level', value: selectedHeat }],
        }] : [],
    };

    return (
        <div className="alp-page bg-[#F0EFEB] min-h-screen pb-24">
            {/* Hero Section */}
            <div className="bg-white">
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Product Image */}
                        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F0EFEB]">
                            {selectedVariant?.image && (
                                <Image
                                    data={selectedVariant.image}
                                    className="h-full w-full object-cover"
                                    sizes="(min-width: 768px) 50vw, 100vw"
                                />
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="font-serif text-3xl sm:text-4xl text-primary uppercase tracking-wide">
                                    Tuffaahy Olives — Signature Mix
                                </h1>
                                <p className="mt-2 text-lg text-dark/60 italic">
                                    Rich. Vibrant. Naturally flavorful.
                                </p>
                            </div>

                            <div className="text-sm text-dark/60">
                                <span className="font-bold">Gross Weight:</span> 1 Kg
                            </div>

                            {/* Heat Level Selector */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-dark uppercase tracking-wide">
                                    Heat Level:
                                </label>
                                <div className="flex gap-3">
                                    {(['mild', 'normal', 'spicy'] as const).map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setSelectedHeat(level)}
                                            className={`flex-1 py-3 px-4 rounded-lg border-2 font-bold uppercase text-sm tracking-wide transition-all ${selectedHeat === level
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-dark/20 bg-white text-dark hover:border-primary'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
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
                                {!selectedHeat ? 'Select Heat Level' : 'Add to Cart'}
                            </AddToCartButton>

                            <p className="text-xs text-center text-dark/60">
                                Fresh weekly · Clean ingredients
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* What Makes It Special */}
            <div ref={section1.ref} className={`mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 ${section1.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        What Makes It Special
                    </h2>
                    <ul className="space-y-3">
                        {[
                            'Crushed Tuffaahy olives',
                            'Diced carrots, pepper slices, celery',
                            'Signature aromatic brine',
                            'Deep, balanced flavor',
                            'Small-batch crafted',
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                <span className="text-dark/80">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Why People Love It */}
            <div ref={section2.ref} className={`mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-100 ${section2.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        Why People Love It
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            'Premium gourmet flavor',
                            'Firm crisp texture',
                            'Amazing on mezze tables',
                            'Perfect for hosting',
                            'Beautiful, vibrant presentation',
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="text-primary font-bold">✓</span>
                                <span className="text-dark/80">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* How to Use */}
            <div ref={section3.ref} className={`mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-200 ${section3.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        How to Use
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {[
                            'Mezze platters',
                            'Sandwiches',
                            'Cheese boards',
                            'Pasta topping',
                            'Daily snacking',
                            'With grilled meat or chicken',
                        ].map((item, i) => (
                            <span key={i} className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div ref={section4.ref} className={`mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 delay-300 ${section4.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6 text-center">
                        Reviews
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            'Best olive mix I ever tried.',
                            'The crunch + brine is perfect.',
                            'Premium taste.',
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
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 text-center">
                <p className="text-dark/60 mb-4">Still exploring?</p>
                <Link to="/collections/all" className="text-primary font-bold hover:text-secondary transition-colors">
                    Browse full collection →
                </Link>
            </div>

            {/* Sticky CTA */}
            {isSticky && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-dark/10 shadow-lg z-50 md:hidden">
                    <div className="px-4 py-3">
                        <AddToCartButton {...addToCartProps} className="w-full h-12 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-sm">
                            {!selectedHeat ? 'Select Heat Level' : 'Add to Cart'}
                        </AddToCartButton>
                    </div>
                </div>
            )}
        </div>
    );
}

const PRODUCT_QUERY = `#graphql
  query OlivesProduct(
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
