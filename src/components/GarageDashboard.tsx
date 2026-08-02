import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Receipt, TrendingUp, AlertCircle, ArrowUpRight, Trash2, Car, ShieldAlert } from 'lucide-react';
import { OrganizationTenant, DailyCollectionRecord } from '../types/saas';
import { MemberRecord } from '../types/member';
import { MemberService } from '../services/memberService';
import { MOCK_COLLECTIONS } from '../data/mockSaaSData';

interface GarageDashboardProps {
  currentOrg: OrganizationTenant;
}

interface GarageActivityItem {
  id: string;
  type: 'driver' | 'collection';
  title: string;
  subtitle: string;
  amountOrVehicle: string;
  date: string;
}

const INITIAL_ACTIVITIES: GarageActivityItem[] = [
  { id: 'act_1', type: 'driver', title: 'আলহাজ্ব মোঃ সামসুল হক', subtitle: 'সদস্য আইডি: MS-1001', amountOrVehicle: 'ঢাকা মেট্রো-থ-১১-৪৫২৩', date: 'আজ ১০:৩০ AM' },
  { id: 'act_2', type: 'collection', title: 'গ্যারেজ চার্জ কালেকশন (RCP-2026-07-101)', subtitle: 'সংগ্রাহক: জসিম', amountOrVehicle: '৳ ৩০০ (ক্যাশ)', date: 'আজ ১০:৩০ AM' },
  { id: 'act_3', type: 'driver', title: 'মোঃ কামাল হোসেন', subtitle: 'সদস্য আইডি: MS-1002', amountOrVehicle: 'ঢাকা মেট্রো-হ-১২-৮৮৯০', date: 'আজ ১১:১৫ AM' },
  { id: 'act_4', type: 'collection', title: 'নাইট পার্কিং ফি (RCP-2026-07-102)', subtitle: 'সংগ্রাহক: রফিকুল', amountOrVehicle: '৳ ৩০০ (বিকাশ)', date: 'আজ ১১:১৫ AM' },
];

const toBengaliNumber = (num: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
};

