'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChartBarIncreasingIcon, Mic, Music, Users } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function FeaturesWithImages() {
    type ImageKey = 'item-1' | 'item-2' | 'item-3' | 'item-4'
    const [activeItem, setActiveItem] = useState<ImageKey>('item-1')

    const images = {
        'item-1': {
            image: '/images/artistic_setting.jpg',
            alt: 'Man standing around graffiti',
        },
        'item-2': {
            image: '/images/sound_board.jpg',
            alt: 'High quality soundboard for music recording',
        },
        'item-3': {
            image: '/images/guitar_amps.jpg',
            alt: 'Guitar amplifiers for music recording',
        },
        'item-4': {
            image: '/images/piano_instructor_student.jpg',
            alt: 'Piano instructor and student',
        },
    }

    return (
        <section className="py-12 md:pb-20 lg:pb-32">
            <div className="bg-linear-to-b absolute inset-0 -z-10 sm:inset-6 sm:rounded-b-3xl dark:block dark:to-[color-mix(in_oklab,var(--color-zinc-900)_75%,var(--color-background))]"></div>
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20 dark:[--color-border:color-mix(in_oklab,var(--color-white)_10%,transparent)]">
                <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-6xl">What We Offer</h2>
                    <p>GGR Music Group offers a comprehensive suite of services designed to support artists and music professionals at every stage of their career.</p>
                </div>

                <div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
                    <Accordion
                        type="single"
                        value={activeItem}
                        onValueChange={(value) => setActiveItem(value as ImageKey)}
                        className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <ChartBarIncreasingIcon className="size-4" />
                                    Promotion and Marketing Packages
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Comprehensive packages to suite the need at any stage of your creative career in the entertainment industry.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <Music className="size-4" />
                                    Music Production and Distribution
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Experience enterprise level studio-quality production with our professional recording and mixing services.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <Mic className="size-4" />
                                    Artist Spotlight and Performances
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Get featured on our platform to reach a wider audience and connect with fans.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <Users className="size-4" />
                                    Community Support and Growth
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Join our community of artists and creators to network, collaborate, and grow together.</AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className="bg-background relative flex overflow-hidden rounded-3xl border p-2">
                        <div className="w-15 absolute inset-0 right-0 ml-auto border-l"></div>
                        <div className="aspect-76/59 bg-background relative w-[calc(3/4*100%+3rem)] rounded-2xl">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${activeItem}-id`}
                                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className="size-full overflow-hidden rounded-2xl border bg-zinc-900 shadow-md">
                                    <img
                                        src={images[activeItem].image}
                                        className="size-full object-cover object-left-top dark:mix-blend-lighten"
                                        alt={images[activeItem].alt}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
