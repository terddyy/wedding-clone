/**
 * Admin Dashboard Component
 * 
 * Main admin interface for managing guests and RSVPs
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GuestList from './GuestList';
import GenerateCode from './GenerateCode';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'guests' | 'generate'>('guests');

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    onLogout();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-normal" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: '#6b6b6b' }}>Manage RSVPs and generate invitation codes</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-2 rounded-lg font-semibold transition-all"
          style={{ backgroundColor: '#8b7355', color: '#ffffff' }}
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('guests')}
          className="px-6 py-3 rounded-lg font-semibold transition-all"
          style={{
            backgroundColor: activeTab === 'guests' ? '#8b7355' : '#e8d5c4',
            color: activeTab === 'guests' ? '#ffffff' : '#8b7355',
          }}
        >
          View Guests & RSVPs
        </button>
        <button
          onClick={() => setActiveTab('generate')}
          className="px-6 py-3 rounded-lg font-semibold transition-all"
          style={{
            backgroundColor: activeTab === 'generate' ? '#8b7355' : '#e8d5c4',
            color: activeTab === 'generate' ? '#ffffff' : '#8b7355',
          }}
        >
          Generate Codes
        </button>
      </div>

      {/* Content */}
      {activeTab === 'guests' && <GuestList />}
      {activeTab === 'generate' && <GenerateCode />}
    </motion.div>
  );
}
