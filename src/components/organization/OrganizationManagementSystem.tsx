import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, Plus, Search, Filter, RefreshCw, Eye, Edit3, Lock, CheckCircle2, 
  Trash2, Key, LogIn, ChevronLeft, ChevronRight, Layers, ShieldCheck, AlertCircle, 
  Copy, Check, User, Phone, MapPin, Sparkles, Download, ArrowUpDown
} from 'lucide-react';
import { OrganizationTenant, OrgStatus, OrgCategory, PackageTier } from '../../types/saas';
import { OrganizationService } from '../../services/organizationService';
import { MOCK_PACKAGES } from '../../data/mockSaaSData';
import { CreateEditOrgModal } from './CreateEditOrgModal';
import { OrgProfileModal } from './OrgProfileModal';
import { ImpersonationBanner } from './ImpersonationBanner';

interface OrganizationManagementSystemProps {
  onImpersonateOrg?: (org: OrganizationTenant) => void;
  activeImpersonatedOrg?: OrganizationTenant | null;
  onExitImpersonation?: () => void;
}

export const OrganizationManagementSystem: React.FC<OrganizationManagementSystemProps> = ({
  onImpersonateOrg,
  activeImpersonatedOrg,
  onExitImpersonation
}) => {
  // State
  const [organizations, setOrganizations] = useState<OrganizationTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'orgName' | 'monthlyRevenue' | 'memberCount'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals
  const [isCreateEditOpen, setIsCreateEditOpen] = useState(false);
  const [selectedOrgForEdit, setSelectedOrgForEdit] = useState<OrganizationTenant | null>(null);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedOrgForProfile, setSelectedOrgForProfile] = useState<OrganizationTenant | null>(null);

  const [passwordResetOrg, setPasswordResetOrg] = useState<{ org: OrganizationTenant; tempPass: string } | null>(null);
  const [copiedPass, setCopiedPass] = useState(false);

  const [deleteConfirmOrg, setDeleteConfirmOrg] = useState<OrganizationTenant | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Real-time Firestore Subscription
  useEffect(() => {
    setLoading(true);
    const unsubscribe = OrganizationService.subscribeOrganizations(
      (data) => {
        setOrganizations(data || []);
        setLoading(false);
      },
      (err) => {
        console.warn('Real-time listener warning:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleClearAllDemoData = async () => {
    if (confirm('আপনি কি নিশ্চিত যে সকল ডেমো অর্গানাইজেশন স্থায়ীভাবে মুছে ফেলতে চান? এটি মুছে ফেললে ডাটাবেস সম্পূর্ণ ফাকা হয়ে যাবে।')) {
      setLoading(true);
      try {
        await OrganizationService.clearAllOrganizations();
        setOrganizations([]);
        showToast('সকল ডেমো ডাটা সফলভাবে মুছে ফেলা হয়েছে!', 'success');
      } catch (err) {
        showToast('ডেমো ডাটা মুছতে ত্রুটি হয়েছে', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestoreDemoData = async () => {
    setLoading(true);
    try {
      await OrganizationService.seedInitialOrganizations();
      showToast('ডেমো ডাটা সফলভাবে ডাটাবেসে লোড করা হয়েছে!', 'success');
    } catch (err) {
      showToast('ডেমো ডাটা লোড করতে ত্রুটি হয়েছে', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtered & Sorted Organizations
  const filteredOrganizations = useMemo(() => {
    return organizations
      .filter((org) => {
        if (org.isDeleted) return false;

        const matchSearch = 
          org.orgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (org.orgCode && org.orgCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
          org.phone.includes(searchTerm) ||
          org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (org.ownerName && org.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          org.address.toLowerCase().includes(searchTerm.toLowerCase());

        const matchStatus = statusFilter === 'all' || org.status === statusFilter;
        const matchCategory = categoryFilter === 'all' || org.orgCategory === categoryFilter;

        return matchSearch && matchStatus && matchCategory;
      })
      .sort((a, b) => {
        let valA: any = a[sortBy as keyof OrganizationTenant] || '';
        let valB: any = b[sortBy as keyof OrganizationTenant] || '';

        if (sortBy === 'monthlyRevenue') {
          valA = a.monthlyRevenueEstimate || 0;
          valB = b.monthlyRevenueEstimate || 0;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [organizations, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

  // Paginated data
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage) || 1;
  const paginatedOrgs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrganizations.slice(start, start + itemsPerPage);
  }, [filteredOrganizations, currentPage, itemsPerPage]);

  // Status Metrics
  const metrics = useMemo(() => {
    const total = organizations.filter(o => !o.isDeleted).length;
    const active = organizations.filter(o => !o.isDeleted && o.status === 'active').length;
    const trial = organizations.filter(o => !o.isDeleted && o.status === 'trial').length;
    const suspended = organizations.filter(o => !o.isDeleted && (o.status === 'suspended' || o.status === 'expired')).length;
    const totalRevenue = organizations.filter(o => !o.isDeleted).reduce((sum, o) => sum + (o.monthlyRevenueEstimate || 0), 0);

    return { total, active, trial, suspended, totalRevenue };
  }, [organizations]);

  // Handlers
  const handleOpenCreate = () => {
    setSelectedOrgForEdit(null);
    setIsCreateEditOpen(true);
  };

  const handleOpenEdit = (org: OrganizationTenant) => {
    setSelectedOrgForEdit(org);
    setIsCreateEditOpen(true);
  };

  const handleOpenProfile = (org: OrganizationTenant) => {
    setSelectedOrgForProfile(org);
    setIsProfileOpen(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: OrgStatus) => {
    const org = organizations.find(o => o.id === id);
    const newStatus: OrgStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    
    try {
      await OrganizationService.setStatus(id, newStatus, org?.orgName || id);
      showToast(
        newStatus === 'active' 
          ? `'${org?.orgName}' সফলভাবে সক্রিয় করা হয়েছে!` 
          : `'${org?.orgName}' স্থগিত (Suspend) করা হয়েছে!`,
        newStatus === 'active' ? 'success' : 'info'
      );
    } catch (e) {
      showToast('স্ট্যাটাস পরিবর্তনে ত্রুটি হয়েছে', 'error');
    }
  };

  const handleResetPassword = async (org: OrganizationTenant) => {
    try {
      const { tempPassword } = await OrganizationService.resetAdminPassword(org.id, org.email, org.orgName);
      setPasswordResetOrg({ org, tempPass: tempPassword });
      setCopiedPass(false);
    } catch (e) {
      showToast('পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে', 'error');
    }
  };

  const handleSoftDeleteConfirm = async () => {
    if (!deleteConfirmOrg) return;
    setDeleteLoading(true);
    try {
      await OrganizationService.softDelete(deleteConfirmOrg.id, deleteConfirmOrg.orgName);
      setOrganizations(prev => prev.filter(o => o.id !== deleteConfirmOrg.id));
      showToast(`'${deleteConfirmOrg.orgName}' সফলভাবে ডিলিট করা হয়েছে`, 'info');
      setDeleteConfirmOrg(null);
    } catch (e) {
      showToast('ডিলিট অপারেশনে সমস্যা হয়েছে', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleImpersonate = (org: OrganizationTenant) => {
    if (onImpersonateOrg) {
      onImpersonateOrg(org);
      showToast(`ইম্পারসোনেশন চালু হয়েছে: ${org.orgName}`, 'success');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-2xl text-xs font-black flex items-center gap-2 border border-white/20 animate-slide-down ${
          toastMessage.type === 'success' ? 'bg-emerald-600 text-white' :
          toastMessage.type === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'
        }`}>
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Active Impersonation Mode Top Banner */}
      {activeImpersonatedOrg && onExitImpersonation && (
        <ImpersonationBanner 
          organization={activeImpersonatedOrg} 
          onExit={onExitImpersonation} 
        />
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-black uppercase tracking-wider">
              সুপার এডমিন মডিউল
            </span>
            <span className="text-xs text-slate-400 font-mono">
              PROMPT-07 Connected
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-purple-600" />
            অর্গানাইজেশন ম্যানেজমেন্ট সিস্টেম (Organization System)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            সকল রেজিস্টার্ড অটো চার্জিং গ্যারেজ, টার্মিনাল ও সমিতির প্রোফাইল, প্যাকেজ ও এক্সেস কন্ট্রোল করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {organizations.length > 0 && (
            <button
              onClick={handleClearAllDemoData}
              className="px-4 py-3 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2"
              title="সকল ডেমো অর্গানাইজেশন মুছে ফেলুন"
            >
              <Trash2 className="w-4 h-4" />
              <span>সকল ডেমো ডাটা মুছুন</span>
            </button>
          )}

          {organizations.length === 0 && (
            <button
              onClick={handleRestoreDemoData}
              className="px-4 py-3 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>ডেমো ডাটা লোড করুন</span>
            </button>
          )}

          <button
            onClick={handleOpenCreate}
            className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন অর্গানাইজেশন যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">মোট প্রতিষ্ঠান</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{metrics.total} টি</p>
          <span className="text-[10px] font-bold text-emerald-600">১০০% ক্লাউড সিঙ্কড</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">সক্রিয় গ্যারেজ</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{metrics.active} টি</p>
          <span className="text-[10px] text-slate-400">লাইভ সার্ভিসিং চালু</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">ফ্রি ট্রায়াল মোড</span>
          <p className="text-2xl font-black text-amber-500 mt-1">{metrics.trial} টি</p>
          <span className="text-[10px] text-slate-400">১৪ দিনের ট্রায়াল</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">স্থগিত / এক্সপায়ার্ড</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{metrics.suspended} টি</p>
          <span className="text-[10px] text-slate-400">অ্যাক্সেস বন্ধ</span>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-3xl border border-purple-800 shadow-md col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider block">মাসিক সাবস্ক্রিপশন</span>
          <p className="text-2xl font-black text-amber-300 mt-1">৳ {metrics.totalRevenue.toLocaleString()}</p>
          <span className="text-[10px] text-purple-200">মোট আনুমানিক আয়</span>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="নাম, কোড, মোবাইল বা ঠিকানা দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
            >
              <option value="all">সকল স্ট্যাটাস (All Status)</option>
              <option value="active">একটিভ (Active)</option>
              <option value="trial">ফ্রি ট্রায়াল (Trial)</option>
              <option value="suspended">স্থগিত (Suspended)</option>
              <option value="expired">মেয়াদোত্তীর্ণ (Expired)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
            >
              <option value="all">সকল গ্যারেজ ক্যাটাগরি</option>
              <option value="Auto Garage">Auto Garage</option>
              <option value="Auto Stand">Auto Stand</option>
              <option value="Rickshaw Garage">Rickshaw Garage</option>
              <option value="CNG Garage">CNG Garage</option>
              <option value="Truck Garage">Truck Garage</option>
              <option value="Bus Counter">Bus Counter</option>
              <option value="Samity">Samity</option>
              <option value="Society">Society</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="lg:col-span-2 flex items-center gap-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
            >
              <option value="createdAt">নতুন সংযোজন</option>
              <option value="orgName">নামের আদ্যক্ষর</option>
              <option value="monthlyRevenue">রেভিনিউ পরিমাণ</option>
              <option value="memberCount">মেম্বার সংখ্যা</option>
            </select>

            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 text-xs font-bold shrink-0"
              title="সর্টিং ডিরেকশন চেঞ্জ"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">ফায়ারস্টোর লাইভ ডাটা লোড হচ্ছে...</p>
          </div>
        ) : paginatedOrgs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">কোনো অর্গানাইজেশন পাওয়া যায়নি</p>
            <p className="text-xs text-slate-400">ফিল্টার পরিবর্তন করুন অথবা নতুন একটি তৈরি করুন।</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-4">প্রতিষ্ঠান ও কোড</th>
                  <th className="py-4 px-4">ধরণ ও মালিক</th>
                  <th className="py-4 px-4">যোগাযোগ ও স্থান</th>
                  <th className="py-4 px-4">প্যাকেজ ও রেভিনিউ</th>
                  <th className="py-4 px-4">মেম্বার / স্টাফ</th>
                  <th className="py-4 px-4">স্ট্যাটাস</th>
                  <th className="py-4 px-4 text-right">একশনস (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {paginatedOrgs.map((org) => {
                  const pkg = MOCK_PACKAGES.find(p => p.id === org.packageId);
                  const isSuspended = org.status === 'suspended';
                  const isExpired = org.status === 'expired';

                  return (
                    <tr 
                      key={org.id} 
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all group"
                    >
                      {/* Name & Code */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={org.logoUrl || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=120&auto=format&fit=crop&q=80'} 
                            alt={org.orgName} 
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-white shrink-0" 
                          />
                          <div>
                            <span className="font-mono text-[10px] font-bold text-purple-600 dark:text-purple-400 block">
                              {org.orgCode || org.id}
                            </span>
                            <span className="font-black text-slate-900 dark:text-white block group-hover:text-purple-600 transition-colors">
                              {org.orgName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Owner */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          {org.orgCategory}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          মালিক: {org.ownerName || 'প্রোপাইটর'}
                        </span>
                      </td>

                      {/* Contact & Address */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 dark:text-white block">
                          {org.phone}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                          {org.address}
                        </span>
                      </td>

                      {/* Package & Revenue */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-purple-600 dark:text-purple-300 block uppercase">
                          {pkg?.nameEnglish || org.packageId}
                        </span>
                        <span className="font-black text-emerald-600 block text-[11px]">
                          ৳ {(org.monthlyRevenueEstimate || 0).toLocaleString()}/মাস
                        </span>
                      </td>

                      {/* Member / Staff */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          {org.memberCount} মেম্বার
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {org.employeeCount} স্টাফ
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                          org.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' :
                          org.status === 'trial' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300' :
                          'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            org.status === 'active' ? 'bg-emerald-500' :
                            org.status === 'trial' ? 'bg-amber-500' : 'bg-rose-500'
                          }`} />
                          {org.status}
                        </span>
                      </td>

                      {/* Action Menu Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          
                          {/* Profile */}
                          <button
                            onClick={() => handleOpenProfile(org)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800 transition-all"
                            title="প্রোফাইল দেখুন"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(org)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all"
                            title="সম্পাদনা করুন"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Suspend / Activate */}
                          <button
                            onClick={() => handleToggleStatus(org.id, org.status)}
                            className={`p-1.5 rounded-lg transition-all ${
                              isSuspended 
                                ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40' 
                                : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                            }`}
                            title={isSuspended ? 'সক্রিয় করুন' : 'স্থগিত করুন'}
                          >
                            {isSuspended ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>

                          {/* Password Reset */}
                          <button
                            onClick={() => handleResetPassword(org)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-all"
                            title="এডমিন পাসওয়ার্ড রিসেট"
                          >
                            <Key className="w-4 h-4" />
                          </button>

                          {/* Impersonate */}
                          <button
                            onClick={() => handleImpersonate(org)}
                            className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-950/60 transition-all"
                            title="ইম্পারসোনেট করুন (Login As Admin)"
                          >
                            <LogIn className="w-4 h-4" />
                          </button>

                          {/* Soft Delete */}
                          <button
                            onClick={() => setDeleteConfirmOrg(org)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                            title="সফ্ট ডিলিট"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <span>প্রদর্শন:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            >
              <option value={5}>৫ টি</option>
              <option value={10}>১০ টি</option>
              <option value={20}>২০ টি</option>
              <option value={50}>৫০ টি</option>
            </select>
            <span>
              মোট {filteredOrganizations.length} টি অর্গানাইজেশন এর মধ্যে {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredOrganizations.length)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-all hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-mono font-bold text-slate-800 dark:text-slate-200">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-all hover:bg-slate-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Modals */}
      <CreateEditOrgModal
        isOpen={isCreateEditOpen}
        onClose={() => setIsCreateEditOpen(false)}
        orgToEdit={selectedOrgForEdit}
        packages={MOCK_PACKAGES}
        onSaveSuccess={(savedOrg) => {
          showToast(`'${savedOrg.orgName}' সফলভাবে সংরক্ষণ করা হয়েছে!`, 'success');
        }}
      />

      <OrgProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        organization={selectedOrgForProfile}
        packageDetail={MOCK_PACKAGES.find(p => p.id === selectedOrgForProfile?.packageId)}
        onEdit={handleOpenEdit}
        onToggleStatus={handleToggleStatus}
        onResetPassword={handleResetPassword}
        onImpersonate={handleImpersonate}
        onSoftDelete={(org) => setDeleteConfirmOrg(org)}
      />

      {/* Reset Password Modal */}
      {passwordResetOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-500">
              <Key className="w-8 h-8 p-1.5 bg-amber-500/10 rounded-xl" />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">এডমিন পাসওয়ার্ড রিসেট</h3>
                <p className="text-xs text-slate-500">{passwordResetOrg.org.orgName}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              গ্যারেজ এডমিনের ইমেইল (<strong className="text-purple-600">{passwordResetOrg.org.email}</strong>) এ রিসেট মেসেজ পাঠানো হয়েছে এবং নিমে সাময়িক পাসওয়ার্ড তৈরি করা হয়েছে:
            </p>

            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="font-mono font-black text-lg text-purple-600 tracking-wider">
                {passwordResetOrg.tempPass}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(passwordResetOrg.tempPass);
                  setCopiedPass(true);
                  setTimeout(() => setCopiedPass(false), 2000);
                }}
                className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-purple-500 transition-all"
              >
                {copiedPass ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPass ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
            </div>

            <button
              onClick={() => setPasswordResetOrg(null)}
              className="w-full py-2.5 bg-slate-900 text-white dark:bg-slate-800 text-xs font-bold rounded-xl hover:bg-slate-800"
            >
              বন্ধ করুন (Close)
            </button>
          </div>
        </div>
      )}

      {/* Confirm Soft Delete Modal */}
      {deleteConfirmOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-8 h-8 p-1.5 bg-rose-500/10 rounded-xl" />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">সফ্ট ডিলিট নিশ্চিতকরণ</h3>
                <p className="text-xs text-rose-500 font-bold">{deleteConfirmOrg.orgName}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              আপনি কি নিশ্চিত যে আপনি এই অর্গানাইজেশনটি সফ্ট ডিলিট করতে চান?
              <br />
              <span className="text-[11px] text-slate-400 mt-1 block">
                *(ডাটাবেজ থেকে কোনো হিস্ট্রি মুছে যাবে না, শুধুমাত্র এটি নিষ্ক্রিয় হিসেবে চিহ্নিত হবে)*
              </span>
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmOrg(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
              >
                বাতিল
              </button>
              <button
                onClick={handleSoftDeleteConfirm}
                disabled={deleteLoading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
              >
                {deleteLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>হ্যাঁ, ডিলিট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
