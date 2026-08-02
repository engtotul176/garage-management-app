import React from 'react';
import { 
  Filter, 
  Calendar, 
  Building2, 
  UserCheck, 
  Users, 
  Car, 
  CreditCard, 
  Search, 
  RotateCcw 
} from 'lucide-react';
import { ReportFilterState, DatePreset, ReportType } from '../../types/reports';

interface ReportFilterHeaderProps {
  filter: ReportFilterState;
  onFilterChange: (updatedFilter: ReportFilterState) => void;
  onReset: () => void;
  organizations?: { id: string; name: string }[];
}

export const ReportFilterHeader: React.FC<ReportFilterHeaderProps> = ({
  filter,
  onFilterChange,
  onReset,
  organizations = [
    { id: 'ALL', name: 'সকল অর্গানাইজেশন (Super Admin View)' },
    { id: 'org_bismillah_001', name: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ' },
    { id: 'org_green_garage_002', name: 'গ্রীন অটো চার্জিং স্টেশন' },
    { id: 'org_city_transport_003', name: 'সিটি ট্রান্সপোর্ট অ্যান্ড সার্ভিসেস' }
  ]
}) => {
  const handleSelectChange = (field: keyof ReportFilterState, value: string) => {
    onFilterChange({ ...filter, [field]: value });
  };

  const reportTypeOptions: { id: ReportType; label: string; group: string }[] = [
    // Collection Reports
    { id: 'daily_collection', label: 'দৈনিক কালেকশন রিপোর্ট', group: 'কালেকশন ও আয়-ব্যয়' },
    { id: 'monthly_collection', label: 'মাসিক কালেকশন সামারি', group: 'কালেকশন ও আয়-ব্যয়' },
    { id: 'yearly_collection', label: 'বার্ষিক কালেকশন রিপোর্ট', group: 'কালেকশন ও আয়-ব্যয়' },
    { id: 'income', label: 'আয় (Revenue) রিপোর্ট', group: 'কালেকশন ও আয়-ব্যয়' },
    { id: 'expense', label: 'ব্যয় (Expense) রিপোর্ট', group: 'কালেকশন ও আয়-ব্যয়' },
    { id: 'cashbook', label: 'ক্যাশ বুক (Cash Book)', group: 'হিসাব ও স্টেটমেন্ট' },
    { id: 'bank', label: 'ব্যাংক স্টেটমেন্ট (Bank)', group: 'হিসাব ও স্টেটমেন্ট' },
    { id: 'ledger', label: 'খতিয়ান / লেজার (Ledger)', group: 'হিসাব ও স্টেটমেন্ট' },
    { id: 'due', label: 'বকেয়া (Due) রিপোর্ট', group: 'বাকী ও অগ্রিম' },
    { id: 'advance', label: 'অগ্রিম জমা (Advance) রিপোর্ট', group: 'বাকী ও অগ্রিম' },
    { id: 'member', label: 'মেম্বার / ড্রাইভার রিপোর্ট', group: 'সদস্য ও স্টাফ' },
    { id: 'employee', label: 'এমপ্লয়ি ও ক্যাশিয়ার রিপোর্ট', group: 'সদস্য ও স্টাফ' },
    { id: 'organization', label: 'অর্গানাইজেশন পারফর্মেন্স', group: 'এন্টারপ্রাইজ' },
    { id: 'subscription', label: 'সাবস্ক্রিপশন প্যাকেজ রিপোর্ট', group: 'এন্টারপ্রাইজ' },
    { id: 'payment_method', label: 'পেমেন্ট মেথড ডিস্ট্রিবিউশন', group: 'বিশ্লেষণ' },
    { id: 'sms_log', label: 'SMS লগ রিপোর্ট', group: 'সিস্টেম লগ' },
    { id: 'audit_log', label: 'অডিট লগ (Security Trail)', group: 'সিস্টেম লগ' }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
      {/* Top Controls: Report Type Selector & Quick Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        
        {/* Report Category & Type Selection */}
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Filter className="w-5 h-5" />
          </div>
          <div className="flex-1 max-w-md">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              রিপোর্টের ধরন নির্বাচন করুন (Select Report)
            </label>
            <select
              value={filter.reportType}
              onChange={(e) => handleSelectChange('reportType', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {reportTypeOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label} ({opt.group})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Global Search inside Report */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="রসিদ, নাম, গাড়ি বা বিবরণ খুঁজুন..."
            value={filter.searchQuery}
            onChange={(e) => handleSelectChange('searchQuery', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Reset Filter Button */}
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          ফিল্টার রিসেট
        </button>
      </div>

      {/* Grid Filter Bar: Date Presets, Organization, Collector, Payment Method, Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
        
        {/* Date Preset Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-indigo-500" /> সময়সীমা (Date Preset)
          </label>
          <select
            value={filter.datePreset}
            onChange={(e) => handleSelectChange('datePreset', e.target.value as DatePreset)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
          >
            <option value="today">আজকের লেনদেন (Today)</option>
            <option value="this_week">চলতি সপ্তাহ (This Week)</option>
            <option value="this_month">চলতি মাস (This Month)</option>
            <option value="this_year">চলতি বছর (This Year)</option>
            <option value="custom">কাস্টম তারিখ (Custom Range)</option>
          </select>
        </div>

        {/* Custom Date Inputs if 'custom' is selected */}
        {filter.datePreset === 'custom' && (
          <div className="sm:col-span-2 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">হতে (From)</label>
              <input
                type="date"
                value={filter.fromDate}
                onChange={(e) => handleSelectChange('fromDate', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">পর্যন্ত (To)</label>
              <input
                type="date"
                value={filter.toDate}
                onChange={(e) => handleSelectChange('toDate', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2 py-1.5 text-xs"
              />
            </div>
          </div>
        )}

        {/* Organization Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-sky-500" /> প্রতিষ্ঠান (Organization)
          </label>
          <select
            value={filter.tenantId}
            onChange={(e) => handleSelectChange('tenantId', e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
          >
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-emerald-500" /> পেমেন্ট মেথড
          </label>
          <select
            value={filter.paymentMethod}
            onChange={(e) => handleSelectChange('paymentMethod', e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
          >
            <option value="ALL">সকল মেথড (All Methods)</option>
            <option value="cash">নগদ ক্যাশ (Cash)</option>
            <option value="bkash">বিকাশ (bKash)</option>
            <option value="nagad">নগদ (Nagad)</option>
            <option value="bank">ব্যাংক (Bank Transfer)</option>
            <option value="cheque">চেক (Cheque)</option>
          </select>
        </div>

        {/* Payment / Record Status Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-amber-500" /> স্ট্যাটাস (Status)
          </label>
          <select
            value={filter.status}
            onChange={(e) => handleSelectChange('status', e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
          >
            <option value="ALL">সকল স্ট্যাটাস (All)</option>
            <option value="paid">পরিশোধিত (Paid)</option>
            <option value="due">বকেয়া (Due)</option>
            <option value="pending">পেন্ডিং (Pending)</option>
            <option value="active">সক্রিয় (Active)</option>
          </select>
        </div>

      </div>
    </div>
  );
};
