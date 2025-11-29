export const meta = () => {
    return [{ title: 'Contact Us | Teta Aida' }];
};

export default function Contact() {
    return (
        <div className="contact-page py-16 sm:py-24">
            <div className="mx-auto max-w-4xl px-4 text-center">
                <h1 className="mb-6 text-4xl font-bold text-gray-900">We’re here to help.</h1>
                <p className="mb-12 text-lg text-gray-600">
                    Whether you have a question about flavors, heat levels, orders, or delivery — we’re always happy to assist.
                </p>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                    <div className="rounded-xl bg-[#F9F7F2] p-8 transition-transform hover:-translate-y-1">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">📞</div>
                        <h3 className="mb-2 text-lg font-bold text-gray-900">WhatsApp Support</h3>
                        <p className="font-medium text-green-800">+20 107 098 5360</p>
                    </div>

                    <div className="rounded-xl bg-[#F9F7F2] p-8 transition-transform hover:-translate-y-1">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">📧</div>
                        <h3 className="mb-2 text-lg font-bold text-gray-900">Email</h3>
                        <a href="mailto:tetaaidapickles@gmail.com" className="font-medium text-green-800 hover:underline">
                            tetaaidapickles@gmail.com
                        </a>
                    </div>

                    <div className="rounded-xl bg-[#F9F7F2] p-8 transition-transform hover:-translate-y-1">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">🕓</div>
                        <h3 className="mb-2 text-lg font-bold text-gray-900">Support Hours</h3>
                        <p className="text-gray-600">10:00 AM – 10:00 PM</p>
                        <p className="text-sm text-gray-500">(Cairo Time, 7 days a week)</p>
                    </div>
                </div>

                <div className="mt-16">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">Location</h3>
                    <p className="text-gray-600">Cairo, Egypt</p>
                </div>
            </div>
        </div>
    );
}
