import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import type { CartLayout } from '~/components/CartMain';
import { CartForm, Image, type OptimisticCartLine } from '@shopify/hydrogen';
import { useVariantUrl } from '~/lib/variants';
import { Link } from 'react-router';
import { ProductPrice } from './ProductPrice';
import { useAside } from './Aside';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useTranslation } from '~/lib/translations';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const { id, merchandise, attributes } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const { close } = useAside();

  // Parse bundle customizations from attributes
  const bundleCustomizations = attributes?.filter(attr =>
    attr.key.includes('_') && attr.key.includes('Heat Level')
  ).map(attr => {
    // Extract item name from key (e.g., "Tuffaahy Olives_0 Heat Level" -> "Tuffaahy Olives")
    const itemName = attr.key.replace(/_\d+$/, '').replace(' Heat Level', '');
    return {
      name: itemName,
      value: attr.value
    };
  }) || [];

  return (
    <li key={id} className="flex gap-4 border-b border-gray-200 pb-4">
      {image && (
        <Image
          alt={title}
          aspectRatio="1/1"
          data={image}
          height={100}
          loading="lazy"
          width={100}
          className="rounded-lg object-cover"
        />
      )}

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') {
                close();
              }
            }}
            className="hover:text-secondary transition-colors"
          >
            <p className="font-serif font-bold text-dark mb-1">
              {product.title}
            </p>
          </Link>
          <div className="text-secondary font-bold mb-2">
            <ProductPrice price={line?.cost?.totalAmount} />
          </div>

          {/* Display variant options */}
          {selectedOptions.length > 0 && (
            <ul className="text-xs text-dark/60 space-y-1 mb-2">
              {selectedOptions.map((option) => (
                <li key={option.name}>
                  {option.name}: {option.value}
                </li>
              ))}
            </ul>
          )}

          {/* Display bundle customizations */}
          {bundleCustomizations.length > 0 && (
            <div className="mt-2 p-2 bg-cream/50 rounded-lg border border-secondary/10">
              <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">Bundle Configuration:</p>
              <ul className="text-xs text-dark/70 space-y-0.5">
                {bundleCustomizations.map((custom, index) => (
                  <li key={index}>
                    <span className="font-medium">{custom.name}:</span> {custom.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({ line }: { line: CartLine }) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const { id: lineId, quantity, isOptimistic } = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  if (isOptimistic) {
    return (
      <div className="flex items-center gap-2 mt-2">
        <span className="text-sm text-dark/70">Qty: {quantity}</span>
        <div className="flex items-center gap-1">
          <button
            aria-label="Decrease quantity"
            disabled
            className="w-7 h-7 rounded-full border border-gray-300 text-gray-300 cursor-not-allowed flex items-center justify-center text-sm font-bold"
          >
            −
          </button>
          <button
            aria-label="Increase quantity"
            disabled
            className="w-7 h-7 rounded-full border border-gray-300 text-gray-300 cursor-not-allowed flex items-center justify-center text-sm font-bold"
          >
            +
          </button>
          <button
            disabled
            className="text-xs text-dark/30 cursor-not-allowed ml-2 underline"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-sm text-dark/70">Qty: {quantity}</span>
      <div className="flex items-center gap-1">
        <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            name="decrease-quantity"
            value={prevQuantity}
            className="w-7 h-7 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold"
          >
            −
          </button>
        </CartLineUpdateButton>
        <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
          <button
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            className="w-7 h-7 rounded-full border border-gray-300 hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold"
          >
            +
          </button>
        </CartLineUpdateButton>
        <CartLineRemoveButton lineIds={[lineId]} disabled={false} />
      </div>
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: CartLine['id'][];
  disabled: boolean;
}) {
  const { t } = useTranslation();
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      <button
        disabled={disabled}
        type="submit"
        className="text-sm text-dark/60 hover:text-primary transition-colors underline disabled:opacity-30 disabled:cursor-not-allowed ml-2"
      >
        {t('cart.remove')}
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines }}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @param lineIds - line ids affected by the update
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
