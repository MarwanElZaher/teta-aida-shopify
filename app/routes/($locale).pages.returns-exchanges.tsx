import { Link } from 'react-router';

export const meta = () => {
    return [{ title: 'Returns & Exchanges | Teta Aida' }];
};

export default function ReturnsExchanges() {
    return (
        <div className="returns-exchanges-page">
            {/* HERO SECTION */}
            <section className="relative py-16 md:py-20 bg-cream">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                        Returns & Exchanges
                    </h1>
                    <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
                    <p className="text-lg text-dark/70 leading-relaxed">
                        Your satisfaction is our priority
                    </p>
                </div>
            </section>

            {/* RETURN POLICY */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl font-bold text-primary mb-4">Return Policy</h2>
                        <div className="w-20 h-1 bg-secondary mx-auto"></div>
                    </div>

                    <div className="bg-gradient-to-br from-cream to-white rounded-xl border border-secondary/20 p-8 shadow-sm mb-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                                ✓
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold text-primary mb-3">Quality Guarantee</h3>
                                <p className="text-dark/70 leading-relaxed mb-4">
                                    We take pride in our artisanal craftsmanship. If you receive a product that doesn't meet our premium standards, we'll make it right.
                                </p>
                                <ul className="space-y-2 text-dark/70">
                                    <li className="flex items-start gap-2">
                                        <span className="text-secondary font-bold mt-1">•</span>
                                        <span>Returns accepted within 7 days of delivery</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-secondary font-bold mt-1">•</span>
                                        <span>Products must be unopened and in original packaging</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-secondary font-bold mt-1">•</span>
                                        <span>Seal must be intact for food safety compliance</span>
                                    </li>
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
                                <h3 className="font-serif text-xl font-bold text-primary mb-3">Damaged or Defective Items</h3>
                                <p className="text-dark/70 leading-relaxed">
                                    If you receive a damaged jar or notice any quality issues, please contact us immediately with photos. We'll arrange a replacement or full refund at no additional cost.
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
                        <h2 className="font-serif text-3xl font-bold text-primary mb-4">How to Request a Return</h2>
                        <div className="w-20 h-1 bg-secondary mx-auto"></div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-6 bg-white rounded-lg border border-secondary/10 shadow-sm">
                            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                1
                            </div>
                            <div>
                                <h3 className="font-serif text-lg font-bold text-primary mb-1">Contact Us</h3>
                                <p className="text-dark/70">
                                    Reach out via WhatsApp at <a href="tel:+201070985360" className="text-secondary font-medium hover:underline">+20 107 098 5360</a> or email us at{' '}
                                    <a href="mailto:tetaaidapickles@gmail.com" className="text-secondary font-medium hover:underline">tetaaidapickles@gmail.com</a>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-white rounded-lg border border-secondary/10 shadow-sm">
                            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                2
                            </div>
                            <div>
                                <h3 className="font-serif text-lg font-bold text-primary mb-1">Provide Details</h3>
                                <p className="text-dark/70">Share your order number, reason for return, and photos if applicable.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-white rounded-lg border border-secondary/10 shadow-sm">
                            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                3
                            </div>
                            <div>
                                <h3 className="font-serif text-lg font-bold text-primary mb-1">Arrange Pickup or Return</h3>
                                <p className="text-dark/70">We'll coordinate pickup or provide return instructions based on your location.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-white rounded-lg border border-secondary/10 shadow-sm">
                            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                4
                            </div>
                            <div>
                                <h3 className="font-serif text-lg font-bold text-primary mb-1">Refund or Exchange</h3>
                                <p className="text-dark/70">Once we receive the item, we'll process your refund within 3-5 business days or send a replacement.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NON-RETURNABLE ITEMS */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl font-bold text-primary mb-4">Non-Returnable Items</h2>
                        <div className="w-20 h-1 bg-secondary mx-auto"></div>
                    </div>

                    <div className="bg-gradient-to-br from-cream to-white rounded-xl border border-secondary/20 p-8 shadow-sm">
                        <p className="text-dark/70 leading-relaxed mb-4">
                            For food safety and hygiene reasons, we cannot accept returns on:
                        </p>
                        <ul className="space-y-2 text-dark/70">
                            <li className="flex items-start gap-2">
                                <span className="text-secondary font-bold mt-1">•</span>
                                <span>Opened or partially consumed jars</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-secondary font-bold mt-1">•</span>
                                <span>Products with broken seals</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-secondary font-bold mt-1">•</span>
                                <span>Items purchased from third-party sellers</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="bg-primary py-16 text-center text-cream">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Need Help?</h2>
                    <p className="text-lg mb-8 opacity-90">Our team is here to assist with any questions about returns or exchanges</p>
                    <Link
                        to="/pages/contact"
                        className="inline-block px-10 py-4 bg-secondary text-white font-bold uppercase tracking-widest text-sm rounded-full hover:bg-[#b8941f] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Contact Support
                    </Link>
                </div>
            </section>
        </div>
    );
}
