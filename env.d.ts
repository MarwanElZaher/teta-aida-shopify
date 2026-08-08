/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  interface Env {
    /** Meta (Facebook) Pixel / dataset ID used by app/components/MetaPixel.tsx */
    PUBLIC_FACEBOOK_PIXEL_ID?: string;
  }
}
