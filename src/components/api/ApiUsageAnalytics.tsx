import React from 'react';
import { Smartphone, Monitor, Tv, Cpu, Wifi, CheckCircle2, XCircle, ShieldAlert, BarChart3, Zap } from 'lucide-react';
import { MobileSessionRecord } from '../../types/apiBackend';

interface ApiUsageAnalyticsProps {
  mobileSessions: MobileSessionRecord[];
  onSessionRevoked: (sessionId: string) => void;
}

export const ApiUsageAnalytics: React.FC<ApiUsageAnalyticsProps> = ({
  mobileSessions,
  onSessionRevoked
}) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ANDROID':
        return <Smartphone className="w-5 h-5 text-emerald-500" />;
      case 'IOS':
        return <Smartphone className="w-5 h-5 text-sky-500" />;
      case 'ANDROID_TV':
        return <Tv className="w-5 h-5 text-purple-500" />;
      case 'DESKTOP':
        return <Monitor className="w-5 h-5 text-amber-500" />;
      default:
        return <Cpu className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">গড় API লেটেন্সি</div>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">48.5 ms</div>
            <div className="text-[10px] text-emerald-500 font-bold mt-0.5">High Performance SLA</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">আজকের মোট রিকোয়েস্ট</div>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">14,280</div>
            <div className="text-[10px] text-indigo-500 font-bold mt-0.5">99.98% Success Rate</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">এক্টিভ মোবাইল সেশন</div>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">{mobileSessions.length} Devices</div>
            <div className="text-[10px] text-purple-500 font-bold mt-0.5">Android, iOS & TV</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-sky-500/10 text-sky-500 rounded-2xl">
            <Wifi className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">FCM Push Gateway</div>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">ONLINE</div>
            <div className="text-[10px] text-sky-500 font-bold mt-0.5">Realtime Socket Ready</div>
          </div>
        </div>

      </div>

      {/* Active Mobile & TV App Sessions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-indigo-500" />
              Active Mobile App & TV Screen Sessions
            </h3>
            <p className="text-xs text-slate-500">
              যেসব মোবাইল, ট্যাবলেট ও অ্যান্ড্রয়েড টিভিতে বর্তমানে ইউজার লগইন রয়েছে
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-black border border-emerald-500/30">
            {mobileSessions.filter(s => s.status === 'ACTIVE').length} Online
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mobileSessions.map((session) => (
            <div 
              key={session.id} 
              className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 relative hover:border-indigo-500/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-200 dark:bg-slate-900 rounded-xl">
                    {getPlatformIcon(session.platform)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">{session.userName || 'ইউজার'}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{session.deviceId}</p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                  session.status === 'ACTIVE' 
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                }`}>
                  {session.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block font-sans">অ্যাপ ভার্সন:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{session.appVersion}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">IP এড্রেস:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{session.ipAddress}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-[10px]">
                <span className="text-slate-400">
                  সর্বশেষ এক্টিভ: {new Date(session.lastActiveAt).toLocaleTimeString('bn-BD')}
                </span>

                {session.status === 'ACTIVE' && (
                  <button
                    onClick={() => onSessionRevoked(session.id)}
                    className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold rounded-lg border border-rose-500/30 transition-all"
                  >
                    লগআউট / কিল
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
