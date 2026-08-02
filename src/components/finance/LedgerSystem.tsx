import React, { useState } from 'react';
import { 
  PiggyBank, 
  Users, 
  UserCheck, 
  Building2, 
  Wallet, 
  Landmark, 
  Search, 
  Calendar, 
  Printer, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft 
} from 'lucide-react';
import { LedgerEntry } from '../../types/finance';

interface Props {
  ledgers: LedgerEntry[];
  tenantName: string;
}

export const LedgerSystem: React.FC<Props> = ({ ledgers, tenantName }) => {
  const [activeLedgerType, setActiveLedgerType] = useState<'member' | 'employee' | 'organization' | 'cash' | 'bank'>('member');
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const formatTk = (amt: number) => `৳ ${amt.toLocaleString('bn-BD')}`;

  const ledgerTabs = [
    { id: 'member', label: 'মেম্বার/চালক খতিয়ান (Member Ledger)', icon: Users, color: 'text-emerald-600' },
    { id: 'employee', label: 'স্টাফ/কর্মচারী খতিয়ান (Employee Ledger)', icon: UserCheck, color: 'text-indigo-600' },
    { id: 'organization', label: 'অর্গানাইজেশন লেজার (Org Ledger)', icon: Building2, color: 'text-purple-600' },
    { id: 'cash', label: 'ক্যাশ খতিয়ান (Cash Ledger)', icon: Wallet, color: 'text-sky-600' },
    { id: 'bank', label: 'ব্যাংক খতিয়ান (Bank Ledger)', icon: Landmark, color: 'text-amber-600' }
  ];

  const filteredLedgers = ledgers.filter(l => {
    const matchesType = l.ledgerType === activeLedgerType;
    const matchesSearch = 
      l.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFrom = !fromDate || l.date >= fromDate;
    const matchesTo = !toDate || l.date <= toDate;

    return matchesType && matchesSearch && matchesFrom && matchesTo;
  });

  const totalDebit = filteredLedgers.reduce((s, l) => s + (l.debit || 0), 0);
  const totalCredit = filteredLedgers.reduce((s, l) => s + (l.credit || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-lg border border-purple-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 px-2.5 py-1 rounded-full bg-purple-900/60 border border-purple-700/50">
            General & Sub-Ledger System
          </span>
          <h2 className="text-2xl font-bold mt-2">
            সর্বজনীন খতিয়ান ও ডেবিট-ক্রেডিট লেজার
          </h2>
          <p className="text-xs text-purple-200 mt-1">
            চালকের বাকি হিসাব, স্টাফদের বেতন/অ্যাডভান্স, ক্যাশ ও ব্যাংকের নিখুঁত হিসাব
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট খতিয়ান</span>
          </button>
        </div>
      </div>

      {/* Sub Ledger Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {ledgerTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveLedgerType(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeLedgerType === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filters & Range Selector */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="পার্টি, ভাউচার বা বিবরণ দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto text-xs font-semibold">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">হতে:</span>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="p-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">পর্যন্ত:</span>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="p-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Ledger Journal Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {activeLedgerType === 'member' && 'মেম্বার/চালকদের খতিয়ান (Drivers & Members Ledger)'}
            {activeLedgerType === 'employee' && 'কর্মকর্তা ও কর্মচারী খতিয়ান (Staff & Employee Ledger)'}
            {activeLedgerType === 'organization' && 'অর্গানাইজেশনের সাধারণ খতিয়ান (General Ledger)'}
            {activeLedgerType === 'cash' && 'ক্যাশ হিসাব খতিয়ান (Cash Account Ledger)'}
            {activeLedgerType === 'bank' && 'ব্যাংক লেনদেন খতিয়ান (Bank Account Ledger)'}
          </h3>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-rose-600">মোট ডেবিট (Debit): {formatTk(totalDebit)}</span>
            <span className="text-emerald-600">মোট ক্রেডিট (Credit): {formatTk(totalCredit)}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">তারিখ</th>
                <th className="p-3.5">ভাউচার নম্বর</th>
                <th className="p-3.5">পার্টি / একাউন্টের নাম</th>
                <th className="p-3.5">বিবরণ (Narration)</th>
                <th className="p-3.5 text-right">ডেবিট (Debit TK)</th>
                <th className="p-3.5 text-right">ক্রেডিট (Credit TK)</th>
                <th className="p-3.5 text-right">জের (Balance TK)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredLedgers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    এই খতিয়ানে কোনো রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredLedgers.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                      {l.date}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {l.voucherNo || 'VOUCH-01'}
                    </td>
                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-100">
                      {l.entityName}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">
                      {l.description}
                    </td>
                    <td className="p-3.5 text-right font-bold text-rose-600">
                      {l.debit > 0 ? formatTk(l.debit) : '-'}
                    </td>
                    <td className="p-3.5 text-right font-bold text-emerald-600">
                      {l.credit > 0 ? formatTk(l.credit) : '-'}
                    </td>
                    <td className="p-3.5 text-right font-black text-purple-600 dark:text-purple-400">
                      {formatTk(l.balance || (l.credit - l.debit))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-slate-100 dark:bg-slate-800 font-bold border-t border-slate-300 dark:border-slate-700">
              <tr>
                <td colSpan={4} className="p-3.5 text-right">সর্বমোট:</td>
                <td className="p-3.5 text-right text-rose-600">{formatTk(totalDebit)}</td>
                <td className="p-3.5 text-right text-emerald-600">{formatTk(totalCredit)}</td>
                <td className="p-3.5 text-right text-purple-600">{formatTk(totalCredit - totalDebit)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
};
