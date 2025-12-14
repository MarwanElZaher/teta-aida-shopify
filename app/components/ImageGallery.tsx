import { useState } from 'react';
import { Image } from '@shopify/hydrogen';

interface ImageGalleryProps {
    images: any[]; // Using any to accommodate GraphQL media response structure
    productTitle: string;
}

export function ImageGallery({ images, productTitle }: ImageGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    if (!images || images.length === 0) {
        return null;
    }

    const selectedImage = images[selectedImageIndex];

    return (
        <div className="image-gallery">
            {/* Main Image Display */}
            <div className="relative overflow-hidden rounded-2xl bg-[#F0EFEB] mb-4">
                {selectedImage?.image && (
                    <Image
                        data={selectedImage.image}
                        className="h-full w-full object-contain transition-opacity duration-300"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        alt={selectedImage.image.altText || `${productTitle} - Image ${selectedImageIndex + 1}`}
                    />
                )}
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((mediaItem, index) => (
                        <button
                            key={mediaItem.id || index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                ? 'border-primary ring-2 ring-primary ring-offset-2'
                                : 'border-dark/20 hover:border-primary/50'
                                }`}
                            aria-label={`View image ${index + 1}`}
                        >
                            {mediaItem.image && (
                                <Image
                                    data={mediaItem.image}
                                    className="h-full w-full object-cover"
                                    sizes="80px"
                                    alt={mediaItem.image.altText || `${productTitle} thumbnail ${index + 1}`}
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
