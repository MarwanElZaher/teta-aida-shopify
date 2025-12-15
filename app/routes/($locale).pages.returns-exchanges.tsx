import { Link } from 'react-router';
import { useTranslation } from '~/lib/translations';

export const meta = () => {
    return [{ title: 'Returns & Exchanges | Teta Aida' }];
};

export default function ReturnsExchanges() {
    const { isRtl, t } = useTranslation();

    const steps = [
        {
            title: t('returnsExchange.howTo.step1.title'),
            desc: (
                <div className="flex flex-col items-start gap-2">
                    <span>{t('returnsExchange.howTo.step1.whatsappText')}</span>
                    <a
                        href="https://wa.me/201070985360"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#20bd5a] transition-colors shadow-sm"
                    >
                        <span>{t('returnsExchange.howTo.step1.buttonText')}</span>
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                    </a>
                    <span className="text-sm">{t('returnsExchange.howTo.step1.emailText')} <a href="mailto:tetaaidapickles@gmail.com" className="text-secondary font-medium hover:underline">tetaaidapickles@gmail.com</a></span>
                </div>
            )
        },
        { title: t('returnsExchange.howTo.step2.title'), desc: t('returnsExchange.howTo.step2.desc') },
        { title: t('returnsExchange.howTo.step3.title'), desc: t('returnsExchange.howTo.step3.desc') },
        { title: t('returnsExchange.howTo.step4.title'), desc: t('returnsExchange.howTo.step4.desc') }
    ];

    return (
        <div className="returns-exchanges-page">
            {/* HERO SECTION */}
            <section className="relative py-16 md:py-20 bg-cream">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                        {t('returnsExchange.title')}
                    </h1>
                    <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
                    <p className="text-lg text-dark/70 leading-relaxed">
                        {t('returnsExchange.subtitle')}
                    </p>
                </div>
            </section>

            {/* RETURN POLICY */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl font-bold text-primary mb-4">{t('returnsExchange.policyTitle')}</h2>
                        <div className="w-20 h-1 bg-secondary mx-auto"></div>
                    </div>

                    <div className="bg-gradient-to-br from-cream to-white rounded-xl border border-secondary/20 p-8 shadow-sm mb-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                                ✓
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold text-primary mb-3">{t('returnsExchange.quality.title')}</h3>
                                <p className="text-dark/70 leading-relaxed mb-4">
                                    {t('returnsExchange.quality.desc')}
                                </p>
                                <ul className="space-y-2 text-dark/70">
                                    {(t('returnsExchange.quality.items') as string[]).map((item, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-secondary font-bold mt-1">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-cream to-white rounded-xl border border-secondary/20 p-8 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                                🔄
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold text-primary mb-3">{t('returnsExchange.damaged.title')}</h3>
                                <p className="text-dark/70 leading-relaxed">
                                    {t('returnsExchange.damaged.desc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* EXCHANGE PROCESS */}
            <section className="py-16 md:py-20 bg-cream">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl font-bold text-primary mb-4">{t('returnsExchange.howTo.title')}</h2>
                        <div className="w-20 h-1 bg-secondary mx-auto"></div>
                    </div>

                    <div className="space-y-6">
                        {steps.map((step, index) => (
                            <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-lg border border-secondary/10 shadow-sm">
                                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="font-serif text-lg font-bold text-primary mb-1">{step.title}</h3>
                                    <div className="text-dark/70">{step.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NON-RETURNABLE ITEMS */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl font-bold text-primary mb-4">{t('returnsExchange.nonReturnable.title')}</h2>
                        <div className="w-20 h-1 bg-secondary mx-auto"></div>
                    </div>

                    <div className="bg-gradient-to-br from-cream to-white rounded-xl border border-secondary/20 p-8 shadow-sm">
                        <p className="text-dark/70 leading-relaxed mb-4">
                            {t('returnsExchange.nonReturnable.desc')}
                        </p>
                        <ul className="space-y-2 text-dark/70">
                            {(t('returnsExchange.nonReturnable.items') as string[]).map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="text-secondary font-bold mt-1">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="bg-primary py-16 text-center text-cream">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">{t('returnsExchange.cta.title')}</h2>
                    <p className="text-lg mb-8 opacity-90">{t('returnsExchange.cta.desc')}</p>
                    <Link
                        to="/pages/contact"
                        className="inline-block px-10 py-4 bg-secondary text-white font-bold uppercase tracking-widest text-sm rounded-full hover:bg-[#b8941f] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        {t('returnsExchange.cta.button')}
                    </Link>
                </div>
            </section>
        </div>
    );
}
