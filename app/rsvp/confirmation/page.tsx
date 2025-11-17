/**
 * RSVP Stage 3: Confirmation Page
 * 
 * ROUTE: /rsvp/confirmation
 * 
 * PURPOSE:
 * Celebrate successful RSVP submission and guide guests to next steps.
 * 
 * USER FLOW:
 * 1. Guest lands after successful RSVP submission
 * 2. See animated success checkmark
 * 3. Read "What's Next?" guidance cards
 * 4. Navigate to other site sections or contact couple
 * 
 * FEATURES:
 * - Animated success icon (Framer Motion)
 * - Three guidance cards (Save Date, Plan Trip, Registry)
 * - Contact section with email link
 * - Navigation buttons to home and itinerary
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageSection from '@/components/ui/PageSection';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function RSVPConfirmationPage() {
  const router = useRouter();

  /**
   * Clear any remaining session data on mount
   * This is a safety measure in case session wasn't cleared before redirect
   */
  useEffect(() => {
    sessionStorage.removeItem('rsvp_session');
    sessionStorage.removeItem('guest_info');
  }, []);

  return (
    <PageSection>
      <div className="text-center">
        {/* Success Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          {/* Checkmark Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6" style={{ backgroundColor: '#e8d5c4' }}
          >
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: '#8b7355' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-normal mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#2c2c2c' }}>
              Thank You!
            </h1>
            <p className="text-xl mb-2" style={{ fontFamily: "'Montserrat', sans-serif", color: '#6b6b6b' }}>
              Your RSVP has been received
            </p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", color: '#6b6b6b' }}>
              We can't wait to celebrate with you!
            </p>
          </motion.div>
        </motion.div>

        {/* What's Next Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="rounded-lg shadow-md p-8 md:p-12 mb-8" style={{ backgroundColor: '#f5e6d3' }}
        >
          <h2 className="text-2xl font-normal mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#2c2c2c' }}>
            What's Next?
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Save the Date */}
            <div className="text-center">
              <div className="rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e8d5c4' }}>
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: '#8b7355' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#2c2c2c', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem' }}>
                Save the Date
              </h3>
              <p className="text-sm" style={{ color: '#6b6b6b' }}>
                December 21, 2025
              </p>
              <p className="text-xs mt-1" style={{ color: '#6b6b6b' }}>
                Mark your calendar!
              </p>
            </div>

            {/* Card 2: Plan Your Trip */}
            <div className="text-center">
              <div className="rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e8d5c4' }}>
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: '#8b7355' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#2c2c2c', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem' }}>
                Plan Your Trip
              </h3>
              <p className="text-sm" style={{ color: '#6b6b6b' }}>
                Check out venue information
              </p>
              <button
                onClick={() => router.push('/#venue')}
                className="text-xs underline mt-1 hover:font-semibold"
                style={{ color: '#8b7355' }}
              >
                View Venue Details
              </button>
            </div>

            {/* Card 3: Registry */}
            <div className="text-center">
              <div className="rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e8d5c4' }}>
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: '#8b7355' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#2c2c2c', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem' }}>
                Check Our Registry
              </h3>
              <p className="text-sm" style={{ color: '#6b6b6b' }}>
                Your presence is the best gift
              </p>
              <button
                onClick={() => router.push('/#registry')}
                className="text-xs underline mt-1 hover:font-semibold"
                style={{ color: '#8b7355' }}
              >
                View Registry
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 rounded-lg font-semibold transition-shadow shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#8b7355', color: '#f5e6d3' }}
            >
              Back to Home
            </button>
            <button
              onClick={() => router.push('/#itinerary')}
              className="px-6 py-3 rounded-lg font-semibold transition-shadow shadow-md hover:shadow-lg border-2"
              style={{ borderColor: '#8b7355', color: '#8b7355', backgroundColor: 'transparent' }}
            >
              View Itinerary
            </button>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="rounded-lg p-6 text-center" style={{ backgroundColor: '#e8d5c4' }}
        >
          <h3 className="font-semibold mb-2" style={{ color: '#2c2c2c', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem' }}>
            Questions or Changes?
          </h3>
          <p className="mb-4" style={{ color: '#6b6b6b' }}>
            Need to update your RSVP or have questions about the big day?
          </p>
          <a
            href="mailto:terddy03@gmail.com"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow font-semibold" style={{ backgroundColor: '#f5e6d3', color: '#8b7355' }}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Contact Us
          </a>
        </motion.div>
      </div>
    </PageSection>
  );
}
