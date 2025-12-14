import { Disclosure, Transition } from '@headlessui/react';
import { useTranslation, TRANSLATIONS } from '~/lib/translations';

export const meta = ({ params }: { params: { locale?: string } }) => {
    const locale = params.locale?.toUpperCase() === 'AR' ? 'AR' : 'EN';
    return [{ title: TRANSLATIONS[locale].faq.meta_title }];
};

export default function FAQ() {
    const { t } = useTranslation();

    const faqs = [
        {
            category: t('faq.category.orders'),
            items: [
                { q: t('faq.orders.delivery_time.q'), a: t('faq.orders.delivery_time.a') },
                { q: t('faq.orders.delivery_outside.q'), a: t('faq.orders.delivery_outside.a') },
                { q: t('faq.orders.delivery_fee.q'), a: t('faq.orders.delivery_fee.a') },
                { q: t('faq.orders.track_order.q'), a: t('faq.orders.track_order.a') },
                { q: t('faq.orders.miss_delivery.q'), a: t('faq.orders.miss_delivery.a') }
            ]
        },
        {
            category: t('faq.category.products'),
            items: [
                { q: t('faq.products.turnips.q'), a: t('faq.products.turnips.a') },
                { q: t('faq.products.jar_weights.q'), a: t('faq.products.jar_weights.a') },
                { q: t('faq.products.handmade.q'), a: t('faq.products.handmade.a') },
                { q: t('faq.products.heat_levels.q'), a: t('faq.products.heat_levels.a') },
                { q: t('faq.products.preservatives.q'), a: t('faq.products.preservatives.a') },
                { q: t('faq.products.shelf_life.q'), a: t('faq.products.shelf_life.a') }
            ]
        },
        {
            category: t('faq.category.payments'),
            items: [
                { q: t('faq.payments.payment_methods.q'), a: t('faq.payments.payment_methods.a') },
                { q: t('faq.payments.minimum_order.q'), a: t('faq.payments.minimum_order.a') },
                { q: t('faq.payments.discounts.q'), a: t('faq.payments.discounts.a') }
            ]
        },
        {
            category: t('faq.category.returns'),
            items: [
                { q: t('faq.returns.return_taste.q'), a: t('faq.returns.return_taste.a') },
                { q: t('faq.returns.damaged.q'), a: t('faq.returns.damaged.a') },
                { q: t('faq.returns.wrong_item.q'), a: t('faq.returns.wrong_item.a') },
                { q: t('faq.returns.request_return.q'), a: t('faq.returns.request_return.a') }
            ]
        }
    ];

    return (
        <div className="faq-page py-16 sm:py-24">
            <div className="mx-auto max-w-3xl px-4">
                <h1 className="mb-12 text-center text-4xl font-bold text-gray-900">{t('faq.title')}</h1>

                <div className="space-y-12">
                    {faqs.map((section, idx) => (
                        <div key={idx}>
                            <h2 className="mb-6 text-2xl font-bold text-green-900 border-b pb-2">{section.category}</h2>
                            <div className="space-y-4">
                                {section.items.map((item, i) => (
                                    <Disclosure key={i} as="div" className="rounded-lg bg-gray-50 p-4">
                                        {({ open }) => (
                                            <>
                                                <Disclosure.Button className="flex w-full justify-between text-left text-lg font-medium text-gray-900 focus:outline-none">
                                                    <span>{item.q}</span>
                                                    <span className={`ml-6 flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
                                                        ↓
                                                    </span>
                                                </Disclosure.Button>
                                                <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                                    <div className="overflow-hidden">
                                                        <Disclosure.Panel static className="mt-4 whitespace-pre-line text-gray-600">
                                                            {item.a}
                                                        </Disclosure.Panel>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </Disclosure>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
}
