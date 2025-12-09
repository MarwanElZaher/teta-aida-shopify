import { Link, useFetcher, type Fetcher } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import React, { useRef, useEffect } from 'react';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
  type PredictiveSearchReturn,
} from '~/lib/search';
import { useAside } from './Aside';
import { useTranslation } from '~/lib/translations';

type PredictiveSearchItems = PredictiveSearchReturn['result']['items'];

type UsePredictiveSearchReturn = {
  term: React.MutableRefObject<string>;
  total: number;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  items: PredictiveSearchItems;
  fetcher: Fetcher<PredictiveSearchReturn>;
};

type SearchResultsPredictiveArgs = Pick<
  UsePredictiveSearchReturn,
  'term' | 'total' | 'inputRef' | 'items'
> & {
  state: Fetcher['state'];
  closeSearch: () => void;
};

type PartialPredictiveSearchResult<
  ItemType extends keyof PredictiveSearchItems,
  ExtraProps extends keyof SearchResultsPredictiveArgs = 'term' | 'closeSearch',
> = Pick<PredictiveSearchItems, ItemType> &
  Pick<SearchResultsPredictiveArgs, ExtraProps>;

type SearchResultsPredictiveProps = {
  children: (args: SearchResultsPredictiveArgs) => React.ReactNode;
};

/**
 * Component that renders predictive search results
 */
export function SearchResultsPredictive({
  children,
}: SearchResultsPredictiveProps) {
  const aside = useAside();
  const { term, inputRef, fetcher, total, items } = usePredictiveSearch();

  /*
   * Utility that resets the search input
   */
  function resetInput() {
    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.value = '';
    }
  }

  /**
   * Utility that resets the search input and closes the search aside
   */
  function closeSearch() {
    resetInput();
    aside.close();
  }

  return children({
    items,
    closeSearch,
    inputRef,
    state: fetcher.state,
    term,
    total,
  });
}

SearchResultsPredictive.Articles = SearchResultsPredictiveArticles;
SearchResultsPredictive.Collections = SearchResultsPredictiveCollections;
SearchResultsPredictive.Pages = SearchResultsPredictivePages;
SearchResultsPredictive.Products = SearchResultsPredictiveProducts;
SearchResultsPredictive.Queries = SearchResultsPredictiveQueries;
SearchResultsPredictive.Empty = SearchResultsPredictiveEmpty;

