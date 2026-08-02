import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  QrCode, 
  User, 
  Receipt, 
  MessageSquare, 
  Building2, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  DollarSign 
} from 'lucide-react';
import { MemberPortalProfile, CollectionHistoryRecord, MemberSmsRecord } from '../../types/customerPortal';
import { CustomerPortalService } from '../../services/customerPortalService';
import { DigitalMembershipCard } from './DigitalMembershipCard';
import { MemberProfileEdit } from './MemberProfileEdit';
import { MemberCollectionsList } from './MemberCollectionsList';
import { MemberSmsHistory } from './MemberSmsHistory';
import { OrgAdminPortalView } from './OrgAdminPortalView';

interface CustomerPortalDashboardProps {
  currentMemberId?: string;
  currentTenantId?: string;
  actorName?: string;
  isOrgAdmin?: boolean;
}

export const CustomerPortalDashboard: React.FC<CustomerPortalDashboardProps> = ({
  currentMemberId = 'mem_88201',
  currentTenantId = 'org_bismillah_001',
  actorName = 'মোঃ জহিরুল ইসলাম',
  isOrgAdmin = true
}) => {
  const [activeTab, setActiveTab] = useState<'CARD' | 'PROFILE' | 'COLLECTIONS' | 'SMS' | 'ORG_ADMIN'>('CARD');
  
  const [profile, setProfile] = useState<MemberPortalProfile | null>(null);
  const [collections, setCollections] = useState<CollectionHistoryRecord[]>([]);
  const [smsHistory, setSmsHistory] = useState<MemberSmsRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadPortalData = async () => {
    setLoading(true);
    try {
      const prof = await CustomerPortalService.getMemberProfile(currentMemberId);
      const cols = await CustomerPortalService.getMemberCollections(currentMemberId);
      const sms = await CustomerPortalService.getMemberSmsHistory(currentMemberId);

      setProfile(prof);
      setCollections(cols);
      setSmsHistory(sms);

      // Create session log
      await CustomerPortalService.createCustomerSession(currentMemberId, prof.email, currentTenantId);

    } catch (e) {
      console.error('Error loading portal data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, [currentMemberId]);

  if (!profile && loading) {
    return (
      <div className="p-12 text-center text-slate-400 font-bold flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        কাস্টমার পোর্টাল ডাটা লোড হচ্ছে...
      </div>
    );
  }

  const currentProfile = profile || {
    id: currentMemberId,
    tenantId: currentTenantId,
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    memberCode: 'MEM-ABABIL-2026-991',
    fullName: actorName,
    mobile: '01711002233',
    email: 'zahir.garage@gmail.com',
    role: 'MEMBER',
    joiningDate: '2025-01-15',
    totalCollectionsPaid: 32500,
    totalCurrentDue: 1200,
    membershipStatus: 'ACTIVE',
    qrCodeData: `ABABIL-CARD-${currentMemberId}`,
    lastLoginAt: new Date().toISOString()
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 font-sans">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> PROMPT-20 Customer Portal & Member Self-Service
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-400" />
            কাস্টমার পোর্টাল & মেম্বার সেলফ সার্ভিস ড্যাশবোর্ড
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            মেম্বার প্রোফাইল ম্যানেজমেন্ট, কালেকশন & ডিউ হিস্ট্রি, ডিজিটাল মেম্বারশিপ কার্ড (QR Code), পাসওয়ার্ড ও সিকিউরিটি সেটআপ।
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <button
            onClick={loadPortalData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl border border-white/20 transition-all backdrop-blur-md"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            রিফ্রেশ
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
        {[
          { id: 'CARD', label: 'ডিজিটাল মেম্বারশিপ কার্ড', icon: QrCode },
          { id: 'PROFILE', label: 'প্রোফাইল & সেলফ সার্ভিস', icon: User },
          { id: 'COLLECTIONS', label: 'কালেকশন & ডিউ হিস্ট্রি', icon: Receipt },
          { id: 'SMS', label: 'এসএমএস নোটিফিকেশন', icon: MessageSquare },
          ...(isOrgAdmin ? [{ id: 'ORG_ADMIN', label: 'অর্গানাইজেশন এডমিন পোর্টাল', icon: Building2 }] : [])
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                active
                  ? 'bg-indigo-600 text-white shadow-md scale-102'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Views */}
      {activeTab === 'CARD' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DigitalMembershipCard profile={currentProfile} />
            <MemberCollectionsList
              memberId={currentProfile.id}
              collections={collections}
              totalPaid={currentProfile.totalCollectionsPaid}
              totalDue={currentProfile.totalCurrentDue}
            />
          </div>

          <div className="space-y-6">
            <MemberSmsHistory smsRecords={smsHistory} />
          </div>
        </div>
      )}

      {activeTab === 'PROFILE' && (
        <MemberProfileEdit
          profile={currentProfile}
          onProfileUpdated={loadPortalData}
          actorName={actorName}
        />
      )}

      {activeTab === 'COLLECTIONS' && (
        <MemberCollectionsList
          memberId={currentProfile.id}
          collections={collections}
          totalPaid={currentProfile.totalCollectionsPaid}
          totalDue={currentProfile.totalCurrentDue}
        />
      )}

      {activeTab === 'SMS' && (
        <MemberSmsHistory smsRecords={smsHistory} />
      )}

      {activeTab === 'ORG_ADMIN' && (
        <OrgAdminPortalView
          tenantId={currentTenantId}
          tenantName={currentProfile.tenantName}
        />
      )}

    </div>
  );
};
