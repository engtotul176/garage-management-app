import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Plus, 
  X, 
  Lock 
} from 'lucide-react';
import { CashbookEntry, DailyCashClosing } from '../../types/finance';

interface Props {
  entries: CashbookEntry[];
  closings: DailyCashClosing[];
  onAddEntry: (entry: any) => Promise<void>;
  onCloseDay: (date: string, physicalCash?: number, note?: string) => Promise<void>;
  currentCashBalance: number;
  actorName: string;
}

export const CashbookSystem: React.FC<Props> = ({
  entries,
  closings,
  onAddEntry,
  onCloseDay,
  currentCashBalance,
  actorName
}) => {
  const [activeTab, setActiveTab] = useState<'log' | 'closing'>('log');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'cash_in' | 'cash_out'>('all');

  // Manual Cash Entry Modal
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [entryType, setEntryType] = useState<'cash_in' | 'cash_out'>('cash_in');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [partyName, setPartyName] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Day Closing Form State
  const [closingDate, setClosingDate] = useState(new Date().toISOString().split('T')[0]);
  const [physicalCash, setPhysicalCash] = useState<string>('');
  const [closingNote, setClosingNote] = useState('');

  const formatTk = (amt: number) => `৳ ${amt.toLocaleString('bn-BD')}`;

  // Filtered Cashbook Entries
  const filteredEntries = entries.filter(e => {
    const matchesSearch = 
      e.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.referenceNo && e.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || e.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate stats for selected date closing
  const todayStr = closingDate;
  const todayEntries = entries.filter(e => e.date === todayStr);
  const todayCashIn = todayEntries.filter(e => e.type === 'cash_in').reduce((s, e) => s + e.amount, 0);
  const todayCashOut = todayEntries.filter(e => e.type === 'cash_out').reduce((s, e) => s + e.amount, 0);

  // Find previous day closing
  const prevClosing = closings.find(c => c.date < todayStr);
  const openingBalance = prevClosing ? prevClosing.closingBalance : 0;
  const calculatedClosing = openingBalance + todayCashIn - todayCashOut;
  const actualPhysical = physicalCash !== '' ? Number(physicalCash) : calculatedClosing;
  const discrepancy = actualPhysical - calculatedClosing;

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyName || !amount || Number(amount) <= 0) {
      alert('সঠিক তথ্য প্রদান করুন!');
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date();
      await onAddEntry({
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0].substring(0, 5),
        type: entryType,
        amount: Number(amount),
        category: category || (entryType === 'cash_in' ? 'ম্যানুয়াল নগদ জমা' : 'ম্যানুয়াল নগদ উত্তোলন'),
        partyName,
        referenceNo,
        description: description || 'ক্যাশ রেজিস্টার সরাসরি এন্ট্রি',
        sourceModule: 'manual',
        createdBy: actorName
      });

      setAmount('');
      setCategory('');
      setPartyName('');
      setReferenceNo('');
      setDescription('');
      setShowEntryModal(false);
    } catch (e) {
      alert('ক্যাশ এন্ট্রি সংরক্ষণ করতে ব্যর্থ হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePerformClosing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCloseDay(closingDate, actualPhysical, closingNote);
      alert(`${closingDate} তারিখের নগদ ক্যাশ ক্লোজিং সফল হয়েছে!`);
      setClosingNote('');
    } catch (e) {
      alert('ক্লোজিং করতে সমস্যা হয়েছে');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Balance Display */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-900 via-blue-950 to-slate-900 text-white shadow-lg border border-sky-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-300 px-2.5 py-1 rounded-full bg-sky-900/60 border border-sky-700/50">
            Cashbook & Vault Ledger
          </span>
          <h2 className="text-2xl font-bold mt-2">
            নগদ ক্যাশবুক ও দৈনিক ক্লোজিং
          </h2>
          <p className="text-xs text-sky-200 mt-1">
            দৈনিক ক্যাশ ইন/আউট রিয়েল-টাইম হিসাব এবং শারীরিক ক্যাশ মিলকরণ
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-right min-w-[220px]">
          <span className="text-xs text-sky-200 font-semibold block">
            বর্তমান নগদ ক্যাশ স্থিতি
          </span>
          <h3 className="text-3xl font-black text-emerald-300 mt-1">
            {formatTk(currentCashBalance)}
          </h3>
          <span className="text-[10px] text-sky-300 block mt-0.5">
            সর্বশেষ ক্যাশ রেজিস্টার ব্যালেন্স
          </span>
        </div>
      </div>

      {/* Tabs & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('log')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'log'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            ক্যাশ বুক জার্নাল লগ ({entries.length})
          </button>
          <button
            onClick={() => setActiveTab('closing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'closing'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            দৈনিক ডে ক্লোজিং মডিউল ({closings.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setEntryType('cash_in'); setShowEntryModal(true); }}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>ক্যাশ ইন (+)</span>
          </button>

          <button
            onClick={() => { setEntryType('cash_out'); setShowEntryModal(true); }}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>ক্যাশ আউট (-)</span>
          </button>
        </div>
      </div>

      {activeTab === 'closing' ? (
        /* DAILY CLOSING MODULE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Perform Closing Form */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600" />
                দৈনিক ক্যাশ ক্লোজিং ফর্ম
              </h3>
              <p className="text-xs text-slate-500">
                দিনের শেষে ক্যাশ বাক্সের নগদ টাকা হিসাব করে ক্লোজিং নিশ্চিত করুন
              </p>
            </div>

            <form onSubmit={handlePerformClosing} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">ক্লোজিং তারিখ</label>
                <input
                  type="date"
                  value={closingDate}
                  onChange={e => setClosingDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">প্রারম্ভিক জের (Opening):</span>
                  <span className="font-bold">{formatTk(openingBalance)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>মোট ক্যাশ ইন (+):</span>
                  <span className="font-bold">{formatTk(todayCashIn)}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>মোট ক্যাশ আউট (-):</span>
                  <span className="font-bold">{formatTk(todayCashOut)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-800 dark:text-slate-100 text-sm">
                  <span>হিসাবকৃত সমাপনী জের:</span>
                  <span className="text-sky-600 dark:text-sky-400">{formatTk(calculatedClosing)}</span>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">শারীরিক গণনা করা নগদ ক্যাশ (Actual Cash in Box)</label>
                <input
                  type="number"
                  placeholder={calculatedClosing.toString()}
                  value={physicalCash}
                  onChange={e => setPhysicalCash(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-black text-amber-600 text-base"
                />
              </div>

              {/* Discrepancy Alert */}
              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                discrepancy === 0
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40'
                  : discrepancy > 0
                  ? 'bg-sky-50 border-sky-200 text-sky-800 dark:bg-sky-950/40'
                  : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40'
              }`}>
                <div className="flex items-center gap-2">
                  {discrepancy === 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                  <span>
                    {discrepancy === 0 
                      ? 'ক্যাশ বাক্সের হিসাব হুবহু মিলেছে' 
                      : discrepancy > 0 
                      ? `ক্যাশ বাক্সে বাড়তি: ${formatTk(discrepancy)}` 
                      : `ক্যাশ বাক্সে ঘাটতি: ${formatTk(Math.abs(discrepancy))}`}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">নোট / মন্তব্য</label>
                <textarea
                  rows={2}
                  placeholder="ক্লোজিং সংক্রান্ত কোনো বিশেষ নোট থাকলে লিখুন..."
                  value={closingNote}
                  onChange={e => setClosingNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{closingDate} দিনের ক্যাশ ক্লোজ করুন</span>
              </button>
            </form>
          </div>

          {/* Historical Closings List */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              পূর্ববর্তী ক্যাশ ক্লোজিং ইতিহাস (Closing History)
            </h3>

            <div className="space-y-3">
              {closings.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">
                  এখনো কোনো ডেইলি ক্লোজিং রেকর্ড করা হয়নি।
                </p>
              ) : (
                closings.map(cls => (
                  <div
                    key={cls.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        তারিখ: {cls.date}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 font-bold text-[10px]">
                        বন্ধকৃত (Closed)
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <div>
                        <span className="text-[10px] text-slate-400 block">ওপেনিং</span>
                        <span className="font-semibold">{formatTk(cls.openingBalance)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">ক্যাশ ইন</span>
                        <span className="font-semibold text-emerald-600">+{formatTk(cls.totalCashIn)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">ক্যাশ আউট</span>
                        <span className="font-semibold text-rose-600">-{formatTk(cls.totalCashOut)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">ক্লোজিং ক্যাশ</span>
                        <span className="font-bold text-amber-600">{formatTk(cls.closingBalance)}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 pt-1">
                      সম্পাদনকারী: {cls.closedBy} | সময়: {cls.closedAt ? new Date(cls.closedAt).toLocaleTimeString('bn-BD') : ''}
                      {cls.note && ` | নোট: ${cls.note}`}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      ) : (
        /* CASHBOOK LOG JOURNAL TAB */
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="পার্টি, বিবরণ বা রেফ দিয়ে খুঁজুন..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
              >
                <option value="all">সকল ক্যাশ ইন/আউট</option>
                <option value="cash_in">শুধুমাত্র ক্যাশ ইন (+)</option>
                <option value="cash_out">শুধুমাত্র ক্যাশ আউট (-)</option>
              </select>

              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                মোট রেকর্ড: <strong className="text-sky-600 dark:text-sky-400">{filteredEntries.length} টি</strong>
              </span>
            </div>
          </div>

          {/* Cashbook Journal Table */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">তারিখ ও সময়</th>
                    <th className="p-3.5">ধরণ</th>
                    <th className="p-3.5">পার্টি / প্রাপক</th>
                    <th className="p-3.5">খাত / বিবরণ</th>
                    <th className="p-3.5 text-right">ক্যাশ ইন (+TK)</th>
                    <th className="p-3.5 text-right">ক্যাশ আউট (-TK)</th>
                    <th className="p-3.5 text-right">চলমান ব্যালেন্স (TK)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        কোনো ক্যাশবুক এন্ট্রি পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                            {e.date}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {e.time}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                            e.type === 'cash_in'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {e.type === 'cash_in' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                            <span>{e.type === 'cash_in' ? 'ক্যাশ ইন' : 'ক্যাশ আউট'}</span>
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-100">
                          {e.partyName}
                        </td>
                        <td className="p-3.5">
                          <span className="font-medium text-slate-700 dark:text-slate-300 block">
                            {e.category}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate max-w-[200px] block">
                            {e.description}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          {e.type === 'cash_in' ? formatTk(e.amount) : '-'}
                        </td>
                        <td className="p-3.5 text-right font-bold text-rose-600 dark:text-rose-400">
                          {e.type === 'cash_out' ? formatTk(e.amount) : '-'}
                        </td>
                        <td className="p-3.5 text-right font-black text-sky-600 dark:text-sky-400">
                          {formatTk(e.runningCashBalance)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CASH ENTRY MODAL */}
      {showEntryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-sky-600" />
                {entryType === 'cash_in' ? 'ম্যানুয়াল ক্যাশ ইন এন্ট্রি' : 'ম্যানুয়াল ক্যাশ আউট এন্ট্রি'}
              </h3>
              <button onClick={() => setShowEntryModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">পার্টি / চালক / ব্যক্তির নাম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোঃ জসিম উদ্দিন"
                  value={partyName}
                  onChange={e => setPartyName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">খাত / বিষয়</label>
                <input
                  type="text"
                  placeholder="যেমন: চার্জিং বাকি আদায় / সরঞ্জাম কেনা"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">টাকার পরিমাণ (TK)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="যেমন: ৫০০"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-base ${
                    entryType === 'cash_in' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">রেফারেন্স / ভাউচার নং (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="যেমন: VOUCH-001"
                  value={referenceNo}
                  onChange={e => setReferenceNo(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">বিবরণ</label>
                <textarea
                  rows={2}
                  placeholder="সংক্ষিপ্ত বিবরণ..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEntryModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-1.5 rounded-lg font-bold text-white ${
                    entryType === 'cash_in' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {isSubmitting ? 'পোস্ট হচ্ছে...' : 'ক্যাশ এন্ট্রি সম্পন্ন করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
