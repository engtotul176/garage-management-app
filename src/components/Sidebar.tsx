import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Receipt, 
  Printer,
  MessageSquare,
  CreditCard, 
  ShieldCheck, 
  Palette, 
  Settings, 
  GitBranch,
  FileCheck,
  Lock,
  Boxes,
  BarChart3,
  Tv,
  Database,
  UserCheck,
  Server,
  Smartphone,
  BrainCircuit,
  Zap,
  TestTube,
  Cloud,
  Crown,
  Award
} from 'lucide-react';
import { UserRole } from '../types/saas';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  currentRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentRole,
}) => {
  const isSuperAdmin = currentRole === 'super_admin';
  const isOrgAdmin = currentRole === 'org_admin' || isSuperAdmin;
  const isEmployee = currentRole === 'employee' || isOrgAdmin;

  const menuItems = [
    {
      id: 'step1_overview',
      label: 'ধাপ ১ আর্কিটেকচার (Step 1 Blueprint)',
      icon: GitBranch,
      badge: 'ধাপ ১ প্রস্তুত',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      allowed: true
    },
    {
      id: 'super_admin_panel',
      label: 'সুপার এডমিন প্যানেল (Super Admin)',
      icon: ShieldCheck,
      badge: 'সুপার কন্ট্রোল',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      allowed: isSuperAdmin
    },
    {
      id: 'organizations',
      label: 'অর্গানাইজেশন তালিকা (Multi-Tenant)',
      icon: Building2,
      badge: 'মাল্টি টেন্যান্ট',
      badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      allowed: isSuperAdmin
    },
    {
      id: 'dashboard',
      label: 'গ্যারেজ ড্যাশবোর্ড (Dashboard)',
      icon: LayoutDashboard,
      allowed: isOrgAdmin
    },
    {
      id: 'employee_management',
      label: 'এমপ্লয়ি ও রোল পারমিশন (PROMPT-10)',
      icon: ShieldCheck,
      badge: 'PROMPT-10',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      allowed: isOrgAdmin
    },
    {
      id: 'members',
      label: 'মেম্বার ম্যানেজমেন্ট (PROMPT-11)',
      icon: Users,
      badge: 'PROMPT-11',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      allowed: isEmployee
    },
    {
      id: 'daily_collection',
      label: 'দৈনিক কালেকশন ও চার্জিং (PROMPT-12)',
      icon: Receipt,
      badge: 'PROMPT-12',
      badgeColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
      allowed: isEmployee
    },
    {
      id: 'receipt_system',
      label: 'রসিদ, ইনভয়েস & প্রিন্টিং (PROMPT-13)',
      icon: Printer,
      badge: 'PROMPT-13',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      allowed: isEmployee
    },
    {
      id: 'communication_center',
      label: 'SMS & নোটিফিকেশন সেন্টার (PROMPT-14)',
      icon: MessageSquare,
      badge: 'PROMPT-14',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      allowed: isEmployee
    },
    {
      id: 'accounting_system',
      label: 'হিসাব ও আর্থিক ব্যবস্থাপনা (PROMPT-15)',
      icon: CreditCard,
      badge: 'PROMPT-15',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      allowed: isEmployee
    },
    {
      id: 'reports_analytics',
      label: 'রিপোর্ট, এনালাইটিক্স & BI (PROMPT-16)',
      icon: BarChart3,
      badge: 'PROMPT-16',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      allowed: isEmployee
    },
    {
      id: 'android_tv_live',
      label: 'Android TV লাইভ ড্যাশবোর্ড (PROMPT-17)',
      icon: Tv,
      badge: 'PROMPT-17',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      allowed: isEmployee
    },
    {
      id: 'backup_restore',
      label: 'ব্যাকআপ, রিস্টোর & ডিজাস্টার রিকভারি (PROMPT-18)',
      icon: Database,
      badge: 'PROMPT-18',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      allowed: isOrgAdmin
    },
    {
      id: 'payment_billing',
      label: 'পেমেন্ট গেটওয়ে & বিলিং (PROMPT-19)',
      icon: CreditCard,
      badge: 'PROMPT-19',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      allowed: isOrgAdmin
    },
    {
      id: 'customer_portal',
      label: 'কাস্টমার পোর্টাল & মেম্বার সেলফ সার্ভিস (PROMPT-20)',
      icon: UserCheck,
      badge: 'PROMPT-20',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      allowed: true
    },
    {
      id: 'rest_api',
      label: 'REST API & মোবাইল ব্যাকএন্ড (PROMPT-21)',
      icon: Server,
      badge: 'PROMPT-21',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      allowed: true
    },
    {
      id: 'android_app',
      label: 'Enterprise Android App (PROMPT-22)',
      icon: Smartphone,
      badge: 'PROMPT-22',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      allowed: true
    },
    {
      id: 'ai_analytics',
      label: 'AI BI & Smart Analytics (PROMPT-23)',
      icon: BrainCircuit,
      badge: 'PROMPT-23',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      allowed: true
    },
    {
      id: 'system_settings_center',
      label: 'Global System Settings (PROMPT-24)',
      icon: Settings,
      badge: 'PROMPT-24',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      allowed: true
    },
    {
      id: 'enterprise_security',
      label: 'Security & Compliance (PROMPT-25)',
      icon: ShieldCheck,
      badge: 'PROMPT-25',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      allowed: true
    },
    {
      id: 'enterprise_performance',
      label: 'Performance & Scalability (PROMPT-26)',
      icon: Zap,
      badge: 'PROMPT-26',
      badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      allowed: true
    },
    {
      id: 'enterprise_qa',
      label: 'QA & Testing Audit (PROMPT-27)',
      icon: TestTube,
      badge: 'PROMPT-27',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      allowed: true
    },
    {
      id: 'enterprise_devops',
      label: 'Production DevOps & CI/CD (PROMPT-28)',
      icon: Cloud,
      badge: 'PROMPT-28',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      allowed: true
    },
    {
      id: 'whitelabel_licensing',
      label: 'White Label & License Engine (PROMPT-29)',
      icon: Crown,
      badge: 'PROMPT-29',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      allowed: true
    },
    {
      id: 'final_release',
      label: 'Final Enterprise Release v1.0 (PROMPT-30)',
      icon: Award,
      badge: 'PROMPT-30',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      allowed: true
    },
    {
      id: 'subscription_engine',
      label: 'সাবস্ক্রিপশন ও প্যাকেজ প্ল্যান',
      icon: CreditCard,
      allowed: isOrgAdmin
    },
    {
      id: 'dynamic_branding',
      label: 'ডাইনামিক ব্র্যান্ডিং ও থিম',
      icon: Palette,
      allowed: isOrgAdmin
    },
    {
      id: 'database_schema',
      label: 'ফায়ারস্টোর স্কিমা ও সিকিউরিটি',
      icon: Boxes,
      allowed: true
    },
    {
      id: 'roadmap_approval',
      label: '১০-ধাপ ডেভেলপমেন্ট রোডম্যাপ',
      icon: FileCheck,
      badge: 'অনুমোদন পেন্ডিং',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      allowed: true
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
      
      {/* Role Banner Badge */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            বর্তমান অ্যাক্সেস লেভেল
          </span>
          <span className="inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300">
            {currentRole === 'super_admin' && '👑 Super Admin'}
            {currentRole === 'org_admin' && '🏢 Org Admin'}
            {currentRole === 'employee' && '👨‍💼 Employee'}
            {currentRole === 'member' && '🚗 Member'}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isAllowed = item.allowed;

          return (
            <button
              key={item.id}
              onClick={() => isAllowed && onTabChange(item.id)}
              disabled={!isAllowed}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm font-semibold'
                  : isAllowed
                  ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  : 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60 bg-slate-50 dark:bg-slate-800/20'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              
              {item.badge && isAllowed && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${item.badgeColor} ml-1 shrink-0`}>
                  {item.badge}
                </span>
              )}

              {!isAllowed && (
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom SaaS Platform Badge */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-center">
        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          SaaS Engine Status
        </p>
        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
          ● Multi-Tenant Isolated
        </p>
      </div>

    </aside>
  );
};
