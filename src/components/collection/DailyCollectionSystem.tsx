import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Search, QrCode, Calendar, DollarSign, UserCheck, 
  Printer, Share2, Download, AlertTriangle, CheckCircle, Clock, 
  Filter, Phone, RefreshCw, Wifi, WifiOff, FileText, Send, 
  Trash2, Eye, ShieldAlert, Sparkles, Check, ChevronRight, User, 
  Car, Shield, Plus, Lock, Smartphone, Building
} from 'lucide-react';
import { MemberRecord } from '../../types/member';
import { 
  DailyCollectionRecord, 
  DueRecord, 
  CollectionSummaryStats, 
  PaymentMethod, 
  PaymentStatus,
  CollectionFilterOptions 
} from '../../types/collection';
import { MemberService } from '../../services/memberService';
import { CollectionService } from '../../services/collectionService';
import { CommunicationService } from '../../services/communicationService';

interface Props {
  tenantId?: string;
  tenantName?: string;
  actorName?: string;
}

export const DailyCollectionSystem: React.FC<Props> = ({
  tenantId = 'org_bismillah_001',
  tenantName = 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
  actorName = 'মোঃ জসিম (ক্যাশিয়ার)'
}) => {
  // Primary Collections & Members State
  const [collections, setCollections] = useState<DailyCollectionRecord[]>([]);
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);

  // Tabs
  const [activeTab, setActiveTab] = useState<'entry' | 'history' | 'dues'>('entry');

  // Search Member for Collection Entry
  const [memberSearchQuery, setMemberSearchQuery] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<DailyCollectionRecord | null>(null);

  // QR Scan State Simulator
  const [isQRScanOpen, setIsQRScanOpen] = useState<boolean>(false);
  const [qrCodeInput, setQrCodeInput] = useState<string>('');

  // Form Entry State
  const [chargeType, setChargeType] = useState<string>('দৈনিক গ্যারেজ চার্জ');
  const [expectedAmount, setExpectedAmount] = useState<number>(300);
  const [paidAmount, setPaidAmount] = useState<number>(300);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [bkashAmount, setBkashAmount] = useState<number>(0);
  const [nagadAmount, setNagadAmount] = useState<number>(0);
  const [collectorName, setCollectorName] = useState<string>(actorName);
  const [notes, setNotes] = useState<string>('');
  const [collectionDate, setCollectionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // History Filter State
  const [filters, setFilters] = useState<CollectionFilterOptions>({
    searchTerm: '',
    startDate: '',
    endDate: '',
    paymentMethod: 'all',
    paymentStatus: 'all',
    collectorName: 'all',
    chargeType: 'all'
  });

  // Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<DailyCollectionRecord | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);
  const [printFormat, setPrintFormat] = useState<'thermal' | 'a4'>('thermal');

  // Reminder Modal State
  const [reminderDueItem, setReminderDueItem] = useState<DueRecord | null>(null);

  // 1. Monitor Network & Offline Queue
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      setOfflineQueueCount(CollectionService.getOfflineQueue().length);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    setOfflineQueueCount(CollectionService.getOfflineQueue().length);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // 2. Realtime Subscriptions
  useEffect(() => {
    setIsLoading(true);

    const unsubscribeMembers = MemberService.subscribeMembers(tenantId, (mList) => {
      setMembers(mList);
    });

    const unsubscribeCollections = CollectionService.subscribeCollections(tenantId, (cList) => {
      setCollections(cList);
      setIsLoading(false);
    });

    return () => {
      unsubscribeMembers();
      unsubscribeCollections();
    };
  }, [tenantId]);

  // Sync Offline Queue automatically when online
  const handleSyncOffline = async () => {
    const synced = await CollectionService.syncOfflineQueue();
    alert(`সফলভাবে ${synced} টি অফলাইন কালেকশন সিঙ্ক করা হয়েছে!`);
    setOfflineQueueCount(CollectionService.getOfflineQueue().length);
  };

  // Auto Select First Member if none selected & set default charge
  useEffect(() => {
    if (!selectedMember && members.length > 0) {
      setSelectedMember(members[0]);
    }
  }, [members]);

  // Check Duplicate Payment when member or date changes
  useEffect(() => {
    if (selectedMember) {
      const existing = CollectionService.checkDuplicatePaymentToday(
        selectedMember.id,
        collectionDate,
        collections
      );
      setDuplicateWarning(existing || null);
    } else {
      setDuplicateWarning(null);
    }
  }, [selectedMember, collectionDate, collections]);

  // Quick Amount Presets
  const applyAmountPreset = (preset: number) => {
    setExpectedAmount(preset);
    setPaidAmount(preset);
  };

  // Member Search Match List
  const searchedMembers = members.filter((m) => {
    if (!memberSearchQuery) return true;
    const q = memberSearchQuery.toLowerCase();
    return (
      m.fullName.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      m.membershipNumber.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      (m.vehicleNo && m.vehicleNo.toLowerCase().includes(q))
    );
  });

  // Handle QR Scan Code
  const handleQRScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCodeInput.trim()) return;
    const found = members.find(
      (m) =>
        m.id.toLowerCase() === qrCodeInput.trim().toLowerCase() ||
        m.membershipNumber.toLowerCase() === qrCodeInput.trim().toLowerCase() ||
        m.qrCodeData.toLowerCase() === qrCodeInput.trim().toLowerCase() ||
        m.phone === qrCodeInput.trim()
    );

    if (found) {
      setSelectedMember(found);
      setIsQRScanOpen(false);
      setQrCodeInput('');
    } else {
      alert('প্রদত্ত QR/বারকোড অনুযায়ী কোনো মেম্বার পাওয়া যায়নি!');
    }
  };

  // Auto Payment Calculations
  const calculatedDue = paidAmount < expectedAmount ? expectedAmount - paidAmount : 0;
  const calculatedAdvance = paidAmount > expectedAmount ? paidAmount - expectedAmount : 0;
  const calculatedStatus: PaymentStatus = 
    paidAmount === expectedAmount ? 'paid' :
    paidAmount < expectedAmount ? (paidAmount > 0 ? 'partial' : 'due') : 'advance';

  // Submit Collection Form
  const handleSubmitCollection = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMember) {
      alert('অনুগ্রহ করে একজন মেম্বার নির্বাচন করুন!');
      return;
    }

    if (paidAmount < 0) {
      alert('জমার পরিমাণ সঠিক নয়!');
      return;
    }

    if (duplicateWarning) {
      const confirmDup = window.confirm(
        `সতর্কতা! মেম্বার "${selectedMember.fullName}" আজকের তারিখে ইতোমধ্যে ৳${duplicateWarning.paidAmount} টাকা জমা দিয়েছেন (রসিদ: ${duplicateWarning.receiptNo})। আপনি কি পুনরায় নতুন জমা রেকর্ড করতে চান?`
      );
      if (!confirmDup) return;
    }

    const newRecord = await CollectionService.recordCollection(
      {
        tenantId,
        tenantName,
        date: collectionDate,
        chargeType,
        expectedAmount,
        paidAmount,
        paymentMethod,
        mixedPaymentDetails: paymentMethod === 'mixed' ? { cashAmount, bkashAmount, nagadAmount } : undefined,
        collectorName,
        notes
      },
      selectedMember,
      collectorName
    );

    // Show Receipt Modal immediately
    setSelectedReceipt(newRecord);
    setIsReceiptOpen(true);

    // Trigger Automatic SMS & Push Notification dispatch
    try {
      CommunicationService.triggerAutoSms(
        tenantId,
        'collection_completed',
        {
          MemberName: selectedMember.fullName,
          Amount: paidAmount.toString(),
          ReceiptNo: newRecord.receiptNo,
          OrganizationName: tenantName,
          DueAmount: calculatedDue.toString(),
          Date: collectionDate,
          Phone: selectedMember.phone
        },
        selectedMember.phone,
        selectedMember.fullName
      );
    } catch (err) {
      console.warn('Auto SMS trigger silent error:', err);
    }

    // Reset notes
    setNotes('');
  };

  // Filtered History
  const filteredCollections = collections.filter((col) => {
    const q = filters.searchTerm.toLowerCase();
    const matchesSearch = 
      col.memberName.toLowerCase().includes(q) ||
      col.receiptNo.toLowerCase().includes(q) ||
      col.memberPhone.includes(q) ||
      col.membershipNumber.toLowerCase().includes(q) ||
      (col.vehicleNo && col.vehicleNo.toLowerCase().includes(q));

    const matchesStart = !filters.startDate || col.date >= filters.startDate;
    const matchesEnd = !filters.endDate || col.date <= filters.endDate;
    const matchesMethod = filters.paymentMethod === 'all' || col.paymentMethod === filters.paymentMethod;
    const matchesStatus = filters.paymentStatus === 'all' || col.paymentStatus === filters.paymentStatus;
    const matchesType = filters.chargeType === 'all' || col.chargeType === filters.chargeType;

    return matchesSearch && matchesStart && matchesEnd && matchesMethod && matchesStatus && matchesType;
  });

  // Calculate Overall Stats
  const stats: CollectionSummaryStats = CollectionService.calculateStats(collections);
  const dueList: DueRecord[] = CollectionService.getDueList(collections);

  // Printable Content Action
  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShareWhatsApp = (receipt: DailyCollectionRecord) => {
    const text = `*${receipt.tenantName}*\nগ্যারেজ জমার রসিদ: ${receipt.receiptNo}\nমেম্বার: ${receipt.memberName} (${receipt.membershipNumber})\nতারিখ: ${receipt.date} ${receipt.time}\nবিবরণ: ${receipt.chargeType}\nজমা প্রদান: ৳${receipt.paidAmount} (${receipt.paymentMethod.toUpperCase()})\nবকেয়া: ৳${receipt.dueAmount}\nক্যাশিয়ার: ${receipt.collectorName}\nধন্যবাদ!`;
    const url = `https://wa.me/88${receipt.memberPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header with Real-Time Stats */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-teal-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <DollarSign size={28} className="text-emerald-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">ডেইলি কালেকশন ও গ্যারেজ চার্জিং সিস্টেম</h1>
                <p className="text-emerald-100 text-sm mt-0.5">
                  অর্গানাইজেশন: <span className="font-semibold text-white">{tenantName}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Network & Offline Queue Status */}
          <div className="flex items-center gap-3">
            {isOnline ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 rounded-xl text-xs font-semibold backdrop-blur-sm">
                <Wifi size={14} /> ফায়ারবেস অনলাইন লাইভ
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-200 border border-amber-400/30 rounded-xl text-xs font-semibold backdrop-blur-sm">
                <WifiOff size={14} /> অফলাইন মোড (লোকাল কিউ)
              </span>
            )}

            {offlineQueueCount > 0 && (
              <button
                onClick={handleSyncOffline}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow"
              >
                <RefreshCw size={14} className="animate-spin" />
                {offlineQueueCount} টি সিঙ্ক করুন
              </button>
            )}
          </div>
        </div>

        {/* Auto Calculation Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-[11px] text-emerald-200 block">আজ মোট কালেকশন</span>
            <span className="text-xl font-extrabold text-emerald-300">৳{stats.todayTotal.toLocaleString('bn-BD')}</span>
            <span className="text-[10px] text-emerald-100 block mt-0.5">রসিদ সংখ্যা: {stats.todayCount} টি</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-[11px] text-emerald-200 block">মাসিক কালেকশন</span>
            <span className="text-xl font-extrabold text-white">৳{stats.monthlyTotal.toLocaleString('bn-BD')}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-[11px] text-emerald-200 block">বার্ষিক কালেকশন</span>
            <span className="text-xl font-extrabold text-white">৳{stats.yearlyTotal.toLocaleString('bn-BD')}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-[11px] text-emerald-200 block">মোট বকেয়া (Due)</span>
            <span className="text-xl font-extrabold text-rose-300">৳{stats.totalDue.toLocaleString('bn-BD')}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-[11px] text-emerald-200 block">এডভান্স ব্যালেন্স</span>
            <span className="text-xl font-extrabold text-amber-300">৳{stats.totalAdvance.toLocaleString('bn-BD')}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-[11px] text-emerald-200 block">আজকের তারিখ</span>
            <span className="text-sm font-bold text-white mt-1 block">
              {new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Feature Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 space-x-2">
        <button
          onClick={() => setActiveTab('entry')}
          className={`pb-3 px-5 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'entry'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <CreditCard size={18} />
          দৈনিক টাকা সংগ্রাহক স্ক্রিন (Fast Entry)
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-5 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'history'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <FileText size={18} />
          ট্রানজেকশন হিস্ট্রি ও ফিল্টার ({collections.length})
        </button>
        <button
          onClick={() => setActiveTab('dues')}
          className={`pb-3 px-5 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'dues'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <AlertTriangle size={18} />
          বকেয়া রিমাইন্ডার ও ম্যানেজমেন্ট ({dueList.length})
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: COLLECTION ENTRY SCREEN (FAST & TOUCH FRIENDLY)    */}
      {/* ========================================================= */}
      {activeTab === 'entry' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Member Selection & Search (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="text-emerald-600" />
                  ১. মেম্বার নির্বাচন
                </h2>
                <button
                  onClick={() => setIsQRScanOpen(true)}
                  className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-emerald-300"
                >
                  <QrCode size={16} /> QR / বারকোড স্ক্যান
                </button>
              </div>

              {/* Search Field */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="মেম্বার আইডি, নাম, মোবাইল বা গাড়ি নম্বর দিয়ে লিখুন..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Searched Member List Box */}
              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 border-t border-gray-100 dark:border-gray-800 pt-2">
                {searchedMembers.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">কোনো মেম্বার পাওয়া যায়নি</p>
                ) : (
                  searchedMembers.map((m) => {
                    const isSelected = selectedMember?.id === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMember(m)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 dark:bg-emerald-950/60 dark:border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={m.photoUrl}
                            alt={m.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-emerald-500 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-sm text-gray-900 dark:text-white block">{m.fullName}</span>
                            <span className="text-xs text-gray-500 font-mono block">{m.id} | {m.phone}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 block">{m.vehicleNo || 'গাড়ি নং নাই'}</span>
                          <span className="text-[10px] text-gray-400 block">{m.district}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Auto Selected Member Details Card */}
            {selectedMember && (
              <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-5 shadow-lg space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">নির্বাচিত মেম্বার প্রোফাইল</span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-[11px] font-semibold text-emerald-200">
                    {selectedMember.membershipType.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <img
                    src={selectedMember.photoUrl}
                    alt={selectedMember.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                  />
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-bold text-white">{selectedMember.fullName}</h3>
                    <p className="text-xs text-emerald-200 font-mono">আইডি: {selectedMember.id} ({selectedMember.membershipNumber})</p>
                    <p className="text-xs text-emerald-100 flex items-center gap-1">
                      <Phone size={12} /> {selectedMember.phone}
                    </p>
                    <p className="text-xs text-emerald-100 flex items-center gap-1">
                      <Car size={12} /> গাড়ি: <span className="font-bold text-white">{selectedMember.vehicleNo || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                {/* Duplicate Payment Alert Badge */}
                {duplicateWarning && (
                  <div className="p-3 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <AlertTriangle size={15} /> আজ ইতোমধ্যে টাকা জমা করা হয়েছে!
                    </div>
                    <p>রসিদ নং: {duplicateWarning.receiptNo} | পরিমাণ: ৳{duplicateWarning.paidAmount} | সময়: {duplicateWarning.time}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Collection Form (7 cols) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmitCollection} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="text-emerald-600" />
                  ২. জমার বিস্তারিত তথ্য
                </h2>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <input
                    type="date"
                    value={collectionDate}
                    onChange={(e) => setCollectionDate(e.target.value)}
                    className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Charge Type Selection */}
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">জমার বিষয় / চার্জ টাইপ</label>
                <select
                  value={chargeType}
                  onChange={(e) => setChargeType(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="দৈনিক গ্যারেজ চার্জ">দৈনিক গ্যারেজ চার্জ (Daily Garage Charge)</option>
                  <option value="মাসিক মেম্বারশিপ ফি">মাসিক মেম্বারশিপ ফি (Monthly Membership Fee)</option>
                  <option value="অটো ব্যাটারি চার্জিং চার্জ">অটো ব্যাটারি চার্জিং চার্জ (Auto Charging Fee)</option>
                  <option value="নাইট পার্কিং ফি">নাইট পার্কিং ফি (Night Parking Fee)</option>
                  <option value="ব্যাজ ও প্লাস্টিক কার্ড ফি">ব্যাজ ও প্লাস্টিক কার্ড ফি (Card Fee)</option>
                  <option value="অন্যান্য বিবিধ জমার ফি">অন্যান্য বিবিধ জমা (Other Collections)</option>
                </select>
              </div>

              {/* Expected vs Paid Amount Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">ধার্যকৃত পরিমাণ (৳ Expected)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={expectedAmount}
                    onChange={(e) => setExpectedAmount(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-lg font-bold text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">প্রাপ্ত পরিশোধিত পরিমাণ (৳ Paid) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border-2 border-emerald-500 dark:border-emerald-500 dark:bg-gray-800 text-xl font-extrabold text-emerald-700 dark:text-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick Preset Buttons (Touch Friendly & Fast) */}
              <div>
                <span className="text-[11px] font-semibold text-gray-500 block mb-2">দ্রুত জমার পরিমাণ সিলেক্ট করুন (Touch Presets):</span>
                <div className="grid grid-cols-5 gap-2">
                  {[100, 200, 300, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => applyAmountPreset(amt)}
                      className="py-2.5 bg-gray-100 hover:bg-emerald-600 hover:text-white dark:bg-gray-800 dark:hover:bg-emerald-600 rounded-xl font-bold text-sm text-gray-800 dark:text-gray-200 transition-all border border-gray-200 dark:border-gray-700 active:scale-95"
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Calculated Due / Advance Status Box */}
              <div className="p-4 rounded-xl border bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 block">হিসাবকৃত পেমেন্ট স্ট্যাটাস</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {calculatedStatus === 'paid' && <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle size={14} /> সম্পূর্ণ পরিশোধিত (Paid)</span>}
                    {calculatedStatus === 'partial' && <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1"><Clock size={14} /> আংশিক পরিশোধ (Partial Paid)</span>}
                    {calculatedStatus === 'due' && <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1"><AlertTriangle size={14} /> সম্পূর্ণ বকেয়া (Due)</span>}
                    {calculatedStatus === 'advance' && <span className="text-teal-600 dark:text-teal-400 flex items-center gap-1"><Sparkles size={14} /> এডভান্স জমা (Advance)</span>}
                  </span>
                </div>

                <div className="text-right">
                  {calculatedDue > 0 && (
                    <div>
                      <span className="text-xs text-gray-500 block">অবশিষ্ট বকেয়া (Due)</span>
                      <span className="text-lg font-bold text-rose-600 dark:text-rose-400">৳{calculatedDue}</span>
                    </div>
                  )}
                  {calculatedAdvance > 0 && (
                    <div>
                      <span className="text-xs text-gray-500 block">এডভান্স ব্যালেন্স</span>
                      <span className="text-lg font-bold text-teal-600 dark:text-teal-400">৳{calculatedAdvance}</span>
                    </div>
                  )}
                  {calculatedDue === 0 && calculatedAdvance === 0 && (
                    <span className="text-xs font-bold text-emerald-600">ব্যালেন্স: ৳০.০০</span>
                  )}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">পেমেন্ট মেথড (Payment Method)</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { id: 'cash', label: 'ক্যাশ (Cash)' },
                    { id: 'bkash', label: 'বিকাশ (bKash)' },
                    { id: 'nagad', label: 'নগদ (Nagad)' },
                    { id: 'rocket', label: 'রকেট (Rocket)' },
                    { id: 'bank', label: 'ব্যাংক (Bank)' },
                    { id: 'mixed', label: 'মিক্সড (Mixed)' }
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                        paymentMethod === pm.id
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                          : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mixed Payment Breakdown inputs if selected */}
              {paymentMethod === 'mixed' && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">ক্যাশ পরিমাণ</label>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">বিকাশ পরিমাণ</label>
                    <input
                      type="number"
                      value={bkashAmount}
                      onChange={(e) => setBkashAmount(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">নগদ পরিমাণ</label>
                    <input
                      type="number"
                      value={nagadAmount}
                      onChange={(e) => setNagadAmount(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </div>
              )}

              {/* Collector Name & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">কালেক্টর / ক্যাশিয়ারের নাম</label>
                  <input
                    type="text"
                    value={collectorName}
                    onChange={(e) => setCollectorName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">মন্তব্য (Notes)</label>
                  <input
                    type="text"
                    placeholder="বিশেষ মন্তব্য বা ট্রানজেকশন রেফারেন্স..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
              </div>

              {/* Submit Button (Large & Touch Friendly for Android TV / Touchscreens) */}
              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <CheckCircle size={22} />
                টাকা জমা কনফার্ম ও রসিদ প্রিন্ট করুন (Save Collection)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: TRANSACTION HISTORY & FILTER SEARCH                */}
      {/* ========================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="মেম্বার নাম, রসিদ নম্বর, মোবাইল বা গাড়ি নম্বর..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-xs"
                />
              </div>

              <div>
                <select
                  value={filters.paymentMethod}
                  onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-xs"
                >
                  <option value="all">সকল পেমেন্ট মেথড</option>
                  <option value="cash">Cash</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                  <option value="bank">Bank</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs uppercase font-semibold border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="py-3.5 px-4">রসিদ ও তারিখ</th>
                    <th className="py-3.5 px-4">মেম্বার ও গাড়ি</th>
                    <th className="py-3.5 px-4">জমার বিষয়</th>
                    <th className="py-3.5 px-4">পরিমাণ (Paid)</th>
                    <th className="py-3.5 px-4">বকেয়া / এডভান্স</th>
                    <th className="py-3.5 px-4">পেমেন্ট মেথড</th>
                    <th className="py-3.5 px-4">ক্যাশিয়ার</th>
                    <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredCollections.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-400">
                        কোনো কালেকশন ট্রানজেকশন পাওয়া যায়নি!
                      </td>
                    </tr>
                  ) : (
                    filteredCollections.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 block">{record.receiptNo}</span>
                          <span className="text-[11px] text-gray-500 block">{record.date} ({record.time})</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-gray-900 dark:text-white block">{record.memberName}</span>
                          <span className="text-xs text-gray-500 block">{record.memberPhone} | {record.vehicleNo || 'N/A'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-medium text-gray-800 dark:text-gray-200 block">{record.chargeType}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">৳{record.paidAmount}</span>
                        </td>
                        <td className="py-3 px-4">
                          {record.dueAmount > 0 && <span className="text-xs font-bold text-rose-600 block">বকেয়া: ৳{record.dueAmount}</span>}
                          {record.advanceAmount > 0 && <span className="text-xs font-bold text-teal-600 block">এডভান্স: ৳{record.advanceAmount}</span>}
                          {record.dueAmount === 0 && record.advanceAmount === 0 && <span className="text-xs text-emerald-600 font-semibold block">পরিশোধিত</span>}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold uppercase text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                            {record.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-gray-600 dark:text-gray-400 block">{record.collectorName}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedReceipt(record);
                                setIsReceiptOpen(true);
                              }}
                              title="রসিদ দেখুন ও প্রিন্ট করুন"
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-all"
                            >
                              <Printer size={16} />
                            </button>
                            <button
                              onClick={() => handleShareWhatsApp(record)}
                              title="হোয়াটসঅ্যাপে রসিদ পাঠান"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg transition-all"
                            >
                              <Share2 size={16} />
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm(`আপনি কি নিশ্চিত যে ট্রানজেকশন ${record.receiptNo} ডিলিট করতে চান?`)) {
                                  await CollectionService.softDeleteCollection(record.id, actorName);
                                }
                              }}
                              title="ডিলিট করুন"
                              className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: DUE MANAGEMENT & REMINDERS                         */}
      {/* ========================================================= */}
      {activeTab === 'dues' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="text-rose-500" />
              মেম্বার বকেয়া তালিকা (Due Management List)
            </h2>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950 px-3 py-1 rounded-full border border-rose-200">
              মোট বকেয়াধারী: {dueList.length} জন
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dueList.length === 0 ? (
              <p className="col-span-full py-8 text-center text-gray-400 text-sm">বর্তমানে কোনো সদস্যের বকেয়া অবশিষ্ট নেই!</p>
            ) : (
              dueList.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{item.memberName}</h3>
                      <p className="text-xs text-gray-500 font-mono">{item.membershipNumber} | {item.memberPhone}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 text-xs font-bold rounded-lg border border-rose-300">
                      বকেয়া: ৳{item.totalDue}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <p>গাড়ি নম্বর: <span className="font-semibold text-gray-800 dark:text-gray-200">{item.vehicleNo || 'নেই'}</span></p>
                    <p>সর্বশেষ পরিশোধের তারিখ: <span className="font-semibold">{item.lastPaymentDate}</span></p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-rose-100 dark:border-rose-900/30">
                    <button
                      onClick={() => {
                        const targetMem = members.find(m => m.id === item.memberId);
                        if (targetMem) {
                          setSelectedMember(targetMem);
                          setExpectedAmount(item.totalDue);
                          setPaidAmount(item.totalDue);
                          setActiveTab('entry');
                        }
                      }}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all text-center"
                    >
                      বকেয়া আদায় করুন
                    </button>
                    <button
                      onClick={() => setReminderDueItem(item)}
                      className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950 dark:hover:bg-rose-900 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                    >
                      <Send size={12} /> রিমাইন্ডার
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: RECEIPT & MULTI-FORMAT PRINT (THERMAL & A4)      */}
      {/* ========================================================= */}
      {isReceiptOpen && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-lg my-8 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Printer size={16} /> জমার রসিদ (Receipt Preview)
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPrintFormat('thermal')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${printFormat === 'thermal' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'}`}
                >
                  থার্মাল ৮০মিমি
                </button>
                <button
                  onClick={() => setPrintFormat('a4')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${printFormat === 'a4' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'}`}
                >
                  A4 পেপার
                </button>
                <button onClick={() => setIsReceiptOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg">
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Area */}
            <div className="p-6 space-y-4 text-gray-900 bg-white font-mono text-xs border-b border-gray-200" id="printable-receipt">
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-gray-300">
                <h2 className="text-base font-extrabold uppercase">{selectedReceipt.tenantName}</h2>
                <p className="text-[11px] text-gray-600">মিরপুর-১০, ঢাকা | হেল্পলাইন: 01712345678</p>
                <span className="inline-block px-3 py-0.5 bg-gray-100 rounded-full text-[10px] font-bold border border-gray-300">
                  অফিসিয়াল মানি রসিদ
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>রসিদ নম্বর:</span>
                  <span className="font-bold">{selectedReceipt.receiptNo}</span>
                </div>
                <div className="flex justify-between">
                  <span>তারিখ ও সময়:</span>
                  <span>{selectedReceipt.date} {selectedReceipt.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>মেম্বার নাম:</span>
                  <span className="font-bold">{selectedReceipt.memberName}</span>
                </div>
                <div className="flex justify-between">
                  <span>মোবাইল নং:</span>
                  <span>{selectedReceipt.memberPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span>গাড়ি নং:</span>
                  <span className="font-bold">{selectedReceipt.vehicleNo || 'N/A'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-gray-300 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>জমার কারণ:</span>
                  <span>{selectedReceipt.chargeType}</span>
                </div>
                <div className="flex justify-between">
                  <span>ধার্যকৃত চার্জ:</span>
                  <span>৳{selectedReceipt.expectedAmount}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-emerald-700">
                  <span>প্রাপ্ত পরিমাণ:</span>
                  <span>৳{selectedReceipt.paidAmount}</span>
                </div>
                {selectedReceipt.dueAmount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>অবশিষ্ট বকেয়া:</span>
                    <span>৳{selectedReceipt.dueAmount}</span>
                  </div>
                )}
                {selectedReceipt.advanceAmount > 0 && (
                  <div className="flex justify-between text-teal-600 font-bold">
                    <span>এডভান্স জমা:</span>
                    <span>৳{selectedReceipt.advanceAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] text-gray-500 pt-1">
                  <span>পেমেন্ট মাধ্যম:</span>
                  <span className="uppercase">{selectedReceipt.paymentMethod}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-dashed border-gray-300 flex justify-between items-end text-[10px] text-gray-500">
                <div>
                  <p>ক্যাশিয়ার: <span className="font-bold text-gray-800">{selectedReceipt.collectorName}</span></p>
                  <p className="italic">ধন্যবাদ, আবার আসবেন!</p>
                </div>
                <div className="text-center">
                  <div className="w-20 border-b border-gray-400 mb-1" />
                  <span>কর্তৃপক্ষের স্বাক্ষর</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
              <button
                onClick={() => handleShareWhatsApp(selectedReceipt)}
                className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Share2 size={14} /> WhatsApp Share
              </button>
              <button
                onClick={handlePrintReceipt}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Printer size={16} /> প্রিন্ট রসিদ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: QR SCAN SIMULATOR                                */}
      {/* ========================================================= */}
      {isQRScanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <QrCode className="text-emerald-600" /> QR / বারকোড স্ক্যানার
              </h3>
              <button onClick={() => setIsQRScanOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="p-6 bg-slate-950 text-emerald-400 rounded-2xl text-center border border-emerald-500/30 space-y-3">
              <QrCode size={64} className="mx-auto animate-pulse text-emerald-400" />
              <p className="text-xs text-slate-300">ক্যামেরা দিয়ে মেম্বারের আইডি কার্ড বা প্লাস্টিক ব্যাজের QR কোড স্ক্যান করুন</p>
            </div>

            <form onSubmit={handleQRScanSubmit} className="space-y-3">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">অথবা ম্যানুয়ালি QR/বারকোড কোড ইনপুট দিন:</label>
              <input
                type="text"
                autoFocus
                placeholder="যেমন: MEM-2026-001 বা 01712345678"
                value={qrCodeInput}
                onChange={(e) => setQrCodeInput(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm font-mono"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl"
              >
                মেম্বার স্ক্যান কনফার্ম করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: DUE REMINDER SMS DISPATCH                        */}
      {/* ========================================================= */}
      {reminderDueItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Send className="text-rose-500" /> বকেয়া রিমাইন্ডার বার্তা
              </h3>
              <button onClick={() => setReminderDueItem(null)} className="text-gray-400">✕</button>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs space-y-2">
              <p className="font-bold text-gray-900 dark:text-white">প্রাপক: {reminderDueItem.memberName} ({reminderDueItem.memberPhone})</p>
              <p className="text-rose-600 font-extrabold">মোট বকেয়া: ৳{reminderDueItem.totalDue}</p>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 text-xs font-mono text-gray-800 dark:text-gray-200">
              {CollectionService.generateDueReminderSMS(reminderDueItem, tenantName)}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  const msg = CollectionService.generateDueReminderSMS(reminderDueItem, tenantName);
                  window.open(`https://wa.me/88${reminderDueItem.memberPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                  setReminderDueItem(null);
                }}
                className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Share2 size={14} /> WhatsApp-এ পাঠান
              </button>
              <button
                onClick={() => {
                  alert(`রিমাইন্ডার SMS মেসেজ সেন্ড করার সার্কিট কিউতে যোগ করা হয়েছে!`);
                  setReminderDueItem(null);
                }}
                className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl"
              >
                SMS মেসেজ পাঠান
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
