import { useLocation } from 'react-router';
import { useTranslation } from '~/lib/translations';

export function LanguageSelector({
    className = '',
    variant = 'default',
}: {
    className?: string;
    variant?: 'default' | 'light';
}) {
    const { pathname, search } = useLocation();
    const { locale } = useTranslation();
    const isAr = locale.language === 'AR';

    const toggleLanguage = (targetLang: 'EN' | 'AR') => {
        let newPath = pathname;
        if (targetLang === 'AR' && !pathname.startsWith('/ar')) {
            newPath = `/ar${pathname === '/' ? '' : pathname}`;
        } else if (targetLang === 'EN' && pathname.startsWith('/ar')) {
            newPath = pathname.replace(/^\/ar/, '') || '/';
        }
        return `${newPath}${search}`;
    };

    const activeClass = variant === 'light' ? 'text-white' : 'text-primary';
    const inactiveClass =
        variant === 'light'
            ? 'text-white/50 hover:text-white'
            : 'text-dark/50 hover:text-primary';
    const dividerClass = variant === 'light' ? 'text-white/30' : 'text-dark/30';

    return (
        <div
            className={`flex items-center gap-1 text-xs font-bold tracking-widest uppercase ${className}`}
        >
            <a
                href={toggleLanguage('EN')}
                className={`${!isAr ? activeClass : inactiveClass} transition-colors`}
            >
                EN
            </a>
            <span className={dividerClass}>|</span>
            <a
                href={toggleLanguage('AR')}
                className={`${isAr ? activeClass : inactiveClass} transition-colors`}
            >
                AR
            </a>
        </div>
    );
}
