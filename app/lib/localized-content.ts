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
    // 1. Check for Metafield Translation (Priority)
    if (language === 'AR' && metafields && Array.isArray(metafields)) {
        const arabicTitle = metafields.find(
            (m) => m && m.key && (m.key === 'title_ar' || m.key === 'arabic_title')
        );
        if (arabicTitle?.value) return arabicTitle.value;
    }

    // 2. Hardcoded Fallbacks for known products
    if (language === 'AR') {
        if (defaultTitle === 'Healthy Living Box') return 'تشكيلة الحياة الصحية';
        if (defaultTitle.includes('Low-Salt Cucumbers')) return 'خيار قليل الملح بالكرفس';
        if (defaultTitle.includes('Tangerine-Infused Cabbage')) return 'كرنب بلمسة يوسفي';
        if (defaultTitle.includes('Half-Preserved Lemons') || defaultTitle.includes('Half Lemons')) return 'ليمون معصفر بالهريسة';
        if (defaultTitle.includes('Tuffaahy Olives')) return 'زيتون تفّاحي — الخلطة المميّزة';
        if (defaultTitle.includes('Signature Box') || defaultTitle.includes('All Four Premium Flavors')) return 'التشكيلة المميّزة';
        if (defaultTitle.includes('Spicy Lovers Box')) return 'تشكيلة عشّاق السبايسي';
        if (defaultTitle.includes('Hosting Box')) return 'تشكيلة الضيافة';
        if (defaultTitle.includes('Vintage-Style Turnips')) return 'لفت (فينتاج) — لون بنجر طبيعي';
    }

    return defaultTitle;
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
