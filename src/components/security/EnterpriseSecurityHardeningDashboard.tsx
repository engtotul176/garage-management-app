import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Lock,
  UserCheck,
  FileKey,
  Activity,
  Eye,
  Server,
  Globe,
  FileText,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Download,
  RefreshCw,
  Clock,
  Smartphone,
  Search,
  Sliders,
  Check,
  X,
  Layers,
  Database,
  Terminal,
  LogOut,
  Zap,
  CheckSquare,
  Sparkles,
  Info
} from 'lucide-react';
import { EnterpriseSecurityService } from '../../services/enterpriseSecurityService';
import {
  SecurityHealthScore,
  AuthSecurityConfig,
  ActiveSession,
  LoginHistoryEntry,
  PasswordPolicyConfig,
  RbacRoleMatrix,
  SecurityAuditLog,
  AppSecurityConfig,
  CompliancePolicy,
  FirestoreSecurityAuditItem
} from '../../types/enterpriseSecurity';

export const EnterpriseSecurityHardeningDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    'health' | 'auth_sessions' | 'password_policy' | 'rbac' | 'firestore' | 'app_sec' | 'audit_logs' | 'compliance'
  >('health');

  // State
  const [healthScore, setHealthScore] = useState<SecurityHealthScore>(EnterpriseSecurityService.runSecurityScan());
  const [authConfig, setAuthConfig] = useState<AuthSecurityConfig>(EnterpriseSecurityService.getAuthConfig());
  const [sessions, setSessions] = useState<ActiveSession[]>(EnterpriseSecurityService.getActiveSessions());
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicyConfig>(EnterpriseSecurityService.getPasswordPolicy());
  const [appSecurity, setAppSecurity] = useState<AppSecurityConfig>(EnterpriseSecurityService.getAppSecurityConfig());
  const [compliance, setCompliance] = useState<CompliancePolicy>(EnterpriseSecurityService.getCompliancePolicy());
  const [loginLogs, setLoginLogs] = useState<LoginHistoryEntry[]>(EnterpriseSecurityService.getLoginLogs());
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(EnterpriseSecurityService.getAuditLogs());
  const [rbacMatrix] = useState<RbacRoleMatrix[]>(EnterpriseSecurityService.getRbacMatrix());
  const [firestoreAudits] = useState<FirestoreSecurityAuditItem[]>(EnterpriseSecurityService.getFirestoreRulesAudit());

  // Tester states
  const [testPasswordInput, setTestPasswordInput] = useState('');
  const [testPasswordResult, setTestPasswordResult] = useState<{ isValid: boolean; errors: string[] } | null>(null);

  const [testSanitizerInput, setTestSanitizerInput] = useState('<script>alert("XSS Attack!")</script> <b>Hello</b>');
  const [sanitizedOutput, setSanitizedOutput] = useState('');

  const [logFilterSeverity, setLogFilterSeverity] = useState<string>('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotificationMsg({ type, text });
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Run initial scan
  const handleRunSecurityScan = () => {
    const scan = EnterpriseSecurityService.runSecurityScan();
    setHealthScore(scan);
    showNotification('সিকিউরিটি স্ক্যান সম্পূর্ণ হয়েছে! স্বাস্থ্য স্কোর আপডেট করা হয়েছে।');
  };

  // Auth config submit
  const handleSaveAuthConfig = (e: React.FormEvent) => {
    e.preventDefault();
    EnterpriseSecurityService.saveAuthConfig(authConfig);
    setHealthScore(EnterpriseSecurityService.runSecurityScan());
    showNotification('অথেন্টিকেশন সিকিউরিটি সেটিংস সফলভাবে সংরক্ষিত হয়েছে।');
  };

  // Password policy submit
  const handleSavePasswordPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    EnterpriseSecurityService.savePasswordPolicy(passwordPolicy);
    setHealthScore(EnterpriseSecurityService.runSecurityScan());
    showNotification('পাসওয়ার্ড পলিসি ও লকআউট রুলস আপডেট করা হয়েছে।');
  };

  // App security submit
  const handleSaveAppSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    EnterpriseSecurityService.saveAppSecurityConfig(appSecurity);
    setHealthScore(EnterpriseSecurityService.runSecurityScan());
    showNotification('অ্যাপ্লিকেশন সিকিউরিটি সেটিংস ও ফিল্টার আপডেট করা হয়েছে।');
  };

  // Compliance submit
  const handleSaveCompliance = (e: React.FormEvent) => {
    e.preventDefault();
    EnterpriseSecurityService.saveCompliancePolicy(compliance);
    setHealthScore(EnterpriseSecurityService.runSecurityScan());
    showNotification('কমপ্লায়েন্স ও ডেটা রিটেনশন নীতিমালা আপডেট করা হয়েছে।');
  };

  // Session terminate
  const handleTerminateSession = (sessionId: string) => {
    const updated = EnterpriseSecurityService.terminateSession(sessionId);
    setSessions(updated);
    showNotification(`সেসন ID: ${sessionId} টার্মিনেট করা হয়েছে।`);
  };

  const handleTerminateOtherSessions = () => {
    const curr = sessions.find(s => s.isCurrentDevice);
    if (!curr) return;
    const updated = EnterpriseSecurityService.terminateOtherSessions(curr.id);
    setSessions(updated);
    showNotification('অন্যান্য সকল ডিভাইসের সেসন ফোর্সড লগআউট করা হয়েছে।', 'error');
  };

  // Test password evaluator
  const handleTestPassword = (pwd: string) => {
    setTestPasswordInput(pwd);
    if (!pwd) {
      setTestPasswordResult(null);
      return;
    }
    const res = EnterpriseSecurityService.validatePasswordStrength(pwd);
    setTestPasswordResult(res);
  };

  // Test sanitizer evaluator
  const handleTestSanitizer = (val: string) => {
    setTestSanitizerInput(val);
    const clean = EnterpriseSecurityService.sanitizeInput(val);
    setSanitizedOutput(clean);
  };

  // Purge retention logs
  const handlePurgeLogs = () => {
    const result = EnterpriseSecurityService.executeDataRetentionPurge();
    setLoginLogs(EnterpriseSecurityService.getLoginLogs());
    setAuditLogs(EnterpriseSecurityService.getAuditLogs());
    showNotification(`ডেটা রিটেনশন পলিসি অনুযায়ী ${result.purgedRecordsCount} টি পুরাতন লগ মুছে ফেলা হয়েছে।`);
  };

  // Export audit log
  const handleExportAuditLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `security_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('সিকিউরিটি অডিট লগ ফাইল সফলভাবে ডাউনলোড হয়েছে।');
  };

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSeverity = logFilterSeverity === 'ALL' || log.severity === logFilterSeverity;
    const matchesSearch =
      log.actorEmail.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(logSearchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notificationMsg && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl flex items-center space-x-3 border transition-all transform slide-in-from-top-2 ${
            notificationMsg.type === 'success'
              ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700'
              : 'bg-rose-900/90 text-rose-100 border-rose-700'
          }`}
        >
          {notificationMsg.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="text-sm font-medium">{notificationMsg.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> PROMPT-25 Enterprise Hardening
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs rounded-full font-mono">
                Production-Level Security
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-3 tracking-tight">
              Enterprise Security & Compliance Center
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Firebase Auth Hardening, Session Management, RBAC Verification, Firestore Multi-Tenant Rules Audit, Input Sanitization, Audit Logs & Compliance Framework.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunSecurityScan}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>ইন্সট্যান্ট সিকিউরিটি স্ক্যান</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">সিকিউরিটি হেলথ স্কোর</div>
            <div className="text-2xl font-black text-emerald-400 mt-1 flex items-baseline gap-1">
              {healthScore.score}
              <span className="text-xs text-slate-400 font-normal">/100</span>
            </div>
            <div className="text-[11px] text-emerald-300 font-semibold mt-0.5">{healthScore.status} STATUS</div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">অ্যাক্টিভ সেসন ডিভাইস</div>
            <div className="text-2xl font-black text-sky-400 mt-1">{sessions.filter(s => s.status === 'ACTIVE').length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">মুল্টি-ডিভাইস ট্র্যাকিং অন</div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">ফায়ারস্টোর সিকিউরিটি স্টেট</div>
            <div className="text-2xl font-black text-amber-400 mt-1">100%</div>
            <div className="text-[11px] text-amber-300 font-semibold mt-0.5">ডিফল্ট ডিনাই + টেন্যান্ট গার্ড</div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">অডিট ও সিকিউরিটি লগ</div>
            <div className="text-2xl font-black text-indigo-400 mt-1">{auditLogs.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">GDPR/CCPA কমপ্লায়েন্ট</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('health')}
          className={`px-4 py-2.5 font-medium text-sm rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 ${
            activeSubTab === 'health'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>স্কোরকার্ড ও স্ক্যানার</span>
        </button>

        <button
          onClick={() => setActiveSubTab('auth_sessions')}
          className={`px-4 py-2.5 font-medium text-sm rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 ${
            activeSubTab === 'auth_sessions'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>অথেন্টিকেশন ও সেসন</span>
        </button>

        <button
          onClick={() => setActiveSubTab('password_policy')}
          className={`px-4 py-2.5 font-medium text-sm rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 ${
            activeSubTab === 'password_policy'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>পাসওয়ার্ড পলিসি ও লকআউট</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rbac')}
          className={`px-4 py-2.5 font-medium text-sm rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 ${
            activeSubTab === 'rbac'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>RBAC ও টেন্যান্ট গার্ড</span>
        </button>

        <button
          onClick={() => setActiveSubTab('firestore')}
          className={`px-4 py-2.5 font-medium text-sm rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 ${
            activeSubTab === 'firestore'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>ফায়ারস্টোর সিকিউরিটি</span>
        </button>

        <button
          onClick={() => setActiveSubTab('app_sec')}
          className={`px-4 py-2.5 font-medium text-sm rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 ${
            activeSubTab === 'app_sec'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>অ্যাপ সিকিউরিটি ও XSS</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit_logs')}
          className={`px-4 py-2.5 font-medium text-sm rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 ${
            activeSubTab === 'audit_logs'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>অডিট ও সিকিউরিটি লগ</span>
        </button>

        <button
          onClick={() => setActiveSubTab('compliance')}
          className={`px-4 py-2.5 font-medium text-sm rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 ${
            activeSubTab === 'compliance'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>কমপ্লায়েন্স ও প্রাইভেসি</span>
        </button>
      </div>

      {/* TAB 1: SECURITY HEALTH SCORECARD */}
      {activeSubTab === 'health' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-rose-500" />
                  <span>গ্লোবাল সিকিউরিটি হেলথ চেক সামারি</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  সর্বশেষ স্ক্যানিং সময়: {new Date(healthScore.lastScannedAt).toLocaleString('bn-BD')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-semibold rounded-full">
                  {healthScore.passedChecks} পাসড চেক
                </span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-xs font-semibold rounded-full">
                  {healthScore.warningsCount} সতর্কতা
                </span>
                <span className="px-3 py-1 bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 text-xs font-semibold rounded-full">
                  {healthScore.failedChecks} ফেইলড
                </span>
              </div>
            </div>

            {/* Check List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {healthScore.checks.map(check => (
                <div
                  key={check.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start space-x-3"
                >
                  <div className="mt-0.5">
                    {check.status === 'PASS' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                    {check.status === 'WARN' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                    {check.status === 'FAIL' && <X className="w-5 h-5 text-rose-500" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{check.title}</h4>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {check.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{check.details}</p>

                    {check.status !== 'PASS' && check.remediation && (
                      <div className="mt-2 text-[11px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded border border-rose-200 dark:border-rose-900/50 font-medium">
                        💡 সমাধান: {check.remediation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUTHENTICATION & SESSION MANAGEMENT */}
      {activeSubTab === 'auth_sessions' && (
        <div className="space-y-6">
          {/* Auth Config Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-rose-500" />
              <span>ফায়ারবেস অথেন্টিকেশন ও সেসন কনফিগারেশন</span>
            </h3>

            <form onSubmit={handleSaveAuthConfig} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-4">
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">অথেন্টিকেশন পলিসি কন্ট্রোল</div>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-700 dark:text-slate-300">মাল্টি-ফ্যাক্টর অথেন্টিকেশন (MFA) বাধ্যতামালুক</span>
                  <input
                    type="checkbox"
                    checked={authConfig.enableMultiFactorAuth}
                    onChange={e => setAuthConfig({ ...authConfig, enableMultiFactorAuth: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-700 dark:text-slate-300">ইমেইল ভেরিফিকেশন বাধ্যতামালুক (Verified Email Only)</span>
                  <input
                    type="checkbox"
                    checked={authConfig.requireEmailVerification}
                    onChange={e => setAuthConfig({ ...authConfig, requireEmailVerification: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-700 dark:text-slate-300">অ্যানোনিমাস ও গ্যাস্ট এক্সেস সম্পূর্ণ ব্লক</span>
                  <input
                    type="checkbox"
                    checked={authConfig.blockAnonymousAccess}
                    onChange={e => setAuthConfig({ ...authConfig, blockAnonymousAccess: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-700 dark:text-slate-300">ডিভাইস আইপি ও জিও-লোকেশন ট্র্যাকিং</span>
                  <input
                    type="checkbox"
                    checked={authConfig.trackDeviceLocation}
                    onChange={e => setAuthConfig({ ...authConfig, trackDeviceLocation: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </label>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-4">
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">সেসন মেয়াদ ও অটো-লগআউট</div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">সেসন মেয়াদকাল (Session Timeout Minutes)</label>
                  <input
                    type="number"
                    value={authConfig.sessionTimeoutMinutes}
                    onChange={e => setAuthConfig({ ...authConfig, sessionTimeoutMinutes: Number(e.target.value) })}
                    className="mt-1 w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">আইডল ইনঅ্যাক্টিভিটি অটো-লগআউট (Idle Threshold Minutes)</label>
                  <input
                    type="number"
                    value={authConfig.idleThresholdMinutes}
                    onChange={e => setAuthConfig({ ...authConfig, idleThresholdMinutes: Number(e.target.value) })}
                    className="mt-1 w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">সর্বোচ্চ কনকারেন্ট অ্যাক্টিভ ডিভাইস সেসন (Max Sessions Per User)</label>
                  <input
                    type="number"
                    value={authConfig.maxConcurrentSessionsPerUser}
                    onChange={e => setAuthConfig({ ...authConfig, maxConcurrentSessionsPerUser: Number(e.target.value) })}
                    className="mt-1 w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm rounded-xl transition-all shadow-md"
                >
                  অথেন্টিকেশন সেটিংস সেভ করুন
                </button>
              </div>
            </form>
          </div>

          {/* Active Sessions Control */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-rose-500" />
                  <span>অ্যাক্টিভ ডিভাইস সেসন ও কন্ট্রোল (Multi-Device Control)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ব্যবহারকারীদের সংযুক্ত ডিভাইসসমূহ পর্যবেক্ষণ এবং অনাকাঙ্ক্ষিত সেসন টার্মিনেট করুন।
                </p>
              </div>

              <button
                onClick={handleTerminateOtherSessions}
                className="px-3.5 py-2 bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 hover:bg-rose-200 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>অন্যান্য সকল ডিভাইস ফোর্সড লগআউট</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs uppercase font-semibold">
                  <tr>
                    <th className="p-3">ইউজার ও ইমেইল</th>
                    <th className="p-3">ডিভাইস ও ব্রাউজার</th>
                    <th className="p-3">আইপি ও লোকেশন</th>
                    <th className="p-3">লগইন ও লাস্ট অ্যাক্টিভ</th>
                    <th className="p-3">স্ট্যাটাস</th>
                    <th className="p-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {sessions.map(sess => (
                    <tr key={sess.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3">
                        <div className="font-semibold text-slate-900 dark:text-white">{sess.userName}</div>
                        <div className="text-xs text-slate-500">{sess.userEmail}</div>
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">
                        <div className="font-medium text-xs">{sess.device}</div>
                        <div className="text-[11px] text-slate-400">{sess.browser}</div>
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">
                        <div className="font-mono text-xs">{sess.ipAddress}</div>
                        <div className="text-[11px] text-slate-400">{sess.location}</div>
                      </td>
                      <td className="p-3 text-xs text-slate-600 dark:text-slate-400">
                        <div>লগইন: {new Date(sess.loginTime).toLocaleTimeString('bn-BD')}</div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          এক্টিভিটি: {new Date(sess.lastActiveTime).toLocaleTimeString('bn-BD')}
                        </div>
                      </td>
                      <td className="p-3">
                        {sess.status === 'ACTIVE' ? (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[11px] font-bold rounded-full">
                            {sess.isCurrentDevice ? 'বর্তমান ডিভাইস' : 'অনলাইন সেসন'}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 text-[11px] font-bold rounded-full">
                            টার্মিনেটেড
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {sess.status === 'ACTIVE' && !sess.isCurrentDevice && (
                          <button
                            onClick={() => handleTerminateSession(sess.id)}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-lg transition-all"
                          >
                            টার্মিনেট সেসন
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PASSWORD POLICY & LOCKOUT */}
      {activeSubTab === 'password_policy' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-rose-500" />
              <span>পাসওয়ার্ড পলিসি ও একাউন্ট লকআউট রুলস</span>
            </h3>

            <form onSubmit={handleSavePasswordPolicy} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-4">
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">পাসওয়ার্ড জটিলতা (Password Complexity)</div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">নূন্যতম পাসওয়ার্ড দৈর্ঘ্য (Minimum Length)</label>
                  <input
                    type="number"
                    value={passwordPolicy.minLength}
                    onChange={e => setPasswordPolicy({ ...passwordPolicy, minLength: Number(e.target.value) })}
                    className="mt-1 w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-700 dark:text-slate-300">বড় হাতের অক্ষর আবশ্যক (A-Z)</span>
                  <input
                    type="checkbox"
                    checked={passwordPolicy.requireUppercase}
                    onChange={e => setPasswordPolicy({ ...passwordPolicy, requireUppercase: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-700 dark:text-slate-300">ছোট হাতের অক্ষর আবশ্যক (a-z)</span>
                  <input
                    type="checkbox"
                    checked={passwordPolicy.requireLowercase}
                    onChange={e => setPasswordPolicy({ ...passwordPolicy, requireLowercase: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-700 dark:text-slate-300">সংখ্যা আবশ্যক (0-9)</span>
                  <input
                    type="checkbox"
                    checked={passwordPolicy.requireNumbers}
                    onChange={e => setPasswordPolicy({ ...passwordPolicy, requireNumbers: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-700 dark:text-slate-300">বিশেষ চিহ্ন আবশ্যক (!@#$%^&*)</span>
                  <input
                    type="checkbox"
                    checked={passwordPolicy.requireSpecialChar}
                    onChange={e => setPasswordPolicy({ ...passwordPolicy, requireSpecialChar: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </label>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-4">
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">মেয়াদ, হিস্ট্রি ও লকআউট সেটিং</div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">পাসওয়ার্ড এক্সপায়ারি মেয়াদ (Password Expiry Days)</label>
                  <input
                    type="number"
                    value={passwordPolicy.passwordExpiryDays}
                    onChange={e => setPasswordPolicy({ ...passwordPolicy, passwordExpiryDays: Number(e.target.value) })}
                    className="mt-1 w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                  />
                  <span className="text-[11px] text-slate-400">০ দিলে পাসওয়ার্ড এক্সপায়ারি নিষ্ক্রিয় থাকবে।</span>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">পাসওয়ার্ড পুনঃব্যবহার রোধ (Password History Limit)</label>
                  <input
                    type="number"
                    value={passwordPolicy.enforcePasswordHistoryCount}
                    onChange={e => setPasswordPolicy({ ...passwordPolicy, enforcePasswordHistoryCount: Number(e.target.value) })}
                    className="mt-1 w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                  />
                  <span className="text-[11px] text-slate-400">সর্বশেষ ব্যবহৃত N টি পাসওয়ার্ড পুনরায় ব্যবহার করতে পারবে না।</span>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">ব্যর্থ লগইন লকআউট লিমিট (Max Failed Attempts Before Lockout)</label>
                  <input
                    type="number"
                    value={passwordPolicy.maxFailedAttemptsBeforeLockout}
                    onChange={e => setPasswordPolicy({ ...passwordPolicy, maxFailedAttemptsBeforeLockout: Number(e.target.value) })}
                    className="mt-1 w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">লকআউট সময়কাল (Lockout Duration Minutes)</label>
                  <input
                    type="number"
                    value={passwordPolicy.lockoutDurationMinutes}
                    onChange={e => setPasswordPolicy({ ...passwordPolicy, lockoutDurationMinutes: Number(e.target.value) })}
                    className="mt-1 w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm rounded-xl transition-all shadow-md"
                >
                  পাসওয়ার্ড পলিসি সেভ করুন
                </button>
              </div>
            </form>
          </div>

          {/* Password Strength Tester */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-md font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-rose-500" />
              <span>লাইভ পাসওয়ার্ড পলিসি ভ্যালিডেটর টেস্টার (Password Rule Tester)</span>
            </h3>

            <div className="max-w-xl space-y-3">
              <input
                type="text"
                placeholder="পরীক্ষা করার জন্য পাসওয়ার্ড লিখুন (e.g. Admin@2026#Strong)..."
                value={testPasswordInput}
                onChange={e => handleTestPassword(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono"
              />

              {testPasswordResult && (
                <div
                  className={`p-4 rounded-xl border ${
                    testPasswordResult.isValid
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  <div className="font-bold text-sm flex items-center gap-2">
                    {testPasswordResult.isValid ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-rose-600" />}
                    <span>{testPasswordResult.isValid ? 'পাসওয়ার্ড শক্তিশালী এবং পলিসি মেনে চলে!' : 'পাসওয়ার্ড দুর্বল বা পলিসি ভঙ্গ করেছে!'}</span>
                  </div>

                  {!testPasswordResult.isValid && (
                    <ul className="mt-2 text-xs space-y-1 list-disc list-inside">
                      {testPasswordResult.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RBAC & MULTI-TENANT ISOLATION */}
      {activeSubTab === 'rbac' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-rose-500" />
              <span>Role-Based Access Control (RBAC) & Permission Matrix</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              SaaS প্ল্যাটফর্মের সকল রোল ও পারমিশন ম্যাট্রিক্স রিভিউ এবং টেন্যান্ট ডেটা আইসোলেশন ভ্যালিডেশন।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rbacMatrix.map(roleItem => (
                <div
                  key={roleItem.role}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">{roleItem.displayName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{roleItem.description}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold rounded">
                      {roleItem.role}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {roleItem.permissions.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{p.module}</span>
                        <div className="flex items-center space-x-2 text-[11px]">
                          <span className={`px-2 py-0.5 rounded ${p.canRead ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>Read</span>
                          <span className={`px-2 py-0.5 rounded ${p.canWrite ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>Write</span>
                          <span className={`px-2 py-0.5 rounded ${p.canDelete ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-400'}`}>Delete</span>
                          <span className={`px-2 py-0.5 rounded ${p.canAdmin ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-400'}`}>Admin</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FIRESTORE SECURITY RULES */}
      {activeSubTab === 'firestore' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-rose-500" />
              <span>ফায়ারস্টোর সিকিউরিটি রুলস অডিট ও কালেকশন পারমিশন</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Firestore Security Rules Analysis: Default Deny, Collection Access Boundaries and Organization Isolation.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs uppercase font-semibold">
                  <tr>
                    <th className="p-3">কালেকশন পাথ</th>
                    <th className="p-3">রীড (Read) রুলস</th>
                    <th className="p-3">রাইট (Write) রুলস</th>
                    <th className="p-3">ডিলিট (Delete) রুলস</th>
                    <th className="p-3">টেন্যান্ট আইসোলেশন</th>
                    <th className="p-3">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {firestoreAudits.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">{item.collection}</td>
                      <td className="p-3 text-xs text-slate-700 dark:text-slate-300">{item.readAccess}</td>
                      <td className="p-3 text-xs text-slate-700 dark:text-slate-300">{item.writeAccess}</td>
                      <td className="p-3 text-xs text-slate-700 dark:text-slate-300">{item.deleteAccess}</td>
                      <td className="p-3">
                        {item.orgIsolation ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[11px] font-bold rounded">
                            VERIFIED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-slate-800 text-[11px] font-bold rounded">
                            GLOBAL
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-bold rounded-full">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: APPLICATION SECURITY & XSS */}
      {activeSubTab === 'app_sec' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <span>অ্যাপ্লিকেশন সিকিউরিটি, XSS Sanitization & Rate Limiter</span>
            </h3>

            <form onSubmit={handleSaveAppSecurity} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-4">
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">XSS ও ইনপুট স্যানিটাইজেশন</div>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-700 dark:text-slate-300">XSS ফিল্টার ও HTML Escaping সক্রিয়</span>
                  <input
                    type="checkbox"
                    checked={appSecurity.xssProtectionEnabled}
                    onChange={e => setAppSecurity({ ...appSecurity, xssProtectionEnabled: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-700 dark:text-slate-300">CSRF টোকেন ভ্যালিডেশন রেডি</span>
                  <input
                    type="checkbox"
                    checked={appSecurity.csrfTokenVerification}
                    onChange={e => setAppSecurity({ ...appSecurity, csrfTokenVerification: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-700 dark:text-slate-300">প্রোডাকশনে সোর্স ট্রেইস হাইড (Hide Error Stack Traces)</span>
                  <input
                    type="checkbox"
                    checked={appSecurity.hideErrorStackTracesInProd}
                    onChange={e => setAppSecurity({ ...appSecurity, hideErrorStackTracesInProd: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </label>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-4">
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">রেট লিমিটিং ও সিকিউর হেডার্স</div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">সর্বোচ্চ রিকুয়েস্ট প্রতি মিনিটে (Rate Limit Max Req/min)</label>
                  <input
                    type="number"
                    value={appSecurity.rateLimitMaxRequestsPerMin}
                    onChange={e => setAppSecurity({ ...appSecurity, rateLimitMaxRequestsPerMin: Number(e.target.value) })}
                    className="mt-1 w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>

                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 pt-2">HTTP Secure Headers Status:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="p-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 rounded font-bold">Content-Security-Policy</span>
                  <span className="p-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 rounded font-bold">Strict-Transport-Security</span>
                  <span className="p-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 rounded font-bold">X-Frame-Options: SAMEORIGIN</span>
                  <span className="p-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 rounded font-bold">X-Content-Type-Options: nosniff</span>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm rounded-xl transition-all shadow-md"
                >
                  অ্যাপ সিকিউরিটি সেটিংস সেভ করুন
                </button>
              </div>
            </form>
          </div>

          {/* XSS Sanitizer Tester */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-md font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-rose-500" />
              <span>লাইভ XSS ইনপুট স্যানিটাইজার ও এনকোডার টেস্টার</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">রও (Raw) ইনপুট টেস্ট কোড:</label>
                <textarea
                  rows={3}
                  value={testSanitizerInput}
                  onChange={e => handleTestSanitizer(e.target.value)}
                  className="mt-1 w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">স্যানিটাইজড ও এনকোডেড আউটপুট:</label>
                <div className="mt-1 p-2.5 bg-emerald-950 text-emerald-300 rounded-xl text-xs font-mono min-h-[75px] border border-emerald-800 break-all">
                  {sanitizedOutput || EnterpriseSecurityService.sanitizeInput(testSanitizerInput)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: AUDIT & LOG CENTER */}
      {activeSubTab === 'audit_logs' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-500" />
                  <span>সিকিউরিটি অডিট ও অ্যাক্টিভিটি লগ সেন্টার</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  সকল সংবেদনশীল অ্যাকশন, পারমিশন পরিবর্তন এবং সিস্টেম সিকিউরিটি অডিট ইতিহাস।
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportAuditLogs}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>ডাউনলোড অডিট লগ (JSON)</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="ইমেইল, অ্যাকশন বা বিবরণ দিয়ে ফিল্টার করুন..."
                  value={logSearchQuery}
                  onChange={e => setLogSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 w-full md:w-auto">
                <span className="text-xs text-slate-500 shrink-0">লেভেল:</span>
                <select
                  value={logFilterSeverity}
                  onChange={e => setLogFilterSeverity(e.target.value)}
                  className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                >
                  <option value="ALL">সকল লেভেল (All Severity)</option>
                  <option value="INFO">INFO</option>
                  <option value="WARNING">WARNING</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs uppercase font-semibold">
                  <tr>
                    <th className="p-3">টাইমস্ট্যাম্প</th>
                    <th className="p-3">ইউজার / রোল</th>
                    <th className="p-3">অ্যাকশন ও ক্যাটাগরি</th>
                    <th className="p-3">আইপি এড্রেস</th>
                    <th className="p-3">লেভেল</th>
                    <th className="p-3">বিস্তারিত বিবরণ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredAuditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('bn-BD')}
                      </td>
                      <td className="p-3 text-xs">
                        <div className="font-semibold text-slate-900 dark:text-white">{log.actorEmail}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{log.actorRole}</div>
                      </td>
                      <td className="p-3 text-xs">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{log.action}</div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">{log.category}</span>
                      </td>
                      <td className="p-3 text-xs font-mono text-slate-600 dark:text-slate-400">{log.ipAddress}</td>
                      <td className="p-3">
                        {log.severity === 'INFO' && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-bold rounded">INFO</span>}
                        {log.severity === 'WARNING' && <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] font-bold rounded">WARNING</span>}
                        {log.severity === 'CRITICAL' && <span className="px-2 py-0.5 bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 text-[10px] font-bold rounded">CRITICAL</span>}
                      </td>
                      <td className="p-3 text-xs text-slate-600 dark:text-slate-300">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: COMPLIANCE & PRIVACY */}
      {activeSubTab === 'compliance' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-rose-500" />
              <span>কমপ্লায়েন্স, প্রাইভেসি নীতি ও ডেটা রিটেনশন</span>
            </h3>

            <form onSubmit={handleSaveCompliance} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-4">
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">প্রাইভেসি ও শর্তাবলী ভার্সনিং</div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Privacy Policy Version</label>
                  <input
                    type="text"
                    value={compliance.privacyPolicyVersion}
                    onChange={e => setCompliance({ ...compliance, privacyPolicyVersion: e.target.value })}
                    className="mt-1 w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Terms of Service Version</label>
                  <input
                    type="text"
                    value={compliance.termsOfServiceVersion}
                    onChange={e => setCompliance({ ...compliance, termsOfServiceVersion: e.target.value })}
                    className="mt-1 w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-700 dark:text-slate-300">GDPR Data Export বোতাম সক্রিয়</span>
                  <input
                    type="checkbox"
                    checked={compliance.gdprExportEnabled}
                    onChange={e => setCompliance({ ...compliance, gdprExportEnabled: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-700 dark:text-slate-300">Right to be Forgotten (একাউন্ট মুছে ফেলা)</span>
                  <input
                    type="checkbox"
                    checked={compliance.rightToBeForgottenEnabled}
                    onChange={e => setCompliance({ ...compliance, rightToBeForgottenEnabled: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </label>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-4">
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">ডেটা রিটেনশন ও অটো-পার্জিং পলিসি</div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">লগ সংরক্ষণ মেয়াদ (Data Retention Days)</label>
                  <input
                    type="number"
                    value={compliance.dataRetentionDays}
                    onChange={e => setCompliance({ ...compliance, dataRetentionDays: Number(e.target.value) })}
                    className="mt-1 w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handlePurgeLogs}
                    className="w-full px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>পুরাতন মেয়াদোত্তীর্ণ লগ ম্যানুয়ালি পার্জ (Purge Now) করুন</span>
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm rounded-xl transition-all shadow-md"
                >
                  কমপ্লায়েন্স সেটিংস সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
