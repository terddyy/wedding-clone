/**
 * Admin Authentication Component
 * 
 * Protects admin panel with password authentication
 */

'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

export default function AdminAuth({ onAuthSuccess }: AdminAuthProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store token in localStorage
      localStorage.setItem('admin_token', data.token);
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid password');
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md mx-auto"
    >
      <div className="rounded-lg shadow-lg p-8" style={{ backgroundColor: '#ffffff' }}>
        <h1 className="text-3xl font-normal mb-2 text-center" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
          Admin Panel
        </h1>
        <p className="text-center mb-6" style={{ color: '#6b6b6b' }}>
          Enter your admin password to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2c2c2c' }}>
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none transition-colors"
              style={{ borderColor: error ? '#dc2626' : '#8b7355' }}
            />
            {error && <p className="text-sm mt-2" style={{ color: '#dc2626' }}>{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#8b7355', color: '#ffffff' }}
          >
            {isLoading ? 'Authenticating...' : 'Enter Admin Panel'}
          </button>
        </form>

        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#f5e6d3' }}>
          <p className="text-xs text-center" style={{ color: '#8b7355' }}>
            <strong>Demo Password:</strong> admin123
          </p>
        </div>
      </div>
    </motion.div>
  );
}
