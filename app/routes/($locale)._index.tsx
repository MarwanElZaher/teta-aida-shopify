import { Await, useLoaderData, Link, type MetaFunction } from 'react-router';
import type { Route } from './+types/($locale)._index';
import { Suspense } from 'react';
import { Image } from '@shopify/hydrogen';
import { useTranslation } from '~/lib/translations';
import { BundleCard } from '~/components/BundleCard';
import { ProductItem } from '~/components/ProductItem';

export const meta: MetaFunction = () => {
    return [
        { title: 'Teta Aida | Premium Artisanal Pickles | Small-Batch, Clean Ingredients' },
        { name: 'description', content: 'Premium small-batch artisanal pickles crafted with clean, carefully selected ingredients. Shop curated bundles, gently crushed olives, low-salt cucumbers, Tangerine cabbage & harissa lemons.' },
    ];
};

export async function loader({ context }: Route.LoaderArgs) {
    const { storefront } = context;
    const { featured, bestSellers, fallbackProducts } = await storefront.query(HOMEPAGE_QUERY);

    let featuredBundles = featured?.products.nodes || [];
    let bestSellingProducts = bestSellers?.products.nodes || [];

    // Fallback: If no bundles collection, look for products with 'bundle' in title/handle
    if (featuredBundles.length === 0 && fallbackProducts?.nodes) {
        featuredBundles = fallbackProducts.nodes.filter((p: any) =>
            p.title.toLowerCase().includes('bundle') || p.handle.toLowerCase().includes('bundle')
        ).slice(0, 4);
    }

    // Fallback: If no best-sellers collection, use generic products
    if (bestSellingProducts.length === 0 && fallbackProducts?.nodes) {
        bestSellingProducts = fallbackProducts.nodes
            .filter((p: any) => !featuredBundles.find((b: any) => b.id === p.id)) // Avoid duplicates
            .slice(0, 4);
    }

    return {
        featuredBundles,
        bestSellers: bestSellingProducts,
    };
}

export default function Homepage() {
    const data = useLoaderData<typeof loader>();
    const { t, locale } = useTranslation();

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
                        <p className="font-sans text-lg md:text-xl text-dark/80 mb-10 max-w-xl animate-fade-in-up delay-200">
                            {t('home.hero.subtitle')}
                        </p>
                        <div className="flex flex-col w-full sm:w-auto gap-4 sm:flex-row animate-fade-in-up delay-300">
                            <Link to={`${locale.pathPrefix}/collections/bundles`} className="btn-primary sm:w-auto sm:px-10 hover-lift">
                                {t('home.hero.shopBundles')}
                            </Link>
                            <Link to={`${locale.pathPrefix}/collections/all`} className="btn-secondary sm:w-auto sm:px-10 hover-lift">
                                {t('home.hero.shopAll')}
                            </Link>
                        </div>
                        <p className="mt-8 text-xs font-bold uppercase tracking-widest text-dark/60 animate-fade-in-up delay-300">
                            {t('home.hero.footer')}
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. FEATURED BUNDLES (Horizontal Scroll on Mobile) */}
            <section className="py-16 md:py-24 bg-cream">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">{t('home.bundles.title')}</h2>
                        <p className="text-dark/70 max-w-2xl mx-auto">{t('home.bundles.subtitle')}</p>
                    </div>

                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
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
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">{t('home.bestsellers.title')}</h2>
                        <p className="text-dark/70 max-w-2xl mx-auto">{t('home.bestsellers.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
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
            <section className="py-20 bg-[#F0EFEB]">
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

            {/* 5. BRAND STORY */}
            <section className="py-24 bg-primary text-[#F9F7F2] text-center">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="font-serif text-3xl md:text-5xl mb-8 leading-tight">{t('home.story.title')}</h2>
                    <p className="text-lg md:text-xl opacity-90 mb-12 leading-relaxed font-light">
                        {t('home.story.text')}
                    </p>
                    <Link to={`${locale.pathPrefix}/pages/about-us`} className="inline-block px-8 py-4 border border-[#F9F7F2] rounded-full text-[#F9F7F2] font-bold uppercase tracking-widest hover:bg-[#F9F7F2] hover:text-primary transition-all">
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
      {namespace: "custom", key: "arabic_title"},
      {namespace: "custom", key: "arabic_description"}
    ]) {
      key
      value
    }
  }
` as const;

const HOMEPAGE_QUERY = `#graphql
  query Homepage {
    featured: collection(handle: "bundles") {
      id
      title
      products(first: 4) {
        nodes {
          ...ProductCard
        }
      }
    }
    bestSellers: collection(handle: "best-sellers") {
      id
      title
      products(first: 4) {
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
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
