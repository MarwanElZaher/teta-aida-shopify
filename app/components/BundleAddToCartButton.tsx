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

    // Map from product name (in metafields) to translation key suffix
    const ATTRIBUTE_KEY_MAP: Record<string, string> = {
        'Olives': 'Olives Heat',
        'Cucumber': 'Cucumbers Heat',
        'Cucumbers': 'Cucumbers Heat',
        'Cabbage': 'Cabbage Heat',
        'Harissa': 'Harissa Heat',
        'Lemon': 'Lemon Heat',
        'Turnip': 'Turnip Heat',
    };

    // Helper to format numbers based on locale
    const formatNumber = (num: number) => {
        const locale = t('locale.code') === 'ar' ? 'ar-EG' : 'en-US';
        return new Intl.NumberFormat(locale).format(num);
    };

    // Calculate item counts to determine when to show indices
    const itemCounts = customProperties ? Object.keys(customProperties).reduce((acc: Record<string, number>, key) => {
        const match = key.match(/^(.+)_(\d+)$/);
        if (match) {
            const base = match[1];
            acc[base] = (acc[base] || 0) + 1;
        } else {
            // Handle legacy/simple keys without index
            acc[key] = (acc[key] || 0) + 1;
        }
        return acc;
    }, {}) : {};

    // Helper to map product names + index to localized Attribute Keys
    const getAttributeKey = (key: string) => {
        const match = key.match(/^(.+)_(\d+)$/);
        let baseName = key;
        let index = 0;
        let isIndexed = false;

        if (match) {
            baseName = match[1];
            index = parseInt(match[2], 10);
            isIndexed = true;
        }

        // Determine base translation
        const mapKey = ATTRIBUTE_KEY_MAP[baseName] || `${baseName} Heat`;
        const translatedBase = t(`product.attributes.${mapKey}`);
        // Fallback to English/Code key if translation missing
        const label = translatedBase !== `product.attributes.${mapKey}` ? translatedBase : `${baseName} Heat`;

        // Only append index if multiple items of this type exist
        if (isIndexed && (itemCounts[baseName] || 0) > 1) {
            return `${label} ${formatNumber(index + 1)}`;
        }

        return label;
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
