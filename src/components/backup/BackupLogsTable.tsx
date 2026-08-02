import React, { useState } from 'react';
import { 
  Download, 
  RotateCcw, 
  Trash2, 
  Search, 
  CheckCircle2, 
  Clock, 
  Database, 
  ShieldCheck, 
  Lock, 
  FileText 
} from 'lucide-react';
import { BackupItem, BackupLog, RestoreLog } from '../../types/backup';
import { BackupService } from '../../services/backupService';

interface BackupLogsTableProps {
  backups: BackupItem[];
  backupLogs: BackupLog[];
  restoreLogs: RestoreLog[];
  onOpenRestorePreview: (backup: BackupItem) => void;
  onRefresh: () => void;
}

export const BackupLogsTable: React.FC<BackupLogsTableProps> = ({
  backups,
  backupLogs,
  restoreLogs,
  onOpenRestorePreview,
  onRefresh
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'BACKUPS' | 'AUDIT_LOGS' | 'RESTORE_LOGS'>('BACKUPS');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredBackups = backups.filter(b => 
    b.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (backupId: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই ব্যাকআপ ফাইলটি মুছে ফেলতে চান?')) {
      await BackupService.deleteBackup(backupId);
      onRefresh();
    }
  };

  const handleDownload = (backup: BackupItem) => {
    BackupService.downloadBackupFile(backup);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      
      {/* Sub Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveSubTab('BACKUPS')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeSubTab === 'BACKUPS'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            সংরক্ষিত ব্যাকআপ তালিকা ({backups.length})
          </button>
          <button
            onClick={() => setActiveSubTab('AUDIT_LOGS')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeSubTab === 'AUDIT_LOGS'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            ব্যাকআপ সৃষ্টি লগ ({backupLogs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('RESTORE_LOGS')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeSubTab === 'RESTORE_LOGS'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            রিস্টোর হিস্ট্রি লগ ({restoreLogs.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="ফাইল নেম বা ব্যবহারকারী অনুসন্ধান..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-emerald-500 w-full sm:w-64"
          />
        </div>

      </div>

      {/* Sub Tab 1: Backups List Table */}
      {activeSubTab === 'BACKUPS' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="py-3 px-3">ব্যাকআপ ফাইল নেম</th>
                <th className="py-3 px-3">ধরন</th>
                <th className="py-3 px-3">সাইজ & রেকর্ড</th>
                <th className="py-3 px-3">তৈরির তারিখ</th>
                <th className="py-3 px-3">তৈরিকারী</th>
                <th className="py-3 px-3">সিকিউরিটি</th>
                <th className="py-3 px-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filteredBackups.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">
                    কোনো ব্যাকআপ ফাইল পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredBackups.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Database className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="truncate max-w-xs">{item.filename}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">ID: {item.id}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {item.backupType}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold">{item.sizeFormatted}</div>
                      <div className="text-[10px] text-slate-400">{item.totalRecordsCount} টি রেকর্ড</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold">{new Date(item.createdAt).toLocaleDateString('bn-BD')}</div>
                      <div className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleTimeString('bn-BD')}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{item.createdBy}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-500">
                        <Lock className="w-3 h-3" /> AES-256
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDownload(item)}
                          title="ডাউনলোড করুন"
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onOpenRestorePreview(item)}
                          title="রিস্টোর প্রিভিউ"
                          className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 transition-all font-bold text-[11px] flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>রিস্টোর</span>
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          title="মুছে ফেলুন"
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Sub Tab 2: Backup Creation Audit Logs */}
      {activeSubTab === 'AUDIT_LOGS' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase">
                <th className="py-3 px-3">ফাইল নেম</th>
                <th className="py-3 px-3">টাইপ</th>
                <th className="py-3 px-3">সাইজ</th>
                <th className="py-3 px-3">তৈরির তারিখ</th>
                <th className="py-3 px-3">ব্যবহারকারী</th>
                <th className="py-3 px-3">ডিউরেশন</th>
                <th className="py-3 px-3">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {backupLogs.map((log) => (
                <tr key={log.id}>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">{log.backupFilename}</td>
                  <td className="py-3 px-3"><span className="font-bold">{log.backupType}</span></td>
                  <td className="py-3 px-3">{log.sizeFormatted}</td>
                  <td className="py-3 px-3">{new Date(log.createdAt).toLocaleString('bn-BD')}</td>
                  <td className="py-3 px-3 font-bold text-emerald-500">{log.createdBy}</td>
                  <td className="py-3 px-3 font-mono">{log.durationMs} ms</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-500">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sub Tab 3: Restore Logs */}
      {activeSubTab === 'RESTORE_LOGS' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase">
                <th className="py-3 px-3">রিস্টোর আইডি</th>
                <th className="py-3 px-3">ব্যাকআপ ফাইল</th>
                <th className="py-3 px-3">মোড</th>
                <th className="py-3 px-3">রেকর্ড সংখ্যা</th>
                <th className="py-3 px-3">রিস্টোরকারী</th>
                <th className="py-3 px-3">তারিখ</th>
                <th className="py-3 px-3">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {restoreLogs.map((log) => (
                <tr key={log.id}>
                  <td className="py-3 px-3 font-mono font-bold text-amber-500">{log.id}</td>
                  <td className="py-3 px-3 font-mono">{log.backupFilename}</td>
                  <td className="py-3 px-3"><span className="font-black">{log.restoreType}</span></td>
                  <td className="py-3 px-3 font-bold">{log.recordsRestoredCount} টি</td>
                  <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">{log.restoredBy}</td>
                  <td className="py-3 px-3">{new Date(log.restoredAt).toLocaleString('bn-BD')}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
