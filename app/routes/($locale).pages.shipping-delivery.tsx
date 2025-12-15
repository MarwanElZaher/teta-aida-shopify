import { Link } from 'react-router';
import { useTranslation } from '~/lib/translations';

export const meta = () => {
    return [{ title: 'Shipping & Delivery | Teta Aida' }];
};

export default function ShippingDelivery() {
    const { t } = useTranslation();

    return (
        <div className="shipping-delivery-page">
            {/* HERO SECTION */}
            <section className="relative py-16 md:py-20 bg-cream">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                        {t('shippingPage.hero.title')}
                    </h1>
                    <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
                    <p className="text-lg text-dark/70 leading-relaxed">
                        {t('shippingPage.hero.subtitle')}
                    </p>
                </div>
            </section>

            {/* DELIVERY AREAS */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl font-bold text-primary mb-4">{t('shippingPage.areas.title')}</h2>
                        <div className="w-20 h-1 bg-secondary mx-auto"></div>
                    </div>

                    <div className="bg-gradient-to-br from-cream to-white rounded-xl border border-secondary/20 p-8 shadow-sm">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                                📍
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold text-primary mb-2">{t('shippingPage.areas.cairo.title')}</h3>
                                <p className="text-dark/70 leading-relaxed">
                                    {t('shippingPage.areas.cairo.desc')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                                ⏱️
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold text-primary mb-2">{t('shippingPage.areas.time.title')}</h3>
                                <p className="text-dark/70 leading-relaxed">
                                    {t('shippingPage.areas.time.desc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SHIPPING FEES */}
            <section className="py-16 md:py-20 bg-cream">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl font-bold text-primary mb-4">{t('shippingPage.fees.title')}</h2>
                        <div className="w-20 h-1 bg-secondary mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl border border-secondary/20 p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-center mb-4">
                                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                    🚚
                                </div>
                                <h3 className="font-serif text-xl font-bold text-primary mb-2">{t('shippingPage.fees.standard.title')}</h3>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-secondary mb-2">{t('shippingPage.fees.standard.price')}</p>
                                <p className="text-sm text-dark/60">{t('shippingPage.fees.standard.time')}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-primary/20 p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-center mb-4">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                    ✨
                                </div>
                                <h3 className="font-serif text-xl font-bold text-primary mb-2">{t('shippingPage.fees.free.title')}</h3>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary mb-2">{t('shippingPage.fees.free.price')}</p>
                                <p className="text-sm text-dark/60">{t('shippingPage.fees.free.desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ORDER TRACKING */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl font-bold text-primary mb-4">{t('shippingPage.tracking.title')}</h2>
                        <div className="w-20 h-1 bg-secondary mx-auto"></div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-6 bg-cream/50 rounded-lg border border-secondary/10">
                            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                1
                            </div>
                            <div>
                                <h3 className="font-serif text-lg font-bold text-primary mb-1">{t('shippingPage.tracking.step1.title')}</h3>
                                <p className="text-dark/70">{t('shippingPage.tracking.step1.desc')}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-cream/50 rounded-lg border border-secondary/10">
                            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                2
                            </div>
                            <div>
                                <h3 className="font-serif text-lg font-bold text-primary mb-1">{t('shippingPage.tracking.step2.title')}</h3>
                                <p className="text-dark/70">{t('shippingPage.tracking.step2.desc')}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-cream/50 rounded-lg border border-secondary/10">
                            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                3
                            </div>
                            <div>
                                <h3 className="font-serif text-lg font-bold text-primary mb-1">{t('shippingPage.tracking.step3.title')}</h3>
                                <p className="text-dark/70">{t('shippingPage.tracking.step3.desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="bg-primary py-16 text-center text-cream">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">{t('shippingPage.cta.title')}</h2>
                    <p className="text-lg mb-8 opacity-90">{t('shippingPage.cta.desc')}</p>
                    <Link
                        to="/pages/contact"
                        className="inline-block px-10 py-4 bg-secondary text-white font-bold uppercase tracking-widest text-sm rounded-full hover:bg-[#b8941f] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        {t('shippingPage.cta.button')}
                    </Link>
                </div>
            </section>
        </div>
    );
}
