import { Disclosure } from '@headlessui/react';

export const meta = () => {
    return [{ title: 'FAQ | Teta Aida' }];
};

const faqs = [
    {
        category: "Orders & Delivery",
        items: [
            { q: "How long does delivery take?", a: "Delivery times depend on courier routing:\n• 1–2 working days: New Cairo, Nasr City, Heliopolis, Sheraton\n• Up to 7–10 working days: Other serviced Cairo districts\n\nYou will receive a confirmation message once your order is on its way." },
            { q: "Do you deliver outside Cairo?", a: "Currently, we deliver across Greater Cairo. New areas will be added soon." },
            { q: "How much is the delivery fee?", a: "Delivery fees depend on your location. You will see the exact fee at checkout." },
            { q: "How do I track my order?", a: "The courier will call you and text you via WhatsApp to arrange pickup. You can track it by directly contacting the courier." },
            { q: "What happens if I miss the delivery?", a: "The courier will attempt to deliver twice. If both attempts fail, the order may be cancelled and delivery fees may apply twice." }
        ]
    },
    {
        category: "Product Details",
        items: [
            { q: "What are the jar weights?", a: "Each jar includes a Gross Weight of 1 Kg." },
            { q: "Are all products handmade?", a: "Yes — everything is small-batch crafted using clean, natural ingredients." },
            { q: "Do the jars have heat level options?", a: "Yes — all jars come with heat-level selection:\n• Tuffaahy Olives: Mild / Normal / Spicy\n• Cucumbers: Mild / Normal\n• Tangerine Cabbage: Mild / Normal\n• Harissa Lemons: Mild / Spicy" },
            { q: "Do you use preservatives?", a: "No artificial preservatives. Only clean, fresh ingredients." },
            { q: "How long do the products last?", a: "Shelf life varies per item. Please store jars in a cool place and refrigerate after opening." }
        ]
    },
    {
        category: "Payments",
        items: [
            { q: "How can I pay?", a: "We accept Cash on Delivery (COD) and Instapay." },
            { q: "Is there a minimum order?", a: "No minimum order." },
            { q: "Do you offer discounts?", a: "Occasionally on selected bundles and promotional campaigns." }
        ]
    },
    {
        category: "Returns & Refunds",
        items: [
            { q: "Can I return a jar if I don’t like the taste?", a: "For safety reasons, we cannot accept opened jars or items returned due to personal preference." },
            { q: "What if the product arrives damaged?", a: "We will replace or refund immediately. Please send us a photo within 24 hours." },
            { q: "What if I received the wrong item?", a: "We’ll arrange a replacement as quickly as possible." },
            { q: "How do I request a return?", a: "Contact us on WhatsApp with your Order number, Photo/video, and Issue description. We respond within 1 business day." }
        ]
    }
];

export default function FAQ() {
    return (
        <div className="faq-page py-16 sm:py-24">
            <div className="mx-auto max-w-3xl px-4">
                <h1 className="mb-12 text-center text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>

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
                                                    <span className={`ml-6 flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform ${open ? 'rotate-180' : ''}`}>
                                                        ↓
                                                    </span>
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="mt-4 whitespace-pre-line text-gray-600">
                                                    {item.a}
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
