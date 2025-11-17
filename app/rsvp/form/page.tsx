/**
 * RSVP Stage 2: RSVP Form Page
 * 
 * ROUTE: /rsvp/form
 * 
 * PURPOSE:
 * Authenticated guest selects attendance status and leaves optional message.
 * 
 * USER FLOW:
 * 1. Page loads and validates session from sessionStorage
 * 2. If session invalid/expired: Redirect back to /rsvp
 * 3. Display personalized greeting with guest name
 * 4. Guest selects: "Joyfully accepts" or "Regretfully declines"
 * 5. Guest optionally writes message (well-wishes, dietary restrictions)
 * 6. Submit to API, mark code as used
 * 7. Clear session and redirect to /rsvp/confirmation
 * 
 * SECURITY:
 * - Session validation on mount
 * - 1-hour session expiry check
 * - Sanitized message input
 * - Double-submit prevention
 */

'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import PageSection from '@/components/ui/PageSection';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { RSVPStatus } from '@/types';

export default function RSVPFormPage() {
  const router = useRouter();

  // State
  const [guestInfo, setGuestInfo] = useState<any>(null);
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>('attending');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  /**
   * Validate session on component mount
   * Redirect to code entry if session invalid/expired
   */
  useEffect(() => {
    // STEP 1: Retrieve session and guest info from sessionStorage
    const sessionData = sessionStorage.getItem('rsvp_session');
    const guestData = sessionStorage.getItem('guest_info');

    // STEP 2: Redirect if missing
    if (!sessionData || !guestData) {
      router.push('/rsvp');
      return;
    }

    try {
      // STEP 3: Parse session data
      const session = JSON.parse(sessionData);
      const guest = JSON.parse(guestData);

      // STEP 4: Check if session has expired (1 hour limit)
      const expiresAt = new Date(session.expiresAt);
      const now = new Date();

      if (expiresAt < now) {
        // Session expired, clear and redirect
        sessionStorage.clear();
        router.push('/rsvp');
        return;
      }

      // STEP 5: Session is valid, set guest info
      setGuestInfo(guest);
      setIsValidating(false);

    } catch (error) {
      // If parsing fails, clear and redirect
      console.error('Session validation error:', error);
      sessionStorage.clear();
      router.push('/rsvp');
    }
  }, [router]);

  /**
   * Handle RSVP form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // STEP 1: Send RSVP data to API
      const response = await fetch('/api/rsvp/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestId: guestInfo.id,
          rsvp_status: rsvpStatus,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      // STEP 2: Handle API errors
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit RSVP');
      }

      // STEP 3: Clear session from browser
      sessionStorage.clear();

      // STEP 4: Redirect to confirmation page
      router.push('/rsvp/confirmation');

    } catch (err: any) {
      alert(err.message || 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Show loading while validating session
  if (isValidating) {
    return (
      <PageSection>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blush-600"></div>
          <p className="mt-4 text-gray-600">Validating session...</p>
        </div>
      </PageSection>
    );
  }

  // Radio button options
  const options = [
    {
      value: 'attending' as RSVPStatus,
      label: 'Joyfully accepts',
      color: 'blush',
      emoji: '🎉',
    },
    {
      value: 'not_attending' as RSVPStatus,
      label: 'Regretfully declines',
      color: 'sky',
      emoji: '💙',
    },
  ];

  return (
    <PageSection>
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-normal mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
          Welcome, {guestInfo.name}!
        </h1>
        <p className="text-lg" style={{ fontFamily: "'Montserrat', sans-serif", color: '#6b6b6b' }}>
          We're so excited to hear from you
        </p>
      </motion.div>

      {/* RSVP Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="rounded-lg shadow-md p-8 md:p-12" style={{ backgroundColor: '#f5e6d3' }}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Attendance Selection */}
          <div>
            <label className="block text-lg font-semibold mb-4" style={{ color: '#2c2c2c', fontFamily: "'Cormorant Garamond', serif" }}>
              Will you be attending?
            </label>
            <div className="space-y-3">
              {options.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center p-4 rounded-lg border-2 cursor-pointer
                    transition-all duration-200
                    ${
                      rsvpStatus === option.value
                        ? 'border-amber-900 bg-amber-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="rsvp_status"
                    value={option.value}
                    checked={rsvpStatus === option.value}
                    onChange={(e) => setRsvpStatus(e.target.value as RSVPStatus)}
                    className="sr-only"
                  />
                  <span className="text-2xl mr-3">{option.emoji}</span>
                  <span className="flex-1 text-lg font-medium" style={{ color: '#2c2c2c' }}>
                    {option.label}
                  </span>
                  {rsvpStatus === option.value && (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{ color: '#8b7355' }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Optional Message */}
          <div>
            <Textarea
              id="message"
              label="Message (Optional)"
              placeholder="Send your well-wishes, let us know about dietary restrictions, or leave any special notes..."
              value={message}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              rows={5}
              maxLength={1000}
              showCharCount
              disabled={isLoading}
            />
            <p className="mt-2 text-sm text-gray-500">
              Feel free to share dietary restrictions, accessibility needs, or just say hello!
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            fullWidth
            disabled={isLoading}
          >
            Submit RSVP
          </Button>
        </form>

        {/* Info Box */}
        <div className="mt-8 p-4 rounded-lg border" style={{ backgroundColor: '#f5e6d3', borderColor: '#8b7355' }}>
          <p className="text-sm" style={{ color: '#8b7355' }}>
            <strong>Need to make changes?</strong> After submission, please contact us at{' '}
            <a
              href="mailto:terddy03@gmail.com"
              className="underline hover:font-semibold"
              style={{ color: '#8b7355' }}
            >
              terddy03@gmail.com
            </a>
          </p>
        </div>
      </motion.div>
    </PageSection>
  );
}
