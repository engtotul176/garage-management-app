import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Landmark, 
  Calendar, 
  DollarSign, 
  PiggyBank, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw 
} from 'lucide-react';
import { FinancialSummary, IncomeRecord, ExpenseRecord } from '../../types/finance';

interface Props {
  summary: FinancialSummary;
  recentIncomes: IncomeRecord[];
  recentExpenses: ExpenseRecord[];
  onOpenIncomeForm: () => void;
  onOpenExpenseForm: () => void;
  onOpenCashClosing: () => void;
  onOpenBankTransfer: () => void;
  onTabSelect: (tab: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export const FinancialDashboard: React.FC<Props> = ({
  summary,
  recentIncomes,
  recentExpenses,
  onOpenIncomeForm,
  onOpenExpenseForm,
  onOpenCashClosing,
  onOpenBankTransfer,
  onTabSelect,
  isLoading,
  onRefresh
}) => {

  const formatTk = (amount: number) => {
    return `৳ ${amount.toLocaleString('bn-BD')}`;
  };

  const statCards = [
    {
      id: 'today_income',
      title: 'আজকের আয় (Today Income)',
      value: summary.todayIncome,
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      subtitle: 'আজকের সকল কালেকশন ও আয়'
    },
    {
      id: 'today_expense',
      title: 'আজকের ব্যয় (Today Expense)',
      value: summary.todayExpense,
      icon: TrendingDown,
      color: 'from-rose-500 to-red-600',
      textColor: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
      subtitle: 'আজকের অনুমোদনকৃত খরচ'
    },
    {
      id: 'current_cash',
      title: 'বর্তমান ক্যাশ (Cash Balance)',
      value: summary.currentCashBalance,
      icon: Wallet,
      color: 'from-sky-500 to-blue-600',
      textColor: 'text-sky-600 dark:text-sky-400',
      bgColor: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
      subtitle: 'ক্যাশ রেজিস্টারে গচ্ছিত নগদ'
    },
    {
      id: 'current_bank',
      title: 'বর্তমান ব্যাংক ব্যালেন্স (Bank)',
      value: summary.currentBankBalance,
      icon: Landmark,
      color: 'from-indigo-500 to-purple-600',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
      subtitle: 'সব ব্যাংক অ্যাকাউন্টের যোগফল'
    },
    {
      id: 'monthly_income',
      title: 'মাসিক আয় (Monthly Income)',
      value: summary.monthlyIncome,
      icon: Calendar,
      color: 'from-emerald-600 to-green-700',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      subtitle: 'চলতি মাসের মোট অর্জিত আয়'
    },
    {
      id: 'monthly_expense',
      title: 'মাসিক ব্যয় (Monthly Expense)',
      value: summary.monthlyExpense,
      icon: DollarSign,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      subtitle: 'চলতি মাসের মোট পরিচালন ব্যয়'
    },
    {
      id: 'total_net_profit',
      title: 'মোট লাভ (Net Profit)',
      value: summary.totalNetProfit,
      icon: PiggyBank,
      color: summary.totalNetProfit >= 0 ? 'from-emerald-500 to-teal-700' : 'from-red-600 to-rose-800',
      textColor: summary.totalNetProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
      bgColor: summary.totalNetProfit >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200',
      subtitle: 'মোট আয় বিয়োগ মোট ব্যয়'
    },
    {
      id: 'total_due',
      title: 'মোট বকেয়া (Total Due)',
      value: summary.totalDueAmount,
      icon: AlertCircle,
      color: 'from-rose-500 to-pink-600',
      textColor: 'text-rose-700 dark:text-rose-300',
      bgColor: 'bg-rose-100/50 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700',
      subtitle: 'চালকদের নিকট অনাদায়ী বকেয়া'
    },
    {
      id: 'total_advance',
      title: 'মোট অগ্রিম (Total Advance)',
      value: summary.totalAdvanceAmount,
      icon: CheckCircle2,
      color: 'from-violet-500 to-purple-600',
      textColor: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800',
      subtitle: 'চালকদের নিকট জমানো এডভান্স'
    }
  ];

  const totalMonthlyFlow = summary.monthlyIncome + summary.monthlyExpense;
  const incomePercent = totalMonthlyFlow > 0 ? Math.round((summary.monthlyIncome / totalMonthlyFlow) * 100) : 100;
  const expensePercent = totalMonthlyFlow > 0 ? Math.round((summary.monthlyExpense / totalMonthlyFlow) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg border border-indigo-900/50">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300 px-2.5 py-1 rounded-full bg-indigo-900/60 border border-indigo-700/50">
            PROMPT-15 Financial Core
          </span>
          <h2 className="text-xl md:text-2xl font-bold mt-2">
            আর্থিক ড্যাশবোর্ড ও ওভারভিউ
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            প্রতিষ্ঠানের আজকের আয়-ব্যয়, ক্যাশ ও ব্যাংক স্থিতি এবং লাভ-ক্ষতির লাইভ পরিসংখ্যান
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-refresh-finance"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 text-xs font-medium flex items-center gap-1.5"
            title="ডাটা রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>

          <button
            id="btn-quick-income"
            onClick={onOpenIncomeForm}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন আয়</span>
          </button>

          <button
            id="btn-quick-expense"
            onClick={onOpenExpenseForm}
            className="px-3.5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন ব্যয়</span>
          </button>

          <button
            id="btn-cash-close"
            onClick={onOpenCashClosing}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5"
          >
            <Wallet className="w-4 h-4" />
            <span>দৈনিক ডে ক্লোজিং</span>
          </button>

          <button
            id="btn-bank-transfer"
            onClick={onOpenBankTransfer}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5"
          >
            <Landmark className="w-4 h-4" />
            <span>ব্যাংক ট্রান্সফার</span>
          </button>
        </div>
      </div>

      {/* 9 Grid Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              id={`stat-card-${card.id}`}
              className={`p-5 rounded-2xl border ${card.bgColor} transition-all duration-200 hover:shadow-md flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {card.title}
                  </span>
                  <h3 className={`text-2xl font-black mt-1 ${card.textColor}`}>
                    {formatTk(card.value)}
                  </h3>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-sm shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{card.subtitle}</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  বিবরণ &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Financial Ratio & Quick Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Income vs Expense Monthly Ratio */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                মাসিক আয়-ব্যয় অনুপাত (Monthly Revenue vs Expense)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                চলতি মাসের ক্যাশফ্লো ভারসাম্য
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {new Date().toLocaleString('bn-BD', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-600 dark:text-emerald-400">
                আয়: {formatTk(summary.monthlyIncome)} ({incomePercent}%)
              </span>
              <span className="text-rose-600 dark:text-rose-400">
                ব্যয়: {formatTk(summary.monthlyExpense)} ({expensePercent}%)
              </span>
            </div>

            <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" 
                style={{ width: `${incomePercent}%` }}
              />
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-red-500 transition-all duration-500" 
                style={{ width: `${expensePercent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">নগদ ক্যাশ</span>
              <p className="text-sm font-bold text-sky-600 dark:text-sky-400 mt-0.5">
                {formatTk(summary.currentCashBalance)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">ব্যাংক স্থিতি</span>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {formatTk(summary.currentBankBalance)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">মোট লিকুইড মানি</span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {formatTk(summary.currentCashBalance + summary.currentBankBalance)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Navigation Panel */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              দ্রুত নেভিগেশন (Quick Ledger Access)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              হিসাব মডিউলের প্রধান সেকশনে দ্রুত প্রবেশ করুন
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onTabSelect('income')}
              className="w-full p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" />
                <span>আয় ব্যবস্থাপনা (Income Management)</span>
              </div>
              <span>&rarr;</span>
            </button>

            <button
              onClick={() => onTabSelect('expense')}
              className="w-full p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4" />
                <span>ব্যয় ব্যবস্থাপনা (Expense Management)</span>
              </div>
              <span>&rarr;</span>
            </button>

            <button
              onClick={() => onTabSelect('cashbook')}
              className="w-full p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                <span>ক্যাশ বই ও ডে ক্লোজিং (Cashbook)</span>
              </div>
              <span>&rarr;</span>
            </button>

            <button
              onClick={() => onTabSelect('bank')}
              className="w-full p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4" />
                <span>ব্যাংক অ্যাকাউন্টস (Bank Accounts)</span>
              </div>
              <span>&rarr;</span>
            </button>

            <button
              onClick={() => onTabSelect('ledger')}
              className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <PiggyBank className="w-4 h-4" />
                <span>খতিয়ান & লেজার (Ledgers)</span>
              </div>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

      </div>

      {/* Recent Activity Feeds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recent Incomes Feed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              সাম্প্রতিক আয় (Recent Income Entries)
            </h4>
            <button
              onClick={() => onTabSelect('income')}
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              সব দেখুন &rarr;
            </button>
          </div>

          {recentIncomes.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              এখনো কোনো আয় এন্ট্রি করা হয়নি।
            </p>
          ) : (
            <div className="space-y-2">
              {recentIncomes.slice(0, 5).map((inc) => (
                <div 
                  key={inc.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {inc.categoryName}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      উৎস: {inc.sourceName} | ভাউচার: {inc.voucherNo}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      + {formatTk(inc.amount)}
                    </span>
                    <p className="text-[10px] text-slate-400">
                      {inc.date} ({inc.paymentMethod === 'cash' ? 'নগদ' : 'ব্যাংক'})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Expenses Feed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              সাম্প্রতিক ব্যয় (Recent Expense Entries)
            </h4>
            <button
              onClick={() => onTabSelect('expense')}
              className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline"
            >
              সব দেখুন &rarr;
            </button>
          </div>

          {recentExpenses.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              এখনো কোনো ব্যয় এন্ট্রি করা হয়নি।
            </p>
          ) : (
            <div className="space-y-2">
              {recentExpenses.slice(0, 5).map((exp) => (
                <div 
                  key={exp.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {exp.categoryName}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        exp.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' 
                          : exp.status === 'rejected'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                      }`}>
                        {exp.status === 'approved' ? 'অনুমোদিত' : exp.status === 'rejected' ? 'বাতিল' : 'পেন্ডিং'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      প্রাপক: {exp.payeeName} | ভাউচার: {exp.voucherNo}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                      - {formatTk(exp.amount)}
                    </span>
                    <p className="text-[10px] text-slate-400">
                      {exp.date} ({exp.paymentMethod === 'cash' ? 'নগদ' : 'ব্যাংক'})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
