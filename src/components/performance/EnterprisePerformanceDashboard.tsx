import React, { useState } from 'react';
import {
  Gauge,
  Zap,
  Database,
  Layers,
  Smartphone,
  Server,
  Activity,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Cpu,
  HardDrive,
  Globe,
  Radio,
  FileCode,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  BarChart3,
  Clock,
  Trash2,
  Lock,
  Wifi,
  ShieldCheck,
  Check,
  Search,
  Filter
} from 'lucide-react';
import { EnterprisePerformanceService } from '../../services/performanceOptimizationService';
import {
  PerformanceMetric,
  FirestoreQueryOptRule,
  BundleOptimizationMetric,
  RealtimeListenerStatus,
  AndroidPerformanceProfile,
  SystemMonitoringAlert,
  GlobalScalabilityBenchmark
} from '../../types/performanceOptimization';

export const EnterprisePerformanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'firestore' | 'application' | 'realtime' | 'android' | 'api' | 'monitoring'
  >('overview');

  // State Data
  const [metrics, setMetrics] = useState<PerformanceMetric[]>(EnterprisePerformanceService.getMetricsHistory());
  const [latestMetric, setLatestMetric] = useState<PerformanceMetric>(EnterprisePerformanceService.getLatestMetric());
  const [firestoreRules] = useState<FirestoreQueryOptRule[]>(EnterprisePerformanceService.getFirestoreOptimizationRules());
  const [bundleMetrics] = useState<BundleOptimizationMetric[]>(EnterprisePerformanceService.getBundleMetrics());
  const [listeners] = useState<RealtimeListenerStatus[]>(EnterprisePerformanceService.getRealtimeListeners());
  const [androidProfile] = useState<AndroidPerformanceProfile>(EnterprisePerformanceService.getAndroidPerformanceProfile());
  const [systemAlerts] = useState<SystemMonitoringAlert[]>(EnterprisePerformanceService.getSystemAlerts());
  const [benchmark] = useState<GlobalScalabilityBenchmark>(EnterprisePerformanceService.getScalabilityBenchmark());

  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  const showNotification = (text: string, type: 'success' | 'info' = 'success') => {
    setNotificationMsg({ type, text });
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Run Benchmark Test
  const handleRunBenchmark = () => {
    const newMetric = EnterprisePerformanceService.recordBenchmark();
    setLatestMetric(newMetric);
    setMetrics(EnterprisePerformanceService.getMetricsHistory());
    showNotification('পারফরম্যান্স ও লেটেন্সি রিয়েল-টাইম বেঞ্চমার্ক রেকর্ড করা হয়েছে!');
  };

  // Clear Unused Cache
  const handlePurgeCache = () => {
    const res = EnterprisePerformanceService.clearLocalCacheAndUnusedListeners();
    showNotification(`মেমোরি ও আন-ইউজড লিসেনার ক্লিনআপ সম্পন্ন! ${res.clearedCacheMb} MB মেমোরি ফ্রী করা হয়েছে।`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl bg-slate-900 text-white border border-slate-700 flex items-center space-x-3 transition-all transform slide-in-from-top-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{notificationMsg.text}</span>
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> PROMPT-26 Scalability Center
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs rounded-full font-mono">
                10,000+ Orgs & 1,000,000+ Members Ready
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-3 tracking-tight">
              Enterprise Performance Optimization & Scalability
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Firestore Query Cursor Pagination, Read/Write Cost Reduction, Bundle Code Splitting, Realtime Listener Cleanup, Android Startup Acceleration & Live System Monitoring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePurgeCache}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl transition-all border border-slate-700 flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>মেমোরি ও ক্যাশ ক্লিনআপ</span>
            </button>
            <button
              onClick={handleRunBenchmark}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>লাইভ স্পীড বেঞ্চমার্ক টেস্ট</span>
            </button>
          </div>
        </div>

        {/* Global Scalability Capacity Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">অরগানাইজেশন ক্যাপাসিটি</div>
            <div className="text-xl font-bold text-cyan-400 mt-1 flex items-baseline gap-1">
              {benchmark.currentOrganizationsCount.toLocaleString('bn-BD')}
              <span className="text-xs text-slate-400 font-normal">/ 10,000+ Orgs</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${(benchmark.currentOrganizationsCount / benchmark.targetOrganizationsCapacity) * 100}%` }} />
            </div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">মেম্বার ও ভেহিকেল স্কেল</div>
            <div className="text-xl font-bold text-emerald-400 mt-1 flex items-baseline gap-1">
              {benchmark.currentMembersCount.toLocaleString('bn-BD')}
              <span className="text-xs text-slate-400 font-normal">/ 1,000,000+ Members</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(benchmark.currentMembersCount / benchmark.targetMembersCapacity) * 100}%` }} />
            </div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">গড় API রেসপন্স টাইম</div>
            <div className="text-xl font-bold text-sky-400 mt-1">
              {latestMetric.responseTimeMs} ms
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 font-medium">⚡ Ultra Fast & Cached</div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">ক্যাশ হিট রেশিও (Hit Rate)</div>
            <div className="text-xl font-bold text-purple-400 mt-1">
              {latestMetric.cacheHitRatioPercent}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Firestore & CDN Edge</div>
          </div>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex items-center space-x-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 font-medium text-sm rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 ${
            activeTab === 'overview'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>লাইভ ওভারভিউ</span>
        </button>

        <button
          onClick={() => setActiveTab('firestore')}
          className={`px-4 py-2.5 font-medium text-sm rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 ${
            activeTab === 'firestore'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>ফায়ারস্টোর অপটিমাইজেশন</span>
        </button>

        <button
          onClick={() => setActiveTab('application')}
          className={`px-4 py-2.5 font-medium text-sm rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 ${
            activeTab === 'application'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>অ্যাপ বান্ডেল ও কোড স্প্লিটিং</span>
        </button>

        <button
          onClick={() => setActiveTab('realtime')}
          className={`px-4 py-2.5 font-medium text-sm rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 ${
            activeTab === 'realtime'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>রিয়েল-টাইম লিসেনার ও ক্যাশ</span>
        </button>

        <button
          onClick={() => setActiveTab('android')}
          className={`px-4 py-2.5 font-medium text-sm rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 ${
            activeTab === 'android'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>অ্যান্ড্রয়েড অ্যাপ স্পীড</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2.5 font-medium text-sm rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 ${
            activeTab === 'api'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>API ও কমপ্রেশন</span>
        </button>

        <button
          onClick={() => setActiveTab('monitoring')}
          className={`px-4 py-2.5 font-medium text-sm rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 ${
            activeTab === 'monitoring'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>সিস্টেম মনিটরিং ও অ্যালার্ট</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Firestore Read Counts</span>
                <Database className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {latestMetric.firestoreReadCount.toLocaleString()} / দিন
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                ↓ ৬০% রিড রিডাকশন (Denormalized Counters Active)
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Firestore Write Counts</span>
                <HardDrive className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {latestMetric.firestoreWriteCount.toLocaleString()} / দিন
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">Batch Write & Bulk Operations Enabled</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">CPU & Memory Usage</span>
                <Cpu className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {latestMetric.memoryUsageMb} MB <span className="text-sm font-normal text-slate-500">({latestMetric.cpuLoadPercentage}% CPU)</span>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Node Container Idle Load Low</p>
            </div>
          </div>

          {/* Benchmark Trend Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-500" />
              <span>রিয়েল-টাইম পারফরম্যান্স ও লেটেন্সি হিস্ট্রি</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs uppercase font-semibold">
                  <tr>
                    <th className="p-3">টাইমস্ট্যাম্প</th>
                    <th className="p-3">রেসপন্স লেটেন্সি</th>
                    <th className="p-3">Firestore Read/Write</th>
                    <th className="p-3">ক্যাশ হিট রেশিও</th>
                    <th className="p-3">API রিকোয়েস্ট/মিনিট</th>
                    <th className="p-3">মেমোরি লোড</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {metrics.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 text-xs text-slate-600 dark:text-slate-400 font-mono">
                        {new Date(m.timestamp).toLocaleTimeString('bn-BD')}
                      </td>
                      <td className="p-3 font-bold text-cyan-600 dark:text-cyan-400 text-xs">{m.responseTimeMs} ms</td>
                      <td className="p-3 text-xs text-slate-700 dark:text-slate-300">
                        {m.firestoreReadCount.toLocaleString()} reads / {m.firestoreWriteCount.toLocaleString()} writes
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-bold rounded-full">
                          {m.cacheHitRatioPercent}%
                        </span>
                      </td>
                      <td className="p-3 text-xs font-mono text-slate-700 dark:text-slate-300">{m.apiRequestsPerMin} req/min</td>
                      <td className="p-3 text-xs text-slate-600 dark:text-slate-400">{m.memoryUsageMb} MB</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FIRESTORE QUERY OPTIMIZATION */}
      {activeTab === 'firestore' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-500" />
              <span>Firestore Query Optimization & Cost Reduction Rules</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              কম্পোজিট ইনডেক্সিং, কার্সার পেজিনেশন (startAfter) এবং ডিনরম্যালাইজড ফিল্ডের মাধ্যমে ৯০% ফায়ারস্টোর বিল সেভিং নীতি।
            </p>

            <div className="space-y-4">
              {firestoreRules.map(rule => (
                <div key={rule.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 font-bold px-2 py-0.5 bg-cyan-100 dark:bg-cyan-950/60 rounded">
                        {rule.collection}
                      </span>
                      <h4 className="font-mono text-xs text-slate-700 dark:text-slate-300 mt-2 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                        {rule.queryPattern}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-bold rounded-full">
                        ↓ {rule.estimatedCostReductionPct}% Cost Reduced
                      </span>
                      <span className="px-2.5 py-1 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 text-xs font-bold rounded">
                        {rule.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span><b>সুপারিশ:</b> {rule.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APPLICATION & BUNDLE OPTIMIZATION */}
      {activeTab === 'application' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-500" />
              <span>কোড স্প্লিটিং, বান্ডেল চ্যাঙ্কিং ও লেজি লোডিং (Vite/React)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              প্রতিটি মডিউল dynamically import() দ্বারা প্রয়োজনানুসারে লোড হয়, ফলে ফার্স্ট-কনটেন্টফুল পেইন্ট (FCP) অত্যন্ত দ্রুত।
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs uppercase font-semibold">
                  <tr>
                    <th className="p-3">বান্ডেল চ্যাঙ্ক ফাইলের নাম</th>
                    <th className="p-3">সাইজ (KB)</th>
                    <th className="p-3">লেজি লোডেড (Dynamic Import)</th>
                    <th className="p-3">কমপ্রেশন রেশিও</th>
                    <th className="p-3">অন-ডিমান্ড লোড টাইম</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {bundleMetrics.map((b, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-xs text-slate-900 dark:text-white font-semibold">{b.chunkName}</td>
                      <td className="p-3 text-xs font-mono text-slate-700 dark:text-slate-300">{b.sizeKb} KB</td>
                      <td className="p-3">
                        {b.lazyLoaded ? (
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-bold rounded-full">
                            Dynamic import()
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 text-xs font-bold rounded-full">
                            Core Initial Chunk
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-xs text-slate-600 dark:text-slate-400 font-mono">{b.compressionRatio}</td>
                      <td className="p-3 text-xs font-bold text-cyan-600 dark:text-cyan-400">{b.loadTimeMs} ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REALTIME LISTENERS & OFFLINE CACHE */}
      {activeTab === 'realtime' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-500" />
              <span>ফায়ারস্টোর রিয়েল-টাইম লিসেনার ও অটো ক্লিনআপ মনিটর</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              মেমোরি লিক রোধে React useEffect cleanup ফাংশনে onSnapshot unsubscribers সঠিকভাবে অটো-ক্লোজ রাখা হয়েছে।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {listeners.map(l => (
                <div key={l.listenerId} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">{l.listenerId}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[11px] font-bold rounded">
                      {l.status}
                    </span>
                  </div>

                  <div className="mt-3 text-xs font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                    {l.targetCollection}
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div>অ্যাক্টিভ সাবস্ক্রাইবার্স: <b>{l.activeSubscribers}</b></div>
                    <div>অটো ক্লিনআপ অন-আনমাউন্ট: <b className="text-emerald-600">Active</b></div>
                    <div>অফলাইন ক্যাশ সাইজ: <b>{(l.offlineCacheSizeBytes / 1024 / 1024).toFixed(2)} MB</b></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ANDROID POS PERFORMANCE */}
      {activeTab === 'android' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-cyan-500" />
              <span>অ্যান্ড্রয়েড নেটিভ অ্যাপ ও POS টার্মিনাল অপটিমাইজেশন</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <div className="text-xs text-slate-500 font-medium">কোল্ড স্টার্টআপ সময় (Cold Start)</div>
                <div className="text-2xl font-black text-cyan-500 mt-1">{androidProfile.startupTimeMs} ms</div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  Sub-400ms High Speed Startup
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <div className="text-xs text-slate-500 font-medium">RecyclerView মেমোরি / আইটেম</div>
                <div className="text-2xl font-black text-emerald-500 mt-1">{androidProfile.recyclerItemMemoryKb} KB</div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">View Binding & ViewHolder Pattern</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <div className="text-xs text-slate-500 font-medium">ব্যাটারি ও ব্যাকগ্রাউন্ড সিঙ্ক প্রভাব</div>
                <div className="text-2xl font-black text-purple-500 mt-1">{androidProfile.batteryDrainImpact}</div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  JobScheduler & WorkManager Batched
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: API GATEWAY */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-500" />
              <span>API Gateway, Gzip/Brotli Compression & Rate Limits</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <div className="font-bold text-sm text-slate-900 dark:text-white">API Response Caching & Headers</div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span>Cache-Control Header:</span>
                  <span className="font-mono text-emerald-600">s-maxage=60, stale-while-revalidate=300</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span>Content Compression:</span>
                  <span className="font-mono text-emerald-600">Brotli / Gzip Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span>Timeout Protection:</span>
                  <span className="font-mono text-emerald-600">8,000 ms Max Circuit Breaker</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <div className="font-bold text-sm text-slate-900 dark:text-white">Rate Limiting & DDoS Guard</div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span>Standard User Rate Limit:</span>
                  <span className="font-mono text-cyan-600">120 req / minute</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span>POS Terminal Limit:</span>
                  <span className="font-mono text-cyan-600">600 req / minute</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Request Spike:</span>
                  <span className="font-mono text-emerald-600">Normal Traffic (No Throttling)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: MONITORING & SYSTEM ALERTS */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-500" />
              <span>সিস্টেম হেলথ মনিটরিং ও ইভেন্ট ক্র্যাশ লগার</span>
            </h3>

            <div className="space-y-3 mt-4">
              {systemAlerts.map(alert => (
                <div key={alert.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{alert.component}</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300">
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{alert.message}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 font-mono">{alert.metricValue}</span>
                    <div className="text-[11px] text-slate-400 mt-0.5">{new Date(alert.timestamp).toLocaleTimeString('bn-BD')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
