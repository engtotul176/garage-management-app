import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Search, Filter, Download, Upload, RefreshCw, 
  Eye, Edit3, ShieldAlert, CheckCircle, Trash2, QrCode, Barcode, 
  Phone, Mail, MapPin, Calendar, FileText, CreditCard, Send, 
  Lock, X, Printer, Check, User, AlertTriangle, ChevronRight,
  Database, ShieldCheck, Tag, Info
} from 'lucide-react';
import { 
  MemberRecord, 
  MemberStatus, 
  MembershipType, 
  MemberFilterOptions,
  MemberActivityLog
} from '../../types/member';
import { MemberService } from '../../services/memberService';
import { CommunicationService } from '../../services/communicationService';

interface Props {
  tenantId?: string;
  tenantName?: string;
  actorName?: string;
}

export const MemberManagementSystem: React.FC<Props> = ({
  tenantId = 'org_bismillah_001',
  tenantName = 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
  actorName = 'এডমিন ইউজার'
}) => {
  // Main State
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [activityLogs, setActivityLogs] = useState<MemberActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'members_list' | 'audit_logs'>('members_list');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // Search & Filters State
  const [filters, setFilters] = useState<MemberFilterOptions>({
    searchTerm: '',
    status: 'all',
    membershipType: 'all',
    district: 'all',
    joinDateFrom: '',
    joinDateTo: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [profileTab, setProfileTab] = useState<
    'info' | 'collections' | 'dues' | 'payments' | 'receipts' | 'sms' | 'login' | 'idcard'
  >('info');

  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [importText, setImportText] = useState<string>('');
  const [importStatus, setImportStatus] = useState<string>('');

  // Form Input State
  const [formData, setFormData] = useState<Partial<MemberRecord>>({
    fullName: '',
    fatherName: '',
    motherName: '',
    phone: '',
    altPhone: '',
    email: '',
    nid: '',
    birthDate: '',
    gender: 'male',
    bloodGroup: 'B+',
    occupation: 'ব্যবসায়ী',
    address: '',
    district: 'ঢাকা',
    upazila: 'মিরপুর',
    village: '',
    emergencyContact: '',
    joinDate: new Date().toISOString().split('T')[0],
    referencePerson: '',
    membershipType: 'general',
    status: 'active',
    vehicleNo: '',
    remarks: '',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  });

  // 1. Subscribe to Firebase Data
  useEffect(() => {
    setIsLoading(true);
    const unsubscribeMembers = MemberService.subscribeMembers(
      tenantId,
      (data) => {
        setMembers(data);
        setIsLoading(false);
      }
    );

    const unsubscribeLogs = MemberService.subscribeMemberActivityLogs(
      tenantId,
      (logs) => {
        setActivityLogs(logs);
      }
    );

    return () => {
      unsubscribeMembers();
      unsubscribeLogs();
    };
  }, [tenantId]);

  // 2. Filter Members
  const filteredMembers = members.filter((m) => {
    const matchesSearch = 
      m.fullName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      m.membershipNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      m.phone.includes(filters.searchTerm) ||
      m.nid.includes(filters.searchTerm) ||
      (m.vehicleNo && m.vehicleNo.toLowerCase().includes(filters.searchTerm.toLowerCase()));

    const matchesStatus = filters.status === 'all' || m.status === filters.status;
    const matchesType = filters.membershipType === 'all' || m.membershipType === filters.membershipType;
    const matchesDistrict = filters.district === 'all' || m.district === filters.district;

    const matchesDateFrom = !filters.joinDateFrom || m.joinDate >= filters.joinDateFrom;
    const matchesDateTo = !filters.joinDateTo || m.joinDate <= filters.joinDateTo;

    return matchesSearch && matchesStatus && matchesType && matchesDistrict && matchesDateFrom && matchesDateTo;
  });

  // 3. Open Add/Edit Modal
  const handleOpenAddForm = () => {
    setSelectedMember(null);
    setFormData({
      fullName: '',
      fatherName: '',
      motherName: '',
      phone: '',
      altPhone: '',
      email: '',
      nid: '',
      birthDate: '1985-05-15',
      gender: 'male',
      bloodGroup: 'B+',
      occupation: 'ব্যবসায়ী',
      address: 'বাসা-১২, রোড-০৪, ব্লক-সি',
      district: 'ঢাকা',
      upazila: 'মিরপুর',
      village: 'মিরপুর-১',
      emergencyContact: '01700000000 (ভাই)',
      joinDate: new Date().toISOString().split('T')[0],
      referencePerson: 'ম্যানেজার',
      membershipType: 'general',
      status: 'active',
      vehicleNo: '',
      remarks: '',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (member: MemberRecord) => {
    setSelectedMember(member);
    setFormData({ ...member });
    setIsFormOpen(true);
  };

  // 4. Save Member
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('অনুগ্রহ করে সদস্যের নাম এবং মোবাইল নম্বর প্রদান করুন!');
      return;
    }

    const isNew = !selectedMember;
    const savedMember = await MemberService.saveMember({
      ...formData,
      tenantId,
      tenantName
    }, actorName);

    if (isNew && savedMember) {
      try {
        CommunicationService.triggerAutoSms(
          tenantId,
          'member_registered',
          {
            MemberName: savedMember.fullName,
            OrganizationName: tenantName,
            Phone: savedMember.phone,
            Date: new Date().toISOString().split('T')[0]
          },
          savedMember.phone,
          savedMember.fullName
        );
      } catch (e) {
        console.warn('Auto SMS dispatch error:', e);
      }
    }

    setIsFormOpen(false);
  };

  // 5. Toggle Status (Suspend / Activate)
  const handleToggleStatus = async (member: MemberRecord) => {
    const actionText = member.status === 'active' ? 'স্থগিত' : 'সক্রিয়';
    if (window.confirm(`আপনি কি নিশ্চিত যে মেম্বার "${member.fullName}" এর অ্যাকাউন্ট ${actionText} করতে চান?`)) {
      await MemberService.toggleMemberStatus(
        member.id,
        member.status,
        tenantId,
        member.fullName,
        actorName
      );
    }
  };

  // Selected Member IDs for Batch Delete
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  // 6. Delete Member (Soft & Permanent)
  const handleDeleteMember = async (member: MemberRecord) => {
    const isPermanent = window.confirm(`স্থায়ীভাবে মুছে ফেলার নির্দেশ:
[OK] চাপলে মেম্বার "${member.fullName}" কে চিরতরে ডাটাবেজ থেকে ডিলিট করা হবে।
[Cancel] চাপলে বাতিল হবে।`);

    if (isPermanent) {
      await MemberService.hardDeleteMember(
        member.id,
        tenantId,
        member.fullName,
        actorName
      );
      setMembers(prev => prev.filter(m => m.id !== member.id));
      setSelectedMemberIds(prev => prev.filter(id => id !== member.id));
    }
  };

  const handleBatchDeleteMembers = async () => {
    if (selectedMemberIds.length === 0) return;
    if (window.confirm(`সতর্কতা! আপনি কি নিশ্চিত যে নির্বাচিত ${selectedMemberIds.length} জন মেম্বারকে চিরতরে ডাটাবেজ থেকে ডিলিট করতে চান?`)) {
      await MemberService.deleteMembersBatch(selectedMemberIds, tenantId, actorName);
      setMembers(prev => prev.filter(m => !selectedMemberIds.includes(m.id)));
      setSelectedMemberIds([]);
    }
  };

  // 7. View Profile Details
  const handleViewProfile = (member: MemberRecord) => {
    setSelectedMember(member);
    setProfileTab('info');
    setIsProfileOpen(true);
  };

  // 8. Bulk CSV Export
  const handleExportCSV = () => {
    MemberService.exportToCSV(filteredMembers);
  };

  // 9. Bulk JSON/CSV Text Import
  const handleImportMembers = async () => {
    if (!importText.trim()) {
      alert('অনুগ্রহ করে পেস্ট বা ইমপোর্ট ডাটা প্রদান করুন!');
      return;
    }

    try {
      setImportStatus('প্রসেসিং হচ্ছে...');
      const lines = importText.trim().split('\n');
      const rows: Array<Partial<MemberRecord>> = [];

      lines.forEach((line) => {
        const parts = line.split(',');
        if (parts.length >= 2) {
          rows.push({
            fullName: parts[0]?.trim() || 'আমদানিকৃত মেম্বার',
            phone: parts[1]?.trim() || '01700000000',
            fatherName: parts[2]?.trim() || '',
            nid: parts[3]?.trim() || '',
            district: parts[4]?.trim() || 'ঢাকা',
            membershipType: (parts[5]?.trim() as MembershipType) || 'general'
          });
        }
      });

      const count = await MemberService.importBulkMembers(rows, tenantId, actorName);
      setImportStatus(`সফলভাবে ${count} জন মেম্বার ইমপোর্ট করা হয়েছে!`);
      setTimeout(() => {
        setIsImportOpen(false);
        setImportText('');
        setImportStatus('');
      }, 1500);
    } catch (e) {
      setImportStatus('ইমপোর্টে ত্রুটি ঘটেছে! সঠিক ফরম্যাট নিশ্চিত করুন।');
    }
  };

  const getMembershipBadge = (type: MembershipType) => {
    switch (type) {
      case 'lifetime':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 rounded-full text-xs font-semibold border border-amber-300">আজীবন সদস্য</span>;
      case 'vip':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 rounded-full text-xs font-semibold border border-purple-300">ভিআইপি</span>;
      case 'honorary':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-full text-xs font-semibold border border-blue-300">সম্মানিত</span>;
      case 'associate':
        return <span className="px-2.5 py-1 bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 rounded-full text-xs font-semibold border border-teal-300">সহযোগী</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 rounded-full text-xs font-medium border border-gray-300">সাধারণ</span>;
    }
  };

  const getStatusBadge = (status: MemberStatus) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full text-xs font-semibold border border-emerald-300"><CheckCircle size={12} /> সক্রিয়</span>;
      case 'suspended':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded-full text-xs font-semibold border border-rose-300"><ShieldAlert size={12} /> স্থগিত</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">মুছে ফেলা</span>;
    }
  };

  const memberHistories = selectedMember ? MemberService.getMemberDetailedHistories(selectedMember) : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <Users size={28} className="text-emerald-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">মেম্বার ম্যানেজমেন্ট সিস্টেম</h1>
                <p className="text-emerald-100 text-sm mt-0.5">
                  অর্গানাইজেশন: <span className="font-semibold text-white">{tenantName}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedMemberIds.length > 0 && (
              <button
                onClick={handleBatchDeleteMembers}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm animate-pulse"
              >
                <Trash2 size={18} />
                সিলেক্ট করা মেম্বার ডিলিট ({selectedMemberIds.length})
              </button>
            )}
            <button
              onClick={handleOpenAddForm}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2 text-sm"
            >
              <UserPlus size={18} />
              নতুন মেম্বার রেজিষ্ট্রেশন
            </button>
            <button
              onClick={() => setIsImportOpen(true)}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 border border-white/20"
            >
              <Upload size={16} />
              বাল্ক ইমপোর্ট
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 border border-white/20"
            >
              <Download size={16} />
              এক্সপোর্ট CSV
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-xs text-emerald-100 block">মোট মেম্বার</span>
            <span className="text-xl font-bold">{members.length} জন</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-xs text-emerald-100 block">সক্রিয় মেম্বার</span>
            <span className="text-xl font-bold text-emerald-300">
              {members.filter(m => m.status === 'active').length} জন
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-xs text-emerald-100 block">স্থগিত মেম্বার</span>
            <span className="text-xl font-bold text-rose-300">
              {members.filter(m => m.status === 'suspended').length} জন
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-xs text-emerald-100 block">আজীবন/ভিআইপি</span>
            <span className="text-xl font-bold text-amber-300">
              {members.filter(m => m.membershipType === 'lifetime' || m.membershipType === 'vip').length} জন
            </span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 space-x-4">
        <button
          onClick={() => setActiveTab('members_list')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'members_list'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <Users size={18} />
          মেম্বার তালিকা ও প্রোফাইল
        </button>
        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'audit_logs'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <ShieldCheck size={18} />
          অডিট অ্যাক্টিভিটি লগ ({activityLogs.length})
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'members_list' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="মেম্বার আইডি, নাম, মোবাইল, এনআইডি বা গাড়ি নম্বর দিয়ে খুঁজুন..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`px-3.5 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-1.5 transition-all ${
                    showAdvancedFilters
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Filter size={16} />
                  এডভান্সড ফিল্টার
                </button>

                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl p-1 bg-gray-50 dark:bg-gray-800">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      viewMode === 'table' ? 'bg-white dark:bg-gray-700 shadow text-emerald-600 dark:text-emerald-400' : 'text-gray-500'
                    }`}
                  >
                    টেবিল ভিউ
                  </button>
                  <button
                    onClick={() => setViewMode('card')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      viewMode === 'card' ? 'bg-white dark:bg-gray-700 shadow text-emerald-600 dark:text-emerald-400' : 'text-gray-500'
                    }`}
                  >
                    কার্ড ভিউ
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Advanced Filters */}
            {showAdvancedFilters && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">স্ট্যাটাস</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-xs"
                  >
                    <option value="all">সকল স্ট্যাটাস</option>
                    <option value="active">সক্রিয় (Active)</option>
                    <option value="suspended">স্থগিত (Suspended)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">সদস্যপদ টাইপ</label>
                  <select
                    value={filters.membershipType}
                    onChange={(e) => setFilters({ ...filters, membershipType: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-xs"
                  >
                    <option value="all">সকল সদস্যপদ</option>
                    <option value="general">সাধারণ সদস্য</option>
                    <option value="vip">ভিআইপি</option>
                    <option value="lifetime">আজীবন সদস্য</option>
                    <option value="associate">সহযোগী</option>
                    <option value="honorary">সম্মানিত</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">জেলা</label>
                  <select
                    value={filters.district}
                    onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-xs"
                  >
                    <option value="all">সকল জেলা</option>
                    <option value="ঢাকা">ঢাকা</option>
                    <option value="গাজীপুর">গাজীপুর</option>
                    <option value="নারায়ণগঞ্জ">নারায়ণগঞ্জ</option>
                    <option value="চট্টগ্রাম">চট্টগ্রাম</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">যোগদানের তারিখ হতে</label>
                  <input
                    type="date"
                    value={filters.joinDateFrom}
                    onChange={(e) => setFilters({ ...filters, joinDateFrom: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Members Content - Table or Cards */}
          {isLoading ? (
            <div className="p-12 text-center text-gray-500 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
              <RefreshCw className="animate-spin mx-auto text-emerald-600 mb-2" size={32} />
              <p>ফায়ারবেস থেকে মেম্বার তথ্য লোড হচ্ছে...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-12 text-center text-gray-500 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
              <Users size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">কোনো মেম্বার রেকর্ড পাওয়া যায়নি!</p>
              <p className="text-sm text-gray-500 mt-1">অনুগ্রহ করে নতুন মেম্বার যোগ করুন অথবা সার্চ ফিল্টার রিকনফিগার করুন।</p>
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs uppercase font-semibold border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="py-3.5 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={filteredMembers.length > 0 && selectedMemberIds.length === filteredMembers.length}
                          onChange={() => {
                            if (selectedMemberIds.length === filteredMembers.length) {
                              setSelectedMemberIds([]);
                            } else {
                              setSelectedMemberIds(filteredMembers.map(m => m.id));
                            }
                          }}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </th>
                      <th className="py-3.5 px-4">ছবি ও নাম</th>
                      <th className="py-3.5 px-4">মেম্বার আইডি / সদস্য নং</th>
                      <th className="py-3.5 px-4">যোগাযোগ ও ঠিকানা</th>
                      <th className="py-3.5 px-4">সদস্যপদ</th>
                      <th className="py-3.5 px-4">গাড়ি নং / এনআইডি</th>
                      <th className="py-3.5 px-4">স্ট্যাটাস</th>
                      <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredMembers.map((member) => {
                      const isSelected = selectedMemberIds.includes(member.id);
                      return (
                        <tr key={member.id} className={`hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors ${isSelected ? 'bg-rose-50/30 dark:bg-rose-950/20' : ''}`}>
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                if (isSelected) {
                                  setSelectedMemberIds(selectedMemberIds.filter(id => id !== member.id));
                                } else {
                                  setSelectedMemberIds([...selectedMemberIds, member.id]);
                                }
                              }}
                              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                          </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={member.photoUrl}
                              alt={member.fullName}
                              className="w-10 h-10 rounded-full object-cover border border-emerald-500 shadow-sm"
                            />
                            <div>
                              <span className="font-bold text-gray-900 dark:text-white block">{member.fullName}</span>
                              <span className="text-xs text-gray-500 block">পিতা: {member.fatherName || 'N/A'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 block">{member.id}</span>
                          <span className="text-xs text-gray-500 block">নং: {member.membershipNumber}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-gray-800 dark:text-gray-200 font-medium block flex items-center gap-1">
                            <Phone size={12} className="text-gray-400" /> {member.phone}
                          </span>
                          <span className="text-xs text-gray-500 block truncate max-w-[180px]">
                            {member.village ? `${member.village}, ` : ''}{member.district}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {getMembershipBadge(member.membershipType)}
                          <span className="text-[11px] text-gray-400 block mt-1">যোগদান: {member.joinDate}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-medium text-gray-800 dark:text-gray-200 block">{member.vehicleNo || 'নেই'}</span>
                          <span className="text-[11px] text-gray-400 block">NID: {member.nid || 'N/A'}</span>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(member.status)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleViewProfile(member)}
                              title="প্রোফাইল ফাইল দেখুন"
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-all"
                            >
                              <Eye size={17} />
                            </button>
                            <button
                              onClick={() => handleOpenEditForm(member)}
                              title="সম্পাদনা করুন"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg transition-all"
                            >
                              <Edit3 size={17} />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(member)}
                              title={member.status === 'active' ? 'স্থগিত করুন' : 'সক্রিয় করুন'}
                              className={`p-1.5 rounded-lg transition-all ${
                                member.status === 'active'
                                  ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950'
                                  : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              <ShieldAlert size={17} />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member)}
                              title="ডিলিট করুন"
                              className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-all"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Card View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => {
                const isSelected = selectedMemberIds.includes(member.id);
                return (
                  <div 
                    key={member.id}
                    className={`bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border ${isSelected ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/10' : 'border-gray-200 dark:border-gray-800'} space-y-4 hover:shadow-md transition-all relative`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            if (isSelected) {
                              setSelectedMemberIds(selectedMemberIds.filter(id => id !== member.id));
                            } else {
                              setSelectedMemberIds([...selectedMemberIds, member.id]);
                            }
                          }}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer mt-1"
                        />
                        <img
                          src={member.photoUrl}
                          alt={member.fullName}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow"
                        />
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white leading-snug">{member.fullName}</h3>
                          <span className="text-xs text-gray-500 font-mono block">{member.id} | {member.membershipNumber}</span>
                        </div>
                      </div>
                      {getStatusBadge(member.status)}
                    </div>

                  <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">মোবাইল:</span>
                      <span className="font-semibold">{member.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">মেম্বারশিপ:</span>
                      <span>{getMembershipBadge(member.membershipType)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">জেলা / থানা:</span>
                      <span>{member.district}, {member.upazila}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">গাড়ি নম্বর:</span>
                      <span className="font-mono text-emerald-600 font-bold">{member.vehicleNo || 'নেই'}</span>
                    </div>
                  </div>

                  {/* QR & Barcode Preview */}
                  <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                      <QrCode size={16} className="text-emerald-600" />
                      <span>কুইক ব্যাজ QR</span>
                    </div>
                    <button
                      onClick={() => handleViewProfile(member)}
                      className="text-xs text-emerald-600 hover:underline font-semibold flex items-center gap-1"
                    >
                      আইডি কার্ড প্রিন্ট <ChevronRight size={12} />
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <button
                      onClick={() => handleViewProfile(member)}
                      className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-xl text-center transition-all"
                    >
                      প্রোফাইল
                    </button>
                    <button
                      onClick={() => handleOpenEditForm(member)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-xl"
                    >
                      এডিট
                    </button>
                    <button
                      onClick={() => handleToggleStatus(member)}
                      className="px-3 py-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs rounded-xl"
                    >
                      {member.status === 'active' ? 'স্থগিত' : 'সক্রিয়'}
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member)}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-xl flex items-center gap-1"
                      title="ডিলিট করুন"
                    >
                      <Trash2 size={14} />
                      <span>ডিলিট</span>
                    </button>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      )}

      {/* Audit Activity Logs Tab */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" />
            মেম্বার মডিউল অডিট ট্রেইল ও অ্যাক্টিভিটি লগ
          </h2>
          <div className="space-y-3">
            {activityLogs.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">এখন পর্যন্ত কোনো অ্যাক্টিভিটি পরিবর্তন রেকর্ড করা হয়নি।</p>
            ) : (
              activityLogs.map((log) => (
                <div key={log.id} className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 flex items-start gap-3 text-xs">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg font-semibold shrink-0">
                    LOG
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 dark:text-white text-sm">{log.action}</span>
                      <span className="text-gray-400">{new Date(log.timestamp).toLocaleString('bn-BD')}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{log.details}</p>
                    <span className="text-gray-500 block">সম্পাদনকারী: <span className="font-semibold text-gray-700 dark:text-gray-300">{log.actorName}</span></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT MEMBER FORM                           */}
      {/* ========================================================= */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto my-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <UserPlus className="text-emerald-600" />
                {selectedMember ? 'মেম্বার প্রোফাইল এডিট করুন' : 'নতুন মেম্বার নিবন্ধন ফরম'}
              </h2>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                  <User size={14} /> ১. ব্যক্তিগত তথ্য (Personal Information)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">মেম্বার পুরো নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মোঃ সামসুল হক"
                      value={formData.fullName || ''}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">পিতার নাম</label>
                    <input
                      type="text"
                      placeholder="যেমন: আবদুর রহমান"
                      value={formData.fatherName || ''}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">মাতার নাম</label>
                    <input
                      type="text"
                      placeholder="যেমন: রোকেয়া বেগম"
                      value={formData.motherName || ''}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">মোবাইল নম্বর *</label>
                    <input
                      type="text"
                      required
                      placeholder="01712345678"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">বিকল্প মোবাইল</label>
                    <input
                      type="text"
                      placeholder="01812345678"
                      value={formData.altPhone || ''}
                      onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">ইমেইল এড্রেস</label>
                    <input
                      type="email"
                      placeholder="member@gmail.com"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">জাতীয় পরিচয়পত্র (NID)</label>
                    <input
                      type="text"
                      placeholder="19752691234567890"
                      value={formData.nid || ''}
                      onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">জন্ম তারিখ</label>
                    <input
                      type="date"
                      value={formData.birthDate || ''}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">রক্তের গ্রুপ</label>
                    <select
                      value={formData.bloodGroup || 'B+'}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address & Emergency Info */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                  <MapPin size={14} /> ২. ঠিকানা ও জরুরী যোগাযোগ
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">বর্তমান ঠিকানা</label>
                    <input
                      type="text"
                      placeholder="বাসা নম্বর, রোড নম্বর, ব্লক"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">জেলা</label>
                    <input
                      type="text"
                      placeholder="ঢাকা"
                      value={formData.district || ''}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">উপজেলা / থানা</label>
                    <input
                      type="text"
                      placeholder="মিরপুর"
                      value={formData.upazila || ''}
                      onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">গ্রাম / ওয়ার্ড</label>
                    <input
                      type="text"
                      placeholder="মিরপুর-১০"
                      value={formData.village || ''}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">জরুরী যোগাযোগের তথ্য</label>
                    <input
                      type="text"
                      placeholder="01911000000 (ভাই)"
                      value={formData.emergencyContact || ''}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Membership Details */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                  <Tag size={14} /> ৩. সদস্যপদ সংক্রান্ত তথ্য
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">সদস্যপদ টাইপ</label>
                    <select
                      value={formData.membershipType || 'general'}
                      onChange={(e) => setFormData({ ...formData, membershipType: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    >
                      <option value="general">সাধারণ সদস্য</option>
                      <option value="vip">ভিআইপি</option>
                      <option value="lifetime">আজীবন সদস্য</option>
                      <option value="associate">সহযোগী</option>
                      <option value="honorary">সম্মানিত</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">যোগদানের তারিখ</label>
                    <input
                      type="date"
                      value={formData.joinDate || ''}
                      onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">রেফারেন্স ব্যক্তি</label>
                    <input
                      type="text"
                      placeholder="মোঃ আমজাদ হোসেন"
                      value={formData.referencePerson || ''}
                      onChange={(e) => setFormData({ ...formData, referencePerson: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">গাড়ি / যান নম্বর (যদি থাকে)</label>
                    <input
                      type="text"
                      placeholder="ঢাকা মেট্রো-থ-১১-৪৫২৩"
                      value={formData.vehicleNo || ''}
                      onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">মন্তব্য (Remarks)</label>
                    <input
                      type="text"
                      placeholder="অতিরিক্ত কোনো নোট..."
                      value={formData.remarks || ''}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                >
                  <Check size={18} />
                  {selectedMember ? 'আপডেট তথ্য সংরক্ষণ করুন' : 'নতুন মেম্বার যুক্ত করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: FULL MEMBER PROFILE VIEW & HISTORIES             */}
      {/* ========================================================= */}
      {isProfileOpen && selectedMember && memberHistories && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8 flex flex-col">
            
            {/* Header Profile Banner */}
            <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-900 text-white relative">
              <button 
                onClick={() => setIsProfileOpen(false)}
                className="absolute top-4 right-4 p-1.5 bg-black/20 hover:bg-black/40 rounded-full text-white"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={selectedMember.photoUrl}
                  alt={selectedMember.fullName}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
                />
                <div className="text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-xl font-bold">{selectedMember.fullName}</h2>
                    {getMembershipBadge(selectedMember.membershipType)}
                    {getStatusBadge(selectedMember.status)}
                  </div>
                  <p className="text-emerald-100 text-xs font-mono">
                    আইডি: {selectedMember.id} | সদস্য নং: {selectedMember.membershipNumber}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-emerald-100/90 pt-1">
                    <span className="flex items-center gap-1"><Phone size={12} /> {selectedMember.phone}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {selectedMember.district}, {selectedMember.upazila}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> যোগদান: {selectedMember.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Sub Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 overflow-x-auto px-4">
              <button
                onClick={() => setProfileTab('info')}
                className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap ${
                  profileTab === 'info' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-gray-500'
                }`}
              >
                সাধারণ তথ্য
              </button>
              <button
                onClick={() => setProfileTab('collections')}
                className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap ${
                  profileTab === 'collections' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-gray-500'
                }`}
              >
                জমা হিস্ট্রি
              </button>
              <button
                onClick={() => setProfileTab('dues')}
                className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap ${
                  profileTab === 'dues' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-gray-500'
                }`}
              >
                বকেয়া হিসাব
              </button>
              <button
                onClick={() => setProfileTab('payments')}
                className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap ${
                  profileTab === 'payments' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-gray-500'
                }`}
              >
                পেমেন্ট তথ্য
              </button>
              <button
                onClick={() => setProfileTab('receipts')}
                className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap ${
                  profileTab === 'receipts' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-gray-500'
                }`}
              >
                রসিদ কপি
              </button>
              <button
                onClick={() => setProfileTab('sms')}
                className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap ${
                  profileTab === 'sms' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-gray-500'
                }`}
              >
                এসএমএস লগ
              </button>
              <button
                onClick={() => setProfileTab('login')}
                className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap ${
                  profileTab === 'login' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-gray-500'
                }`}
              >
                লগইন ট্র্যাকিং
              </button>
              <button
                onClick={() => setProfileTab('idcard')}
                className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap text-amber-600 dark:text-amber-400 ${
                  profileTab === 'idcard' ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40' : 'border-transparent'
                }`}
              >
                🎴 ডিজিটাল কার্ড প্রিন্ট
              </button>
            </div>

            {/* Profile Tab Contents */}
            <div className="p-6 space-y-4 flex-1">
              {profileTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-gray-900 dark:text-white border-b pb-1 text-sm">ব্যক্তিগত ও পরিচিতি</h4>
                    <p><span className="text-gray-500">পিতার নাম:</span> {selectedMember.fatherName || 'N/A'}</p>
                    <p><span className="text-gray-500">মাতার নাম:</span> {selectedMember.motherName || 'N/A'}</p>
                    <p><span className="text-gray-500">জাতীয় পরিচয়পত্র (NID):</span> {selectedMember.nid || 'N/A'}</p>
                    <p><span className="text-gray-500">জন্ম তারিখ:</span> {selectedMember.birthDate || 'N/A'}</p>
                    <p><span className="text-gray-500">রক্তের গ্রুপ:</span> <span className="font-bold text-rose-600">{selectedMember.bloodGroup}</span></p>
                    <p><span className="text-gray-500">পেশা:</span> {selectedMember.occupation}</p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-gray-900 dark:text-white border-b pb-1 text-sm">ঠিকানা ও জরুরী যোগাযোগ</h4>
                    <p><span className="text-gray-500">বর্তমান ঠিকানা:</span> {selectedMember.address}</p>
                    <p><span className="text-gray-500">জেলা/উপজেলা:</span> {selectedMember.district}, {selectedMember.upazila}</p>
                    <p><span className="text-gray-500">গ্রাম/ওয়ার্ড:</span> {selectedMember.village || 'N/A'}</p>
                    <p><span className="text-gray-500">জরুরী যোগাযোগ:</span> {selectedMember.emergencyContact}</p>
                    <p><span className="text-gray-500">রেফারেন্স ব্যক্তি:</span> {selectedMember.referencePerson}</p>
                    <p><span className="text-gray-500">যানবাহন নম্বর:</span> <span className="font-mono font-bold text-emerald-600">{selectedMember.vehicleNo || 'নেই'}</span></p>
                  </div>
                </div>
              )}

              {profileTab === 'collections' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 dark:bg-gray-800 font-bold">
                      <tr>
                        <th className="p-2.5">তারিখ</th>
                        <th className="p-2.5">জমার ধরণ</th>
                        <th className="p-2.5">পরিমাণ</th>
                        <th className="p-2.5">রসিদ নম্বর</th>
                        <th className="p-2.5">সংগ্রহকারী</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {memberHistories.collections.map(c => (
                        <tr key={c.id}>
                          <td className="p-2.5">{c.date}</td>
                          <td className="p-2.5 font-medium">{c.type}</td>
                          <td className="p-2.5 font-bold text-emerald-600">৳ {c.amount}</td>
                          <td className="p-2.5 font-mono">{c.receiptNo}</td>
                          <td className="p-2.5">{c.collectorName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {profileTab === 'dues' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 dark:bg-gray-800 font-bold">
                      <tr>
                        <th className="p-2.5">মাস / বছর</th>
                        <th className="p-2.5">বকেয়া পরিমাণ</th>
                        <th className="p-2.5">পরিশোধের শেষ তারিখ</th>
                        <th className="p-2.5">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {memberHistories.dues.map(d => (
                        <tr key={d.id}>
                          <td className="p-2.5 font-bold">{d.monthYear}</td>
                          <td className="p-2.5 font-bold text-rose-600">৳ {d.amount}</td>
                          <td className="p-2.5">{d.dueDate}</td>
                          <td className="p-2.5">
                            {d.status === 'due' ? (
                              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full text-[10px] font-bold">বকেয়া</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">পরিশোধিত</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {profileTab === 'payments' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 dark:bg-gray-800 font-bold">
                      <tr>
                        <th className="p-2.5">তারিখ ও সময়</th>
                        <th className="p-2.5">পেমেন্ট মেথড</th>
                        <th className="p-2.5">পরিমাণ</th>
                        <th className="p-2.5">ট্রানজেকশন আইডি</th>
                        <th className="p-2.5">গ্রহণকারী</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {memberHistories.payments.map(p => (
                        <tr key={p.id}>
                          <td className="p-2.5">{p.paymentDate}</td>
                          <td className="p-2.5 uppercase font-semibold">{p.paymentMethod}</td>
                          <td className="p-2.5 font-bold text-emerald-600">৳ {p.amount}</td>
                          <td className="p-2.5 font-mono">{p.transactionId || 'ক্যাশ জমারমেমো'}</td>
                          <td className="p-2.5">{p.receivedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {profileTab === 'receipts' && (
                <div className="space-y-3">
                  {memberHistories.receipts.map(r => (
                    <div key={r.id} className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">রসিদ নং: {r.receiptNo}</span>
                        <span className="text-gray-500">{r.purpose} (তারিখ: {r.date})</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600 text-sm block">৳ {r.amount}</span>
                        <button 
                          onClick={() => alert(`রসিদ ${r.receiptNo} প্রিন্ট প্রিভিউ জেনারেট হচ্ছে...`)}
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                        >
                          <Printer size={12} /> রসিদ প্রিন্ট
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {profileTab === 'sms' && (
                <div className="space-y-3">
                  {memberHistories.smsLogs.map(s => (
                    <div key={s.id} className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 dark:text-white">{s.phone}</span>
                        <span className="text-gray-400">{s.sentTime}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{s.message}</p>
                      <span className="text-[10px] text-emerald-600 font-bold block">স্ট্যাটাস: {s.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {profileTab === 'login' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 dark:bg-gray-800 font-bold">
                      <tr>
                        <th className="p-2.5">লগইন সময়</th>
                        <th className="p-2.5">আইপি এড্রেস</th>
                        <th className="p-2.5">ডিভাইস ও ব্রাউজার</th>
                        <th className="p-2.5">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {memberHistories.logins.map(l => (
                        <tr key={l.id}>
                          <td className="p-2.5">{l.loginTime}</td>
                          <td className="p-2.5 font-mono">{l.ipAddress}</td>
                          <td className="p-2.5">{l.deviceInfo}</td>
                          <td className="p-2.5"><span className="text-emerald-600 font-bold">সফল</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Printable Digital Member Card / Badge */}
              {profileTab === 'idcard' && (
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl max-w-md mx-auto shadow-2xl border-2 border-emerald-400 relative overflow-hidden">
                    <div className="text-center pb-3 border-b border-emerald-700">
                      <h3 className="font-extrabold text-lg text-emerald-200">{tenantName}</h3>
                      <span className="text-[10px] tracking-widest text-emerald-300 uppercase block font-semibold">অফিসিয়াল মেম্বারশিপ আইডি কার্ড</span>
                    </div>

                    <div className="py-4 flex items-center gap-4">
                      <img
                        src={selectedMember.photoUrl}
                        alt={selectedMember.fullName}
                        className="w-20 h-24 rounded-xl object-cover border-2 border-amber-400 shadow"
                      />
                      <div className="space-y-1 text-xs">
                        <h4 className="font-bold text-base text-white">{selectedMember.fullName}</h4>
                        <p className="text-emerald-200">পদবী: {getMembershipBadge(selectedMember.membershipType)}</p>
                        <p><span className="text-emerald-300">সদস্য নং:</span> {selectedMember.membershipNumber}</p>
                        <p><span className="text-emerald-300">মোবাইল:</span> {selectedMember.phone}</p>
                        <p><span className="text-emerald-300">রক্তের গ্রুপ:</span> <span className="font-bold text-rose-300">{selectedMember.bloodGroup}</span></p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-emerald-700 flex items-center justify-between text-[10px]">
                      <div className="space-y-1">
                        <span className="font-mono block text-emerald-300">{selectedMember.id}</span>
                        <span className="text-gray-300 block">গাড়ি: {selectedMember.vehicleNo || 'N/A'}</span>
                      </div>
                      <div className="p-2 bg-white text-black rounded-lg text-center">
                        <QrCode size={36} className="mx-auto" />
                        <span className="text-[8px] font-mono block mt-0.5">SCAN BADGE</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => window.print()}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-lg inline-flex items-center gap-2"
                    >
                      <Printer size={16} />
                      ডিজিটাল ব্যাজ প্রিন্ট করুন
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: BULK CSV / TEXT IMPORT                           */}
      {/* ========================================================= */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Upload className="text-emerald-600" />
                বাল্ক মেম্বার ডাটা ইমপোর্ট
              </h3>
              <button onClick={() => setIsImportOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300">
              নিচের টেক্সট বক্সে CSV বা কমা দিয়ে পৃথককৃত ফরম্যাটে মেম্বারদের ডাটা পেস্ট করুন:
              <br />
              <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[10px] text-emerald-600 block mt-1">
                নাম, মোবাইল, পিতার নাম, NID, জেলা, সদস্যপদ (general/vip/lifetime)
              </code>
            </p>

            <textarea
              rows={6}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`মোঃ সামসুল হক, 01712345678, আবদুর রহমান, 1975269123, ঢাকা, lifetime\nমোঃ কামাল হোসেন, 01811998877, সিরাজুল ইসলাম, 1982269123, ঢাকা, general`}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-xs font-mono"
            />

            {importStatus && (
              <p className="text-xs font-bold text-emerald-600 text-center">{importStatus}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsImportOpen(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-xs rounded-xl"
              >
                বাতিল
              </button>
              <button
                onClick={handleImportMembers}
                className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
              >
                ইমপোর্ট শুরু করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
