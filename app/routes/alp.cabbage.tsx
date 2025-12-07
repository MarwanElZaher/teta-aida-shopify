import { useState, useEffect } from 'react';
import { useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Money, Image } from '@shopify/hydrogen';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
import { useScrollAnimation } from '~/hooks/useScrollAnimation';
import { ImageGallery } from '~/components/ImageGallery';

export const meta: MetaFunction = () => {
    return [
        { title: 'Tangerine Pickled Cabbage | Probiotic Pickle | Teta Aida' },
        { name: 'description', content: 'Naturally fermented cabbage infused with Tangerine essence. Crisp, probiotic, clean ingredients.' },
        { name: 'keywords', content: 'probiotic pickles Egypt, fermented cabbage, Tangerine cabbage, probiotics, stomach & colon relief' },
    ];
};

export async function loader({ context }: LoaderFunctionArgs) {
    const { storefront } = context;

    const { product } = await storefront.query(PRODUCT_QUERY, {
        variables: { handle: 'tangerine-infused-cabbage' },
    });

    if (!product?.id) {
        throw new Response(null, { status: 404 });
    }

    return { product };
}

export default function CabbageALP() {
    const { product } = useLoaderData<typeof loader>();
    const [selectedHeat, setSelectedHeat] = useState<'mild' | 'normal' | null>(null);
    const [isSticky, setIsSticky] = useState(false);
    const { open } = useAside();

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
                                    Tangerine-Infused Cabbage
                                </h1>
                                <p className="mt-2 text-lg text-dark/60 italic">
                                    Probiotic. Crisp. Refreshingly citrus aroma.
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
                                    {(['mild', 'normal'] as const).map((level) => (
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
                                Probiotic · Naturally fermented
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* What's Inside */}
            <div ref={section1.ref} className={`mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 transition-all duration-700 ${section1.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-primary uppercase tracking-wide mb-6">
                        What's Inside
                    </h2>
                    <ul className="space-y-3">
                        {[
                            'Fermented cabbage',
                            'Tangerine essence',
                            'Crisp texture',
                            'Natural probiotics',
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
                            'Gut-friendly',
                            'Light citrus aroma',
                            'Refreshing flavor',
                            'Clean ingredients',
                            'Perfect for healthy meals',
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
                            'Healthy bowls',
                            'Sandwiches',
                            'Salads',
                            'Sides for protein',
                            'Mezze',
                            'Wraps',
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
                            'Refreshing and addictive.',
                            'The citrus twist is perfect.',
                            'My favorite healthy pickle.',
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
                            {!selectedHeat ? 'Select Heat Level' : 'Add to Cart'}
                        </AddToCartButton>
                    </div>
                </div>
            )}
        </div>
    );
}

const PRODUCT_QUERY = `#graphql
  query CabbageProduct(
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
