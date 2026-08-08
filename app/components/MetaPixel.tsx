import { useEffect, useRef } from 'react';
import { parseGid, useAnalytics, useNonce } from '@shopify/hydrogen';
import type {
  CartLineUpdatePayload,
  CollectionViewPayload,
  PageViewPayload,
  ProductViewPayload,
  SearchViewPayload,
} from '@shopify/hydrogen';

/**
 * Fallback Meta (Facebook) Pixel / dataset ID.
 * Prefer setting `PUBLIC_FACEBOOK_PIXEL_ID` in the Oxygen/Hydrogen environment;
 * this constant is only used when that variable is not configured.
 */
export const FALLBACK_META_PIXEL_ID = '32924156857228644';

const FBEVENTS_SRC = 'https://connect.facebook.net/en_US/fbevents.js';

type FbqArgs = unknown[];

interface FbqFunction {
  (...args: FbqArgs): void;
  callMethod?: (...args: FbqArgs) => void;
  queue: FbqArgs[];
  push: FbqFunction;
  loaded: boolean;
  version: string;
}

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

/**
 * Generates a unique event ID for Meta event deduplication.
 * The browser pixel sends this as `eventID`; if a server-side Conversions API
 * event is ever sent for the same action with the same `event_id`, Meta
 * de-duplicates the pair instead of double counting.
 */
function generateEventId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

/**
 * Lazily injects the Meta Pixel (fbevents.js) exactly once and initializes it.
 *
 * Instead of injecting Meta's inline bootstrap snippet as a string (which would
 * require an inline-script CSP exemption), the equivalent `fbq` stub is created
 * directly here and only the external fbevents.js script is appended, carrying
 * the app's CSP nonce. `https://connect.facebook.net` is allow-listed in
 * `scriptSrc` in app/entry.server.tsx.
 */
let pixelInitialized = false;

