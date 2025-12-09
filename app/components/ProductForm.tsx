import { Link, useNavigate } from 'react-router';
import { type MappedProductOptions } from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import { AddToCartButton } from './AddToCartButton';
import { useAside } from './Aside';
import type { ProductFragment } from 'storefrontapi.generated';
import { useTranslation } from '~/lib/translations';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const { open } = useAside();
  const { t } = useTranslation();

  const translateOptionName = (name: string) => {
    if (name === 'Heat Level') return t('product.heatLevel');
    return name;
  };

  const translateOptionValue = (value: string, optionName: string) => {
    if (optionName === 'Heat Level') {
      const key = value.toLowerCase();
      if (key === 'mild') return t('product.heatLevels.mild');
      if (key === 'normal') return t('product.heatLevels.normal');
      if (key === 'spicy') return t('product.heatLevels.spicy');
    }
    return value;
  };

  return (
    <div className="product-form">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options mb-6" key={option.name}>
            <h5 className="font-serif text-sm font-bold text-primary mb-3 uppercase tracking-wide">{translateOptionName(option.name)}</h5>
            <div className="product-options-grid flex flex-wrap gap-3">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const translatedName = translateOptionValue(name, option.name);

                const commonClasses = `
                  px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border
                  ${selected
                    ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                    : 'bg-white text-dark/70 border-gray-200 hover:border-secondary hover:text-secondary'}
                  ${!available ? 'opacity-50 cursor-not-allowed' : ''}
                `;

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={commonClasses}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <ProductOptionSwatch swatch={swatch} name={translatedName} />
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      className={`${commonClasses} ${exists && !selected ? ' cursor-pointer' : ''}`}
                      key={option.name + name}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={translatedName} />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
              {
                merchandiseId: selectedVariant.id,
                quantity: 1,
                selectedVariant,
              },
            ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? t('product.addToCart') : t('product.soldOut')}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}
