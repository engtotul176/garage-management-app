import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  ReceiptRecord, 
  ReceiptTemplateConfig, 
  InvoiceRecord, 
  PrintLogRecord 
} from '../types/receipt';

const RECEIPTS_PATH = 'receipts';
const TEMPLATES_PATH = 'receipt_templates';
const INVOICE_PATH = 'invoice_history';
const PRINT_LOGS_PATH = 'print_logs';

// Default Template Configuration
export const DEFAULT_TEMPLATE_CONFIG: ReceiptTemplateConfig = {
  id: 'template_default',
  tenantId: 'org_bismillah_001',
  orgName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ & পার্কিং সলিউশন',
  orgAddress: 'গাবতলী বাস টার্মিনাল সংলগ্ন, মিরপুর, ঢাকা-১২১৬',
  orgPhone: '০১৭১২-৩৪NT৭৮, ০১৮১১-৯৯৮৮৭৭',
  logoUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=150',
  headerText: 'ডিজিটাল অটো চার্জিং, পার্কিং ও সদস্য ক্যাশ জমার অফিশিয়াল রসিদ',
  footerNote: 'ধন্যবাদ! আপনার অবদানের জন্য ধন্যবাদ। গাড়ি নিরাপত্তা নিশ্চিত করা আমাদের দায়িত্ব।',
  termsAndConditions: '১. রসিদ ব্যতিরেকে কোনো টাকা প্রদান গ্রহণীয় নয়। ২. অটো ব্যাটারি চার্জিং এর ক্ষেত্রে দুর্ঘটনা এড়াতে কর্তৃপক্ষের নির্দেশনা মেনে চলুন।',
  showQrCode: true,
  showBarcode: true,
  showDigitalSignature: true,
  defaultPaperSize: '58mm',
  updatedAt: new Date().toISOString()
};

// Seed Mock Receipts for Instant Preview & Offline Resilience
const INITIAL_MOCK_RECEIPTS: ReceiptRecord[] = [
  {
    id: 'rcp_2026_1001',
    receiptNo: 'RCP-2026-07-1001',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    memberId: 'MEM-2026-001',
    memberName: 'আলহাজ্ব মোঃ সামসুল হক',
    memberPhone: '01712345678',
    membershipNumber: 'MS-1001',
    vehicleNo: 'ঢাকা মেট্রো-থ-১১-৪৫২৩',
    chargingSlot: 'চার্জিং স্লট-০৪',
    date: new Date().toISOString().split('T')[0],
    time: '10:30 AM',
    chargeType: 'দৈনিক গ্যারেজ চার্জ & নাইট সিকিউরিটি',
    collectorName: 'মোঃ জসিম (ক্যাশিয়ার)',
    paymentMethod: 'cash',
    amount: 300,
    due: 0,
    advance: 0,
    remarks: 'নিয়মিত দৈনিক জমার ক্যাশ রসিদ',
    qrCodeData: 'RCP-2026-07-1001|MEM-2026-001|300|PAID',
    barcode: 'RCP2026071001',
    isReprint: false,
    reprintCount: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'rcp_2026_1002',
    receiptNo: 'RCP-2026-07-1002',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    memberId: 'MEM-2026-002',
    memberName: 'মোঃ কামাল হোসেন',
    memberPhone: '01811998877',
    membershipNumber: 'MS-1002',
    vehicleNo: 'ঢাকা মেট্রো-হ-১২-৮৮৯০',
    chargingSlot: 'চার্জিং স্লট-০২',
    date: new Date().toISOString().split('T')[0],
    time: '11:15 AM',
    chargeType: 'দৈনিক গ্যারেজ চার্জ & নাইট পার্কিং',
    collectorName: 'রফিকুল ইসলাম (ম্যানেজার)',
    paymentMethod: 'bkash',
    amount: 300,
    due: 200,
    advance: 0,
    remarks: 'বিকাশে ৩০০ টাকা পরিশোধ, ২০০ টাকা বকেয়া',
    qrCodeData: 'RCP-2026-07-1002|MEM-2026-002|300|DUE200',
    barcode: 'RCP2026071002',
    isReprint: false,
    reprintCount: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'rcp_2026_1003',
    receiptNo: 'RCP-2026-07-1003',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    memberId: 'MEM-2026-003',
    memberName: 'মোসাম্মাৎ রহিমা আক্তার',
    memberPhone: '01911223366',
    membershipNumber: 'MS-1003',
    vehicleNo: 'ঢাকা মেট্রো-গ-১৪-৫০১০',
    chargingSlot: 'চার্জিং স্লট-০৮',
    date: new Date().toISOString().split('T')[0],
    time: '02:45 PM',
    chargeType: 'অটো ব্যাটারি চার্জিং চার্জ',
    collectorName: 'মোঃ জসিম (ক্যাশিয়ার)',
    paymentMethod: 'nagad',
    amount: 1200,
    due: 0,
    advance: 200,
    remarks: '২০০ টাকা এডভান্স জমা রাখা হয়েছে',
    qrCodeData: 'RCP-2026-07-1003|MEM-2026-003|1200|ADV200',
    barcode: 'RCP2026071003',
    isReprint: false,
    reprintCount: 0,
    createdAt: new Date().toISOString()
  }
];

export class ReceiptService {

