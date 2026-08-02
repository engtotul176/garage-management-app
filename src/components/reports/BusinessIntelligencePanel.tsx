import React from 'react';
import { 
  Trophy, 
  Crown, 
  UserCheck, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { 
  TopPayingMember, 
  TopCollectorPerformance, 
  OrganizationBIStats, 
  GrowthMetrics 
} from '../../types/reports';

interface BusinessIntelligencePanelProps {
  topMembers: TopPayingMember[];
  topCollectors: TopCollectorPerformance[];
  orgStats: OrganizationBIStats[];
  growth: GrowthMetrics;
  isSuperAdmin?: boolean;
}

export const BusinessIntelligencePanel: React.FC<BusinessIntelligencePanelProps> = ({
  topMembers,
  topCollectors,
  orgStats,
  growth,
  isSuperAdmin = true
}) => {
  const formatCurrency = (val: number) => `৳ ${val.toLocaleString('bn-BD')}`;

  return (
    <div className="space-y-6">
      
      {/* Executive Growth & Ratio KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              কালেকশন গ্রোথ রেট (Growth)
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            +{growth.collectionGrowthPercent}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            পূর্ববর্তী মাসের তুলনায় কালেকশন বৃদ্ধি পেয়েছে
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-300">
              রেভিনিউ গ্রোথ (Revenue)
            </span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            +{growth.revenueGrowthPercent}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            চলতি সময়কালে মোট আয়বৃদ্ধি
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-transparent border border-sky-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-sky-800 dark:text-sky-300">
              বাকী আদায় সফলতার হার (Recovery)
            </span>
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-sky-700 dark:text-sky-300">
            {growth.dueRecoveryRatePercent}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            মোট বকেয়ার ৮৪.৫% সফলভাবে আদায় হয়েছে
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              ব্যয় বনাম আয় অনুপাত (Cost Ratio)
            </span>
            <Percent className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
            {growth.expenseToIncomeRatioPercent}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            প্রতি ১০০ টাকা আয়ে খরচ মাত্র ২৪.২ টাকা
          </div>
        </div>

      </div>

      {/* Grid: Top Paying Members & Top Collectors Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Paying Members */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              শীর্ষ পেমেন্টকারী মেম্বার (Top Paying Members)
            </h3>
            <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold px-2.5 py-1 rounded-full">
              মেম্বার লিডারবোর্ড
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="pb-2">র‍্যাংক</th>
                  <th className="pb-2">মেম্বার ও গাড়ি নং</th>
                  <th className="pb-2 text-right">মোট প্রদান</th>
                  <th className="pb-2 text-center">ট্রান্সেকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {topMembers.map((member, index) => (
                  <tr key={member.memberId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="py-2.5">
                      {index === 0 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-[10px]">
                          1
                        </span>
                      ) : index === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold text-[10px]">
                          2
                        </span>
                      ) : index === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-bold text-[10px]">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium pl-2">{index + 1}</span>
                      )}
                    </td>
                    <td className="py-2.5">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {member.memberName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {member.vehicleNo} • {member.phone}
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(member.totalPaid)}
                    </td>
                    <td className="py-2.5 text-center text-slate-600 dark:text-slate-300">
                      {member.totalTxnCount} টি
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Collector Staff Performance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Crown className="w-5 h-5 text-indigo-500" />
              শীর্ষ কালেকটর পারফর্মেন্স (Top Collectors)
            </h3>
            <span className="text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold px-2.5 py-1 rounded-full">
              স্টাফ পারফর্মেন্স
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="pb-2">কালেক্টর নাম</th>
                  <th className="pb-2 text-center">ক্যাশ / ডিজিটাল</th>
                  <th className="pb-2 text-right">মোট সংগ্রহ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {topCollectors.map((collector) => (
                  <tr key={collector.collectorUid} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="py-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {collector.collectorName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {collector.tenantName} ({collector.totalCollectionsCount} টি রসিদ)
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        ক্যাশ: {formatCurrency(collector.cashAmount)}
                      </div>
                      <div className="text-[10px] text-indigo-600 dark:text-indigo-400">
                        ডিজিটাল: {formatCurrency(collector.digitalAmount)}
                      </div>
                    </td>
                    <td className="py-3 text-right font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                      {formatCurrency(collector.totalCollected)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Super Admin BI Section: Most Active Organizations */}
      {isSuperAdmin && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-500" />
              অর্গানাইজেশন পারফর্মেন্স ও আয় বিশ্লেষণ (Super Admin Multi-Tenant BI)
            </h3>
            <span className="text-xs bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold px-2.5 py-1 rounded-full">
              এন্টারপ্রাইজ BI
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="pb-2.5">প্রতিষ্ঠান ও টাইপ</th>
                  <th className="pb-2.5 text-center">সক্রিয় চালক</th>
                  <th className="pb-2.5 text-right">মোট রেভিনিউ</th>
                  <th className="pb-2.5 text-right">মোট পরিচালন ব্যয়</th>
                  <th className="pb-2.5 text-right">নিট প্রফিট</th>
                  <th className="pb-2.5 text-center">গ্রোথ রেট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {orgStats.map((org) => (
                  <tr key={org.tenantId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">
                      <div>{org.tenantName}</div>
                      <div className="text-[11px] font-normal text-slate-500">{org.orgType}</div>
                    </td>
                    <td className="py-3 text-center text-slate-700 dark:text-slate-300 font-medium">
                      {org.activeMembers} জন
                    </td>
                    <td className="py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(org.totalRevenue)}
                    </td>
                    <td className="py-3 text-right text-rose-600 dark:text-rose-400">
                      {formatCurrency(org.totalExpenses)}
                    </td>
                    <td className="py-3 text-right font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(org.netProfit)}
                    </td>
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full text-[11px]">
                        +{org.growthRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
