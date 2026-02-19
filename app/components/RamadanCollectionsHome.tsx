import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import { useTranslation } from '~/lib/translations';
import { getLocalizedTitle } from '~/lib/localized-content';





export function RamadanCollectionsHome({ products }: { products: any[] }) {
    const { t, locale } = useTranslation();

    const displayProducts = products;

    if (!displayProducts || displayProducts.length === 0) return null;


    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-5xl text-primary mb-4">
                        🌙 {t('ramadan.title') || 'Ramadan Collections'}
                    </h2>
                    <p className="text-lg text-dark/70 max-w-2xl mx-auto">
                        {t('ramadan.subtitle') || 'Curated pickle selections designed for Ramadan tables and longer stocking.'}
                    </p>
                </div>

                {/* Collection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayProducts.map((product: any) => {
                        const isArabic = locale.language === 'AR';
                        const tagline = isArabic
                            ? product.metafields?.find((m: any) => m?.key === 'arabic_tagline')?.value || product.metafields?.find((m: any) => m?.key === 'tagline')?.value
                            : product.metafields?.find((m: any) => m?.key === 'tagline')?.value;

                        return (
                            <div key={product.id} className="group relative flex flex-col">
                                {/* Image */}
                                <Link to={`${locale.pathPrefix}/products/${product.handle}`} className=" overflow-hidden rounded-2xl bg-[#F9F7F2] mb-6">
                                    {product.featuredImage && (
                                        <Image
                                            data={product.featuredImage}
                                            className="h-full w-full object-contain transform transition-transform duration-700 group-hover:scale-105"
                                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                                        />
                                    )}
                                </Link>

                                {/* Content */}
                                <div className="flex-1 flex flex-col text-center">
                                    <h3 className="font-serif text-xl text-primary mb-2 group-hover:text-secondary transition-colors">
                                        <Link to={`${locale.pathPrefix}/products/${product.handle}`}>
                                            {getLocalizedTitle(product.title, product.metafields as any, locale.language)}
                                        </Link>
                                    </h3>


                                    {tagline && (
                                        <p className="text-sm text-dark/70 mb-4 line-clamp-2 min-h-[40px]">
                                            {tagline}
                                        </p>
                                    )}

                                    <div className="mt-auto">
                                        <Link
                                            to={`${locale.pathPrefix}/products/${product.handle}`}
                                            className="inline-block border-b border-primary text-primary text-sm font-bold uppercase tracking-widest hover:text-secondary hover:border-secondary transition-colors pb-1"
                                        >
                                            {t('ramadan.explore') || 'Explore Collection'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <Link
                        to={`${locale.pathPrefix}/collections/ramadan-moments`}
                        className="btn-secondary px-10 py-3"
                    >

                        {t('ramadan.viewAll') || 'Explore All Ramadan Collections'}
                    </Link>
                </div>
            </div>
        </section>
    );
}
