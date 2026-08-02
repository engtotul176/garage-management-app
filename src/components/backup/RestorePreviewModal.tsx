import React, { useState } from 'react';
import { X, RefreshCw, AlertTriangle, ShieldCheck, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { BackupItem } from '../../types/backup';
import { BackupService } from '../../services/backupService';

interface RestorePreviewModalProps {
  backupItem: BackupItem | null;
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  actorName: string;
  onRestoreComplete: () => void;
}

export const RestorePreviewModal: React.FC<RestorePreviewModalProps> = ({
  backupItem,
  isOpen,
  onClose,
  tenantId,
  actorName,
  onRestoreComplete
}) => {
  const [restoreType, setRestoreType] = useState<'FULL' | 'ORGANIZATION' | 'COLLECTION'>('FULL');
  const [createRollback, setCreateRollback] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen || !backupItem) return null;

  const handleExecuteRestore = async () => {
    setLoading(true);
    setProgress(20);

    setTimeout(async () => {
      setProgress(50);
      try {
        await BackupService.restoreBackup({
          backupItem,
          restoreType,
          restoredBy: actorName,
          tenantId,
          createRollbackPoint: createRollback
        });

        setProgress(100);
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
          setLoading(false);
          setProgress(0);
          onRestoreComplete();
          onClose();
        }, 1200);

      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        
        {/* Close */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-5">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">ব্যাকআপ রিস্টোর প্রিভিউ & এক্সিকিউশন</h3>
            <p className="text-xs text-slate-400">
              ডাটা রিস্টোরের পূর্বে স্ন্যাপশট চেকম এবং রোলব্যাক পয়েন্ট সেটআপ
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mx-auto" />
            <div className="text-sm font-black text-amber-400">
              রিস্টোর প্রক্রিয়া চলছে... {progress}%
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
              <div 
                className="bg-gradient-to-r from-amber-500 to-rose-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* File Info Box */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span>ব্যাকআপ ফাইল:</span>
                <span className="font-mono text-amber-400 font-bold">{backupItem.filename}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>সাইজ & রেকর্ড সংখ্যা:</span>
                <span className="font-bold text-white">{backupItem.sizeFormatted} ({backupItem.totalRecordsCount} টি রেকর্ড)</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>তৈরি তারিখ:</span>
                <span className="font-bold text-white">{new Date(backupItem.createdAt).toLocaleString('bn-BD')}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>তৈরিকারী:</span>
                <span className="font-bold text-emerald-400">{backupItem.createdBy}</span>
              </div>
            </div>

            {/* Restore Scope */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                রিস্টোর মোড (Restore Scope):
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRestoreType('FULL')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all border ${
                    restoreType === 'FULL'
                      ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  সম্পূর্ণ রিস্টোর
                </button>
                <button
                  type="button"
                  onClick={() => setRestoreType('ORGANIZATION')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all border ${
                    restoreType === 'ORGANIZATION'
                      ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  অর্গানাইজেশন
                </button>
                <button
                  type="button"
                  onClick={() => setRestoreType('COLLECTION')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all border ${
                    restoreType === 'COLLECTION'
                      ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  অনলি কালেকশন
                </button>
              </div>
            </div>

            {/* Safety Rollback Checkbox */}
            <div className="p-3.5 bg-indigo-950/40 border border-indigo-800 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="font-black text-white">সেফটি অটো রোলব্যাক স্ন্যাপশট</div>
                  <div className="text-[10px] text-indigo-200">রিস্টোরের ঠিক পূর্বে ডাটাবেজের একটি নিরাপত্তা অন-মেমোরি ব্যাকআপ রাখা হবে</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={createRollback}
                onChange={(e) => setCreateRollback(e.target.checked)}
                className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
              />
            </div>

            {/* Danger Warning */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                সতর্কতা: রিস্টোর প্রক্রিয়া বর্তমান অসসংরক্ষিত ফিল্ড বা কালেকশনকে ওভাররাইট করতে পারে।
              </span>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleExecuteRestore}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-lg active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                রিস্টোর কনফার্ম করুন
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
