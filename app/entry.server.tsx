import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    // Meta (Facebook) Pixel — fbevents.js and its beacons.
    // Note: scriptSrc/imgSrc are not merged with Hydrogen's defaultSrc
    // fallback, so the default sources ('self', Shopify CDNs) are repeated
    // here; the CSP nonce is appended to scriptSrc automatically.
    scriptSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://connect.facebook.net',
    ],
    imgSrc: [
      "'self'",
      'data:',
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://www.facebook.com',
    ],
    // connectSrc IS merged with Hydrogen's defaults (Shopify domains).
    connectSrc: ['https://www.facebook.com'],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        // Preserve an already-resolved client status (e.g. a 404 thrown from a
        // loader). Only escalate to 500 for genuine server errors, so
        // "not found" pages return 404 instead of being clobbered to 500.
        if (responseStatusCode < 400) {
          responseStatusCode = 500;
        }
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
