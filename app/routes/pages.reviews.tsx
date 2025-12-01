import { Link } from 'react-router';
import { useEffect, useState, useRef } from 'react';

export const meta = () => {
    return [
        { title: 'Customer Reviews | Teta Aida' },
        { name: 'description', content: 'Read what our customers are saying about Teta Aida premium artisanal pickles.' }
    ];
};

// Counter animation hook
function useCountAnimation(end: number, duration: number = 2000, decimals: number = 0) {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let startTime: number | null = null;
                    const startValue = 0;

                    const animate = (currentTime: number) => {
                        if (!startTime) startTime = currentTime;
                        const progress = Math.min((currentTime - startTime) / duration, 1);

                        // Easing function for smooth animation
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        const currentCount = startValue + (end - startValue) * easeOutQuart;

                        setCount(currentCount);

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            setCount(end);
                        }
                    };

                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    const displayValue = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toString();

    return { count: displayValue, elementRef };
}

export default function Reviews() {
    const customersCount = useCountAnimation(500, 2000);
    const ratingCount = useCountAnimation(4.9, 2000, 1);
    const recommendCount = useCountAnimation(95, 2000);

    return (
        <div className="reviews-page">
            {/* HERO SECTION */}
            <section className="relative h-[50vh] min-h-[400px] w-full bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-cream to-white opacity-80"></div>
                </div>
                <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
                    <div className="text-secondary text-6xl mb-6 animate-fade-in">"</div>
                    <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight animate-fade-in-up delay-100">
                        Customer Reviews
                    </h1>
                    <p className="text-lg md:text-xl text-dark/80 max-w-2xl leading-relaxed animate-fade-in-up delay-200">
                        Real stories from real customers who love Teta Aida
                    </p>
                </div>
            </section>

            {/* FEATURED TESTIMONIALS */}
            <section className="py-16 md:py-24 bg-white">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-16 text-center">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4 animate-fade-in-up">What Our Customers Say</h2>
                        <div className="w-24 h-1 bg-secondary mx-auto animate-fade-in delay-100"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {/* Testimonial Card 1 */}
                        <div className="bg-gradient-to-br from-cream to-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-secondary/10 animate-fade-in-up delay-100">
                            <div className="flex text-secondary text-xl mb-4">★★★★★</div>
                            <div className="text-secondary text-5xl mb-4 leading-none">"</div>
                            <p className="text-lg font-serif text-primary mb-6 leading-relaxed">
                                Absolutely addictive. The Tuffaahy olives are unlike anything I've tasted before.
                            </p>
                            <div className="border-t border-secondary/20 pt-4">
                                <p className="font-bold text-dark">Sarah M.</p>
                                <p className="text-sm text-dark/60">Cairo, Egypt</p>
                            </div>
                        </div>

                        {/* Testimonial Card 2 */}
                        <div className="bg-gradient-to-br from-cream to-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-secondary/10 animate-fade-in-up delay-200">
                            <div className="flex text-secondary text-xl mb-4">★★★★★</div>
                            <div className="text-secondary text-5xl mb-4 leading-none">"</div>
                            <p className="text-lg font-serif text-primary mb-6 leading-relaxed">
                                Premium taste. Every jar feels like it was made with genuine care and attention.
                            </p>
                            <div className="border-t border-secondary/20 pt-4">
                                <p className="font-bold text-dark">Ahmed K.</p>
                                <p className="text-sm text-dark/60">New Cairo</p>
                            </div>
                        </div>

                        {/* Testimonial Card 3 */}
                        <div className="bg-gradient-to-br from-cream to-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-secondary/10 animate-fade-in-up delay-300">
                            <div className="flex text-secondary text-xl mb-4">★★★★★</div>
                            <div className="text-secondary text-5xl mb-4 leading-none">"</div>
                            <p className="text-lg font-serif text-primary mb-6 leading-relaxed">
                                Perfect for hosting. My guests always ask where I got these beautiful jars from.
                            </p>
                            <div className="border-t border-secondary/20 pt-4">
                                <p className="font-bold text-dark">Layla H.</p>
                                <p className="text-sm text-dark/60">Heliopolis</p>
                            </div>
                        </div>

                        {/* Testimonial Card 4 */}
                        <div className="bg-gradient-to-br from-cream to-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-secondary/10 animate-fade-in-up delay-100">
                            <div className="flex text-secondary text-xl mb-4">★★★★★</div>
                            <div className="text-secondary text-5xl mb-4 leading-none">"</div>
                            <p className="text-lg font-serif text-primary mb-6 leading-relaxed">
                                My new favorite olives. The signature mix is incredible - so flavorful and fresh.
                            </p>
                            <div className="border-t border-secondary/20 pt-4">
                                <p className="font-bold text-dark">Omar F.</p>
                                <p className="text-sm text-dark/60">Nasr City</p>
                            </div>
                        </div>

                        {/* Testimonial Card 5 */}
                        <div className="bg-gradient-to-br from-cream to-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-secondary/10 animate-fade-in-up delay-200">
                            <div className="flex text-secondary text-xl mb-4">★★★★★</div>
                            <div className="text-secondary text-5xl mb-4 leading-none">"</div>
                            <p className="text-lg font-serif text-primary mb-6 leading-relaxed">
                                The low-salt cucumbers are perfect for my healthy lifestyle. Clean ingredients, amazing taste.
                            </p>
                            <div className="border-t border-secondary/20 pt-4">
                                <p className="font-bold text-dark">Nour A.</p>
                                <p className="text-sm text-dark/60">Maadi</p>
                            </div>
                        </div>

                        {/* Testimonial Card 6 */}
                        <div className="bg-gradient-to-br from-cream to-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-secondary/10 animate-fade-in-up delay-300">
                            <div className="flex text-secondary text-xl mb-4">★★★★★</div>
                            <div className="text-secondary text-5xl mb-4 leading-none">"</div>
                            <p className="text-lg font-serif text-primary mb-6 leading-relaxed">
                                The harissa lemons are insane - they've completely transformed my cooking!
                            </p>
                            <div className="border-t border-secondary/20 pt-4">
                                <p className="font-bold text-dark">Yasmine T.</p>
                                <p className="text-sm text-dark/60">Zamalek</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* CUSTOMER STATS */}
            <section className="py-16 md:py-24 bg-white">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-8 animate-fade-in-up delay-100" ref={customersCount.elementRef}>
                            <div className="text-5xl md:text-6xl font-serif font-bold text-secondary mb-4">
                                {customersCount.count}+
                            </div>
                            <p className="text-lg text-dark/70">Happy Customers</p>
                        </div>
                        <div className="p-8 animate-fade-in-up delay-200" ref={ratingCount.elementRef}>
                            <div className="text-5xl md:text-6xl font-serif font-bold text-secondary mb-4">
                                {ratingCount.count}
                            </div>
                            <p className="text-lg text-dark/70">Average Rating</p>
                            <div className="flex justify-center text-secondary text-xl mt-2">★★★★★</div>
                        </div>
                        <div className="p-8 animate-fade-in-up delay-300" ref={recommendCount.elementRef}>
                            <div className="text-5xl md:text-6xl font-serif font-bold text-secondary mb-4">
                                {recommendCount.count}%
                            </div>
                            <p className="text-lg text-dark/70">Would Recommend</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="bg-primary py-20 text-center text-cream">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 leading-tight">
                        Join Our Happy Customers
                    </h2>
                    <p className="text-lg mb-8 opacity-90">
                        Experience the premium difference that everyone is talking about.
                    </p>
                    <Link
                        to="/collections/all"
                        className="inline-block px-10 py-4 bg-secondary text-white font-bold uppercase tracking-widest text-sm rounded-full hover:bg-[#b8941f] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Shop Now
                    </Link>
                </div>
            </section>
        </div>
    );
}

