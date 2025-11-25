'use client';

import { motion } from 'framer-motion';

export default function VideoSection() {
    return (
        <section id="video" className="py-20 bg-white" aria-label="Our Video">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-5xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
                        Our Story
                    </h2>
                    <div className="aspect-w-16 aspect-h-9 relative" style={{ paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', background: '#000' }}>
                        <iframe 
                            src="https://www.youtube.com/embed/L0DNAfHk8LU?si=Hpdn0PlrzVR4giZC" 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full"
                        ></iframe>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
