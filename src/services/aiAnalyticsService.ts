import { AiAnalyticsDashboardData, SmartAlert, AIRecommendation } from '../types/aiAnalytics';

export const INITIAL_ANALYTICS_DATA: AiAnalyticsDashboardData = {
  healthScore: {
    dailyScore: 92,
    weeklyScore: 88,
    monthlyScore: 94,
    status: 'EXCELLENT',
    summary: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ এবং সামগ্রিক SaaS ক্লাস্টারের সকল পারফরম্যান্স সূচক অত্যন্ত ইতিবাচক।'
  },
  kpis: {
    revenueGrowthRate: 18.4,
    expenseTrendRate: -5.2,
    collectionTrendRate: 22.1,
    dueTrendAmount: 45000,
    activeMemberGrowthCount: 128,
    activeOrganizationGrowthCount: 18
  },
  insights: [
    {
      id: 'ins_01',
      category: 'REVENUE',
      title: 'শীর্ষ আয় সোর্স (Top Revenue Source)',
      metricValue: '৳১,৪৫,০০০ (৬২%)',
      subtitle: 'অটো চার্জিং ও গ্যারেজ নৈশ পার্কিং নাইট শিফট',
      impactScore: 'HIGH',
      actionSuggested: 'নাইট শিফটে অতিরিক্ত ২টি মেকার বে যুক্ত করুন'
    },
    {
      id: 'ins_02',
      category: 'EXPENSE',
      title: 'সর্বোচ্চ খরচ খাত (Top Expense Category)',
      metricValue: '৳৩৬,০০০ (৫৫%)',
      subtitle: 'ডেসকো বাণিজ্যিক বিদ্যুৎ বিল ও সাব-স্টেশন চার্জ',
      impactScore: 'HIGH',
      actionSuggested: 'সৌর বিদ্যুতায়নের মাধ্যমে ১৫% খরচ হ্রাস সম্ভব'
    },
    {
      id: 'ins_03',
      category: 'MEMBERS',
      title: 'সেরা পেমেন্টদাতা ড্রাইভার মেম্বার',
      metricValue: '২৫ জন নিয়মিত ড্রাইভার',
      subtitle: '১০০% সময়ে কিস্তি পরিশোধ সম্পন্ন করেছেন',
      impactScore: 'MEDIUM',
      actionSuggested: 'নিয়মিত ড্রাইভারদের জন্য ৫% রয়্যালটি বোনাস চালুর পরামর্শ'
    },
    {
      id: 'ins_04',
      category: 'DUE',
      title: 'উচ্চ বকেয়া রেজিস্টার (High Due Members)',
      metricValue: '৮ জন সদস্য (৳৩০,০০০)',
      subtitle: 'বকেয়ার পরিমাণ ৭ দিনের অধিক সময় ধরে ঝুলে আছে',
      impactScore: 'HIGH',
      actionSuggested: 'SMS অটোমেটেড রিমাইন্ডার ও লাইন সাময়িক স্থগিতকরণ'
    }
  ],
  predictive: {
    thirtyDayCollectionForecast: 385000,
    revenueForecastNextMonth: 420000,
    expenseForecastNextMonth: 78000,
    predictedSubscriptionRenewalsCount: 16,
    predictedMemberGrowthRate: 14.5,
    forecastTrend: [
      { dateOrMonth: 'Week 1', actualRevenue: 85000, predictedRevenue: 82000, actualExpense: 18000, predictedExpense: 19000, actualCollection: 88000, predictedCollection: 85000 },
      { dateOrMonth: 'Week 2', actualRevenue: 92000, predictedRevenue: 90000, actualExpense: 17500, predictedExpense: 18500, actualCollection: 95000, predictedCollection: 92000 },
      { dateOrMonth: 'Week 3', actualRevenue: 98000, predictedRevenue: 96000, actualExpense: 19000, predictedExpense: 19500, actualCollection: 102000, predictedCollection: 99000 },
      { dateOrMonth: 'Week 4', actualRevenue: 105000, predictedRevenue: 102000, actualExpense: 18500, predictedExpense: 18000, actualCollection: 108000, predictedCollection: 105000 },
      { dateOrMonth: 'Next W1 (Pred)', predictedRevenue: 112000, predictedExpense: 19000, predictedCollection: 115000 },
      { dateOrMonth: 'Next W2 (Pred)', predictedRevenue: 118000, predictedExpense: 19500, predictedCollection: 120000 }
    ]
  },
  smartAlerts: [
    {
      id: 'alt_01',
      severity: 'WARNING',
      title: 'উচ্চ বকেয়া নোটিফিকেশন (High Due Alert)',
      message: 'গ্যারেজের ৩ জন মেম্বারের বকেয়া ৳৫,০০০ টাকা অতিক্রম করেছে।',
      organizationName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
      timestamp: '10 mins ago',
      resolved: false
    },
    {
      id: 'alt_02',
      severity: 'INFO',
      title: 'সাবস্ক্রিপশন মেয়াদ অ্যালার্ট',
      message: 'রহমান পরিবহন স্ট্যান্ড-এর রিনিউয়াল সময়সীমা আগামী ৩ দিনের মধ্যে।',
      organizationName: 'রহমান পরিবহন স্ট্যান্ড',
      timestamp: '1 hour ago',
      resolved: false
    },
    {
      id: 'alt_03',
      severity: 'CRITICAL',
      title: 'বিদ্যুৎ বিল খরচ বৃদ্ধি অ্যালার্ট',
      message: 'চলতি সপ্তাহের বিদ্যুৎ বিল গত সপ্তাহের তুলনায় ১৪% বৃদ্ধি পেয়েছে।',
      organizationName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
      timestamp: '3 hours ago',
      resolved: false
    }
  ],
  recommendations: [
    {
      id: 'rec_01',
      type: 'COLLECTION',
      title: 'অটোমেটেড SMS পেমেন্ট রিমাইন্ডার সক্রিয়করণ',
      description: 'ড্রাইভারদের কিস্তি পরিশোধের তারিখের ১ দিন আগে স্বয়ংক্রিয় SMS পাঠালে কালেকশন সময়মত হওয়ার সম্ভাবনা ৮৫% বৃদ্ধি পায়।',
      estimatedRevenueImpact: '+৳২৪,০০০/মাস',
      priority: 'HIGH',
      applied: false
    },
    {
      id: 'rec_02',
      type: 'EXPENSE',
      title: 'অফ-পিক আওয়ারে ব্যাটারি চার্জিং শিডিউলিং',
      description: 'রাত ১১টা থেকে সকাল ৬টার মধ্যে অফ-পিক বিদ্যুৎ ট্যারিফে চার্জিং রোটেশন পরিচালনা করলে বিল অন্তত ১২% কমবে।',
      estimatedRevenueImpact: '৳৬,৫০০ সাশ্রয়/মাস',
      priority: 'HIGH',
      applied: false
    },
    {
      id: 'rec_03',
      type: 'REVENUE',
      title: 'ফাস্ট-চার্জার মেম্বারশিপ টায়ার চালুকরণ',
      description: 'দ্রুত চার্জিং সুবিধার জন্য প্রতি শিফটে অতিরিক্ত ৳৫০ টাকা প্রিমিয়াম ফি চার্জ চালু করা যেতে পারে।',
      estimatedRevenueImpact: '+৳১৫,০০০/মাস',
      priority: 'MEDIUM',
      applied: false
    },
    {
      id: 'rec_04',
      type: 'ENGAGEMENT',
      title: 'নিষ্ক্রিয় সদস্যদের ডিজিটাল মেম্বারশিপ পুনরুজ্জীবন',
      description: 'গত ১৫ দিন ধরে অনুপস্থিত ৯ জন ড্রাইভারকে বিশেষ ওয়েভার অফার সংবলিত বার্তা পাঠান।',
      estimatedRevenueImpact: '+৳৮,০০০/মাস',
      priority: 'MEDIUM',
      applied: false
    }
  ],
  lastCalculatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
};

export class AiAnalyticsEngine {
  static getDashboardData(tenantId?: string): AiAnalyticsDashboardData {
    return {
      ...INITIAL_ANALYTICS_DATA,
      lastCalculatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  static applyRecommendation(recId: string, currentData: AiAnalyticsDashboardData): AiAnalyticsDashboardData {
    return {
      ...currentData,
      recommendations: currentData.recommendations.map(r => r.id === recId ? { ...r, applied: true } : r)
    };
  }

  static resolveAlert(alertId: string, currentData: AiAnalyticsDashboardData): AiAnalyticsDashboardData {
    return {
      ...currentData,
      smartAlerts: currentData.smartAlerts.map(a => a.id === alertId ? { ...a, resolved: true } : a)
    };
  }
}
