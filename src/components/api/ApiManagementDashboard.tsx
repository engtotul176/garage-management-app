import React, { useState, useEffect } from 'react';
import { Key, Activity, Smartphone, BookOpen, ShieldCheck, Cpu, RefreshCw, Server, ArrowUpRight } from 'lucide-react';
import { ApiKeyRecord, ApiLogRecord, MobileSessionRecord } from '../../types/apiBackend';
import { ApiBackendService } from '../../services/apiBackendService';
import { ApiKeyManager } from './ApiKeyManager';
import { ApiLogViewer } from './ApiLogViewer';
import { ApiUsageAnalytics } from './ApiUsageAnalytics';
import { SwaggerDocsViewer } from './SwaggerDocsViewer';

interface ApiManagementDashboardProps {
  tenantId?: string;
  actorName?: string;
}

export const ApiManagementDashboard: React.FC<ApiManagementDashboardProps> = ({
  tenantId = 'org_bismillah_001',
  actorName = 'Engineer Md. Tanveen Ahmed Tutul'
}) => {
  const [activeTab, setActiveTab] = useState<'KEYS' | 'LOGS' | 'USAGE' | 'DOCS'>('KEYS');
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [apiLogs, setApiLogs] = useState<ApiLogRecord[]>([]);
  const [mobileSessions, setMobileSessions] = useState<MobileSessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [keys, logs, sessions] = await Promise.all([
        ApiBackendService.getApiKeys(tenantId),
        ApiBackendService.getApiLogs(tenantId),
        ApiBackendService.getMobileSessions(tenantId)
      ]);
      setApiKeys(keys);
      setApiLogs(logs);
      setMobileSessions(sessions);
    } catch (e) {
      console.error('Error loading API backend telemetry:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const handleSessionRevoked = (sessionId: string) => {
    setMobileSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'REVOKED' } : s));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Server className="w-64 h-64 text-indigo-400" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold border border-indigo-500/30">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            Module 21: Enterprise REST API & Mobile Backend Layer
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            REST API & Mobile Backend Cluster
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Android App, iOS App, POS Desktop Terminal এবং Third-Party Integrations-এর জন্য সিকিউর ভার্সনড API Layer (<code className="text-emerald-400 font-mono font-bold">/api/v1/</code>)
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Gateway URL: <code className="text-emerald-400 font-bold">/api/v1/</code>
            </span>

            <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Firebase Auth & JWT Bearer
            </span>

            <button
              onClick={loadData}
              className="ml-auto px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all font-sans text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              সিঙ্ক ড্যাশবোর্ড
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('KEYS')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'KEYS' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Key className="w-4 h-4" />
          API Key Management ({apiKeys.length})
        </button>

        <button
          onClick={() => setActiveTab('LOGS')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'LOGS' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          Request Telemetry Logs ({apiLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('USAGE')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'USAGE' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Mobile Sessions & Usage
        </button>

        <button
          onClick={() => setActiveTab('DOCS')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'DOCS' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Swagger & Postman Docs
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'KEYS' && (
        <ApiKeyManager
          tenantId={tenantId}
          apiKeys={apiKeys}
          onKeysUpdated={loadData}
          actorName={actorName}
        />
      )}

      {activeTab === 'LOGS' && (
        <ApiLogViewer
          logs={apiLogs}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'USAGE' && (
        <ApiUsageAnalytics
          mobileSessions={mobileSessions}
          onSessionRevoked={handleSessionRevoked}
        />
      )}

      {activeTab === 'DOCS' && (
        <SwaggerDocsViewer />
      )}

    </div>
  );
};
