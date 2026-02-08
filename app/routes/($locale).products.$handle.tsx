import { Suspense, useState, useEffect } from 'react';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, type MetaFunction } from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Money,
} from '@shopify/hydrogen';
import { ProductPrice } from '~/components/ProductPrice';
import { ProductForm } from '~/components/ProductForm';
import { HeatLevelSelector } from '~/components/HeatLevelSelector';
import { StickyCTA } from '~/components/StickyCTA';
import { BundleConfigurator, type BundleItem } from '~/components/BundleConfigurator';
import { BundleAddToCartButton } from '~/components/BundleAddToCartButton';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
import { ImageGallery } from '~/components/ImageGallery';
import { useTranslation } from '~/lib/translations';
import { getLocalizedTitle, getLocalizedDescription } from '~/lib/localized-content';

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const product = data?.product;
  const locale = data?.locale || { language: 'EN' };
  const isArabic = locale.language === 'AR';

  if (!product) {
    return [{ title: 'Product Not Found | Teta Aida' }];
  }

  // Get localized SEO values from metafields
  const metafields = product.metafields || [];
  const arabicTitle = metafields.find((m: any) => m?.key === 'arabic_title')?.value;
  const arabicDescription = metafields.find((m: any) => m?.key === 'arabic_description')?.value;

  const title = isArabic && arabicTitle ? arabicTitle : product.title;
  const description = isArabic && arabicDescription ? arabicDescription : product.description;

  return [
    { title: `${title} | Teta Aida` },
    { name: 'description', content: description ?? '' },
  ];
};

