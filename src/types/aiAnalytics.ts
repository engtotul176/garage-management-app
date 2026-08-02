export interface BusinessHealthScore {
  dailyScore: number; // 0-100
  weeklyScore: number; // 0-100
  monthlyScore: number; // 0-100
  status: 'EXCELLENT' | 'STABLE' | 'WARNING' | 'CRITICAL';
  summary: string;
}

export interface SmartInsightItem {
  id: string;
  category: 'REVENUE' | 'EXPENSE' | 'MEMBERS' | 'ORGANIZATION' | 'DUE';
  title: string;
  metricValue: string;
  subtitle: string;
  impactScore: 'HIGH' | 'MEDIUM' | 'LOW';
  actionSuggested: string;
}

export interface ForecastDataPoint {
  dateOrMonth: string;
  actualRevenue?: number;
  predictedRevenue: number;
  actualExpense?: number;
  predictedExpense: number;
  actualCollection?: number;
  predictedCollection: number;
}

export interface PredictiveAnalytics {
  thirtyDayCollectionForecast: number;
  revenueForecastNextMonth: number;
  expenseForecastNextMonth: number;
  predictedSubscriptionRenewalsCount: number;
  predictedMemberGrowthRate: number; // %
  forecastTrend: ForecastDataPoint[];
}

export interface SmartAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  organizationName?: string;
  timestamp: string;
  actionUrl?: string;
  resolved: boolean;
}

export interface AIRecommendation {
  id: string;
  type: 'COLLECTION' | 'EXPENSE' | 'REVENUE' | 'ENGAGEMENT';
  title: string;
  description: string;
  estimatedRevenueImpact: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  applied: boolean;
}

export interface AiAnalyticsDashboardData {
  healthScore: BusinessHealthScore;
  kpis: {
    revenueGrowthRate: number; // %
    expenseTrendRate: number; // %
    collectionTrendRate: number; // %
    dueTrendAmount: number;
    activeMemberGrowthCount: number;
    activeOrganizationGrowthCount: number;
  };
  insights: SmartInsightItem[];
  predictive: PredictiveAnalytics;
  smartAlerts: SmartAlert[];
  recommendations: AIRecommendation[];
  lastCalculatedAt: string;
}
