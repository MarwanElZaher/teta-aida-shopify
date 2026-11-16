import { Suspense } from 'react';
import { Await, Link, useRouteLoaderData } from 'react-router';
import { CartForm } from '@shopify/hydrogen';
import type { RootLoader } from '~/root';
import { useAside } from '~/components/Aside';
import { suggestOfferProducts, type OfferProduct } from '~/lib/offers';
import { useTranslation } from '~/lib/translations';
import { formatCurrency } from '~/lib/utils';

/**
 * Jars the customer hasn't added yet, shown while the cart is short of a
 * 3 + 1 group. With one jar to go the heading says "pick your free jar".
 * Jars with a heat-level choice link to their product page so the customer
 * can pick it; the rest add in one tap.
 */
export function CartGiftPicker({
  inCartHandles,
  needed,
}: {
  inCartHandles: readonly string[];
  needed: number;
}) {
  const data = useRouteLoaderData<RootLoader>('root');
  const { t } = useTranslation();
  if (!data?.offerProducts) return null;

  return (
    <Suspense fallback={null}>
      <Await resolve={data.offerProducts}>
        {(products) => {
          const picks = suggestOfferProducts(products ?? [], inCartHandles);
          if (picks.length === 0) return null;
          return (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-bold text-dark">
                {t(needed === 1 ? 'offer.giftTitle' : 'offer.giftTitleMore')}
              </p>
              {picks.map((product) => (
                <GiftRow key={product.id} product={product} />
              ))}
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}

function GiftRow({ product }: { product: OfferProduct }) {
  const { t, locale } = useTranslation();
  const { close } = useAside();
  const title = locale.language === 'AR' && product.titleAr ? product.titleAr : product.title;
  const buttonClass =
    'rounded-md bg-primary px-3 py-1 text-xs font-bold text-white hover:bg-[#143d24] transition-colors';

  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-secondary bg-white px-2 py-2">
      {product.imageUrl && (
        <img
          src={`${product.imageUrl}${product.imageUrl.includes('?') ? '&' : '?'}width=80`}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          className="h-10 w-10 flex-shrink-0 rounded object-contain bg-[#F0EFEB]"
        />
      )}
      <div className="min-w-0 flex-1 text-xs">
        <p className="truncate font-medium text-dark">{title}</p>
        <p className="text-dark/60">{formatCurrency(product.price, 'EGP', locale.language)}</p>
      </div>
      {product.hasOptions ? (
        <Link
          to={`${locale.pathPrefix}/products/${product.handle}`}
          onClick={close}
          className={buttonClass}
          style={{ color: 'white' }}
        >
          {t('offer.choose')}
        </Link>
      ) : (
        <CartForm
          route="/cart"
          action={CartForm.ACTIONS.LinesAdd}
          inputs={{ lines: [{ merchandiseId: product.variantId, quantity: 1 }] }}
        >
          {(fetcher) => (
            <button type="submit" disabled={fetcher.state !== 'idle'} className={`${buttonClass} disabled:opacity-60`}>
              {t('offer.add')}
            </button>
          )}
        </CartForm>
      )}
    </div>
  );
}
