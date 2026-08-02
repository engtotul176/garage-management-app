import React from 'react';
import { 
  TrendingUp, 
  Receipt, 
  Calendar, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  PiggyBank, 
  AlertCircle, 
  Users, 
  UserCheck, 
  Building2 
} from 'lucide-react';
import { ReportSummaryStats } from '../../types/reports';

interface AnalyticsCardsProps {
  stats: ReportSummaryStats;
  loading?: boolean;
}

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ stats, loading }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 })
      .format(amount)
      .replace('BDT', '৳');
  };

  const cards = [
    {
      id: 'today_collection',
      label: 'আজকের কালেকশন (Today)',
      value: formatCurrency(stats.todayCollection),
      subtext: 'আজকের মোট আদায়কৃত টাকা',
      icon: Receipt,
      bgGradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      badge: '+১২% আজ',
      badgePositive: true
    },
    {
      id: 'weekly_collection',
      label: 'সাপ্তাহিক কালেকশন (Weekly)',
      value: formatCurrency(stats.weeklyCollection),
      subtext: 'চলতি সপ্তাহের আদায়',
      icon: Calendar,
      bgGradient: 'from-sky-500/10 to-blue-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400',
      badge: '+১৮% সপ্তাহ',
      badgePositive: true
    },
    {
      id: 'monthly_collection',
      label: 'মাসিক কালেকশন (Monthly)',
      value: formatCurrency(stats.monthlyCollection),
      subtext: 'চলতি মাসের মোট কালেকশন',
      icon: TrendingUp,
      bgGradient: 'from-indigo-500/10 to-purple-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400',
      badge: '+২২% মাস',
      badgePositive: true
    },
    {
      id: 'yearly_collection',
      label: 'বার্ষিক কালেকশন (Yearly)',
      value: formatCurrency(stats.yearlyCollection),
      subtext: 'চলতি বছরের মোট আদায়',
      icon: DollarSign,
      bgGradient: 'from-violet-500/10 to-fuchsia-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400',
      badge: '+২৪% বছর',
      badgePositive: true
    },
    {
      id: 'total_income',
      label: 'সর্বমোট আয় (Total Revenue)',
      value: formatCurrency(stats.totalIncome),
      subtext: 'কালেকশন + অন্যান্য সার্ভিস আয়',
      icon: Wallet,
      bgGradient: 'from-emerald-500/10 to-green-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      badge: 'মোট আয়',
      badgePositive: true
    },
    {
      id: 'total_expense',
      label: 'সর্বমোট খরচ (Total Expense)',
      value: formatCurrency(stats.totalExpense),
      subtext: 'বিদ্যুৎ বিল, বেতন ও পরিচালনা',
      icon: ArrowDownRight,
      bgGradient: 'from-rose-500/10 to-red-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
      badge: 'মোট ব্যয়',
      badgePositive: false
    },
    {
      id: 'net_profit',
      label: 'নিট লাভ (Net Profit)',
      value: formatCurrency(stats.netProfit),
      subtext: 'আয় হতে ব্যয় বাদ দেয়ার পর',
      icon: PiggyBank,
      bgGradient: 'from-amber-500/10 to-yellow-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
      badge: 'মুনাফা',
      badgePositive: true
    },
    {
      id: 'due_amount',
      label: 'মোট বকেয়া (Due Amount)',
      value: formatCurrency(stats.totalDueAmount),
      subtext: 'ড্রাইভারদের কাছে পাওনা',
      icon: AlertCircle,
      bgGradient: 'from-orange-500/10 to-amber-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400',
      badge: 'পাওনা বাকী',
      badgePositive: false
    },
    {
      id: 'advance_amount',
      label: 'অগ্রিম জমা (Advance Deposit)',
      value: formatCurrency(stats.totalAdvanceAmount),
      subtext: 'মেম্বারদের অগ্রিম ওয়ালেট',
      icon: ArrowUpRight,
      bgGradient: 'from-cyan-500/10 to-teal-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400',
      badge: 'অগ্রিম জমা',
      badgePositive: true
    },
    {
      id: 'active_members',
      label: 'সক্রিয় মেম্বার (Active Members)',
      value: `${stats.activeMembersCount} জন`,
      subtext: 'নিয়মিত রিকশা ও ই-বাইক চালক',
      icon: Users,
      bgGradient: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
      badge: 'সক্রিয় নিবন্ধিত',
      badgePositive: true
    },
    {
      id: 'active_employees',
      label: 'সক্রিয় এমপ্লয়ি (Staff)',
      value: `${stats.activeEmployeesCount} জন`,
      subtext: 'ক্যাশিয়ার ও স্টাফ মেম্বার',
      icon: UserCheck,
      bgGradient: 'from-teal-500/10 to-emerald-500/10 border-teal-500/20 text-teal-600 dark:text-teal-400',
      badge: 'কর্মরত',
      badgePositive: true
    },
    {
      id: 'active_organizations',
      label: 'অর্গানাইজেশন (Tenants)',
      value: `${stats.activeOrganizationsCount} টি`,
      subtext: 'সক্রিয় গ্যারেজ শাখা ও টেন্যান্ট',
      icon: Building2,
      bgGradient: 'from-purple-500/10 to-indigo-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400',
      badge: 'মাল্টি-টেন্যান্ট',
      badgePositive: true
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={card.id}
            className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between relative overflow-hidden`}
          >
            {/* Top Accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.bgGradient.split(' ')[0]} ${card.bgGradient.split(' ')[1]}`} />

            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-0.5">
                  {card.label}
                </span>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {card.value}
                </div>
              </div>
              <div className={`p-2.5 rounded-xl border ${card.bgGradient}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                {card.subtext}
              </span>
              <span className={`font-medium px-2 py-0.5 rounded-md text-[10px] ${
                card.badgePositive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}>
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
