import { Money } from '@shopify/hydrogen';
import type { ProductVariant } from '@shopify/hydrogen/storefront-api-types';
import { useEffect, useState } from 'react';

interface StickyCTAProps {
    title: string;
    price: ProductVariant['price'];
    available: boolean;
    children: React.ReactNode;
    isVisible: boolean;
}

export function StickyCTA({ title, price, available, children, isVisible }: StickyCTAProps) {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
        } else {
            // Delay unmounting for exit animation if needed, or just unmount
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    if (!shouldRender && !isVisible) return null;

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-50 border-t border-primary/10 bg-[#F9F7F2]/95 backdrop-blur-md p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-full'
                }`}
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-sm font-serif font-bold text-primary line-clamp-1">{title}</span>
                    <span className="text-sm font-sans font-medium text-secondary">
                        {price && <Money data={price} />}
                    </span>
                </div>
                <div className="w-1/2">
                    {children}
                </div>
            </div>
        </div>
    );
}
