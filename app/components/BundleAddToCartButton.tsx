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
    bundleItems,
}: {
    analytics?: unknown;
    children: React.ReactNode;
    disabled?: boolean;
    lines: Array<OptimisticCartLineInput>;
    onClick?: () => void;
    customProperties?: Record<string, string>;
    bundleItems?: any[];
}) {
    const { t } = useTranslation();

    // Helper to map English product names to Attribute Keys
    const getAttributeKey = (name: string) => {
        const cleanName = name.replace(/_\d+$/, ''); // Remove index
        const indexSuffix = name.match(/_\d+$/)?.[0] || ''; // Keep it for uniqueness

        // Find the localized name from bundleItems
        const item = bundleItems?.find(i => i.name === cleanName);
        const displayName = item?.displayName || cleanName;

        // Append technical marker for cart visibility (must contain "Heat" or "حرارة")
        const marker = t('product.attributes.heatLevelMarker');

        return `${displayName} ${marker}${indexSuffix}`;
    };

    // Add custom properties to the line items
    const linesWithProperties = lines.map(line => ({
        ...line,
        attributes: customProperties ? Object.entries(customProperties).map(([key, value]) => {
            const lowerValue = value.toLowerCase();
            const translatedValue = (lowerValue === 'mild' || lowerValue === 'normal' || lowerValue === 'spicy')
                ? t(`product.heatLevels.${lowerValue}`)
                : value;

            return {
                key: getAttributeKey(key),
                value: translatedValue,
            };
        }) : [],
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
