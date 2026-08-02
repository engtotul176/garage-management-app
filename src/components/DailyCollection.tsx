import React, { useState } from 'react';
import { Receipt, QrCode, Printer, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import { DailyCollectionRecord } from '../types/saas';
import { MOCK_COLLECTIONS } from '../data/mockSaaSData';

export const DailyCollection: React.FC = () => {
  const [collections, setCollections] = useState<DailyCollectionRecord[]>(() => {
    try {
      const isCleared = localStorage.getItem('ababil_collections_cleared') === 'true';
      if (isCleared) return [];
      const saved = localStorage.getItem('ababil_daily_collections');
      const deletedIds: string[] = JSON.parse(localStorage.getItem('ababil_deleted_collection_ids') || '[]');
      let list = saved ? JSON.parse(saved) : [];
      return list.filter((item: DailyCollectionRecord) => !deletedIds.includes(item.id));
    } catch {
      return [];
    }
  });
  const [showForm, setShowForm] = useState(false);
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'চার্জিং ফি' | 'নাইট গার্ড ফি' | 'ওয়াশিং' | 'বকেয়া আদায়' | 'চাঁদা'>('চার্জিং ফি');
  const [paymentMethod, setPaymentMethod] = useState<'ক্যাশ' | 'বিকাশ' | 'নগদ' | 'ব্যাংক'>('ক্যাশ');

  const saveCollectionsToStorage = (updated: DailyCollectionRecord[]) => {
    try {
      localStorage.setItem('ababil_daily_collections', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save collections to localStorage:', e);
    }
  };

  const handleDeleteRecord = (id: string, receiptNo: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে রসিদ ${receiptNo} ডিলিট করতে চান?`)) {
      setCollections(prev => {
        const next = prev.filter(item => item.id !== id);
        saveCollectionsToStorage(next);
        try {
          const deletedIds: string[] = JSON.parse(localStorage.getItem('ababil_deleted_collection_ids') || '[]');
          if (!deletedIds.includes(id)) {
            deletedIds.push(id);
            localStorage.setItem('ababil_deleted_collection_ids', JSON.stringify(deletedIds));
          }
        } catch (e) {
          console.warn('Failed to save deleted collection id:', e);
        }
        return next;
      });
    }
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const newRecord: DailyCollectionRecord = {
      id: `COL-${Date.now().toString().slice(-4)}`,
      tenantId: 'org_bismillah_001',
      memberId: 'MEM-101',
      memberName: 'মোঃ আবদুর রহিম',
      vehicleNo: 'ঢাকা-মেট্রো-থ-১১-৪৫৮৯',
      amount: Number(amount),
      paymentMethod,
      receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      collectorName: 'মোঃ তারেক রহমান',
      collectorUid: 'user_employee_001',
      timestamp: new Date().toISOString()
    };

    const updated = [newRecord, ...collections];
    setCollections(updated);
    saveCollectionsToStorage(updated);
    setAmount('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-600" />
            দৈনিক কালেকশন ও রসিদ ভাউচার
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            তাৎক্ষণিক ক্যাশ, বিকাশ ও কিউআর কালেকশন সিস্টেম। প্রিন্টার রেডিPOS মেমো।
          </p>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>দ্রুত কালেকশন এন্ট্রি</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateCollection} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">নতুন কালেকশন জমা নিন</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                জমার পরিমাণ (টাকা)
              </label>
              <input
                type="number"
                placeholder="১০০"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                খাত / ক্যাটাগরি
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="চার্জিং ফি">চার্জিং ফি</option>
                <option value="নাইট গার্ড ফি">নাইট গার্ড ফি</option>
                <option value="ওয়াশিং">ওয়াশিং</option>
                <option value="বকেয়া আদায়">বকেয়া আদায়</option>
                <option value="চাঁদা">চাঁদা</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                পেমেন্ট মেথড
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ক্যাশ">ক্যাশ (নগদ)</option>
                <option value="বিকাশ">বিকাশ (bKash)</option>
                <option value="নগদ">নগদ (Nagad)</option>
                <option value="ব্যাংক">ব্যাংক ট্রান্সফার</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md"
            >
              কালেকশন সাবমিট ও মেমো প্রিন্ট
            </button>
          </div>
        </form>
      )}

      {/* Collection List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">আজকের কালেকশন হিস্ট্রি</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
              <tr>
                <th className="p-3">রসিদ নম্বর</th>
                <th className="p-3">মেম্বার নাম</th>
                <th className="p-3">গাড়ি নম্বর</th>
                <th className="p-3">ক্যাটাগরি</th>
                <th className="p-3">মেথড</th>
                <th className="p-3 text-right">পরিমাণ</th>
                <th className="p-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              {collections.map((col) => (
                <tr key={col.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{col.receiptNo}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{col.memberName}</td>
                  <td className="p-3 font-mono">{col.vehicleNo}</td>
                  <td className="p-3">{col.category}</td>
                  <td className="p-3">{col.paymentMethod}</td>
                  <td className="p-3 text-right font-extrabold text-slate-900 dark:text-white">৳ {col.amount}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-200 inline-flex items-center gap-1" title="প্রিন্ট করুন">
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteRecord(col.id, col.receiptNo)}
                        className="p-1.5 bg-rose-50 dark:bg-rose-950 text-rose-600 rounded hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors"
                        title="ডিলিট করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
