import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  PackageTier, 
  SubscriptionRecord, 
  PaymentRecord, 
  SubscriptionStatus 
} from '../types/saas';
import { MOCK_PACKAGES, MOCK_ORGANIZATIONS } from '../data/mockSaaSData';

const PACKAGES_COLLECTION = 'packages';
const SUBSCRIPTIONS_COLLECTION = 'subscriptions';
const PAYMENTS_COLLECTION = 'payments';
const BILLING_HISTORY_COLLECTION = 'billing_history';

export class SubscriptionService {

  // ----------------------------------------------------
  // 1. PACKAGE MANAGEMENT
  // ----------------------------------------------------

  /**
   * Realtime Subscription to Packages Collection in Firestore
   */
  static subscribePackages(
    onSuccess: (packages: PackageTier[]) => void,
    onError?: (err: Error) => void
  ): () => void {
    try {
      const colRef = collection(db, PACKAGES_COLLECTION);
      
      const unsubscribe = onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const pkgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PackageTier));
          onSuccess(pkgs);
        } else {
          // Seed default mock packages to Firestore if empty
          this.seedInitialPackages().then(() => onSuccess(MOCK_PACKAGES));
        }
      }, (err) => {
        console.warn('Firestore Packages subscription warning, using fallback packages:', err);
        if (onError) onError(err);
        onSuccess(MOCK_PACKAGES);
      });

      return unsubscribe;
    } catch (e) {
      console.warn('Packages subscription fallback:', e);
      onSuccess(MOCK_PACKAGES);
      return () => {};
    }
  }

  /**
   * Seed Initial Packages if Firestore collection is empty
   */
  private static async seedInitialPackages(): Promise<void> {
    try {
      for (const pkg of MOCK_PACKAGES) {
        const docRef = doc(db, PACKAGES_COLLECTION, pkg.id);
        await setDoc(docRef, { ...pkg, updatedAt: new Date().toISOString() }, { merge: true });
      }
    } catch (e) {
      console.warn('Error seeding initial packages:', e);
    }
  }

  /**
   * Save or Update a Package
   */
  static async savePackage(pkg: PackageTier): Promise<void> {
    try {
      const pkgId = pkg.id || `pkg_${Date.now()}`;
      const docRef = doc(db, PACKAGES_COLLECTION, pkgId);
      await setDoc(docRef, {
        ...pkg,
        id: pkgId,
        updatedAt: new Date().toISOString(),
        serverUpdatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn('Error saving package to Firestore:', e);
    }
  }

  /**
   * Delete a Package
   */
  static async deletePackage(pkgId: string): Promise<void> {
    try {
      const docRef = doc(db, PACKAGES_COLLECTION, pkgId);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn(`Error deleting package ${pkgId}:`, e);
    }
  }

  /**
   * Clone / Duplicate a Package
   */
  static async clonePackage(sourcePkg: PackageTier): Promise<PackageTier> {
    const newId = `pkg_${Date.now()}`;
    const cloned: PackageTier = {
      ...sourcePkg,
      id: newId,
      packageCode: `${sourcePkg.packageCode}-COPY`,
      nameBangla: `${sourcePkg.nameBangla} (কপি)`,
      nameEnglish: `${sourcePkg.nameEnglish} (Copy)`,
      createdAt: new Date().toISOString()
    };
    await this.savePackage(cloned);
    return cloned;
  }

  /**
   * Toggle Package Status (Active / Inactive)
   */
  static async togglePackageStatus(pkgId: string, currentStatus: 'active' | 'inactive'): Promise<void> {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const docRef = doc(db, PACKAGES_COLLECTION, pkgId);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn(`Error toggling package status ${pkgId}:`, e);
    }
  }

  // ----------------------------------------------------
  // 2. SUBSCRIPTION MANAGEMENT
  // ----------------------------------------------------

  /**
   * Realtime Subscription to Active Subscriptions
   */
  static subscribeSubscriptions(
    onSuccess: (subscriptions: SubscriptionRecord[]) => void,
    onError?: (err: Error) => void
  ): () => void {
    try {
      const colRef = collection(db, SUBSCRIPTIONS_COLLECTION);
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const subs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SubscriptionRecord));
          onSuccess(subs);
        } else {
          onSuccess([]);
        }
      }, (err) => {
        console.warn('Subscriptions listener warning:', err);
        if (onError) onError(err);
      });
    } catch (e) {
      console.warn('Subscriptions listener failed:', e);
      return () => {};
    }
  }

  /**
   * Assign or Change Package for an Organization
   */
  static async assignPackageToOrg(
    tenantId: string, 
    tenantName: string, 
    pkg: PackageTier, 
    billingCycle: 'monthly' | 'yearly' = 'monthly'
  ): Promise<void> {
    try {
      const subId = `sub_${tenantId}`;
      const amount = billingCycle === 'yearly' ? pkg.priceYearly : pkg.priceMonthly;
      
      const now = new Date();
      const endDate = new Date();
      if (billingCycle === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      const subRecord: SubscriptionRecord = {
        id: subId,
        tenantId,
        tenantName,
        packageId: pkg.id,
        packageName: pkg.nameBangla,
        billingCycle,
        status: 'active',
        amount,
        startDate: now.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        autoRenew: true,
        updatedAt: new Date().toISOString()
      };

      // 1. Save Sub Doc
      await setDoc(doc(db, SUBSCRIPTIONS_COLLECTION, subId), subRecord, { merge: true });

      // 2. Update Tenant Doc
      await setDoc(doc(db, 'tenants', tenantId), {
        packageId: pkg.id,
        status: 'active',
        subscriptionStart: subRecord.startDate,
        subscriptionEnd: subRecord.endDate,
        updatedAt: serverTimestamp()
      }, { merge: true });

    } catch (e) {
      console.warn('Error assigning package:', e);
    }
  }

  /**
   * Update Subscription Status (Pause, Resume, Cancel, etc.)
   */
  static async updateSubscriptionStatus(subId: string, status: SubscriptionStatus, tenantId: string): Promise<void> {
    try {
      const subRef = doc(db, SUBSCRIPTIONS_COLLECTION, subId);
      const tenantRef = doc(db, 'tenants', tenantId);

      const updates: Partial<SubscriptionRecord> = {
        status,
        updatedAt: new Date().toISOString()
      };

      if (status === 'paused') updates.pausedAt = new Date().toISOString();
      if (status === 'cancelled') updates.cancelledAt = new Date().toISOString();

      await setDoc(subRef, updates, { merge: true });

      // Map subscription status to tenant status
      const tenantStatusMap: Record<SubscriptionStatus, string> = {
        active: 'active',
        trial: 'trial',
        expired: 'expired',
        paused: 'suspended',
        cancelled: 'suspended'
      };

      await setDoc(tenantRef, {
        status: tenantStatusMap[status] || 'suspended',
        updatedAt: serverTimestamp()
      }, { merge: true });

    } catch (e) {
      console.warn(`Error updating subscription status ${subId}:`, e);
    }
  }

  // ----------------------------------------------------
  // 3. RENEWAL & PAYMENT HISTORY
  // ----------------------------------------------------

  /**
   * Renew Subscription & Generate Payment Record
   */
  static async renewSubscription(
    tenantId: string,
    tenantName: string,
    pkg: PackageTier,
    monthsCount: number,
    paymentMethod: 'bKash' | 'Nagad' | 'Bank' | 'Cash' | 'Card',
    renewedBy: string = 'Super Admin'
  ): Promise<PaymentRecord> {
    const amount = pkg.priceMonthly * monthsCount;
    const now = new Date();
    
    // Calculate new expiry
    const newEndDate = new Date();
    newEndDate.setMonth(newEndDate.getMonth() + monthsCount);
    const renewedUntilStr = newEndDate.toISOString().split('T')[0];

    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    const paymentId = `pay_${Date.now()}`;

    const paymentRecord: PaymentRecord = {
      id: paymentId,
      invoiceNumber,
      tenantId,
      tenantName,
      packageId: pkg.id,
      packageName: pkg.nameBangla,
      amount,
      paymentMethod,
      paymentDate: now.toISOString().split('T')[0],
      renewedUntil: renewedUntilStr,
      status: 'paid',
      renewedBy,
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: now.toISOString()
    };

    try {
      // 1. Save to payments collection
      await setDoc(doc(db, PAYMENTS_COLLECTION, paymentId), paymentRecord);

      // 2. Save to billing_history collection
      await setDoc(doc(db, BILLING_HISTORY_COLLECTION, paymentId), paymentRecord);

      // 3. Update active subscription
      const subId = `sub_${tenantId}`;
      await setDoc(doc(db, SUBSCRIPTIONS_COLLECTION, subId), {
        status: 'active',
        endDate: renewedUntilStr,
        updatedAt: now.toISOString()
      }, { merge: true });

      // 4. Update tenant status and validity date
      await setDoc(doc(db, 'tenants', tenantId), {
        status: 'active',
        subscriptionEnd: renewedUntilStr,
        updatedAt: serverTimestamp()
      }, { merge: true });

    } catch (e) {
      console.warn('Error saving payment renewal record:', e);
    }

    return paymentRecord;
  }

  /**
   * Realtime Subscription to Payment History Records
   */
  static subscribePaymentHistory(
    onSuccess: (payments: PaymentRecord[]) => void,
    onError?: (err: Error) => void
  ): () => void {
    try {
      const colRef = collection(db, PAYMENTS_COLLECTION);
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const payments = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PaymentRecord));
          onSuccess(payments);
        } else {
          // Fallback mock payments
          const mockPayments: PaymentRecord[] = [
            {
              id: 'pay_101',
              invoiceNumber: 'INV-882101',
              tenantId: 'org_bismillah_001',
              tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
              packageId: 'business',
              packageName: 'বিজনেস প্যাকেজ',
              amount: 2500,
              paymentMethod: 'bKash',
              paymentDate: '2026-07-01',
              renewedUntil: '2026-08-01',
              status: 'paid',
              renewedBy: 'Super Admin',
              transactionId: 'TXN-991204',
              createdAt: '2026-07-01T10:00:00Z'
            },
            {
              id: 'pay_102',
              invoiceNumber: 'INV-882102',
              tenantId: 'org_albaraka_002',
              tenantName: 'আল-বারাকা সঞ্চয় সমিতি',
              packageId: 'enterprise',
              packageName: 'এন্টারপ্রাইজ প্যাকেজ',
              amount: 5000,
              paymentMethod: 'Bank',
              paymentDate: '2026-06-15',
              renewedUntil: '2026-07-15',
              status: 'paid',
              renewedBy: 'System Auto',
              transactionId: 'TXN-441108',
              createdAt: '2026-06-15T14:30:00Z'
            }
          ];
          onSuccess(mockPayments);
        }
      }, (err) => {
        console.warn('Payments listener warning:', err);
        if (onError) onError(err);
      });
    } catch (e) {
      console.warn('Payments subscription failed:', e);
      return () => {};
    }
  }

  // ----------------------------------------------------
  // 4. AUTO EXPIRY SYSTEM & PERMISSIONS CHECK
  // ----------------------------------------------------

  /**
   * Check if Organization's Subscription is Expired or Near Expiry
   */
  static checkOrgSubscriptionExpiry(subscriptionEnd: string, status: string): {
    isExpired: boolean;
    daysRemaining: number;
    shouldBlockLogin: boolean;
    warningNotice: string | null;
  } {
    if (status === 'suspended' || status === 'paused' || status === 'cancelled') {
      return {
        isExpired: true,
        daysRemaining: 0,
        shouldBlockLogin: true,
        warningNotice: 'আপনার অর্গানাইজেশনের সাবস্ক্রিপশন ব্লক বা সাসপেন্ড করা হয়েছে। ড্যাশবোর্ডে প্রবেশ বন্ধ রয়েছে। ডাটা নিরাপদ আছে।'
      };
    }

    if (!subscriptionEnd) {
      return { isExpired: false, daysRemaining: 30, shouldBlockLogin: false, warningNotice: null };
    }

    const today = new Date();
    const expiry = new Date(subscriptionEnd);
    const diffTime = expiry.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 0) {
      return {
        isExpired: true,
        daysRemaining: 0,
        shouldBlockLogin: true,
        warningNotice: 'আপনার সাবস্ক্রিপশনের মেয়াদ শেষ হয়ে গেছে! নতুন পেমেন্ট সম্পন্ন করে একসেস পুনরুজ্জীবিত করুন। আপনার সমুদয় ডাটা সম্পূর্ণ নিরাপদ রয়েছে।'
      };
    }

    if (daysRemaining <= 5) {
      return {
        isExpired: false,
        daysRemaining,
        shouldBlockLogin: false,
        warningNotice: `জরুরী নোটিশ: আপনার সাবস্ক্রিপশনের মেয়াদ আর মাত্র ${daysRemaining} দিন বাকি আছে! সেবা সচল রাখতে রিনিউ করুন।`
      };
    }

    return {
      isExpired: false,
      daysRemaining,
      shouldBlockLogin: false,
      warningNotice: null
    };
  }
}
