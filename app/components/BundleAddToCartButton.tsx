import { type FetcherWithComponents } from 'react-router';
import { CartForm, type OptimisticCartLineInput } from '@shopify/hydrogen';
import { useTranslation } from '~/lib/translations';

export function BundleAddToCartButton({
    analytics,
    children,
    disabled,
    lines,
    onClick,
    customProperties,
}: {
    analytics?: unknown;
    children: React.ReactNode;
    disabled?: boolean;
    lines: Array<OptimisticCartLineInput>;
    onClick?: () => void;
    customProperties?: Record<string, string>;
}) {
    const { t } = useTranslation();

    // Helper to map English product names to Attribute Keys
    const getAttributeKey = (name: string) => {
        const cleanName = name.replace(/_\d+$/, ''); // Remove index
        if (cleanName.includes('Olives')) return t('product.attributes.Olives Heat');
        if (cleanName.includes('Cucumber')) return t('product.attributes.Cucumbers Heat');
        if (cleanName.includes('Cabbage')) return t('product.attributes.Cabbage Heat');
        if (cleanName.includes('Harissa')) return t('product.attributes.Harissa Heat');
        if (cleanName.includes('Lemon')) return t('product.attributes.Olives Heat'); // Fallback or new key if needed, defaulting to Olives structure or generic
        return cleanName; // Fallback
    };

    // Add custom properties to the line items
    const linesWithProperties = lines.map(line => ({
        ...line,
        attributes: customProperties ? Object.entries(customProperties).map(([key, value]) => ({
            key: getAttributeKey(key),
            value: t(`product.heatLevels.${value.toLowerCase()}`),
        })) : [],
    }));

    return (
        <CartForm route="/cart" inputs={{ lines: linesWithProperties }} action={CartForm.ACTIONS.LinesAdd}>
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
    );
}
