import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Paperclip, 
  Eye, 
  CheckCircle2, 
  Tag, 
  X, 
  Calendar, 
  User, 
  DollarSign, 
  Building2, 
  CreditCard 
} from 'lucide-react';
import { IncomeRecord, IncomeCategory, BankAccount } from '../../types/finance';

interface Props {
  incomes: IncomeRecord[];
  categories: IncomeCategory[];
  bankAccounts: BankAccount[];
  onSaveIncome: (record: any) => Promise<void>;
  onSoftDeleteIncome: (id: string, reason: string) => Promise<void>;
  onSaveCategory: (categoryName: string) => Promise<void>;
  isFormOpen: boolean;
  onCloseForm: () => void;
  onOpenForm: () => void;
  actorName: string;
}

export const IncomeManagement: React.FC<Props> = ({
  incomes,
  categories,
  bankAccounts,
  onSaveIncome,
  onSoftDeleteIncome,
  onSaveCategory,
  isFormOpen,
  onCloseForm,
  onOpenForm,
  actorName
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'records' | 'categories'>('records');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    voucherNo: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    categoryId: categories[0]?.id || '',
    categoryName: categories[0]?.name || 'চার্জিং ফি (Charging Fee)',
    sourceType: 'member' as 'member' | 'customer' | 'other',
    sourceName: '',
    sourceId: '',
    amount: '',
    paymentMethod: 'cash' as 'cash' | 'bank' | 'mobile_banking',
    bankAccountId: bankAccounts[0]?.id || '',
    referenceNo: '',
    note: '',
    attachmentUrl: ''
  });

  // Modal States
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [previewAttachment, setPreviewAttachment] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState('');

  const formatTk = (amount: number) => `৳ ${amount.toLocaleString('bn-BD')}`;

  const filteredIncomes = incomes.filter(inc => {
    const matchesSearch = 
      inc.sourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inc.note && inc.note.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCat = selectedCategory === 'all' || inc.categoryId === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSubmitIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sourceName || !formData.amount || Number(formData.amount) <= 0) {
      alert('অনুগ্রহ করে সঠিক তথ্য এবং পরিমাণ প্রদান করুন!');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCatObj = categories.find(c => c.id === formData.categoryId);
      const selectedBankObj = bankAccounts.find(b => b.id === formData.bankAccountId);

      await onSaveIncome({
        ...formData,
        amount: Number(formData.amount),
        categoryName: selectedCatObj ? selectedCatObj.name : formData.categoryName,
        bankAccountName: selectedBankObj ? `${selectedBankObj.bankName} (${selectedBankObj.accountNumber})` : undefined,
        createdBy: actorName
      });

      setFormData({
        voucherNo: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        categoryId: categories[0]?.id || '',
        categoryName: categories[0]?.name || '',
        sourceType: 'member',
        sourceName: '',
        sourceId: '',
        amount: '',
        paymentMethod: 'cash',
        bankAccountId: bankAccounts[0]?.id || '',
        referenceNo: '',
        note: '',
        attachmentUrl: ''
      });
      onCloseForm();
    } catch (e) {
      console.error(e);
      alert('আয় এন্ট্রি সংরক্ষণ করতে সমস্যা হয়েছে!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await onSaveCategory(newCatName.trim());
      setNewCatName('');
      setShowCategoryModal(false);
    } catch (e) {
      alert('ক্যাটাগরি যুক্ত করা সম্ভব হয়নি');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalId) return;
    try {
      await onSoftDeleteIncome(deleteModalId, deleteReason);
      setDeleteModalId(null);
      setDeleteReason('');
    } catch (e) {
      alert('ডিলেট করতে সমস্যা হয়েছে');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub Tabs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('records')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'records'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            আয় রেকর্ড তালিকা ({incomes.length})
          </button>
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'categories'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            আয় ক্যাটাগরি সেটআপ ({categories.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5"
          >
            <Tag className="w-4 h-4" />
            <span>নতুন ক্যাটাগরি</span>
          </button>

          <button
            onClick={onOpenForm}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন আয় এন্ট্রি</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'categories' ? (
        /* CATEGORIES MANAGEMENT TAB */
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                আয় ক্যাটাগরি তালিকা (Income Categories)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                আপনার অর্গানাইজেশনের আয় শ্রেণীবিন্যাস ব্যবস্থাপনা করুন
              </p>
            </div>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              ক্যাটাগরি যোগ করুন
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {cat.code || 'INC'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-2">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {cat.description || 'আয়ের সাধারণ খাত'}
                  </p>
                </div>
                {cat.isDefault && (
                  <span className="text-[10px] font-semibold text-slate-400">
                    ডিফল্ট
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* INCOME RECORDS TABLE TAB */
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ভাউচার, মেম্বার বা বিবরণ দিয়ে খুঁজুন..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
              >
                <option value="all">সকল ক্যাটাগরি</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                মোট আয়: <strong className="text-emerald-600 dark:text-emerald-400">{formatTk(filteredIncomes.reduce((s, i) => s + i.amount, 0))}</strong>
              </span>
            </div>
          </div>

          {/* Income Records List */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">ভাউচার নং ও তারিখ</th>
                    <th className="p-3.5">আয়ের উৎস (পায়ের)</th>
                    <th className="p-3.5">ক্যাটাগরি</th>
                    <th className="p-3.5">পেমেন্ট মেথড</th>
                    <th className="p-3.5 text-right">পরিমাণ (TK)</th>
                    <th className="p-3.5 text-center">সংযুক্তি</th>
                    <th className="p-3.5 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredIncomes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        কোনো আয় পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredIncomes.map((inc) => (
                      <tr key={inc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block">
                            {inc.voucherNo}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {inc.date} ({inc.time || '12:00'})
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-100 block">
                            {inc.sourceName}
                          </span>
                          <span className="text-[11px] text-slate-400 capitalize">
                            প্রকার: {inc.sourceType === 'member' ? 'মেম্বার/চালক' : inc.sourceType === 'customer' ? 'কাস্টমার' : 'অন্যান্য'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[11px]">
                            {inc.categoryName}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {inc.paymentMethod === 'cash' ? '💵 নগদ ক্যাশ' : inc.paymentMethod === 'bank' ? '🏦 ব্যাংক অ্যাকাউন্ট' : '📱 মোবাইল ব্যাংকিং'}
                          </span>
                          {inc.bankAccountName && (
                            <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                              {inc.bankAccountName}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                            {formatTk(inc.amount)}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          {inc.attachmentUrl ? (
                            <button
                              onClick={() => setPreviewAttachment(inc.attachmentUrl || null)}
                              className="p-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors inline-flex items-center gap-1 text-[11px]"
                            >
                              <Paperclip className="w-3.5 h-3.5" />
                              <span>ফাইল</span>
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => setDeleteModalId(inc.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="সফট ডিলেট করুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* CREATE INCOME MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                নতুন আয় এন্ট্রি ফর্ম (Income Entry)
              </h3>
              <button onClick={onCloseForm} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitIncome} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">তারিখ</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">সময়</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">আয় ক্যাটাগরি</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={e => {
                    const catObj = categories.find(c => c.id === e.target.value);
                    setFormData({ 
                      ...formData, 
                      categoryId: e.target.value,
                      categoryName: catObj ? catObj.name : ''
                    });
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">উৎস প্রকার</label>
                  <select
                    value={formData.sourceType}
                    onChange={e => setFormData({ ...formData, sourceType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="member">চালকের নাম / মেম্বার</option>
                    <option value="customer">কাস্টমার / গ্রাহক</option>
                    <option value="other">অন্যান্য উৎসের নাম</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">উৎস / ব্যক্তির নাম</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোঃ জসিম উদ্দিন (মেম্বার#১২)"
                    value={formData.sourceName}
                    onChange={e => setFormData({ ...formData, sourceName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">টাকার পরিমাণ (TK)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="যেমন: ১৫০০"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-emerald-600 text-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">পেমেন্ট মেথড</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="cash">নগদ ক্যাশ (Cash Register)</option>
                    <option value="bank">ব্যাংক ড্রাফট / অনলাইন ডিপোজিট</option>
                    <option value="mobile_banking">মোবাইল ব্যাংকিং (bKash/Nagad)</option>
                  </select>
                </div>
              </div>

              {formData.paymentMethod !== 'cash' && (
                <div>
                  <label className="font-semibold block mb-1">জমার ব্যাংক অ্যাকাউন্ট</label>
                  <select
                    value={formData.bankAccountId}
                    onChange={e => setFormData({ ...formData, bankAccountId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    {bankAccounts.map(b => (
                      <option key={b.id} value={b.id}>{b.bankName} - {b.accountNumber} ({b.accountName})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="font-semibold block mb-1">রেফারেন্স / স্লিপ নং</label>
                <input
                  type="text"
                  placeholder="যেমন: TRX-88492042"
                  value={formData.referenceNo}
                  onChange={e => setFormData({ ...formData, referenceNo: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">নোট / বিবরণ</label>
                <textarea
                  rows={2}
                  placeholder="আয় সংক্রান্ত বিষদ বিবরণ বা মন্তব্য..."
                  value={formData.note}
                  onChange={e => setFormData({ ...formData, note: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">সংযুক্তি ফাইল URL (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="https://example.com/receipt-scan.pdf"
                  value={formData.attachmentUrl}
                  onChange={e => setFormData({ ...formData, attachmentUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onCloseForm}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'আয় সংরক্ষণ করুন'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* QUICK ADD CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                নতুন আয় ক্যাটাগরি তৈরি করুন
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">ক্যাটাগরির নাম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: স্ক্র্যাপ বিক্রি থেকে আয়"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
                >
                  সংরক্ষণ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SOFT DELETE CONFIRMATION MODAL */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-rose-600">
              আয় রেকর্ড সফট ডিলেট নিশ্চিতকরণ
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              এই রেকর্ডটি মুছে ফেললে ক্যাশবুক ও আর্থিক প্রতিবেদনে ক্যাশ ব্যালেন্স সামঞ্জস্য করা হবে।
            </p>

            <textarea
              rows={2}
              placeholder="মুছে ফেলার কারণ লিখুন (ভুল এন্ট্রি, ডুপ্লিকেট, ইত্যাদি)..."
              value={deleteReason}
              onChange={e => setDeleteReason(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold"
              >
                বাতিল
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold"
              >
                ডিলেট নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW ATTACHMENT MODAL */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-5 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b">
              <h4 className="text-xs font-bold">সংযুক্তি ফাইল প্রিভিউ</h4>
              <button onClick={() => setPreviewAttachment(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-center space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                ফাইল লিংক: <a href={previewAttachment} target="_blank" rel="noreferrer" className="text-indigo-600 underline font-mono">{previewAttachment}</a>
              </p>
              <img src={previewAttachment} alt="Attachment" className="max-h-80 mx-auto rounded-lg object-contain shadow-sm" onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
