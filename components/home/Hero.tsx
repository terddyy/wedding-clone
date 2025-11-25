'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
    return (
        <section className="h-screen flex flex-col relative overflow-hidden">
            {/* Top Block - 35% */}
            <div className="h-[35%] bg-[#D2B48C] relative flex flex-col justify-center items-center text-center px-4 z-10">

                {/* Main Title Group */}
                <div className="relative mt-auto mb-6 md:mb-8">
                    {/* Accent Script */}
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="font-script text-2xl md:text-4xl text-white absolute -top-6 md:-top-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-20"
                        style={{ fontFamily: 'var(--font-pinyon)' }}
                    >
                        to have and to hold
                    </motion.span>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-none"
                        style={{ fontFamily: 'var(--font-bodoni)' }}
                    >
                        WE DO
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-2xl md:text-3xl text-white/90 font-light mt-3 tracking-wider"
                        style={{ fontFamily: 'var(--font-montserrat)' }}
                    >
                        JHE & EIFER
                    </motion.p>
                </div>

                {/* Details */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-col md:flex-row items-center gap-2 md:gap-8 text-white/90 text-[10px] md:text-xs uppercase tracking-[0.2em] font-sans mb-auto"
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                    <span>#Jheifer2025</span>
                    <span className="hidden md:inline">•</span>
                    <span className="font-bold text-base md:text-lg">December 21, 2025 - 4:00 PM</span>
                    <span className="hidden md:inline">•</span>
                    <span>Marikina City</span>
                </motion.div>

                {/* Navigation - Bottom of Header Block */}
                <motion.nav
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="absolute bottom-0 left-0 w-full flex justify-center pb-3 md:pb-5"
                >
                    <ul className="flex gap-6 md:gap-12 text-white text-[10px] md:text-xs uppercase tracking-widest font-medium" style={{ fontFamily: 'var(--font-montserrat)' }}>
                        <li>
                            <Link href="/home" className="hover:text-white/70 transition-colors">Home</Link>
                        </li>
                        <li>
                            <Link href="/home#our-journey" className="hover:text-white/70 transition-colors">Photos</Link>
                        </li>
                        <li>
                            <Link href="/home#rsvp" className="hover:text-white/70 transition-colors">RSVP</Link>
                        </li>
                    </ul>
                </motion.nav>
            </div>
            {/* Bottom section with background image */}
            <div className="h-[65%] relative bg-neutral-200">
                <Image
                src="/images/hero-couple.JPG"
                alt="Jhe & Eifer posing together"
                fill
                className="object-cover object-top"
                priority
                />
            </div>
        </section>
    );
}
