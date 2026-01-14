'use client';

import { useEffect, useState } from 'react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  } | null>(null);

  useEffect(() => {
    // Set launch date to 3 months from now (calculated once on mount to simulate a fixed date)
    // For a real app, this would be a specific ISO string like '2026-04-01T00:00:00'
    // To ensure "3 months from today" as requested, we'll calculate it relative to the current time
    // but store it in a way that it doesn't reset on every refresh if we wanted persistence.
    // However, for this demo, we'll just calculate it fresh or use a fixed date relative to "now"
    // that stays consistent during the session.
    
    // Let's pick a fixed date roughly 3 months from "now" (when the user first loads)
    // To make it consistent for the demo, let's just say it's 90 days from the moment the component mounts.
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 90);
    const targetTime = targetDate.getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isExpired: false,
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return null; // Avoid hydration mismatch
  }

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-200 text-sm font-semibold mb-8 animate-pulse border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
        🚀 PulseDeck Presenter is live – join the early access list!
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="text-sm font-medium text-indigo-300 mb-2 uppercase tracking-wider">Launching In</div>
      <div className="inline-flex gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-indigo-500/30">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-white leading-none">{timeLeft.days}</span>
          <span className="text-[10px] text-gray-400 font-medium uppercase mt-1">Days</span>
        </div>
        <div className="text-2xl font-bold text-indigo-400 leading-none">:</div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-white leading-none">{timeLeft.hours.toString().padStart(2, '0')}</span>
          <span className="text-[10px] text-gray-400 font-medium uppercase mt-1">Hrs</span>
        </div>
        <div className="text-2xl font-bold text-indigo-400 leading-none">:</div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-white leading-none">{timeLeft.minutes.toString().padStart(2, '0')}</span>
          <span className="text-[10px] text-gray-400 font-medium uppercase mt-1">Mins</span>
        </div>
        <div className="text-2xl font-bold text-indigo-400 leading-none">:</div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-white leading-none">{timeLeft.seconds.toString().padStart(2, '0')}</span>
          <span className="text-[10px] text-gray-400 font-medium uppercase mt-1">Sec</span>
        </div>
      </div>
    </div>
  );
}
