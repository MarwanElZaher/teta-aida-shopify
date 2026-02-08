import { useState } from 'react';
import { useTranslation } from '~/lib/translations';

export interface BundleItem {
    name: string;
    displayName?: string; // Add displayName for UI
    arabic_title?: string;
    heatLevels: string[];
}

interface BundleConfiguratorProps {
    bundleItems: BundleItem[];
    onConfigurationChange: (config: Record<string, string>) => void;
}

export function BundleConfigurator({ bundleItems, onConfigurationChange }: BundleConfiguratorProps) {
    const [selections, setSelections] = useState<Record<string, string>>({});
    const { t, isRtl } = useTranslation();

    const handleSelection = (itemIndex: number, itemName: string, heatLevel: string) => {
        const itemKey = `${itemName}_${itemIndex}`;
        const newSelections = {
            ...selections,
            [itemKey]: heatLevel,
        };
        setSelections(newSelections);
        onConfigurationChange(newSelections);
    };

    // Check if all items have a selection
    const isComplete = bundleItems.every((item, index) => {
        const itemKey = `${item.name}_${index}`;
        return selections[itemKey];
    });

    return (
        <div className={`bundle-configurator my-8 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            <h3 className="font-serif text-xl font-bold text-primary mb-6 uppercase tracking-wide">
                {t('product.customizeBundle')}
            </h3>
            <p className="text-sm text-dark/70 mb-6">
                {t('product.selectHeatInstructions')}
            </p>

            <div className="space-y-6">
                {bundleItems.map((item, index) => {
                    const itemKey = `${item.name}_${index}`;
                    // Count how many times this item appears before this index
                    const itemCount = bundleItems.slice(0, index + 1).filter(i => i.name === item.name).length;
                    const totalItemCount = bundleItems.filter(i => i.name === item.name).length;
                    // Use / instead of "of" for locale neutrality
                    const nameToDisplay = item.displayName || item.name;
                    const displayName = totalItemCount > 1 ? `${nameToDisplay} (${itemCount}/${totalItemCount})` : nameToDisplay;

                    return (
                        <div key={itemKey} className="bundle-item border-b border-gray-200 pb-6 last:border-0">
                            <label className="block text-sm font-serif font-bold text-primary mb-3">
                                {displayName}
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {item.heatLevels.map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => handleSelection(index, item.name, level)}
                                        className={`
                      px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border
                      ${selections[itemKey] === level
                                                ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                                                : 'bg-white text-dark/70 border-gray-200 hover:border-secondary hover:text-secondary'}
                    `}
                                    >
                                        {(() => {
                                            // Check if we have a translation for the lowercase key
                                            const key = level.toLowerCase();
                                            const translationKey = `product.heatLevels.${key}`;
                                            const translated = t(translationKey);

                                            // If translation exists and is different from key, use it.
                                            // Ensure we don't just return the key if translation is missing.
                                            if (translated !== translationKey) return translated;

                                            // Otherwise assume it's already localized (e.g. from Shopify Admin)
                                            return level;
                                        })()}
                                    </button>
                                ))}
                            </div>
                            {selections[itemKey] && (
                                <p className="mt-2 text-xs text-secondary font-medium">
                                    ✓ {t('product.selected')} {(() => {
                                        const level = selections[itemKey];
                                        const key = level.toLowerCase();
                                        const translationKey = `product.heatLevels.${key}`;
                                        const translated = t(translationKey);

                                        if (translated !== translationKey) return translated;
                                        return level;
                                    })()}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {!isComplete && (
                <div className="mt-6 p-4 bg-cream rounded-lg border border-secondary/20">
                    <p className="text-sm text-dark/70 text-center">
                        {t('product.incompleteSelection')}
                    </p>
                </div>
            )}
        </div>
    );
}
