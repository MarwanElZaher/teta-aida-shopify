import { useState } from 'react';
import { useTranslation } from '~/lib/translations';

type HeatLevel = 'Mild' | 'Normal' | 'Spicy';

interface HeatLevelSelectorProps {
    availableLevels: HeatLevel[];
    selectedLevel: HeatLevel | null;
    onSelect: (level: HeatLevel) => void;
}

export function HeatLevelSelector({ availableLevels, selectedLevel, onSelect }: HeatLevelSelectorProps) {
    if (!availableLevels || availableLevels.length === 0) return null;

    const { t } = useTranslation();

    return (
        <div className="heat-level-selector my-6">
            <label className="block text-sm font-serif font-bold text-primary mb-3 uppercase tracking-wide">{t('heatLevelSelector.title')}</label>
            <div className="flex flex-wrap gap-3">
                {availableLevels.map((level) => (
                    <button
                        key={level}
                        onClick={() => onSelect(level)}
                        className={`
              px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border
              ${selectedLevel === level
                                ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                                : 'bg-white text-dark/70 border-gray-200 hover:border-secondary hover:text-secondary'}
            `}
                    >
                        {t(`heatLevels.${level}`)}
                    </button>
                ))}
            </div>
        </div>
    );
}
