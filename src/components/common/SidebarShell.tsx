import React from 'react';
import { 
  ShieldCheck, LayoutDashboard, Users, Receipt, Layers, Sliders, Settings 
} from 'lucide-react';
import { useAuth } from '../../core/auth/AuthContext';
import { RBACMiddleware } from '../../core/rbac/rbacMiddleware';

interface SidebarShellProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SidebarShell: React.FC<SidebarShellProps> = ({ activeTab, onTabChange }) => {
  const { role } = useAuth();

  const navItems = [
    {
      id: 'step1_overview',
      label: 'ব্লুপ্রিন্ট ও ফাউন্ডেশন',
      icon: ShieldCheck,
      permission: 'view_reports' as const,
    },
    {
      id: 'super_admin_panel',
      label: 'সুপার এডমিন কন্ট্রোল',
      icon: Layers,
      permission: 'manage_all_tenants' as const,
    },
    {
      id: 'dashboard',
      label: 'গ্যারেজ লাইভ ড্যাশবোর্ড',
      icon: LayoutDashboard,
      permission: 'view_reports' as const,
    },
    {
      id: 'members',
      label: 'মেম্বার ও গাড়ি ম্যানেজমেন্ট',
      icon: Users,
      permission: 'manage_members' as const,
    },
    {
      id: 'daily_collection',
      label: 'দৈনিক কালেকশন ও রসিদ',
      icon: Receipt,
      permission: 'collect_daily_payments' as const,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-1">
      <div className="px-3 py-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
        Enterprise SaaS Navigation
      </div>

      {navItems.map((item) => {
        const canAccess = RBACMiddleware.hasPermission(role, item.permission);
        if (!canAccess) return null;

        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              isActive
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
};
