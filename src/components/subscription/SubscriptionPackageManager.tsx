import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Copy, 
  Trash2, 
  Power, 
  RefreshCw, 
  Sliders, 
  CreditCard, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  Check, 
  X, 
  Building2, 
  Users, 
  Briefcase, 
  Database, 
  ShieldAlert, 
  Printer, 
  Download, 
  ArrowUpRight, 
  Pause, 
  Play, 
  Ban,
  Sparkles,
  Zap,
  Tag
} from 'lucide-react';
import { 
  PackageTier, 
  SubscriptionRecord, 
  PaymentRecord, 
  SubscriptionStatus 
} from '../../types/saas';
import { SubscriptionService } from '../../services/subscriptionService';
import { ALL_SYSTEM_FEATURES } from '../../data/featureDefinitions';
import { MOCK_ORGANIZATIONS } from '../../data/mockSaaSData';

export const SubscriptionPackageManager: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'packages' | 'features' | 'subscriptions' | 'payments' | 'expiry'>('packages');
  const [packages, setPackages] = useState<PackageTier[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [featureCategoryFilter, setFeatureCategoryFilter] = useState<string>('all');

  // Modals
  const [isPkgModalOpen, setIsPkgModalOpen] = useState<boolean>(false);
  const [editingPkg, setEditingPkg] = useState<PackageTier | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [selectedOrgForAssign, setSelectedOrgForAssign] = useState<any | null>(null);
  const [assignPackageId, setAssignPackageId] = useState<string>('');
  const [assignCycle, setAssignCycle] = useState<'monthly' | 'yearly'>('monthly');

  const [isRenewModalOpen, setIsRenewModalOpen] = useState<boolean>(false);
  const [selectedOrgForRenew, setSelectedOrgForRenew] = useState<any | null>(null);
  const [renewMonths, setRenewMonths] = useState<number>(1);
  const [renewPaymentMethod, setRenewPaymentMethod] = useState<'bKash' | 'Nagad' | 'Bank' | 'Cash' | 'Card'>('bKash');

  const [selectedInvoice, setSelectedInvoice] = useState<PaymentRecord | null>(null);

  // Form State for Package
  const [pkgFormData, setPkgFormData] = useState<Partial<PackageTier>>({
    packageCode: '',
    nameBangla: '',
    nameEnglish: '',
    description: '',
    priceMonthly: 0,
    priceYearly: 0,
    trialDays: 14,
    maxEmployees: 5,
    maxMembers: 500,
    maxBranches: 1,
    maxStorageMB: 2000,
    maxDailyCollection: 500,
    status: 'active',
    features: ['dashboard', 'members', 'daily_collection', 'receipt_printing']
  });

  // Realtime Data Sync
  useEffect(() => {
    setLoading(true);
    
    // 1. Subscribe Packages
    const unsubPkgs = SubscriptionService.subscribePackages((data) => {
      setPackages(data);
      setLoading(false);
    });

    // 2. Subscribe Subscriptions
    const unsubSubs = SubscriptionService.subscribeSubscriptions((data) => {
      setSubscriptions(data);
    });

    // 3. Subscribe Payments
    const unsubPayments = SubscriptionService.subscribePaymentHistory((data) => {
      setPayments(data);
    });

    return () => {
      unsubPkgs();
      unsubSubs();
      unsubPayments();
    };
  }, []);

  // ------------------------------------------------------------------
  // PACKAGE ACTIONS
  // ------------------------------------------------------------------

  const handleOpenCreatePkg = () => {
    setEditingPkg(null);
    setPkgFormData({
      packageCode: `PKG-NEW-${Math.floor(10 + Math.random() * 90)}`,
      nameBangla: '',
      nameEnglish: '',
      description: '',
      priceMonthly: 1000,
      priceYearly: 10000,
      trialDays: 14,
      maxEmployees: 5,
      maxMembers: 500,
      maxBranches: 1,
      maxStorageMB: 2000,
      maxDailyCollection: 500,
      status: 'active',
      features: ['dashboard', 'members', 'daily_collection', 'receipt_printing']
    });
    setIsPkgModalOpen(true);
  };

  const handleOpenEditPkg = (pkg: PackageTier) => {
    setEditingPkg(pkg);
    setPkgFormData(pkg);
    setIsPkgModalOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgFormData.nameBangla || !pkgFormData.packageCode) {
      alert('প্যাকেজের নাম ও কোড বাধ্যতামূলক!');
      return;
    }

    const pkgToSave: PackageTier = {
      id: editingPkg ? editingPkg.id : `pkg_${Date.now()}`,
      packageCode: pkgFormData.packageCode!,
      nameBangla: pkgFormData.nameBangla!,
      nameEnglish: pkgFormData.nameEnglish || pkgFormData.nameBangla!,
      description: pkgFormData.description || '',
      priceMonthly: Number(pkgFormData.priceMonthly || 0),
      priceYearly: Number(pkgFormData.priceYearly || 0),
      trialDays: Number(pkgFormData.trialDays || 0),
      maxEmployees: Number(pkgFormData.maxEmployees || 0),
      maxMembers: Number(pkgFormData.maxMembers || 0),
      maxBranches: Number(pkgFormData.maxBranches || 1),
      maxStorageMB: Number(pkgFormData.maxStorageMB || 1000),
      maxDailyCollection: Number(pkgFormData.maxDailyCollection || 100),
      status: pkgFormData.status as 'active' | 'inactive',
      features: pkgFormData.features || []
    };

    await SubscriptionService.savePackage(pkgToSave);
    setIsPkgModalOpen(false);
  };

  const handleClonePackage = async (pkg: PackageTier) => {
    if (window.confirm(`আপনি কি "${pkg.nameBangla}" প্যাকেজটি ক্লোন করতে চান?`)) {
      await SubscriptionService.clonePackage(pkg);
    }
  };

  const handleDeletePackage = async (pkgId: string, pkgName: string) => {
    if (window.confirm(`আপনি কি নিশ্চিতভাবে "${pkgName}" প্যাকেজটি ডিলিট করতে চান?`)) {
      await SubscriptionService.deletePackage(pkgId);
    }
  };

  const handleTogglePackageStatus = async (pkg: PackageTier) => {
    await SubscriptionService.togglePackageStatus(pkg.id, pkg.status);
  };

  const toggleFeatureInForm = (featureKey: string) => {
    setPkgFormData(prev => {
      const currentFeatures = prev.features || [];
      if (currentFeatures.includes(featureKey)) {
        return { ...prev, features: currentFeatures.filter(f => f !== featureKey) };
      } else {
        return { ...prev, features: [...currentFeatures, featureKey] };
      }
    });
  };

  // ------------------------------------------------------------------
  // FEATURE MATRIX QUICK TOGGLE
  // ------------------------------------------------------------------

  const handleToggleFeatureForPkgInMatrix = async (pkg: PackageTier, featureKey: string) => {
    const isEnabled = pkg.features.includes(featureKey);
    const updatedFeatures = isEnabled 
      ? pkg.features.filter(f => f !== featureKey)
      : [...pkg.features, featureKey];

    const updatedPkg = { ...pkg, features: updatedFeatures };
    await SubscriptionService.savePackage(updatedPkg);
  };

  // ------------------------------------------------------------------
  // SUBSCRIPTION ASSIGN & RENEW ACTIONS
  // ------------------------------------------------------------------

  const handleOpenAssignModal = (org: any) => {
    setSelectedOrgForAssign(org);
    setAssignPackageId(org.packageId || 'starter');
    setIsAssignModalOpen(true);
  };

  const handleSaveAssignPackage = async () => {
    if (!selectedOrgForAssign || !assignPackageId) return;
    const pkg = packages.find(p => p.id === assignPackageId);
    if (!pkg) return;

    await SubscriptionService.assignPackageToOrg(
      selectedOrgForAssign.id,
      selectedOrgForAssign.orgName,
      pkg,
      assignCycle
    );

    setIsAssignModalOpen(false);
  };

  const handleOpenRenewModal = (org: any) => {
    setSelectedOrgForRenew(org);
    setRenewMonths(1);
    setRenewPaymentMethod('bKash');
    setIsRenewModalOpen(true);
  };

  const handleSaveRenewSubscription = async () => {
    if (!selectedOrgForRenew) return;
    const pkg = packages.find(p => p.id === selectedOrgForRenew.packageId) || packages[0];
    if (!pkg) return;

    await SubscriptionService.renewSubscription(
      selectedOrgForRenew.id,
      selectedOrgForRenew.orgName,
      pkg,
      renewMonths,
      renewPaymentMethod,
      'Super Admin'
    );

    setIsRenewModalOpen(false);
  };

  const handleUpdateSubscriptionStatus = async (subId: string, tenantId: string, status: SubscriptionStatus) => {
    if (window.confirm(`সাবস্ক্রিপশন স্ট্যাটাস "${status}" পরিবর্তন করতে চান?`)) {
      await SubscriptionService.updateSubscriptionStatus(subId, status, tenantId);
    }
  };

  // Filtered Lists
  const filteredPackages = packages.filter(p => {
    const matchesSearch = p.nameBangla.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.packageCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredFeatures = ALL_SYSTEM_FEATURES.filter(f => {
    return featureCategoryFilter === 'all' || f.category === featureCategoryFilter;
  });

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium">
        সাবস্ক্রিপশন ও প্যাকেজ ডাটা লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-5 rounded-2xl text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold tracking-tight">সাবস্ক্রিপশন, প্যাকেজ ও ফিচার ম্যানেজার</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/30 text-purple-200 text-xs font-semibold">
              SaaS Monetization Core
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            সুপার এডমিন হিসেবে নতুন সাবস্ক্রিপশন প্যাকেজ তৈরি, প্রাইসিং নির্ধারণ, ফিচার পারমিশন অন/অফ এবং অর্গানাইজেশনের লাইসেন্স রিনিউ ও পেমেন্ট হিস্ট্রি পরিচালনা করুন।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenCreatePkg}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন প্যাকেজ তৈরি করুন</span>
          </button>
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('packages')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'packages'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>প্যাকেজ ও প্রাইসিং ({packages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('features')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'features'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>ফিচার ম্যাট্রিক্স ম্যানেজার ({ALL_SYSTEM_FEATURES.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'subscriptions'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>সাবস্ক্রিপশন ও অ্যাসাইন ({MOCK_ORGANIZATIONS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'payments'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>পেমেন্ট হিস্ট্রি ও ইনভয়েস ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('expiry')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'expiry'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>অটো-এক্সপায়ারি ও মেম্বার ব্লক সিস্টেম</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: PACKAGES & PRICING CARDS & MANAGEMENT
         ===================================================================== */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          
          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="প্যাকেজের নাম বা কোড দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  statusFilter === 'all' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                সকল ({packages.length})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  statusFilter === 'active' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                একটিভ ({packages.filter(p => p.status === 'active').length})
              </button>
              <button
                onClick={() => setStatusFilter('inactive')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  statusFilter === 'inactive' ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                ইন-একটিভ ({packages.filter(p => p.status === 'inactive').length})
              </button>
            </div>
          </div>

          {/* Package Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                  pkg.isPopular
                    ? 'border-purple-500 ring-2 ring-purple-500/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {pkg.isPopular && (
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider text-center py-1">
                    ★ সর্বাধিক জনপ্রিয় মোস্ট চয়েস
                  </div>
                )}

                <div className="p-5 space-y-4 flex-1">
                  
                  {/* Header & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-extrabold text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                        {pkg.packageCode}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                        {pkg.nameBangla}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleTogglePackageStatus(pkg)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                        pkg.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300'
                      }`}
                    >
                      {pkg.status === 'active' ? 'একটিভ' : 'নিষ্ক্রিয়'}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {pkg.description}
                  </p>

                  {/* Price Banner */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white">৳ {pkg.priceMonthly}</span>
                      <span className="text-[10px] text-slate-500">/ মাস</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      বাৎসরিক: ৳ {pkg.priceYearly} (ট্রায়াল: {pkg.trialDays} দিন)
                    </div>
                  </div>

                  {/* Quota Limits */}
                  <div className="space-y-1.5 text-[11px] border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-purple-500" />
                        সর্বোচ্চ মেম্বার:
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{pkg.maxMembers} জন</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-purple-500" />
                        সর্বোচ্চ স্টাফ:
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{pkg.maxEmployees} জন</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-purple-500" />
                        সর্বোচ্চ ব্রাঞ্চ:
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{pkg.maxBranches} টি</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <Database className="w-3.5 h-3.5 text-purple-500" />
                        স্টোরেজ স্পেস:
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{pkg.maxStorageMB} MB</span>
                    </div>
                  </div>

                  {/* Feature Checklist Summary */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      ফিচারসমূহ ({pkg.features.length} টি চালু):
                    </span>
                    <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                      {pkg.features.slice(0, 6).map((featKey) => {
                        const featDef = ALL_SYSTEM_FEATURES.find(f => f.key === featKey);
                        return (
                          <div key={featKey} className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="truncate">{featDef?.nameBangla || featKey}</span>
                          </div>
                        );
                      })}
                      {pkg.features.length > 6 && (
                        <span className="text-[10px] text-purple-600 font-bold block pt-0.5">
                          + আরও {pkg.features.length - 6} টি অনিক্রিভ ফিচার...
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Card Action Buttons */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1">
                  <button
                    onClick={() => handleOpenEditPkg(pkg)}
                    className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>এডিট</span>
                  </button>

                  <button
                    onClick={() => handleClonePackage(pkg)}
                    className="p-1.5 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg text-[11px] font-bold transition-all"
                    title="প্যাকেজ ক্লোন করুন"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeletePackage(pkg.id, pkg.nameBangla)}
                    className="p-1.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 rounded-lg text-[11px] font-bold transition-all"
                    title="ডিলিট করুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* =====================================================================
          TAB 2: FEATURE MATRIX MANAGER
         ===================================================================== */}
      {activeTab === 'features' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-4 p-5">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-600" />
                সিস্টেম ফিচার পারমিশন ম্যাট্রিক্স
              </h3>
              <p className="text-xs text-slate-500">
                এক ক্লিকে যেকোনো প্যাকেজের জন্য ফিচার সক্রিয় বা নিষ্ক্রিয় করুন
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['all', 'core', 'reports', 'integrations', 'advanced'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFeatureCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    featureCategoryFilter === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cat === 'all' ? 'সকল ফিচার' : cat === 'core' ? 'কোর' : cat === 'reports' ? 'রিপোর্ট' : cat === 'integrations' ? 'ইন্টিগ্রেশন' : 'এডভান্সড'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3.5">ফিচারের নাম ও বিবরণ</th>
                  <th className="p-3.5">ক্যাটাগরি</th>
                  {packages.map((pkg) => (
                    <th key={pkg.id} className="p-3.5 text-center min-w-[120px]">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{pkg.nameBangla}</p>
                        <p className="text-[10px] font-mono text-purple-600">৳{pkg.priceMonthly}/মাস</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                {filteredFeatures.map((feat) => (
                  <tr key={feat.key} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900 dark:text-white">{feat.nameBangla}</p>
                      <p className="text-[10px] text-slate-400">{feat.description}</p>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600">
                        {feat.category}
                      </span>
                    </td>

                    {packages.map((pkg) => {
                      const isEnabled = pkg.features.includes(feat.key);
                      return (
                        <td key={pkg.id} className="p-3.5 text-center">
                          <button
                            onClick={() => handleToggleFeatureForPkgInMatrix(pkg, feat.key)}
                            className={`p-2 rounded-xl transition-all inline-flex items-center justify-center ${
                              isEnabled
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-800'
                            }`}
                            title={isEnabled ? 'ফিচারটি বন্ধ করুন' : 'ফিচারটি চালু করুন'}
                          >
                            {isEnabled ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-slate-400" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* =====================================================================
          TAB 3: SUBSCRIPTION & ASSIGN TO ORGANIZATIONS
         ===================================================================== */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-purple-600" />
              অর্গানাইজেশন সাবস্ক্রিপশন ও প্যাকেজ অ্যাসাইন তালিকা
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3.5">অর্গানাইজেশন</th>
                  <th className="p-3.5">বর্তমান প্যাকেজ</th>
                  <th className="p-3.5">মেয়াদের তারিখ (Start - End)</th>
                  <th className="p-3.5">স্ট্যাটাস</th>
                  <th className="p-3.5 text-right">ম্যানেজমেন্ট অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                {MOCK_ORGANIZATIONS.map((org) => {
                  const currentPkg = packages.find(p => p.id === org.packageId);
                  const expiryCheck = SubscriptionService.checkOrgSubscriptionExpiry(org.subscriptionEnd, org.status);

                  return (
                    <tr key={org.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900 dark:text-white">{org.orgName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{org.phone} • {org.orgCategory}</p>
                      </td>

                      <td className="p-3.5">
                        <span className="font-extrabold text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded border border-purple-200 text-[11px]">
                          {currentPkg?.nameBangla || org.packageId}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">৳ {currentPkg?.priceMonthly || 0} / মাস</p>
                      </td>

                      <td className="p-3.5 font-mono">
                        <p>{org.subscriptionStart} হতে</p>
                        <p className="font-bold text-slate-900 dark:text-white">{org.subscriptionEnd}</p>
                      </td>

                      <td className="p-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block ${
                          expiryCheck.isExpired
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : expiryCheck.daysRemaining <= 5
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          {expiryCheck.isExpired ? 'মেয়াদোত্তীর্ণ / ব্লকড' : `${expiryCheck.daysRemaining} দিন বাকি আছে`}
                        </span>
                      </td>

                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenAssignModal(org)}
                          className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold rounded-lg transition-all text-[11px]"
                        >
                          প্যাকেজ চেঞ্জ
                        </button>

                        <button
                          onClick={() => handleOpenRenewModal(org)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all text-[11px]"
                        >
                          রিনিউ ও পেমেন্ট
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: PAYMENT HISTORY & INVOICE RECORDS
         ===================================================================== */}
      {activeTab === 'payments' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-600" />
              পেমেন্ট কালেকশন রেকর্ডস ও ইনভয়েস ইতিহাস
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3.5">ইনভয়েস নং</th>
                  <th className="p-3.5">অর্গানাইজেশন</th>
                  <th className="p-3.5">প্যাকেজ</th>
                  <th className="p-3.5">পরিমাণ</th>
                  <th className="p-3.5">মেথড</th>
                  <th className="p-3.5">পেমেন্ট তারিখ</th>
                  <th className="p-3.5">নতুন মেয়াদ</th>
                  <th className="p-3.5">স্ট্যাটাস</th>
                  <th className="p-3.5 text-right">রিসিপ্ট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                {payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 font-bold text-purple-600">{pay.invoiceNumber}</td>
                    <td className="p-3.5 font-sans font-bold text-slate-900 dark:text-white">{pay.tenantName}</td>
                    <td className="p-3.5 font-sans">{pay.packageName}</td>
                    <td className="p-3.5 font-bold text-emerald-600">৳ {pay.amount}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-sans font-bold text-[10px]">
                        {pay.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3.5">{pay.paymentDate}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{pay.renewedUntil}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 font-sans">
                        {pay.status === 'paid' ? 'পরিশোধিত' : pay.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-sans">
                      <button
                        onClick={() => setSelectedInvoice(pay)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-purple-600 rounded-lg transition-all"
                        title="ইনভয়েস দেখুন"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: AUTO EXPIRY MONITORING & BLOCK SIMULATION
         ===================================================================== */}
      {activeTab === 'expiry' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs text-slate-400 font-bold">এক্টিভ সাবস্ক্রিপশন</span>
              <p className="text-2xl font-extrabold text-emerald-600">৩ টি</p>
              <p className="text-[11px] text-slate-500">সবাই সচলভাবে সার্ভিস পাচ্ছে</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs text-slate-400 font-bold">মেয়াদ শেষের পথে (রিমাইন্ডার প্রেরিত)</span>
              <p className="text-2xl font-extrabold text-amber-600">১ টি</p>
              <p className="text-[11px] text-slate-500">৫ দিনের মধ্যে মেয়াদ শেষ হবে</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs text-slate-400 font-bold">মেয়াদোত্তীর্ণ ও সম্পূর্ণ ব্লকড</span>
              <p className="text-2xl font-extrabold text-rose-600">১ টি</p>
              <p className="text-[11px] text-slate-500">লগইন অটোমেটিক্যালি ব্লক করা আছে</p>
            </div>
          </div>

          {/* Auto Expiry Interactive Demo Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              অটো এক্সপায়ারি ওয়ার্নিং নোটিশ ও লগইন ব্লক স্ক্রিন প্রিভিউ
            </h3>

            {/* Expired Login Block Card Mockup */}
            <div className="max-w-md mx-auto bg-slate-950 p-6 rounded-2xl border border-rose-800 text-white space-y-4 text-center shadow-xl">
              <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/40">
                <Ban className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-base text-rose-400">সাবস্ক্রিপশনের মেয়াদোত্তীর্ণ - একসেস স্থগিত!</h4>
                <p className="text-xs text-slate-300">
                  আপনার অর্গানাইজেশনের সাবস্ক্রিপশনের মেয়াদ শেষ হয়ে গেছে। পুনরায় সফটওয়্যার ব্যবহার করতে আপনার লাইসেন্স রিনিউ করুন।
                </p>
              </div>

              <div className="p-3 bg-rose-950/60 rounded-xl border border-rose-800 text-[11px] text-rose-200 space-y-1 text-left">
                <div className="flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>আপনার সমস্ত মেম্বার ও কালেকশন ডাটা ১০০% নিরাপদ আছে</span>
                </div>
                <p className="text-[10px] opacity-80">পেমেন্ট কনফার্ম হওয়ার সাথে সাথে অটো এক্টিভ হয়ে যাবে।</p>
              </div>

              <button className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-white font-bold text-xs rounded-xl shadow-md">
                অনলাইন লাইসেন্স রিনিউ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          CREATE / EDIT PACKAGE MODAL
         ===================================================================== */}
      {isPkgModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                {editingPkg ? 'প্যাকেজ সম্পাদনা করুন' : 'নতুন সাবস্ক্রিপশন প্যাকেজ তৈরি করুন'}
              </h3>
              <button onClick={() => setIsPkgModalOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">প্যাকেজ কোড *</label>
                  <input
                    type="text"
                    value={pkgFormData.packageCode || ''}
                    onChange={(e) => setPkgFormData({ ...pkgFormData, packageCode: e.target.value })}
                    required
                    placeholder="যেমন: PKG-PRO-02"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">প্যাকেজের নাম (বাংলা) *</label>
                  <input
                    type="text"
                    value={pkgFormData.nameBangla || ''}
                    onChange={(e) => setPkgFormData({ ...pkgFormData, nameBangla: e.target.value })}
                    required
                    placeholder="যেমন: প্রফেশনাল প্যাকেজ"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">মাসিক মূল্য (টাকা)</label>
                  <input
                    type="number"
                    value={pkgFormData.priceMonthly || 0}
                    onChange={(e) => setPkgFormData({ ...pkgFormData, priceMonthly: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">বাৎসরিক মূল্য (টাকা)</label>
                  <input
                    type="number"
                    value={pkgFormData.priceYearly || 0}
                    onChange={(e) => setPkgFormData({ ...pkgFormData, priceYearly: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">সর্বোচ্চ মেম্বার সংখ্যা</label>
                  <input
                    type="number"
                    value={pkgFormData.maxMembers || 0}
                    onChange={(e) => setPkgFormData({ ...pkgFormData, maxMembers: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">সর্বোচ্চ এমপ্লয়ি সংখ্যা</label>
                  <input
                    type="number"
                    value={pkgFormData.maxEmployees || 0}
                    onChange={(e) => setPkgFormData({ ...pkgFormData, maxEmployees: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Feature Selection Grid */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block font-bold text-slate-900 dark:text-white">
                  প্যাকেজের ফিচারসমূহ সিলেকশন ({pkgFormData.features?.length || 0} টি টি সিলেক্টেড):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border">
                  {ALL_SYSTEM_FEATURES.map((feat) => {
                    const isChecked = pkgFormData.features?.includes(feat.key);
                    return (
                      <label
                        key={feat.key}
                        onClick={() => toggleFeatureInForm(feat.key)}
                        className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center gap-2 select-none ${
                          isChecked
                            ? 'bg-purple-100 border-purple-300 text-purple-900 dark:bg-purple-950/60 dark:text-purple-200 font-bold'
                            : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-purple-600"
                        />
                        <span className="truncate">{feat.nameBangla}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPkgModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
                >
                  সংরক্ষণ করুন
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          ASSIGN PACKAGE MODAL
         ===================================================================== */}
      {isAssignModalOpen && selectedOrgForAssign && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              প্যাকেজ পরিবর্তন: {selectedOrgForAssign.orgName}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">নতুন প্যাকেজ নির্বাচন করুন</label>
                <select
                  value={assignPackageId}
                  onChange={(e) => setAssignPackageId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                >
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nameBangla} - ৳{p.priceMonthly}/মাস
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">বিলিং সাইকেল</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAssignCycle('monthly')}
                    className={`flex-1 py-2 rounded-xl font-bold border ${
                      assignCycle === 'monthly' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    মাসিক
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignCycle('yearly')}
                    className={`flex-1 py-2 rounded-xl font-bold border ${
                      assignCycle === 'yearly' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    বাৎসরিক
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setIsAssignModalOpen(false)} className="px-4 py-2 bg-slate-100 font-bold rounded-xl text-xs">
                বাতিল
              </button>
              <button onClick={handleSaveAssignPackage} className="px-5 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs">
                অ্যাসাইন করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          RENEW SUBSCRIPTION MODAL
         ===================================================================== */}
      {isRenewModalOpen && selectedOrgForRenew && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              সাবস্ক্রিপশন রিনিউ: {selectedOrgForRenew.orgName}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">রিনিউ মেয়াদ (মাস)</label>
                <select
                  value={renewMonths}
                  onChange={(e) => setRenewMonths(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                >
                  <option value={1}>১ মাস</option>
                  <option value={3}>৩ মাস</option>
                  <option value={6}>৬ মাস</option>
                  <option value={12}>১ বছর (১২ মাস)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">পেমেন্ট মেথড</label>
                <select
                  value={renewPaymentMethod}
                  onChange={(e) => setRenewPaymentMethod(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                >
                  <option value="bKash">bKash (বিকাশ)</option>
                  <option value="Nagad">Nagad (নগদ)</option>
                  <option value="Bank">Bank Transfer</option>
                  <option value="Cash">Cash (নগদ জমা)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setIsRenewModalOpen(false)} className="px-4 py-2 bg-slate-100 font-bold rounded-xl text-xs">
                বাতিল
              </button>
              <button onClick={handleSaveRenewSubscription} className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">
                পেমেন্ট রিসিভ ও রিনিউ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          INVOICE PRINT MODAL
         ===================================================================== */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 text-slate-900 shadow-2xl border">
            <div className="text-center border-b pb-4 space-y-1">
              <h2 className="font-extrabold text-lg">আবাবিল ইআরপি - অফিসিয়াল ইনভয়েস</h2>
              <p className="text-xs text-slate-500 font-mono">Invoice #: {selectedInvoice.invoiceNumber}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">অর্গানাইজেশন:</span>
                <span className="font-bold">{selectedInvoice.tenantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">প্যাকেজ:</span>
                <span className="font-bold">{selectedInvoice.packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">পরিশোধিত পরিমাণ:</span>
                <span className="font-extrabold text-emerald-600">৳ {selectedInvoice.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">মেথড & ট্রানজেকশন:</span>
                <span className="font-mono font-bold">{selectedInvoice.paymentMethod} ({selectedInvoice.transactionId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">নতুন মেয়াদ:</span>
                <span className="font-mono font-bold">{selectedInvoice.renewedUntil} পর্যন্ত</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button onClick={() => setSelectedInvoice(null)} className="px-4 py-2 bg-slate-100 font-bold rounded-xl text-xs">
                বন্ধ করুন
              </button>
              <button onClick={() => window.print()} className="px-5 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs flex items-center gap-1">
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট ইনভয়েস</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