function SearchResultsPredictiveArticles({
  term,
  articles,
  closeSearch,
}: PartialPredictiveSearchResult<'articles'>) {
  const { t } = useTranslation();
  if (!articles.length) return null;

  return (
    <div className="predictive-search-result" key="articles">
      <h5 className="font-serif font-bold text-primary text-sm uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">{t('search.articles')}</h5>
      <ul className="space-y-2">
        {articles.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.blog.handle}/${article.handle}`,
            trackingParams: article.trackingParameters,
            term: term.current ?? '',
          });

          return (
            <li className="predictive-search-result-item group" key={article.id}>
              <Link onClick={closeSearch} to={articleUrl} className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream/50 transition-colors">
                {article.image?.url && (
                  <Image
                    alt={article.image.altText ?? ''}
                    src={article.image.url}
                    width={50}
                    height={50}
                    className="rounded-md object-cover w-10 h-10 border border-gray-100"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="block font-medium text-dark group-hover:text-primary truncate transition-colors">{article.title}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveCollections({
  term,
  collections,
  closeSearch,
}: PartialPredictiveSearchResult<'collections'>) {
  const { t } = useTranslation();
  if (!collections.length) return null;

  return (
    <div className="predictive-search-result" key="collections">
      <h5 className="font-serif font-bold text-primary text-sm uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">{t('search.collections')}</h5>
      <ul className="space-y-2">
        {collections.map((collection) => {
          const collectionUrl = urlWithTrackingParams({
            baseUrl: `/collections/${collection.handle}`,
            trackingParams: collection.trackingParameters,
            term: term.current,
          });

          return (
            <li className="predictive-search-result-item group" key={collection.id}>
              <Link onClick={closeSearch} to={collectionUrl} className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream/50 transition-colors">
                {collection.image?.url && (
                  <Image
                    alt={collection.image.altText ?? ''}
                    src={collection.image.url}
                    width={50}
                    height={50}
                    className="rounded-md object-cover w-10 h-10 border border-gray-100"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="block font-medium text-dark group-hover:text-primary truncate transition-colors">{collection.title}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictivePages({
  term,
  pages,
  closeSearch,
}: PartialPredictiveSearchResult<'pages'>) {
  const { t } = useTranslation();
  if (!pages.length) return null;

  return (
    <div className="predictive-search-result" key="pages">
      <h5 className="font-serif font-bold text-primary text-sm uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">{t('search.pages')}</h5>
      <ul className="space-y-2">
        {pages.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term: term.current,
          });

          return (
            <li className="predictive-search-result-item group" key={page.id}>
              <Link onClick={closeSearch} to={pageUrl} className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <span className="block font-medium text-dark group-hover:text-primary truncate transition-colors">{page.title}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveProducts({
  term,
  products,
  closeSearch,
}: PartialPredictiveSearchResult<'products'>) {
  const { t } = useTranslation();
  if (!products.length) return null;

  return (
    <div className="predictive-search-result" key="products">
      <h5 className="font-serif font-bold text-primary text-sm uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">{t('search.products')}</h5>
      <ul className="space-y-2">
        {products.map((product) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term: term.current,
          });

          const price = product?.selectedOrFirstAvailableVariant?.price;
          const image = product?.selectedOrFirstAvailableVariant?.image;
          return (
            <li className="predictive-search-result-item group" key={product.id}>
              <Link to={productUrl} onClick={closeSearch} className="flex items-center gap-4 p-2 rounded-lg hover:bg-cream/50 transition-colors">
                {image && (
                  <Image
                    alt={image.altText ?? ''}
                    src={image.url}
                    width={60}
                    height={60}
                    className="rounded-md object-cover w-14 h-14 border border-gray-100"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-bold text-dark group-hover:text-primary truncate transition-colors">{product.title}</p>
                  <small className="block text-secondary font-bold mt-1">{price && <Money data={price} />}</small>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveQueries({
  queries,
  queriesDatalistId,
}: PartialPredictiveSearchResult<'queries', never> & {
  queriesDatalistId: string;
}) {
  if (!queries.length) return null;

  return (
    <datalist id={queriesDatalistId}>
      {queries.map((suggestion) => {
        if (!suggestion) return null;

        return <option key={suggestion.text} value={suggestion.text} />;
      })}
    </datalist>
  );
}

function SearchResultsPredictiveEmpty({
  term,
}: {
  term: React.MutableRefObject<string>;
}) {
  const { t } = useTranslation();
  if (!term.current) {
    return null;
  }

  return (
    <div className="text-center py-8">
      <p className="text-dark/60">
        {t('search.noResults')} <q className="font-bold text-dark">{term.current}</q>
      </p>
    </div>
  );
}

/**
 * Hook that returns the predictive search results and fetcher and input ref.
 * @example
 * '''ts
 * const { items, total, inputRef, term, fetcher } = usePredictiveSearch();
 * '''
 **/
function usePredictiveSearch(): UsePredictiveSearchReturn {
  const fetcher = useFetcher<PredictiveSearchReturn>({ key: 'search' });
  const term = useRef<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (fetcher?.state === 'loading') {
    term.current = String(fetcher.formData?.get('q') || '');
  }

  // capture the search input element as a ref
  useEffect(() => {
    if (!inputRef.current) {
      inputRef.current = document.querySelector('input[type="search"]');
    }
  }, []);

  const { items, total } =
    fetcher?.data?.result ?? getEmptyPredictiveSearchResult();

  return { items, total, inputRef, term, fetcher };
}
