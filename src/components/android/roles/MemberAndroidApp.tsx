import React, { useState } from 'react';
import { QrCode, CreditCard, FileText, Download, Bell, DollarSign, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AndroidSession } from '../../../types/androidApp';

interface MemberAndroidAppProps {
  session: AndroidSession;
  isDarkMode: boolean;
}

export const MemberAndroidApp: React.FC<MemberAndroidAppProps> = ({ session, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'CARD' | 'HISTORY' | 'DUE' | 'RECEIPT'>('CARD');
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  return (
    <div className="space-y-3">
      
      {/* Header Member Profile */}
      <div className="p-3 bg-gradient-to-r from-sky-900 to-indigo-950 text-white rounded-2xl border border-sky-800 space-y-1 shadow-md">
        <div className="flex items-center justify-between text-[10px] text-sky-300 font-mono">
          <span>MEMBER DIGITAL PASS</span>
          <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-bold">VERIFIED</span>
        </div>
        <h4 className="font-extrabold text-xs text-white">{session.userName}</h4>
        <p className="text-[10px] text-slate-300">গাড়ি: ঢাকা মেট্রো-থ-১১-৮৮৯২ • ID: MEM-88201</p>
      </div>

      {/* Nav Pills */}
      <div className="grid grid-cols-4 gap-1.5 text-center font-bold text-[10px]">
        <button
          onClick={() => setActiveTab('CARD')}
          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            activeTab === 'CARD' 
              ? 'bg-sky-600 text-white border-sky-500' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <QrCode className="w-4 h-4" />
          QR আইডি
        </button>

        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            activeTab === 'HISTORY' 
              ? 'bg-sky-600 text-white border-sky-500' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          হিস্ট্রি
        </button>

        <button
          onClick={() => setActiveTab('DUE')}
          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            activeTab === 'DUE' 
              ? 'bg-sky-600 text-white border-sky-500' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          বকেয়া (Due)
        </button>

        <button
          onClick={() => setActiveTab('RECEIPT')}
          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            activeTab === 'RECEIPT' 
              ? 'bg-sky-600 text-white border-sky-500' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <Download className="w-4 h-4" />
          PDF রিসিট
        </button>
      </div>

      {/* Tabs */}
      {activeTab === 'CARD' && (
        <div className="p-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl text-center space-y-3 border border-slate-800">
          <div className="w-36 h-36 mx-auto bg-white p-2 rounded-2xl shadow-xl flex items-center justify-center">
            <QrCode className="w-full h-full text-slate-900" />
          </div>
          <div>
            <h5 className="font-black text-xs text-white">ডিজিটাল QR মেম্বারশিপ কার্ড</h5>
            <p className="text-[10px] text-slate-400">টাকা জমা দেওয়ার সময় ক্যাশিয়ারকে এই QR টি দেখান</p>
          </div>
        </div>
      )}

      {activeTab === 'HISTORY' && (
        <div className="space-y-2 text-xs">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">দৈনিক জমার কিস্তি</div>
              <div className="text-[10px] text-slate-400 font-mono">31 Jul 2026 • Cash</div>
            </div>
            <span className="text-emerald-500 font-bold font-mono">+৳৫০০</span>
          </div>

          <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">মাসিক মেম্বারশিপ ফি</div>
              <div className="text-[10px] text-slate-400 font-mono">15 Jul 2026 • bKash</div>
            </div>
            <span className="text-emerald-500 font-bold font-mono">+৳১,০০০</span>
          </div>
        </div>
      )}

      {activeTab === 'DUE' && (
        <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 text-xs">
          <div className="text-center space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">বর্তমান বকেয়া (Current Due)</span>
            <div className="text-2xl font-black text-emerald-500 font-mono">৳০.০০</div>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">আপনার কোনো বকেয়া নেই! ধন্যবাদ।</p>
          </div>

          <button
            type="button"
            className="w-full py-2 bg-sky-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
          >
            <CreditCard className="w-4 h-4" />
            বিকাশ / নগদ দিয়ে অ্যাডভান্স জমা দিন
          </button>
        </div>
      )}

      {activeTab === 'RECEIPT' && (
        <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 text-xs">
          <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 text-[11px]">
            <div className="font-bold text-slate-900 dark:text-white">অফিসিয়াল পেমেন্ট ইনভয়েস #INV-2026-089</div>
            <div className="text-[10px] text-slate-400 font-mono">তারিখ: 31 Jul 2026 • পরিমাণ: ৳৫০০</div>
          </div>

          <button
            type="button"
            onClick={() => setPdfDownloaded(true)}
            className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            {pdfDownloaded ? 'PDF রিসিট ডাউনলোডেড ✓' : 'ডাউনলোড PDF রিসিট'}
          </button>
        </div>
      )}

    </div>
  );
};
