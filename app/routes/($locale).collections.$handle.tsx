import { redirect, useLoaderData } from 'react-router';
import type { Route } from './+types/collections.$handle';
import { getPaginationVariables, Analytics } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { ProductItem } from '~/components/ProductItem';
import { BundleCard } from '~/components/BundleCard';
import type { ProductItemFragment } from 'storefrontapi.generated';
import { useScrollAnimation } from '~/hooks/useScrollAnimation';
import { useTranslation } from '~/lib/translations';

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.collection.title ?? ''} Collection` }];
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
async function loadCriticalData({ context, params, request }: Route.LoaderArgs) {
  const { handle } = params;
  const { storefront } = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{ collection }] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: { handle, ...paginationVariables },
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // Sort bundles in the correct order if this is the bundles collection
  if (handle === 'bundles' && collection.products?.nodes) {
    const bundleOrder = ['all-four-premium-flavors-one-elegant-box', 'healthy-living-box', 'spicy-lovers-box', 'hosting-box'];
    collection.products.nodes = collection.products.nodes.sort((a: any, b: any) => {
      const aIndex = bundleOrder.indexOf(a.handle);
      const bIndex = bundleOrder.indexOf(b.handle);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, { handle, data: collection });

  return {
    collection,
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
  const { collection } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const section1 = useScrollAnimation();
  const section2 = useScrollAnimation();

  // Use localized title and description for specific collections
  const getLocalizedCollectionData = (handle: string) => {
    if (handle === 'bundles') {
      return {
        title: t('collections.bundles.title'),
        description: t('collections.bundles.description'),
      };
    }
    if (handle === 'best-sellers') {
      return {
        title: t('collections.bestSellers.title'),
        description: t('collections.bestSellers.description'),
      };
    }
    return {
      title: collection.title,
      description: collection.description,
    };
  };

  const { title: displayTitle, description: displayDescription } = getLocalizedCollectionData(collection.handle);

  return (
    <div className="collection">
      {collection.handle === 'bundles' ? (
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
              alt={displayTitle}
              className="w-full h-auto object-contain"
            />
            {/* Gradient overlay for text readability if needed, or remove if "fit totally" means clear image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>

          <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none p-4">
            {/* Simple Title Overlay at bottom */}
            <h3 className="text-white text-2xl md:text-5xl font-serif drop-shadow-md">{displayTitle}</h3>
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
      ) : (
        <div ref={section1.ref} className={`transition-all duration-700 ${section1.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} mb-8`}>
          <h1>{displayTitle}</h1>
          <p className="collection-description">{displayDescription}</p>
        </div>
      )}
      <div ref={section2.ref} className={`transition-all duration-700 delay-200 ${section2.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <PaginatedResourceSection<ProductItemFragment>
          connection={collection.products}
          resourcesClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8"
        >
          {({ node: product, index }) => (
            collection.handle === 'bundles' ? (
              // @ts-ignore
              <BundleCard key={product.id} product={product} />
            ) : (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
              />
            )
          )}
        </PaginatedResourceSection>
      </div>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
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

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
