import { useOptimisticCart } from '@shopify/hydrogen';
import { Link } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { CartLineItem } from '~/components/CartLineItem';
import { CartSummary } from './CartSummary';
import { useTranslation } from '~/lib/translations';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({ layout, cart: originalCart }: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;


  return (
    <div className="flex flex-col h-full">
      <CartEmpty hidden={linesCount} layout={layout} />
      {/* Cart items with scrolling */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
        <div aria-labelledby="cart-lines">
          <ul className="space-y-4 pb-4">
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
      </div>
      {/* Cart summary - sticky at bottom */}
      {cartHasItems && (
        <div className="flex-shrink-0 border-t border-gray-200 bg-white">
          <CartSummary cart={cart} layout={layout} />
        </div>
      )}
    </div>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const { close } = useAside();
  const { t, locale } = useTranslation();
  return (
    <div hidden={hidden} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center gap-6">
      {/* Cart Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-24 h-24 text-primary/30"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>

      {/* Message */}
      <p className="text-lg text-dark/70">
        {t('cart.empty')}
      </p>

      {/* Continue Shopping Button */}
      <Link
        to={`${locale.pathPrefix}/collections/all`}
        onClick={close}
        prefetch="viewport"
        style={{ color: 'white' }}
        className="inline-block px-8 py-3 bg-primary text-white font-bold uppercase tracking-wider rounded-full hover:bg-[#143d24] transition-colors"
      >
        {t('cart.continueShopping')} →
      </Link>
    </div>
  );
}

