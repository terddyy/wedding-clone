/**
 * Homepage - Wedding Invitation Landing Page
 * 
 * ROUTE: /
 * 
 * This is the main landing page that welcomes guests and provides navigation.
 * Matches the design of the static HTML but properly integrates with Next.js routing.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showModal, setShowModal] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Wedding date: December 21, 2025
  const weddingDate = new Date('2025-12-21T16:00:00');

  useEffect(() => {
    setHasMounted(true);
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = weddingDate.getTime() - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#faf8f5' }}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5e6d3' }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%238b7355" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center z-10 px-4"
        >
          <p className="text-sm tracking-widest mb-4" style={{ color: '#6b6b6b', fontFamily: "'Montserrat', sans-serif" }}>
            THE WEDDING CELEBRATION OF
          </p>
          <h1 className="text-7xl md:text-9xl font-light mb-8" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
            JHE & EIFER
          </h1>
          <button
            onClick={() => setShowModal(true)
            }
            className="px-8 py-4 rounded-lg font-medium transition-all hover:scale-105 flex items-center gap-3 mx-auto"
            style={{ backgroundColor: '#8b7355', color: '#ffffff' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="M2 7l10 7 10-7"></path>
            </svg>
            Open Invitation
          </button>
        </motion.div>
      </section>

      {/* Invitation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-8 md:p-12 max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: '#f5e6d3' }}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-3xl" style={{ color: '#8b7355' }}
            >
              ×
            </button>
            
            <div className="text-center">
              <p className="text-sm mb-4" style={{ color: '#6b6b6b' }}>Together with their families</p>
              <h2 className="text-5xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>Jhe & Eifer</h2>
              <p className="mb-8" style={{ color: '#2c2c2c' }}>Request the pleasure of your company at their wedding celebration.</p>
              
              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#8b7355' }}>Date</h3>
                  <p style={{ color: '#2c2c2c' }}>Sunday, December 21st, 2025</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#8b7355' }}>Time</h3>
                  <p style={{ color: '#2c2c2c' }}>4:00 PM</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#8b7355' }}>Ceremony & Reception</h3>
                  <p style={{ color: '#2c2c2c' }}>Kapitan Moy - Bulwagang Bayani (2nd Floor)</p>
                  
                </div>
              </div>
              
             
            </div>
          </motion.div>
        </div>
      )}

      {/* Countdown Section */}
      {hasMounted && (
        <section className="py-20 text-center" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="text-4xl md:text-5xl mb-12" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
            Counting Down to Our Special Day
          </h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { label: 'Days', value: countdown.days },
              { label: 'Hours', value: countdown.hours },
              { label: 'Minutes', value: countdown.minutes },
              { label: 'Seconds', value: countdown.seconds },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-5xl md:text-6xl font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-sm tracking-wide" style={{ color: '#6b6b6b' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Details Section */}
      <section className="py-20" style={{ backgroundColor: '#f5e6d3' }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl text-center mb-16" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
            Wedding Details
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Location Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64 w-full">
                <img 
                  src="/images/kapmoy.png" 
                  alt="Wedding Venue"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
                  The Ceremony & Reception
                </h3>
                <p className="font-semibold mb-1" style={{ color: '#2c2c2c' }}>Kapitan Moy - Bulwagang Bayani</p>
                <p className="mb-4" style={{ color: '#6b6b6b' }}>JP Rizal Sta. Elena, Marikina City</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: '#8b7355', color: '#ffffff' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid gap-6">
              {/* Schedule Card */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                <img
                  src="/images/clock.png"
                  alt="Schedule"
                  className="w-20 h-20 md:w-20 md:h-30 object-contain"
                />
                <h4 className="text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>Schedule</h4>
              </div>
                <ul className="space-y-2">
                  {[
                    { time: '5:00 PM', event: 'Ceremony' },
                    { time: '6:30 PM', event: 'Dinner' },
                    { time: '7:30 PM', event: 'Program & Cocktail Hour' },
                    { time: '8:30 PM', event: 'Dancing' },
                  ].map((item) => (
                    <li key={item.time} className="flex items-center gap-2">
                      <span className="font-semibold" style={{ color: '#8b7355' }}>{item.time}</span>
                      <span style={{ color: '#2c2c2c' }}>{item.event}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dress Code Card */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                <img
                  src="/images/suit.png"
                  alt="Dress code"
                  className="w-20 h-20 md:w-20 md:h-30 object-contain"
                />
                <h4 className="text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>Dress Code</h4>
              </div>
                <p style={{ color: '#2c2c2c' }}>
                  We'd love to see our friends and family get dressed up with us! The dress code is{' '}
                  <strong style={{ color: '#8b7355' }}>Whimsical Cocktail Formal Attire</strong>.
                </p>
              </div>

             
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl text-center mb-16" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
            Our Journey Together
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'linear-gradient(135deg, #e8d5c4 0%, #d4b5a0 100%)',
              'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)',
              'linear-gradient(135deg, #d4b5a0 0%, #c4a590 100%)',
              'linear-gradient(135deg, #e8d5c4 0%, #f5e6d3 100%)',
              'linear-gradient(135deg, #c4a590 0%, #d4b5a0 100%)',
              'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)',
            ].map((gradient, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg flex items-center justify-center"
                style={{ background: gradient }}
              >
                <span className="text-5xl opacity-60">📸</span>
              </div>
            ))}
          </div>
          <p className="text-center mt-8" style={{ color: '#6b6b6b', fontStyle: 'italic' }}>
            Add your favorite photos here!
          </p>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-20" style={{ backgroundColor: '#f5e6d3' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
            RSVP
          </h2>
          <p className="text-lg mb-8" style={{ color: '#2c2c2c' }}>
            Please respond until December 14th, 2025
          </p>
          
          <div className="bg-white rounded-lg p-8 md:p-12 shadow-lg max-w-2xl mx-auto">
            <div className="text-6xl mb-6">✉️</div>
            <h3 className="text-2xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
              You're Invited!
            </h3>
            <p className="mb-4" style={{ color: '#2c2c2c' }}>
              We can't wait to celebrate with you! Please use your unique invitation code to RSVP.
            </p>
            <p className="text-sm mb-8" style={{ color: '#6b6b6b' }}>
              Your invitation code was included in your invitation. If you can't find it, please contact us.
            </p>
            
            <Link
              href="/rsvp"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: '#8b7355', color: '#ffffff' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Enter Your RSVP Code
            </Link>
            
            <p className="text-sm mt-6" style={{ color: '#6b6b6b' }}>
              Need help?{' '}
              <a href="mailto:terddy03@gmail.com" className="underline" style={{ color: '#8b7355' }}>
                Contact us
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center" style={{ backgroundColor: '#ffffff' }}>
        <p className="text-lg mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
          With love, Jhe & Eifer
        </p>
        <p style={{ color: '#6b6b6b' }}>December 21st, 2025</p>
        <div className="text-2xl mt-4">❤️</div>
      </footer>
    </div>
  );
}
