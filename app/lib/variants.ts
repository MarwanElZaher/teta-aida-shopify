import { useLocation } from 'react-router';
import type { SelectedOption } from '@shopify/hydrogen/storefront-api-types';
import { useMemo } from 'react';
import { useTranslation } from '~/lib/translations';

export function useVariantUrl(
  handle: string,
  selectedOptions?: SelectedOption[],
) {
  const { pathname } = useLocation();
  const { locale } = useTranslation();

  return useMemo(() => {
    return getVariantUrl({
      handle,
      pathname,
      searchParams: new URLSearchParams(),
      selectedOptions,
      pathPrefix: locale.pathPrefix,
    });
  }, [handle, selectedOptions, pathname, locale.pathPrefix]);
}

export function getVariantUrl({
  handle,
  pathname,
  searchParams,
  selectedOptions,
  pathPrefix,
}: {
  handle: string;
  pathname: string;
  searchParams: URLSearchParams;
  selectedOptions?: SelectedOption[];
  pathPrefix?: string;
}) {
  const path = pathPrefix
    ? `${pathPrefix}/products/${handle}`
    : `/products/${handle}`;

  selectedOptions?.forEach((option) => {
    searchParams.set(option.name, option.value);
  });

  const searchString = searchParams.toString();

  return path + (searchString ? '?' + searchParams.toString() : '');
}
