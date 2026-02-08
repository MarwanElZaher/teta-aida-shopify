import { Await, useLoaderData, type MetaFunction, type LoaderFunctionArgs } from 'react-router';
import { Analytics } from '@shopify/hydrogen';
import { ProductItem } from '~/components/ProductItem';
import { BundleCard } from '~/components/BundleCard';
import { useScrollAnimation } from '~/hooks/useScrollAnimation';
import { useTranslation } from '~/lib/translations';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: "Teta Aida | Pickle Collection" }];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
    const { storefront } = context;

    const [pickleSelection, pickleBundles] = await Promise.all([
        storefront.query(COLLECTION_QUERY, {
            variables: { handle: 'pickles-products', first: 20 },
        }),
        storefront.query(COLLECTION_QUERY, {
            variables: { handle: 'pickle-bundles', first: 5 },
        }),
    ]);

    return {
        pickleSelection: pickleSelection.collection,
        pickleBundles: pickleBundles.collection,
    };
}

export default function PickleCollection() {
    const { pickleSelection, pickleBundles } = useLoaderData<typeof loader>();
    const { t, locale } = useTranslation();
    const isRtl = locale.language === 'AR';

    const heroSection = useScrollAnimation();
    const bundlesSection = useScrollAnimation();
    const selectionSection = useScrollAnimation();
    const enjoySection = useScrollAnimation();

    const heroText = {
        headline: isRtl ? 'المخللات، على طريقة تيتا عايدة' : 'Pickles, the Teta Aida Way.',
        subHeadline: isRtl
            ? 'مقرمشة، غنية بالنكهة، ومليئة بالتراث — صنعت بدفعات صغيرة لتزين كل مائدة.'
            : 'Crunchy, tangy, and full of heritage — crafted in small batches to elevate every meal.',
        trustLine: isRtl
            ? 'إنتاج دفعات صغيرة · مكونات نظيفة · توصيل طازج'
            : 'Small-batch crafted · Clean ingredients · Delivered fresh'
    };

    const sections = {
        bundles: isRtl ? 'عروض المخللات' : 'Pickle Bundles',
        selection: isRtl ? 'مختارات المخللات' : 'Pickle Selection',
        enjoy: {
            title: isRtl ? 'كيف تستمتعون بمخللاتنا' : 'How to Enjoy Our Pickles',
            bullets: isRtl ? [
                'أطباق المزة والمشاركة',
                'المناسبات والجمعات',
                'الموائد العائلية اليومية',
                'الطبخ وإضافة النكهات'
            ] : [
                'Mezze and sharing plates',
                'Hosting and gatherings',
                'Everyday family tables',
                'Cooking and flavor accents'
            ]
        }
    };

    return (
        <div className="pickles-collection-page pb-20">
            {/* Hero Section */}
            <div
                ref={heroSection.ref}
                className={`relative w-full mb-16 md:mb-24 transition-all duration-1000 ${heroSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="w-full">
                    <img
                        src="/images/bundle-hero.jpg"
                        alt="Pickle Collection"
                        className="w-full h-auto object-contain"
                    />
                    {/* Gradient overlay for text readability - desktop only */}
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>

                {/* Text below image on mobile, overlay on desktop */}
                <div className="text-center p-4 md:absolute md:bottom-4 md:left-0 md:right-0 md:pointer-events-none md:p-4">
                    <div className="flex flex-col gap-2 md:gap-4">
                        {/* Trust line */}
                        <p className="text-primary md:text-white text-[10px] md:text-xs lg:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] font-sans font-medium md:drop-shadow-md">
                            {heroText.trustLine}
                        </p>

                        {/* Main headline */}
                        <h2 className="text-primary md:text-white text-2xl md:text-5xl lg:text-7xl font-serif leading-tight md:drop-shadow-md">
                            {heroText.headline}
                        </h2>

                        {/* Sub-headline */}
                        <p className="text-primary/80 md:text-white/90 text-sm md:text-lg lg:text-2xl font-serif max-w-2xl md:max-w-3xl mx-auto leading-relaxed md:drop-shadow-md">
                            {heroText.subHeadline}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6">
                {/* Section 1: Pickle Bundles */}
                {pickleBundles && pickleBundles.products.nodes.length > 0 && (
                    <div ref={bundlesSection.ref} className={`mb-24 md:mb-32 transition-all duration-700 ${bundlesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="flex flex-col items-start mb-10 md:mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-primary uppercase tracking-wider">
                                {sections.bundles}
                            </h2>
                            <div className="w-16 md:w-24 h-px bg-secondary mt-4 md:mt-6"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                            {pickleBundles.products.nodes.map((product: any) => (
                                <BundleCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Section 2: Pickle Selection */}
                {pickleSelection && pickleSelection.products.nodes.length > 0 && (
                    <div ref={selectionSection.ref} className={`mb-24 md:mb-32 transition-all duration-700 ${selectionSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="flex flex-col items-start mb-10 md:mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-primary uppercase tracking-wider">
                                {sections.selection}
                            </h2>
                            <div className="w-16 md:w-24 h-px bg-secondary mt-4 md:mt-6"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
                            {pickleSelection.products.nodes.map((product: any, index: number) => (
                                <ProductItem
                                    key={product.id}
                                    product={product}
                                    loading={index < 4 ? 'eager' : undefined}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Section 3: How to Enjoy */}
                <div
                    ref={enjoySection.ref}
                    className={`mb-24 md:mb-32 transition-all duration-1000 ${enjoySection.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} bg-primary/5 rounded-3xl p-8 md:p-16 lg:p-24 overflow-hidden relative group`}
                >
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110"></div>

                    <div className="max-w-3xl mx-auto text-center relative z-10">
                        <h2 className="text-3xl md:text-5xl font-serif text-primary mb-8 md:mb-12">
                            {sections.enjoy.title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left">
                            {sections.enjoy.bullets.map((bullet, i) => (
                                <div key={i} className={`flex items-center gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white ${isRtl ? 'flex-row-reverse text-right' : 'flex-row'}`}>
                                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                                    <p className="font-serif text-lg md:text-xl text-dark/80">{bullet}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Trust Strip */}
            <div className="border-t border-primary/10 py-12 md:py-20 mt-12 bg-primary/[0.02]">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-primary/60 text-xs md:text-sm uppercase tracking-[0.4em] font-sans font-semibold">
                        {isRtl ? 'إنتاج دفعات صغيرة · مكونات نظيفة · مغلفة بعناية' : 'Small-batch crafted · Clean ingredients · Carefully packed'}
                    </p>
                </div>
            </div>

            <Analytics.CollectionView
                data={{
                    collection: {
                        id: pickleSelection?.id || 'pickles-collection',
                        handle: 'pickles-products',
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
  query PickleCollection(
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
