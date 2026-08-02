import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Printer, 
  FileText, 
  Settings, 
  History, 
  Search, 
  Plus, 
  Calendar, 
  Filter, 
  Share2, 
  RotateCcw, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Download,
  Building2,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { 
  ReceiptRecord, 
  ReceiptTemplateConfig, 
  InvoiceRecord, 
  PrintLogRecord,
  ReceiptFilterOptions
} from '../../types/receipt';
import { ReceiptService, DEFAULT_TEMPLATE_CONFIG } from '../../services/receiptService';
import { PrintPreviewModal } from './PrintPreviewModal';
import { InvoiceGeneratorModal } from './InvoiceGeneratorModal';
import { TemplateSettingsModal } from './TemplateSettingsModal';

export const ReceiptInvoiceSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'receipts' | 'invoices' | 'settings' | 'logs'>('receipts');
  
  const [receipts, setReceipts] = useState<ReceiptRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [template, setTemplate] = useState<ReceiptTemplateConfig>(DEFAULT_TEMPLATE_CONFIG);
  const [printLogs, setPrintLogs] = useState<PrintLogRecord[]>([]);

  // Selected item for preview modal
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptRecord | undefined>(undefined);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | undefined>(undefined);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Modals
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState<ReceiptFilterOptions>({
    searchTerm: '',
    startDate: '',
    endDate: '',
    collectorName: 'all',
    paymentMethod: 'all',
    paperSizeFilter: 'all'
  });

  // REALTIME SUBSCRIPTIONS
  useEffect(() => {
    const unsubReceipts = ReceiptService.subscribeReceipts('org_bismillah_001', setReceipts);
    const unsubTemplate = ReceiptService.subscribeTemplateConfig('org_bismillah_001', setTemplate);
    const unsubInvoices = ReceiptService.subscribeInvoices('org_bismillah_001', setInvoices);
    const unsubLogs = ReceiptService.subscribePrintLogs('org_bismillah_001', setPrintLogs);

    return () => {
      unsubReceipts();
      unsubTemplate();
      unsubInvoices();
      unsubLogs();
    };
  }, []);

  // FILTER LOGIC FOR RECEIPTS
  const filteredReceipts = receipts.filter(r => {
    const term = filters.searchTerm.toLowerCase().trim();
    const matchesSearch = !term || 
      r.receiptNo.toLowerCase().includes(term) ||
      r.memberName.toLowerCase().includes(term) ||
      r.memberId.toLowerCase().includes(term) ||
      r.memberPhone.includes(term) ||
      r.vehicleNo.toLowerCase().includes(term) ||
      r.collectorName.toLowerCase().includes(term);

    const matchesPayment = filters.paymentMethod === 'all' || r.paymentMethod === filters.paymentMethod;
    const matchesDate = (!filters.startDate || r.date >= filters.startDate) &&
                        (!filters.endDate || r.date <= filters.endDate);

    return matchesSearch && matchesPayment && matchesDate;
  });

  // STATS
  const totalAmountCollected = receipts.reduce((sum, r) => sum + r.amount, 0);
  const totalReprintCount = receipts.reduce((sum, r) => sum + (r.reprintCount || 0), 0);

  const handleOpenReceiptPreview = (r: ReceiptRecord) => {
    setSelectedReceipt(r);
    setSelectedInvoice(undefined);
    setIsPreviewOpen(true);
  };

  const handleOpenInvoicePreview = (inv: InvoiceRecord) => {
    setSelectedInvoice(inv);
    setSelectedReceipt(undefined);
    setIsPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* SYSTEM HEADER */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Printer className="w-4 h-4" />
              <span>রসিদ, ইনভয়েস & থার্মাল প্রিন্টিং সিস্টেম</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Receipt, Invoice & Thermal Printing Engine
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              {template.orgName} — স্বয়ংক্রিয় রসিদ জেনারেটর, 58mm/80mm থার্মাল ও A4 প্রিভিউ ও হোয়াটসঅ্যাপ শেয়ারিং
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsInvoiceModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              নতুন ইনভয়েস তৈরি
            </button>

            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3.5 py-2.5 rounded-xl text-sm flex items-center gap-2 border border-slate-700 transition"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              প্রিন্ট টেমপ্লেট
            </button>
          </div>
        </div>

        {/* SUMMARY STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">মোট রসিদ সংখ্যা</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{receipts.length} টি</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1">স্বয়ংক্রিয় জেনারেটেড</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Receipt className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">মোট ক্যাশ জমার পরিমাণ</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">৳ {totalAmountCollected.toLocaleString()}</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">রসিদমূলে সংগৃহীত</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">ইনভয়েস স্টেটমেন্ট</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{invoices.length} টি</h3>
              <p className="text-xs text-purple-600 font-semibold mt-1">মাসিক ও বকেয়া বিল</p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">প্রিন্ট ও রিপ্রিন্ট লোগ</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">{printLogs.length} বার</h3>
              <p className="text-xs text-amber-700 font-medium mt-1">রিপ্রিন্ট: {totalReprintCount} টি</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <History className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-2 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('receipts')}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'receipts'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Receipt className="w-4 h-4 text-emerald-400" />
            রসিদ হিস্ট্রি ({receipts.length})
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'invoices'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-400" />
            ইনভয়েস তালিকা ({invoices.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-4 h-4 text-amber-400" />
            প্রিন্ট টেমপ্লেট
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'logs'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <History className="w-4 h-4 text-blue-400" />
            প্রিন্ট অডিট লগ ({printLogs.length})
          </button>
        </div>

        {/* TAB 1: RECEIPT LIST & SEARCH */}
        {activeTab === 'receipts' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
            {/* SEARCH & FILTERS BAR */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="রসিদ নম্বর, সদস্য নাম, মোবাইল, গাড়ি নম্বর বা ক্যাশিয়ার নাম দিয়ে খুঁজুন..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={filters.paymentMethod}
                  onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                  className="px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">সব পেমেন্ট মেথড</option>
                  <option value="cash">ক্যাশ (Cash)</option>
                  <option value="bkash">বিকাশ (bKash)</option>
                  <option value="nagad">নগদ (Nagad)</option>
                </select>

                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium"
                />
              </div>
            </div>

            {/* RECEIPT TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                    <th className="p-3.5 rounded-l-xl">রসিদ নম্বর</th>
                    <th className="p-3.5">তারিখ & সময়</th>
                    <th className="p-3.5">সদস্য ও গাড়ি নম্বর</th>
                    <th className="p-3.5 text-center">পেমেন্ট মেথড</th>
                    <th className="p-3.5 text-right">আদায় (BDT)</th>
                    <th className="p-3.5 text-center">স্ট্যাটাস</th>
                    <th className="p-3.5 text-right rounded-r-xl">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {filteredReceipts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500 font-medium">
                        কোনো রসিদ রেকর্ড পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredReceipts.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3.5 font-mono font-bold text-slate-900">
                          {r.receiptNo}
                          {r.isReprint && (
                            <span className="ml-2 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-sans font-bold">
                              রিপ্রিন্ট ({r.reprintCount})
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-xs text-gray-600">
                          <p className="font-semibold text-gray-900">{r.date}</p>
                          <p className="text-[11px]">{r.time}</p>
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-slate-900">{r.memberName}</p>
                          <p className="text-xs text-gray-500">{r.vehicleNo} | {r.memberPhone}</p>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="inline-block uppercase font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200">
                            {r.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-bold text-slate-900">
                          ৳ {r.amount.toLocaleString()}
                          {r.due > 0 && (
                            <p className="text-xs text-red-600 font-normal">বকেয়া: ৳{r.due}</p>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle className="w-3.5 h-3.5" /> পরিশোধিত
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenReceiptPreview(r)}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition"
                            >
                              <Printer className="w-3.5 h-3.5 text-emerald-400" />
                              প্রিন্ট & ভিউ
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
        )}

        {/* TAB 2: INVOICES LIST */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">মাসিক ও বকেয়া ইনভয়েস স্টেটমেন্টস</h3>
                <p className="text-xs text-gray-500">মেম্বারদের জন্য প্রস্তুতকৃত অফিশিয়াল ডিমান্ড বিল ও ইনভয়েস তালিকা</p>
              </div>
              <button
                onClick={() => setIsInvoiceModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> নতুন ইনভয়েস
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                    <th className="p-3.5 rounded-l-xl">ইনভয়েস নম্বর</th>
                    <th className="p-3.5">টাইপ & মাস</th>
                    <th className="p-3.5">সদস্য নাম</th>
                    <th className="p-3.5 text-right">মোট বিল</th>
                    <th className="p-3.5 text-right">পরিশোধিত</th>
                    <th className="p-3.5 text-right">বকেয়া</th>
                    <th className="p-3.5 text-right rounded-r-xl">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500 font-medium">
                        কোনো ইনভয়েস স্টেটমেন্ট পাওয়া যায়নি। 'নতুন ইনভয়েস তৈরি' বাটনে ক্লিক করুন।
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3.5 font-mono font-bold text-slate-900">{inv.invoiceNo}</td>
                        <td className="p-3.5 text-xs">
                          <span className="font-bold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px]">
                            {inv.invoiceType}
                          </span>
                          <p className="text-gray-500 font-semibold mt-0.5">{inv.monthYear}</p>
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">{inv.memberName}</td>
                        <td className="p-3.5 text-right font-bold text-slate-900">৳ {inv.totalAmount.toLocaleString()}</td>
                        <td className="p-3.5 text-right font-bold text-emerald-600">৳ {inv.paidAmount.toLocaleString()}</td>
                        <td className="p-3.5 text-right font-bold text-red-600">৳ {inv.dueAmount.toLocaleString()}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleOpenInvoicePreview(inv)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg inline-flex items-center gap-1.5"
                          >
                            <Printer className="w-3.5 h-3.5 text-emerald-400" />
                            A4 ইনভয়েস প্রিন্ট
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TEMPLATE PREVIEW & SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">বর্তমান রসিদ ও ইনভয়েস টেমপ্লেট</h3>
                <p className="text-xs text-gray-500">থার্মাল 58mm/80mm এবং A4 ফরম্যাটের হেডার, লোগো ও টার্মস সেটিংস</p>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2"
              >
                <Settings className="w-4 h-4" /> কাস্টমাইজ করুন
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">প্রতিষ্ঠানের নাম</p>
                    <p className="font-bold text-slate-900 text-base">{template.orgName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <PhoneCall className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">যোগাযোগ ফোন</p>
                    <p className="font-semibold text-slate-800">{template.orgPhone}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">ঠিকানা</p>
                  <p className="text-gray-700">{template.orgAddress}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">হেডার টাইটেল</p>
                  <p className="font-bold text-slate-900">{template.headerText}</p>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">ফুটার বার্তা</p>
                  <p className="font-medium text-emerald-700">{template.footerNote}</p>
                </div>

                <div className="flex gap-4 text-xs font-bold pt-2 border-t border-slate-200">
                  <span>QR কোড: {template.showQrCode ? '✅ দৃশ্যমান' : '❌ বন্ধ'}</span>
                  <span>বারকোড: {template.showBarcode ? '✅ দৃশ্যমান' : '❌ বন্ধ'}</span>
                  <span>ডিজিটাল স্বাক্ষর: {template.showDigitalSignature ? '✅ দৃশ্যমান' : '❌ বন্ধ'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRINT LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">প্রিন্ট ও রিপ্রিন্ট সিকিউরিটি অডিট লগ</h3>
              <p className="text-xs text-gray-500">কে, কখন, কোন রসিদ প্রিন্ট, রিপ্রিন্ট বা পিডিএফ ডাউনলোড করেছেন তার রেকর্ড</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                    <th className="p-3.5 rounded-l-xl">সময়কাল</th>
                    <th className="p-3.5">ডকুমেন্ট নম্বর</th>
                    <th className="p-3.5">টাইপ</th>
                    <th className="p-3.5">অ্যাকশন</th>
                    <th className="p-3.5">অপারেটর নাম</th>
                    <th className="p-3.5 rounded-r-xl">বিস্তারিত</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {printLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                        কোনো প্রিন্ট বা রিপ্রিন্ট অ্যাক্টিভিটি লগ সংরক্ষিত নেই।
                      </td>
                    </tr>
                  ) : (
                    printLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition text-xs">
                        <td className="p-3.5 font-mono text-gray-600">
                          {new Date(log.timestamp).toLocaleString('bn-BD')}
                        </td>
                        <td className="p-3.5 font-bold font-mono text-slate-900">{log.documentNo}</td>
                        <td className="p-3.5 uppercase font-bold text-slate-700">{log.documentType}</td>
                        <td className="p-3.5 font-bold">
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">{log.printedBy}</td>
                        <td className="p-3.5 text-gray-600">{log.details || 'N/A'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* PRINT PREVIEW MODAL */}
      <PrintPreviewModal
        receipt={selectedReceipt}
        invoice={selectedInvoice}
        template={template}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      {/* INVOICE MODAL */}
      <InvoiceGeneratorModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onInvoiceCreated={(newInv) => {
          setSelectedInvoice(newInv);
          setSelectedReceipt(undefined);
          setIsPreviewOpen(true);
        }}
      />

      {/* SETTINGS MODAL */}
      <TemplateSettingsModal
        config={template}
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSaved={(updated) => setTemplate(updated)}
      />
    </div>
  );
};
