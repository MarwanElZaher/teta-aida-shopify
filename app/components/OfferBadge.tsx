import { OFFER, isOfferActive, isOfferProduct } from '~/lib/offers';
import { useTranslation } from '~/lib/translations';

type Collections = { nodes: ReadonlyArray<{ handle: string }> } | null | undefined;

function useShowsOffer(collections: Collections): boolean {
  return (
    isOfferActive(OFFER) &&
    isOfferProduct(OFFER, collections?.nodes?.map((n) => n.handle) ?? [])
  );
}

/** Gold "3 + 1 free" pill for product cards of jars in the offer. */
export function OfferBadge({ collections }: { collections?: Collections }) {
  const { t } = useTranslation();
  if (!useShowsOffer(collections)) return null;
  return (
    <span className="absolute top-3 start-3 z-10 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-white shadow">
      {t('offer.badge')}
    </span>
  );
}

/** One-line explanation above "Add to cart" on jar product pages. */
export function OfferNote({ collections }: { collections?: Collections }) {
  const { t } = useTranslation();
  if (!useShowsOffer(collections)) return null;
  return (
    <p className="mb-4 rounded-xl bg-cream px-4 py-3 text-sm font-medium text-primary">
      🎁 {t('offer.note')}
    </p>
  );
}
