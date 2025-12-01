import { Link } from 'react-router';
import { useScrollAnimation } from '~/hooks/useScrollAnimation';

export const meta = () => {
    return [{ title: 'About Teta Aida | Heritage & Craft' }];
};

export default function About() {
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
                        A Taste of Heritage, Crafted for Today
                    </h1>
                    <p className="text-lg md:text-xl text-dark/80 max-w-2xl leading-relaxed">
                        Premium small-batch pickles inspired by tradition — elevated with modern gourmet craftsmanship and clean, carefully selected ingredients.
                    </p>
                </div>
            </section>

            {/* BRAND INTRO */}
            <section ref={section2.ref} className={`py-16 md:py-24 bg-white transition-all duration-700 ${section2.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="mx-auto max-w-4xl px-6">
                    <div className="text-center mb-12">
                        <p className="font-serif text-2xl md:text-3xl font-bold text-primary mb-6 leading-relaxed">
                            At Teta Aida, we believe food should feel warm, honest, and beautifully made.
                        </p>
                        <p className="text-lg text-dark/70 leading-relaxed">
                            Our recipes draw inspiration from the comfort of traditional kitchens — but are reimagined for today's refined tastes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                        <div className="flex items-center gap-3 p-4 bg-cream/50 rounded-lg border border-secondary/10">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white font-bold text-lg flex-shrink-0">✓</span>
                            <span className="text-dark font-medium">Handcrafted in small batches</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-cream/50 rounded-lg border border-secondary/10">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white font-bold text-lg flex-shrink-0">✓</span>
                            <span className="text-dark font-medium">Clean, natural ingredients</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-cream/50 rounded-lg border border-secondary/10">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white font-bold text-lg flex-shrink-0">✓</span>
                            <span className="text-dark font-medium">Free from artificial additives</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-cream/50 rounded-lg border border-secondary/10">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white font-bold text-lg flex-shrink-0">✓</span>
                            <span className="text-dark font-medium">Packed in elegant, premium glass jars</span>
                        </div>
                    </div>

                    <p className="text-2xl md:text-3xl font-serif italic text-secondary text-center leading-relaxed">
                        "This isn't just pickling. It's artisanal craft, elevated."
                    </p>
                </div>
            </section>

            {/* OUR PHILOSOPHY */}
            <section ref={section3.ref} className={`bg-cream py-16 md:py-24 transition-all duration-700 ${section3.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-16 text-center">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">Our Philosophy</h2>
                        <div className="w-24 h-1 bg-secondary mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center text-3xl">🏺</div>
                            <h3 className="font-serif text-xl font-bold text-primary mb-3">Crafted with Care</h3>
                            <p className="text-dark/70 leading-relaxed">We prepare every batch patiently, ensuring consistent flavor, aroma, and texture.</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center text-3xl">🌿</div>
                            <h3 className="font-serif text-xl font-bold text-primary mb-3">Clean Ingredients First</h3>
                            <p className="text-dark/70 leading-relaxed">Only fresh vegetables, real aromatics, and signature blends. Nothing artificial.</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center text-3xl">✨</div>
                            <h3 className="font-serif text-xl font-bold text-primary mb-3">Made for Modern Homes</h3>
                            <p className="text-dark/70 leading-relaxed">Premium flavors designed for hosting, gifting, dining, and everyday enjoyment.</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center text-3xl">❤️</div>
                            <h3 className="font-serif text-xl font-bold text-primary mb-3">Tradition at Heart</h3>
                            <p className="text-dark/70 leading-relaxed">Each recipe carries a familiar warmth — inspired by the timeless style of "Teta Aida."</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* OUR COMMITMENT */}
            <section ref={section4.ref} className={`py-16 md:py-24 bg-white transition-all duration-700 ${section4.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="mx-auto max-w-5xl px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">Our Commitment</h2>
                        <div className="w-24 h-1 bg-secondary mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-gradient-to-br from-cream to-white rounded-xl border border-secondary/20 shadow-sm hover:shadow-md transition-all">
                            <p className="text-lg font-serif text-primary font-medium">To preserve flavor.</p>
                        </div>
                        <div className="p-8 bg-gradient-to-br from-cream to-white rounded-xl border border-secondary/20 shadow-sm hover:shadow-md transition-all">
                            <p className="text-lg font-serif text-primary font-medium">To honor tradition.</p>
                        </div>
                        <div className="p-8 bg-gradient-to-br from-cream to-white rounded-xl border border-secondary/20 shadow-sm hover:shadow-md transition-all">
                            <p className="text-lg font-serif text-primary font-medium">To bring elegant, refined artisanal pickles to modern tables.</p>
                        </div>
                        <div className="p-8 bg-gradient-to-br from-cream to-white rounded-xl border border-secondary/20 shadow-sm hover:shadow-md transition-all">
                            <p className="text-lg font-serif text-primary font-medium">To deliver a premium experience with every jar you open.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section ref={section5.ref} className={`bg-primary py-20 text-center text-cream transition-all duration-700 ${section5.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 leading-tight">Taste the premium difference.</h2>
                    <p className="text-lg mb-8 opacity-90">Discover our signature creations crafted with care and tradition.</p>
                    <Link
                        to="/collections/all"
                        className="inline-block px-10 py-4 bg-secondary text-white font-bold uppercase tracking-widest text-sm rounded-full hover:bg-[#b8941f] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Shop Our Signature Creations
                    </Link>
                </div>
            </section>
        </div>
    );
}
