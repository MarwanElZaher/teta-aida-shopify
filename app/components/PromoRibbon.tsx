import { useLocation } from 'react-router';
import { SHOW_PROMO_RIBBON } from '~/lib/featureFlags';
import { OFFER, isCheesePath, isOfferActive } from '~/lib/offers';
import { useTranslation } from '~/lib/translations';

// How many times the message repeats in each half of the loop. Enough to be
// wider than very wide screens, so the scroll never shows a gap.
const REPEATS = 8;

/**
 * Continuously scrolling news ribbon shown at the top of every page's hero
 * (rendered once in PageLayout). Arabic scrolls left-to-right so the sentence
 * enters from its start; English scrolls right-to-left.
 */
export function PromoRibbon() {
  const { t, isRtl } = useTranslation();
  const { pathname } = useLocation();
  // The 3 + 1 offer wins while it's live (except on cheese pages, which it
  // doesn't cover); otherwise the White Friday text, if on.
  const key = isOfferActive(OFFER)
    ? isCheesePath(pathname)
      ? null
      : 'offer.ribbon'
    : SHOW_PROMO_RIBBON
      ? 'promo.ribbon'
      : null;
  if (!key) return null;

  const text = t(key);
  // The visual track is aria-hidden; screen readers get the single sr-only copy.
  const group = () => (
    <div className="promo-ribbon__group">
      {Array.from({ length: REPEATS }, (_, i) => (
        <span className="promo-ribbon__item" key={i}>
          {text}
          <span className="promo-ribbon__sep" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="promo-ribbon" dir={isRtl ? 'rtl' : 'ltr'}>
      <p className="sr-only">{text}</p>
      <div
        className={`promo-ribbon__track${isRtl ? ' promo-ribbon__track--rtl' : ''}`}
        aria-hidden="true"
      >
        {group()}
        {group()}
      </div>
    </div>
  );
}
