import React from 'react';
import { Zap, CheckCircle2, AlertTriangle, BatteryCharging, Clock, Car } from 'lucide-react';
import { ChargingSlot } from '../../types/tvDashboard';

interface TvChargingSlotStatusProps {
  slots: ChargingSlot[];
  isDarkMode: boolean;
}

export const TvChargingSlotStatus: React.FC<TvChargingSlotStatusProps> = ({ slots, isDarkMode }) => {
  return (
    <div className={`p-6 rounded-3xl border shadow-2xl transition-all ${
      isDarkMode 
        ? 'bg-slate-900/90 border-slate-800 text-white' 
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight">লাইভ চার্জিং স্লট মনিটর (REAL-TIME SLOTS)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              প্রতিটি চার্জিং পয়েন্টের বর্তমান লাইভ বিদ্যুৎ ও চার্জিং অবস্থা
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            চার্জিং সচল
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-500 border border-sky-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            সম্পূর্ণ
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-500/10 text-slate-400 border border-slate-500/20">
            খালি স্লট
          </span>
        </div>
      </div>

      {/* Grid of Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {slots.map((slot) => {
          let cardBg = isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200';
          let statusBadge = <span className="text-slate-400">খালি</span>;

          if (slot.status === 'CHARGING') {
            cardBg = isDarkMode 
              ? 'bg-emerald-950/40 border-emerald-600/50 shadow-emerald-900/20 shadow-lg' 
              : 'bg-emerald-50 border-emerald-300 shadow-sm';
            statusBadge = (
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-500 uppercase tracking-wider">
                <BatteryCharging className="w-4 h-4 animate-bounce" />
                চার্জ হচ্ছে
              </span>
            );
          } else if (slot.status === 'COMPLETED') {
            cardBg = isDarkMode 
              ? 'bg-sky-950/40 border-sky-600/50' 
              : 'bg-sky-50 border-sky-300';
            statusBadge = (
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-sky-400 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                ১০০% সম্পন্ন
              </span>
            );
          } else if (slot.status === 'MAINTENANCE') {
            cardBg = isDarkMode 
              ? 'bg-rose-950/40 border-rose-600/50' 
              : 'bg-rose-50 border-rose-300';
            statusBadge = (
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-500 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                সার্ভিসিং
              </span>
            );
          }

          return (
            <div 
              key={slot.slotId}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${cardBg}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  {slot.slotNumber}
                </span>
                {statusBadge}
              </div>

              {slot.vehicleNo ? (
                <div className="my-3 space-y-1">
                  <div className="text-sm font-black text-indigo-400 dark:text-indigo-300 flex items-center gap-1.5 truncate">
                    <Car className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">{slot.vehicleNo}</span>
                  </div>
                  <div className="text-xs text-slate-300 dark:text-slate-400 truncate">
                    ড্রাইভার: {slot.driverName || 'N/A'}
                  </div>
                  {slot.startTime && (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{slot.startTime} হতে {slot.estimatedEndTime || ''}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="my-4 text-center text-xs text-slate-400 font-bold py-2">
                  [ স্লট খালি - রেডি ]
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
