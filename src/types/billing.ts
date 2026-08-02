export type PaymentGatewayType = 
  | 'BKASH' 
  | 'NAGAD' 
  | 'ROCKET' 
  | 'SSLCOMMERZ' 
  | 'BANK_TRANSFER' 
  | 'MANUAL' 
  | 'STRIPE' 
  | 'PAYPAL';

export type BillingCycle = 
  | 'TRIAL' 
  | 'MONTHLY' 
  | 'QUARTERLY' 
  | 'HALF_YEARLY' 
  | 'YEARLY' 
  | 'LIFETIME';

export type PaymentStatus = 
  | 'PAID' 
  | 'PENDING_VERIFICATION' 
  | 'REJECTED' 
  | 'REFUNDED' 
  | 'FAILED';

export interface PaymentGatewayConfig {
  id: string;
  gatewayType: PaymentGatewayType;
  name: string;
  isEnabled: boolean;
  isSandbox: boolean;
  merchantId?: string;
  apiKey?: string;
  secretKey?: string;
  accountNumber?: string;
  bankName?: string;
  branchName?: string;
  instructionsBn?: string;
  supportedCurrencies: string[];
}

export interface SubscriptionInvoice {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  planName: string;
  billingCycle: BillingCycle;
  amount: number;
  taxAmount: number;
  discountAmount: number;
  netAmount: number;
  currency: string;
  status: PaymentStatus;
  gatewayType: PaymentGatewayType;
  transactionId: string;
  senderMobileOrAccount?: string;
  paymentProofUrl?: string;
  paidAt: string;
  periodStart: string;
  periodEnd: string;
  paidBy: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface TransactionRecord {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  gatewayType: PaymentGatewayType;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  paymentDate: string;
  paidBy: string;
  remarks?: string;
}

export interface BillingOverviewStats {
  totalRevenueMonthly: number;
  totalRevenueYearly: number;
  activePaidSubscriptions: number;
  pendingVerificationsCount: number;
  totalInvoicesCount: number;
  recentTransactionsCount: number;
  currentPlanName: string;
  currentPlanExpiresAt: string;
  isSubscriptionActive: boolean;
}
