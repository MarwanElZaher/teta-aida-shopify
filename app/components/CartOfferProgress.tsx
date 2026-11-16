import type { ReactNode } from 'react';
import { OFFER, offerProgressKey, type OfferProgress } from '~/lib/offers';
import { useTranslation } from '~/lib/translations';

/**
 * "Add 1 more jar and the 4th is free" bar at the top of the cart.
 * Purely a reflection of the cart: Shopify decides which jar is free.
 */
export function CartOfferProgress({
  progress,
  children,
}: {
  progress: OfferProgress;
  children?: ReactNode;
}) {
  const { t } = useTranslation();
  const key = offerProgressKey(progress);
  if (!key) return null;

  const group = OFFER.buyQty + OFFER.getQty;
  const unlocked = progress.state === 'unlocked';
  const filled = unlocked ? group : group - progress.needed;

  return (
    <div
      className={`mb-4 rounded-xl border p-3 ${unlocked ? 'border-secondary bg-secondary/10' : 'border-gray-200 bg-cream/40'}`}
    >
      <p role="status" className="text-sm font-bold text-primary">
        {t(key)}
      </p>
      <div className="mt-2 flex gap-1" aria-hidden="true">
        {Array.from({ length: group }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < filled ? (unlocked ? 'bg-secondary' : 'bg-primary') : 'bg-gray-200'}`}
          />
        ))}
      </div>
      {children}
    </div>
  );
}
