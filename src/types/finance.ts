export type PaymentMethod = 'cash' | 'bank' | 'mobile_banking' | 'cheque';
export type ExpenseStatus = 'pending' | 'approved' | 'rejected';
export type LedgerType = 'member' | 'employee' | 'organization' | 'cash' | 'bank';
export type BankAccountType = 'savings' | 'current' | 'cd' | 'mobile_mfs';
export type BankTxType = 'deposit' | 'withdraw' | 'transfer_in' | 'transfer_out';

export interface IncomeCategory {
  id: string;
  tenantId: string;
  name: string;
  code?: string;
  description?: string;
  isDefault?: boolean;
  createdAt: string;
}

export interface ExpenseCategory {
  id: string;
  tenantId: string;
  name: string;
  code?: string;
  description?: string;
  budgetLimit?: number;
  isDefault?: boolean;
  createdAt: string;
}

export interface IncomeRecord {
  id: string;
  tenantId: string;
  tenantName?: string;
  voucherNo: string;
  date: string; // YYYY-MM-DD
  time?: string;
  categoryId: string;
  categoryName: string;
  sourceType: 'member' | 'customer' | 'other';
  sourceName: string;
  sourceId?: string; // memberId or customerId
  amount: number;
  paymentMethod: PaymentMethod;
  bankAccountId?: string;
  bankAccountName?: string;
  referenceNo?: string;
  note?: string;
  attachmentUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface ExpenseRecord {
  id: string;
  tenantId: string;
  tenantName?: string;
  voucherNo: string;
  date: string; // YYYY-MM-DD
  time?: string;
  categoryId: string;
  categoryName: string;
  payeeName: string;
  payeeId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  bankAccountId?: string;
  bankAccountName?: string;
  status: ExpenseStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  note?: string;
  attachmentUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface CashbookEntry {
  id: string;
  tenantId: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: 'cash_in' | 'cash_out';
  amount: number;
  category: string;
  partyName: string;
  referenceNo?: string;
  description: string;
  sourceModule?: 'income' | 'expense' | 'daily_collection' | 'manual' | 'bank_withdraw' | 'bank_deposit';
  sourceRecordId?: string;
  runningCashBalance: number;
  createdBy: string;
  createdAt: string;
}

export interface DailyCashClosing {
  id: string;
  tenantId: string;
  date: string; // YYYY-MM-DD
  openingBalance: number;
  totalCashIn: number;
  totalCashOut: number;
  closingBalance: number;
  actualPhysicalCash?: number;
  discrepancy?: number;
  note?: string;
  status: 'open' | 'closed';
  closedBy: string;
  closedAt: string;
}

export interface BankAccount {
  id: string;
  tenantId: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  branchName: string;
  routingNo?: string;
  accountType: BankAccountType;
  openingBalance: number;
  currentBalance: number;
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BankTransaction {
  id: string;
  tenantId: string;
  bankAccountId: string;
  bankAccountName: string;
  targetBankAccountId?: string;
  targetBankAccountName?: string;
  date: string;
  time: string;
  txType: BankTxType;
  amount: number;
  referenceNo?: string;
  note?: string;
  runningBalance: number;
  createdBy: string;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  tenantId: string;
  ledgerType: LedgerType;
  entityId?: string; // memberId, employeeId, bankAccountId, etc.
  entityName: string;
  date: string;
  voucherNo: string;
  description: string;
  debit: number; // টাকা খরচ/দাবি
  credit: number; // টাকা জমা/পরিশোধ
  balance: number; // জের
  createdAt: string;
}

export interface FinancialSummary {
  todayIncome: number;
  todayExpense: number;
  currentCashBalance: number;
  currentBankBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  totalNetProfit: number;
  totalDueAmount: number;
  totalAdvanceAmount: number;
}
