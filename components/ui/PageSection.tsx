/**
 * PageSection Component
 * 
 * A reusable layout wrapper component that provides consistent styling
 * and background for all RSVP pages.
 * 
 * FEATURES:
 * - Responsive padding and centering
 * - Gradient background (blush to sky)
 * - Framer Motion animation support
 * - Flexible content rendering via children prop
 */

'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageSectionProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageSection Component
 * 
 * @param children - Content to render inside the section
 * @param className - Additional Tailwind CSS classes
 */
export default function PageSection({ children, className = '' }: PageSectionProps) {
  return (
    <section
      className={`min-h-screen w-full bg-gradient-to-br from-blush-50 via-white to-sky-50 flex items-center justify-center p-4 md:p-8 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {children}
      </motion.div>
    </section>
  );
}
