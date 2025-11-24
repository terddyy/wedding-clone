'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const galleryItems = [
    {
        id: 1,
        src: '/images/IMG_9722.JPG',
        alt: 'Couple Photo 1',
    },
    {
        id: 2,
        src: '/images/IMG_9724.JPG',
        alt: 'Couple Photo 2',
    },
    {
        id: 3,
        src: '/images/IMG_9717.JPG',
        alt: 'Couple Photo 3',
    },
    {
        id: 4,
        src: '/images/IMG_9765.JPG',
        alt: 'Couple Photo 4',
    },
    {
        id: 5,
        src: '/images/IMG_9755.JPG',
        alt: 'Couple Photo 5',
    },
    {
        id: 6,
        src: '/images/IMG_9728.JPG', // Replaced with requested image
        alt: 'Couple Photo 6 (IMG_9728)',
    },
];

export default function Gallery() {
    return (
        <section id="our-journey" className="py-24 bg-[#faf8f5]" aria-label="Captured Moments - Our Journey">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="font-script text-3xl text-[#8b7355] block mb-2" style={{ fontFamily: 'var(--font-pinyon)' }}>
                        captured moments
                    </span>
                    <h2 className="text-5xl md:text-6xl text-[#2c2c2c]" style={{ fontFamily: 'var(--font-bodoni)' }}>
                        OUR JOURNEY
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-md group"
                        >
                            <Image
                                src={item.src}
                                alt={item.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Subtle overlay on hover */}
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
