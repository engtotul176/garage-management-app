import React from 'react';
import { Megaphone, Radio } from 'lucide-react';
import { TvAnnouncement } from '../../types/tvDashboard';

interface TvMarqueeAnnouncementProps {
  announcements: TvAnnouncement[];
}

export const TvMarqueeAnnouncement: React.FC<TvMarqueeAnnouncementProps> = ({ announcements }) => {
  if (!announcements || announcements.length === 0) return null;

  const combinedMessages = announcements
    .map(a => `${a.priority === 'HIGH' ? '🚨 [জরুরী ঘোষণা]: ' : '📢 '}${a.message}`)
    .join('  ❖  ');

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-indigo-700 text-white shadow-lg overflow-hidden flex items-center border-b-2 border-amber-400">
      
      {/* Live Badge Label */}
      <div className="bg-slate-950 px-4 py-2.5 flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider shrink-0 z-10 border-r border-amber-400/30">
        <Radio className="w-4 h-4 animate-pulse text-red-500" />
        <span>লাইভ নোটিশ (LIVE TV)</span>
      </div>

      {/* Marquee Ticker */}
      <div className="overflow-hidden whitespace-nowrap py-2 flex-1 relative">
        <div className="inline-block animate-marquee pl-10 text-sm md:text-base font-bold tracking-wide text-amber-100">
          {combinedMessages} &nbsp;&nbsp;&nbsp;&nbsp; ❖ &nbsp;&nbsp;&nbsp;&nbsp; {combinedMessages}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </div>
  );
};
