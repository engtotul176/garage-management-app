import React, { useState } from 'react';
import { Users, UserPlus, DollarSign, Wallet, FileText, Bell, TrendingUp, CheckCircle2, ChevronRight, Search } from 'lucide-react';
import { AndroidSession } from '../../../types/androidApp';

interface OrgAdminAndroidAppProps {
  session: AndroidSession;
  isDarkMode: boolean;
}

export const OrgAdminAndroidApp: React.FC<OrgAdminAndroidAppProps> = ({ session, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'MEMBERS' | 'COLLECTION' | 'REPORTS'>('DASHBOARD');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-3">
      
      {/* Header Banner */}
      <div className="p-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl border border-slate-800 space-y-1 shadow-md">
        <div className="flex items-center justify-between text-[10px] text-indigo-300 font-mono">
          <span>ORG ADMIN APP</span>
          <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">ACTIVE</span>
        </div>
        <h4 className="font-extrabold text-xs text-white">{session.tenantName}</h4>
        <p className="text-[10px] text-slate-300">এডমিন: {session.userName}</p>
      </div>

      {/* Navigation Pills */}
      <div className="grid grid-cols-4 gap-1.5 text-center font-bold text-[10px]">
        <button
          onClick={() => setActiveTab('DASHBOARD')}
          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            activeTab === 'DASHBOARD' 
              ? 'bg-indigo-600 text-white border-indigo-500' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          ড্যাশবোর্ড
        </button>

        <button
          onClick={() => setActiveTab('MEMBERS')}
          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            activeTab === 'MEMBERS' 
              ? 'bg-indigo-600 text-white border-indigo-500' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          মেম্বারস
        </button>

        <button
          onClick={() => setActiveTab('COLLECTION')}
          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            activeTab === 'COLLECTION' 
              ? 'bg-indigo-600 text-white border-indigo-500' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          কালেকশন
        </button>

        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            activeTab === 'REPORTS' 
              ? 'bg-indigo-600 text-white border-indigo-500' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          রিপোর্টস
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-3">
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">আজকের কালেকশন</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">৳১২,৫০০</span>
              <span className="text-[9px] text-slate-500 font-bold block mt-0.5">২৫ জন গাড়ি চালক</span>
            </div>

            <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">মোট বকেয়া (Due)</span>
              <span className="text-base font-black text-rose-500 font-mono">৳৪৫,০০০</span>
              <span className="text-[9px] text-rose-400 font-bold block mt-0.5">৩০ জন মেম্বার</span>
            </div>
          </div>

          <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
            <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">সর্বশেষ টাকা জমা রিসেন্ট লগ</h5>
            
            <div className="p-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">মোঃ জহিরুল ইসলাম (ড্রাইভার)</div>
                <div className="text-[10px] text-slate-400 font-mono">ঢাকা মেট্রো-থ-১১-৮৮৯২</div>
              </div>
              <div className="text-right">
                <span className="text-emerald-500 font-bold font-mono">+৳৫০০</span>
                <span className="text-[9px] text-slate-400 block">CASH</span>
              </div>
            </div>

            <div className="p-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">আলামিন হোসেন (ইজিবাইক)</div>
                <div className="text-[10px] text-slate-400 font-mono">ঢাকা মেট্রো-ই-২২-৪৪০১</div>
              </div>
              <div className="text-right">
                <span className="text-emerald-500 font-bold font-mono">+৳৮০০</span>
                <span className="text-[9px] text-slate-400 block">bKash</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'MEMBERS' && (
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="মেম্বার বা গাড়ির নম্বর..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold">
            <div>
              <div className="text-slate-900 dark:text-white">মোঃ কামাল হোসেন</div>
              <div className="text-[10px] text-slate-400 font-mono">ঢাকা মেট্রো-থ-১১-৮৮৯২ • 01711002233</div>
            </div>
            <span className="text-emerald-500 font-mono">বকেয়া: ৳০</span>
          </div>

          <div className="p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold">
            <div>
              <div className="text-slate-900 dark:text-white">আব্দুল জাব্বার</div>
              <div className="text-[10px] text-slate-400 font-mono">ঢাকা মেট্রো-ই-১২-৩০৯১ • 01822114455</div>
            </div>
            <span className="text-rose-500 font-mono">বকেয়া: ৳১,২০০</span>
          </div>
        </div>
      )}

      {activeTab === 'COLLECTION' && (
        <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
          <h5 className="font-bold text-slate-900 dark:text-white">নতুন কালেকশন কালেকটর লিস্ট</h5>
          <div className="p-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center font-mono">
            <span>ক্যাশিয়ার রফিক উল্লাহ:</span>
            <span className="text-emerald-500 font-bold">৳৮,৫০০</span>
          </div>
          <div className="p-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center font-mono">
            <span>শাহিন আলম (ম্যানেজার):</span>
            <span className="text-emerald-500 font-bold">৳৪,০০০</span>
          </div>
        </div>
      )}

      {activeTab === 'REPORTS' && (
        <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between items-center font-bold">
            <span>মাসিক মোট আয় (Income):</span>
            <span className="text-emerald-500 font-mono">৳১,৫৮,০০০</span>
          </div>
          <div className="flex justify-between items-center font-bold">
            <span>মাসিক মোট ব্যয় (Expense):</span>
            <span className="text-rose-500 font-mono">৳৪২,০০০</span>
          </div>
          <div className="flex justify-between items-center font-extrabold border-t border-slate-200 dark:border-slate-800 pt-2 text-indigo-500">
            <span>নিট মুনাফা (Profit):</span>
            <span className="font-mono">৳১,১৬,০০০</span>
          </div>
        </div>
      )}

    </div>
  );
};
