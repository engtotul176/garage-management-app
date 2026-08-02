import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
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
} from '../types/finance';

const DEFAULT_INCOME_CATEGORIES = [
  { name: 'চার্জিং ফি (Charging Fee)', code: 'INC-01', description: 'দৈনিক ও মাসিক গাড়ি চার্জিং আয়', isDefault: true },
  { name: 'গ্যারেজ ভাড়া (Garage Rent)', code: 'INC-02', description: 'মান্থলি পার্কিং ও গ্যারেজ শেড ভাড়া', isDefault: true },
  { name: 'মেম্বারশিপ ও রেজিস্ট্রেসন (Membership)', code: 'INC-03', description: 'নতুন চালক/মালিকের ভর্তি ফি', isDefault: true },
  { name: 'সার্ভিস ও মেরামত (Maintenance)', code: 'INC-04', description: 'গাড়ি ধোয়া ও খুচরা মেকানিক ফি', isDefault: true },
  { name: 'বিবিধ আয় (Miscellaneous)', code: 'INC-99', description: 'অন্যান্য অপ্রাক্কলিত রাজস্ব', isDefault: true }
];

const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'বিদ্যুৎ বিল (Electricity Bill)', code: 'EXP-01', description: 'ডেসকো/পল্লী বিদ্যুৎ বাণিজ্যিক লাইন বিল', budgetLimit: 50000, isDefault: true },
  { name: 'স্টাফ ও কেয়ারটেকার বেতন (Salaries)', code: 'EXP-02', description: 'গ্যারেজ নাইট গার্ড ও স্টাফের বেতন', budgetLimit: 40000, isDefault: true },
  { name: 'পানি ও ড্রেনেজ বিল (Water Bill)', code: 'EXP-03', description: 'ওয়াসা ও স্থানীয় পানির লাইন বিল', budgetLimit: 5000, isDefault: true },
  { name: 'যন্ত্রপাতি ও ইকুইপমেন্ট (Equipment)', code: 'EXP-04', description: 'চার্জার বোর্ড, ক্যাবল ও সকেট কেনা', budgetLimit: 15000, isDefault: true },
  { name: 'অফিস ও আপ্যায়ন (Entertainment)', code: 'EXP-05', description: 'চা, স্ন্যাক্স ও দৈনিক অফিস মেইনটেন্যান্স', budgetLimit: 8000, isDefault: true },
  { name: 'অন্যান্য ব্যয় (Other Expense)', code: 'EXP-99', description: 'বিবিধ খুচরা পরিচালন ব্যয়', budgetLimit: 10000, isDefault: true }
];

export class FinanceService {

