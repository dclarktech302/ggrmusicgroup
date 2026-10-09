'use client'

import Image from 'next/image'
import SimpleLightbox from './simple-lightbox'
import * as React from 'react'
import type { ShowsImage } from '@/lib/types'

export default function ContentSection({ featured, gallery }: { featured: ShowsImage[]; gallery: ShowsImage[] }) {
    const [lightboxOpen, setLightboxOpen] = React.useState(false)
    const [currentImage, setCurrentImage] = React.useState<ShowsImage | null>(null)

    const openLightbox = (image: ShowsImage) => {
        setCurrentImage(image)
        setLightboxOpen(true)
    }

    const closeLightbox = () => {
        setLightboxOpen(false)
        setCurrentImage(null)
    }
    return (
        <section id="shows" className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
                <div className="mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-balance text-4xl font-medium lg:text-5xl">Shows and Events</h2>
                </div>

                {featured.map((image, i) => (
                    <div key={image.src} className="mx-auto max-w-xl space-y-4 text-center">
                        <Image
                            className="h-auto w-full rounded-(--radius) cursor-pointer hover:opacity-90 transition-opacity"
                            src={image.src}
                            alt={image.alt}
                            width={image.width}
                            height={image.height}
                            sizes="(min-width: 576px) 576px, 100vw"
                            placeholder="blur"
                            blurDataURL={image.blurDataURL}
                            // First featured image is the page's LCP element; the rest load lazily.
                            loading={i === 0 ? 'eager' : 'lazy'}
                            fetchPriority={i === 0 ? 'high' : 'auto'}
                            onClick={() => openLightbox(image)}
                        />
                    </div>
                ))}

                <SimpleLightbox images={gallery} />

                {/* Individual Image Lightbox */}
                {lightboxOpen && currentImage && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        <div className="relative max-w-4xl max-h-full p-4">
                            <Image
                                src={currentImage.src}
                                alt={currentImage.alt}
                                width={currentImage.width}
                                height={currentImage.height}
                                sizes="(min-width: 896px) 896px, 100vw"
                                className="h-auto max-h-[90vh] w-auto max-w-full object-contain"
                                placeholder="blur"
                                blurDataURL={currentImage.blurDataURL}
                                loading="eager"
                                onClick={(e) => e.stopPropagation()}
                            />

                            <button
                                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 transition-all duration-200 hover:bg-opacity-70 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                                onClick={closeLightbox}
                                aria-label="Close lightbox"
                            >
                                <svg className="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
