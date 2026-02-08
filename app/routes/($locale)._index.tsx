import { Await, useLoaderData, Link, type MetaFunction } from 'react-router';
import type { Route } from './+types/($locale)._index';
import { Suspense } from 'react';
import { Image } from '@shopify/hydrogen';
import { useTranslation, TRANSLATIONS } from '~/lib/translations';
import { BundleCard } from '~/components/BundleCard';
import { ProductItem } from '~/components/ProductItem';
import { RamadanCollectionsHome } from '~/components/RamadanCollectionsHome';
import { useScrollAnimation } from '~/hooks/useScrollAnimation';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    const locale = data?.locale || { language: 'EN' };
    const lang = (locale.language as keyof typeof TRANSLATIONS) || 'EN';
    const t = TRANSLATIONS[lang];

    return [
        { title: 'Teta Aida | Premium Artisanal Pickles | Ramadan Collections & Signature Flavors' },
        { name: 'description', content: 'Premium small-batch artisanal pickles crafted with clean, carefully selected ingredients. Discover our Ramadan Signature Collection, olive, lemon, and turnip collections — handcrafted and delivered fresh across Cairo.' },
        { name: 'keywords', content: 'premium Ramadan food Egypt, Ramadan pickles Egypt, olive pickles Ramadan, lemon pickles Ramadan, Teta Aida Ramadan' },
        // Old SEO Backup:
        // { title: t?.seo?.home?.title || 'Teta Aida | Premium Artisanal Pickles' },
        // { name: 'description', content: t?.seo?.home?.description || 'Premium small-batch artisanal pickles.' },
    ];
};

export async function loader({ context }: Route.LoaderArgs) {
    const { storefront } = context;
    const { featured, bestSellers, fallbackProducts, ramadanCollection } = await storefront.query(HOMEPAGE_QUERY, {
        variables: {
            country: storefront.i18n.country,
            language: storefront.i18n.language,
        },
    });

    let featuredBundles = featured?.products.nodes || [];
    let bestSellingProducts = bestSellers?.products.nodes || [];

    // Fallback: If no bundles collection, look for products with 'bundle' in title/handle
    if (featuredBundles.length === 0 && fallbackProducts?.nodes) {
        featuredBundles = fallbackProducts.nodes.filter((p: any) =>
            p.title.toLowerCase().includes('bundle') || p.handle.toLowerCase().includes('bundle')
        ).slice(0, 4);
    }

    // Prioritize Winter Comfort Box if present
    const winterBoxIndex = featuredBundles.findIndex((p: any) => p.handle === 'winter-comfort-box');
    if (winterBoxIndex > -1) {
        const [winterBox] = featuredBundles.splice(winterBoxIndex, 1);
        featuredBundles.unshift(winterBox);
    }

    // Fallback: If no best-sellers collection, use generic products
    if (bestSellingProducts.length === 0 && fallbackProducts?.nodes) {
        bestSellingProducts = fallbackProducts.nodes
            .filter((p: any) => !featuredBundles.find((b: any) => b.id === p.id)) // Avoid duplicates
            .slice(0, 4);
    }

    // Prioritize Vintage-Style Turnips if present
    const turnipsIndex = bestSellingProducts.findIndex((p: any) => p.handle === 'vintage-style-turnips');
    if (turnipsIndex > -1) {
        const [turnips] = bestSellingProducts.splice(turnipsIndex, 1);
        bestSellingProducts.unshift(turnips);
    }

    return {
        featuredBundles,
        bestSellers: bestSellingProducts,
        ramadanProducts: ramadanCollection?.products.nodes || [],
        locale: context.storefront.i18n,
    };
}

