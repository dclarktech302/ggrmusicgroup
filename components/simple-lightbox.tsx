'use client'

import * as React from "react";

export default function SimpleLightbox() {
  const [open, setOpen] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState(0);

  const images = [
    {
      src: "/images/hst5409-enhanced-nr.JPG",
      alt: "Live music performance with dynamic lighting effects",
    },
    {
      src: "/images/0286CBA7-8496-4BA6-B2F7-ACC9691751B1.JPG",
      alt: "Music event crowd enjoying live performance",
    },
    {
      src: "/images/IMG_4045.jpeg",
      alt: "Concert venue with stage setup and lighting rig",
    },
    {
      src: "/images/IMG_4515.jpeg",
      alt: "Musician performing on stage with instruments",
    },
    {
      src: "/images/IMG_4510.jpeg",
      alt: "Audience view from concert photography",
    },
    {
      src: "/images/hst3437-enhanced-nr.JPG",
      alt: "Enhanced concert photography with vibrant stage lighting",
    },
    {
      src: "/images/IMG_4508.jpeg",
      alt: "Live music event with stage production",
    },
    {
      src: "/images/photo_095202374210.jpg",
      alt: "Live music event with stage production",
    },
    {
      src: "/images/photo_0915202381027.jpg",
      alt: "Live music event with stage production",
    },
  ];

  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setOpen(true);
  };

  const nextImage = React.useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = React.useCallback(() => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const closeLightbox = () => {
    setOpen(false);
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open) return;

      switch (event.key) {
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'Escape':
          closeLightbox();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, nextImage, prevImage]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className="cursor-pointer rounded-lg object-cover w-full h-32"
            onClick={() => openLightbox(index)}
          />
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <img
              src={images[currentImage].src}
              alt={images[currentImage].alt}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
              onClick={closeLightbox}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