export async function loader({ context, params, request }: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // 1. Fetch the main product first to access its metafields
  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions: getSelectedProductOptions(request),
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  // 2. Extracts the recommended product handle from metafields
  const recommendedHandle = product.metafields?.find((m: any) => m?.key === 'recommended_product')?.value;
  let recommendedProductData = null;

  // 3. Fetch recommended product if handle exists
  if (recommendedHandle) {
    const { product: recProd } = await storefront.query(RECOMMENDED_PRODUCT_QUERY, {
      variables: {
        handle: recommendedHandle,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    });
    recommendedProductData = recProd;
  }

  return { product, recommendedProduct: recommendedProductData, locale: storefront.i18n };
}

export default function Product() {
  const { product, recommendedProduct, locale } = useLoaderData<typeof loader>();
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
  const { t } = useTranslation();

  // Get localized title and description
  const displayTitle = getLocalizedTitle(title, product.metafields as any, locale.language);
  let displayDescription = getLocalizedDescription(descriptionHtml, product.metafields as any, locale.language);

  // Create a robust description that handles plain text newlines if HTML isn't present
  if (displayDescription && !/<[a-z][\s\S]*>/i.test(displayDescription)) {
    displayDescription = displayDescription.replace(/\n/g, '<br/>');
  }

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

  const flavorProfileRaw = getMetafield('flavor_profile');
  const flavorProfile = (() => {
    if (!flavorProfileRaw) return null;
    try {
      const parsed = JSON.parse(flavorProfileRaw);
      return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
    } catch (e) {
      return null;
    }
  })() as Record<string, string> | null;

  const usageIdeas = getJsonMetafield('usage_ideas') as string[] | null;
  const reviews = getJsonMetafield('reviews') as string[] | null;
  const heatLevels = getJsonMetafield('heat_levels') as string[] | null;
  const bundleContents = getJsonMetafield('bundle_contents') as (string | { name: string; weight?: string; description?: string })[] | null;
  const usageMoments = getJsonMetafield('usage_moments') as (string | { name: string; weight?: string; description?: string })[] | null;

  const whyBundleRaw = getMetafield('why_bundle');
  const whyBundle = (() => {
    if (!whyBundleRaw) return null;
    try {
      // Try parsing assuming it's JSON
      return JSON.parse(whyBundleRaw);
    } catch (e) {
      // Fallback to string if not valid JSON
      return whyBundleRaw;
    }
  })();

  const whyThisBoxWorks = getJsonMetafield('why_this_box_works') as string[] | null;
  const displayWhyWorks = (whyThisBoxWorks || (Array.isArray(whyBundle) ? whyBundle : null)) as string[] | null;

  const rawBundleItems = getJsonMetafield('bundle_items') as BundleItem[] | null;
  const bundleItems = rawBundleItems?.map(item => ({
    ...item,
    heatLevels: item.heatLevels || [],
    displayName: (locale.language === 'AR' && item.arabic_title) ? item.arabic_title : item.name,
    name: item.name // Keep original name for keys
  })) || null;

  const isBundle = !!bundleContents;
  const isBundleWithConfig = !!bundleItems && bundleItems.length > 0;

  const ingredients = getMetafield('ingredients');
  const nutritionFacts = getJsonMetafield('nutrition_facts');
  const servingSize = getMetafield('serving_size');

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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{displayTitle}</h1>

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
                    bundleItems={bundleItems || []}
                  >
                    {!allBundleItemsSelected
                      ? t('product.selectHeatLevel')
                      : selectedVariant?.availableForSale
                        ? t('product.addBundleToCart')
                        : t('product.soldOut')}
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
                    attributes={selectedHeat ? [{
                      key: `${t('product.heatLevel')} ${t('product.attributes.heatLevelMarker')}`,
                      value: (() => {
                        const lowerHeat = selectedHeat.toLowerCase();
                        return (lowerHeat === 'mild' || lowerHeat === 'normal' || lowerHeat === 'spicy')
                          ? t(`product.heatLevels.${lowerHeat}`)
                          : selectedHeat;
                      })()
                    }] : []}
                  />
                </>
              )}
            </div>

            {/* Bundle Contents (if bundle) */}
            {isBundle && bundleContents && (
              <div className="mt-10 border-t border-gray-200 pt-10">
                <h3 className="font-serif text-lg font-bold text-primary uppercase tracking-wide">{t('product.whatsInside')}</h3>
                <ul className="mt-4 space-y-2">
                  {bundleContents.map((item, i) => {
                    // Handle both string format and object format
                    const rawName = typeof item === 'string' ? item : item.name;
                    const name = getLocalizedTitle(rawName, [], locale.language);
                    const description = typeof item === 'object' ? item.description : null;

                    return (
                      <li key={i} className="flex items-start gap-2 text-gray-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-800 mt-2 flex-shrink-0" />
                        <div>
                          <span className="font-medium">{name}</span>
                          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Why This Box Works (Prioritized if available) OR Legacy Key Benefits */}
            {(displayWhyWorks || keyBenefits) && (
              <div className="mt-10 border-t border-gray-200 pt-10">
                <h3 className="font-serif text-lg font-bold text-primary uppercase tracking-wide">
                  {displayWhyWorks ? t('product.whyBoxWorks') : t('product.whyLoveIt')}
                </h3>

                {/* Render Why Box Works / Bundle (List support) */}
                {displayWhyWorks && (
                  <ul className="mt-6 space-y-3">
                    {displayWhyWorks.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Render Legacy Key Benefits if no displayWhyWorks */}
                {!displayWhyWorks && keyBenefits && (
                  <ul className="mt-6 space-y-3">
                    {keyBenefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Legacy string support for whyBundle */}
                {typeof whyBundle === 'string' && !whyThisBoxWorks && !whyBundle.startsWith('[') && (
                  <p className="mt-4 text-sm text-gray-500 italic">"{whyBundle}"</p>
                )}
              </div>
            )}

            {/* Ingredients & Nutrition */}
            {
              (ingredients || nutritionFacts) && (
                <div className="mt-10 border-t border-gray-200 pt-10">
                  <h3 className="font-serif text-lg font-bold text-primary uppercase tracking-wide">{t('product.ingredients')} & {t('product.nutrition')}</h3>

                  {ingredients && (
                    <div className="mt-4">
                      <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">{t('product.ingredients')}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{ingredients}</p>
                    </div>
                  )}

                  {nutritionFacts && (
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide flex justify-between items-center">
                        {t('product.nutritionFacts')}
                        {servingSize && <span className="text-xs font-normal text-gray-500 normal-case">{t('product.servingSize')}: {servingSize}</span>}
                      </h4>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                        {Object.entries(nutritionFacts as Record<string, string>).map(([key, value]) => (
                          <div key={key} className="flex justify-between border-b border-gray-200 pb-1 last:border-0">
                            <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                            <span className="font-bold text-gray-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            }

            {/* Usage Moments */}
            {
              usageMoments && (
                <div className="mt-10 border-t border-gray-200 pt-10">
                  <h3 className="font-serif text-lg font-bold text-primary uppercase tracking-wide">{t('product.usageMoments')}</h3>
                  <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {usageMoments.map((moment, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                        <span className="text-secondary">✦</span> {moment as string}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Flavor Profile */}
            {
              flavorProfile && (
                <div className="mt-10 border-t border-gray-200 pt-10">
                  <h3 className="font-serif text-lg font-bold text-primary uppercase tracking-wide">{t('product.flavorProfile')}</h3>
                  <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
                    {Object.entries(flavorProfile).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-xs font-bold uppercase text-gray-900">{key}</dt>
                        <dd className="mt-1 text-sm font-medium text-gray-700">{value as string}</dd>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            {/* Description */}
            {
              displayDescription && (
                <div className="mt-10 border-t border-gray-200 pt-10">
                  <h3 className="text-lg font-bold text-gray-900">{t('product.description')}</h3>
                  <div
                    className="prose prose-sm mt-4 text-gray-600"
                    dangerouslySetInnerHTML={{ __html: displayDescription }}
                  />
                </div>
              )}

            {/* Usage Ideas */}
            {usageIdeas && (
              <div className="mt-10 border-t border-gray-200 pt-10">
                <h3 className="font-serif text-lg font-bold text-primary uppercase tracking-wide">{t('product.description')}</h3>
                <div
                  className="prose prose-sm mt-4 text-gray-600"
                  dangerouslySetInnerHTML={{ __html: displayDescription }}
                />
              </div>
            )
            }

            {/* Usage Ideas */}
            {
              usageIdeas && (
                <div className="mt-10 border-t border-gray-200 pt-10">
                  <h3 className="font-serif text-lg font-bold text-primary uppercase tracking-wide">{t('product.perfectFor')}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {usageIdeas.map((idea, i) => (
                      <span key={i} className="rounded-full bg-cream border border-primary/20 px-3 py-1 text-sm font-medium text-primary">
                        {idea}
                      </span>
                    ))}
                  </div>
                </div>
              )
            }
          </div >
        </div >

        {/* Cross-Sell / Recommended Pairing */}
        {
          recommendedProduct && (
            <div className="mt-16 border-t border-gray-200 pt-16">
              <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">{t('product.completeExperience')}</h2>
              <div className="mx-auto max-w-sm rounded-xl bg-gray-50 p-6 shadow-sm border border-gray-100">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 mb-4">
                  {recommendedProduct.featuredImage && (
                    <img
                      src={recommendedProduct.featuredImage.url}
                      alt={recommendedProduct.featuredImage.altText || recommendedProduct.title}
                      className="h-full w-full object-cover object-center"
                    />
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{recommendedProduct.title}</h3>

                <button
                  onClick={() => window.location.href = `/products/${recommendedProduct.handle}`}
                  className="mt-4 w-full rounded-full bg-white border border-primary text-primary px-4 py-2 text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  {t('product.viewProduct')}
                </button>
              </div>
            </div>
          )
        }

        {/* Reviews Section */}
        {
          reviews && reviews.length > 0 && (
            <div className="mt-16 border-t border-gray-200 pt-16">
              <h2 className="text-center text-2xl font-bold text-gray-900">{t('product.reviews')}</h2>
              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review, i) => (
                  <div key={i} className="rounded-xl bg-gray-50 p-6 shadow-sm">
                    <div className="mb-4 flex text-yellow-400">★★★★★</div>
                    <blockquote className="text-gray-600 italic">"{review}"</blockquote>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      </div >

      {/* Sticky CTA for Mobile */}
      < StickyCTA
        title={displayTitle}
        price={selectedVariant?.price}
        available={selectedVariant?.availableForSale ?? false
        }
        isVisible={!isMainButtonVisible
        }
      >
        {
          isBundleWithConfig ? (
            <BundleAddToCartButton
              {...addToCartButtonProps}
              customProperties={bundleConfig}
            >
              {!allBundleItemsSelected
                ? t('product.selectHeatLevel')
                : selectedVariant?.availableForSale
                  ? t('product.addBundleToCart')
                  : t('product.soldOut')}
            </BundleAddToCartButton >
          ) : (
            <AddToCartButton
              {...addToCartButtonProps}
            >
              {selectedVariant?.availableForSale ? t('product.addToCart') : t('product.soldOut')}
            </AddToCartButton>
          )}
      </StickyCTA >

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
    </div >
  );
}

/* -------------------------------------------------------------------------- */
/*                               GRAPHQL FRAGMENTS                            */
/* -------------------------------------------------------------------------- */

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
      {namespace: "custom", key: "why_this_box_works"},
      {namespace: "custom", key: "recommended_product"},
      {namespace: "custom", key: "usage_moments"},
      {namespace: "custom", key: "bundle_items"},
      {namespace: "custom", key: "arabic_title"},
      {namespace: "custom", key: "arabic_description"},
      {namespace: "custom", key: "ingredients"},
      {namespace: "custom", key: "nutrition_facts"},
      {namespace: "custom", key: "serving_size"}
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

const RECOMMENDED_PRODUCT_QUERY = `#graphql
  query RecommendedProduct(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      featuredImage {
        url
        altText
        width
        height
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
` as const;

