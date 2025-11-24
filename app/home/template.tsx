'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 1.5 }}
            className="min-h-screen bg-[#faf8f5]"
        >
            {children}
        </motion.div>
    );
}