export default function Homepage() {
    const data = useLoaderData<typeof loader>();
    const { t, locale } = useTranslation();

    const section1 = useScrollAnimation();
    const section2 = useScrollAnimation();
    const section3 = useScrollAnimation();
    const section4 = useScrollAnimation();
    const section5 = useScrollAnimation();

    return (
        <div className="home">
            {/* 1. HERO SECTION */}
            <section className="relative h-screen min-h-[600px] w-full bg-[#F0EFEB] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className="absolute inset-0 w-full h-full opacity-80"
                        style={{
                            backgroundImage: 'url("/hero-bg.jpg")',
                            backgroundRepeat: 'repeat',
                            backgroundSize: '300px',
                            backgroundPosition: 'center'
                        }}
                    />
                    <div className="absolute inset-0 bg-black/10" />
                </div>

                <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto pt-20">
                    <div className='bg-white/80 p-6 rounded-lg backdrop-blur-sm py-10 flex flex-col justify-center gap-6 animate-fade-in-up'>
                        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 animate-fade-in-up delay-100">
                            {t('home.hero.title')}
                        </h1>
                        <div className='flex justify-center'>
                            <p className="font-sans text-lg md:text-xl text-dark/80 mb-10 max-w-xl animate-fade-in-up delay-200">
                                {t('home.hero.subtitle')}
                            </p>
                        </div>
                        <div className="flex flex-col w-full sm:w-auto gap-4 sm:flex-row animate-fade-in-up delay-300">
                            <Link to={`${locale.pathPrefix}/collections/bundles`} className="btn-primary sm:w-auto sm:px-10 hover-lift">
                                {t('home.hero.shopBundles')}
                            </Link>
                            <Link to={`${locale.pathPrefix}/collections/all`} className="btn-secondary sm:w-auto sm:px-10 hover-lift">
                                {t('home.hero.shopAll')}
                            </Link>
                        </div>
                        <Link to={`${locale.pathPrefix}/collections/ramadan-collections`} className="w-fit mx-auto underline text-sm uppercase font-semibold text-primary hover:text-secondary hover-lift">
                            🌙 {t('ramadan.discoverShortcut')}
                        </Link>
                        {/* <p className="mt-8 text-xs font-bold uppercase tracking-widest text-dark/60 animate-fade-in-up delay-300">
                            {t('home.hero.footer')}
                        </p> */}
                    </div>
                </div>
            </section>

            {/* RAMADAN COLLECTIONS (New) */}
            <RamadanCollectionsHome products={data.ramadanProducts} />

            {/* 2. FEATURED BUNDLES (Horizontal Scroll on Mobile) */}
            <section ref={section1.ref} className={`${section1.isVisible ? 'opacity-100 transition-opacity duration-500 translate-y-0' : 'opacity-0 transition-opacity duration-500 translate-y-10'} py-16 md:py-24 bg-cream`}>
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">{t('home.bundles.title')}</h2>
                        <p className="text-dark/70 max-w-2xl mx-auto">{t('home.bundles.subtitle')}</p>
                    </div>

                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 md:grid md:grid-cols-2 lg:grid-cols-5 md:overflow-visible scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        {data.featuredBundles.length > 0 ? (
                            data.featuredBundles.map((product: any) => (
                                <div key={product.id} className="min-w-[280px] snap-center md:min-w-0">
                                    <BundleCard product={product} />
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">Bundles coming soon...</p>
                        )}
                    </div>
                </div>
            </section>

            {/* 3. BEST SELLERS (Tight Grid) */}
            <section ref={section2.ref} className={`${section2.isVisible ? 'animate-fade-in-up' : 'opacity-0'} py-16 md:py-24 bg-white`}>
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">{t('home.bestsellers.title')}</h2>
                        <p className="text-dark/70 max-w-2xl mx-auto">{t('home.bestsellers.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 md:gap-8">
                        {data.bestSellers.length > 0 ? (
                            data.bestSellers.map((product: any) => (
                                <ProductItem key={product.id} product={product} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">Products loading...</p>
                        )}
                    </div>

                    <div className="mt-16 text-center">
                        <Link to={`${locale.pathPrefix}/collections/all`} className="inline-block border-b-2 border-primary text-primary font-bold uppercase tracking-widest hover:text-secondary hover:border-secondary transition-colors pb-1">
                            {t('home.bestsellers.viewAll')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. WHY TETA AIDA */}
            <section ref={section3.ref} className={`${section3.isVisible ? 'animate-fade-in-up' : 'opacity-0'} py-20 bg-[#F0EFEB]`}>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-3xl shadow-sm">🏺</div>
                            <h3 className="font-serif text-xl text-primary">{t('home.features.craftsmanship.title')}</h3>
                            <p className="text-sm text-dark/70 leading-relaxed">{t('home.features.craftsmanship.text')}</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-3xl shadow-sm">🌿</div>
                            <h3 className="font-serif text-xl text-primary">{t('home.features.clean.title')}</h3>
                            <p className="text-sm text-dark/70 leading-relaxed">{t('home.features.clean.text')}</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-3xl shadow-sm">✨</div>
                            <h3 className="font-serif text-xl text-primary">{t('home.features.probiotic.title')}</h3>
                            <p className="text-sm text-dark/70 leading-relaxed">{t('home.features.probiotic.text')}</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-3xl shadow-sm">🍋</div>
                            <h3 className="font-serif text-xl text-primary">{t('home.features.gourmet.title')}</h3>
                            <p className="text-sm text-dark/70 leading-relaxed">{t('home.features.gourmet.text')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. REAL CUSTOMER MOMENTS */}
            <section ref={section4.ref} className={`${section4.isVisible ? 'animate-fade-in-up' : 'opacity-0'} py-20 bg-gradient-to-br from-cream to-white`}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">{t('home.reviews.title')}</h2>
                        <p className="text-dark/70 max-w-2xl mx-auto">{t('home.reviews.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-secondary text-4xl mb-4">"</div>
                            <p className="text-lg font-serif text-primary mb-4">{t('home.reviews.quote1')}</p>
                            <div className="flex text-secondary text-sm">★★★★★</div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-secondary text-4xl mb-4">"</div>
                            <p className="text-lg font-serif text-primary mb-4">{t('home.reviews.quote2')}</p>
                            <div className="flex text-secondary text-sm">★★★★★</div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-secondary text-4xl mb-4">"</div>
                            <p className="text-lg font-serif text-primary mb-4">{t('home.reviews.quote3')}</p>
                            <div className="flex text-secondary text-sm">★★★★★</div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-secondary text-4xl mb-4">"</div>
                            <p className="text-lg font-serif text-primary mb-4">{t('home.reviews.quote4')}</p>
                            <div className="flex text-secondary text-sm">★★★★★</div>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            to={`${locale.pathPrefix}/pages/reviews`}
                            className="inline-block border-b-2 border-primary text-primary font-bold uppercase tracking-widest hover:text-secondary hover:border-secondary transition-colors pb-1"
                        >
                            {t('home.reviews.viewAll')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* 6. BRAND STORY */}
            <section ref={section5.ref} className={`${section5.isVisible ? 'animate-fade-in-up' : 'opacity-0'} py-24 bg-primary text-[#F9F7F2] text-center`}>
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="font-serif text-3xl md:text-5xl mb-8 leading-tight">{t('home.story.title')}</h2>
                    <p className="text-lg md:text-xl opacity-90 mb-12 leading-relaxed font-light">
                        {t('home.story.text')}
                    </p>
                    <Link to={`${locale.pathPrefix}/pages/about-us`} className="inline-block px-10 py-4 bg-secondary text-white font-bold uppercase tracking-widest text-sm rounded-full hover:bg-[#b8941f] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        {t('home.story.cta')}
                    </Link>
                </div>
            </section>
        </div>
    );
}

const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    metafields(identifiers: [
      {namespace: "custom", key: "tagline"},
      {namespace: "custom", key: "arabic_tagline"},
      {namespace: "custom", key: "arabic_title"},
      {namespace: "custom", key: "arabic_description"}
    ]) {
      key
      value
    }
  }
` as const;

const HOMEPAGE_QUERY = `#graphql
  query Homepage(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    featured: collection(handle: "bundles") {
      id
      title
      products(first: 5) {
        nodes {
          ...ProductCard
        }
      }
    }
    bestSellers: collection(handle: "best-sellers") {
      id
      title
      products(first: 5) {
        nodes {
          ...ProductCard
        }
      }
    }
    fallbackProducts: products(first: 20) {
      nodes {
        ...ProductCard
      }
    }
    ramadanCollection: collection(handle: "ramadan-collections") {
       id
       title
       products(first: 10) {
         nodes {
           ...ProductCard
         }
       }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

