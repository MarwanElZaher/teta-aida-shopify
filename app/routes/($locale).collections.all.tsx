import type { Route } from './+types/collections.all';
import {
  useLoaderData,
} from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import { ProductItem } from '~/components/ProductItem';
import { BundleCard } from '~/components/BundleCard';
import { useScrollAnimation } from '~/hooks/useScrollAnimation';
import { useTranslation } from '~/lib/translations';

export const meta: Route.MetaFunction = () => {
  return [{ title: `Products` }];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context, request }: Route.LoaderArgs) {
  const { storefront } = context;

  // Fetch all four collections in parallel
  const [bundlesData, picklesData, cheeseData, ramadanData] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: { handle: 'bundles', first: 10 },
    }),
    storefront.query(COLLECTION_QUERY, {
      variables: { handle: 'pickles-products', first: 20 },
    }),
    storefront.query(COLLECTION_QUERY, {
      variables: { handle: 'cheese-collection', first: 20 },
    }),
    storefront.query(COLLECTION_QUERY, {
      variables: { handle: 'ramadan-moments', first: 20 },
    }),

  ]);

  return {
    bundles: bundlesData.collection?.products?.nodes || [],
    pickles: picklesData.collection?.products?.nodes || [],
    cheese: cheeseData.collection?.products?.nodes || [],
    ramadan: ramadanData.collection?.products?.nodes || [],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const { bundles, pickles, cheese, ramadan } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const section1 = useScrollAnimation();
  const section2 = useScrollAnimation();
  const section3 = useScrollAnimation();
  const section4 = useScrollAnimation();
  const section5 = useScrollAnimation();

  return (
    <div className="collection">
      <div
        ref={section1.ref}
        className={`relative w-full mb-12 cursor-none transition-all duration-700 ${section1.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        onClick={() => (section2.ref.current as any)?.scrollIntoView({ behavior: 'smooth' })}
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
            alt={t('collections.allProducts')}
            className="w-full h-auto object-contain"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>

        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 text-center pointer-events-none p-4">
          <h3 className="text-white text-2xl md:text-5xl font-serif drop-shadow-md">{t('collections.allProducts')}</h3>
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

      {/* Bundles Section */}
      {bundles && bundles.length > 0 && (
        <div ref={section2.ref} className={`transition-all duration-700 delay-100 ${section2.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} mb-16`}>
          <h2 className="text-2xl font-serif text-primary mb-6">{t('nav.bundles')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
            {bundles.map((bundle: any) => (
              <BundleCard key={bundle.id} product={bundle} />
            ))}
          </div>
        </div>
      )}

      {/* Pickles Section */}
      {pickles && pickles.length > 0 && (
        <div ref={section3.ref} className={`transition-all duration-700 delay-200 ${section3.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} mb-16`}>
          <h2 className="text-2xl font-serif text-primary mb-6">{t('collections.pickles')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
            {pickles.map((product: any, index: number) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Cheese Section */}
      {cheese && cheese.length > 0 && (
        <div ref={section4.ref} className={`transition-all duration-700 delay-300 ${section4.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} mb-16`}>
          <h2 className="text-2xl font-serif text-primary mb-6">{t('collections.cheese')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
            {cheese.map((product: any, index: number) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ramadan Section */}
      {ramadan && ramadan.length > 0 && (
        <div ref={section5.ref} className={`transition-all duration-700 delay-400 ${section5.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} mb-16`}>
          <h2 className="text-2xl font-serif text-primary mb-6">{t('collections.ramadan')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
            {ramadan.map((product: any, index: number) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
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
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
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
  ${COLLECTION_ITEM_FRAGMENT}
  query AllProductsCollection(
    $handle: String!
    $first: Int
  ) {
    collection(handle: $handle) {
      id
      title
      products(first: $first) {
        nodes {
          ...CollectionItem
        }
      }
    }
  }
` as const;
