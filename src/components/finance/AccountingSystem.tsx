import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Landmark, 
  PiggyBank, 
  PieChart, 
  Building2, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';
import { useAuth } from '../../core/auth/AuthContext';
import { useTenant } from '../../core/tenant/TenantEngine';
import { FinanceService } from '../../services/financeService';
import { 
  IncomeRecord, 
  ExpenseRecord, 
  IncomeCategory, 
  ExpenseCategory, 
  CashbookEntry, 
  DailyCashClosing, 
  BankAccount, 
  BankTransaction, 
  LedgerEntry, 
  FinancialSummary 
} from '../../types/finance';

import { FinancialDashboard } from './FinancialDashboard';
import { IncomeManagement } from './IncomeManagement';
import { ExpenseManagement } from './ExpenseManagement';
import { CashbookSystem } from './CashbookSystem';
import { BankManagement } from './BankManagement';
import { LedgerSystem } from './LedgerSystem';
import { FinancialReportSystem } from './FinancialReportSystem';

export const AccountingSystem: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { currentTenant } = useTenant();

  const tenantId = currentTenant?.id || 'org_bismillah_001';
  const tenantName = currentTenant?.name || 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ';
  const actorName = currentUser?.displayName || currentUser?.email || 'হিসাব রক্ষক';
  const isOrgAdmin = role === 'super_admin' || role === 'org_admin';

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'income' | 'expense' | 'cashbook' | 'bank' | 'ledger' | 'reports'
  >('dashboard');

  const [loading, setLoading] = useState(true);

  // States
  const [summary, setSummary] = useState<FinancialSummary>({
    todayIncome: 0,
    todayExpense: 0,
    currentCashBalance: 0,
    currentBankBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    totalNetProfit: 0,
    totalDueAmount: 18500,
    totalAdvanceAmount: 4200
  });

  const [incomes, setIncomes] = useState<IncomeRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<IncomeCategory[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [cashEntries, setCashEntries] = useState<CashbookEntry[]>([]);
  const [closings, setClosings] = useState<DailyCashClosing[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [bankTx, setBankTx] = useState<BankTransaction[]>([]);
  const [ledgers, setLedgers] = useState<LedgerEntry[]>([]);

  // Modals trigger
  const [isIncomeFormOpen, setIsIncomeFormOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        incList,
        expList,
        incCats,
        expCats,
        cbEntries,
        dayClosings,
        banks,
        bTx,
        ldgEntries,
        sumData
      ] = await Promise.all([
        FinanceService.getIncomeRecords(tenantId),
        FinanceService.getExpenseRecords(tenantId),
        FinanceService.getIncomeCategories(tenantId),
        FinanceService.getExpenseCategories(tenantId),
        FinanceService.getCashbookEntries(tenantId),
        FinanceService.getDailyClosings(tenantId),
        FinanceService.getBankAccounts(tenantId),
        FinanceService.getBankTransactions(tenantId),
        FinanceService.getLedgerEntries(tenantId),
        FinanceService.getFinancialSummary(tenantId)
      ]);

      setIncomes(incList);
      setExpenses(expList);
      setIncomeCategories(incCats);
      setExpenseCategories(expCats);
      setCashEntries(cbEntries);
      setClosings(dayClosings);
      setBankAccounts(banks);
      setBankTx(bTx);
      setLedgers(ldgEntries);
      setSummary(sumData);
    } catch (e) {
      console.error('Error loading accounting data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId]);

  // Income Handlers
  const handleSaveIncome = async (record: any) => {
    await FinanceService.saveIncomeRecord({
      ...record,
      tenantId,
      tenantName
    });
    await loadData();
  };

  const handleSoftDeleteIncome = async (id: string, reason: string) => {
    await FinanceService.softDeleteIncomeRecord(id, tenantId, actorName, reason);
    await loadData();
  };

  const handleSaveIncomeCat = async (name: string) => {
    await FinanceService.saveIncomeCategory({ tenantId, name });
    await loadData();
  };

  // Expense Handlers
  const handleSaveExpense = async (record: any) => {
    await FinanceService.saveExpenseRecord({
      ...record,
      tenantId,
      tenantName
    });
    await loadData();
  };

  const handleUpdateExpenseStatus = async (id: string, status: 'approved' | 'rejected', reason?: string) => {
    await FinanceService.updateExpenseStatus(id, status, actorName, reason);
    await loadData();
  };

  const handleSoftDeleteExpense = async (id: string, reason: string) => {
    await FinanceService.softDeleteExpenseRecord(id, tenantId, actorName, reason);
    await loadData();
  };

  const handleSaveExpenseCat = async (name: string, budgetLimit?: number) => {
    await FinanceService.saveExpenseCategory({ tenantId, name, budgetLimit });
    await loadData();
  };

  // Cashbook Handlers
  const handleAddCashEntry = async (entry: any) => {
    await FinanceService.recordCashbookEntry({
      ...entry,
      tenantId
    });
    await loadData();
  };

  const handleCloseDay = async (date: string, physicalCash?: number, note?: string) => {
    await FinanceService.performDailyCashClosing(tenantId, date, actorName, physicalCash, note);
    await loadData();
  };

  // Bank Handlers
  const handleSaveBankAccount = async (acc: any) => {
    await FinanceService.saveBankAccount({
      ...acc,
      tenantId
    });
    await loadData();
  };

  const handleBankDeposit = async (bankId: string, amount: number, ref: string, note: string) => {
    await FinanceService.updateBankAccountBalance(
      tenantId,
      bankId,
      amount,
      'deposit',
      ref,
      note || 'নগদ ক্যাশ থেকে ব্যাংক জমার ডিপোজিট',
      actorName
    );
    await loadData();
  };

  const handleBankWithdraw = async (bankId: string, amount: number, ref: string, note: string) => {
    await FinanceService.updateBankAccountBalance(
      tenantId,
      bankId,
      amount,
      'withdraw',
      ref,
      note || 'ব্যাংক অ্যাকাউন্ট থেকে ক্যাশ উত্তোলন',
      actorName
    );
    await loadData();
  };

  const handleBankTransfer = async (sourceBankId: string, targetBankId: string, amount: number, ref: string, note: string) => {
    await FinanceService.transferBankFunds(tenantId, sourceBankId, targetBankId, amount, ref, note, actorName);
    await loadData();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Main Navigation Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {tenantName}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                PROMPT-15 Financial Core
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enterprise Accounting, Cashbook, Multi-Bank & General Ledger System
            </p>
          </div>
        </div>

        {/* Main Tab Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
            { id: 'income', label: 'আয় ব্যবস্থাপনা', icon: TrendingUp },
            { id: 'expense', label: 'ব্যয় ব্যবস্থাপনা', icon: TrendingDown },
            { id: 'cashbook', label: 'ক্যাশবুক ও ডে ক্লোজিং', icon: Wallet },
            { id: 'bank', label: 'ব্যাংক অ্যাকাউন্টস', icon: Landmark },
            { id: 'ledger', label: 'খতিয়ান & লেজার', icon: PiggyBank },
            { id: 'reports', label: 'আর্থিক রিপোর্ট & P&L', icon: PieChart }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Content Area */}
      {activeTab === 'dashboard' && (
        <FinancialDashboard
          summary={summary}
          recentIncomes={incomes}
          recentExpenses={expenses}
          onOpenIncomeForm={() => setIsIncomeFormOpen(true)}
          onOpenExpenseForm={() => setIsExpenseFormOpen(true)}
          onOpenCashClosing={() => setActiveTab('cashbook')}
          onOpenBankTransfer={() => setActiveTab('bank')}
          onTabSelect={(t) => setActiveTab(t as any)}
          isLoading={loading}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'income' && (
        <IncomeManagement
          incomes={incomes}
          categories={incomeCategories}
          bankAccounts={bankAccounts}
          onSaveIncome={handleSaveIncome}
          onSoftDeleteIncome={handleSoftDeleteIncome}
          onSaveCategory={handleSaveIncomeCat}
          isFormOpen={isIncomeFormOpen}
          onCloseForm={() => setIsIncomeFormOpen(false)}
          onOpenForm={() => setIsIncomeFormOpen(true)}
          actorName={actorName}
        />
      )}

      {activeTab === 'expense' && (
        <ExpenseManagement
          expenses={expenses}
          categories={expenseCategories}
          bankAccounts={bankAccounts}
          onSaveExpense={handleSaveExpense}
          onUpdateStatus={handleUpdateExpenseStatus}
          onSoftDeleteExpense={handleSoftDeleteExpense}
          onSaveCategory={handleSaveExpenseCat}
          isFormOpen={isExpenseFormOpen}
          onCloseForm={() => setIsExpenseFormOpen(false)}
          onOpenForm={() => setIsExpenseFormOpen(true)}
          actorName={actorName}
          isOrgAdmin={isOrgAdmin}
        />
      )}

      {activeTab === 'cashbook' && (
        <CashbookSystem
          entries={cashEntries}
          closings={closings}
          onAddEntry={handleAddCashEntry}
          onCloseDay={handleCloseDay}
          currentCashBalance={summary.currentCashBalance}
          actorName={actorName}
        />
      )}

      {activeTab === 'bank' && (
        <BankManagement
          accounts={bankAccounts}
          transactions={bankTx}
          onSaveAccount={handleSaveBankAccount}
          onDeposit={handleBankDeposit}
          onWithdraw={handleBankWithdraw}
          onTransfer={handleBankTransfer}
          actorName={actorName}
        />
      )}

      {activeTab === 'ledger' && (
        <LedgerSystem
          ledgers={ledgers}
          tenantName={tenantName}
        />
      )}

      {activeTab === 'reports' && (
        <FinancialReportSystem
          summary={summary}
          incomes={incomes}
          expenses={expenses}
          cashEntries={cashEntries}
          bankAccounts={bankAccounts}
          tenantName={tenantName}
        />
      )}

    </div>
  );
};
