import React, { useState } from 'react';
import { X, DownloadCloud, CheckCircle2, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { BackupType } from '../../types/backup';
import { BackupService } from '../../services/backupService';

interface BackupCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  tenantName: string;
  actorName: string;
  onBackupCreated: () => void;
}

export const BackupCreatorModal: React.FC<BackupCreatorModalProps> = ({
  isOpen,
  onClose,
  tenantId,
  tenantName,
  actorName,
  onBackupCreated
}) => {
  const [backupType, setBackupType] = useState<BackupType>('MANUAL');
  const [isEncrypted, setIsEncrypted] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressLabel, setProgressLabel] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleStartBackup = async () => {
    setLoading(true);
    setProgress(15);
    setProgressLabel('ফায়ারবেস ডাটাবেজ কানেকশন স্ক্যান করা হচ্ছে...');

    setTimeout(async () => {
      setProgress(45);
      setProgressLabel('কালেকশন ডাটা সিরিয়ালাইজড এবং এনক্রিপ্ট করা হচ্ছে...');

      setTimeout(async () => {
        setProgress(85);
        setProgressLabel('ফায়ারবেস ক্লাউড স্টোরেজে অবজেক্ট সেভ করা হচ্ছে...');

        try {
          const item = await BackupService.createBackup({
            tenantId,
            tenantName,
            backupType,
            createdBy: actorName,
            isEncrypted
          });

          setProgress(100);
          setProgressLabel('ব্যাকআপ প্রক্রিয়া সম্পূর্ণ সফল!');
          setSuccess(true);

          setTimeout(() => {
            setSuccess(false);
            setLoading(false);
            setProgress(0);
            onBackupCreated();
            onClose();
          }, 1200);

        } catch (e) {
          console.error(e);
          setLoading(false);
        }
      }, 500);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-5">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
            <DownloadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">নতুন ক্লাউড ব্যাকআপ জেনারেট করুন</h3>
            <p className="text-xs text-slate-400">
              ফায়ারবেস ফায়ারস্টোর কালেকশনের ডাটাবেজ স্ন্যাপশট ও সিকিউর ডাম্প
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <div className="text-sm font-black text-emerald-400 font-mono">{progress}%</div>
              <div className="text-xs text-slate-300 font-bold">{progressLabel}</div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-sky-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Backup Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ব্যাকআপের ধরন (Backup Type) নির্বাচন করুন:
              </label>
              <select
                value={backupType}
                onChange={(e) => setBackupType(e.target.value as BackupType)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500 font-semibold"
              >
                <option value="MANUAL">১. ম্যানুয়াল ফুল ডাটাবেজ ব্যাকআপ (Full DB Dump)</option>
                <option value="ORGANIZATION_WISE">২. অর্গানাইজেশন ওয়াইজ ডাটা ডাম্প (Organization Wise)</option>
                <option value="COLLECTION_WISE">৩. কালেকশন ও পেমেন্ট হিস্ট্রি ডাটা (Collections Only)</option>
                <option value="SETTINGS_ONLY">৪. সিস্টেম কনফিগারেশন & সিকিউরিটি সেটিংস (Settings Backup)</option>
                <option value="BRANDING_ONLY">৫. ব্র্যান্ডিং, থিম ও লোগো প্রেফারেন্স (Branding Backup)</option>
              </select>
            </div>

            {/* Target Tenant Info */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs space-y-1">
              <div className="text-slate-400 font-bold">টার্গেট ইনস্টিটিউশন/টেন্যান্ট:</div>
              <div className="text-indigo-400 font-black">{tenantName} ({tenantId})</div>
            </div>

            {/* Encryption Toggle */}
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs font-black text-white">AES-256 ডাটা এনক্রিপশন</div>
                  <div className="text-[10px] text-emerald-200">ব্যাকআপ ফাইলটিতে এনক্রিপ্ট হ্যাশ অন্তর্ভুক্ত হবে</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isEncrypted}
                onChange={(e) => setIsEncrypted(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleStartBackup}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg active:scale-95"
              >
                <DownloadCloud className="w-4 h-4" />
                এখনই ব্যাকআপ রান করুন
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
