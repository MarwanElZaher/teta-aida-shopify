import { type FetcherWithComponents } from 'react-router';
import { CartForm, type OptimisticCartLineInput } from '@shopify/hydrogen';

export function AddToCartButton({
  className,
  analytics,
  children,
  disabled,
  lines,
  onClick,
  attributes,
}: {
  className?: string;
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  attributes?: { key: string; value: string }[];
}) {
  return (
    <div className="w-full [&>form]:w-full flex justify-start">
      <CartForm
        route="/cart"
        inputs={{
          lines: lines.map(line => ({
            ...line,
            attributes: attributes || line.attributes || [],
          }))
        }}
        action={CartForm.ACTIONS.LinesAdd}
      >
        {(fetcher: FetcherWithComponents<any>) => (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              onClick={onClick}
              disabled={disabled ?? fetcher.state !== 'idle'}
              className={`
                ${className}
                w-full h-[50px] rounded-[14px] bg-primary text-white font-bold uppercase tracking-widest text-sm
                transition-all duration-300 hover:bg-[#143d24] hover:shadow-lg active:scale-[0.98]
                flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary
              `}
            >
              {children}
            </button>
          </>
        )}
      </CartForm>
    </div>
  );
}