  // 1. SUBSCRIBE TO RECEIPTS IN REALTIME
  static subscribeReceipts(
    tenantId: string = 'org_bismillah_001',
    onSuccess: (receipts: ReceiptRecord[]) => void,
    onError?: (err: Error) => void
  ): () => void {
    try {
      const colRef = collection(db, RECEIPTS_PATH);
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs
            .map(d => ({ id: d.id, ...d.data() } as ReceiptRecord))
            .filter(r => tenantId === 'all' || r.tenantId === tenantId)
            .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          if (docs.length > 0) {
            onSuccess(docs);
          } else {
            this.seedMockReceipts(tenantId).then(() => {
              onSuccess(INITIAL_MOCK_RECEIPTS);
            });
          }
        } else {
          this.seedMockReceipts(tenantId).then(() => {
            onSuccess(INITIAL_MOCK_RECEIPTS);
          });
        }
      }, (err) => {
        console.warn('Receipts snapshot listener fallback used:', err);
        if (onError) onError(err);
        onSuccess(INITIAL_MOCK_RECEIPTS);
      });
    } catch (e) {
      console.warn('Receipt subscription catch:', e);
      onSuccess(INITIAL_MOCK_RECEIPTS);
      return () => {};
    }
  }

  private static async seedMockReceipts(tenantId: string) {
    try {
      for (const r of INITIAL_MOCK_RECEIPTS) {
        await setDoc(doc(db, RECEIPTS_PATH, r.id), r, { merge: true });
      }
    } catch (e) {
      console.warn('Error seeding receipts:', e);
    }
  }

  // 2. CREATE OR UPDATE RECEIPT
  static async saveReceipt(receipt: ReceiptRecord): Promise<ReceiptRecord> {
    try {
      await setDoc(doc(db, RECEIPTS_PATH, receipt.id), receipt, { merge: true });
    } catch (e) {
      console.warn('Error saving receipt to Firestore:', e);
    }
    return receipt;
  }

  // 3. MARK RECEIPT AS REPRINT
  static async incrementReprintCount(receiptId: string): Promise<number> {
    let newCount = 1;
    try {
      const docRef = doc(db, RECEIPTS_PATH, receiptId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const current = snap.data() as ReceiptRecord;
        newCount = (current.reprintCount || 0) + 1;
        await updateDoc(docRef, {
          isReprint: true,
          reprintCount: newCount,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn('Increment reprint count warn:', e);
    }
    return newCount;
  }

  // 4. TEMPLATE CONFIGURATION
  static subscribeTemplateConfig(
    tenantId: string = 'org_bismillah_001',
    onSuccess: (config: ReceiptTemplateConfig) => void
  ): () => void {
    try {
      const docRef = doc(db, TEMPLATES_PATH, `tmpl_${tenantId}`);
      return onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          onSuccess({ id: snap.id, ...snap.data() } as ReceiptTemplateConfig);
        } else {
          onSuccess(DEFAULT_TEMPLATE_CONFIG);
        }
      }, (err) => {
        console.warn('Template listener fallback:', err);
        onSuccess(DEFAULT_TEMPLATE_CONFIG);
      });
    } catch (e) {
      onSuccess(DEFAULT_TEMPLATE_CONFIG);
      return () => {};
    }
  }

  static async saveTemplateConfig(config: ReceiptTemplateConfig): Promise<void> {
    try {
      const docRef = doc(db, TEMPLATES_PATH, `tmpl_${config.tenantId}`);
      await setDoc(docRef, {
        ...config,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Error saving template config:', e);
    }
  }

  // 5. INVOICE HISTORY
  static subscribeInvoices(
    tenantId: string = 'org_bismillah_001',
    onSuccess: (invoices: InvoiceRecord[]) => void
  ): () => void {
    try {
      const colRef = collection(db, INVOICE_PATH);
      return onSnapshot(colRef, (snapshot) => {
        const docs = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() } as InvoiceRecord))
          .filter(i => tenantId === 'all' || i.tenantId === tenantId)
          .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onSuccess(docs);
      }, (err) => {
        console.warn('Invoices snapshot fallback:', err);
        onSuccess([]);
      });
    } catch (e) {
      onSuccess([]);
      return () => {};
    }
  }

  static async createInvoice(invoice: InvoiceRecord): Promise<InvoiceRecord> {
    try {
      await setDoc(doc(db, INVOICE_PATH, invoice.id), invoice, { merge: true });
    } catch (e) {
      console.warn('Error saving invoice:', e);
    }
    return invoice;
  }

  // 6. PRINT AUDIT LOGS
  static async logPrintAction(log: Omit<PrintLogRecord, 'id' | 'timestamp'>): Promise<void> {
    const logId = `log_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const fullLog: PrintLogRecord = {
      ...log,
      id: logId,
      timestamp: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, PRINT_LOGS_PATH, logId), fullLog, { merge: true });
    } catch (e) {
      console.warn('Error saving print log:', e);
    }
  }

  static subscribePrintLogs(
    tenantId: string = 'org_bismillah_001',
    onSuccess: (logs: PrintLogRecord[]) => void
  ): () => void {
    try {
      const colRef = collection(db, PRINT_LOGS_PATH);
      return onSnapshot(colRef, (snapshot) => {
        const docs = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() } as PrintLogRecord))
          .filter(l => tenantId === 'all' || l.tenantId === tenantId)
          .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        onSuccess(docs);
      }, (err) => {
        console.warn('Print logs fallback:', err);
        onSuccess([]);
      });
    } catch (e) {
      onSuccess([]);
      return () => {};
    }
  }
}
