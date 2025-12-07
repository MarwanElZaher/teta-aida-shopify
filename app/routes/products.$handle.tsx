import { Suspense, useState, useEffect } from 'react';
import { redirect } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { Await, useLoaderData, type MetaFunction } from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Money,
  Image,
} from '@shopify/hydrogen';
import { ProductPrice } from '~/components/ProductPrice';
import { ProductImage } from '~/components/ProductImage';
import { ProductForm } from '~/components/ProductForm';
import { HeatLevelSelector } from '~/components/HeatLevelSelector';
import { StickyCTA } from '~/components/StickyCTA';
import { BundleConfigurator, type BundleItem } from '~/components/BundleConfigurator';
import { BundleAddToCartButton } from '~/components/BundleAddToCartButton';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
import { ImageGallery } from '~/components/ImageGallery';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.product.title ?? ''} | Teta Aida` },
    { name: 'description', content: data?.product.description ?? '' },
  ];
};

export async function loader({ context, params, request }: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle, selectedOptions: getSelectedProductOptions(request) },
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  return { product };
}

export default function Product() {
  const { product } = useLoaderData<typeof loader>();
  const [selectedHeat, setSelectedHeat] = useState<string | null>(null);
  const [bundleConfig, setBundleConfig] = useState<Record<string, string>>({});
  const { open } = useAside();
  const [isMainButtonVisible, setIsMainButtonVisible] = useState(true);

  // Intersection Observer to track main button visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMainButtonVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const mainButton = document.getElementById('main-add-to-cart');
    if (mainButton) {
      observer.observe(mainButton);
    }

    return () => {
      if (mainButton) {
        observer.unobserve(mainButton);
      }
    };
  }, []);

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const { title, descriptionHtml } = product;

  // Parse Metafields
  const metafields = product.metafields || [];
  const getMetafield = (key: string) => {
    const field = metafields.find((m: any) => m?.key === key);
    return field ? field.value : null;
  };
  const getJsonMetafield = (key: string) => {
    const val = getMetafield(key);
    try { return val ? JSON.parse(val) : null; } catch (e) { return null; }
  };

  const tagline = getMetafield('tagline');
  const microTrust = getMetafield('micro_trust');
  const keyBenefits = getJsonMetafield('key_benefits') as string[] | null;
  const flavorProfile = getJsonMetafield('flavor_profile') as Record<string, string> | null;
  const usageIdeas = getJsonMetafield('usage_ideas') as string[] | null;
  const reviews = getJsonMetafield('reviews') as string[] | null;
  const heatLevels = getJsonMetafield('heat_levels') as string[] | null;
  const bundleContents = getJsonMetafield('bundle_contents') as string[] | null;
  const whyBundle = getMetafield('why_bundle');
  const bundleItems = getJsonMetafield('bundle_items') as BundleItem[] | null;

  const isBundle = !!bundleContents;
  const isBundleWithConfig = !!bundleItems && bundleItems.length > 0;

  // Check if all bundle items have selections
  const allBundleItemsSelected = isBundleWithConfig
    ? bundleItems.every((item, index) => {
      const itemKey = `${item.name}_${index}`;
      return bundleConfig[itemKey];
    })
    : false;

  const addToCartButtonProps = {
    disabled: !selectedVariant || !selectedVariant.availableForSale || (isBundleWithConfig && !allBundleItemsSelected),
    onClick: () => open('cart'),
    lines: selectedVariant
      ? [
        {
          merchandiseId: selectedVariant.id,
          quantity: 1,
          selectedVariant,
        },
      ]
      : [],
  };

  return (
    <div className="product-page pb-24">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
          {/* Product Image Gallery */}
          <div className="product-image-container relative">
            <ImageGallery
              images={product.media?.nodes || []}
              productTitle={product.title}
            />
            {microTrust && (
              <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-900 shadow-sm backdrop-blur-sm z-10">
                {microTrust}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h1>

            {tagline && (
              <p className="mt-2 text-lg italic text-gray-500">{tagline}</p>
            )}

            <div className="mt-6">
              <h2 className="sr-only">Product information</h2>
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
            </div>

            <div className="mt-8" id="main-add-to-cart">
              {/* Bundle Configurator (if bundle with items) */}
              {isBundleWithConfig ? (
                <>
                  <BundleConfigurator
                    bundleItems={bundleItems}
                    onConfigurationChange={setBundleConfig}
                  />
                  <BundleAddToCartButton
                    {...addToCartButtonProps}
                    customProperties={bundleConfig}
                  >
                    {!allBundleItemsSelected
                      ? 'Select all heat levels'
                      : selectedVariant?.availableForSale
                        ? 'Add Bundle to Cart'
                        : 'Sold out'}
                  </BundleAddToCartButton>
                </>
              ) : (
                <>
                  {/* Heat Level Selector (if applicable) */}
                  {heatLevels && heatLevels.length > 0 && (
                    <HeatLevelSelector
                      availableLevels={heatLevels as any}
                      selectedLevel={selectedHeat as any}
                      onSelect={(level) => setSelectedHeat(level)}
                    />
                  )}

                  <ProductForm
                    productOptions={productOptions}
                    selectedVariant={selectedVariant}
                  />
                </>
              )}
            </div>

            {/* Bundle Contents (if bundle) */}
            {isBundle && bundleContents && (
              <div className="mt-10 border-t border-gray-200 pt-10">
                <h3 className="text-lg font-bold text-gray-900">What's Inside</h3>
                <ul className="mt-4 space-y-2">
                  {bundleContents.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-800" />
                      {item}
                    </li>
                  ))}
                </ul>
                {whyBundle && (
                  <p className="mt-4 text-sm text-gray-500 italic">"{whyBundle}"</p>
                )}
              </div>
            )}

            {/* Key Benefits */}
            {keyBenefits && (
              <div className="mt-10 border-t border-gray-200 pt-10">
                <h3 className="text-lg font-bold text-gray-900">Why You'll Love It</h3>
                <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {keyBenefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1 text-green-600">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Flavor Profile */}
            {flavorProfile && (
              <div className="mt-10 border-t border-gray-200 pt-10">
                <h3 className="text-lg font-bold text-gray-900">Flavor Profile</h3>
                <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
                  {Object.entries(flavorProfile).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-xs font-bold uppercase text-gray-900">{key}</dt>
                      <dd className="mt-1 text-sm font-medium text-gray-700">{value as string}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h3 className="text-lg font-bold text-gray-900">Description</h3>
              <div
                className="prose prose-sm mt-4 text-gray-600"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            </div>

            {/* Usage Ideas */}
            {usageIdeas && (
              <div className="mt-10 border-t border-gray-200 pt-10">
                <h3 className="text-lg font-bold text-gray-900">Perfect For</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {usageIdeas.map((idea, i) => (
                    <span key={i} className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-800">
                      {idea}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-16">
            <h2 className="text-center text-2xl font-bold text-gray-900">Real Customer Reviews</h2>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review, i) => (
                <div key={i} className="rounded-xl bg-gray-50 p-6 shadow-sm">
                  <div className="mb-4 flex text-yellow-400">★★★★★</div>
                  <blockquote className="text-gray-600 italic">"{review}"</blockquote>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA for Mobile */}
      <StickyCTA
        title={title}
        price={selectedVariant?.price}
        available={selectedVariant?.availableForSale ?? false}
        isVisible={!isMainButtonVisible}
      >
        {isBundleWithConfig ? (
          <BundleAddToCartButton
            {...addToCartButtonProps}
            customProperties={bundleConfig}
          >
            {!allBundleItemsSelected
              ? 'Select Options'
              : selectedVariant?.availableForSale
                ? 'Add Bundle'
                : 'Sold Out'}
          </BundleAddToCartButton>
        ) : (
          <AddToCartButton
            {...addToCartButtonProps}
          >
            {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold Out'}
          </AddToCartButton>
        )}
      </StickyCTA>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
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
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
    metafields(identifiers: [
      {namespace: "custom", key: "tagline"},
      {namespace: "custom", key: "micro_trust"},
      {namespace: "custom", key: "key_benefits"},
      {namespace: "custom", key: "flavor_profile"},
      {namespace: "custom", key: "usage_ideas"},
      {namespace: "custom", key: "reviews"},
      {namespace: "custom", key: "heat_levels"},
      {namespace: "custom", key: "bundle_contents"},
      {namespace: "custom", key: "why_bundle"},
      {namespace: "custom", key: "usage_moments"},
      {namespace: "custom", key: "bundle_items"}
    ]) {
      key
      value
      type
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query GenericProduct(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
