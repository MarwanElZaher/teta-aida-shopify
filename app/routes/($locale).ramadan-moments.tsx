import { type LoaderFunctionArgs } from 'react-router';
import { useLoaderData, type MetaFunction } from 'react-router';
import { Image } from '@shopify/hydrogen';
import { useTranslation } from '~/lib/translations';
import { getLocalizedTitle } from '~/lib/localized-content';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: 'Ramadan Moments | Hosting & Suhoor Bundles | Teta Aida' },
        { name: 'description', content: 'Discover Teta Aida’s Ramadan Moments — curated bundles crafted for hosting, gifting, and daily suhoor. Premium small-batch flavors delivered fresh across Cairo.' },
        { name: 'keywords', content: 'Ramadan hosting box Egypt, suhoor bundle Cairo, Ramadan food bundles Egypt, premium pickles Ramadan, cheese and pickles Ramadan, Teta Aida Ramadan' },
    ];
};

export async function loader({ context }: LoaderFunctionArgs) {
    const { storefront } = context;

    const { collection } = await storefront.query(COLLECTION_QUERY, {
        variables: {
            handle: 'ramadan-moments',
            country: storefront.i18n.country,
            language: storefront.i18n.language,
        },
    });

    if (!collection) {
        throw new Response('Collection Not Found', { status: 404 });
    }

    return {
        collection,
        locale: storefront.i18n,
    };
}

export default function RamadanMomentsPage() {
    const { collection, locale } = useLoaderData<typeof loader>();
    const { t } = useTranslation();
    const isArabic = locale.language === 'AR';

    return (
        <div className="bg-[#F9F7F2] min-h-screen pb-24">
            {/* Page Header */}
            <div className="pt-32 pb-16 text-center px-4">
                <h1 className="font-serif text-4xl md:text-5xl text-primary mb-6">
                    🌙 {isArabic ? 'لحظات رمضان' : 'Ramadan Moments'}
                </h1>
                <p className="text-lg md:text-xl text-dark/70 max-w-2xl mx-auto leading-relaxed font-serif">
                    {isArabic
                        ? 'مجموعات مختارة بعناية للاستضافة، والهدايا، وموائد السحور المريحة.'
                        : 'Curated pairings crafted for hosting, gifting, and comfortable suhoor tables.'
                    }
                </p>
            </div>

            {/* Collection Grid */}
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                    {collection.products.nodes.map((product: any) => {
                        const title = getLocalizedTitle(product.title, product.metafields as any, locale.language);
                        const tagline = isArabic
                            ? product.metafields?.find((m: any) => m?.key === 'arabic_tagline')?.value || product.metafields?.find((m: any) => m?.key === 'tagline')?.value
                            : product.metafields?.find((m: any) => m?.key === 'tagline')?.value;

                        return (
                            <div key={product.id} className="group relative flex flex-col">
                                {/* Image */}
                                <a
                                    href={`${locale.pathPrefix}/products/${product.handle}`}
                                    className="overflow-hidden rounded-2xl bg-white mb-6 aspect-[4/3] flex items-center justify-center hover-lift shadow-sm"
                                >
                                    {product.featuredImage && (
                                        <Image
                                            data={product.featuredImage}
                                            className="h-full w-full object-contain transform transition-transform duration-700 group-hover:scale-105"
                                            sizes="(min-width: 1024px) 50vw, 100vw"
                                        />
                                    )}
                                </a>

                                {/* Content */}
                                <div className="flex-1 flex flex-col text-center gap-2">
                                    <h3 className="font-serif text-2xl text-primary mb-3 group-hover:text-secondary transition-colors">
                                        <a href={`${locale.pathPrefix}/products/${product.handle}`}>
                                            {title}
                                        </a>
                                    </h3>

                                    {tagline && (
                                        <p className="text-base text-dark/70 mb-8 line-clamp-3 min-h-[72px] px-4 font-serif italic">
                                            {tagline}
                                        </p>
                                    )}

                                    <div className="mt-auto">
                                        <a
                                            href={`${locale.pathPrefix}/products/${product.handle}`}
                                            className="inline-block bg-primary text-white font-bold uppercase tracking-widest text-xs px-10 py-4 rounded-xl hover:bg-[#143d24] transition-all shadow-sm hover:shadow-md hover-lift"
                                        >
                                            {isArabic ? 'تسوق الآن' : 'Shop Now'}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const COLLECTION_QUERY = `#graphql
  query RamadanMomentsCollection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      products(first: 20) {
        nodes {
          id
          title
          handle
          featuredImage {
            id
            url
            altText
            width
            height
          }
          metafields(identifiers: [
            {namespace: "custom", key: "tagline"},
            {namespace: "custom", key: "arabic_tagline"},
            {namespace: "custom", key: "arabic_title"}
          ]) {
            key
            value
          }
        }
      }
    }
  }
` as const;
