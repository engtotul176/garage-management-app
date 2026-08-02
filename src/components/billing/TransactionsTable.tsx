import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Eye, 
  Filter, 
  CreditCard, 
  Calendar 
} from 'lucide-react';
import { SubscriptionInvoice, PaymentStatus } from '../../types/billing';
import { BillingService } from '../../services/billingService';

interface TransactionsTableProps {
  invoices: SubscriptionInvoice[];
  onSelectInvoice: (invoice: SubscriptionInvoice) => void;
  onRefresh: () => void;
  isSuperAdmin: boolean;
  actorName: string;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  invoices,
  onSelectInvoice,
  onRefresh,
  isSuperAdmin,
  actorName
}) => {
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      inv.tenantName.toLowerCase().includes(search.toLowerCase()) ||
      inv.paidBy.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (invoiceId: string, newStatus: PaymentStatus) => {
    if (window.confirm(`আপনি কি স্ট্যাটাস পরিবর্তন করে '${newStatus}' করতে চান?`)) {
      await BillingService.updatePaymentStatus(invoiceId, newStatus, actorName);
      onRefresh();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-500" />
            পেমেন্ট ট্রানজেকশন & ইনভয়েস হিস্ট্রি
          </h3>
          <p className="text-xs text-slate-500">
            সকল সাবস্ক্রিপশন ফি, রিসিট ও ট্রানজেকশন স্ট্যাটাস ম্যানেজমেন্ট
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">সকল স্ট্যাটাস</option>
            <option value="PAID">PAID (পরিশোধিত)</option>
            <option value="PENDING_VERIFICATION">PENDING (যাচাইাধীন)</option>
            <option value="REJECTED">REJECTED (বাতিল)</option>
            <option value="REFUNDED">REFUNDED (ফেরত)</option>
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ইনভয়েস বা TrxID সার্চ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-indigo-500 w-full sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider">
              <th className="py-3 px-3">ইনভয়েস নম্বর</th>
              <th className="py-3 px-3">প্রতিষ্ঠান</th>
              <th className="py-3 px-3">গেটওয়ে & TrxID</th>
              <th className="py-3 px-3">পরিমাণ (BDT)</th>
              <th className="py-3 px-3">তারিখ</th>
              <th className="py-3 px-3">স্ট্যাটাস</th>
              <th className="py-3 px-3 text-right">ইনভয়েস রিসিট</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">
                  কোনো পেমেন্ট ট্রানজেকশন রেকর্ড পাওয়া যায়নি।
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                  
                  {/* Invoice # */}
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    {inv.invoiceNumber}
                    <div className="text-[10px] text-slate-400 font-normal">{inv.planName}</div>
                  </td>

                  {/* Tenant */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{inv.tenantName}</div>
                    <div className="text-[10px] text-slate-400">পরিশোধক: {inv.paidBy}</div>
                  </td>

                  {/* Gateway & TrxID */}
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mr-1">
                      {inv.gatewayType}
                    </span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{inv.transactionId}</span>
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-3 font-mono font-extrabold text-slate-900 dark:text-white">
                    ৳ {inv.netAmount.toLocaleString('bn-BD')}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-3">
                    <div className="font-semibold">{new Date(inv.paidAt).toLocaleDateString('bn-BD')}</div>
                    <div className="text-[10px] text-slate-400">{new Date(inv.paidAt).toLocaleTimeString('bn-BD')}</div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                      inv.status === 'PAID'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : inv.status === 'PENDING_VERIFICATION'
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    }`}>
                      {inv.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectInvoice(inv)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        ইনভয়েস
                      </button>

                      {isSuperAdmin && inv.status === 'PENDING_VERIFICATION' && (
                        <button
                          onClick={() => handleUpdateStatus(inv.id, 'PAID')}
                          className="p-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-[10px]"
                        >
                          এপ্রুভ
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
