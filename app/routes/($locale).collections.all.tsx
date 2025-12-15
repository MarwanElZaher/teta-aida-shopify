import type { Route } from './+types/collections.all';
import {
  useLoaderData,
} from 'react-router';
import { getPaginationVariables, Image, Money } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { ProductItem } from '~/components/ProductItem';
import { BundleCard } from '~/components/BundleCard';
import type { CollectionItemFragment } from 'storefrontapi.generated';
import { useScrollAnimation } from '~/hooks/useScrollAnimation';
import { useTranslation } from '~/lib/translations';

export const meta: Route.MetaFunction = () => {
  return [{ title: `Hydrogen | Products` }];
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
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20, // Increased to handle bundles + products
  });

  const [{ products }, bundlesCollection] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: { ...paginationVariables },
    }),
    storefront.query(BUNDLES_QUERY),
  ]);

  // Extract bundles from the bundles collection
  const bundles = bundlesCollection?.bundles?.products?.nodes || [];

  // Filter out bundles from the main products list to avoid duplicates
  const bundleIds = new Set(bundles.map((b: any) => b.id));
  const regularProducts = {
    ...products,
    nodes: products.nodes.filter((p: any) => !bundleIds.has(p.id))
  };

  return { bundles, products: regularProducts };
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
  const { bundles, products } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const section1 = useScrollAnimation();
  const section2 = useScrollAnimation();
  const section3 = useScrollAnimation();

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
          <h1 className="text-white text-2xl md:text-5xl font-serif drop-shadow-md">{t('collections.allProducts')}</h1>
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

      {/* Products Section */}
      <div ref={section3.ref} className={`transition-all duration-700 delay-200 ${section3.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-2xl font-serif text-primary mb-6">{t('collections.products')}</h2>
        <PaginatedResourceSection<CollectionItemFragment>
          connection={products}
          resourcesClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8"
        >
          {({ node: product, index }) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 8 ? 'eager' : undefined}
            />
          )}
        </PaginatedResourceSection>
      </div>
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

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;

const BUNDLES_QUERY = `#graphql
  query BundlesCollection {
    bundles: collection(handle: "bundles") {
      id
      title
      products(first: 10) {
        nodes {
          ...CollectionItem
        }
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;