function ensurePixel(pixelId: string, nonce?: string): FbqFunction {
  if (!window.fbq) {
    const fbq = function (...args: FbqArgs) {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
      } else {
        fbq.queue.push(args);
      }
    } as FbqFunction;

    fbq.queue = [];
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';

    window.fbq = fbq;
    if (!window._fbq) window._fbq = fbq;

    if (!document.querySelector(`script[src="${FBEVENTS_SRC}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = FBEVENTS_SRC;
      if (nonce) script.nonce = nonce;
      document.head.appendChild(script);
    }
  }

  if (!pixelInitialized) {
    window.fbq('init', pixelId);
    pixelInitialized = true;
  }

  return window.fbq;
}

/** Extracts the numeric ID from a Shopify GID (e.g. gid://shopify/ProductVariant/123 -> "123"). */
function contentId(gid?: string): string | undefined {
  if (!gid) return undefined;
  const { id } = parseGid(gid);
  return id || gid;
}

/**
 * Meta (Facebook) Pixel integration for the Hydrogen storefront.
 *
 * Subscribes to Hydrogen Analytics events (published by `<Analytics.Provider>`
 * and the `<Analytics.ProductView/CollectionView/SearchView>` components already
 * present in the routes) and forwards them to the Meta Pixel as standard events:
 *
 *   page_viewed           -> PageView (initial load + client-side route changes)
 *   product_viewed        -> ViewContent
 *   product_added_to_cart -> AddToCart
 *   collection_viewed     -> ViewCategory (custom event)
 *   search_viewed         -> Search
 *
 * IMPORTANT: Purchase is intentionally NOT fired here. Checkout happens on
 * Shopify's checkout domain, where the Facebook & Instagram sales channel
 * reports Purchase (and checkout events) server-side via the Conversions API.
 * Firing Purchase from the storefront as well would double count conversions.
 *
 * Must be rendered inside `<Analytics.Provider>` (see app/root.tsx).
 */
export function MetaPixel({ pixelId = FALLBACK_META_PIXEL_ID }: { pixelId?: string }) {
  const nonce = useNonce();
  const analytics = useAnalytics();
  const { subscribe, register } = analytics;

  // Keep a live reference so event handlers (subscribed once) always read the
  // current consent state instead of a stale closure.
  const analyticsRef = useRef(analytics);
  analyticsRef.current = analytics;

  // Register with the Analytics provider so it waits for this integration
  // before publishing queued events.
  const { ready } = register('MetaPixel');

  const subscribed = useRef(false);

  useEffect(() => {
    if (subscribed.current) return;
    subscribed.current = true;

    /**
     * Consent gate: only load the pixel and send events when marketing tracking
     * is allowed. Hydrogen's Analytics provider already suppresses publishing
     * until the Customer Privacy API reports analytics consent; this adds the
     * marketing-specific check appropriate for an ad pixel.
     */
    const track = (fire: (fbq: FbqFunction, eventID: string) => void) => {
      const { canTrack, customerPrivacy } = analyticsRef.current;
      // This store runs with withPrivacyBanner:false (no consent banner), so
      // Hydrogen's canTrack() is the authoritative signal (returns true when no
      // banner is configured). Respect an EXPLICIT marketing opt-out if the
      // Customer Privacy API reports one, but do not block when it is simply
      // undefined (which is the case with no banner) — otherwise the pixel never
      // fires, exactly like GA4/TikTok which track all visitors here.
      const marketing = customerPrivacy?.marketingAllowed?.();
      const allowed = marketing === false ? false : canTrack();
      if (!allowed) return;
      fire(ensurePixel(pixelId, nonce), generateEventId());
    };

    subscribe('page_viewed', (_payload: PageViewPayload) => {
      track((fbq, eventID) => {
        fbq('track', 'PageView', {}, { eventID });
      });
    });

    subscribe('product_viewed', (payload: ProductViewPayload) => {
      track((fbq, eventID) => {
        const products = payload.products ?? [];
        if (!products.length) return;
        const value = products.reduce(
          (sum, product) =>
            sum + Number(product.price || 0) * (product.quantity || 1),
          0,
        );
        fbq(
          'track',
          'ViewContent',
          {
            content_ids: products.map(
              (product) => contentId(product.variantId) ?? contentId(product.id),
            ),
            content_type: 'product',
            content_name: products[0]?.title,
            value,
            currency: payload.shop?.currency,
          },
          { eventID },
        );
      });
    });

    subscribe('product_added_to_cart', (payload: CartLineUpdatePayload) => {
      track((fbq, eventID) => {
        const line = payload.currentLine;
        if (!line) return;
        const quantityAdded = Math.max(
          line.quantity - (payload.prevLine?.quantity ?? 0),
          1,
        );
        const unitPrice = Number(line.merchandise.price.amount || 0);
        fbq(
          'track',
          'AddToCart',
          {
            content_ids: [contentId(line.merchandise.id)],
            content_type: 'product',
            content_name: line.merchandise.product?.title,
            value: unitPrice * quantityAdded,
            currency:
              line.merchandise.price.currencyCode ?? payload.shop?.currency,
            num_items: quantityAdded,
          },
          { eventID },
        );
      });
    });

    subscribe('collection_viewed', (payload: CollectionViewPayload) => {
      track((fbq, eventID) => {
        // ViewCategory is not a Meta standard event, so use trackCustom.
        fbq(
          'trackCustom',
          'ViewCategory',
          {
            content_name: payload.collection?.handle,
            content_category: payload.collection?.handle,
          },
          { eventID },
        );
      });
    });

    subscribe('search_viewed', (payload: SearchViewPayload) => {
      track((fbq, eventID) => {
        fbq(
          'track',
          'Search',
          { search_string: payload.searchTerm },
          { eventID },
        );
      });
    });

    ready();
  }, [pixelId, nonce, subscribe, ready]);

  return null;
}
