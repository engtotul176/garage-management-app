import React from 'react';
import { ShieldCheck, Moon, Sun, Building2, User, LogOut } from 'lucide-react';
import { useAuth } from '../../core/auth/AuthContext';
import { useTenant } from '../../core/tenant/TenantEngine';
import { useBranding } from '../../core/branding/BrandingEngine';
import { useTheme } from '../../core/theme/ThemeEngine';
import { UserRole } from '../../types/saas';

export const HeaderShell: React.FC = () => {
  const { currentUser, userProfile, role, setRole, logout } = useAuth();
  const { currentTenant, tenantsList, setTenant } = useTenant();
  const { branding } = useBranding();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Software Title */}
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md"
            style={{ backgroundColor: branding.primaryColor || '#7c3aed' }}
          >
            {branding.softwareName.charAt(0)}
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
              {branding.softwareName}
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {currentTenant.orgName} ({currentTenant.orgCategory})
            </p>
          </div>
        </div>

        {/* Tenant Selector, Role Switcher, User Profile & Logout */}
        <div className="flex items-center gap-3">
          {/* Tenant Selector */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={currentTenant.id}
              onChange={(e) => setTenant(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              {tenantsList.map((t) => (
                <option key={t.id} value={t.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {t.orgName} ({t.status})
                </option>
              ))}
            </select>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-950/40 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800">
            <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-extrabold text-purple-700 dark:text-purple-300 focus:outline-none cursor-pointer"
            >
              <option value="super_admin" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Super Admin</option>
              <option value="org_admin" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Garage Admin</option>
              <option value="manager" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Manager</option>
              <option value="employee" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Collector Employee</option>
              <option value="member" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Driver Member</option>
            </select>
          </div>

          {/* User Profile Badge */}
          {userProfile && (
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {userProfile.displayName || userProfile.email}
                </p>
                <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                  {role}
                </p>
              </div>
            </div>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Logout Button */}
          {currentUser && (
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 transition-all flex items-center gap-1.5 text-xs font-bold"
              title="Logout Session"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">লগআউট</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
