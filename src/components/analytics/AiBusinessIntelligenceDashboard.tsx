import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  Lightbulb,
  Zap,
  Sparkles,
  Users,
  Building2,
  DollarSign,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  BarChart2,
  PieChart as PieChartIcon,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { AiAnalyticsDashboardData, AIRecommendation } from '../../types/aiAnalytics';
import { AiAnalyticsEngine } from '../../services/aiAnalyticsService';

interface AiBusinessIntelligenceDashboardProps {
  tenantId?: string;
  actorName?: string;
}

export const AiBusinessIntelligenceDashboard: React.FC<AiBusinessIntelligenceDashboardProps> = ({
  tenantId = 'org_bismillah_001',
  actorName = 'Engineer Md. Tanveen Ahmed Tutul'
}) => {
  const [data, setData] = useState<AiAnalyticsDashboardData>(() => AiAnalyticsEngine.getDashboardData(tenantId));
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'30_DAYS' | '7_DAYS' | '90_DAYS'>('30_DAYS');
  const [appliedRecs, setAppliedRecs] = useState<string[]>([]);

  const handleRefreshAnalytics = () => {
    setLoading(true);
    setTimeout(() => {
      setData(AiAnalyticsEngine.getDashboardData(tenantId));
      setLoading(false);
    }, 600);
  };

  const handleApplyRecommendation = (recId: string) => {
    setData(prev => AiAnalyticsEngine.applyRecommendation(recId, prev));
    if (!appliedRecs.includes(recId)) {
      setAppliedRecs([...appliedRecs, recId]);
    }
  };

  const handleResolveAlert = (alertId: string) => {
    setData(prev => AiAnalyticsEngine.resolveAlert(alertId, prev));
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black border border-indigo-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              PROMPT-23
            </span>
            <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              AI Engine & Machine Learning Ready
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="w-7 h-7 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            AI Business Intelligence & Smart Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            রিয়েল-টাইম বিজনেস স্কোর, প্রেডিক্টিভ কালেকশন ফোরকাস্ট, স্মার্ট অ্যালার্ট ও স্বয়ংক্রিয় গ্রোথ রেকমেন্ডেশনস
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-slate-400 font-mono">সর্বশেষ গণনা:</div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">{data.lastCalculatedAt}</div>
          </div>

          <button
            onClick={handleRefreshAnalytics}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'বিশ্লেষণ হচ্ছে...' : 'পুনরায় বিশ্লেষণ'}
          </button>
        </div>
      </div>

      {/* SECTION 1: BUSINESS HEALTH SCORES & KPI OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Daily/Weekly/Monthly Business Health Gauge Card */}
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-6 rounded-3xl text-white border border-indigo-800/50 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-indigo-300 font-mono">
              <span className="flex items-center gap-1.5 font-bold">
                <Activity className="w-4 h-4 text-emerald-400" />
                BUSINESS HEALTH METRICS
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">
                {data.healthScore.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">দৈনিক স্বাস্থ্য</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">{data.healthScore.dailyScore}%</span>
                <span className="text-[9px] text-emerald-300 block">Optimal</span>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">সাপ্তাহিক স্বাস্থ্য</span>
                <span className="text-2xl font-black text-indigo-400 font-mono">{data.healthScore.weeklyScore}%</span>
                <span className="text-[9px] text-indigo-300 block">Stable</span>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">মাসিক স্বাস্থ্য</span>
                <span className="text-2xl font-black text-sky-400 font-mono">{data.healthScore.monthlyScore}%</span>
                <span className="text-[9px] text-sky-300 block">Strong</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-300 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              AI স্বাস্থ্য মূল্যায়ন (Executive Summary):
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              {data.healthScore.summary}
            </p>
          </div>
        </div>

        {/* 6 KPI Cards Grid */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          
          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">রাজস্ব প্রবৃদ্ধি (Revenue)</span>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
              +{data.kpis.revenueGrowthRate}%
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-[10px] text-slate-500 block">গত ৩০ দিনের সাপেক্ষে</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">খরচ প্রবণতা (Expense)</span>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
              {data.kpis.expenseTrendRate}%
              <ArrowDownRight className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-[10px] text-slate-500 block">৫.২% খরচ হ্রাস পেয়েছে</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">কালেকশন ট্রেন্ড</span>
            <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono flex items-center gap-1">
              +{data.kpis.collectionTrendRate}%
              <ArrowUpRight className="w-4 h-4 text-indigo-500" />
            </div>
            <span className="text-[10px] text-slate-500 block">ক্যাশ ও ডিজিটাল পেমেন্ট</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">মোট বকেয়া (Due Trend)</span>
            <div className="text-lg font-black text-rose-500 font-mono">
              ৳{data.kpis.dueTrendAmount.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 block">৩০ জন সদস্যের সমন্বিত</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">মেম্বার প্রবৃদ্ধি</span>
            <div className="text-lg font-black text-sky-600 dark:text-sky-400 font-mono">
              +{data.kpis.activeMemberGrowthCount}
            </div>
            <span className="text-[10px] text-slate-500 block">নতুন গাড়ি চালক নিবন্ধিত</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">প্রতিষ্ঠানের সংখ্যা</span>
            <div className="text-lg font-black text-purple-600 dark:text-purple-400 font-mono">
              {data.kpis.activeOrganizationGrowthCount} Orgs
            </div>
            <span className="text-[10px] text-slate-500 block">গ্লোবাল SaaS টেন্যান্টস</span>
          </div>

        </div>

      </div>

      {/* SECTION 2: PREDICTIVE ANALYTICS & FORECAST CHARTS */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              প্রেডিক্টিভ অ্যানালিটিক্স ও ৩০ দিনের ফোরকাস্ট (Predictive Forecasting)
            </h3>
            <p className="text-xs text-slate-500">
              মেশিন লার্নিং অলগরিদম দ্বারা পূর্বাভাসকৃত আগামী ৩০ দিনের কালেকশন, রিভিনিউ ও এক্সপেন্স গ্রাফ
            </p>
          </div>

          {/* Forecast Metric Cards */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 block font-sans">৩০ দিনের কালেকশন ফোরকাস্ট:</span>
              <span className="font-extrabold text-sm">৳{data.predictive.thirtyDayCollectionForecast.toLocaleString()}</span>
            </div>
            <div className="px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 block font-sans">আগামী মাসের আনুমানিক আয়:</span>
              <span className="font-extrabold text-sm">৳{data.predictive.revenueForecastNextMonth.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.predictive.forecastTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCollection" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="dateOrMonth" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="predictedRevenue" name="পূর্বাভাসকৃত আয় (Predicted Revenue)" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              <Area type="monotone" dataKey="predictedCollection" name="পূর্বাভাসকৃত কালেকশন (Predicted Collection)" stroke="#10b981" fillOpacity={1} fill="url(#colorCollection)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* SECTION 3: SMART INSIGHTS GRID */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              স্মার্ট ইনসাইটস (Smart Business Insights)
            </h3>
            <p className="text-xs text-slate-500">শীর্ষ আয়ের উৎস, সর্বোচ্চ খরচ খাত এবং উচ্চ বকেয়া বিশ্লেষণের সারাংশ</p>
          </div>
          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold rounded-xl">
            4 Key Insights
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.insights.map((item) => (
            <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    {item.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-mono ${
                    item.impactScore === 'HIGH' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {item.impactScore} IMPACT
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white mt-1">{item.title}</h4>
                <div className="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono">{item.metricValue}</div>
                <p className="text-[11px] text-slate-500">{item.subtitle}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span>{item.actionSuggested}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: SMART ALERTS & AI RECOMMENDATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Smart Alerts */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-rose-500 animate-bounce" />
              স্মার্ট রিয়েল-টাইম অ্যালার্ট (Smart Alerts)
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {data.smartAlerts.filter(a => !a.resolved).length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {data.smartAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-2xl border transition-all space-y-1.5 ${
                  alert.resolved
                    ? 'bg-slate-50 dark:bg-slate-950 opacity-50 border-slate-200 dark:border-slate-800'
                    : alert.severity === 'CRITICAL'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-100'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="flex items-center gap-1 font-mono uppercase">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {alert.severity}
                  </span>
                  <span className="text-slate-400 font-mono">{alert.timestamp}</span>
                </div>

                <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">{alert.title}</h5>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">{alert.message}</p>

                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="font-mono text-slate-400">{alert.organizationName}</span>
                  {!alert.resolved && (
                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                    >
                      সমস্যা সমাধান চিহ্নিত করুন
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              AI অ্যাকশনেবল পরামর্শসমূহ (Recommendations Engine)
            </h3>
            <span className="text-xs text-emerald-500 font-bold font-mono">
              +৳৪৫,০০০ সম্ভাব্য রিভিনিউ বৃদ্ধি
            </span>
          </div>

          <div className="space-y-3">
            {data.recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      {rec.type}
                    </span>
                    <span className="text-emerald-500 font-mono">
                      প্রভাব: {rec.estimatedRevenueImpact}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{rec.title}</h4>
                  <p className="text-[11px] text-slate-500 max-w-xl">{rec.description}</p>
                </div>

                <button
                  onClick={() => handleApplyRecommendation(rec.id)}
                  disabled={rec.applied}
                  className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                    rec.applied
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {rec.applied ? 'পরামর্শ কার্যকর করা হয়েছে' : 'পরামর্শ প্রয়োগ করুন'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
