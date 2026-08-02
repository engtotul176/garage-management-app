import React from 'react';
import { ShieldAlert, LogOut, Building2, UserCheck } from 'lucide-react';
import { OrganizationTenant } from '../../types/saas';

interface ImpersonationBannerProps {
  organization: OrganizationTenant;
  onExit: () => void;
}

export const ImpersonationBanner: React.FC<ImpersonationBannerProps> = ({ organization, onExit }) => {
  return (
    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white px-4 py-3 rounded-2xl border-2 border-purple-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in my-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5 text-amber-300 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              সুপার এডমিন ইম্পারসোনেশন মোড
            </span>
            <span className="text-xs font-mono text-purple-200">
              ID: {organization.orgCode || organization.id}
            </span>
          </div>
          <p className="text-sm font-black text-white flex items-center gap-1.5 mt-0.5">
            <Building2 className="w-4 h-4 text-purple-300" />
            <span>{organization.orgName}</span>
            <span className="text-slate-400 font-normal">({organization.email})</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <div className="text-right hidden md:block">
          <p className="text-[11px] text-purple-200 font-semibold flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            লগইনকৃত ভূমিকা: অর্গানাইজেশন এডমিন
          </p>
          <p className="text-[10px] text-slate-400">সকল ডাটা এই গ্যারেজের আওতাভুক্ত</p>
        </div>

        <button
          onClick={onExit}
          className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>ইম্পারসোনেশন বন্ধ করুন (Exit)</span>
        </button>
      </div>
    </div>
  );
};
