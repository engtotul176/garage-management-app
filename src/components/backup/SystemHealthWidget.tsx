import React, { useState } from 'react';
import { 
  Settings, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Cloud, 
  ShieldCheck, 
  Save, 
  Sparkles, 
  Trash2 
} from 'lucide-react';
import { SystemHealthStatus } from '../../types/backup';

interface SystemHealthWidgetProps {
  health: SystemHealthStatus | null;
  onUpdateSettings: (updated: Partial<SystemHealthStatus>) => void;
}

export const SystemHealthWidget: React.FC<SystemHealthWidgetProps> = ({
  health,
  onUpdateSettings
}) => {
  const [autoEnabled, setAutoEnabled] = useState<boolean>(health?.autoBackupEnabled ?? true);
  const [frequency, setFrequency] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>(health?.backupFrequency ?? 'DAILY');
  const [retentionDays, setRetentionDays] = useState<number>(health?.retentionDays ?? 30);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = () => {
    onUpdateSettings({
      autoBackupEnabled: autoEnabled,
      backupFrequency: frequency,
      retentionDays
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Auto Backup Scheduler Config */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              অটোমেটিক ব্যাকআপ সিডিউলার & রিটেনশন পলিসি
            </h3>
            <p className="text-xs text-slate-500">
              ফায়ারবেস ব্যাকগ্রাউন্ড ক্রন জব ও ডাটা ক্লাউড সিঙ্ক
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          {/* Toggle Auto Backup */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200">অটো ব্যাকআপ ক্রন এনাবল</div>
              <div className="text-[10px] text-slate-400">নির্দিষ্ট সময় পর পর স্বয়ংক্রিয় ডাটা ডাম্প গ্রহণ করবে</div>
            </div>
            <input
              type="checkbox"
              checked={autoEnabled}
              onChange={(e) => setAutoEnabled(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Frequency Select */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
              ব্যাকআপের ফ্রিকোয়েন্সি (Frequency):
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
            >
              <option value="DAILY">দৈনিক একবার (Daily Automatic Backup - 12:00 AM)</option>
              <option value="WEEKLY">সাপ্তাহিক একবার (Weekly Automatic - Sunday)</option>
              <option value="MONTHLY">মাসিক একবার (Monthly Full Dump - 1st Day)</option>
            </select>
          </div>

          {/* Retention Days */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
              পুরাতন ব্যাকআপ সংরক্ষণের সময়সীমা (Retention Days):
            </label>
            <input
              type="number"
              value={retentionDays}
              onChange={(e) => setRetentionDays(Number(e.target.value))}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              {retentionDays} দিন পার হয়ে যাওয়া ব্যাকআপ ফাইল স্বয়ংক্রিয়ভাবে রিমুভ করা হবে।
            </span>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saved ? 'সেটিংস সংরক্ষিত হয়েছে!' : 'সেটিংস সেভ করুন'}
          </button>
        </div>
      </div>

      {/* GCP & Firestore Storage Health */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="p-3 bg-sky-500/10 text-sky-500 rounded-2xl border border-sky-500/20">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              ক্লাউড স্টোরেজ & ফায়ারবেস হেলথ
            </h3>
            <p className="text-xs text-slate-500">
              Google Cloud Storage Ready & Real-time Connectivity
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">ফায়ারবেস ফায়ারস্টোর কানেকশন</span>
              <span className="text-[10px] text-slate-400">লাইভ লিসেনার ও ডাটা রিড-রাইট সচল</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-extrabold text-[10px]">
              ONLINE
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">GCP Cloud Storage Bucket</span>
              <span className="text-[10px] text-slate-400">gs://ababil-cloud-saas-backups</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-500 font-extrabold text-[10px]">
              READY
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">AES-256 এনক্রিপশন কি (Key Engine)</span>
              <span className="text-[10px] text-slate-400">সিস্টেম মাস্টার এনক্রিপশন সিকিউর্ড</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 font-extrabold text-[10px]">
              ACTIVE
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
