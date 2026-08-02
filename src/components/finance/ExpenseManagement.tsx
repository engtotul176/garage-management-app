import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Paperclip, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Tag, 
  X, 
  DollarSign, 
  ShieldCheck 
} from 'lucide-react';
import { ExpenseRecord, ExpenseCategory, BankAccount } from '../../types/finance';

interface Props {
  expenses: ExpenseRecord[];
  categories: ExpenseCategory[];
  bankAccounts: BankAccount[];
  onSaveExpense: (record: any) => Promise<void>;
  onUpdateStatus: (id: string, status: 'approved' | 'rejected', reason?: string) => Promise<void>;
  onSoftDeleteExpense: (id: string, reason: string) => Promise<void>;
  onSaveCategory: (categoryName: string, budgetLimit?: number) => Promise<void>;
  isFormOpen: boolean;
  onCloseForm: () => void;
  onOpenForm: () => void;
  actorName: string;
  isOrgAdmin: boolean;
}

export const ExpenseManagement: React.FC<Props> = ({
  expenses,
  categories,
  bankAccounts,
  onSaveExpense,
  onUpdateStatus,
  onSoftDeleteExpense,
  onSaveCategory,
  isFormOpen,
  onCloseForm,
  onOpenForm,
  actorName,
  isOrgAdmin
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'records' | 'categories'>('records');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    voucherNo: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    categoryId: categories[0]?.id || '',
    categoryName: categories[0]?.name || 'বিদ্যুৎ বিল (Electricity Bill)',
    payeeName: '',
    amount: '',
    paymentMethod: 'cash' as 'cash' | 'bank',
    bankAccountId: bankAccounts[0]?.id || '',
    note: '',
    attachmentUrl: ''
  });

  // Category Modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatBudget, setNewCatBudget] = useState('');

  // Reject / Delete Modal
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [previewAttachment, setPreviewAttachment] = useState<string | null>(null);

  const formatTk = (amount: number) => `৳ ${amount.toLocaleString('bn-BD')}`;

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = 
      exp.payeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exp.note && exp.note.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCat = selectedCategory === 'all' || exp.categoryId === selectedCategory;
    const matchesStatus = statusFilter === 'all' || exp.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.payeeName || !formData.amount || Number(formData.amount) <= 0) {
      alert('অনুগ্রহ করে সঠিক তথ্য প্রদান করুন!');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCatObj = categories.find(c => c.id === formData.categoryId);
      const selectedBankObj = bankAccounts.find(b => b.id === formData.bankAccountId);

      await onSaveExpense({
        ...formData,
        amount: Number(formData.amount),
        categoryName: selectedCatObj ? selectedCatObj.name : formData.categoryName,
        bankAccountName: selectedBankObj ? `${selectedBankObj.bankName} (${selectedBankObj.accountNumber})` : undefined,
        status: isOrgAdmin ? 'approved' : 'pending', // Org Admin creates as auto-approved, staff creates pending approval
        createdBy: actorName
      });

      setFormData({
        voucherNo: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        categoryId: categories[0]?.id || '',
        categoryName: categories[0]?.name || '',
        payeeName: '',
        amount: '',
        paymentMethod: 'cash',
        bankAccountId: bankAccounts[0]?.id || '',
        note: '',
        attachmentUrl: ''
      });
      onCloseForm();
    } catch (e) {
      console.error(e);
      alert('ব্যয় এন্ট্রি সংরক্ষণ করতে সমস্যা হয়েছে!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await onSaveCategory(newCatName.trim(), Number(newCatBudget) || 0);
      setNewCatName('');
      setNewCatBudget('');
      setShowCategoryModal(false);
    } catch (e) {
      alert('ক্যাটাগরি যুক্ত করতে সমস্যা হয়েছে');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModalId) return;
    try {
      await onUpdateStatus(rejectModalId, 'rejected', rejectReason);
      setRejectModalId(null);
      setRejectReason('');
    } catch (e) {
      alert('স্ট্যাটাস আপডেট ব্যর্থ হয়েছে');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalId) return;
    try {
      await onSoftDeleteExpense(deleteModalId, deleteReason);
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
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            ব্যয় রেকর্ড তালিকা ({expenses.length})
          </button>
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'categories'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            ব্যয় ক্যাটাগরি ও বাজেট ({categories.length})
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
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন ব্যয় এন্ট্রি</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'categories' ? (
        /* CATEGORIES MANAGEMENT TAB */
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                ব্যয় ক্যাটাগরি ও বাজেট লিমিট (Expense Categories)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                পরিচালন ব্যয়ের খাত এবং মাসভিত্তিক সর্বোচ্চ বাজেট নির্ধারণ করুন
              </p>
            </div>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold flex items-center gap-1"
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
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    {cat.code || 'EXP'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-2">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    বাজেট লিমিট: <strong className="text-slate-700 dark:text-slate-200">{cat.budgetLimit ? formatTk(cat.budgetLimit) : 'সীমা নেই'}</strong>
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
        /* EXPENSE RECORDS TABLE TAB */
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ভাউচার, প্রাপক বা বিবরণ দিয়ে খুঁজুন..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
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

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
              >
                <option value="all">সকল স্ট্যাটাস</option>
                <option value="approved">অনুমোদিত (Approved)</option>
                <option value="pending">পেন্ডিং (Pending)</option>
                <option value="rejected">বাতিল (Rejected)</option>
              </select>

              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                মোট ব্যয়: <strong className="text-rose-600 dark:text-rose-400">{formatTk(filteredExpenses.reduce((s, e) => s + e.amount, 0))}</strong>
              </span>
            </div>
          </div>

          {/* Expense Records List */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">ভাউচার নং ও তারিখ</th>
                    <th className="p-3.5">প্রাপক (Payee)</th>
                    <th className="p-3.5">ক্যাটাগরি</th>
                    <th className="p-3.5">পেমেন্ট মেথড</th>
                    <th className="p-3.5 text-center">অনুমোদন স্থিতি</th>
                    <th className="p-3.5 text-right">পরিমাণ (TK)</th>
                    <th className="p-3.5 text-center">সংযুক্তি</th>
                    <th className="p-3.5 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        কোনো ব্যয় এন্ট্রি পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block">
                            {exp.voucherNo}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {exp.date} ({exp.time || '12:00'})
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-100">
                          {exp.payeeName}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-semibold text-[11px]">
                            {exp.categoryName}
                          </span>
                        </td>
                        <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                          {exp.paymentMethod === 'cash' ? '💵 নগদ ক্যাশ' : '🏦 ব্যাংক অ্যাকাউন্ট'}
                          {exp.bankAccountName && (
                            <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                              {exp.bankAccountName}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                            exp.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : exp.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {exp.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                            {exp.status === 'rejected' && <XCircle className="w-3 h-3" />}
                            {exp.status === 'pending' && <Clock className="w-3 h-3 animate-spin" />}
                            <span>
                              {exp.status === 'approved' ? 'অনুমোদিত' : exp.status === 'rejected' ? 'বাতিল' : 'পেন্ডিং'}
                            </span>
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                            {formatTk(exp.amount)}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          {exp.attachmentUrl ? (
                            <button
                              onClick={() => setPreviewAttachment(exp.attachmentUrl || null)}
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
                          <div className="flex items-center justify-center gap-1">
                            {exp.status === 'pending' && isOrgAdmin && (
                              <>
                                <button
                                  onClick={() => onUpdateStatus(exp.id, 'approved')}
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                  title="অনুমোদন করুন"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setRejectModalId(exp.id)}
                                  className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                                  title="বাতিল করুন"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => setDeleteModalId(exp.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="সফট ডিলেট করুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

      {/* CREATE EXPENSE MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-rose-600" />
                নতুন ব্যয় এন্ট্রি ফর্ম (Expense Entry)
              </h3>
              <button onClick={onCloseForm} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitExpense} className="space-y-4 text-xs">
              
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
                <label className="font-semibold block mb-1">ব্যয় ক্যাটাগরি</label>
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

              <div>
                <label className="font-semibold block mb-1">প্রাপক / ভেন্ডর এর নাম (Payee Name)</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ডেসকো ইলেকট্রিসিটি বোর্ড / করিম হার্ডওয়্যার"
                  value={formData.payeeName}
                  onChange={e => setFormData({ ...formData, payeeName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">টাকার পরিমাণ (TK)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="যেমন: ২৫০০"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-rose-600 text-sm"
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
                    <option value="bank">ব্যাংক ড্রাফট / চেক / অনলাইন</option>
                  </select>
                </div>
              </div>

              {formData.paymentMethod === 'bank' && (
                <div>
                  <label className="font-semibold block mb-1">উত্তোলনের ব্যাংক অ্যাকাউন্ট</label>
                  <select
                    value={formData.bankAccountId}
                    onChange={e => setFormData({ ...formData, bankAccountId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    {bankAccounts.map(b => (
                      <option key={b.id} value={b.id}>{b.bankName} - {b.accountNumber} (ব্যালেন্স: {formatTk(b.currentBalance)})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="font-semibold block mb-1">নোট / বিবরণ</label>
                <textarea
                  rows={2}
                  placeholder="ব্যয়ের বিষদ কারণ বা বিল নম্বর..."
                  value={formData.note}
                  onChange={e => setFormData({ ...formData, note: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">বিল/ভাউচার কপি লিঙ্ক (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="https://example.com/vouchers/bill-01.jpg"
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
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-white shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'ব্যয় এন্ট্রি পোস্ট করুন'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* QUICK ADD EXPENSE CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                নতুন ব্যয় ক্যাটাগরি ও বাজেট
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
                  placeholder="যেমন: নাইট গার্ড চা-নাস্তা খরচ"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">মাসিক বাজেট লিমিট (TK)</label>
                <input
                  type="number"
                  placeholder="যেমন: ৫০০০০ (সীমা না থাকলে খালি রাখুন)"
                  value={newCatBudget}
                  onChange={e => setNewCatBudget(e.target.value)}
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
                  className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold"
                >
                  সংরক্ষণ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT EXPENSE MODAL */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 space-y-3">
            <h3 className="text-sm font-bold text-rose-600">ব্যয় এন্ট্রি বাতিলকরণ</h3>
            <p className="text-xs text-slate-500">বাতিলের কারণ উল্লেখ করুন:</p>
            <textarea
              rows={2}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="অনুমোদনের অযোগ্য বা অতিরিক্ত দাবি..."
              className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setRejectModalId(null)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs">বাতিল</button>
              <button onClick={handleConfirmReject} className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs">বাতিল সম্পন্ন করুন</button>
            </div>
          </div>
        </div>
      )}

      {/* SOFT DELETE CONFIRMATION MODAL */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 space-y-3">
            <h3 className="text-sm font-bold text-rose-600">ব্যয় সফট ডিলেট</h3>
            <textarea
              rows={2}
              value={deleteReason}
              onChange={e => setDeleteReason(e.target.value)}
              placeholder="মুছে ফেলার কারণ..."
              className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteModalId(null)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs">বাতিল</button>
              <button onClick={handleConfirmDelete} className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs">ডিলেট নিশ্চিত করুন</button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW ATTACHMENT MODAL */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-5 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b">
              <h4 className="text-xs font-bold">ব্যয় ভাউচার ফাইল প্রিভিউ</h4>
              <button onClick={() => setPreviewAttachment(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-center space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                ফাইল লিঙ্ক: <a href={previewAttachment} target="_blank" rel="noreferrer" className="text-indigo-600 underline font-mono">{previewAttachment}</a>
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
