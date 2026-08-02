import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  Car, 
  Zap, 
  CheckCircle2, 
  BatteryCharging, 
  Trophy, 
  Crown, 
  Sparkles 
} from 'lucide-react';
import { TvDashboardMetrics } from '../../types/tvDashboard';

interface TvMetricsCountersProps {
  metrics: TvDashboardMetrics;
  isDarkMode: boolean;
}

export const TvMetricsCounters: React.FC<TvMetricsCountersProps> = ({ metrics, isDarkMode }) => {
  const formatBDT = (val: number) => `৳ ${val.toLocaleString('bn-BD')}`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      
      {/* 1. Today's Collection */}
      <div className={`p-5 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        isDarkMode 
          ? 'bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 border-emerald-800/50 text-white' 
          : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 border-emerald-200 text-slate-900'
      }`}>
        <div className="absolute top-0 right-0 p-3 opacity-20">
          <TrendingUp className="w-16 h-16 text-emerald-400" />
        </div>
        <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 font-extrabold text-xs tracking-wider uppercase mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          আজকের কালেকশন (TODAY)
        </div>
        <div className="text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
          {formatBDT(metrics.todayCollection)}
        </div>
        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
          রিয়েল-টাইম লাইভ ক্যাশ ইনফ্লো
        </div>
      </div>

      {/* 2. Monthly Collection */}
      <div className={`p-5 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        isDarkMode 
          ? 'bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 border-indigo-800/50 text-white' 
          : 'bg-gradient-to-br from-indigo-50 via-white to-indigo-100/50 border-indigo-200 text-slate-900'
      }`}>
        <div className="absolute top-0 right-0 p-3 opacity-20">
          <Wallet className="w-16 h-16 text-indigo-400" />
        </div>
        <div className="text-indigo-500 dark:text-indigo-400 font-extrabold text-xs tracking-wider uppercase mb-1">
          চলতি মাসের মোট কালেকশন
        </div>
        <div className="text-2xl md:text-3xl font-black text-indigo-600 dark:text-indigo-300 font-mono tracking-tight">
          {formatBDT(metrics.monthlyCollection)}
        </div>
        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
          চলতি মাস মোট টার্গেটের ৯২% অর্জিত
        </div>
      </div>

      {/* 3. Today's Income */}
      <div className={`p-5 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        isDarkMode 
          ? 'bg-gradient-to-br from-sky-950/90 via-slate-900 to-slate-950 border-sky-800/50 text-white' 
          : 'bg-gradient-to-br from-sky-50 via-white to-sky-100/50 border-sky-200 text-slate-900'
      }`}>
        <div className="text-sky-500 dark:text-sky-400 font-extrabold text-xs tracking-wider uppercase mb-1">
          আজকের মোট আয় (INCOME)
        </div>
        <div className="text-2xl md:text-3xl font-black text-sky-600 dark:text-sky-300 font-mono tracking-tight">
          {formatBDT(metrics.todayIncome)}
        </div>
        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
          <ArrowUpRight className="w-3.5 h-3.5 text-sky-500" />
          চার্জিং + পার্কিং + সার্ভিস
        </div>
      </div>

      {/* 4. Today's Expense */}
      <div className={`p-5 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        isDarkMode 
          ? 'bg-gradient-to-br from-rose-950/90 via-slate-900 to-slate-950 border-rose-800/50 text-white' 
          : 'bg-gradient-to-br from-rose-50 via-white to-rose-100/50 border-rose-200 text-slate-900'
      }`}>
        <div className="text-rose-500 dark:text-rose-400 font-extrabold text-xs tracking-wider uppercase mb-1">
          আজকের মোট খরচ (EXPENSE)
        </div>
        <div className="text-2xl md:text-3xl font-black text-rose-600 dark:text-rose-400 font-mono tracking-tight">
          {formatBDT(metrics.todayExpense)}
        </div>
        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
          <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
          বিদ্যুৎ বিল + মেইনটেনেন্স
        </div>
      </div>

      {/* 5. Active Members & Vehicles Inside */}
      <div className={`p-5 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800 text-white' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-extrabold text-xs uppercase tracking-wider">গ্যারেজ উপস্থিতি</span>
          <Users className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-black text-indigo-400 font-mono">{metrics.vehiclesInside}</span>
          <span className="text-xs text-slate-400 font-bold">টি গাড়ি গ্যারেজে</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 font-semibold">
          সক্রিয় মেম্বার: <strong className="text-amber-400">{metrics.activeMembers}</strong> জন
        </div>
      </div>

      {/* 6. Charging Slots Summary */}
      <div className={`p-5 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800 text-white' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-extrabold text-xs uppercase tracking-wider">চার্জিং স্ট্যাটাস</span>
          <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-black text-emerald-400 font-mono">{metrics.chargingVehicles}</span>
          <span className="text-xs text-emerald-400 font-bold">টি চার্জ হচ্ছে</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 font-semibold flex items-center justify-between">
          <span>খালি: <strong className="text-emerald-400">{metrics.availableSlots}</strong></span>
          <span>সম্পূর্ণ: <strong className="text-sky-400">{metrics.completedCharging}</strong></span>
        </div>
      </div>

      {/* Top Collector Banner - Span 3 */}
      <div className="col-span-2 md:col-span-3 p-4 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 border border-amber-500/40 text-white flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              আজকের সেরা কালেকটর
            </div>
            <div className="text-sm md:text-base font-black text-white">
              {metrics.topCollectorToday.name}
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-slate-400">জমা কালেকশন</div>
          <div className="text-lg font-black text-amber-400 font-mono">
            {formatBDT(metrics.topCollectorToday.amount)}
          </div>
        </div>
      </div>

      {/* Top Member Banner - Span 3 */}
      <div className="col-span-2 md:col-span-3 p-4 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/40 text-white flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30 shrink-0">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
              আজকের সর্বোচ্চ পরিশোধকারী ড্রাইভার/মেম্বার
            </div>
            <div className="text-sm md:text-base font-black text-white">
              {metrics.topPayingMemberToday.name}
            </div>
            <div className="text-[11px] text-indigo-300">
              {metrics.topPayingMemberToday.vehicleNo}
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-slate-400">পরিশোধিত</div>
          <div className="text-lg font-black text-indigo-300 font-mono">
            {formatBDT(metrics.topPayingMemberToday.amount)}
          </div>
        </div>
      </div>

    </div>
  );
};
