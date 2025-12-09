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
        return defaultTitle;
    }

    const arabicTitle = metafields.find(
        (m) => m && m.key && (m.key === 'title_ar' || m.key === 'arabic_title')
    );

    return arabicTitle?.value || defaultTitle;
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
