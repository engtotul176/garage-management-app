import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Clock, 
  Calendar, 
  Maximize2, 
  Minimize2, 
  Wifi, 
  WifiOff, 
  Sparkles, 
  Megaphone, 
  Sun, 
  Moon, 
  Building2 
} from 'lucide-react';

interface TvTopHeaderProps {
  tenantName?: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenAnnouncementModal: () => void;
  isOnline: boolean;
}

export const TvTopHeader: React.FC<TvTopHeaderProps> = ({
  tenantName = 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ & কমান্ড সেন্টার',
  isDarkMode,
  onToggleTheme,
  isFullscreen,
  onToggleFullscreen,
  onOpenAnnouncementModal,
  isOnline
}) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('bn-BD', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
      
      {/* Brand & Organization Identity */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-tr from-indigo-600 to-sky-500 rounded-2xl shadow-lg shadow-indigo-500/30 flex items-center justify-center shrink-0">
          <Tv className="w-7 h-7 text-white" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-md tracking-wider">
              TV LIVE DASHBOARD
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              রিয়েল-টাইম সিঙ্ক
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2 mt-0.5">
            <Building2 className="w-5 h-5 text-indigo-400 inline" />
            {tenantName}
          </h1>
        </div>
      </div>

      {/* Live Date & Real-time Clock */}
      <div className="flex items-center gap-6 bg-slate-950/80 px-5 py-2.5 rounded-2xl border border-slate-800 shadow-inner">
        <div className="flex items-center gap-2 text-slate-300">
          <Calendar className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold">{formatDate(time)}</span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center gap-2 text-amber-400 font-mono font-black text-lg md:text-xl tracking-wider">
          <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
          <span>{formatTime(time)}</span>
        </div>
      </div>

      {/* TV Controls & Network Status */}
      <div className="flex items-center gap-3">
        
        {/* Network Online Status */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
          isOnline ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
        }`}>
          {isOnline ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-rose-400" />}
          <span>{isOnline ? 'অনলাইন' : 'অফলাইন'}</span>
        </div>

        {/* Send Announcement Button */}
        <button
          onClick={onOpenAnnouncementModal}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
          title="নতুন ঘোষণা টিভিতে পাঠাতুন"
        >
          <Megaphone className="w-4 h-4" />
          <span className="hidden sm:inline">ঘোষণা প্রকাশ</span>
        </button>

        {/* Theme Mode Switcher */}
        <button
          onClick={onToggleTheme}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all border border-slate-700"
          title="টিভি মোড পরিবর্তন (Dark/Light)"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all border border-slate-700"
          title="ফুলস্ক্রিন মোড"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-rose-400" /> : <Maximize2 className="w-4 h-4 text-emerald-400" />}
        </button>

      </div>

    </header>
  );
};
