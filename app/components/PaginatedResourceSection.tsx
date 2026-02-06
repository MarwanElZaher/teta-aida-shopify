import * as React from 'react';
import { Pagination } from '@shopify/hydrogen';
import { useTranslation } from '~/lib/translations';

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{ node: NodesType; index: number }>;
  resourcesClassName?: string;
}) {
  const { t } = useTranslation();
  const nextLinkRef = React.useRef<HTMLAnchorElement>(null);
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  React.useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && nextLinkRef.current) {
        nextLinkRef.current.click();
      }
    });

    if (nextLinkRef.current) {
      observerRef.current.observe(nextLinkRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [connection]); // Re-run when connection changes (new items loaded)

  return (
    <Pagination connection={connection}>
      {({ nodes, isLoading, PreviousLink, NextLink }) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({ node, index }),
        );

        return (
          <div className="flex flex-col gap-8">
            <div className="flex justify-center">
              <PreviousLink className="btn-secondary !w-auto px-8 gap-2 group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 transition-transform group-hover:-translate-y-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
                {isLoading ? t('common.loading') : t('collections.showing')}
              </PreviousLink>
            </div>

            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}

            <div className="flex justify-center mt-4">
              <NextLink className="btn-secondary !w-auto px-8 gap-2 group transition-all duration-300">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>{t('common.loading')}</span>
                  </>
                ) : (
                  <>
                    <span ref={nextLinkRef}>{t('common.viewMore')}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 transition-transform group-hover:translate-y-1"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </>
                )}
              </NextLink>
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}
