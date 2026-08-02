import React, { useState } from 'react';
import { 
  Receipt, 
  Download, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Search, 
  DollarSign, 
  Printer 
} from 'lucide-react';
import { CollectionHistoryRecord } from '../../types/customerPortal';
import { CustomerPortalService } from '../../services/customerPortalService';

interface MemberCollectionsListProps {
  memberId: string;
  collections: CollectionHistoryRecord[];
  totalPaid: number;
  totalDue: number;
}

export const MemberCollectionsList: React.FC<MemberCollectionsListProps> = ({
  memberId,
  collections,
  totalPaid,
  totalDue
}) => {
  const [search, setSearch] = useState<string>('');

  const filtered = collections.filter(c => 
    c.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
    c.collectionType.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownloadReceipt = async (item: CollectionHistoryRecord) => {
    await CustomerPortalService.logDownload(memberId, 'COLLECTION_RECEIPT', item.receiptNumber);
    window.print();
  };

  const handleDownloadInvoice = async (item: CollectionHistoryRecord) => {
    await CustomerPortalService.logDownload(memberId, 'OFFICIAL_INVOICE', item.receiptNumber);
    alert(`ইনভয়েস ${item.receiptNumber} ডাউনলোড লগে রিকুয়েস্ট রেকর্ড করা হয়েছে!`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              মোট পরিশোধিত কালেকশন (Total Paid)
            </span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              ৳ {totalPaid.toLocaleString('bn-BD')} BDT
            </div>
          </div>
          <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              বর্তমান বকেয়া (Current Due Amount)
            </span>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
              ৳ {totalDue.toLocaleString('bn-BD')} BDT
            </div>
          </div>
          <div className="p-3 bg-amber-500/20 text-amber-500 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-500" />
            কালেকশন & ডিউ হিস্ট্রি (Download Receipt / Invoice)
          </h3>
          <p className="text-xs text-slate-500">
            আপনার সকল বিল পরিশোধের ইতিহাস এবং ডিজিটাল রিসিট ডাউনলোড
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="রিসিট নম্বর দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase">
              <th className="py-2.5 px-3">রিসিট নম্বর</th>
              <th className="py-2.5 px-3">বিবরণ (Collection Type)</th>
              <th className="py-2.5 px-3">পেমেন্ট মেথড</th>
              <th className="py-2.5 px-3">পরিমাণ (BDT)</th>
              <th className="py-2.5 px-3">তারিখ</th>
              <th className="py-2.5 px-3 text-right">ডাউনলোড রিসিট</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-400">
                  কোনো কালেকশন রিসিট রেকর্ড পাওয়া যায়নি।
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    {item.receiptNumber}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {item.collectionType}
                    <div className="text-[10px] text-slate-400 font-normal">আদায়কারী: {item.collectedBy}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      {item.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    ৳ {item.amount.toLocaleString('bn-BD')}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {new Date(item.paymentDate).toLocaleDateString('bn-BD')}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleDownloadReceipt(item)}
                        className="px-2.5 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow transition-all"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        রিসিট
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(item)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        ইনভয়েস
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
  );
};
