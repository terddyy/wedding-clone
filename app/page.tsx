/**
 * Landing Page - Hero Section Only
 * 
 * ROUTE: /
 * 
 * This is the initial landing page that visitors see first.
 * It shows only the hero section with an invitation modal.
 * Clicking "Open Invitation" or the button opens the modal which directs
 * visitors to the home page where all content sections are available.
 */

'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();

  const handleOpenInvitation = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const audioSrc = '/sound/Deep%20Inside%20of%20you%20WEB%20MUSIC.mp3';
      const audio = new Audio(audioSrc);
      audio.volume = 0.9;
      // start playback on user interaction
      audio.play().catch(() => {
        // ignore play errors (autoplay restrictions may prevent immediate play)
      });
    } catch (err) {
      // ignore errors creating/playing audio
    }

    // allow a short moment for playback to start, then navigate
    setTimeout(() => router.push('/home'), 220);
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#faf8f5' }}>
      {/* Hero Section - Full Screen Only */}
      <section className="relative min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5e6d3' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{
          backgroundImage: 'url("/images/hero-bg.png")',
        }}></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center z-10 px-4"
        >
          <p className="text-sm tracking-widest mb-4" style={{ color: '#ffffff', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
            THE WEDDING CELEBRATION OF
          </p>
          <h1 className="text-7xl md:text-9xl font-light mb-8" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#ffffff', textShadow: '2px 2px 5px rgba(0,0,0,0.5)' }}>
            JHE & EIFER
          </h1>
          <a
            href="/home"
            onClick={handleOpenInvitation}
            className="px-8 py-4 rounded-lg font-medium transition-all hover:scale-105 flex items-center gap-3 mx-auto w-fit"
            style={{ backgroundColor: 'rgba(139, 115, 85, 0.8)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.5)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="M2 7l10 7 10-7"></path>
            </svg>
            Open Invitation
          </a>
        </motion.div>
      </section>
    </div>
  );
}
