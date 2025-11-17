'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Redirect to static wedding site
    if (typeof window !== 'undefined') {
      window.location.href = '/index.html';
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blush-50 via-white to-sky-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blush-600 mb-4"></div>
        <p className="text-gray-600">Loading wedding invitation...</p>
      </div>
    </div>
  );
}