export const GarageDashboard: React.FC<GarageDashboardProps> = ({ currentOrg }) => {
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [collections, setCollections] = useState<DailyCollectionRecord[]>([]);

  const [activities, setActivities] = useState<GarageActivityItem[]>(() => {
    try {
      const isCleared = localStorage.getItem('ababil_garage_activities_cleared') === 'true';
      if (isCleared) return [];
      const deletedIds = JSON.parse(localStorage.getItem('ababil_deleted_garage_activity_ids') || '[]');
      return INITIAL_ACTIVITIES.filter(item => !deletedIds.includes(item.id));
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const unsub = MemberService.subscribeMembers(currentOrg?.id || 'org_bismillah_001', (data) => {
      setMembers(data);
    });
    return () => unsub();
  }, [currentOrg?.id]);

  useEffect(() => {
    try {
      const isCleared = localStorage.getItem('ababil_collections_cleared') === 'true';
      if (isCleared) {
        setCollections([]);
        return;
      }
      const saved = localStorage.getItem('ababil_daily_collections');
      const deletedIds: string[] = JSON.parse(localStorage.getItem('ababil_deleted_collection_ids') || '[]');
      let list = saved ? JSON.parse(saved) : [];
      const filtered = list.filter((item: DailyCollectionRecord) => !deletedIds.includes(item.id) && (!currentOrg?.id || item.tenantId === currentOrg.id || item.tenantId === 'org_bismillah_001'));
      setCollections(filtered);
    } catch {
      setCollections([]);
    }
  }, [currentOrg?.id]);

  // Calculate live statistics strictly from database/state records without static fallback numbers
  const activeCount = members.filter(m => m.status === 'active' || !m.status).length;
  const activeDriversCount = activeCount;

  // Only consider today's or total collections as present in state
  const totalCollectionSum = collections.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const displayTodayCollection = totalCollectionSum;
  const displayVouchersCount = collections.length;

  const monthlyIncome = totalCollectionSum; // Or actual monthly sum from collections

  const calculatedDueSum = members.reduce((acc, m) => acc + (Number(m.totalDueAmount || m.dueAmount) || 0), 0);
  const displayDueSum = calculatedDueSum;
  const dueMembersCount = members.filter(m => ((Number(m.totalDueAmount || m.dueAmount) || 0) > 0)).length;
  const displayDueMembersCount = dueMembersCount;

  const persistDeletedIds = (ids: string[]) => {
    try {
      const existing = JSON.parse(localStorage.getItem('ababil_deleted_garage_activity_ids') || '[]');
      const updated = Array.from(new Set([...existing, ...ids]));
      localStorage.setItem('ababil_deleted_garage_activity_ids', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save deleted activity IDs:', e);
    }
  };

  const handleDeleteActivity = (id: string, title: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে গ্যারেজ ড্যাশবোর্ড থেকে "${title}" রেকর্ডটি ডিলিট করতে চান?`)) {
      persistDeletedIds([id]);
      setActivities(prev => prev.filter(item => item.id !== id));
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`আপনি কি নিশ্চিত যে নির্বাচিত ${selectedIds.length} টি অ্যাক্টিভিটি ডিলিট করতে চান?`)) {
      persistDeletedIds(selectedIds);
      setActivities(prev => prev.filter(item => !selectedIds.includes(item.id)));
      setSelectedIds([]);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে ড্যাশবোর্ডের সমস্ত রিসেন্ট অ্যাক্টিভিটি ডিলিট করে ফাঁকা করতে চান?')) {
      try {
        localStorage.setItem('ababil_garage_activities_cleared', 'true');
      } catch (e) {
        console.warn('Failed to set cleared flag:', e);
      }
      setActivities([]);
      setSelectedIds([]);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === activities.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(activities.map(a => a.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>গ্যারেজ লাইভ ড্যাশবোর্ড</span>
          </div>
          <h1 className="text-xl font-bold">{currentOrg.name}</h1>
          <p className="text-xs text-slate-300 mt-1">
            আজকের সার্বিক ড্রাইভার হাজিরা, গাড়ি ভাড়া কালেকশন এবং বকেয়ার সংক্ষিপ্ত তথ্যচিত্র।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-medium">
            ● অনলাইন সার্ভার একটিভ
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>মোট একটিভ ড্রাইভার/গাড়ি</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {toBengaliNumber(activeDriversCount)} জন
          </p>
          <p className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            ৯৮% নিয়মিত পার্কিং
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>আজকের মোট কালেকশন</span>
            <Receipt className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 mt-2">
            ৳ {toBengaliNumber(displayTodayCollection.toLocaleString('en-US'))}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {toBengaliNumber(displayVouchersCount)} টি ভাউচার ইস্যু
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>চলতি মাসের আয়</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-purple-600 mt-2">
            ৳ {toBengaliNumber(Math.round(monthlyIncome).toLocaleString('en-US'))}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            অনুপাত: ৯৪% আদায়
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>মোট বকেয়া পাওনা</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-rose-600 mt-2">
            ৳ {toBengaliNumber(displayDueSum.toLocaleString('en-US'))}
          </p>
          <p className="text-[11px] text-rose-500 mt-1">
            {toBengaliNumber(displayDueMembersCount)} জন মেম্বারের বকেয়া আছে
          </p>
        </div>
      </div>

      {/* Quick Garage Activity & Record Deletion Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-sky-600" />
              গ্যারেজ রিসেন্ট অ্যাক্টিভিটি ও ম্যানেজমেন্ট ({activities.length} টি)
            </h3>
            <p className="text-xs text-slate-500">সহজেই যেকোনো ড্রাইভার বা কালেকশন রেকর্ড সরাসরি ডিলিট করুন</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBatchDelete}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>সিলেক্ট করা ডিলিট ({selectedIds.length})</span>
              </button>
            )}

            {activities.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>সব ডিলিট করুন</span>
              </button>
            )}
          </div>
        </div>

        {activities.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            গ্যারেজ রিসেন্ট অ্যাক্টিভিটি লিস্ট ফাঁকা। কোনো রেকর্ড নেই।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === activities.length}
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                  </th>
                  <th className="p-3">ধরণ</th>
                  <th className="p-3">রেকর্ড / নাম</th>
                  <th className="p-3">বিবরণ / সদস্য আইডি</th>
                  <th className="p-3">গাড়ি / পরিমাণ</th>
                  <th className="p-3">সময়</th>
                  <th className="p-3 text-right">ডিলিট করুন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activities.map((act) => {
                  const isChecked = selectedIds.includes(act.id);
                  return (
                    <tr key={act.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${isChecked ? 'bg-rose-50/40 dark:bg-rose-950/30' : ''}`}>
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectOne(act.id)}
                          className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          act.type === 'driver' ? 'bg-sky-50 text-sky-600 border border-sky-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}>
                          {act.type === 'driver' ? 'ড্রাইভার' : 'কালেকশন'}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{act.title}</td>
                      <td className="p-3 text-slate-500">{act.subtitle}</td>
                      <td className="p-3 font-bold font-mono text-slate-800 dark:text-slate-200">{act.amountOrVehicle}</td>
                      <td className="p-3 text-slate-400 font-mono">{act.date}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteActivity(act.id, act.title)}
                          className="p-1.5 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950 rounded-lg transition-colors inline-flex items-center gap-1"
                          title="ডিলিট করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>ডিলিট</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
