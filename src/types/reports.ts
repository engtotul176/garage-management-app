import { PaymentMethod } from './finance';

export type ReportType =
  | 'daily_collection'
  | 'monthly_collection'
  | 'yearly_collection'
  | 'income'
  | 'expense'
  | 'cashbook'
  | 'bank'
  | 'ledger'
  | 'due'
  | 'advance'
  | 'member'
  | 'employee'
  | 'organization'
  | 'subscription'
  | 'payment_method'
  | 'sms_log'
  | 'audit_log';

export type DatePreset = 'today' | 'this_week' | 'this_month' | 'this_year' | 'custom';

export interface ReportFilterState {
  reportType: ReportType;
  datePreset: DatePreset;
  fromDate: string;
  toDate: string;
  tenantId: string; // 'ALL' for super admin or specific org ID
  branchName: string; // 'ALL' or specific
  employeeId: string; // 'ALL' or specific collector/staff
  collectorName: string;
  memberId: string; // 'ALL' or specific member/driver
  vehicleNo: string;
  paymentMethod: string; // 'ALL', 'cash', 'bank', 'mobile_banking', 'cheque'
  status: string; // 'ALL', 'paid', 'due', 'pending', 'approved', 'active', etc.
  searchQuery: string;
}

export interface ReportSummaryStats {
  todayCollection: number;
  weeklyCollection: number;
  monthlyCollection: number;
  yearlyCollection: number;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  totalDueAmount: number;
  totalAdvanceAmount: number;
  activeMembersCount: number;
  activeEmployeesCount: number;
  activeOrganizationsCount: number;
  totalTxnCount: number;
}

export interface CollectionTrendData {
  period: string; // Date or Month or Year name
  collectionAmount: number;
  incomeAmount: number;
  expenseAmount: number;
  netProfit: number;
  dueAmount: number;
  count: number;
}

export interface CategoryBreakdownData {
  name: string;
  value: number;
  percentage: number;
  color?: string;
}

export interface PaymentMethodDistribution {
  method: string;
  methodLabel: string;
  amount: number;
  count: number;
  percentage: number;
}

// Business Intelligence (BI) Metrics
export interface TopPayingMember {
  memberId: string;
  memberName: string;
  membershipNumber: string;
  phone: string;
  vehicleNo: string;
  tenantName: string;
  totalPaid: number;
  totalTxnCount: number;
  lastPaymentDate: string;
}

export interface TopCollectorPerformance {
  collectorUid: string;
  collectorName: string;
  tenantName: string;
  totalCollected: number;
  totalCollectionsCount: number;
  cashAmount: number;
  digitalAmount: number;
}

export interface OrganizationBIStats {
  tenantId: string;
  tenantName: string;
  orgType: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  activeMembers: number;
  growthRate: number; // %
}

export interface GrowthMetrics {
  currentPeriodCollection: number;
  previousPeriodCollection: number;
  collectionGrowthPercent: number;
  currentPeriodRevenue: number;
  previousPeriodRevenue: number;
  revenueGrowthPercent: number;
  dueRecoveryRatePercent: number;
  totalDueResolved: number;
  expenseToIncomeRatioPercent: number;
}

export interface ReportAuditTrailEntry {
  id: string;
  tenantId: string;
  reportType: ReportType;
  filterSummary: string;
  formatExported?: 'view' | 'pdf' | 'excel' | 'csv' | 'print';
  generatedBy: string;
  timestamp: string;
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  type: 'stat' | 'line_chart' | 'bar_chart' | 'pie_chart' | 'area_chart' | 'leaderboard';
  visible: boolean;
  order: number;
}
