/**
 * Converts formatted numbers to Arabic-Indic digits if the language is Arabic.
 */
export function localizeNumber(num: number | string, language: string = 'EN'): string {
    if (language !== 'AR') return num.toString();

    const westernToEasternMap: { [key: string]: string } = {
        '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
        '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
    };

    return num.toString().replace(/[0-9]/g, match => westernToEasternMap[match]);
}

/**
 * Formats a currency amount using the appropriate locale and numbering system.
 */
export function formatCurrency(amount: number, currency: string, language: string = 'EN'): string {
    const locale = language === 'AR' ? 'ar-EG' : 'en-EG';
    const numberingSystem = language === 'AR' ? 'arab' : 'latn';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        numberingSystem, // Explicitly request Arabic numerals for AR
    }).format(amount);
}
