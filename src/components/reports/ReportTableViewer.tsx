import React, { useState } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  FileCode2, 
  Printer, 
  FileText, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { ReportType, ReportFilterState } from '../../types/reports';
import { ExportUtils, ExportDataConfig } from '../../utils/exportUtils';

interface ReportTableViewerProps {
  reportType: ReportType;
  filter: ReportFilterState;
  records: any[];
  loading?: boolean;
  tenantName?: string;
  actorName?: string;
}

export const ReportTableViewer: React.FC<ReportTableViewerProps> = ({
  reportType,
  filter,
  records,
  loading = false,
  tenantName = 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
  actorName = 'এডমিন'
}) => {
  const [sortField, setSortField] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Dynamic Column Definitions based on Report Type
  const getColumnsConfig = () => {
    switch (reportType) {
      case 'daily_collection':
      case 'monthly_collection':
      case 'yearly_collection':
      case 'payment_method':
        return {
          headers: ['রসিদ নং', 'তারিখ', 'মেম্বার / ড্রাইভার', 'গাড়ি নং', 'খাত / ক্যাটাগরি', 'পেমেন্ট মেথড', 'পরিমাণ (৳)', 'স্ট্যাটাস'],
          keys: ['receiptNo', 'date', 'memberName', 'vehicleNo', 'category', 'paymentMethod', 'amount', 'status']
        };

      case 'income':
        return {
          headers: ['ভাউচার নং', 'তারিখ', 'আয়ের খাত', 'উৎস / খাত', 'পেমেন্ট মেথড', 'গ্রহীতা (ক্যাশিয়ার)', 'পরিমাণ (৳)'],
          keys: ['voucherNo', 'date', 'category', 'source', 'paymentMethod', 'receivedBy', 'amount']
        };

      case 'expense':
        return {
          headers: ['ভাউচার নং', 'তারিখ', 'ব্যয়ের খাত', 'সরবরাহকারী / ভেন্ডর', 'অনুমোদনকারী', 'পেমেন্ট মেথড', 'পরিমাণ (৳)'],
          keys: ['voucherNo', 'date', 'category', 'vendor', 'approvedBy', 'paymentMethod', 'amount']
        };

      case 'cashbook':
      case 'ledger':
        return {
          headers: ['রেফারেন্স নং', 'তারিখ', 'বিবরণ (Particulars)', 'ডেবিট / আয় (৳)', 'ক্রেডিট / ব্যয় (৳)', 'ব্যালেন্স (৳)'],
          keys: ['refNumber', 'date', 'description', 'debit', 'credit', 'balance']
        };

      case 'bank':
        return {
          headers: ['ট্রান্সেকশন আইডি', 'তারিখ', 'ব্যাংক অ্যাকাউন্ট', 'বিবরণ', 'প্রকার', 'পরিমাণ (৳)'],
          keys: ['id', 'date', 'bankAccount', 'description', 'type', 'amount']
        };

      case 'due':
        return {
          headers: ['মেম্বার নাম', 'গাড়ি নং', 'মোবাইল নম্বর', 'সর্বশেষ বাকীর তারিখ', 'দায়িত্বপ্রাপ্ত স্টাফ', 'স্ট্যাটাস', 'মোট বকেয়া (৳)'],
          keys: ['memberName', 'vehicleNo', 'phone', 'lastDueDate', 'collectorAssigned', 'status', 'totalDue']
        };

      case 'advance':
        return {
          headers: ['মেম্বার নাম', 'গাড়ি নং', 'মোবাইল নম্বর', 'জমার তারিখ', 'স্ট্যাটাস', 'অগ্রিম ব্যালেন্স (৳)'],
          keys: ['memberName', 'vehicleNo', 'phone', 'dateDeposited', 'status', 'advanceBalance']
        };

      case 'sms_log':
        return {
          headers: ['প্রাপক নাম', 'মোবাইল নম্বর', 'মেসেজ বিবরণ', 'প্রেরণের সময়', 'গেটওয়ে স্ট্যাটাস'],
          keys: ['recipientName', 'recipientPhone', 'message', 'sentTime', 'gatewayStatus']
        };

      case 'audit_log':
        return {
          headers: ['ইউজার / অ্যাক্টর', 'অ্যাকশন টাইপ', 'মডিউল', 'বিস্তারিত তথ্য', 'টাইমস্ট্যাম্প'],
          keys: ['actorName', 'action', 'module', 'details', 'timestamp']
        };

      default:
        return {
          headers: ['আইডি / আইডি', 'তারিখ', 'বিবরণ', 'ক্যাটাগরি', 'পেমেন্ট মেথড', 'পরিমাণ (৳)', 'স্ট্যাটাস'],
          keys: ['id', 'date', 'description', 'category', 'paymentMethod', 'amount', 'status']
        };
    }
  };

  const { headers, keys } = getColumnsConfig();

  // Sorting
  const sortedRecords = [...records].sort((a, b) => {
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }
    return sortOrder === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const handleSort = (key: string) => {
    if (sortField === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(key);
      setSortOrder('desc');
    }
  };

  // Totals calculation
  const totalAmount = records.reduce((sum, item) => {
    const val = item.amount || item.totalAmount || item.totalDue || item.advanceBalance || 0;
    return sum + Number(val);
  }, 0);

  const getReportTitle = () => {
    const titles: Record<ReportType, string> = {
      daily_collection: 'দৈনিক কালেকশন বিস্তারিত রিপোর্ট',
      monthly_collection: 'মাসিক কালেকশন সামারি রিপোর্ট',
      yearly_collection: 'বার্ষিক কালেকশন রিপোর্ট',
      income: 'আর্থিক আয় (Revenue) রিপোর্ট',
      expense: 'পরিচালন ব্যয় (Expense) রিপোর্ট',
      cashbook: 'ক্যাশ বুক খতিয়ান (Cash Book Report)',
      bank: 'ব্যাংক ট্রান্সেকশন ও স্টেটমেন্ট',
      ledger: 'জেনারেল লেজার (General Ledger)',
      due: 'সদস্য বকেয়া জমা (Due Balance Report)',
      advance: 'সদস্য অগ্রিম জমা (Advance Deposit Report)',
      member: 'মেম্বার ও যানবাহন প্রোফাইল রিপোর্ট',
      employee: 'এমপ্লয়ি ও ক্যাশিয়ার কালেকশন রিপোর্ট',
      organization: 'অর্গানাইজেশন এন্টারপ্রাইজ সামারি',
      subscription: 'সাবস্ক্রিপশন ও প্যাকেজ প্ল্যান রিপোর্ট',
      payment_method: 'পেমেন্ট মেথড অনুযায়ী আদায় রিপোর্ট',
      sms_log: 'SMS নোটিফিকেশন ডেলিভারি লগ',
      audit_log: 'সিকিউরিটি অ্যান্ড অডিট ট্রেইল লগ'
    };
    return titles[reportType] || 'এন্টারপ্রাইজ রিপোর্ট';
  };

  const getExportConfig = (): ExportDataConfig => {
    return {
      title: getReportTitle(),
      subtitle: `সময়সীমা: ${filter.fromDate || 'চলতি মাস'} হতে ${filter.toDate || 'আজ'}`,
      tenantName,
      generatedBy: actorName,
      headers,
      keys,
      data: records,
      totals: { [keys[keys.length - 2]]: 'সর্বমোট:', [keys[keys.length - 1]]: `৳ ${totalAmount.toLocaleString('bn-BD')}` }
    };
  };

  const handleExportCSV = () => {
    ExportUtils.exportToCSV(getExportConfig());
  };

  const handleExportPDF = () => {
    ExportUtils.exportToPDF(getExportConfig());
  };

  const handlePrint = () => {
    ExportUtils.printReport(getExportConfig());
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
      
      {/* Table Header & Export Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            {getReportTitle()}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            মোট প্রাপ্ত রেকর্ড: <span className="font-semibold text-slate-800 dark:text-slate-200">{records.length} টি</span> | 
            সর্বমোট পরিমাণ: <span className="font-bold text-emerald-600 dark:text-emerald-400">৳ {totalAmount.toLocaleString('bn-BD')}</span>
          </p>
        </div>

        {/* Export Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> PDF ডাউনলোড
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Excel / CSV
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> প্রিন্ট (Print)
          </button>

        </div>
      </div>

      {/* Main Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              <th className="p-3 w-12 text-center">#</th>
              {headers.map((h, i) => (
                <th 
                  key={i} 
                  onClick={() => handleSort(keys[i])}
                  className="p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>{h}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {loading ? (
              <tr>
                <td colSpan={headers.length + 1} className="py-8 text-center text-slate-500">
                  <Clock className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                  রিপোর্ট রিয়েল-টাইম ফায়ারবেস থেকে লোড হচ্ছে...
                </td>
              </tr>
            ) : sortedRecords.length === 0 ? (
              <tr>
                <td colSpan={headers.length + 1} className="py-8 text-center text-slate-500">
                  নির্বাচিত তারিখ বা ফিল্টারে কোনো রেকর্ড পাওয়া যায়নি।
                </td>
              </tr>
            ) : (
              sortedRecords.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 text-center text-slate-400 font-mono text-[11px]">
                    {index + 1}
                  </td>
                  {keys.map((k, colIdx) => {
                    const rawValue = row[k];
                    
                    // Format Payment Method Badge
                    if (k === 'paymentMethod' || k === 'method') {
                      return (
                        <td key={colIdx} className="p-3">
                          <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md text-[10px] uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {rawValue || 'Cash'}
                          </span>
                        </td>
                      );
                    }

                    // Format Status Badge
                    if (k === 'status' || k === 'gatewayStatus') {
                      const isPaid = rawValue === 'paid' || rawValue === 'DELIVERED' || rawValue === 'approved' || rawValue === 'active';
                      return (
                        <td key={colIdx} className="p-3">
                          <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                            isPaid 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}>
                            {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            {rawValue}
                          </span>
                        </td>
                      );
                    }

                    // Format Currency Amounts
                    if (k === 'amount' || k === 'debit' || k === 'credit' || k === 'balance' || k === 'totalDue' || k === 'advanceBalance') {
                      return (
                        <td key={colIdx} className="p-3 font-bold text-slate-900 dark:text-slate-100">
                          ৳ {Number(rawValue || 0).toLocaleString('bn-BD')}
                        </td>
                      );
                    }

                    return (
                      <td key={colIdx} className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                        {rawValue !== undefined && rawValue !== null ? String(rawValue) : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
          
          {/* Summary Footer Row */}
          {!loading && sortedRecords.length > 0 && (
            <tfoot>
              <tr className="bg-slate-100/80 dark:bg-slate-800 font-bold text-slate-900 dark:text-slate-100 text-xs border-t-2 border-slate-200 dark:border-slate-700">
                <td className="p-3 text-center">∑</td>
                <td colSpan={headers.length - 1} className="p-3 text-right">
                  সর্বমোট সমন্বিত পরিমাণ (Total Combined):
                </td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 text-sm">
                  ৳ {totalAmount.toLocaleString('bn-BD')}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

    </div>
  );
};
