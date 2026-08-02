import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  FileText, 
  ShieldCheck, 
  RefreshCw, 
  Sparkles, 
  Trophy 
} from 'lucide-react';
import { 
  ReportFilterState, 
  ReportType, 
  ReportSummaryStats, 
  CollectionTrendData, 
  CategoryBreakdownData, 
  PaymentMethodDistribution,
  TopPayingMember,
  TopCollectorPerformance,
  OrganizationBIStats,
  GrowthMetrics 
} from '../../types/reports';
import { ReportsService } from '../../services/reportsService';
import { ReportFilterHeader } from './ReportFilterHeader';
import { AnalyticsCards } from './AnalyticsCards';
import { InteractiveCharts } from './InteractiveCharts';
import { BusinessIntelligencePanel } from './BusinessIntelligencePanel';
import { ReportTableViewer } from './ReportTableViewer';

interface ReportsDashboardProps {
  tenantId?: string;
  tenantName?: string;
  actorName?: string;
  isSuperAdmin?: boolean;
}

export const ReportsDashboard: React.FC<ReportsDashboardProps> = ({
  tenantId = 'ALL',
  tenantName = 'আবাবিল ক্লাউড সাশ প্ল্যাটফর্ম',
  actorName = 'এডমিন ইউজার',
  isSuperAdmin = true
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'charts' | 'bi' | 'reports' | 'audit'>('analytics');
  
  // Filter State
  const [filter, setFilter] = useState<ReportFilterState>({
    reportType: 'daily_collection',
    datePreset: 'this_month',
    fromDate: '',
    toDate: '',
    tenantId: tenantId,
    branchName: 'ALL',
    employeeId: 'ALL',
    collectorName: 'ALL',
    memberId: 'ALL',
    vehicleNo: '',
    paymentMethod: 'ALL',
    status: 'ALL',
    searchQuery: ''
  });

  // Data States
  const [loading, setLoading] = useState<boolean>(true);
  const [summaryStats, setSummaryStats] = useState<ReportSummaryStats | null>(null);
  const [trendData, setTrendData] = useState<CollectionTrendData[]>([]);
  const [paymentDistribution, setPaymentDistribution] = useState<PaymentMethodDistribution[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<CategoryBreakdownData[]>([]);
  const [topMembers, setTopMembers] = useState<TopPayingMember[]>([]);
  const [topCollectors, setTopCollectors] = useState<TopCollectorPerformance[]>([]);
  const [orgStats, setOrgStats] = useState<OrganizationBIStats[]>([]);
  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetrics | null>(null);
  const [reportRecords, setReportRecords] = useState<any[]>([]);

  // Load Real-time Data
  const loadData = async () => {
    setLoading(true);
    try {
      const stats = await ReportsService.fetchSummaryStats(filter.tenantId);
      setSummaryStats(stats);

      const trends = await ReportsService.fetchCollectionTrends(filter);
      setTrendData(trends);

      const payments = await ReportsService.fetchPaymentMethodDistribution(filter.tenantId);
      setPaymentDistribution(payments);

      const expenses = await ReportsService.fetchExpenseCategoryBreakdown(filter.tenantId);
      setExpenseBreakdown(expenses);

      const members = await ReportsService.fetchTopPayingMembers(filter.tenantId);
      setTopMembers(members);

      const collectors = await ReportsService.fetchTopCollectors(filter.tenantId);
      setTopCollectors(collectors);

      const orgs = await ReportsService.fetchOrganizationBIStats();
      setOrgStats(orgs);

      const growth = await ReportsService.fetchGrowthMetrics(filter.tenantId);
      setGrowthMetrics(growth);

      const records = await ReportsService.fetchReportData(filter);
      setReportRecords(records);
    } catch (e) {
      console.error('Failed loading report data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filter.tenantId, filter.datePreset, filter.fromDate, filter.toDate, filter.reportType, filter.paymentMethod, filter.status]);

  const handleResetFilter = () => {
    setFilter({
      reportType: 'daily_collection',
      datePreset: 'this_month',
      fromDate: '',
      toDate: '',
      tenantId: 'ALL',
      branchName: 'ALL',
      employeeId: 'ALL',
      collectorName: 'ALL',
      memberId: 'ALL',
      vehicleNo: '',
      paymentMethod: 'ALL',
      status: 'ALL',
      searchQuery: ''
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" /> PROMPT-16 Enterprise BI Module
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            রিপোর্ট, এনালাইটিক্স & বিজনেজ ইন্টেলিজেন্স ড্যাশবোর্ড
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            রিয়েল-টাইম ফায়ারবেস ডেটা হতে ১৭+ রিপোর্ট, ইন্টারেক্টিভ রেট চার্টস, লিডারবোর্ড এবং অটোমেটেড PDF/Excel এক্সপোর্ট ইঞ্জিন।
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl border border-white/20 transition-all backdrop-blur-md shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          ডেটা রিফ্রেশ করুন
        </button>
      </div>

      {/* Global Filter Bar */}
      <ReportFilterHeader
        filter={filter}
        onFilterChange={setFilter}
        onReset={handleResetFilter}
      />

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          ১. ড্যাশবোর্ড এনালাইটিক্স (Analytics)
        </button>

        <button
          onClick={() => setActiveTab('charts')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === 'charts'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          ২. ইন্টারেক্টিভ চার্টস (Recharts)
        </button>

        <button
          onClick={() => setActiveTab('bi')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === 'bi'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          ৩. বিজনেজ ইন্টেলিজেন্স (BI)
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === 'reports'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          ৪. ১৭+ রিপোর্ট টেবিল & এক্সপোর্ট Engine
        </button>

        <button
          onClick={() => {
            setFilter({ ...filter, reportType: 'audit_log' });
            setActiveTab('audit');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === 'audit'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          ৫. অডিট লগ ট্রেইল (Audit Trail)
        </button>
      </div>

      {/* Tab 1: Dashboard Analytics Summary Cards */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {summaryStats && <AnalyticsCards stats={summaryStats} loading={loading} />}
          <InteractiveCharts
            trendData={trendData}
            paymentDistribution={paymentDistribution}
            expenseBreakdown={expenseBreakdown}
          />
        </div>
      )}

      {/* Tab 2: Interactive Recharts Visualizer */}
      {activeTab === 'charts' && (
        <InteractiveCharts
          trendData={trendData}
          paymentDistribution={paymentDistribution}
          expenseBreakdown={expenseBreakdown}
        />
      )}

      {/* Tab 3: Business Intelligence & Leaderboards */}
      {activeTab === 'bi' && growthMetrics && (
        <BusinessIntelligencePanel
          topMembers={topMembers}
          topCollectors={topCollectors}
          orgStats={orgStats}
          growth={growthMetrics}
          isSuperAdmin={isSuperAdmin}
        />
      )}

      {/* Tab 4: 17+ Multi-report Dynamic Viewer & PDF/Excel Export */}
      {(activeTab === 'reports' || activeTab === 'audit') && (
        <ReportTableViewer
          reportType={filter.reportType}
          filter={filter}
          records={reportRecords}
          loading={loading}
          tenantName={tenantName}
          actorName={actorName}
        />
      )}

    </div>
  );
};
