/**
 * RSVP Stage 1: Code Entry Page
 * 
 * ROUTE: /rsvp
 * 
 * PURPOSE:
 * Guest enters their unique invitation code to authenticate.
 * 
 * USER FLOW:
 * 1. Guest lands on page and sees code input form
 * 2. Guest enters 8-character invitation code
 * 3. Code is validated against Firebase via API
 * 4. On success: Session created, redirect to /rsvp/form
 * 5. On error: Display error message, allow retry
 * 
 * FEATURES:
 * - Auto-uppercase code conversion
 * - Real-time error clearing
 * - Loading state during validation
 * - Informational cards (deadline, plus-ones, updates)
 * - Help text with contact email
 */

'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import PageSection from '@/components/ui/PageSection';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function RSVPCodePage() {
  const router = useRouter();

  // Form state
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handle code input change
   * Automatically converts to uppercase and clears errors
   */
  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setCode(value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  /**
   * Handle form submission
   * Validates code with API and creates session
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear any existing errors
    setError('');
    
    // Validate code is not empty
    if (!code.trim()) {
      setError('Please enter your invitation code');
      return;
    }

    // Set loading state
    setIsLoading(true);

    try {
      // STEP 1: Call validation API
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.trim(),
        }),
      });

      const data = await response.json();

      // STEP 2: Handle API errors
      if (!response.ok) {
        throw new Error(data.error || 'Invalid code');
      }

      // STEP 3: Store session and guest info in sessionStorage
      // Session will be validated on form page
      sessionStorage.setItem('rsvp_session', JSON.stringify(data.session));
      sessionStorage.setItem('guest_info', JSON.stringify(data.guest));

      // STEP 4: Redirect to RSVP form
      router.push('/rsvp/form');

    } catch (err: any) {
      // Display user-friendly error message
      setError(err.message || 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <PageSection>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl md:text-7xl font-normal mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
          RSVP
        </h1>
        <p className="text-lg" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
          We can't wait to celebrate with you!
        </p>
        <p className="mt-2" style={{ fontFamily: "'Montserrat', sans-serif", color: '#6b6b6b' }}>
          Please enter your invitation code below to get started.
        </p>
      </motion.div>

      {/* Code Input Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="rounded-lg shadow-md p-8 md:p-12 mb-8" style={{ backgroundColor: '#f5e6d3' }}
      >
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full p-4" style={{ backgroundColor: '#e8d5c4' }}>
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="code"
              className="block text-center text-sm font-medium mb-3" style={{ color: '#2c2c2c' }}
            >
              Invitation Code
            </label>
            <Input
              id="code"
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="Enter your 8-character code"
              maxLength={8}
              autoComplete="off"
              disabled={isLoading}
              className="text-center text-2xl tracking-widest font-mono"
              error={error}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            fullWidth
            disabled={!code.trim() || isLoading}
          >
            Continue to RSVP
          </Button>
        </form>

        {/* Help Text */}
        <p className="text-center text-sm mt-6" style={{ color: '#6b6b6b' }}>
          Can't find your code?{' '}
          <a
            href="https://www.facebook.com/jennifer.salo.7923"
            className="underline hover:font-semibold"
            style={{ color: '#8b7355' }}
          >
            Contact us
          </a>
        </p>
      </motion.div>

      {/* Information Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid md:grid-cols-3 gap-6"
      >
        {/* Card 1: Deadline */}
        <div className="rounded-lg p-6 text-center shadow-md" style={{ backgroundColor: '#ffffff' }}>
          <div className="rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e8d5c4' }}>
            <svg
              className="w-6 h-6"
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
          <h3 className="font-semibold mb-2" style={{ color: '#2c2c2c', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>RSVP Deadline</h3>
          <p className="text-sm" style={{ color: '#6b6b6b' }}>
            Please respond by{' '}
            <span className="font-semibold" style={{ color: '#8b7355' }}>November 21, 2025</span>
          </p>
        </div>

        {/* Card 2: Plus Ones */}
        <div className="rounded-lg p-6 text-center shadow-md" style={{ backgroundColor: '#ffffff' }}>
          <div className="rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e8d5c4' }}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: '#8b7355' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="font-semibold mb-2" style={{ color: '#2c2c2c', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>Plus Ones</h3>
          <p className="text-sm" style={{ color: '#6b6b6b' }}>
            Your invitation includes the guests listed on your envelope
          </p>
        </div>

        {/* Card 3: Updates */}
        <div className="rounded-lg p-6 text-center shadow-md" style={{ backgroundColor: '#ffffff' }}>
          <div className="rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e8d5c4' }}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: '#8b7355' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h3 className="font-semibold mb-2" style={{ color: '#2c2c2c', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>Need to Update?</h3>
          <p className="text-sm" style={{ color: '#6b6b6b' }}>
            Contact us if you need to change your RSVP
          </p>
        </div>
      </motion.div>
    </PageSection>
  );
}
