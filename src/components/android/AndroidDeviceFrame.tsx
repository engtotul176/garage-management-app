import React, { useState, useEffect } from 'react';
import { Wifi, BatteryCharging, Signal, ChevronLeft, Circle, Square, Sun, Moon, WifiOff, Volume2 } from 'lucide-react';

interface AndroidDeviceFrameProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  title?: string;
  onBackClick?: () => void;
}

export const AndroidDeviceFrame: React.FC<AndroidDeviceFrameProps> = ({
  children,
  isDarkMode,
  onToggleDarkMode,
  isOffline,
  onToggleOffline,
  title = 'Ababil Enterprise Mobile',
  onBackClick
}) => {
  const [time, setTime] = useState('12:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto my-4 w-full max-w-[390px] min-h-[780px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-950 flex flex-col justify-between select-none">
      
      {/* Side Hardware Buttons Simulation */}
      <div className="absolute -left-4 top-28 w-1 h-12 bg-slate-700 rounded-l-md"></div>
      <div className="absolute -left-4 top-44 w-1 h-12 bg-slate-700 rounded-l-md"></div>
      <div className="absolute -right-4 top-36 w-1 h-16 bg-slate-700 rounded-r-md"></div>

      {/* Screen Container */}
      <div className={`relative w-full flex-1 rounded-[38px] overflow-hidden flex flex-col transition-colors ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        
        {/* Status Bar */}
        <div className={`px-6 pt-3 pb-1 flex items-center justify-between text-xs font-mono font-bold z-30 ${
          isDarkMode ? 'bg-slate-950 text-slate-300' : 'bg-slate-100 text-slate-700'
        }`}>
          <span>{time}</span>

          {/* Camera Punchhole */}
          <div className="w-4 h-4 rounded-full bg-black ring-2 ring-slate-800/50 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
          </div>

          <div className="flex items-center gap-2">
            {isOffline ? (
              <WifiOff className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            )}
            <Signal className="w-3.5 h-3.5 text-sky-400" />
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Quick App Bar Control Header */}
        <div className={`px-4 py-2 border-b flex items-center justify-between text-xs font-bold z-20 ${
          isDarkMode 
            ? 'bg-slate-900/90 border-slate-800 text-white' 
            : 'bg-white/90 border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center gap-2">
            {onBackClick && (
              <button onClick={onBackClick} className="p-1 hover:bg-slate-500/20 rounded-lg">
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <span className="truncate max-w-[160px] text-xs font-black">{title}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleOffline}
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border transition-all ${
                isOffline 
                  ? 'bg-rose-500/20 text-rose-500 border-rose-500/30' 
                  : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              }`}
            >
              {isOffline ? 'OFFLINE' : 'ONLINE'}
            </button>

            <button
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-xl hover:bg-slate-500/20 transition-colors"
              title="Toggle Light / Dark"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Dynamic App Content Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans text-xs">
          {children}
        </div>

        {/* Material 3 Bottom Gesture / Navigation Bar */}
        <div className={`py-2.5 px-8 flex items-center justify-around border-t z-30 ${
          isDarkMode 
            ? 'bg-slate-950 border-slate-800 text-slate-400' 
            : 'bg-slate-100 border-slate-200 text-slate-600'
        }`}>
          <button 
            onClick={onBackClick}
            className="p-1.5 hover:text-indigo-500 transition-colors"
            title="Android Back Button"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button 
            className="p-1.5 hover:text-indigo-500 transition-colors"
            title="Android Home Button"
          >
            <Circle className="w-4 h-4 fill-current" />
          </button>

          <button 
            className="p-1.5 hover:text-indigo-500 transition-colors"
            title="Android Recent Apps Button"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
