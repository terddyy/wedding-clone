/**
 * Admin Dashboard
 * 
 * ROUTE: /admin
 * 
 * PURPOSE:
 * Admin interface for managing guests, generating codes, and viewing RSVPs
 * 
 * FEATURES:
 * - Admin authentication (password-protected)
 * - View all guests and their RSVP status
 * - Generate invitation codes for guests
 * - Export guest list and RSVPs
 */

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import AdminAuth from '@/components/admin/AdminAuth';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if admin is already authenticated on mount
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-100 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#8b7355' }}></div>
          <p className="mt-4" style={{ color: '#6b6b6b' }}>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-amber-50 py-8 px-4">
      {!isAuthenticated ? (
        <AdminAuth onAuthSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <AdminDashboard onLogout={() => setIsAuthenticated(false)} />
      )}
    </div>
  );
}
