import * as React from 'react';
import { Pagination } from '@shopify/hydrogen';

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
          <div>
            <PreviousLink>
              {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
            </PreviousLink>
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}
            <NextLink className="inline-block w-full py-4 text-center text-dark/60 hover:text-primary transition-colors cursor-pointer">
              {isLoading ? (
                <span className="block animate-pulse">Loading more...</span>
              ) : (
                // @ts-ignore
                <span ref={nextLinkRef} className="block">Load more ↓</span>
              )}
            </NextLink>
          </div>
        );
      }}
    </Pagination>
  );
}
