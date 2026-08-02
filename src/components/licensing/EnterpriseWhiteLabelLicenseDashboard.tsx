import React, { useState } from 'react';
import {
  Key,
  Users,
  Building2,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Plus,
  RefreshCw,
  Search,
  Copy,
  Check,
  Crown,
  Palette,
  Layers,
  Sparkles,
  FileText,
  TrendingUp,
  DollarSign,
  Globe,
  Sliders,
  Trash2,
  Ban,
  RotateCcw
} from 'lucide-react';
import { motion } from 'motion/react';
import { WhiteLabelLicenseService } from '../../services/whiteLabelLicenseService';
import {
  LicenseTier,
  LicenseStatus,
  CustomerAccount,
  LicenseKeyRecord,
  WhiteLabelBrandingSettings,
  LicenseAuditLog,
  LicenseDashboardSummary
} from '../../types/whiteLabelLicense';

export const EnterpriseWhiteLabelLicenseDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'CUSTOMERS' | 'KEYS' | 'WHITE_LABEL' | 'TIERS' | 'LOGS'
  >('CUSTOMERS');

  const [summary, setSummary] = useState<LicenseDashboardSummary>(
    WhiteLabelLicenseService.getSummaryMetrics()
  );
  const [customers, setCustomers] = useState<CustomerAccount[]>(
    WhiteLabelLicenseService.getCustomers()
  );
  const [licenses, setLicenses] = useState<LicenseKeyRecord[]>(
    WhiteLabelLicenseService.getLicenses()
  );
  const [auditLogs, setAuditLogs] = useState<LicenseAuditLog[]>(
    WhiteLabelLicenseService.getAuditLogs()
  );

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // New Provisioning Form State
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [provCustomerName, setProvCustomerName] = useState('');
  const [provCompanyName, setProvCompanyName] = useState('');
  const [provEmail, setProvEmail] = useState('');
  const [provPhone, setProvPhone] = useState('');
  const [provTier, setProvTier] = useState<LicenseTier>('BUSINESS');

  // New Standalone Key Form
  const [keyGenTier, setKeyGenTier] = useState<LicenseTier>('PROFESSIONAL');
  const [keyGenNotes, setKeyGenNotes] = useState('');

  // White Label Selected Org
  const [selectedOrgIdForBranding, setSelectedOrgIdForBranding] = useState<string>(
    customers[0]?.orgId || 'tenant_rahim_001'
  );
  const [brandingState, setBrandingState] = useState<WhiteLabelBrandingSettings>(
    WhiteLabelLicenseService.getBrandingForOrg(selectedOrgIdForBranding)
  );
  const [brandingSavedMsg, setBrandingSavedMsg] = useState(false);

  const refreshData = () => {
    setSummary(WhiteLabelLicenseService.getSummaryMetrics());
    setCustomers(WhiteLabelLicenseService.getCustomers());
    setLicenses(WhiteLabelLicenseService.getLicenses());
    setAuditLogs(WhiteLabelLicenseService.getAuditLogs());
  };

  const handleCopyKey = (keyString: string, id: string) => {
    navigator.clipboard.writeText(keyString);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleProvisionCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provCustomerName || !provCompanyName || !provEmail) return;

    WhiteLabelLicenseService.provisionCustomer(
      provCustomerName,
      provCompanyName,
      provEmail,
      provPhone,
      provTier
    );

    setShowProvisionModal(false);
    setProvCustomerName('');
    setProvCompanyName('');
    setProvEmail('');
    setProvPhone('');
    refreshData();
  };

  const handleGenerateStandaloneKey = (e: React.FormEvent) => {
    e.preventDefault();
    WhiteLabelLicenseService.generateLicenseKey(keyGenTier, keyGenNotes);
    setKeyGenNotes('');
    refreshData();
  };

  const handleToggleLicenseStatus = (licenseId: string, currentStatus: LicenseStatus) => {
    const newStatus: LicenseStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    WhiteLabelLicenseService.updateLicenseStatus(licenseId, newStatus);
    refreshData();
  };

  const handleOrgChangeForBranding = (orgId: string) => {
    setSelectedOrgIdForBranding(orgId);
    setBrandingState(WhiteLabelLicenseService.getBrandingForOrg(orgId));
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    WhiteLabelLicenseService.saveBrandingForOrg(selectedOrgIdForBranding, brandingState);
    setBrandingSavedMsg(true);
    setTimeout(() => setBrandingSavedMsg(false), 2500);
  };

  const filteredCustomers = customers.filter(
    c =>
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.primaryContactEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Crown className="w-64 h-64 text-indigo-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PROMPT-29 LIVE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Commercial SaaS Engine
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <Key className="w-8 h-8 text-indigo-400" /> White Label License & Customer Provisioning
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl">
              Multi-Tenant Customer Account Provisioning, Standalone License Key Generator, White-Label Software Branding & Subscription Tier Matrix.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowProvisionModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition"
            >
              <Plus className="w-4 h-4" /> Provision New Customer
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Tenants</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            {summary.totalCustomersCount}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Active Licenses</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {summary.activeLicensesCount}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Trial Accounts</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">
            {summary.trialCustomersCount}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Monthly MRR</span>
            <DollarSign className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            ৳{summary.monthlyRevenueBdt.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Annual ARR</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            ৳{summary.annualRevenueBdt.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Trial Conv. Rate</span>
            <Crown className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400 font-mono">
            {summary.trialConversionRatePct}%
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'CUSTOMERS', label: 'Provisioned Customers', icon: Building2 },
          { id: 'KEYS', label: 'License Keys Generator', icon: Key },
          { id: 'WHITE_LABEL', label: 'White Label Branding', icon: Palette },
          { id: 'TIERS', label: 'Subscription Tiers', icon: Sliders },
          { id: 'LOGS', label: 'License Audit Trail', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Provisioned Customers */}
      {activeTab === 'CUSTOMERS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search customers by name, company, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Customer & Company</th>
                    <th className="py-3 px-4">Tenant Org ID</th>
                    <th className="py-3 px-4">Tier & Status</th>
                    <th className="py-3 px-4">Capacity Limits</th>
                    <th className="py-3 px-4">Custom Domain</th>
                    <th className="py-3 px-4">Expiry Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4 font-sans">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{c.customerName}</p>
                        <p className="text-slate-500 text-[11px]">{c.companyName} • {c.primaryContactEmail}</p>
                      </td>
                      <td className="py-3 px-4 font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                        {c.orgId}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            {c.tier}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : c.status === 'TRIAL'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[11px]">
                        <span>Members: <strong>{c.maxMembersLimit}</strong> | Vehicles: <strong>{c.maxVehiclesLimit}</strong></span>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-600 dark:text-slate-400">
                        {c.customDomain ? (
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <Globe className="w-3.5 h-3.5" /> {c.customDomain}
                          </span>
                        ) : (
                          <span className="text-slate-400">Standard Subdomain</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-500">
                        {new Date(c.expiresAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Standalone License Keys */}
      {activeTab === 'KEYS' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-500" /> Generate Standalone License Key
            </h3>

            <form onSubmit={handleGenerateStandaloneKey} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subscription Tier
                </label>
                <select
                  value={keyGenTier}
                  onChange={(e) => setKeyGenTier(e.target.value as LicenseTier)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="STARTER">Starter</option>
                  <option value="PROFESSIONAL">Professional</option>
                  <option value="BUSINESS">Business</option>
                  <option value="ENTERPRISE">Enterprise</option>
                  <option value="TRIAL">14-Day Trial</option>
                  <option value="LIFETIME">Lifetime License</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  License Notes / Buyer Ref
                </label>
                <input
                  type="text"
                  placeholder="e.g. Special Deal Client Key"
                  value={keyGenNotes}
                  onChange={(e) => setKeyGenNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" /> Issue License Key
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Active & Issued License Keys Directory
            </h3>

            <div className="space-y-3">
              {licenses.map((lic) => (
                <div
                  key={lic.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-sm tracking-wide">
                        {lic.licenseKey}
                      </span>
                      <button
                        onClick={() => handleCopyKey(lic.licenseKey, lic.id)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                      >
                        {copiedKeyId === lic.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {lic.tier}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        lic.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}>
                        {lic.status}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">{lic.notes}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono text-[11px]">
                      Expires: {new Date(lic.expiresAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleToggleLicenseStatus(lic.id, lic.status)}
                      className={`px-3 py-1.5 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                        lic.status === 'ACTIVE'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                    >
                      {lic.status === 'ACTIVE' ? (
                        <>
                          <Ban className="w-3 h-3" /> Suspend
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-3 h-3" /> Reactivate
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: White Label Customizer */}
      {activeTab === 'WHITE_LABEL' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-indigo-500" /> White Label Branding Settings
                </h3>
                <p className="text-xs text-slate-500">
                  Custom Software Name, Organization Logo, Favicon, Login Screen Message & Custom Theme.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Tenant:</span>
                <select
                  value={selectedOrgIdForBranding}
                  onChange={(e) => handleOrgChangeForBranding(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                >
                  {customers.map((c) => (
                    <option key={c.orgId} value={c.orgId}>
                      {c.companyName} ({c.orgId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <form onSubmit={handleSaveBranding} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Custom Software Title
                  </label>
                  <input
                    type="text"
                    value={brandingState.softwareName}
                    onChange={(e) => setBrandingState({ ...brandingState, softwareName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={brandingState.companyName}
                    onChange={(e) => setBrandingState({ ...brandingState, companyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Custom Logo URL
                  </label>
                  <input
                    type="text"
                    value={brandingState.logoUrl}
                    onChange={(e) => setBrandingState({ ...brandingState, logoUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Custom Favicon URL
                  </label>
                  <input
                    type="text"
                    value={brandingState.faviconUrl}
                    onChange={(e) => setBrandingState({ ...brandingState, faviconUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Brand Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={brandingState.primaryBrandColor}
                      onChange={(e) => setBrandingState({ ...brandingState, primaryBrandColor: e.target.value })}
                      className="w-10 h-9 p-1 rounded border border-slate-200"
                    />
                    <input
                      type="text"
                      value={brandingState.primaryBrandColor}
                      onChange={(e) => setBrandingState({ ...brandingState, primaryBrandColor: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Custom Domain Mapping
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. portal.clientdomain.com"
                    value={brandingState.customDomainMapping || ''}
                    onChange={(e) => setBrandingState({ ...brandingState, customDomainMapping: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Custom Login Screen Message
                </label>
                <input
                  type="text"
                  value={brandingState.customLoginMessage}
                  onChange={(e) => setBrandingState({ ...brandingState, customLoginMessage: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  {brandingSavedMsg && <CheckCircle2 className="w-4 h-4" />} {brandingSavedMsg ? 'White Label Branding Saved Successfully!' : ''}
                </span>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-4 h-4" /> Save White Label Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 4: Subscription Tiers */}
      {activeTab === 'TIERS' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { name: 'Starter', price: '৳5,000 / month', members: '5 Users', vehicles: '150 Vehicles', pos: 'Single POS', sms: '100 SMS Included' },
            { name: 'Professional', price: '৳15,000 / month', members: '15 Users', vehicles: '500 Vehicles', pos: '3 POS Terminals', sms: '500 SMS Included' },
            { name: 'Business', price: '৳35,000 / month', members: '30 Users', vehicles: '1,500 Vehicles', pos: 'Unlimited POS', sms: '2,000 SMS Included' },
            { name: 'Enterprise', price: '৳85,000 / month', members: '200 Users', vehicles: '10,000 Vehicles', pos: 'White Label & Custom Domain', sms: '10,000 SMS Included' }
          ].map((tier, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {tier.name}
                </span>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">{tier.price}</p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {tier.members}</p>
                <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {tier.vehicles}</p>
                <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {tier.pos}</p>
                <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {tier.sms}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Audit Trail */}
      {activeTab === 'LOGS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" /> Licensing & Provisioning Security Audit Trail
          </h3>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                      {log.licenseKey}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{log.details}</p>
                </div>

                <div className="text-right text-[11px] text-slate-500 font-mono">
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                  <span className="block text-slate-400">By {log.performedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Provisioning Modal */}
      {showProvisionModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-500" /> Provision New Customer Tenant
            </h3>

            <form onSubmit={handleProvisionCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Customer / Owner Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahim Motors Bangladesh Ltd"
                  value={provCustomerName}
                  onChange={(e) => setProvCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahim Group"
                  value={provCompanyName}
                  onChange={(e) => setProvCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@rahimmotors.com"
                    value={provEmail}
                    onChange={(e) => setProvEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+8801711223344"
                    value={provPhone}
                    onChange={(e) => setProvPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subscription Tier
                </label>
                <select
                  value={provTier}
                  onChange={(e) => setProvTier(e.target.value as LicenseTier)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                >
                  <option value="STARTER">Starter Tier</option>
                  <option value="PROFESSIONAL">Professional Tier</option>
                  <option value="BUSINESS">Business Tier</option>
                  <option value="ENTERPRISE">Enterprise Tier</option>
                  <option value="TRIAL">14-Day Free Trial</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-md"
                >
                  Confirm & Provision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