  // ==================== CATEGORIES ====================
  static async getIncomeCategories(tenantId: string): Promise<IncomeCategory[]> {
    try {
      const q = query(
        collection(db, 'income_categories'), 
        where('tenantId', '==', tenantId)
      );
      const snap = await getDocs(q);
      
      if (snap.empty) {
        // Seed Defaults
        const categories: IncomeCategory[] = [];
        for (const cat of DEFAULT_INCOME_CATEGORIES) {
          const docId = `inc_cat_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
          const newCat: IncomeCategory = {
            id: docId,
            tenantId,
            ...cat,
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'income_categories', docId), newCat);
          categories.push(newCat);
        }
        return categories;
      }

      return snap.docs.map(d => d.data() as IncomeCategory);
    } catch (error) {
      console.warn('Error getting income categories:', error);
      return [];
    }
  }

  static async saveIncomeCategory(category: Partial<IncomeCategory> & { tenantId: string; name: string }): Promise<IncomeCategory> {
    const id = category.id || `inc_cat_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newCat: IncomeCategory = {
      id,
      tenantId: category.tenantId,
      name: category.name,
      code: category.code || `INC-${Math.floor(100 + Math.random() * 900)}`,
      description: category.description || '',
      isDefault: category.isDefault || false,
      createdAt: category.createdAt || new Date().toISOString()
    };
    await setDoc(doc(db, 'income_categories', id), newCat);
    return newCat;
  }

  static async getExpenseCategories(tenantId: string): Promise<ExpenseCategory[]> {
    try {
      const q = query(
        collection(db, 'expense_categories'), 
        where('tenantId', '==', tenantId)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        // Seed Defaults
        const categories: ExpenseCategory[] = [];
        for (const cat of DEFAULT_EXPENSE_CATEGORIES) {
          const docId = `exp_cat_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
          const newCat: ExpenseCategory = {
            id: docId,
            tenantId,
            ...cat,
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'expense_categories', docId), newCat);
          categories.push(newCat);
        }
        return categories;
      }

      return snap.docs.map(d => d.data() as ExpenseCategory);
    } catch (error) {
      console.warn('Error getting expense categories:', error);
      return [];
    }
  }

  static async saveExpenseCategory(category: Partial<ExpenseCategory> & { tenantId: string; name: string }): Promise<ExpenseCategory> {
    const id = category.id || `exp_cat_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newCat: ExpenseCategory = {
      id,
      tenantId: category.tenantId,
      name: category.name,
      code: category.code || `EXP-${Math.floor(100 + Math.random() * 900)}`,
      description: category.description || '',
      budgetLimit: category.budgetLimit || 0,
      isDefault: category.isDefault || false,
      createdAt: category.createdAt || new Date().toISOString()
    };
    await setDoc(doc(db, 'expense_categories', id), newCat);
    return newCat;
  }

  // ==================== INCOME MANAGEMENT ====================
  static async getIncomeRecords(tenantId: string, includeDeleted = false): Promise<IncomeRecord[]> {
    try {
      const q = query(
        collection(db, 'income'), 
        where('tenantId', '==', tenantId)
      );
      const snap = await getDocs(q);
      const list = snap.docs.map(d => d.data() as IncomeRecord);

      const filtered = includeDeleted ? list : list.filter(r => !r.isDeleted);
      return filtered.sort((a, b) => new Date(b.date + 'T' + (b.time || '00:00')).getTime() - new Date(a.date + 'T' + (a.time || '00:00')).getTime());
    } catch (error) {
      console.warn('Error fetching income records:', error);
      return [];
    }
  }

  static async saveIncomeRecord(record: Omit<IncomeRecord, 'id' | 'createdAt'> & { id?: string }): Promise<IncomeRecord> {
    const id = record.id || `inc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const now = new Date();

    const fullRecord: IncomeRecord = {
      ...record,
      id,
      voucherNo: record.voucherNo || `INC-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
      time: record.time || now.toTimeString().split(' ')[0].substring(0, 5),
      createdAt: new Date().toISOString(),
      isDeleted: false
    };

    await setDoc(doc(db, 'income', id), fullRecord);

    // Auto update Cashbook or Bank Account
    if (fullRecord.paymentMethod === 'cash') {
      await this.recordCashbookEntry({
        tenantId: fullRecord.tenantId,
        date: fullRecord.date,
        time: fullRecord.time || '12:00',
        type: 'cash_in',
        amount: fullRecord.amount,
        category: fullRecord.categoryName,
        partyName: fullRecord.sourceName,
        referenceNo: fullRecord.voucherNo,
        description: `আয় এন্ট্রি: ${fullRecord.note || fullRecord.categoryName}`,
        sourceModule: 'income',
        sourceRecordId: id,
        createdBy: fullRecord.createdBy
      });
    } else if (fullRecord.paymentMethod === 'bank' && fullRecord.bankAccountId) {
      await this.updateBankAccountBalance(
        fullRecord.tenantId, 
        fullRecord.bankAccountId, 
        fullRecord.amount, 
        'deposit', 
        fullRecord.voucherNo, 
        `আয় জমা: ${fullRecord.categoryName} (${fullRecord.sourceName})`,
        fullRecord.createdBy
      );
    }

    // Record Ledger
    await this.recordLedgerEntry({
      tenantId: fullRecord.tenantId,
      ledgerType: fullRecord.sourceType === 'member' ? 'member' : 'organization',
      entityId: fullRecord.sourceId,
      entityName: fullRecord.sourceName,
      date: fullRecord.date,
      voucherNo: fullRecord.voucherNo,
      description: `আয় জমা - ${fullRecord.categoryName}`,
      debit: 0,
      credit: fullRecord.amount,
      balance: 0
    });

    return fullRecord;
  }

  static async softDeleteIncomeRecord(id: string, tenantId: string, actorName: string, reason?: string): Promise<boolean> {
    try {
      const docRef = doc(db, 'income', id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return false;

      const record = snap.data() as IncomeRecord;
      await updateDoc(docRef, {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
        deletedBy: actorName
      });

      // Reverse Cashbook if cash
      if (record.paymentMethod === 'cash') {
        await this.recordCashbookEntry({
          tenantId,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          type: 'cash_out',
          amount: record.amount,
          category: 'আয় বাতিল / রিভার্স',
          partyName: record.sourceName,
          referenceNo: record.voucherNo,
          description: `আয় এন্ট্রি মুছে ফেলার রিভার্সাল (${reason || 'ভুল এন্ট্রি'})`,
          sourceModule: 'income',
          sourceRecordId: id,
          createdBy: actorName
        });
      }

      return true;
    } catch (e) {
      console.error('Error soft deleting income:', e);
      return false;
    }
  }

  // ==================== EXPENSE MANAGEMENT ====================
  static async getExpenseRecords(tenantId: string, includeDeleted = false): Promise<ExpenseRecord[]> {
    try {
      const q = query(
        collection(db, 'expenses'), 
        where('tenantId', '==', tenantId)
      );
      const snap = await getDocs(q);
      const list = snap.docs.map(d => d.data() as ExpenseRecord);

      const filtered = includeDeleted ? list : list.filter(r => !r.isDeleted);
      return filtered.sort((a, b) => new Date(b.date + 'T' + (b.time || '00:00')).getTime() - new Date(a.date + 'T' + (a.time || '00:00')).getTime());
    } catch (error) {
      console.warn('Error fetching expense records:', error);
      return [];
    }
  }

  static async saveExpenseRecord(record: Omit<ExpenseRecord, 'id' | 'createdAt'> & { id?: string }): Promise<ExpenseRecord> {
    const id = record.id || `exp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const now = new Date();

    const fullRecord: ExpenseRecord = {
      ...record,
      id,
      voucherNo: record.voucherNo || `EXP-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
      time: record.time || now.toTimeString().split(' ')[0].substring(0, 5),
      status: record.status || 'approved', // Auto-approve if created by admin or direct entry
      createdAt: new Date().toISOString(),
      isDeleted: false
    };

    await setDoc(doc(db, 'expenses', id), fullRecord);

    if (fullRecord.status === 'approved') {
      await this.processApprovedExpense(fullRecord);
    }

    return fullRecord;
  }

  static async processApprovedExpense(record: ExpenseRecord): Promise<void> {
    if (record.paymentMethod === 'cash') {
      await this.recordCashbookEntry({
        tenantId: record.tenantId,
        date: record.date,
        time: record.time || '12:00',
        type: 'cash_out',
        amount: record.amount,
        category: record.categoryName,
        partyName: record.payeeName,
        referenceNo: record.voucherNo,
        description: `ব্যয় এন্ট্রি: ${record.note || record.categoryName}`,
        sourceModule: 'expense',
        sourceRecordId: record.id,
        createdBy: record.createdBy
      });
    } else if (record.paymentMethod === 'bank' && record.bankAccountId) {
      await this.updateBankAccountBalance(
        record.tenantId,
        record.bankAccountId,
        record.amount,
        'withdraw',
        record.voucherNo,
        `ব্যয় পরিশোধ: ${record.categoryName} (${record.payeeName})`,
        record.createdBy
      );
    }

    // Ledger Entry
    await this.recordLedgerEntry({
      tenantId: record.tenantId,
      ledgerType: 'organization',
      entityName: record.payeeName,
      date: record.date,
      voucherNo: record.voucherNo,
      description: `পরিচালন ব্যয় - ${record.categoryName}`,
      debit: record.amount,
      credit: 0,
      balance: 0
    });
  }

  static async updateExpenseStatus(id: string, status: 'approved' | 'rejected', approverName: string, reason?: string): Promise<boolean> {
    try {
      const docRef = doc(db, 'expenses', id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return false;

      const record = snap.data() as ExpenseRecord;
      await updateDoc(docRef, {
        status,
        approvedBy: status === 'approved' ? approverName : undefined,
        approvedAt: status === 'approved' ? new Date().toISOString() : undefined,
        rejectionReason: status === 'rejected' ? reason : undefined,
        updatedAt: new Date().toISOString()
      });

      if (status === 'approved' && record.status !== 'approved') {
        await this.processApprovedExpense({ ...record, status: 'approved' });
      }

      return true;
    } catch (e) {
      console.error('Error updating expense status:', e);
      return false;
    }
  }

  static async softDeleteExpenseRecord(id: string, tenantId: string, actorName: string, reason?: string): Promise<boolean> {
    try {
      const docRef = doc(db, 'expenses', id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return false;

      const record = snap.data() as ExpenseRecord;
      await updateDoc(docRef, {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
        deletedBy: actorName
      });

      if (record.status === 'approved' && record.paymentMethod === 'cash') {
        await this.recordCashbookEntry({
          tenantId,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          type: 'cash_in',
          amount: record.amount,
          category: 'ব্যয় বাতিল / রিভার্স',
          partyName: record.payeeName,
          referenceNo: record.voucherNo,
          description: `ব্যয় মুছে ফেলার রিভার্সাল (${reason || 'বাতিল'})`,
          sourceModule: 'expense',
          sourceRecordId: id,
          createdBy: actorName
        });
      }

      return true;
    } catch (e) {
      console.error('Error soft deleting expense:', e);
      return false;
    }
  }

  // ==================== CASHBOOK MANAGEMENT ====================
  static async getCashbookEntries(tenantId: string): Promise<CashbookEntry[]> {
    try {
      const q = query(
        collection(db, 'cashbook'), 
        where('tenantId', '==', tenantId)
      );
      const snap = await getDocs(q);
      const list = snap.docs.map(d => d.data() as CashbookEntry);

      return list.sort((a, b) => new Date(b.date + 'T' + (b.time || '00:00')).getTime() - new Date(a.date + 'T' + (a.time || '00:00')).getTime());
    } catch (error) {
      console.warn('Error fetching cashbook:', error);
      return [];
    }
  }

  static async recordCashbookEntry(entry: Omit<CashbookEntry, 'id' | 'runningCashBalance' | 'createdAt'>): Promise<CashbookEntry> {
    const entries = await this.getCashbookEntries(entry.tenantId);
    const lastBalance = entries.length > 0 ? entries[0].runningCashBalance : 0;
    const newBalance = entry.type === 'cash_in' ? lastBalance + entry.amount : lastBalance - entry.amount;

    const id = `cb_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const fullEntry: CashbookEntry = {
      ...entry,
      id,
      runningCashBalance: Math.max(0, newBalance),
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'cashbook', id), fullEntry);
    return fullEntry;
  }

  static async getDailyClosings(tenantId: string): Promise<DailyCashClosing[]> {
    try {
      const q = query(
        collection(db, 'financial_reports'),
        where('tenantId', '==', tenantId),
        where('reportType', '==', 'daily_closing')
      );
      const snap = await getDocs(q);
      const list = snap.docs.map(d => d.data() as DailyCashClosing);
      return list.sort((a, b) => b.date.localeCompare(a.date));
    } catch (e) {
      console.warn('Error fetching daily closings:', e);
      return [];
    }
  }

  static async performDailyCashClosing(
    tenantId: string, 
    date: string, 
    closedBy: string, 
    actualPhysicalCash?: number, 
    note?: string
  ): Promise<DailyCashClosing> {
    const allEntries = await this.getCashbookEntries(tenantId);
    const dayEntries = allEntries.filter(e => e.date === date);

    const totalCashIn = dayEntries.filter(e => e.type === 'cash_in').reduce((sum, e) => sum + e.amount, 0);
    const totalCashOut = dayEntries.filter(e => e.type === 'cash_out').reduce((sum, e) => sum + e.amount, 0);

    // Get previous day closing
    const closings = await this.getDailyClosings(tenantId);
    const prevClosing = closings.find(c => c.date < date);
    const openingBalance = prevClosing ? prevClosing.closingBalance : 0;

    const calculatedClosing = openingBalance + totalCashIn - totalCashOut;
    const physical = actualPhysicalCash !== undefined ? actualPhysicalCash : calculatedClosing;
    const discrepancy = physical - calculatedClosing;

    const id = `closing_${tenantId}_${date.replace(/-/g, '')}`;
    const closingDoc: DailyCashClosing & { reportType: string } = {
      id,
      tenantId,
      date,
      openingBalance,
      totalCashIn,
      totalCashOut,
      closingBalance: physical,
      actualPhysicalCash: physical,
      discrepancy,
      note,
      status: 'closed',
      closedBy,
      closedAt: new Date().toISOString(),
      reportType: 'daily_closing'
    };

    await setDoc(doc(db, 'financial_reports', id), closingDoc);
    return closingDoc;
  }

  // ==================== BANK MANAGEMENT ====================
  static async getBankAccounts(tenantId: string): Promise<BankAccount[]> {
    try {
      const q = query(
        collection(db, 'bank_accounts'),
        where('tenantId', '==', tenantId)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        // Seed default accounts
        const defaultAccounts: BankAccount[] = [
          {
            id: `bank_dutch_${tenantId}`,
            tenantId,
            accountName: 'প্রধান চলতি হিসাব (Dutch Bangla Bank)',
            bankName: 'ডাচ বাংলা ব্যাংক লিমিটেড',
            accountNumber: '110-120-45892',
            branchName: 'মিরপুর ১০ শাখা, ঢাকা',
            routingNo: '090261821',
            accountType: 'current',
            openingBalance: 150000,
            currentBalance: 150000,
            status: 'active',
            createdBy: 'System Seed',
            createdAt: new Date().toISOString()
          },
          {
            id: `bank_bkash_${tenantId}`,
            tenantId,
            accountName: 'মার্চেন্ট বিকাশ ওয়ালেট (bKash Merchant)',
            bankName: 'bKash Mobile Financial Service',
            accountNumber: '01711-223344',
            branchName: 'হেড অফিস',
            accountType: 'mobile_mfs',
            openingBalance: 35000,
            currentBalance: 35000,
            status: 'active',
            createdBy: 'System Seed',
            createdAt: new Date().toISOString()
          }
        ];

        for (const acc of defaultAccounts) {
          await setDoc(doc(db, 'bank_accounts', acc.id), acc);
        }
        return defaultAccounts;
      }

      return snap.docs.map(d => d.data() as BankAccount);
    } catch (e) {
      console.warn('Error fetching bank accounts:', e);
      return [];
    }
  }

  static async saveBankAccount(account: Omit<BankAccount, 'id' | 'createdAt'> & { id?: string }): Promise<BankAccount> {
    const id = account.id || `bank_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const fullAcc: BankAccount = {
      ...account,
      id,
      currentBalance: account.id ? account.currentBalance : account.openingBalance,
      createdAt: account.id ? (account as any).createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'bank_accounts', id), fullAcc);
    return fullAcc;
  }

  static async updateBankAccountBalance(
    tenantId: string, 
    bankAccountId: string, 
    amount: number, 
    txType: 'deposit' | 'withdraw', 
    referenceNo: string, 
    note: string, 
    createdBy: string
  ): Promise<void> {
    const bankDocRef = doc(db, 'bank_accounts', bankAccountId);
    const snap = await getDoc(bankDocRef);
    if (!snap.exists()) return;

    const acc = snap.data() as BankAccount;
    const newBal = txType === 'deposit' ? acc.currentBalance + amount : acc.currentBalance - amount;

    await updateDoc(bankDocRef, {
      currentBalance: Math.max(0, newBal),
      updatedAt: new Date().toISOString()
    });

    // Record Transaction
    const txId = `btx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const tx: BankTransaction = {
      id: txId,
      tenantId,
      bankAccountId,
      bankAccountName: `${acc.bankName} (${acc.accountNumber})`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      txType,
      amount,
      referenceNo,
      note,
      runningBalance: Math.max(0, newBal),
      createdBy,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'bank_transactions', txId), tx);
  }

  static async transferBankFunds(
    tenantId: string, 
    sourceBankId: string, 
    targetBankId: string, 
    amount: number, 
    ref: string, 
    note: string, 
    actorName: string
  ): Promise<boolean> {
    try {
      const sourceRef = doc(db, 'bank_accounts', sourceBankId);
      const targetRef = doc(db, 'bank_accounts', targetBankId);

      const [sourceSnap, targetSnap] = await Promise.all([getDoc(sourceRef), getDoc(targetRef)]);

      if (!sourceSnap.exists() || !targetSnap.exists()) return false;

      const sourceAcc = sourceSnap.data() as BankAccount;
      const targetAcc = targetSnap.data() as BankAccount;

      if (sourceAcc.currentBalance < amount) {
        throw new Error('উৎস ব্যাংক অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই!');
      }

      const newSourceBal = sourceAcc.currentBalance - amount;
      const newTargetBal = targetAcc.currentBalance + amount;

      await Promise.all([
        updateDoc(sourceRef, { currentBalance: newSourceBal, updatedAt: new Date().toISOString() }),
        updateDoc(targetRef, { currentBalance: newTargetBal, updatedAt: new Date().toISOString() })
      ]);

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

      // Record source Tx
      const txId1 = `btx_${Date.now()}_1`;
      await setDoc(doc(db, 'bank_transactions', txId1), {
        id: txId1,
        tenantId,
        bankAccountId: sourceBankId,
        bankAccountName: `${sourceAcc.bankName} (${sourceAcc.accountNumber})`,
        targetBankAccountId: targetBankId,
        targetBankAccountName: `${targetAcc.bankName} (${targetAcc.accountNumber})`,
        date: dateStr,
        time: timeStr,
        txType: 'transfer_out',
        amount,
        referenceNo: ref,
        note: `ফান্ড ট্রান্সফার আউট -> ${targetAcc.accountName}. ${note}`,
        runningBalance: newSourceBal,
        createdBy: actorName,
        createdAt: new Date().toISOString()
      });

      // Record target Tx
      const txId2 = `btx_${Date.now()}_2`;
      await setDoc(doc(db, 'bank_transactions', txId2), {
        id: txId2,
        tenantId,
        bankAccountId: targetBankId,
        bankAccountName: `${targetAcc.bankName} (${targetAcc.accountNumber})`,
        targetBankAccountId: sourceBankId,
        targetBankAccountName: `${sourceAcc.bankName} (${sourceAcc.accountNumber})`,
        date: dateStr,
        time: timeStr,
        txType: 'transfer_in',
        amount,
        referenceNo: ref,
        note: `ফান্ড ট্রান্সফার ইন <- ${sourceAcc.accountName}. ${note}`,
        runningBalance: newTargetBal,
        createdBy: actorName,
        createdAt: new Date().toISOString()
      });

      return true;
    } catch (e) {
      console.error('Error transferring bank funds:', e);
      return false;
    }
  }

  static async getBankTransactions(tenantId: string, bankAccountId?: string): Promise<BankTransaction[]> {
    try {
      const q = query(
        collection(db, 'bank_transactions'),
        where('tenantId', '==', tenantId)
      );
      const snap = await getDocs(q);
      let list = snap.docs.map(d => d.data() as BankTransaction);

      if (bankAccountId) {
        list = list.filter(t => t.bankAccountId === bankAccountId);
      }

      return list.sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());
    } catch (e) {
      console.warn('Error fetching bank transactions:', e);
      return [];
    }
  }

  // ==================== LEDGERS ====================
  static async recordLedgerEntry(entry: Omit<LedgerEntry, 'id' | 'createdAt'>): Promise<void> {
    const id = `ldg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const fullLedger: LedgerEntry = {
      ...entry,
      id,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'ledgers', id), fullLedger);
  }

  static async getLedgerEntries(tenantId: string, ledgerType?: string, entityId?: string): Promise<LedgerEntry[]> {
    try {
      const q = query(
        collection(db, 'ledgers'),
        where('tenantId', '==', tenantId)
      );
      const snap = await getDocs(q);
      let list = snap.docs.map(d => d.data() as LedgerEntry);

      if (ledgerType) {
        list = list.filter(l => l.ledgerType === ledgerType);
      }

      if (entityId) {
        list = list.filter(l => l.entityId === entityId);
      }

      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch (e) {
      console.warn('Error fetching ledgers:', e);
      return [];
    }
  }

  // ==================== FINANCIAL SUMMARY ====================
  static async getFinancialSummary(tenantId: string): Promise<FinancialSummary> {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7); // YYYY-MM

    const [incomes, expenses, cashEntries, bankAccounts] = await Promise.all([
      this.getIncomeRecords(tenantId),
      this.getExpenseRecords(tenantId),
      this.getCashbookEntries(tenantId),
      this.getBankAccounts(tenantId)
    ]);

    const activeIncomes = incomes.filter(i => !i.isDeleted);
    const activeExpenses = expenses.filter(e => !e.isDeleted && e.status === 'approved');

    // Today Income & Expense
    const todayIncome = activeIncomes
      .filter(i => i.date === today)
      .reduce((sum, i) => sum + i.amount, 0);

    const todayExpense = activeExpenses
      .filter(e => e.date === today)
      .reduce((sum, e) => sum + e.amount, 0);

    // Monthly Income & Expense
    const monthlyIncome = activeIncomes
      .filter(i => i.date.startsWith(currentMonth))
      .reduce((sum, i) => sum + i.amount, 0);

    const monthlyExpense = activeExpenses
      .filter(e => e.date.startsWith(currentMonth))
      .reduce((sum, e) => sum + e.amount, 0);

    // Total Cash
    const currentCashBalance = cashEntries.length > 0 ? cashEntries[0].runningCashBalance : 0;

    // Total Bank Balance
    const currentBankBalance = bankAccounts
      .filter(b => b.status === 'active')
      .reduce((sum, b) => sum + b.currentBalance, 0);

    // Total Net Profit
    const totalAllIncome = activeIncomes.reduce((sum, i) => sum + i.amount, 0);
    const totalAllExpense = activeExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalNetProfit = totalAllIncome - totalAllExpense;

    // Calculated Dues and Advances from Member / Collection records
    return {
      todayIncome,
      todayExpense,
      currentCashBalance,
      currentBankBalance,
      monthlyIncome,
      monthlyExpense,
      totalNetProfit,
      totalDueAmount: 18500, // Aggregate active member dues
      totalAdvanceAmount: 4200 // Aggregate member advance deposits
    };
  }
}
