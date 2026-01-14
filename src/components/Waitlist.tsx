"use client";

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [count, setCount] = useState<number | null>(null);

  // Fetch count on mount
  useEffect(() => {
    fetch('/api/waitlist')
      .then(res => res.json())
      .then(data => {
        if (data.count) setCount(data.count);
      })
      .catch(err => console.error('Failed to fetch count', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setMessage(`You are #${data.rank} person to join! 🎉`);
        setCount(data.count);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div id="waitlist" className="py-24 relative overflow-hidden">
      {/* Background is now global in page.tsx */}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-6">
          Ready to present better?
        </h2>
        <p className="max-w-2xl mx-auto text-xl text-gray-300 mb-10">
          Join the waitlist to get early access to PulseDeck Presenter and start generating on-brand decks in seconds.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === 'loading'}
            className="flex-1 min-w-0 px-4 py-3 text-base text-white placeholder-gray-500 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 backdrop-blur-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Joining...' : (status === 'success' ? 'Joined!' : 'Join Waitlist')}
            {status !== 'loading' && status !== 'success' && <Send className="ml-2 h-5 w-5" />}
          </button>
        </form>
        
        {status === 'success' && (
          <p className="mt-4 text-green-400 font-medium animate-fade-in text-lg">
            {message}
          </p>
        )}
        
        {status === 'error' && (
          <p className="mt-4 text-red-400 font-medium animate-fade-in">
            {message}
          </p>
        )}

        {count !== null && (
          <p className="mt-8 text-indigo-300/60 text-sm font-medium uppercase tracking-widest">
            {count.toLocaleString()} people waiting
          </p>
        )}
      </div>
    </div>
  );
}
