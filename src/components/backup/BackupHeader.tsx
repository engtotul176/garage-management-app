import React from 'react';
import { Database, ShieldCheck, RefreshCw, HardDrive, DownloadCloud, Sparkles } from 'lucide-react';

interface BackupHeaderProps {
  onRefresh: () => void;
  loading: boolean;
  onOpenCreateBackup: () => void;
}

export const BackupHeader: React.FC<BackupHeaderProps> = ({
  onRefresh,
  loading,
  onOpenCreateBackup
}) => {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-1 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5" /> PROMPT-18 Enterprise Backup & Disaster Recovery
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <Database className="w-6 h-6 text-emerald-400" />
          ব্যাকআপ, রিস্টোর & ডিজাস্টার রিকভারি ম্যানেজমেন্ট
        </h1>
        <p className="text-xs text-slate-300 max-w-2xl">
          ফায়ারবেস ক্লাউড স্টোরেজ ডাটাবেজ ম্যানুয়াল/অটো ব্যাকআপ, ওয়ান-ক্লিক রিস্টোর উইজার্ড, অডিট ট্রেইল এবং সেফটি রোলব্যাক প্রোটেকশন।
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0 z-10">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl border border-white/20 transition-all backdrop-blur-md"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          ডাটা স্ট্যাটাস রিফ্রেশ
        </button>

        <button
          onClick={onOpenCreateBackup}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-2xl shadow-lg transition-all active:scale-95"
        >
          <DownloadCloud className="w-4 h-4" />
          নতুন ব্যাকআপ তৈরি করুন
        </button>
      </div>
    </div>
  );
};
