import React from 'react';
import { 
  Radio, 
  Receipt, 
  UserPlus, 
  Wallet, 
  Zap, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Trash2
} from 'lucide-react';
import { LiveActivityItem } from '../../types/tvDashboard';
import { TvDashboardService } from '../../services/tvDashboardService';

interface TvLiveActivityFeedProps {
  activities: LiveActivityItem[];
  isDarkMode: boolean;
}

export const TvLiveActivityFeed: React.FC<TvLiveActivityFeedProps> = ({ activities, isDarkMode }) => {
  const handleDeleteActivity = async (id: string, title: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে লাইভ ফিড থেকে "${title}" অ্যাক্টিভিটিটি ডিলিট করতে চান?`)) {
      await TvDashboardService.deleteLiveActivity(id);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('আপনি কি নিশ্চিত যে লাইভ ফিডের সমস্ত কর্মকাণ্ড ডিলিট ও ক্লিয়ার করতে চান?')) {
      await TvDashboardService.clearAllLiveActivities();
    }
  };

  const getIcon = (type: LiveActivityItem['type']) => {
    switch (type) {
      case 'COLLECTION':
        return <Wallet className="w-4 h-4 text-emerald-400" />;
      case 'MEMBER_JOIN':
        return <UserPlus className="w-4 h-4 text-indigo-400" />;
      case 'RECEIPT':
        return <Receipt className="w-4 h-4 text-sky-400" />;
      case 'CHARGING_START':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'CHARGING_COMPLETE':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Radio className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className={`p-6 rounded-3xl border shadow-2xl transition-all h-full flex flex-col justify-between ${
      isDarkMode 
        ? 'bg-slate-900/90 border-slate-800 text-white' 
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4 gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-2xl border border-indigo-500/20">
            <Radio className="w-5 h-5 animate-pulse text-rose-500" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight">লাইভ ফিড & কার্যাবলী (LIVE FEED)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              কালেকশন জমা, রসিদ এবং নতুন ড্রাইভার যোগের লাইভ ট্র্যাকার
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activities.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1 transition-all"
              title="সমস্ত ফিড ডিলিট করুন"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ক্লিয়ার ফিড</span>
            </button>
          )}

          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            লাইভ
          </span>
        </div>
      </div>

      {/* Activity Stream */}
      <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1 scrollbar-thin">
        {activities.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
            লাইভ ফিডে কোনো রেকর্ড নেই। সকল পুরনো কর্মকাণ্ড মুছে ফেলা হয়েছে।
          </div>
        ) : (
          activities.map((act) => (
            <div 
              key={act.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isDarkMode 
                  ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700' 
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                  {getIcon(act.type)}
                </div>
                <div>
                  <div className="text-xs font-black text-white dark:text-slate-100 flex items-center gap-2">
                    <span>{act.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-normal">
                      {act.timestamp}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {act.subtitle}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {act.amount !== undefined && (
                  <div className="text-right">
                    <div className="text-xs font-black text-emerald-400 font-mono">
                      + ৳ {act.amount.toLocaleString('bn-BD')}
                    </div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase">
                      জমা হয়েছে
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleDeleteActivity(act.id, act.title)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="এই অ্যাক্টিভিটি ডিলিট করুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 text-center text-xs text-slate-500 font-semibold">
        সর্বশেষ {activities.length} টি লাইভ কর্মকাণ্ড প্রদর্শিত
      </div>

    </div>
  );
};
