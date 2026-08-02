import React from 'react';
import { ShieldCheck, Building2, UserCheck, Layers, Moon, Sun, AlertTriangle } from 'lucide-react';
import { BrandingConfig, UserRole, OrganizationTenant } from '../types/saas';
import { OWNER_INFO } from '../config/branding';

interface HeaderProps {
  branding: BrandingConfig;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  organizations: OrganizationTenant[];
  currentOrg: OrganizationTenant;
  onOrgChange: (orgId: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  branding,
  currentRole,
  onRoleChange,
  organizations,
  currentOrg,
  onOrgChange,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left Side: Dynamic Branding Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xl shadow-md overflow-hidden ring-2 ring-sky-500/20">
              {branding.logoUrl ? (
                <img 
                  src={branding.logoUrl} 
                  alt={branding.orgName} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to initial
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : null}
              <span className="text-white font-extrabold">{branding.orgName.slice(0, 1)}</span>
            </div>
            
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  {branding.orgName}
                </h1>
                {currentOrg.status === 'trial' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    <AlertTriangle className="w-3 h-3 mr-1" /> ট্রায়াল ({currentOrg.trialDaysRemaining} দিন)
                  </span>
                )}
                {currentOrg.status === 'expired' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
                    মেয়াদ উত্তীর্ণ
                  </span>
                )}
                {currentOrg.status === 'active' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                    এক্টিভ ক্লাউড
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {OWNER_INFO.softwareName} (Multi-Tenant Cloud Engine)
              </p>
            </div>
          </div>

          {/* Center-Right Controls: Org Switcher, Role Simulator, Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Organization Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <Building2 className="w-4 h-4 text-sky-600 dark:text-sky-400 ml-1 hidden md:block" />
              <select
                value={currentOrg.id}
                onChange={(e) => onOrgChange(e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer py-1 px-1 sm:px-2 rounded"
                title="অর্গানাইজেশন ফিল্টার"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {org.orgName} ({org.orgCategory})
                  </option>
                ))}
              </select>
            </div>

            {/* Role Simulator Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 ml-1 hidden md:block" />
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer py-1 px-1 sm:px-2 rounded"
                title="রোল পারমিশন টেস্ট"
              >
                <option value="super_admin" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">👑 Super Admin (সুপার এডমিন)</option>
                <option value="org_admin" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🏢 Org Admin (অর্গানাইজেশন এডমিন)</option>
                <option value="employee" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">👨‍💼 Employee (এমপ্লয়ী/কালেক্টর)</option>
                <option value="member" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🚗 Member (মেম্বার/ড্রাইভার)</option>
              </select>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
              title={darkMode ? 'লাইট মোড' : 'ডার্ক মোড'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
