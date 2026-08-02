import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  CollectionTrendData, 
  CategoryBreakdownData, 
  PaymentMethodDistribution 
} from '../../types/reports';
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon, Activity } from 'lucide-react';

interface InteractiveChartsProps {
  trendData: CollectionTrendData[];
  paymentDistribution: PaymentMethodDistribution[];
  expenseBreakdown: CategoryBreakdownData[];
}

export const InteractiveCharts: React.FC<InteractiveChartsProps> = ({
  trendData,
  paymentDistribution,
  expenseBreakdown
}) => {
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');

  const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  const formatCurrencyTooltip = (value: number) => {
    return [`৳ ${value.toLocaleString('bn-BD')}`, 'টাকা'];
  };

  return (
    <div className="space-y-6">
      
      {/* Chart 1: Revenue, Expense & Profit Trend Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              মাসিক কালেকশন ও আয়-ব্যয় ট্রেন্ড (Monthly Collection & Trend Analysis)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              প্রতি মাসের মোট কালেকশন, আয়, পরিচালনা ব্যয় এবং নিট মুনাফার রিয়েল-টাইম চার্ট
            </p>
          </div>

          {/* Chart Type Selector Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setChartType('area')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                chartType === 'area'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> এরিয়া (Area)
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                chartType === 'bar'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> বার (Bar)
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                chartType === 'line'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LineIcon className="w-3.5 h-3.5" /> লাইন (Line)
            </button>
          </div>
        </div>

        {/* Dynamic Recharts Renderer */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCollection" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`} />
                <Tooltip formatter={formatCurrencyTooltip} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="collectionAmount" name="মোট কালেকশন" stroke="#0284c7" fillOpacity={1} fill="url(#colorCollection)" />
                <Area type="monotone" dataKey="incomeAmount" name="মোট আয়" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expenseAmount" name="মোট ব্যয়" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            ) : chartType === 'bar' ? (
              <BarChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`} />
                <Tooltip formatter={formatCurrencyTooltip} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="collectionAmount" name="মোট কালেকশন" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="netProfit" name="নিট লাভ" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenseAmount" name="মোট ব্যয়" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`} />
                <Tooltip formatter={formatCurrencyTooltip} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="collectionAmount" name="মোট কালেকশন" stroke="#0284c7" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="incomeAmount" name="মোট আয়" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="expenseAmount" name="মোট ব্যয়" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Pie Chart 1 (Expense Breakdown) & Pie Chart 2 (Payment Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Expense Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
            <PieIcon className="w-5 h-5 text-rose-500" />
            ব্যয় খাতের বিশ্লেষণ (Expense Category Distribution)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            গ্যারেজের বিদ্যুৎ, বেতন ও রক্ষণাবেক্ষণ খরচের শতাকড়া অনুপাত
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatCurrencyTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Method Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
            <PieIcon className="w-5 h-5 text-teal-500" />
            পেমেন্ট মেথড ডিস্ট্রিবিউশন (Payment Methods)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            নগদ ক্যাশ, বিকাশ, নগদ এবং ব্যাংকের মাধ্যমে আদায়কৃত টাকার অনুপাত
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="amount"
                  nameKey="methodLabel"
                  label={({ methodLabel, percentage }) => `${methodLabel} (${percentage}%)`}
                >
                  {paymentDistribution.map((_, index) => (
                    <Cell key={`cell-pm-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatCurrencyTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
