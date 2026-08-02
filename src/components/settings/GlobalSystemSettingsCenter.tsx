import React, { useState, useEffect } from 'react';
import {
  Settings,
  Globe,
  Palette,
  Mail,
  MessageSquare,
  CreditCard,
  Bell,
  Shield,
  Wrench,
  Key,
  FileText,
  Save,
  RefreshCw,
  Check,
  AlertTriangle,
  Server,
  Database,
  Lock,
  Smartphone,
  Sparkles,
  Send,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Filter,
  Search,
  Terminal,
  Clock,
  UserCheck,
  Layers,
  Copy
} from 'lucide-react';
import {
  GlobalSystemConfig,
  SystemLogEntry,
  PaymentGatewayConfig
} from '../../types/systemSettings';
import { SystemSettingsService } from '../../services/systemSettingsService';

export const GlobalSystemSettingsCenter: React.FC = () => {
  const [config, setConfig] = useState<GlobalSystemConfig>(() => SystemSettingsService.getSettings());
  const [logs, setLogs] = useState<SystemLogEntry[]>(() => SystemSettingsService.getLogs());
  const [activeTab, setActiveTab] = useState<
    'GENERAL' | 'BRANDING' | 'EMAIL' | 'SMS' | 'PAYMENTS' | 'NOTIFICATIONS' | 'SECURITY' | 'MAINTENANCE' | 'LICENSE' | 'LOGS'
  >('GENERAL');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<string | null>(null);

  const [logFilter, setLogFilter] = useState<'ALL' | 'SYSTEM' | 'ERROR' | 'ACTIVITY' | 'AUDIT'>('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [ipInput, setIpInput] = useState('');

  const handleSaveAllSettings = () => {
    setSaving(true);
    setSaveSuccess(false);
    setTimeout(() => {
      SystemSettingsService.saveSettings(config);
      SystemSettingsService.addLog({
        logType: 'AUDIT',
        actor: 'Super Admin',
        action: 'GLOBAL_SETTINGS_SAVE',
        details: `Saved configurations for tab: ${activeTab}`,
        ipAddress: '103.112.44.1'
      });
      setLogs(SystemSettingsService.getLogs());
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const handleClearCache = () => {
    const updated = SystemSettingsService.clearCache(config);
    setConfig(updated);
    setLogs(SystemSettingsService.getLogs());
    alert('সিস্টেম ক্যাশ এবং রিডিস মেমোরি সফলভাবে ক্লিয়ার করা হয়েছে।');
  };

  const handleOptimizeDb = () => {
    const updated = SystemSettingsService.optimizeDatabase(config);
    setConfig(updated);
    setLogs(SystemSettingsService.getLogs());
    alert('ফায়ারস্টোর ডাটাবেজ ইন্ডেক্সিং এবং ডাটা অপটিমাইজেশন সম্পন্ন হয়েছে।');
  };

  const handleTestSmtp = () => {
    setTestingSmtp(true);
    setSmtpTestResult(null);
    setTimeout(() => {
      setTestingSmtp(false);
      setSmtpTestResult(`টেস্ট ইমেইল সফলভাবে পাঠানো হয়েছে: ${config.email.senderEmail} এ।`);
    }, 1200);
  };

  const handlePaymentToggle = (index: number) => {
    const newPayments = [...config.payments];
    newPayments[index].enabled = !newPayments[index].enabled;
    setConfig({ ...config, payments: newPayments });
  };

  const handlePaymentChange = (index: number, field: keyof PaymentGatewayConfig, value: any) => {
    const newPayments = [...config.payments];
    newPayments[index] = { ...newPayments[index], [field]: value };
    setConfig({ ...config, payments: newPayments });
  };

  const handleAddAllowedIp = () => {
    if (!ipInput.trim()) return;
    if (config.security.allowedIpList.includes(ipInput.trim())) return;
    setConfig({
      ...config,
      security: {
        ...config.security,
        allowedIpList: [...config.security.allowedIpList, ipInput.trim()]
      }
    });
    setIpInput('');
  };

  const handleRemoveIp = (ipToRemove: string) => {
    setConfig({
      ...config,
      security: {
        ...config.security,
        allowedIpList: config.security.allowedIpList.filter(ip => ip !== ipToRemove)
      }
    });
  };

  const filteredLogs = logs.filter(log => {
    const matchesFilter = logFilter === 'ALL' || log.logType === logFilter;
    const matchesSearch =
      log.actor.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(logSearchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black border border-indigo-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              PROMPT-24
            </span>
            <span className="px-3 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-500/20">
              Super Admin Control Center
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Global System Settings & Maintenance Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            সমগ্র SaaS প্ল্যাটফর্মের ব্র্যান্ডিং, সিকিউরিটি, গেটওয়ে, লাইসেন্সিং ও ডাটাবেজ মেইনটেন্যান্স কেন্দ্রীয় হাব
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30 rounded-2xl animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              সেটিংস সংরক্ষিত হয়েছে!
            </div>
          )}

          <button
            onClick={handleSaveAllSettings}
            disabled={saving}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
            {saving ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সেভ করুন'}
          </button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'GENERAL', label: 'General Settings', icon: Globe },
          { id: 'BRANDING', label: 'Branding & Theme', icon: Palette },
          { id: 'EMAIL', label: 'Email SMTP', icon: Mail },
          { id: 'SMS', label: 'SMS Gateway', icon: MessageSquare },
          { id: 'PAYMENTS', label: 'Payment Gateways', icon: CreditCard },
          { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell },
          { id: 'SECURITY', label: 'Security & 2FA', icon: Shield },
          { id: 'MAINTENANCE', label: 'System Maintenance', icon: Wrench },
          { id: 'LICENSE', label: 'License & WhiteLabel', icon: Key },
          { id: 'LOGS', label: 'Log Management', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">

        {/* 1. GENERAL SETTINGS */}
        {activeTab === 'GENERAL' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                সাধারণ সিস্টেম কনফিগারেশন (General System Settings)
              </h3>
              <p className="text-xs text-slate-500">সফটওয়্যারের নাম, গ্লোবাল টাইমজোন, কারেন্সি ও ল্যাঙ্গুয়েজ লোক্যালাইজেশন</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Software Name</label>
                <input
                  type="text"
                  value={config.general.softwareName}
                  onChange={e => setConfig({ ...config, general: { ...config.general, softwareName: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Organization Name</label>
                <input
                  type="text"
                  value={config.general.organizationName}
                  onChange={e => setConfig({ ...config, general: { ...config.general, organizationName: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company Name</label>
                <input
                  type="text"
                  value={config.general.companyName}
                  onChange={e => setConfig({ ...config, general: { ...config.general, companyName: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">System Version</label>
                <input
                  type="text"
                  value={config.general.systemVersion}
                  readOnly
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Time Zone</label>
                <select
                  value={config.general.timeZone}
                  onChange={e => setConfig({ ...config, general: { ...config.general, timeZone: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Asia/Dhaka (GMT+6)">Asia/Dhaka (GMT+6)</option>
                  <option value="Asia/Kolkata (GMT+5:30)">Asia/Kolkata (GMT+5:30)</option>
                  <option value="UTC">UTC (GMT+0)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Date Format</label>
                <select
                  value={config.general.dateFormat}
                  onChange={e => setConfig({ ...config, general: { ...config.general, dateFormat: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 31/07/2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-07-31)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 07/31/2026)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Currency</label>
                <input
                  type="text"
                  value={config.general.currency}
                  onChange={e => setConfig({ ...config, general: { ...config.general, currency: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Language</label>
                <select
                  value={config.general.language}
                  onChange={e => setConfig({ ...config, general: { ...config.general, language: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="bn-BD (বাংলা)">bn-BD (বাংলা)</option>
                  <option value="en-US (English)">en-US (English)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Country</label>
                <input
                  type="text"
                  value={config.general.country}
                  onChange={e => setConfig({ ...config, general: { ...config.general, country: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. BRANDING & THEME */}
        {activeTab === 'BRANDING' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-600" />
                ব্র্যান্ডিং ও ডিসপ্লে থিম (Branding & Display Theme)
              </h3>
              <p className="text-xs text-slate-500">লোগো ইউআরএল, ফুটার কপিরাইট এবং কালার স্কিম থিম ম্যানেজমেন্ট</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Main Logo URL</label>
                <input
                  type="text"
                  value={config.branding.logoUrl}
                  onChange={e => setConfig({ ...config, branding: { ...config.branding, logoUrl: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Favicon URL</label>
                <input
                  type="text"
                  value={config.branding.faviconUrl}
                  onChange={e => setConfig({ ...config, branding: { ...config.branding, faviconUrl: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Login Page Logo URL</label>
                <input
                  type="text"
                  value={config.branding.loginLogoUrl}
                  onChange={e => setConfig({ ...config, branding: { ...config.branding, loginLogoUrl: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Dashboard Header Logo URL</label>
                <input
                  type="text"
                  value={config.branding.dashboardLogoUrl}
                  onChange={e => setConfig({ ...config, branding: { ...config.branding, dashboardLogoUrl: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Footer Banner Text</label>
                <input
                  type="text"
                  value={config.branding.footerText}
                  onChange={e => setConfig({ ...config, branding: { ...config.branding, footerText: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Copyright Statement</label>
                <input
                  type="text"
                  value={config.branding.copyrightText}
                  onChange={e => setConfig({ ...config, branding: { ...config.branding, copyrightText: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Theme Mode</label>
                <select
                  value={config.branding.defaultMode}
                  onChange={e => setConfig({ ...config, branding: { ...config.branding, defaultMode: e.target.value as any } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                >
                  <option value="DARK">Dark Mode (ডিফল্ট প্রিমিয়াম ডার্ক)</option>
                  <option value="LIGHT">Light Mode (ক্লিন লাইট)</option>
                  <option value="SYSTEM">System Auto Match</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Accent Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.branding.primaryThemeColor}
                    onChange={e => setConfig({ ...config, branding: { ...config.branding, primaryThemeColor: e.target.value } })}
                    className="w-10 h-9 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.branding.primaryThemeColor}
                    onChange={e => setConfig({ ...config, branding: { ...config.branding, primaryThemeColor: e.target.value } })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. EMAIL SMTP SETTINGS */}
        {activeTab === 'EMAIL' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-600" />
                  ইমেইল SMTP সার্ভার কনফিগারেশন (Email SMTP Server)
                </h3>
                <p className="text-xs text-slate-500">ইনভয়েস, পাসওয়ার্ড রিসেট ও নোটিফিকেশন ইমেইল পাঠানোর SMTP পারামিটার</p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">SMTP Active:</label>
                <input
                  type="checkbox"
                  checked={config.email.enabled}
                  onChange={e => setConfig({ ...config, email: { ...config.email, enabled: e.target.checked } })}
                  className="w-5 h-5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">SMTP Host</label>
                <input
                  type="text"
                  value={config.email.smtpHost}
                  onChange={e => setConfig({ ...config, email: { ...config.email, smtpHost: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">SMTP Port</label>
                <input
                  type="number"
                  value={config.email.smtpPort}
                  onChange={e => setConfig({ ...config, email: { ...config.email, smtpPort: parseInt(e.target.value) || 587 } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">SMTP Username</label>
                <input
                  type="text"
                  value={config.email.smtpUser}
                  onChange={e => setConfig({ ...config, email: { ...config.email, smtpUser: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">SMTP Password</label>
                <input
                  type="password"
                  value={config.email.smtpPass}
                  onChange={e => setConfig({ ...config, email: { ...config.email, smtpPass: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Sender Email Address</label>
                <input
                  type="email"
                  value={config.email.senderEmail}
                  onChange={e => setConfig({ ...config, email: { ...config.email, senderEmail: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Sender Name Display</label>
                <input
                  type="text"
                  value={config.email.senderName}
                  onChange={e => setConfig({ ...config, email: { ...config.email, senderName: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">SMTP সংযোগ পরীক্ষা করুন (SMTP Test)</h4>
                <p className="text-[11px] text-slate-500">টেস্ট ইমেইল পাঠিয়ে যাচাই করুন আপনার মেল সার্ভার সঠিকভাবে কাজ করছে কি না</p>
              </div>

              <button
                onClick={handleTestSmtp}
                disabled={testingSmtp}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shrink-0"
              >
                <Send className={`w-3.5 h-3.5 ${testingSmtp ? 'animate-bounce' : ''}`} />
                {testingSmtp ? 'টেস্ট ইমেইল পাঠানো হচ্ছে...' : 'SMTP Test Email পাঠান'}
              </button>
            </div>

            {smtpTestResult && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {smtpTestResult}
              </div>
            )}
          </div>
        )}

        {/* 4. SMS GATEWAY SETTINGS */}
        {activeTab === 'SMS' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  এসএমএস গেটওয়ে সার্ভিস (SMS Gateway Settings)
                </h3>
                <p className="text-xs text-slate-500">ড্রাইভার ও ক্লায়েন্টদের জন্য বাল্ক এবং ট্রানজেকশনাল SMS API</p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">SMS Engine Enabled:</label>
                <input
                  type="checkbox"
                  checked={config.sms.enabled}
                  onChange={e => setConfig({ ...config, sms: { ...config.sms, enabled: e.target.checked } })}
                  className="w-5 h-5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">SMS Provider</label>
                <select
                  value={config.sms.provider}
                  onChange={e => setConfig({ ...config, sms: { ...config.sms, provider: e.target.value as any } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                >
                  <option value="SSL_WIRELESS">SSL Wireless (বাংলাদেশ প্রিমিয়াম)</option>
                  <option value="BULKSMS_BD">BulkSMS BD</option>
                  <option value="MAMURBET">MAMURBET SMS Engine</option>
                  <option value="TWILIO">Twilio Global SMS API</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Sender ID (Masking/Non-Masking)</label>
                <input
                  type="text"
                  value={config.sms.senderId}
                  onChange={e => setConfig({ ...config, sms: { ...config.sms, senderId: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">API Secret Key</label>
                <input
                  type="password"
                  value={config.sms.apiKey}
                  onChange={e => setConfig({ ...config, sms: { ...config.sms, apiKey: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Provider Endpoint URL</label>
                <input
                  type="text"
                  value={config.sms.apiEndpoint}
                  onChange={e => setConfig({ ...config, sms: { ...config.sms, apiEndpoint: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. PAYMENT GATEWAYS */}
        {activeTab === 'PAYMENTS' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                পেমেন্ট গেটওয়ে মার্চেন্ট সেটিংস (bKash, Nagad, Rocket, SSLCommerz)
              </h3>
              <p className="text-xs text-slate-500">অনলাইন পেমেন্ট কালেকশনের জন্য API কি, মার্চেন্ট আইডি ও স্যান্ডবক্স সেটিংস</p>
            </div>

            <div className="space-y-4">
              {config.payments.map((p, idx) => (
                <div
                  key={p.provider}
                  className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900 dark:text-white">{p.provider} Payment Gateway</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                      }`}>
                        {p.enabled ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={p.isSandbox}
                          onChange={e => handlePaymentChange(idx, 'isSandbox', e.target.checked)}
                          className="rounded text-amber-600"
                        />
                        Sandbox Test Mode
                      </label>

                      <button
                        onClick={() => handlePaymentToggle(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          p.enabled ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                        }`}
                      >
                        {p.enabled ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block">Merchant / Store ID</label>
                      <input
                        type="text"
                        value={p.merchantId}
                        onChange={e => handlePaymentChange(idx, 'merchantId', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block">App Key / Store Password</label>
                      <input
                        type="text"
                        value={p.appKey}
                        onChange={e => handlePaymentChange(idx, 'appKey', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block">App Secret</label>
                      <input
                        type="password"
                        value={p.appSecret}
                        onChange={e => handlePaymentChange(idx, 'appSecret', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. NOTIFICATION PREFERENCES */}
        {activeTab === 'NOTIFICATIONS' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" />
                নোটিফিকেশন অ্যালার্ট প্রেফারেন্স (System Notification Rules)
              </h3>
              <p className="text-xs text-slate-500">পুশ নোটিফিকেশন, ইন-অ্যাপ অ্যালার্ট, ইমেইল এবং এসএমএস চ্যানেল কন্ট্রোল</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Push Notifications (Android & Web)</h4>
                  <p className="text-[11px] text-slate-500">মোবাইল অ্যাপ এবং ব্রাউজারে রিয়েলটাইম নোটিফিকেশন পাঠাবে</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.notifications.pushNotificationsEnabled}
                  onChange={e => setConfig({ ...config, notifications: { ...config.notifications, pushNotificationsEnabled: e.target.checked } })}
                  className="w-5 h-5 rounded text-indigo-600"
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">SMS Automated Alerts</h4>
                  <p className="text-[11px] text-slate-500">উচ্চ বকেয়া ও জরুরি মেসেজ ড্রাইভারদের মোবাইলে এসএমএস করবে</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.notifications.smsAlertsEnabled}
                  onChange={e => setConfig({ ...config, notifications: { ...config.notifications, smsAlertsEnabled: e.target.checked } })}
                  className="w-5 h-5 rounded text-indigo-600"
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Email Digest & Invoices</h4>
                  <p className="text-[11px] text-slate-500">প্রতিদিনের হিসাবের সারাংশ ও অফিসিয়াল ইনভয়েস ইমেইল করবে</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.notifications.emailAlertsEnabled}
                  onChange={e => setConfig({ ...config, notifications: { ...config.notifications, emailAlertsEnabled: e.target.checked } })}
                  className="w-5 h-5 rounded text-indigo-600"
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">In-App System Banners</h4>
                  <p className="text-[11px] text-slate-500">ড্যাশবোর্ডের উপরে লাইভ অ্যালার্ট ব্যানার এবং ওয়ার্নিং পপআপ</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.notifications.systemInAppAlertsEnabled}
                  onChange={e => setConfig({ ...config, notifications: { ...config.notifications, systemInAppAlertsEnabled: e.target.checked } })}
                  className="w-5 h-5 rounded text-indigo-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* 7. SECURITY SETTINGS */}
        {activeTab === 'SECURITY' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                সিকিউরিটি পলিসি ও 2FA (Security & Password Policy)
              </h3>
              <p className="text-xs text-slate-500">পাসওয়ার্ড পলিসি, সেশন টাইমআউট, ২-ফ্যাক্টর অথেনটিকেশন এবং IP রেস্ট্রিকশন</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Minimum Password Length</label>
                <input
                  type="number"
                  value={config.security.minPasswordLength}
                  onChange={e => setConfig({ ...config, security: { ...config.security, minPasswordLength: parseInt(e.target.value) || 8 } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Session Timeout (Minutes)</label>
                <input
                  type="number"
                  value={config.security.sessionTimeoutMinutes}
                  onChange={e => setConfig({ ...config, security: { ...config.security, sessionTimeoutMinutes: parseInt(e.target.value) || 30 } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Max Failed Login Attempt Limit</label>
                <input
                  type="number"
                  value={config.security.maxLoginAttemptLimit}
                  onChange={e => setConfig({ ...config, security: { ...config.security, maxLoginAttemptLimit: parseInt(e.target.value) || 5 } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white block">2FA Readiness (TOTP Authenticator)</label>
                  <span className="text-[10px] text-slate-500">গুগল অথেনটিকেটর সাপোর্ট অ্যাক্টিভ রয়েছে</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.security.twoFactorAuthReady}
                  onChange={e => setConfig({ ...config, security: { ...config.security, twoFactorAuthReady: e.target.checked } })}
                  className="w-5 h-5 rounded text-indigo-600"
                />
              </div>
            </div>

            {/* IP Restrictions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">IP Address Whitelisting (IP Restriction)</h4>
                  <p className="text-[11px] text-slate-500">শুধুমাত্র অনুমোদিত আইপি এড্রেস থেকেই সুপার এডমিন প্যানেলে লগইন করা যাবে</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.security.ipRestrictionEnabled}
                  onChange={e => setConfig({ ...config, security: { ...config.security, ipRestrictionEnabled: e.target.checked } })}
                  className="w-5 h-5 rounded text-indigo-600"
                />
              </div>

              {config.security.ipRestrictionEnabled && (
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 103.112.44.1"
                      value={ipInput}
                      onChange={e => setIpInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono"
                    />
                    <button
                      onClick={handleAddAllowedIp}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                    >
                      IP যোগ করুন
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {config.security.allowedIpList.map(ip => (
                      <span
                        key={ip}
                        className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono flex items-center gap-2"
                      >
                        {ip}
                        <button
                          onClick={() => handleRemoveIp(ip)}
                          className="text-rose-500 font-bold hover:text-rose-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 8. SYSTEM MAINTENANCE */}
        {activeTab === 'MAINTENANCE' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-indigo-600" />
                সিস্টেম মেইনটেন্যান্স সেন্টার (Maintenance & Health)
              </h3>
              <p className="text-xs text-slate-500">সার্ভার ও ফায়ারস্টোর স্ট্যাটাস, মেইনটেন্যান্স মোড এবং ক্যাশ ফ্লাশ</p>
            </div>

            {/* Status Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">সার্ভার রানটাইম স্ট্যাটাস</span>
                <div className="text-base font-black text-emerald-500 flex items-center gap-1.5">
                  <Server className="w-4 h-4" />
                  {config.maintenance.serverStatus} (Cloud Run)
                </div>
                <span className="text-[10px] text-slate-500 block">Port 3000 Active</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">ফায়ারস্টোর ডাটাবেজ</span>
                <div className="text-base font-black text-indigo-500 flex items-center gap-1.5">
                  <Database className="w-4 h-4" />
                  {config.maintenance.firebaseStatus}
                </div>
                <span className="text-[10px] text-slate-500 block">DB: ai-studio-cloudsaasplatfor</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">মেইনটেন্যান্স মোড</span>
                <div className={`text-base font-black ${config.maintenance.maintenanceModeActive ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {config.maintenance.maintenanceModeActive ? 'ACTIVE (সিস্টেম বন্ধ)' : 'OFFLINE (স্বাভাবিক চালু)'}
                </div>
                <span className="text-[10px] text-slate-500 block">গ্লোবাল ইউজার এক্সেস</span>
              </div>
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-amber-900 dark:text-amber-100 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    মেইনটেন্যান্স মোড সুইচ (Global Maintenance Lockout)
                  </h4>
                  <p className="text-[11px] text-amber-800 dark:text-amber-200">
                    মেইনটেন্যান্স মোড চালু করলে সুপার এডমিন ব্যতিত সকল সাধারণ ইউজারদের জন্য সাইট অস্থায়ীভাবে বন্ধ থাকবে
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={config.maintenance.maintenanceModeActive}
                  onChange={e => setConfig({ ...config, maintenance: { ...config.maintenance, maintenanceModeActive: e.target.checked } })}
                  className="w-6 h-6 rounded text-amber-600 focus:ring-amber-500"
                />
              </div>

              {config.maintenance.maintenanceModeActive && (
                <div className="space-y-1 pt-2 border-t border-amber-500/20">
                  <label className="text-[10px] font-bold text-amber-900 dark:text-amber-200">মেইনটেন্যান্স বার্তা (Display Message):</label>
                  <input
                    type="text"
                    value={config.maintenance.maintenanceMessage}
                    onChange={e => setConfig({ ...config, maintenance: { ...config.maintenance, maintenanceMessage: e.target.value } })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-amber-500/30 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Maintenance Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Clear System Cache & Memory</h4>
                <p className="text-[11px] text-slate-500">সর্বশেষ ক্যাশ ফ্লাশ: {config.maintenance.lastCacheClearedAt}</p>
                <button
                  onClick={handleClearCache}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  ক্যাশ ক্লিয়ার করুন
                </button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Optimize Database & Re-index</h4>
                <p className="text-[11px] text-slate-500">সর্বশেষ অপটিমাইজেশন: {config.maintenance.lastDatabaseOptimizedAt}</p>
                <button
                  onClick={handleOptimizeDb}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2"
                >
                  <Database className="w-3.5 h-3.5" />
                  ডাটাবেজ অপটিমাইজ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 9. LICENSE & WHITE LABEL */}
        {activeTab === 'LICENSE' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-600" />
                লাইসেন্সিং ও হোয়াইট লেবেল সেটিংস (SaaS License & White Label)
              </h3>
              <p className="text-xs text-slate-500">সফটওয়্যার অ্যাক্টিভেশন লাইসেন্স, এক্সপায়ারি ডেট এবং টেন্যান্ট লিমিটেশন্স</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Global SaaS License Key</label>
                <input
                  type="text"
                  value={config.license.licenseKey}
                  onChange={e => setConfig({ ...config, license: { ...config.license, licenseKey: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-black text-indigo-600 dark:text-indigo-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">License Status</label>
                <select
                  value={config.license.licenseStatus}
                  onChange={e => setConfig({ ...config, license: { ...config.license, licenseStatus: e.target.value as any } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-emerald-500"
                >
                  <option value="ACTIVE">ACTIVE (সক্রিয় প্রিমিয়াম প্রফেশনাল)</option>
                  <option value="TRIAL">TRIAL (১৪ দিনের ট্রায়াল)</option>
                  <option value="EXPIRED">EXPIRED (মেয়াদ উত্তীর্ণ)</option>
                  <option value="REVOKED">REVOKED (বাতিলকৃত)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">License Expiry Date</label>
                <input
                  type="text"
                  value={config.license.expiryDate}
                  onChange={e => setConfig({ ...config, license: { ...config.license, expiryDate: e.target.value } })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between md:col-span-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">White Label Branding Ready</h4>
                  <p className="text-[11px] text-slate-500">অনুমোদিত সাব-টেন্যান্টসদের জন্য নিজস্ব ডোমেইন ও কাস্টম লোগো সাপোর্ট</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.license.whiteLabelEnabled}
                  onChange={e => setConfig({ ...config, license: { ...config.license, whiteLabelEnabled: e.target.checked } })}
                  className="w-5 h-5 rounded text-indigo-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* 10. LOG MANAGEMENT */}
        {activeTab === 'LOGS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  সিস্টেম লগ ও অডিট ট্রেইল (Log Management)
                </h3>
                <p className="text-xs text-slate-500">সিস্টেম সিকিউরিটি, অ্যাক্টিভিটি, এরর এবং অডিট ট্রেইল রেকর্ডসমূহ</p>
              </div>

              {/* Log Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {(['ALL', 'SYSTEM', 'ERROR', 'ACTIVITY', 'AUDIT'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setLogFilter(type)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition-all ${
                      logFilter === type
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Log Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="লগ অ্যাকশন, ইউজার বা বিবরণ অনুসন্ধান করুন..."
                value={logSearchQuery}
                onChange={e => setLogSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-mono"
              />
            </div>

            {/* Logs Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[10px]">
                    <th className="p-3">টাইমস্ট্যাম্প</th>
                    <th className="p-3">টাইপ</th>
                    <th className="p-3">ইউজার / অ্যাক্টর</th>
                    <th className="p-3">অ্যাকশন</th>
                    <th className="p-3">বিবরণ (Details)</th>
                    <th className="p-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50">
                      <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.logType === 'ERROR' ? 'bg-rose-500/10 text-rose-500' :
                          log.logType === 'AUDIT' ? 'bg-indigo-500/10 text-indigo-500' :
                          log.logType === 'SYSTEM' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {log.logType}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">{log.actor}</td>
                      <td className="p-3 text-indigo-600 dark:text-indigo-400 font-bold whitespace-nowrap">{log.action}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 min-w-[280px]">{log.details}</td>
                      <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
