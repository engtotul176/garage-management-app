import React, { useState } from 'react';
import { Building2, Package, CreditCard, DollarSign, Activity, Bell, Shield, Database, Radio, CheckCircle, ChevronRight } from 'lucide-react';
import { AndroidSession } from '../../../types/androidApp';

interface SuperAdminAndroidAppProps {
  session: AndroidSession;
  isDarkMode: boolean;
}

export const SuperAdminAndroidApp: React.FC<SuperAdminAndroidAppProps> = ({ session, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ORGS' | 'REVENUE' | 'SYSTEM'>('DASHBOARD');

  return (
    <div className="space-y-3">
      
      {/* Top Welcome Card */}
      <div className="p-3.5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl border border-slate-800 space-y-1 shadow-md">
        <div className="flex items-center justify-between text-[10px] text-indigo-300 font-mono">
          <span>SUPER ADMIN APP</span>
          <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">ROOT ACCESS</span>
        </div>
        <h4 className="font-extrabold text-xs text-white">{session.userName}</h4>
        <p className="text-[10px] text-slate-300">গ্লোবাল SaaS ক্লাস্টার ও অর্গানাইজেশন কনট্রোল</p>
      </div>

      {/* App Navigation Grid */}
      <div className="grid grid-cols-4 gap-1.5 text-center font-bold text-[10px]">
        <button
          onClick={() => setActiveTab('DASHBOARD')}
          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            activeTab === 'DASHBOARD' 
              ? 'bg-indigo-600 text-white border-indigo-500' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          ড্যাশবোর্ড
        </button>

        <button
          onClick={() => setActiveTab('ORGS')}
          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            activeTab === 'ORGS' 
              ? 'bg-indigo-600 text-white border-indigo-500' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          প্রতিষ্ঠাসমূহ
        </button>

        <button
          onClick={() => setActiveTab('REVENUE')}
          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            activeTab === 'REVENUE' 
              ? 'bg-indigo-600 text-white border-indigo-500' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          আয় & প্ল্যান
        </button>

        <button
          onClick={() => setActiveTab('SYSTEM')}
          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            activeTab === 'SYSTEM' 
              ? 'bg-indigo-600 text-white border-indigo-500' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          হেলথ & ব্যাকআপ
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-3">
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">মোট অর্গানাইজেশন</span>
              <span className="text-base font-black text-slate-900 dark:text-white font-mono">18 Orgs</span>
              <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">16 Active • 2 Trial</span>
            </div>

            <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">চলতি মাসের SaaS আয়</span>
              <span className="text-base font-black text-indigo-600 dark:text-indigo-400 font-mono">৳3,45,000</span>
              <span className="text-[9px] text-indigo-500 font-bold block mt-0.5">+18.4% growth</span>
            </div>
          </div>

          <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
            <h5 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center justify-between">
              <span>সক্রিয় পেমেন্ট গেটওয়েসমূহ</span>
              <span className="text-[10px] text-emerald-500 font-mono font-bold">LIVE</span>
            </h5>
            <div className="space-y-1.5 text-[11px] font-bold">
              <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span>bKash Merchant Gateway</span>
                <span className="text-emerald-500">Active ✓</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span>Nagad Corporate API</span>
                <span className="text-emerald-500">Active ✓</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'ORGS' && (
        <div className="space-y-2">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
            <div>
              <div className="text-slate-900 dark:text-white">বিসমিল্লাহ অটো চার্জিং গ্যারেজ</div>
              <div className="text-[10px] text-slate-400 font-mono">ID: org_bismillah_001 • Enterprise Pro</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 text-[10px]">ACTIVE</span>
          </div>

          <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
            <div>
              <div className="text-slate-900 dark:text-white">রহমান পরিবহন স্ট্যান্ড</div>
              <div className="text-[10px] text-slate-400 font-mono">ID: org_rahman_002 • Starter Pack</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[10px]">TRIAL</span>
          </div>
        </div>
      )}

      {activeTab === 'REVENUE' && (
        <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
          <h5 className="font-bold text-slate-900 dark:text-white">SaaS প্যাকেজ সাবস্ক্রিপশন প্ল্যানসমূহ</h5>
          <div className="p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-mono">
            <div className="font-bold text-indigo-400">Enterprise Pro - ৳১০,০০০/মাস</div>
            <div className="text-[10px] text-slate-400 font-sans">আনলিমিটেড মেম্বার, টিভি ড্যাশবোর্ড, REST API</div>
          </div>
          <div className="p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-mono">
            <div className="font-bold text-emerald-400">Standard Pack - ৳৫,০০০/মাস</div>
            <div className="text-[10px] text-slate-400 font-sans">সর্বোচ্চ ২০০ মেম্বার, SMS রিসিট, ডেসktop POS</div>
          </div>
        </div>
      )}

      {activeTab === 'SYSTEM' && (
        <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold">
            <span>Firestore DB Sync:</span>
            <span className="text-emerald-500 font-mono">HEALTHY (100%)</span>
          </div>
          <div className="flex items-center justify-between font-bold">
            <span>অটোমেটেড ব্যাকআপ:</span>
            <span className="text-indigo-400 font-mono">DAILY 03:00 AM</span>
          </div>
        </div>
      )}

    </div>
  );
};
