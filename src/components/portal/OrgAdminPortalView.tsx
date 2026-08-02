import React from 'react';
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  ShieldCheck, 
  Download, 
  FileText, 
  CheckCircle2, 
  UserCheck 
} from 'lucide-react';

interface OrgAdminPortalViewProps {
  tenantId: string;
  tenantName: string;
}

export const OrgAdminPortalView: React.FC<OrgAdminPortalViewProps> = ({
  tenantId,
  tenantName
}) => {
  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Tenant Details */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              অর্গানাইজেশন তথ্য
            </span>
            <div className="text-base font-black text-slate-900 dark:text-white mt-1">
              {tenantName}
            </div>
            <div className="text-[11px] text-indigo-500 font-mono font-bold mt-1">
              ID: {tenantId}
            </div>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Subscription */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              সাবস্ক্রিপশন প্যাকেজ
            </span>
            <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">
              Enterprise PRO Suite
            </div>
            <div className="text-[11px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE (Yearly)
            </div>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Total Employees */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              নিবন্ধিত মেম্বার ও স্টাফ
            </span>
            <div className="text-2xl font-black text-sky-600 dark:text-sky-400 font-mono mt-1">
              ৪২ জন
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">
              ড্রাইভার, মেকানিক & ক্যাশিয়ার
            </div>
          </div>
          <div className="p-3 bg-sky-500/10 text-sky-500 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Revenue Stats */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              চলতি মাসের কালেকশন
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono mt-1">
              ৳ ১,৫৮,০০০ BDT
            </div>
            <div className="text-[11px] text-emerald-500 font-semibold mt-1">
              +১৫% প্রবৃদ্ধি
            </div>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Employee List & Member Stats */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-500" />
            অর্গানাইজেশন মেম্বার ও কর্মচারী তালিকা
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase">
                <th className="py-2.5 px-3">মেম্বার আইডি</th>
                <th className="py-2.5 px-3">নাম ও পদবী</th>
                <th className="py-2.5 px-3">মোবাইল নম্বর</th>
                <th className="py-2.5 px-3">গাড়ি নং</th>
                <th className="py-2.5 px-3">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {[
                { id: 'MEM-ABABIL-2026-991', name: 'মোঃ জহিরুল ইসলাম', role: 'সিনিয়র গ্যারেজ ড্রাইভার', mobile: '01711002233', vehicle: 'ঢাকা মেট্রো-থ-১১-৮৮৯২', status: 'ACTIVE' },
                { id: 'MEM-ABABIL-2026-882', name: 'ক্যাশিয়ার রফিক উল্লাহ', role: 'অফিস ক্যাশিয়ার', mobile: '01899112244', vehicle: '--', status: 'ACTIVE' },
                { id: 'MEM-ABABIL-2026-773', name: 'আব্দুল করিম (মেকানিক)', role: 'চীফ ইলেকট্রিশিয়ান', mobile: '01900112255', vehicle: '--', status: 'ACTIVE' }
              ].map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{emp.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{emp.name}</div>
                    <div className="text-[10px] text-slate-400">{emp.role}</div>
                  </td>
                  <td className="py-3 px-3 font-mono">{emp.mobile}</td>
                  <td className="py-3 px-3">{emp.vehicle}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
