import { useTranslation } from '~/lib/translations';

export const meta = () => {
    return [{ title: 'Contact Us | Teta Aida' }];
};

export default function Contact() {
    const { t } = useTranslation();

    return (
        <div className="contact-page py-16 sm:py-24">
            <div className="mx-auto max-w-4xl px-4 text-center">
                <h1 className="mb-6 text-4xl font-bold text-gray-900">{t('contact.title')}</h1>
                <p className="mb-12 text-lg text-gray-600">
                    {t('contact.subtitle')}
                </p>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                    <div className="rounded-xl bg-[#F9F7F2] p-8 transition-transform hover:-translate-y-1">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">📞</div>
                        <h3 className="mb-2 text-lg font-bold text-gray-900">{t('contact.whatsapp')}</h3>
                        <p className="font-medium text-green-800">+20 107 098 5360</p>
                    </div>

                    <div className="rounded-xl bg-[#F9F7F2] p-8 transition-transform hover:-translate-y-1">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">📧</div>
                        <h3 className="mb-2 text-lg font-bold text-gray-900">{t('contact.email')}</h3>
                        <a href="mailto:tetaaidapickles@gmail.com" className="font-medium text-green-800 hover:underline">
                            tetaaidapickles@gmail.com
                        </a>
                    </div>

                    <div className="rounded-xl bg-[#F9F7F2] p-8 transition-transform hover:-translate-y-1">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">🕓</div>
                        <h3 className="mb-2 text-lg font-bold text-gray-900">{t('contact.supportHours')}</h3>
                        <p className="text-gray-600">{t('contact.hours')}</p>
                        <p className="text-sm text-gray-500">{t('contact.timezone')}</p>
                    </div>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 text-left max-w-2xl mx-auto">
                    <div>
                        <h3 className="mb-4 text-xl font-bold text-gray-900">{t('contact.location')}</h3>
                        <p className="text-gray-600">{t('contact.locationText')}</p>
                    </div>
                    <div>
                        <h3 className="mb-4 text-xl font-bold text-gray-900">{t('contact.followUs')}</h3>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/teta_3ayda/" target="_blank" rel="noopener noreferrer" className="text-green-800 hover:text-green-600 transition-colors">
                                <IconInstagram />
                            </a>
                            <a href="https://web.facebook.com/Teta3ayda" target="_blank" rel="noopener noreferrer" className="text-green-800 hover:text-green-600 transition-colors">
                                <IconFacebook />
                            </a>
                            <a href="https://www.tiktok.com/@teta_3ayda" target="_blank" rel="noopener noreferrer" className="text-green-800 hover:text-green-600 transition-colors">
                                <IconTikTok />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function IconInstagram() {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    );
}

function IconFacebook() {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
    );
}

function IconTikTok() {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
    );
}
