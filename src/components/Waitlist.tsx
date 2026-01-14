"use client";

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Waitlist submission:', email);
    setSubmitted(true);
    setEmail('');
    
    // Reset success message after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div id="waitlist" className="py-24 relative overflow-hidden">
      {/* Background is now global in page.tsx, but we can add a specific gradient overlay for this section if needed, or keep it clean */}
      
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
            className="flex-1 min-w-0 px-4 py-3 text-base text-white placeholder-gray-500 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 backdrop-blur-sm"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
          >
            {submitted ? 'Joined!' : 'Join Waitlist'}
            {!submitted && <Send className="ml-2 h-5 w-5" />}
          </button>
        </form>
        
        {submitted && (
          <p className="mt-4 text-green-400 font-medium animate-fade-in">
            Thanks for joining! We&apos;ll keep you posted.
          </p>
        )}
      </div>
    </div>
  );
}
