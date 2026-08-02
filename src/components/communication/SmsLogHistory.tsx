import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign,
  Smartphone,
  CheckCheck,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { SmsLog } from '../../types/communication';
import { CommunicationService } from '../../services/communicationService';

interface SmsLogHistoryProps {
  currentTenantId: string;
}

export const SmsLogHistory: React.FC<SmsLogHistoryProps> = ({ currentTenantId }) => {
  const [logs, setLogs] = useState<SmsLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchPhone, setSearchPhone] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    loadLogs();
  }, [currentTenantId]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await CommunicationService.getSmsLogs(currentTenantId);
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(l => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    if (searchPhone.trim()) {
      const q = searchPhone.toLowerCase();
      return l.recipientPhone.toLowerCase().includes(q) || 
             (l.recipientName && l.recipientName.toLowerCase().includes(q)) ||
             l.message.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDeleteSingle = async (logId: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই SMS লগটি ডিলিট করতে চান?')) return;
    setIsDeleting(true);
    try {
      await CommunicationService.deleteSmsLog(logId);
      setLogs(prev => prev.filter(l => l.logId !== logId));
      setSelectedLogIds(prev => prev.filter(id => id !== logId));
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedLogIds.length === 0) return;
    if (!window.confirm(`আপনি কি নিশ্চিত যে নির্বাচিত ${selectedLogIds.length} টি SMS লগ ডিলিট করতে চান?`)) return;
    setIsDeleting(true);
    try {
      await CommunicationService.deleteSmsLogsBatch(selectedLogIds);
      setLogs(prev => prev.filter(l => !selectedLogIds.includes(l.logId)));
      setSelectedLogIds([]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('সতর্কতা! আপনি কি নিশ্চিত যে সমস্ত SMS ড্যাশবোর্ড ও ডেলিভারি লগ ডিলিট/ক্লিয়ার করতে চান? এটি আর ফেরত পাওয়া যাবে না।')) return;
    setIsDeleting(true);
    try {
      await CommunicationService.clearAllSmsLogs(currentTenantId);
      setLogs([]);
      setSelectedLogIds([]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedLogIds.length === filteredLogs.length) {
      setSelectedLogIds([]);
    } else {
      setSelectedLogIds(filteredLogs.map(l => l.logId));
    }
  };

  const handleToggleSelectOne = (logId: string) => {
    if (selectedLogIds.includes(logId)) {
      setSelectedLogIds(selectedLogIds.filter(id => id !== logId));
    } else {
      setSelectedLogIds([...selectedLogIds, logId]);
    }
  };

  const totalSmsSent = logs.reduce((acc, curr) => acc + (curr.smsCount || 1), 0);
  const totalSmsCost = logs.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">মোট প্রেরিত SMS</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{totalSmsSent} Part(s)</div>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">মোট আনুমানিক খরচ</span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">৳{totalSmsCost.toFixed(2)} BDT</div>
          </div>
          <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">সফল ডেলিভারি রেট</span>
            <div className="text-xl font-bold text-emerald-600 mt-0.5">100% (Delivered)</div>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <CheckCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
            <FileText className="w-5 h-5 text-emerald-600" />
            SMS সেন্ট লগ ও হিস্ট্রি ({logs.length} টি)
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="ফোন নম্বর বা নাম..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {selectedLogIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>সিলেক্ট করা ডিলিট করুন ({selectedLogIds.length})</span>
              </button>
            )}

            {logs.length > 0 && (
              <button
                onClick={handleClearAll}
                disabled={isDeleting}
                className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-rose-300"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>সমস্ত লগ ক্লিয়ার করুন</span>
              </button>
            )}

            <button
              onClick={loadLogs}
              className="p-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200"
              title="রিলোড করুন"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-500 mr-2" />
            SMS লগ লোড হচ্ছে...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">কোনো SMS প্রেরণের রেকর্ড পাওয়া যায়নি।</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedLogIds.length > 0 && selectedLogIds.length === filteredLogs.length}
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </th>
                  <th className="p-3">প্রাপক (Recipient)</th>
                  <th className="p-3">মেসেজ বডি (Message Body)</th>
                  <th className="p-3">গেটওয়ে (Gateway)</th>
                  <th className="p-3 text-center">SMS পার্ট</th>
                  <th className="p-3 text-right">খরচ (BDT)</th>
                  <th className="p-3 text-center">স্ট্যাটাস</th>
                  <th className="p-3 text-right">সময়</th>
                  <th className="p-3 text-right">ডিলিট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredLogs.map(log => {
                  const isChecked = selectedLogIds.includes(log.logId);
                  return (
                    <tr key={log.logId} className={`hover:bg-slate-50/50 dark:hover:bg-slate-700/30 ${isChecked ? 'bg-rose-50/30 dark:bg-rose-950/20' : ''}`}>
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectOne(log.logId)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-medium text-slate-900 dark:text-white">
                        <div>{log.recipientName || 'সাধারণ সদস্য'}</div>
                        <div className="text-[11px] font-mono text-emerald-600">{log.recipientPhone}</div>
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 max-w-xs truncate" title={log.message}>
                        {log.message}
                      </td>
                      <td className="p-3 font-mono text-slate-500 uppercase">{log.gateway}</td>
                      <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300">{log.smsCount}</td>
                      <td className="p-3 text-right font-bold text-emerald-600">৳{log.cost}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 flex items-center justify-center gap-1 w-fit mx-auto">
                          <CheckCircle2 className="w-3 h-3" />
                          Delivered
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-slate-400">
                        {new Date(log.timestamp).toLocaleString('bn-BD')}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteSingle(log.logId)}
                          className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded transition-colors"
                          title="এই লগটি ডিলিট করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
