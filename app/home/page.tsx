/**
 * Home Page - Main Wedding Website Content
 * 
 * ROUTE: /home
 * 
 * This is the main wedding website page with all content sections.
 * Includes navigation, countdown, details, gallery, and RSVP sections.
 * Users reach this page after viewing the hero landing page.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Hero from '@/components/home/Hero';
import Gallery from '@/components/home/Gallery';

export default function HomePage() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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

  // If the page is visited with a hash (e.g. /home#our-journey),
  // scroll to the corresponding section on mount.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.slice(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#faf8f5' }}>
      {/* Hero Section */}
      <Hero />

      {/* Countdown Section */}
      {hasMounted && (
        <section id="countdown" className="py-20 text-center" style={{ backgroundColor: '#ffffff' }}>
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
          <p className="mt-8 text-lg" style={{ color: '#6b6b6b' }}>
            December 21, 2025
          </p>
        </section>
      )}

      {/* Details Section */}
      <section id="details" className="py-20" style={{ backgroundColor: '#f5e6d3' }}>
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
              <div className="p-6 text-center">
                <h3 className="text-2xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
                  The Ceremony & Reception
                </h3>
                <p className="font-semibold mb-1" style={{ color: '#2c2c2c' }}>Kapitan Moy - Bulwagang Bayani</p>
                <p className="mb-4" style={{ color: '#6b6b6b' }}>323 J. P. Rizal St, Marikina, 1800 Metro Manila</p>
                <a
                  href="https://www.google.com/maps/place/Kapitan+Moy+House/@14.6306094,121.0930067,17z/data=!3m1!4b1!4m6!3m5!1s0x3397b95955015de5:0xe027d61d451def23!8m2!3d14.6306094!4d121.0955816!16s%2Fm%2F010gnp5z?entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D"
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
                    src="/images/clock.svg"
                    alt="Schedule"
                    className="w-10 h-10 md:w-20 md:h-30 object-contain"
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
                <div className="mt-4">
                  <img
                    src="/images/outfit.png"
                    alt="Dress Code Examples"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Registry Section */}
      <section className="py-20 text-center" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
            A Note on Gifts
          </h2>
          <p className="text-lg" style={{ color: '#2c2c2c' }}>
            We have been blessed with everything we need, so your presence is all that we request.
            If you desire to give a monetary gift, a contribution to our new life together would be a lovely blessing.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <Gallery />

      {/* RSVP Section */}
      <section id="rsvp" className="py-20" style={{ backgroundColor: '#f5e6d3' }}>
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
              <a href="https://www.facebook.com/jennifer.salo.7923" className="underline" style={{ color: '#8b7355' }}>
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
