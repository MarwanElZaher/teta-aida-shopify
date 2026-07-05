import { Await, useLoaderData, type MetaFunction, type LoaderFunctionArgs } from 'react-router';
import { getPaginationVariables, Analytics } from '@shopify/hydrogen';
import { ProductItem } from '~/components/ProductItem';
import { BundleCard } from '~/components/BundleCard';
import { useScrollAnimation } from '~/hooks/useScrollAnimation';
import { useTranslation } from '~/lib/translations';
import { SHOW_CHEESE } from '~/lib/featureFlags';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: "Teta Aida | Bundles Collection" }];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
    const { storefront } = context;

    const [pickleBundles, cheeseBundles, mixedBundles, mainBundles] = await Promise.all([
        storefront.query(COLLECTION_QUERY, {
            variables: { handle: 'pickle-bundles', first: 5 },
        }),
        SHOW_CHEESE
            ? storefront.query(COLLECTION_QUERY, {
                  variables: { handle: 'cheese-bundles', first: 2 },
              })
            : Promise.resolve({ collection: null }),
        SHOW_CHEESE
            ? storefront.query(COLLECTION_QUERY, {
                  variables: { handle: 'pickles-and-cheese', first: 2 },
              })
            : Promise.resolve({ collection: null }),
        storefront.query(COLLECTION_QUERY, {
            variables: { handle: 'bundles', first: 1 }, // Just for the hero/metadata if needed
        }),
    ]);

    return {
        pickleBundles: pickleBundles.collection,
        cheeseBundles: cheeseBundles.collection,
        mixedBundles: mixedBundles.collection,
        mainBundles: mainBundles.collection,
    };
}

export default function Bundles() {
    const { pickleBundles, cheeseBundles, mixedBundles, mainBundles } = useLoaderData<typeof loader>();
    const { t } = useTranslation();

    const heroSection = useScrollAnimation();
    const pickleSection = useScrollAnimation();
    const cheeseSection = useScrollAnimation();
    const mixedSection = useScrollAnimation();

    return (
        <div className="bundles-page pb-20">
            {/* Hero Section */}
            <div
                ref={heroSection.ref}
                className={`relative w-full mb-8 md:mb-12 cursor-default md:cursor-none transition-all duration-700 ${heroSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                onClick={() => (pickleSection.ref.current as any)?.scrollIntoView({ behavior: 'smooth' })}
                onMouseMove={(e) => {
                    const arrow = document.getElementById('hero-cursor-arrow');
                    if (arrow) {
                        arrow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
                        arrow.style.opacity = '1';
                    }
                }}
                onMouseLeave={() => {
                    const arrow = document.getElementById('hero-cursor-arrow');
                    if (arrow) arrow.style.opacity = '0';
                }}
            >
                <div className="w-full">
                    <img
                        src="/images/bundle-hero.jpg"
                        alt={t('nav.bundles')}
                        className="w-full h-auto object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>

                <div className="absolute bottom-4 md:bottom-8 left-0 right-0 text-center pointer-events-none p-4">
                    <h1 className="text-white text-3xl md:text-6xl font-serif drop-shadow-md uppercase tracking-widest">{t('nav.bundles')}</h1>
                </div>

                {/* Custom Follow Cursor Arrow */}
                <div
                    id="hero-cursor-arrow"
                    className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-50 text-white mix-blend-difference transition-opacity duration-200 opacity-0 flex items-center justify-center"
                    style={{ marginTop: '-24px', marginLeft: '-24px' }}
                >
                    <div className="animate-bounce">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6">
                {/* Section 1: Pickle Bundles */}
                {pickleBundles && pickleBundles.products.nodes.length > 0 && (
                    <div ref={pickleSection.ref} className={`mb-20 transition-all duration-700 ${pickleSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="flex flex-col items-start mb-8 md:mb-12">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-primary uppercase tracking-wider text-center">
                                {t('home.bundles.sections.pickles')}
                            </h2>
                            <div className="w-12 md:w-20 h-px bg-secondary mt-3 md:mt-4"></div>
                        </div>
                        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                            {pickleBundles.products.nodes.map((product: any) => (
                                <div key={product.id} className="min-w-[280px] md:min-w-[320px] lg:min-w-[calc(20%-2rem)] snap-center">
                                    <BundleCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section 2: Cheese Bundles */}
                {SHOW_CHEESE && cheeseBundles && cheeseBundles.products.nodes.length > 0 && (
                    <div ref={cheeseSection.ref} className={`mb-20 transition-all duration-700 ${cheeseSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="flex flex-col items-start mb-8 md:mb-12">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-primary uppercase tracking-wider text-center">
                                {t('home.bundles.sections.cheese')}
                            </h2>
                            <div className="w-12 md:w-20 h-px bg-secondary mt-3 md:mt-4"></div>
                        </div>
                        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                            {cheeseBundles.products.nodes.map((product: any) => (
                                <div key={product.id} className="min-w-[280px] md:min-w-[320px] lg:min-w-[calc(20%-2rem)] snap-center">
                                    <BundleCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section 3: Pickles & Cheese */}
                {SHOW_CHEESE && mixedBundles && mixedBundles.products.nodes.length > 0 && (
                    <div ref={mixedSection.ref} className={`mb-20 transition-all duration-700 ${mixedSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="flex flex-col items-start mb-8 md:mb-12">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-primary uppercase tracking-wider text-center">
                                {t('home.bundles.sections.mixed')}
                            </h2>
                            <div className="w-12 md:w-20 h-px bg-secondary mt-3 md:mt-4"></div>
                        </div>
                        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                            {mixedBundles.products.nodes.map((product: any) => (
                                <div key={product.id} className="min-w-[280px] md:min-w-[320px] lg:min-w-[calc(20%-2rem)] snap-center">
                                    <BundleCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Analytics.CollectionView
                data={{
                    collection: {
                        id: mainBundles?.id || 'all-bundles',
                        handle: 'bundles',
                    },
                }}
            />
        </div>
    );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
    }
    metafields(identifiers: [
      {namespace: "custom", key: "tagline"},
      {namespace: "custom", key: "arabic_title"},
      {namespace: "custom", key: "arabic_description"}
    ]) {
      key
      value
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query BundlesCollection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      products(first: $first) {
        nodes {
          ...ProductItem
        }
      }
    }
  }
` as const;
