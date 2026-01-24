import { type LoaderFunctionArgs } from 'react-router';
import { useLoaderData, type MetaFunction } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import { useTranslation } from '~/lib/translations';
import { ProductItem } from '~/components/ProductItem';

export const meta: MetaFunction = () => {
  return [
    { title: 'Ramadan Collections | Premium Pickle Boxes for Ramadan | Teta Aida' },
    { name: 'description', content: 'Discover Teta Aida’s Ramadan Collections — curated pickle boxes crafted for Ramadan tables, featuring Tuffaahy olives, preserved lemons, and Turnips. Delivered fresh across Cairo.' },
    { name: 'keywords', content: 'Ramadan pickle boxes Egypt, premium Ramadan food Cairo, Tuffaahy olives Ramadan, lemon pickles Ramadan, Turnips Ramadan, Teta Aida Ramadan' },
  ];
};

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;
  const { collection } = await storefront.query(COLLECTION_QUERY, {
    variables: {
      handle: 'ramadan-collections',
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });


  if (!collection) {
    throw new Response('Collection Not Found', { status: 404 });
  }

  return {
    collection,
    locale: context.storefront.i18n,
  };
}

export default function RamadanCollectionsPage() {
  const { collection } = useLoaderData<typeof loader>();
  const { t, locale } = useTranslation();

  // Define the exact order we want
  const PRODUCT_ORDER = [
    'ramadan-signature-box',
    'olive-lovers-box',
    'lemon-lovers-box',
    'turnip-lovers-box',
    'olive-duo',
    'lemon-duo',
    'turnip-duo',
  ];

  // Sort products according to the defined order
  const sortedProducts = PRODUCT_ORDER.map(handle =>
    collection.products.nodes.find((p: any) => p.handle === handle)
  ).filter(Boolean);

  return (
    <div className="bg-[#F9F7F2] min-h-screen pb-24">
      {/* Page Header */}
      <div className="pt-32 pb-16 text-center px-4">
        <h1 className="font-serif text-4xl md:text-5xl text-primary mb-6">
          🌙 {t('ramadan.title') || 'Ramadan Collections'}
        </h1>
        <p className="text-lg md:text-xl text-dark/70 max-w-2xl mx-auto leading-relaxed">
          {t('ramadan.subtitle') || 'Curated pickle boxes designed for Ramadan tables and longer household stocking.'}
        </p>
      </div>

      {/* Collection Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {sortedProducts.map((product: any) => {
            const tagline = product.metafields?.find((m: any) => m?.key === 'tagline')?.value;

            return (
              <div key={product.id} className="group relative flex flex-col">
                {/* Image */}
                <a href={`${locale.pathPrefix}/products/${product.handle}`} className="overflow-hidden rounded-2xl bg-white mb-6">
                  {product.featuredImage && (
                    <Image
                      data={product.featuredImage}
                      className="h-full w-full object-contain transform transition-transform duration-700 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  )}
                </a>

                {/* Content */}
                <div className="flex-1 flex flex-col text-center gap-2">
                  <h3 className="font-serif text-xl text-primary mb-3 group-hover:text-secondary transition-colors">
                    <a href={`${locale.pathPrefix}/products/${product.handle}`}>
                      {product.title}
                    </a>
                  </h3>

                  {tagline && (
                    <p className="text-sm text-dark/70 mb-6 line-clamp-2 min-h-[40px]">
                      {tagline}
                    </p>
                  )}

                  <div className="mt-auto">
                    <a
                      href={`${locale.pathPrefix}/products/${product.handle}`}
                      className="btn-primary sm:w-auto sm:px-10 hover-lift"
                    >
                      {t('common.shopNow') || 'Shop Now'}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment ProductItem on Product {
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
      {namespace: "custom", key: "heat_levels"}
    ]) {
      key
      value
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  query RamadanCollection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      products(first: 20) {
        nodes {
          ...ProductItem
        }
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
