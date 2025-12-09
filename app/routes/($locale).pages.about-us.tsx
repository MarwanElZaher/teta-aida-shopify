import { Link } from 'react-router';
import { useScrollAnimation } from '~/hooks/useScrollAnimation';
import { useTranslation } from '~/lib/translations';

import { TRANSLATIONS } from '~/lib/translations';

export const meta = ({ params }: { params: { locale?: string } }) => {
    const locale = params.locale?.toUpperCase() === 'AR' ? 'AR' : 'EN';
    return [{ title: TRANSLATIONS[locale].about.meta_title }];
};

export default function About() {
    const { t, locale } = useTranslation();
    const section1 = useScrollAnimation();
    const section2 = useScrollAnimation();
    const section3 = useScrollAnimation();
    const section4 = useScrollAnimation();
    const section5 = useScrollAnimation();

    return (
        <div className="about-page">
            {/* HERO SECTION */}
            <section className="relative h-[60vh] min-h-[500px] w-full bg-cream overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Placeholder for Hero Image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
                </div>
                <div ref={section1.ref} className={`relative z-10 flex h-full flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto transition-all duration-700 ${section1.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
                        {t('about.hero.title')}
                    </h1>
                    <p className="text-lg md:text-xl text-dark/80 max-w-2xl leading-relaxed">
                        {t('about.hero.subtitle')}
                    </p>
                </div>
            </section>

            {/* BRAND INTRO */}
            <section ref={section2.ref} className={`py-16 md:py-24 bg-white transition-all duration-700 ${section2.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="mx-auto max-w-4xl px-6">
                    <div className="text-center mb-12">
                        <p className="font-serif text-2xl md:text-3xl font-bold text-primary mb-6 leading-relaxed">
                            {t('about.intro.main')}
                        </p>
                        <p className="text-lg text-dark/70 leading-relaxed">
                            {t('about.intro.secondary')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                        <div className="flex items-center gap-3 p-4 bg-cream/50 rounded-lg border border-secondary/10">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white font-bold text-lg flex-shrink-0">✓</span>
                            <span className="text-dark font-medium">{t('about.intro.handcrafted')}</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-cream/50 rounded-lg border border-secondary/10">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white font-bold text-lg flex-shrink-0">✓</span>
                            <span className="text-dark font-medium">{t('about.intro.clean_ingredients')}</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-cream/50 rounded-lg border border-secondary/10">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white font-bold text-lg flex-shrink-0">✓</span>
                            <span className="text-dark font-medium">{t('about.intro.no_additives')}</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-cream/50 rounded-lg border border-secondary/10">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white font-bold text-lg flex-shrink-0">✓</span>
                            <span className="text-dark font-medium">{t('about.intro.balanced_flavor')}</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-cream/50 rounded-lg border border-secondary/10">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white font-bold text-lg flex-shrink-0">✓</span>
                            <span className="text-dark font-medium">{t('about.intro.premium_jars')}</span>
                        </div>
                    </div>

                    <p className="text-2xl md:text-3xl font-serif text-secondary text-center leading-relaxed">
                        {t('about.intro.quote')}
                    </p>
                </div>
            </section>

            {/* OUR PHILOSOPHY */}
            <section ref={section3.ref} className={`bg-cream py-16 md:py-24 transition-all duration-700 ${section3.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-16 text-center">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">{t('about.philosophy.title')}</h2>
                        <div className="w-24 h-1 bg-secondary mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center text-3xl">🏺</div>
                            <h3 className="font-serif text-xl font-bold text-primary mb-3">{t('about.philosophy.care.title')}</h3>
                            <p className="text-dark/70 leading-relaxed">{t('about.philosophy.care.desc')}</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center text-3xl">🌿</div>
                            <h3 className="font-serif text-xl font-bold text-primary mb-3">{t('about.philosophy.ingredients.title')}</h3>
                            <p className="text-dark/70 leading-relaxed">{t('about.philosophy.ingredients.desc')}</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center text-3xl">✨</div>
                            <h3 className="font-serif text-xl font-bold text-primary mb-3">{t('about.philosophy.modern.title')}</h3>
                            <p className="text-dark/70 leading-relaxed">{t('about.philosophy.modern.desc')}</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center text-3xl">❤️</div>
                            <h3 className="font-serif text-xl font-bold text-primary mb-3">{t('about.philosophy.tradition.title')}</h3>
                            <p className="text-dark/70 leading-relaxed">{t('about.philosophy.tradition.desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* OUR COMMITMENT */}
            <section ref={section4.ref} className={`py-16 md:py-24 bg-white transition-all duration-700 ${section4.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="mx-auto max-w-5xl px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">{t('about.commitment.title')}</h2>
                        <div className="w-24 h-1 bg-secondary mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-gradient-to-br from-cream to-white rounded-xl border border-secondary/20 shadow-sm hover:shadow-md transition-all">
                            <p className="text-lg font-serif text-primary font-medium">{t('about.commitment.flavor')}</p>
                        </div>
                        <div className="p-8 bg-gradient-to-br from-cream to-white rounded-xl border border-secondary/20 shadow-sm hover:shadow-md transition-all">
                            <p className="text-lg font-serif text-primary font-medium">{t('about.commitment.tradition')}</p>
                        </div>
                        <div className="p-8 bg-gradient-to-br from-cream to-white rounded-xl border border-secondary/20 shadow-sm hover:shadow-md transition-all">
                            <p className="text-lg font-serif text-primary font-medium">{t('about.commitment.artisanal')}</p>
                        </div>
                        <div className="p-8 bg-gradient-to-br from-cream to-white rounded-xl border border-secondary/20 shadow-sm hover:shadow-md transition-all">
                            <p className="text-lg font-serif text-primary font-medium">{t('about.commitment.experience')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section ref={section5.ref} className={`bg-primary py-20 text-center text-cream transition-all duration-700 ${section5.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 leading-tight">{t('about.cta.title')}</h2>
                    <p className="text-lg mb-8 opacity-90">{t('about.cta.subtitle')}</p>
                    <Link
                        to={`${locale.pathPrefix}/collections/all`}
                        className="inline-block px-10 py-4 bg-secondary text-white font-bold uppercase tracking-widest text-sm rounded-full hover:bg-[#b8941f] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        {t('about.cta.button')}
                    </Link>
                </div>
            </section>
        </div>
    );
}
