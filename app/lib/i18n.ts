export type I18nLocale = {
    language: 'EN' | 'AR';
    country: 'EG' | 'US';
    pathPrefix: string;
};

export const DEFAULT_LOCALE: I18nLocale = {
    language: 'EN',
    country: 'EG',
    pathPrefix: '',
};

export const SUPPORTED_LOCALES: Record<string, I18nLocale> = {
    'EN-EG': DEFAULT_LOCALE,
    'AR-EG': {
        language: 'AR',
        country: 'EG',
        pathPrefix: '/ar',
    },
};

export function getLocaleFromRequest(request: Request): I18nLocale {
    const url = new URL(request.url);
    const firstPathPart = url.pathname.split('/')[1]?.toUpperCase();

    if (firstPathPart === 'AR') {
        return SUPPORTED_LOCALES['AR-EG'];
    }

    return DEFAULT_LOCALE;
}

export function getAllLocales(): I18nLocale[] {
    return Object.values(SUPPORTED_LOCALES);
}
