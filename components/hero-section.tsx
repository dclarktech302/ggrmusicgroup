'use client'

import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { HeroHeader } from '@/components/header'
import type { Variants } from 'motion/react'
import * as React from 'react'


const transitionVariants: { item: Variants } = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = React.useState(0)
    const [isPaused] = React.useState(false)
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

    const carouselImages = [
        {
            src: "/images/3d-music-related-scene.jpg",
            alt: "3D music visualization",
            title: "Live Performances",
            description: "Experience the energy of live music events"
        },
        {
            src: "/images/3f56658e-7c79-42ae-bed1-38c3f6ff7b4c.jpg",
            alt: "music festival",
            title: "Artist Showcases",
            description: "Discover talented local and regional artists"
        },
        {
            src: "/images/back-view-audience-with-arms-raised-front-stage-music-concert.jpg",
            alt: "music concert",
            title: "Community Events",
            description: "Join our growing music community"
        }
    ]

    const resetTimer = React.useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }
        if (!isPaused) {
            intervalRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
            }, 5000)
        }
    }, [isPaused, carouselImages.length])

    const nextSlide = React.useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
        resetTimer()
    }, [carouselImages.length, resetTimer])

    const prevSlide = React.useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
        resetTimer()
    }, [carouselImages.length, resetTimer])

    React.useEffect(() => {
        if (!isPaused) {
            intervalRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
            }, 5000)
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isPaused, carouselImages.length])
    return (
        <>
            <HeroHeader />

            <main className="overflow-hidden [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-green-600)]">
                <section className="relative min-h-screen">
                    {/* Background Carousel */}
                    <div className="absolute inset-0">
                        {carouselImages.map((image, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                    }`}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                {/* Dark overlay for text readability */}
                                <div className="absolute inset-0 bg-black/50" />
                            </div>
                        ))}
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10 mx-auto max-w-6xl px-6 pb-32 pt-48 lg:pt-64">
                        <div className="mx-auto max-w-4xl text-center space-y-8">
                            <TextEffect
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h1"
                                className="text-balance text-5xl font-medium md:text-6xl text-white">
                                GGR Music Group
                            </TextEffect>
                            <TextEffect
                                per="line"
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                delay={0.5}
                                as="p"
                                className="mx-auto max-w-2xl text-pretty text-lg text-gray-200">
                                Welcome to the next generation of entertainment on the Eastern Shore
                            </TextEffect>

                            <AnimatedGroup
                                variants={{
                                    container: {
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.05,
                                                delayChildren: 0.75,
                                            },
                                        },
                                    },
                                    ...transitionVariants,
                                }}
                                className="mt-12">

                                {/* Email CTA Form */}
                                {/* <form
                                    onSubmit={handleSubmit}
                                    className="mx-auto max-w-sm">
                                    <div className="bg-background/90 backdrop-blur-sm has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.5rem)] border pr-2 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
                                        <Mail className="pointer-events-none absolute inset-y-0 left-4 my-auto size-4" />

                                        <input
                                            placeholder="Your mail address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-12 w-full bg-transparent pl-12 pr-4 text-white focus:outline-none placeholder:text-gray-300"
                                            type="email"
                                            required
                                        />

                                        <div className="md:pr-1.5 lg:pr-0">
                                            <Button
                                                type="submit"
                                                aria-label="submit"
                                                size="sm"
                                                className="rounded-(--radius) bg-blue-600 hover:bg-blue-700 text-white">
                                                <span className="hidden md:block text-white">Get Started</span>
                                                <SendHorizonal
                                                    className="relative mx-auto size-5 md:hidden text-white"
                                                    strokeWidth={2}
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                </form> */}
                            </AnimatedGroup>
                        </div>
                    </div>

                    {/* Carousel Controls and Indicators - Bottom Position */}
                    <div className="absolute bottom-8 left-0 right-0 z-10">
                        <div className="flex flex-col items-center gap-4">
                            {/* Carousel Controls */}
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={prevSlide}
                                    className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                                    aria-label="Previous slide"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <button
                                    onClick={nextSlide}
                                    className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                                    aria-label="Next slide"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Carousel Indicators */}
                            <div className="flex justify-center gap-2">
                                {carouselImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
