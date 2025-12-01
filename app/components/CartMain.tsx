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
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div aria-labelledby="cart-lines">
          <ul className="space-y-4">
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
      </div>
      {cartHasItems && <CartSummary cart={cart} layout={layout} />}
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
    <div hidden={hidden} className="flex flex-col items-center justify-center h-full px-6 text-center gap-4">
      <p className="text-lg text-dark/70 mb-6">
        {t('cart.empty')}
      </p>
      <Link
        to={`${locale.pathPrefix}/collections/all`}
        onClick={close}
        prefetch="viewport"
        className="btn-primary"
      >
        {t('cart.continueShopping')} →
      </Link>
    </div>
  );
}
