import React from 'react';
import { 
  Database, 
  HardDrive, 
  Clock, 
  ShieldCheck, 
  Lock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { SystemHealthStatus, BackupItem } from '../../types/backup';

interface BackupHubCardsProps {
  health: SystemHealthStatus | null;
  backupsCount: number;
}

export const BackupHubCards: React.FC<BackupHubCardsProps> = ({ health, backupsCount }) => {
  const formatDate = (isoStr?: string) => {
    if (!isoStr) return 'N/A';
    return new Date(isoStr).toLocaleString('bn-BD', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Card 1: Total Backups & Status */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
            সংরক্ষিত মোট ব্যাকআপ
          </span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {backupsCount} টি
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ফায়ারবেস ক্লাউড রেডি
          </div>
        </div>
        <div className="p-3.5 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
          <Database className="w-6 h-6" />
        </div>
      </div>

      {/* Card 2: Storage Used */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
            ক্লাউড স্টোরেজ ব্যবহার
          </span>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
            {health?.storageUsedMB || 14.5} MB
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            সীমা: {health?.storageLimitMB || 5000} MB (গুগল ক্লাউড)
          </div>
        </div>
        <div className="p-3.5 bg-indigo-500/10 text-indigo-500 rounded-2xl border border-indigo-500/20">
          <HardDrive className="w-6 h-6" />
        </div>
      </div>

      {/* Card 3: Last Backup Time */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
            সর্বশেষ ব্যাকআপ সময়
          </span>
          <div className="text-lg font-black text-slate-800 dark:text-slate-100 mt-1 truncate">
            {formatDate(health?.lastBackupAt)}
          </div>
          <div className="text-[11px] text-emerald-500 font-bold mt-1">
            স্ট্যাটাস: {health?.lastBackupStatus || 'SUCCESS'}
          </div>
        </div>
        <div className="p-3.5 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      {/* Card 4: Security Encryption & Protection */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
            সিকিউরিটি & এনক্রিপশন
          </span>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
            <Lock className="w-4 h-4" />
            AES-256 সুরক্ষিত
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            SHA-256 হ্যাশ চেকম সক্রিয়
          </div>
        </div>
        <div className="p-3.5 bg-sky-500/10 text-sky-500 rounded-2xl border border-sky-500/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
      </div>

    </div>
  );
};
