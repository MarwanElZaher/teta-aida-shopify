import { Analytics, getShopAnalytics, useNonce } from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import type { Route } from './+types/root';
import favicon from '~/assets/favicon.jpg';
import { FOOTER_QUERY, HEADER_QUERY } from '~/lib/fragments';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import { PageLayout } from './components/PageLayout';
import { MetaPixel, FALLBACK_META_PIXEL_ID } from './components/MetaPixel';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    { rel: 'icon', type: 'image/jpeg', href: favicon },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap',
    },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const { storefront, env } = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    publicFacebookPixelId: env.PUBLIC_FACEBOOK_PIXEL_ID || FALLBACK_META_PIXEL_ID,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    locale: args.context.storefront.i18n,
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context }: Route.LoaderArgs) {
  const { storefront } = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu', // Adjust to your header menu handle
        language: storefront.i18n.language,
        country: storefront.i18n.country,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return { header };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: Route.LoaderArgs) {
  const { storefront, customerAccount, cart } = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

export function Layout({ children, language = 'EN' }: { children?: React.ReactNode; language?: string }) {
  const nonce = useNonce();
  const isRtl = language === 'AR';

  return (
    <html lang={language.toLowerCase()} dir={isRtl ? 'rtl' : 'ltr'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
      // Track all visitors. Without this, Hydrogen defaults canTrack to
      // window.Shopify.customerPrivacy.analyticsProcessingAllowed(), which is
      // false on this store (withPrivacyBanner:false, no consent collected) —
      // that no-ops publish() and silently kills the ENTIRE analytics bus
      // (no Shopify session tracking, no product_viewed/add_to_cart events).
      // The store already tracks every visitor via GA4/TikTok; this matches that.
      // NOTE: if selling into GDPR/CCPA regions later, replace with a real
      // consent-aware function instead of always-true.
      canTrack={() => true}
    >
      <Layout language={data.consent.language}>
        <MetaPixel pixelId={data.publicFacebookPixelId} />
        <PageLayout {...data}>
          <Outlet />
        </PageLayout>
      </Layout>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const rootData = useRouteLoaderData<RootLoader>('root');
  const nonce = useNonce();

  let errorMessage = 'Unknown error';
  let errorStatus = 500;
  let heading = 'Something went wrong';
  let description = 'We encountered an unexpected error. Please try again later.';

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  // Customize messages based on error status
  if (errorStatus === 404) {
    heading = 'Page Not Found';
    description = "The page you're looking for doesn't exist or has been moved.";
  } else if (errorStatus === 500) {
    heading = 'Server Error';
    description = "Something went wrong on our end. We're working to fix it.";
  }

  // Determine language and RTL
  const language = rootData?.locale?.language || 'EN';
  const isRtl = language === 'AR';

  // Localized content
  const content = language === 'AR' ? {
    heading: errorStatus === 404 ? 'الصفحة غير موجودة' : 'خطأ في الخادم',
    description: errorStatus === 404
      ? 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
      : 'حدث خطأ من جانبنا. نحن نعمل على إصلاحه.',
    backHome: 'العودة للرئيسية',
    shopNow: 'تسوّق الآن',
    brandName: 'تيتا عايدة',
  } : {
    heading,
    description,
    backHome: 'Back to Home',
    shopNow: 'Shop Now',
    brandName: 'Teta Aida',
  };

  return (
    <html lang={language.toLowerCase()} dir={isRtl ? 'rtl' : 'ltr'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{errorStatus} - {content.brandName}</title>
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-h-screen bg-cream flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center space-y-8">
            {/* Error Code */}
            <div className="space-y-4">
              <h1 className="font-serif text-9xl md:text-[12rem] text-primary/20 font-bold leading-none">
                {errorStatus}
              </h1>
              <h2 className="font-serif text-3xl md:text-5xl text-primary">
                {content.heading}
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-dark/70 max-w-md mx-auto">
              {content.description}
            </p>

            {/* Decorative Element */}
            <div className="flex items-center justify-center gap-4 py-8">
              <div className="h-px w-16 bg-primary/20"></div>
              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
              <div className="h-px w-16 bg-primary/20"></div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={isRtl ? '/ar' : '/'}
                className="btn-primary sm:w-auto px-10"
              >
                {content.backHome}
              </a>
              <a
                href={isRtl ? '/ar/collections/all' : '/collections/all'}
                className="btn-secondary sm:w-auto px-10"
              >
                {content.shopNow}
              </a>
            </div>

            {/* Brand Footer */}
            <div className="pt-12">
              <p className="font-serif text-2xl text-secondary">
                {content.brandName}
              </p>
              <p className="text-sm text-dark/50 mt-2">
                {isRtl ? 'مخللات فاخرة مصنوعة يدويًا' : 'Premium Artisanal Pickles'}
              </p>
            </div>
          </div>
        </div>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}
