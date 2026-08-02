import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  PaymentGatewayType, 
  BillingCycle, 
  PaymentStatus, 
  PaymentGatewayConfig, 
  SubscriptionInvoice, 
  TransactionRecord, 
  BillingOverviewStats 
} from '../types/billing';

export class BillingService {

  /**
   * Fetch configured Payment Gateways from Firestore `payment_methods`
   */
  static async fetchGatewayConfigs(): Promise<PaymentGatewayConfig[]> {
    try {
      const snap = await getDocs(collection(db, 'payment_methods'));
      const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, any>) })) as PaymentGatewayConfig[];
      if (items.length === 0) {
        return this.getFallbackGatewayConfigs();
      }
      return items;
    } catch (e) {
      console.warn('Error fetching gateway configs, using fallback:', e);
      return this.getFallbackGatewayConfigs();
    }
  }

  /**
   * Save or Update Gateway Settings
   */
  static async saveGatewayConfig(config: PaymentGatewayConfig): Promise<void> {
    try {
      await setDoc(doc(db, 'payment_methods', config.id), config, { merge: true });
    } catch (e) {
      console.error('Error saving gateway config:', e);
    }
  }

  /**
   * Fetch Invoices from Firestore `invoices`
   */
  static async fetchInvoices(tenantId: string = 'ALL'): Promise<SubscriptionInvoice[]> {
    try {
      const colRef = collection(db, 'invoices');
      const q = tenantId && tenantId !== 'ALL'
        ? query(colRef, where('tenantId', '==', tenantId), orderBy('paidAt', 'desc'))
        : query(colRef, orderBy('paidAt', 'desc'));

      const snap = await getDocs(q as any);
      const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, any>) })) as SubscriptionInvoice[];
      if (items.length === 0) {
        return this.getFallbackInvoices();
      }
      return items;
    } catch (e) {
      return this.getFallbackInvoices();
    }
  }

  /**
   * Fetch Transaction History from Firestore `transactions`
   */
  static async fetchTransactions(tenantId: string = 'ALL'): Promise<TransactionRecord[]> {
    try {
      const colRef = collection(db, 'transactions');
      const snap = await getDocs(colRef);
      const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, any>) })) as TransactionRecord[];
      if (items.length === 0) {
        return this.getFallbackTransactions();
      }
      return items;
    } catch (e) {
      return this.getFallbackTransactions();
    }
  }

  /**
   * Create New Payment & Auto Subscription Renewal
   */
  static async processPayment(params: {
    tenantId: string;
    tenantName: string;
    planName: string;
    billingCycle: BillingCycle;
    amount: number;
    gatewayType: PaymentGatewayType;
    transactionId: string;
    senderMobileOrAccount?: string;
    paidBy: string;
  }): Promise<SubscriptionInvoice> {
    const timestamp = Date.now();
    const invoiceId = `inv_${timestamp}`;
    const invoiceNumber = `INV-ABABIL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Calculate Subscription Period
    const startDate = new Date();
    const endDate = new Date(startDate);

    switch (params.billingCycle) {
      case 'TRIAL':
        endDate.setDate(endDate.getDate() + 14);
        break;
      case 'MONTHLY':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'QUARTERLY':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'HALF_YEARLY':
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case 'YEARLY':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      case 'LIFETIME':
        endDate.setFullYear(endDate.getFullYear() + 99);
        break;
    }

    const isAutoApproved = ['BKASH', 'NAGAD', 'ROCKET', 'SSLCOMMERZ', 'STRIPE', 'PAYPAL'].includes(params.gatewayType);
    const status: PaymentStatus = isAutoApproved ? 'PAID' : 'PENDING_VERIFICATION';

    const invoice: SubscriptionInvoice = {
      id: invoiceId,
      invoiceNumber,
      tenantId: params.tenantId,
      tenantName: params.tenantName,
      planName: params.planName,
      billingCycle: params.billingCycle,
      amount: params.amount,
      taxAmount: Math.round(params.amount * 0.05), // 5% Govt VAT
      discountAmount: 0,
      netAmount: params.amount + Math.round(params.amount * 0.05),
      currency: 'BDT',
      status,
      gatewayType: params.gatewayType,
      transactionId: params.transactionId,
      senderMobileOrAccount: params.senderMobileOrAccount,
      paidAt: startDate.toISOString(),
      periodStart: startDate.toISOString(),
      periodEnd: endDate.toISOString(),
      paidBy: params.paidBy,
      verifiedBy: isAutoApproved ? 'SYSTEM_AUTO_GATEWAY_WEBHOOK' : undefined,
      verifiedAt: isAutoApproved ? startDate.toISOString() : undefined,
      notes: `${params.planName} (${params.billingCycle}) সাবস্ক্রিপশন ফি পরিশোধিত`
    };

    const transaction: TransactionRecord = {
      id: `trx_${timestamp}`,
      invoiceId,
      invoiceNumber,
      tenantId: params.tenantId,
      tenantName: params.tenantName,
      gatewayType: params.gatewayType,
      transactionId: params.transactionId,
      amount: invoice.netAmount,
      status,
      paymentDate: startDate.toISOString(),
      paidBy: params.paidBy,
      remarks: `${params.gatewayType} পেমেন্ট সম্পন্ন`
    };

    try {
      // 1. Save Invoice
      await setDoc(doc(db, 'invoices', invoiceId), invoice);

      // 2. Save Transaction
      await setDoc(doc(db, 'transactions', transaction.id), transaction);

      // 3. Update Organization Billing Document
      await setDoc(doc(db, 'billing', params.tenantId), {
        tenantId: params.tenantId,
        tenantName: params.tenantName,
        currentPlan: params.planName,
        billingCycle: params.billingCycle,
        status: 'ACTIVE',
        subscriptionStart: startDate.toISOString(),
        subscriptionEnd: endDate.toISOString(),
        lastPaymentInvoiceNumber: invoiceNumber,
        lastPaymentAmount: invoice.netAmount,
        lastPaymentDate: startDate.toISOString(),
        updatedAt: startDate.toISOString()
      }, { merge: true });

    } catch (e) {
      console.error('Error saving payment to Firestore:', e);
    }

    return invoice;
  }

  /**
   * Manual Payment Verification / Approval / Reject / Refund
   */
  static async updatePaymentStatus(
    invoiceId: string, 
    newStatus: PaymentStatus, 
    verifiedBy: string
  ): Promise<void> {
    try {
      const now = new Date().toISOString();
      await updateDoc(doc(db, 'invoices', invoiceId), {
        status: newStatus,
        verifiedBy,
        verifiedAt: now
      });
    } catch (e) {
      console.error('Error updating payment status:', e);
    }
  }

  /**
   * Fallback Gateway Configurations
   */
  private static getFallbackGatewayConfigs(): PaymentGatewayConfig[] {
    return [
      {
        id: 'gw_bkash',
        gatewayType: 'BKASH',
        name: 'bKash Merchant Direct Payment',
        isEnabled: true,
        isSandbox: false,
        merchantId: '01711223344',
        accountNumber: '01711223344 (Merchant)',
        supportedCurrencies: ['BDT'],
        instructionsBn: 'bKash *247# ডায়াল করে অথবা App থেকে Make Payment সিলেক্ট করে মার্চেন্ট নম্বরে পে করুন।'
      },
      {
        id: 'gw_nagad',
        gatewayType: 'NAGAD',
        name: 'Nagad Merchant Express',
        isEnabled: true,
        isSandbox: false,
        merchantId: '01899887766',
        accountNumber: '01899887766 (Merchant)',
        supportedCurrencies: ['BDT'],
        instructionsBn: 'নগদ অ্যাপ থেকে "মার্চেন্ট পে" অপশন সিলেক্ট করে পেমেন্ট সম্পাদন করুন।'
      },
      {
        id: 'gw_rocket',
        gatewayType: 'ROCKET',
        name: 'Dutch-Bangla Rocket Gateway',
        isEnabled: true,
        isSandbox: false,
        merchantId: '01900112233',
        accountNumber: '01900112233-9',
        supportedCurrencies: ['BDT'],
        instructionsBn: 'রকেট মার্চেন্ট কোডে সরাসরি পেমেন্ট প্রেরণ করুন।'
      },
      {
        id: 'gw_sslcommerz',
        gatewayType: 'SSLCOMMERZ',
        name: 'SSLCommerz Payment Gateway (Cards/Banking)',
        isEnabled: true,
        isSandbox: false,
        merchantId: 'ababilcloudlive',
        supportedCurrencies: ['BDT', 'USD'],
        instructionsBn: 'সকল ব্যাংক ভিসা, মাস্টারকার্ড, এমেক্স এবং মোবাইল ব্যাংকিং সাপোর্ট।'
      },
      {
        id: 'gw_bank',
        gatewayType: 'BANK_TRANSFER',
        name: 'Brac Bank Enterprise Transfer',
        isEnabled: true,
        isSandbox: false,
        bankName: 'BRAC Bank PLC',
        branchName: 'Gulshan Corporate Branch',
        accountNumber: '1501204899120001',
        supportedCurrencies: ['BDT'],
        instructionsBn: 'ব্যাংক একাউন্টে টাকা ট্রান্সফার করে জমার রসিদ বা Trx ID সাবমিট করুন।'
      },
      {
        id: 'gw_stripe',
        gatewayType: 'STRIPE',
        name: 'Stripe Global Card Gateway (International)',
        isEnabled: false,
        isSandbox: true,
        merchantId: 'acct_1N000000000000',
        supportedCurrencies: ['USD', 'EUR', 'GBP'],
        instructionsBn: 'আন্তর্জাতিক ক্রেডিট ও ডেবিট কার্ডের জন্য প্রস্তুত।'
      }
    ];
  }

  private static getFallbackInvoices(): SubscriptionInvoice[] {
    return [
      {
        id: 'inv_2001',
        invoiceNumber: 'INV-ABABIL-2026-8812',
        tenantId: 'org_bismillah_001',
        tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
        planName: 'Enterprise PRO Suite',
        billingCycle: 'YEARLY',
        amount: 15000,
        taxAmount: 750,
        discountAmount: 1000,
        netAmount: 14750,
        currency: 'BDT',
        status: 'PAID',
        gatewayType: 'BKASH',
        transactionId: 'BK9X82M10A',
        senderMobileOrAccount: '01711223344',
        paidAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        periodStart: new Date(Date.now() - 86400000 * 10).toISOString(),
        periodEnd: new Date(Date.now() + 86400000 * 355).toISOString(),
        paidBy: 'আরিফুল ইসলাম (এডমিন)',
        verifiedBy: 'SYSTEM_AUTO_GATEWAY_WEBHOOK',
        notes: 'বার্ষিক সাবস্ক্রিপশন প্রিমিয়াম প্যাকেজ'
      },
      {
        id: 'inv_2002',
        invoiceNumber: 'INV-ABABIL-2026-5541',
        tenantId: 'org_bismillah_001',
        tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
        planName: 'Standard Starter Plan',
        billingCycle: 'MONTHLY',
        amount: 2000,
        taxAmount: 100,
        discountAmount: 0,
        netAmount: 2100,
        currency: 'BDT',
        status: 'PAID',
        gatewayType: 'NAGAD',
        transactionId: 'NG77218391',
        senderMobileOrAccount: '01899887766',
        paidAt: new Date(Date.now() - 86400000 * 40).toISOString(),
        periodStart: new Date(Date.now() - 86400000 * 40).toISOString(),
        periodEnd: new Date(Date.now() - 86400000 * 10).toISOString(),
        paidBy: 'আরিফুল ইসলাম (এডমিন)',
        verifiedBy: 'SYSTEM_AUTO_GATEWAY_WEBHOOK'
      }
    ];
  }

  private static getFallbackTransactions(): TransactionRecord[] {
    return [
      {
        id: 'trx_101',
        invoiceId: 'inv_2001',
        invoiceNumber: 'INV-ABABIL-2026-8812',
        tenantId: 'org_bismillah_001',
        tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
        gatewayType: 'BKASH',
        transactionId: 'BK9X82M10A',
        amount: 14750,
        status: 'PAID',
        paymentDate: new Date(Date.now() - 86400000 * 10).toISOString(),
        paidBy: 'আরিফুল ইসলাম (এডমিন)'
      },
      {
        id: 'trx_102',
        invoiceId: 'inv_2002',
        invoiceNumber: 'INV-ABABIL-2026-5541',
        tenantId: 'org_bismillah_001',
        tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
        gatewayType: 'NAGAD',
        transactionId: 'NG77218391',
        amount: 2100,
        status: 'PAID',
        paymentDate: new Date(Date.now() - 86400000 * 40).toISOString(),
        paidBy: 'আরিফুল ইসলাম (এডমিন)'
      }
    ];
  }
}
