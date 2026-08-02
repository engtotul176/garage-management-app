export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank' | 'mixed';
export type PaymentStatus = 'paid' | 'partial' | 'due' | 'advance';

export interface DailyCollectionRecord {
  id: string;
  receiptNo: string;
  tenantId: string;
  tenantName: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  membershipNumber: string;
  vehicleNo: string;
  photoUrl?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm AM/PM
  chargeType: string;
  expectedAmount: number;
  paidAmount: number;
  dueAmount: number;
  advanceAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  mixedPaymentDetails?: {
    cashAmount?: number;
    bkashAmount?: number;
    nagadAmount?: number;
    rocketAmount?: number;
    bankAmount?: number;
  };
  collectorName: string;
  notes?: string;
  transactionId?: string;
  isOfflineCreated?: boolean;
  createdAt: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export interface DueRecord {
  id: string;
  tenantId: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  membershipNumber: string;
  vehicleNo?: string;
  totalDue: number;
  advanceBalance: number;
  lastPaymentDate: string;
  status: 'due' | 'clear' | 'overdue';
  dueDate?: string;
}

export interface CollectionSummaryStats {
  todayTotal: number;
  todayCount: number;
  monthlyTotal: number;
  yearlyTotal: number;
  totalDue: number;
  totalAdvance: number;
}

export interface CollectionFilterOptions {
  searchTerm: string;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  paymentStatus: string;
  collectorName: string;
  chargeType: string;
}
