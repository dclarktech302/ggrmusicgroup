'use client'

import SimpleLightbox from './simple-lightbox'
import * as React from 'react'

export default function ContentSection() {
    const [lightboxOpen, setLightboxOpen] = React.useState(false)
    const [currentImage, setCurrentImage] = React.useState('')

    const openLightbox = (imageSrc: string) => {
        setCurrentImage(imageSrc)
        setLightboxOpen(true)
    }

    const closeLightbox = () => {
        setLightboxOpen(false)
        setCurrentImage('')
    }
    return (
        <section id="shows" className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
                <div className="mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-balance text-4xl font-medium lg:text-5xl">Shows and Events</h2>
                </div>

                <div className="mx-auto max-w-xl space-y-4 text-center">
                    <img
                        className="rounded-(--radius) cursor-pointer hover:opacity-90 transition-opacity"
                        src="/images/ghocasev-8.webp"
                        alt="Gho Case V event photography"
                        loading="lazy"
                        onClick={() => openLightbox('/images/ghocasev-8.webp')}
                    />
                </div>

                <div className="mx-auto max-w-xl space-y-4 text-center">
                    <img
                        className="rounded-(--radius) cursor-pointer hover:opacity-90 transition-opacity"
                        src="/images/img-4498.webp"
                        alt="GGR & Friends Part 2 event photography"
                        loading="lazy"
                        onClick={() => openLightbox('/images/img-4498.webp')}
                    />
                </div>

                <SimpleLightbox />

                {/* Individual Image Lightbox */}
                {lightboxOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        <div className="relative max-w-4xl max-h-full p-4">
                            <img
                                src={currentImage}
                                alt="Event photography"
                                className="max-w-full max-h-full object-contain"
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
