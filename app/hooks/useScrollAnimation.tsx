import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 * @param threshold - Percentage of element visibility to trigger animation (0-1)
 * @param rootMargin - Margin around root element for early/late triggering
 * @returns ref to attach to element and isVisible state
 */
export function useScrollAnimation(threshold = 0.1, rootMargin = '0px') {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Once visible, stop observing
                    if (ref.current) {
                        observer.unobserve(ref.current);
                    }
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold, rootMargin]);

    return { ref, isVisible };
}
