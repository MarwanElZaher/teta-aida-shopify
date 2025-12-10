/**
 * Helper functions for localized content using metafields
 * This allows Arabic translations to be stored in Shopify metafields
 */

export interface LocalizedContent {
    title: string;
    description?: string;
}

export interface MetafieldReference {
    key: string;
    value: string;
}

/**
 * Get localized title from metafields or fall back to default
 */
export function getLocalizedTitle(
    defaultTitle: string,
    metafields: MetafieldReference[] | null | undefined,
    language: string
): string {
    if (language !== 'AR' || !metafields || !Array.isArray(metafields)) {
        // Fallback for Healthy Living Box if no metafields but language is AR
        if (language === 'AR' && defaultTitle === 'Healthy Living Box') {
            return 'تشكيلة الحياة الصحية';
        }
        if (language === 'AR' && defaultTitle.includes('Low-Salt Cucumbers')) {
            return 'خيار قليل الملح بالكرفس';
        }
        return defaultTitle;
    }

    const arabicTitle = metafields.find(
        (m) => m && m.key && (m.key === 'title_ar' || m.key === 'arabic_title')
    );

    return arabicTitle?.value || (
        defaultTitle === 'Healthy Living Box' ? 'تشكيلة الحياة الصحية' :
            (defaultTitle.includes('Low-Salt Cucumbers') ? 'خيار قليل الملح بالكرفس' :
                (defaultTitle.includes('Tangerine-Infused Cabbage') ? 'كرنب بلمسة يوسفي' :
                    (defaultTitle.includes('Half-Preserved Lemons') || defaultTitle.includes('Half Lemons') ? 'ليمون معصفر بالهريسة' :
                        (defaultTitle.includes('Tuffaahy Olives') ? 'زيتون تفّاحي — الخلطة المميّزة' :
                            (defaultTitle.includes('Signature Box') || defaultTitle.includes('All Four Premium Flavors') ? 'التشكيلة المميّزة' :
                                (defaultTitle.includes('Spicy Lovers Box') ? 'تشكيلة عشّاق السبايسي' :
                                    (defaultTitle.includes('Hosting Box') ? 'تشكيلة الضيافة' : defaultTitle)))))))
    );
}

/**
 * Get localized description from metafields or fall back to default
 */
export function getLocalizedDescription(
    defaultDescription: string | null | undefined,
    metafields: MetafieldReference[] | null | undefined,
    language: string
): string {
    if (language !== 'AR' || !metafields || !Array.isArray(metafields)) {
        return defaultDescription || '';
    }

    const arabicDescription = metafields.find(
        (m) => m && m.key && (m.key === 'description_ar' || m.key === 'arabic_description')
    );

    return arabicDescription?.value || defaultDescription || '';
}

/**
 * Get localized content (title and description) from metafields
 */
export function getLocalizedContent(
    defaultTitle: string,
    defaultDescription: string | null | undefined,
    metafields: MetafieldReference[] | null | undefined,
    language: string
): LocalizedContent {
    return {
        title: getLocalizedTitle(defaultTitle, metafields, language),
        description: getLocalizedDescription(defaultDescription, metafields, language),
    };
}
