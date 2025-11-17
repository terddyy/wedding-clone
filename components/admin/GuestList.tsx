/**
 * Guest List Component
 * 
 * Displays all guests and their RSVP status
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Guest {
  id: string;
  name: string;
  rsvp_status: 'attending' | 'not_attending' | 'pending';
  message: string;
  used: boolean;
  submitted_at?: string;
}

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'attending' | 'not_attending' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await fetch('/api/admin/guests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch guests');

      const data = await response.json();
      setGuests(data.guests);
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGuest = async (guestId: string, guestName: string) => {
    if (!confirm(`Are you sure you want to delete ${guestName}? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(guestId);
    try {
      const response = await fetch('/api/admin/delete-guest', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guestId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete guest');
      }

      // Remove guest from local state
      setGuests((prev) => prev.filter((g) => g.id !== guestId));
    } catch (error) {
      console.error('Error deleting guest:', error);
      alert('Failed to delete guest. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredGuests = guests.filter((guest) => {
    const matchesFilter = filter === 'all' || guest.rsvp_status === filter;
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: guests.length,
    attending: guests.filter((g) => g.rsvp_status === 'attending').length,
    not_attending: guests.filter((g) => g.rsvp_status === 'not_attending').length,
    pending: guests.filter((g) => g.rsvp_status === 'pending').length,
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#8b7355' }}></div>
        <p className="mt-4" style={{ color: '#6b6b6b' }}>Loading guests...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Guests', value: stats.total, color: '#8b7355' },
          { label: 'Attending', value: stats.attending, color: '#059669' },
          { label: 'Not Attending', value: stats.not_attending, color: '#dc2626' },
          { label: 'Pending', value: stats.pending, color: '#f59e0b' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg p-4 text-center shadow-md" style={{ backgroundColor: '#ffffff' }}>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-sm" style={{ color: '#6b6b6b' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="rounded-lg shadow-md p-6 mb-6" style={{ backgroundColor: '#f5e6d3' }}>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by guest name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none"
            style={{ borderColor: '#8b7355' }}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none"
            style={{ borderColor: '#8b7355' }}
          >
            <option value="all">All Guests</option>
            <option value="attending">Attending</option>
            <option value="not_attending">Not Attending</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Guest List Table */}
      <div className="rounded-lg shadow-md overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#e8d5c4' }}>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#8b7355' }}>Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#8b7355' }}>Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#8b7355' }}>Message</th>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#8b7355' }}>Submitted</th>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#8b7355' }}>Code Used</th>
                <th className="px-6 py-3 text-center text-sm font-semibold" style={{ color: '#8b7355' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length > 0 ? (
                filteredGuests.map((guest, index) => (
                  <motion.tr
                    key={guest.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm">{guest.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{
                          backgroundColor:
                            guest.rsvp_status === 'attending'
                              ? '#059669'
                              : guest.rsvp_status === 'not_attending'
                              ? '#dc2626'
                              : '#f59e0b',
                        }}
                      >
                        {guest.rsvp_status === 'attending' ? '✓ Attending' : guest.rsvp_status === 'not_attending' ? '✗ Declining' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{guest.message || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {guest.submitted_at ? new Date(guest.submitted_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {guest.used ? <span style={{ color: '#059669' }}>✓ Yes</span> : <span style={{ color: '#6b6b6b' }}>No</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <button
                        onClick={() => handleDeleteGuest(guest.id, guest.name)}
                        disabled={deletingId === guest.id}
                        className="px-3 py-1 rounded text-white text-xs font-semibold transition-all hover:opacity-80 disabled:opacity-50"
                        style={{ backgroundColor: '#dc2626' }}
                      >
                        {deletingId === guest.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center" style={{ color: '#6b6b6b' }}>
                    No guests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => {
            const csv = [
              ['Name', 'RSVP Status', 'Message', 'Submitted', 'Code Used'].join(','),
              ...filteredGuests.map((g) =>
                [g.name, g.rsvp_status, g.message || '', g.submitted_at || '', g.used ? 'Yes' : 'No'].join(',')
              ),
            ].join('\n');

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rsvp-list-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
          }}
          className="px-6 py-2 rounded-lg font-semibold text-white transition-all"
          style={{ backgroundColor: '#8b7355' }}
        >
          Export as CSV
        </button>
      </div>
    </motion.div>
  );
}
