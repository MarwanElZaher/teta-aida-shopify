import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { CartLayout } from '~/components/CartMain';
import { CartForm, type OptimisticCart } from '@shopify/hydrogen';
import { useEffect, useRef } from 'react';
import type { FetcherWithComponents } from 'react-router';
import { useTranslation } from '~/lib/translations';
import { formatCurrency } from '~/lib/utils';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

const DISCOUNT_FETCHER_KEY = 'cart-discount-codes';

/** Line price before discounts. Bundle-component lines have no subtotal, so use their total. */
function lineSubtotal(line: unknown): number {
  const cost = (line as { cost?: { subtotalAmount?: { amount?: string }; totalAmount?: { amount?: string } } })?.cost;
  return parseFloat(cost?.subtotalAmount?.amount ?? cost?.totalAmount?.amount ?? '0');
}

export function CartSummary({ cart }: CartSummaryProps) {
  const { t, locale } = useTranslation();
  const currency = cart?.cost?.subtotalAmount?.currencyCode;
  const money = (amount: number) =>
    currency ? formatCurrency(amount, currency, locale.language) : '-';

  // Line subtotals are before discounts; the cart subtotal is after them
  // (both line-level % codes and fixed-amount codes land there).
  const lines = cart?.lines?.nodes ?? [];
  const beforeDiscount = lines.reduce((sum, line) => sum + lineSubtotal(line), 0);
  const afterDiscount = parseFloat(cart?.cost?.subtotalAmount?.amount ?? '0');
  const savings = Math.max(0, Math.round((beforeDiscount - afterDiscount) * 100) / 100);

  return (
    <div aria-labelledby="cart-summary" className="border-t border-gray-200 px-6 py-6 bg-cream/30">
      <h4 className="font-serif text-lg font-bold text-primary mb-4 uppercase tracking-wide">{t('cart.title')}</h4>
      <dl className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <dt className="text-dark/70">{t('cart.subtotal')}</dt>
          <dd className={savings > 0 ? 'text-dark/50 line-through' : 'font-bold text-dark'}>
            {afterDiscount ? money(savings > 0 ? beforeDiscount : afterDiscount) : '-'}
          </dd>
        </div>
        {savings > 0 && (
          <>
            <div className="flex justify-between text-sm">
              <dt className="text-primary">{t('cart.discount')}</dt>
              <dd className="font-bold text-primary">−{money(savings)}</dd>
            </div>
            <div className="flex justify-between text-base border-t border-gray-200 pt-2">
              <dt className="font-bold text-dark">{t('cart.totalAfterDiscount')}</dt>
              <dd className="font-bold text-dark">{money(afterDiscount)}</dd>
            </div>
          </>
        )}
      </dl>
      <CartDiscounts discountCodes={cart?.discountCodes} />
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

function CartCheckoutActions({ checkoutUrl }: { checkoutUrl?: string }) {
  const { t, locale } = useTranslation();
  if (!checkoutUrl) return null;

  let finalCheckoutUrl = checkoutUrl;
  if (locale.language === 'AR') {
    const separator = finalCheckoutUrl.includes('?') ? '&' : '?';
    finalCheckoutUrl = `${finalCheckoutUrl}${separator}locale=ar`;
  }

  return (
    <div className="mt-6">
      <a
        href={finalCheckoutUrl}
        target="_self"
        className="block w-full h-[50px] rounded-[14px] bg-primary text-white font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:bg-[#143d24] hover:shadow-lg flex items-center justify-center"
        style={{
          color: 'white',
        }}
      >
        {t('cart.checkout')} →
      </a>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const { t } = useTranslation();
  const applied = discountCodes?.filter((d) => d.applicable).map((d) => d.code) ?? [];
  const invalid = discountCodes?.filter((d) => !d.applicable).map((d) => d.code) ?? [];
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-3 space-y-2">
      {/* Applied codes: one chip each, removing a code keeps the others */}
      {applied.map((code) => (
        <UpdateDiscountForm key={code} discountCodes={applied.filter((c) => c !== code)}>
          {() => (
            <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2 text-sm">
              <span className="text-primary font-bold">
                ✓ {t('cart.discountApplied')}: <code className="font-mono">{code}</code>
              </span>
              <button type="submit" className="text-xs text-dark/60 underline hover:text-primary">
                {t('cart.remove')}
              </button>
            </div>
          )}
        </UpdateDiscountForm>
      ))}

      {/* Codes Shopify rejected for this cart: say so instead of failing silently */}
      {invalid.map((code) => (
        <UpdateDiscountForm key={`invalid-${code}`} discountCodes={applied}>
          {() => (
            <div role="alert" className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              <span>
                <code className="font-mono">{code}</code> — {t('cart.discountInvalid')}
              </span>
              <button type="submit" className="text-xs underline">
                {t('cart.remove')}
              </button>
            </div>
          )}
        </UpdateDiscountForm>
      ))}

      {/* Enter a new code; existing valid codes are kept */}
      <UpdateDiscountForm discountCodes={applied} fetcherKey={DISCOUNT_FETCHER_KEY}>
        {(fetcher) => (
          <DiscountInput fetcher={fetcher} inputRef={inputRef} />
        )}
      </UpdateDiscountForm>
    </div>
  );
}

function DiscountInput({
  fetcher,
  inputRef,
}: {
  fetcher: FetcherWithComponents<unknown>;
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  const { t } = useTranslation();
  const busy = fetcher.state !== 'idle';

  // Clear the field once the cart has been updated.
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [fetcher.state, fetcher.data, inputRef]);

  return (
    <div className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        name="discountCode"
        required
        autoComplete="off"
        placeholder={t('cart.discountCode')}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
      />
      <button
        type="submit"
        disabled={busy}
        className="px-4 py-2 bg-secondary text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#b8941f] transition-colors disabled:opacity-60"
      >
        {busy ? t('cart.applying') : t('cart.apply')}
      </button>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  fetcherKey,
  children,
}: {
  discountCodes?: string[];
  fetcherKey?: string;
  children: (fetcher: FetcherWithComponents<unknown>) => React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      fetcherKey={fetcherKey}
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}
