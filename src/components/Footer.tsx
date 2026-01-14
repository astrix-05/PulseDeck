import Link from 'next/link';
import { Github, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-slate-950">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8 relative z-10">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link
            href="https://github.com/astrix-05/pulsedeck-landing"
            target="_blank"
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <span className="sr-only">GitHub</span>
            <Github className="h-6 w-6" />
          </Link>
          <Link
            href="https://astrix-05.github.io/Portfolio/"
            target="_blank"
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <span className="sr-only">Portfolio</span>
            <Globe className="h-6 w-6" />
          </Link>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-base text-gray-500">
            &copy; 2026 PulseDeck Presenter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
