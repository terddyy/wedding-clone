/**
 * Generate Code Component
 * 
 * Admin interface for generating invitation codes
 */

'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface GeneratedCode {
  name: string;
  code: string;
  hash: string;
}

export default function GenerateCode() {
  const [guestNames, setGuestNames] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCode[]>([]);
  const [copySuccess, setCopySuccess] = useState('');

  const handleGenerate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedCodes([]);

    try {
      // Parse guest names (one per line)
      const names = guestNames
        .split('\n')
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

      if (names.length === 0) {
        alert('Please enter at least one guest name');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/admin/generate-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({ guestNames: names }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate codes');
      }

      const data = await response.json();
      setGeneratedCodes(data.codes);
      setGuestNames(''); // Clear input
    } catch (error: any) {
      alert(error.message || 'Error generating codes');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(text);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const downloadCodes = () => {
    const csv = [
      ['Guest Name', 'Invitation Code'].join(','),
      ...generatedCodes.map((item) => [item.name, item.code].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invitation-codes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-6">
      {/* Input Section */}
      <div className="rounded-lg shadow-md p-8" style={{ backgroundColor: '#ffffff' }}>
        <h2 className="text-2xl font-semibold mb-4" style={{ color: '#8b7355' }}>
          Generate Invitation Codes
        </h2>
        <p className="mb-6" style={{ color: '#6b6b6b' }}>
          Enter guest names (one per line) to generate unique invitation codes
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2c2c2c' }}>
              Guest Names
            </label>
            <textarea
              value={guestNames}
              onChange={(e) => setGuestNames(e.target.value)}
              placeholder={`John Smith\nJane Doe\nMichael Johnson\n...(one name per line)`}
              rows={8}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none font-mono text-sm"
              style={{ borderColor: '#8b7355' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !guestNames.trim()}
            className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#8b7355' }}
          >
            {isLoading ? 'Generating Codes...' : `Generate Codes`}
          </button>
        </form>

        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#f5e6d3' }}>
          <p className="text-sm" style={{ color: '#8b7355' }}>
            <strong>ℹ️ Each guest gets a unique 8-character code.</strong> Share these codes individually with your guests.
            They'll use these codes to access the RSVP form.
          </p>
        </div>
      </div>

      {/* Results Section */}
      {generatedCodes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-lg shadow-md p-8" style={{ backgroundColor: '#ffffff' }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold" style={{ color: '#8b7355' }}>
              Generated Codes ({generatedCodes.length})
            </h2>
            <button
              onClick={downloadCodes}
              className="px-6 py-2 rounded-lg font-semibold text-white transition-all"
              style={{ backgroundColor: '#8b7355' }}
            >
              Download CSV
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {generatedCodes.map((item, index) => (
              <motion.div
                key={item.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: '#f5e6d3' }}
              >
                <div>
                  <p className="font-semibold" style={{ color: '#2c2c2c' }}>
                    {item.name}
                  </p>
                  <p className="text-sm font-mono" style={{ color: '#6b6b6b' }}>
                    Code: <strong>{item.code}</strong>
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(item.code)}
                  className="px-4 py-2 rounded-lg font-medium transition-all text-sm"
                  style={{
                    backgroundColor: copySuccess === item.code ? '#059669' : '#8b7355',
                    color: '#ffffff',
                  }}
                >
                  {copySuccess === item.code ? '✓ Copied' : 'Copy'}
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#f5e6d3' }}>
            <p className="text-sm" style={{ color: '#8b7355' }}>
              <strong>✓ Codes generated successfully!</strong> These codes have been added to your guest database.
              Guests can now use their codes to RSVP at your wedding website.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
