'use client';

import Link from 'next/link';
import { ArrowRight, Github } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import { useEffect, useState } from 'react';

export default function Hero() {
  return (
    <div className="relative pt-16 pb-32">
      {/* Removed local background/blobs since they are now global in page.tsx */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8">
          Turn a brief + URL + brand kit into an{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            on-brand deck
          </span>{' '}
          inside Adobe Express
        </h1>
        
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300 mb-10">
          PulseDeck Presenter automates your presentation workflow. Generate professional, brand-aligned slides in seconds, directly within your favorite design tool.
        </p>

        <CountdownTimer />
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="https://github.com/astrix-05/PulseDeck"
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.7)]"
          >
            <Github className="mr-2 h-5 w-5" />
            View GitHub
          </Link>
          <Link
            href="#waitlist"
            className="inline-flex items-center justify-center px-8 py-3 border border-white/10 text-base font-medium rounded-md text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm md:py-4 md:text-lg transition-all"
          >
            Join Waitlist
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
