import React, { useState } from 'react';
import { 
  Landmark, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCcw, 
  Search, 
  CheckCircle2, 
  CreditCard, 
  X, 
  Building2, 
  ShieldCheck 
} from 'lucide-react';
import { BankAccount, BankTransaction } from '../../types/finance';

interface Props {
  accounts: BankAccount[];
  transactions: BankTransaction[];
  onSaveAccount: (account: any) => Promise<void>;
  onDeposit: (bankId: string, amount: number, ref: string, note: string) => Promise<void>;
  onWithdraw: (bankId: string, amount: number, ref: string, note: string) => Promise<void>;
  onTransfer: (sourceBankId: string, targetBankId: string, amount: number, ref: string, note: string) => Promise<void>;
  actorName: string;
}

export const BankManagement: React.FC<Props> = ({
  accounts,
  transactions,
  onSaveAccount,
  onDeposit,
  onWithdraw,
  onTransfer,
  actorName
}) => {
  const [selectedBankId, setSelectedBankId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Bank Form State
  const [accForm, setAccForm] = useState({
    accountName: '',
    bankName: '',
    accountNumber: '',
    branchName: '',
    routingNo: '',
    accountType: 'current' as 'savings' | 'current' | 'mobile_mfs',
    openingBalance: ''
  });

  // Action Form States
  const [targetBankId, setTargetBankId] = useState(accounts[0]?.id || '');
  const [sourceBankId, setSourceBankId] = useState(accounts[0]?.id || '');
  const [destBankId, setDestBankId] = useState(accounts[1]?.id || accounts[0]?.id || '');
  const [actionAmount, setActionAmount] = useState('');
  const [actionRef, setActionRef] = useState('');
  const [actionNote, setActionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatTk = (amt: number) => `৳ ${amt.toLocaleString('bn-BD')}`;

  const totalBankBalance = accounts
    .filter(a => a.status === 'active')
    .reduce((s, a) => s + a.currentBalance, 0);

  const filteredTx = transactions.filter(t => {
    const matchesBank = selectedBankId === 'all' || t.bankAccountId === selectedBankId;
    const matchesSearch = 
      t.bankAccountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.referenceNo && t.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesBank && matchesSearch;
  });

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accForm.bankName || !accForm.accountNumber) return;

    setIsSubmitting(true);
    try {
      await onSaveAccount({
        ...accForm,
        openingBalance: Number(accForm.openingBalance) || 0,
        currentBalance: Number(accForm.openingBalance) || 0,
        status: 'active',
        createdBy: actorName
      });
      setAccForm({
        accountName: '',
        bankName: '',
        accountNumber: '',
        branchName: '',
        routingNo: '',
        accountType: 'current',
        openingBalance: ''
      });
      setShowAccountModal(false);
    } catch (e) {
      alert('অ্যাকাউন্ট তৈরি করতে ব্যর্থ হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBankId || !actionAmount || Number(actionAmount) <= 0) return;
    setIsSubmitting(true);
    try {
      await onDeposit(targetBankId, Number(actionAmount), actionRef, actionNote);
      setActionAmount('');
      setActionRef('');
      setActionNote('');
      setShowDepositModal(false);
    } catch (e) {
      alert('ডিপোজিট ব্যর্থ হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBankId || !actionAmount || Number(actionAmount) <= 0) return;
    setIsSubmitting(true);
    try {
      await onWithdraw(targetBankId, Number(actionAmount), actionRef, actionNote);
      setActionAmount('');
      setActionRef('');
      setActionNote('');
      setShowWithdrawModal(false);
    } catch (e) {
      alert('উত্তোলন ব্যর্থ হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceBankId || !destBankId || sourceBankId === destBankId || !actionAmount || Number(actionAmount) <= 0) {
      alert('অনুগ্রহ করে সঠিক ব্যাংক অ্যাকাউন্ট ও পরিমাণ নির্বাচন করুন!');
      return;
    }
    setIsSubmitting(true);
    try {
      await onTransfer(sourceBankId, destBankId, Number(actionAmount), actionRef, actionNote);
      setActionAmount('');
      setActionRef('');
      setActionNote('');
      setShowTransferModal(false);
    } catch (e) {
      alert('ফান্ড ট্রান্সফার ব্যর্থ হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Bank Balance Summary */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-950 to-slate-900 text-white shadow-lg border border-indigo-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300 px-2.5 py-1 rounded-full bg-indigo-900/60 border border-indigo-700/50">
            Multi-Bank Account Center
          </span>
          <h2 className="text-2xl font-bold mt-2">
            ব্যাংক অ্যাকাউন্ট ও ট্রানজাকশন
          </h2>
          <p className="text-xs text-indigo-200 mt-1">
            প্রতিটি ব্যাংক অ্যাকাউন্টের স্থিতি, অনলাইন ডিপোজিট, উইথড্র ও ইন্টার-ব্যাংক ট্রান্সফার
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-right min-w-[220px]">
          <span className="text-xs text-indigo-200 font-semibold block">
            সর্বমোট ব্যাংক ব্যালেন্স
          </span>
          <h3 className="text-3xl font-black text-emerald-300 mt-1">
            {formatTk(totalBankBalance)}
          </h3>
          <span className="text-[10px] text-indigo-300 block mt-0.5">
            {accounts.length} টি সক্রিয় অ্যাকাউন্ট থেকে
          </span>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAccountModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন ব্যাংক অ্যাকাউন্ট</span>
          </button>

          <button
            onClick={() => setShowDepositModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>ব্যাংক জমা (Deposit)</span>
          </button>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>ব্যাংক উত্তোলন (Withdraw)</span>
          </button>

          <button
            onClick={() => setShowTransferModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>ইন্টার-ব্যাংক ট্রান্সফার</span>
          </button>
        </div>
      </div>

      {/* Accounts Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className={`p-5 rounded-2xl border transition-all duration-200 hover:shadow-md space-y-3 ${
              selectedBankId === acc.id
                ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  {acc.accountType === 'mobile_mfs' ? 'মোবাইল ওয়ালেট' : acc.accountType === 'savings' ? 'সঞ্চয়ী' : 'চলতি'}
                </span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-2">
                  {acc.bankName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {acc.accountNumber}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Landmark className="w-5 h-5" />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">বর্তমান ব্যালেন্স</span>
              <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                {formatTk(acc.currentBalance)}
              </h3>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>{acc.branchName || 'প্রধান শাখা'}</span>
              <button
                onClick={() => setSelectedBankId(acc.id === selectedBankId ? 'all' : acc.id)}
                className="font-bold text-indigo-600 hover:underline"
              >
                {selectedBankId === acc.id ? 'সব অ্যাকাউন্ট দেখুন' : 'স্টেটমেন্ট দেখুন &rarr;'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bank Statement Journal Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              ব্যাংক স্টেটমেন্ট ও ট্রানজাকশন জাবেদা
            </h3>
            <p className="text-xs text-slate-500">
              {selectedBankId === 'all' ? 'সকল ব্যাংক অ্যাকাউন্টের সম্মিলিত স্টেটমেন্ট' : `অ্যাকোউন্ট ফিল্টার: ${accounts.find(a => a.id === selectedBankId)?.bankName}`}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ব্যাংক বা বিবরণ দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">তারিখ ও সময়</th>
                <th className="p-3.5">ব্যাংক অ্যাকাউন্ট</th>
                <th className="p-3.5">লেনদেনের প্রকার</th>
                <th className="p-3.5">রেফারেন্স ও বিবরণ</th>
                <th className="p-3.5 text-right">পরিমাণ (TK)</th>
                <th className="p-3.5 text-right">চলমান ব্যালেন্স (TK)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    কোনো ব্যাংক লেনদেন পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                      {tx.date} ({tx.time})
                    </td>
                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-100">
                      {tx.bankAccountName}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        tx.txType === 'deposit' || tx.txType === 'transfer_in'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {tx.txType === 'deposit' ? 'জমা (Deposit)' : tx.txType === 'withdraw' ? 'উত্তোলন (Withdraw)' : tx.txType === 'transfer_in' ? 'ট্রান্সফার ইন (+)' : 'ট্রান্সফার আউট (-)'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                        {tx.referenceNo || 'অনলাইন/ম্যানুয়াল'}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {tx.note}
                      </span>
                    </td>
                    <td className={`p-3.5 text-right font-bold text-sm ${
                      tx.txType === 'deposit' || tx.txType === 'transfer_in' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {tx.txType === 'deposit' || tx.txType === 'transfer_in' ? `+ ${formatTk(tx.amount)}` : `- ${formatTk(tx.amount)}`}
                    </td>
                    <td className="p-3.5 text-right font-black text-indigo-600 dark:text-indigo-400">
                      {formatTk(tx.runningBalance)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE BANK ACCOUNT MODAL */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-indigo-600" />
                নতুন ব্যাংক অ্যাকাউন্ট যুক্তকরণ
              </h3>
              <button onClick={() => setShowAccountModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">ব্যাংকের নাম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ডাচ বাংলা ব্যাংক লিমিটেড / বিকাশ মার্চেন্ট"
                  value={accForm.bankName}
                  onChange={e => setAccForm({ ...accForm, bankName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">অ্যাকাউন্টের শিরোনাম (Account Name)</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: বিসমিল্লাহ অটো চার্জিং গ্যারেজ"
                  value={accForm.accountName}
                  onChange={e => setAccForm({ ...accForm, accountName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">অ্যাকাউন্ট নম্বর</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: 110-120-45892"
                  value={accForm.accountNumber}
                  onChange={e => setAccForm({ ...accForm, accountNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">শাখা (Branch)</label>
                  <input
                    type="text"
                    placeholder="যেমন: মিরপুর ১০ শাখা"
                    value={accForm.branchName}
                    onChange={e => setAccForm({ ...accForm, branchName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">অ্যাকাউন্টের ধরণ</label>
                  <select
                    value={accForm.accountType}
                    onChange={e => setAccForm({ ...accForm, accountType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="current">চলতি হিসাব (Current)</option>
                    <option value="savings">সঞ্চয়ী হিসাব (Savings)</option>
                    <option value="mobile_mfs">মোবাইল ব্যাংকিং MFS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">প্রারম্ভিক ব্যালেন্স (Opening Balance TK)</label>
                <input
                  type="number"
                  placeholder="যেমন: ৫০০০০"
                  value={accForm.openingBalance}
                  onChange={e => setAccForm({ ...accForm, openingBalance: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  {isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'অ্যাকাউন্ট যুক্ত করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEPOSIT MODAL */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="text-sm font-bold text-emerald-600 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" />
                ব্যাংকে নগদ টাকা জমা (Cash Deposit)
              </h3>
              <button onClick={() => setShowDepositModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDeposit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">ব্যাংক অ্যাকাউন্ট নির্বাচন</label>
                <select
                  value={targetBankId}
                  onChange={e => setTargetBankId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 font-semibold"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.bankName} - {a.accountNumber}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">জমার পরিমাণ (TK)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="যেমন: ১০০০০"
                  value={actionAmount}
                  onChange={e => setActionAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 font-bold text-emerald-600 text-base"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">ডিপোজিট স্লিপ / রেফারেন্স</label>
                <input
                  type="text"
                  placeholder="যেমন: SLIP-9981"
                  value={actionRef}
                  onChange={e => setActionRef(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">নোট</label>
                <input
                  type="text"
                  placeholder="নগদ ক্যাশ থেকে ব্যাংক ডিপোজিট..."
                  value={actionNote}
                  onChange={e => setActionNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setShowDepositModal(false)} className="px-3 py-1.5 rounded-lg bg-slate-100">বাতিল</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold">জমা সম্পন্ন করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="text-sm font-bold text-rose-600 flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4" />
                ব্যাংক থেকে ক্যাশ উত্তোলন (Cash Withdraw)
              </h3>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">ব্যাংক অ্যাকাউন্ট নির্বাচন</label>
                <select
                  value={targetBankId}
                  onChange={e => setTargetBankId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 font-semibold"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.bankName} - {a.accountNumber} (ব্যালেন্স: {formatTk(a.currentBalance)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">উত্তোলনের পরিমাণ (TK)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="যেমন: ৫০০০"
                  value={actionAmount}
                  onChange={e => setActionAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 font-bold text-rose-600 text-base"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">চেক নং / রেফ</label>
                <input
                  type="text"
                  placeholder="যেমন: CHEQUE-00912"
                  value={actionRef}
                  onChange={e => setActionRef(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">নোট</label>
                <input
                  type="text"
                  placeholder="দৈনিক পরিচালন ব্যয়ের জন্য ক্যাশ উত্তোলন..."
                  value={actionNote}
                  onChange={e => setActionNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setShowWithdrawModal(false)} className="px-3 py-1.5 rounded-lg bg-slate-100">বাতিল</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold">উত্তোলন নিশ্চিত করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTER-BANK TRANSFER MODAL */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="text-sm font-bold text-purple-600 flex items-center gap-2">
                <RefreshCcw className="w-4 h-4" />
                ইন্টার-ব্যাংক ফান্ড ট্রান্সফার
              </h3>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTransfer} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">উৎস ব্যাংক (যেখান থেকে টাকা কাটবে)</label>
                <select
                  value={sourceBankId}
                  onChange={e => setSourceBankId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 font-semibold"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.bankName} ({formatTk(a.currentBalance)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">গন্তব্য ব্যাংক (যেখানে টাকা জমা হবে)</label>
                <select
                  value={destBankId}
                  onChange={e => setDestBankId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 font-semibold"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.bankName} ({formatTk(a.currentBalance)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">ট্রান্সফারের পরিমাণ (TK)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="যেমন: ২০০০০"
                  value={actionAmount}
                  onChange={e => setActionAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 font-bold text-purple-600 text-base"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">অনলাইন ট্রানজাকশন আইডি / রেফারেন্স</label>
                <input
                  type="text"
                  placeholder="যেমন: FT-984210"
                  value={actionRef}
                  onChange={e => setActionRef(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">নোট</label>
                <input
                  type="text"
                  placeholder="ফান্ড অ্যাডজাস্টমেন্ট ফান্ড ট্রান্সফার..."
                  value={actionNote}
                  onChange={e => setActionNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setShowTransferModal(false)} className="px-3 py-1.5 rounded-lg bg-slate-100">বাতিল</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-1.5 rounded-lg bg-purple-600 text-white font-bold">ট্রান্সফার সম্পন্ন করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
