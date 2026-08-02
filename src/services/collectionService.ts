import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  getDocs,
  query, 
  where 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  DailyCollectionRecord, 
  DueRecord, 
  CollectionSummaryStats, 
  PaymentMethod, 
  PaymentStatus 
} from '../types/collection';
import { MemberRecord } from '../types/member';

const COLLECTIONS_PATH = 'daily_collections';
const TRANSACTIONS_PATH = 'transactions';
const RECEIPTS_PATH = 'receipts';
const PAYMENT_HISTORY_PATH = 'payment_history';
const DUES_PATH = 'dues';

// Initial Mock Collections for fallback/seeding
const INITIAL_MOCK_COLLECTIONS: DailyCollectionRecord[] = [
  {
    id: 'col_2026_001',
    receiptNo: 'RCP-2026-07-101',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    memberId: 'MEM-2026-001',
    memberName: 'আলহাজ্ব মোঃ সামসুল হক',
    memberPhone: '01712345678',
    membershipNumber: 'MS-1001',
    vehicleNo: 'ঢাকা মেট্রো-থ-১১-৪৫২৩',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    date: new Date().toISOString().split('T')[0],
    time: '10:30 AM',
    chargeType: 'দৈনিক গ্যারেজ চার্জ',
    expectedAmount: 300,
    paidAmount: 300,
    dueAmount: 0,
    advanceAmount: 0,
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    collectorName: 'মোঃ জসিম (ক্যাশিয়ার)',
    notes: 'নিয়মিত জমার রসিদ',
    transactionId: 'TXN-CASH-9901',
    createdAt: new Date().toISOString()
  },
  {
    id: 'col_2026_002',
    receiptNo: 'RCP-2026-07-102',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    memberId: 'MEM-2026-002',
    memberName: 'মোঃ কামাল হোসেন',
    memberPhone: '01811998877',
    membershipNumber: 'MS-1002',
    vehicleNo: 'ঢাকা মেট্রো-হ-১২-৮৮৯০',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    date: new Date().toISOString().split('T')[0],
    time: '11:15 AM',
    chargeType: 'দৈনিক গ্যারেজ চার্জ & নাইট পার্কিং',
    expectedAmount: 500,
    paidAmount: 300,
    dueAmount: 200,
    advanceAmount: 0,
    paymentStatus: 'partial',
    paymentMethod: 'bkash',
    collectorName: 'রফিকুল ইসলাম (ম্যানেজার)',
    notes: 'বিকাশে ৩০০ টাকা পরিশোধ, ২০০ টাকা বকেয়া',
    transactionId: 'TRX99882211',
    createdAt: new Date().toISOString()
  },
  {
    id: 'col_2026_003',
    receiptNo: 'RCP-2026-07-103',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    memberId: 'MEM-2026-003',
    memberName: 'মোসাম্মাৎ রহিমা আক্তার',
    memberPhone: '01911223366',
    membershipNumber: 'MS-1003',
    vehicleNo: 'ঢাকা মেট্রো-গ-১৪-৫০১০',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    date: new Date().toISOString().split('T')[0],
    time: '02:45 PM',
    chargeType: 'অটো ব্যাটারি চার্জিং চার্জ',
    expectedAmount: 1000,
    paidAmount: 1200,
    dueAmount: 0,
    advanceAmount: 200,
    paymentStatus: 'advance',
    paymentMethod: 'nagad',
    collectorName: 'মোঃ জসিম (ক্যাশিয়ার)',
    notes: '২০০ টাকা এডভান্স জমা রাখা হয়েছে',
    transactionId: 'NGD7766551',
    createdAt: new Date().toISOString()
  }
];

export class CollectionService {

  // ----------------------------------------------------
  // 1. REALTIME COLLECTIONS LISTENER
  // ----------------------------------------------------
  static subscribeCollections(
    tenantId: string = 'org_bismillah_001',
    onSuccess: (records: DailyCollectionRecord[]) => void,
    onError?: (err: Error) => void
  ): () => void {
    try {
      const colRef = collection(db, COLLECTIONS_PATH);
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs
            .map(d => ({ id: d.id, ...d.data() } as DailyCollectionRecord))
            .filter(r => !r.isDeleted && (tenantId === 'all' || r.tenantId === tenantId))
            .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          onSuccess(docs);
        } else {
          const hasSeeded = localStorage.getItem('ababil_collections_seeded_once');
          if (!hasSeeded) {
            localStorage.setItem('ababil_collections_seeded_once', 'true');
            this.seedInitialCollections(tenantId).then(() => {
              onSuccess(INITIAL_MOCK_COLLECTIONS.filter(c => tenantId === 'all' || c.tenantId === tenantId));
            });
          } else {
            onSuccess([]);
          }
        }
      }, (err) => {
        console.warn('Daily Collections Firestore listener warning, fallback used:', err);
        if (onError) onError(err);
        onSuccess(INITIAL_MOCK_COLLECTIONS.filter(c => tenantId === 'all' || c.tenantId === tenantId));
      });
    } catch (e) {
      console.warn('Collections subscription error:', e);
      onSuccess(INITIAL_MOCK_COLLECTIONS.filter(c => tenantId === 'all' || c.tenantId === tenantId));
      return () => {};
    }
  }

  private static async seedInitialCollections(tenantId: string): Promise<void> {
    try {
      for (const col of INITIAL_MOCK_COLLECTIONS) {
        const docRef = doc(db, COLLECTIONS_PATH, col.id);
        await setDoc(docRef, col, { merge: true });
      }
    } catch (e) {
      console.warn('Error seeding mock collections:', e);
    }
  }

  // ----------------------------------------------------
  // 2. CHECK DUPLICATE COLLECTION TODAY
  // ----------------------------------------------------
  static checkDuplicatePaymentToday(
    memberId: string, 
    date: string, 
    existingCollections: DailyCollectionRecord[]
  ): DailyCollectionRecord | undefined {
    return existingCollections.find(
      c => c.memberId === memberId && c.date === date && !c.isDeleted
    );
  }

  // ----------------------------------------------------
  // 3. CREATE / SAVE COLLECTION (Sync with 5 Firestore Nodes)
  // ----------------------------------------------------
  static async recordCollection(
    data: Partial<DailyCollectionRecord>,
    member: MemberRecord,
    collectorName: string = 'ক্যাশিয়ার'
  ): Promise<DailyCollectionRecord> {
    const now = new Date();
    const todayDate = data.date || now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const autoNum = Math.floor(1000 + Math.random() * 9000);
    const receiptNo = data.receiptNo || `RCP-${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${autoNum}`;
    const collectionId = data.id || `col_${Date.now()}_${autoNum}`;

    const expected = Number(data.expectedAmount) || 0;
    const paid = Number(data.paidAmount) || 0;
    let due = 0;
    let advance = 0;
    let status: PaymentStatus = 'paid';

    if (paid < expected) {
      due = expected - paid;
      status = paid > 0 ? 'partial' : 'due';
    } else if (paid > expected) {
      advance = paid - expected;
      status = 'advance';
    } else {
      status = 'paid';
    }

    const record: DailyCollectionRecord = {
      id: collectionId,
      receiptNo,
      tenantId: data.tenantId || member.tenantId || 'org_bismillah_001',
      tenantName: data.tenantName || member.tenantName || 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
      memberId: member.id,
      memberName: member.fullName,
      memberPhone: member.phone,
      membershipNumber: member.membershipNumber,
      vehicleNo: member.vehicleNo || '',
      photoUrl: member.photoUrl,
      date: todayDate,
      time: timeStr,
      chargeType: data.chargeType || 'দৈনিক গ্যারেজ চার্জ',
      expectedAmount: expected,
      paidAmount: paid,
      dueAmount: due,
      advanceAmount: advance,
      paymentStatus: status,
      paymentMethod: data.paymentMethod || 'cash',
      mixedPaymentDetails: data.mixedPaymentDetails,
      collectorName: collectorName,
      notes: data.notes || '',
      transactionId: data.transactionId || `TXN-${(data.paymentMethod || 'CASH').toUpperCase()}-${autoNum}`,
      isOfflineCreated: !navigator.onLine,
      createdAt: now.toISOString(),
      isDeleted: false
    };

    // If Offline -> Store in localStorage Queue
    if (!navigator.onLine) {
      this.saveToOfflineQueue(record);
      return record;
    }

    try {
      // 1. Save in daily_collections
      await setDoc(doc(db, COLLECTIONS_PATH, collectionId), record, { merge: true });

      // 2. Save in transactions node
      await setDoc(doc(db, TRANSACTIONS_PATH, `txn_${collectionId}`), {
        id: `txn_${collectionId}`,
        tenantId: record.tenantId,
        memberId: record.memberId,
        memberName: record.memberName,
        amount: record.paidAmount,
        type: 'collection',
        paymentMethod: record.paymentMethod,
        receiptNo: record.receiptNo,
        collectorName: record.collectorName,
        date: record.date,
        createdAt: record.createdAt
      }, { merge: true });

      // 3. Save in receipts node
      await setDoc(doc(db, RECEIPTS_PATH, `rcp_${collectionId}`), {
        receiptNo: record.receiptNo,
        collectionId: record.id,
        tenantId: record.tenantId,
        memberId: record.memberId,
        memberName: record.memberName,
        phone: record.memberPhone,
        date: record.date,
        paidAmount: record.paidAmount,
        dueAmount: record.dueAmount,
        advanceAmount: record.advanceAmount,
        collectorName: record.collectorName,
        chargeType: record.chargeType,
        createdAt: record.createdAt
      }, { merge: true });

      // 4. Save in payment_history node
      await setDoc(doc(db, PAYMENT_HISTORY_PATH, `pay_${collectionId}`), {
        id: `pay_${collectionId}`,
        memberId: record.memberId,
        date: record.date,
        amount: record.paidAmount,
        paymentMethod: record.paymentMethod,
        receiptNo: record.receiptNo,
        collectorName: record.collectorName,
        createdAt: record.createdAt
      }, { merge: true });

      // 5. Update/Save dues node
      await setDoc(doc(db, DUES_PATH, `due_${record.memberId}`), {
        id: `due_${record.memberId}`,
        tenantId: record.tenantId,
        memberId: record.memberId,
        memberName: record.memberName,
        memberPhone: record.memberPhone,
        membershipNumber: record.membershipNumber,
        vehicleNo: record.vehicleNo,
        totalDue: due,
        advanceBalance: advance,
        lastPaymentDate: record.date,
        status: due > 0 ? 'due' : 'clear',
        updatedAt: record.createdAt
      }, { merge: true });

      // Also update Member Record's totalPaidAmount & totalDueAmount in members collection
      const memberDocRef = doc(db, 'members', member.id);
      const newTotalPaid = (member.totalPaidAmount || 0) + record.paidAmount;
      await updateDoc(memberDocRef, {
        totalPaidAmount: newTotalPaid,
        totalDueAmount: due,
        updatedAt: now.toISOString()
      }).catch(err => console.warn('Member summary update warn:', err));

    } catch (e) {
      console.warn('Error saving collection to Firestore, queueing offline:', e);
      this.saveToOfflineQueue(record);
    }

    return record;
  }

  // ----------------------------------------------------
  // 4. OFFLINE QUEUE & SYNC
  // ----------------------------------------------------
  private static OFFLINE_KEY = 'ababil_garage_offline_collections_queue';

  static getOfflineQueue(): DailyCollectionRecord[] {
    try {
      const raw = localStorage.getItem(this.OFFLINE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  private static saveToOfflineQueue(record: DailyCollectionRecord) {
    try {
      const queue = this.getOfflineQueue();
      queue.push(record);
      localStorage.setItem(this.OFFLINE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.warn('LocalStorage queue save error:', e);
    }
  }

  static async syncOfflineQueue(): Promise<number> {
    const queue = this.getOfflineQueue();
    if (queue.length === 0) return 0;

    let syncedCount = 0;
    const remainingQueue: DailyCollectionRecord[] = [];

    for (const record of queue) {
      try {
        await setDoc(doc(db, COLLECTIONS_PATH, record.id), {
          ...record,
          isOfflineCreated: false,
          syncedAt: new Date().toISOString()
        }, { merge: true });
        syncedCount++;
      } catch (e) {
        remainingQueue.push(record);
      }
    }

    localStorage.setItem(this.OFFLINE_KEY, JSON.stringify(remainingQueue));
    return syncedCount;
  }

  // ----------------------------------------------------
  // 5. CALCULATE STATS & AUTO CALCULATIONS
  // ----------------------------------------------------
  static calculateStats(collections: DailyCollectionRecord[]): CollectionSummaryStats {
    const todayStr = new Date().toISOString().split('T')[0];
    const currentMonth = todayStr.substring(0, 7); // YYYY-MM
    const currentYear = todayStr.substring(0, 4); // YYYY

    let todayTotal = 0;
    let todayCount = 0;
    let monthlyTotal = 0;
    let yearlyTotal = 0;
    let totalDue = 0;
    let totalAdvance = 0;

    collections.forEach((c) => {
      if (c.isDeleted) return;

      if (c.date === todayStr) {
        todayTotal += c.paidAmount;
        todayCount++;
      }

      if (c.date.startsWith(currentMonth)) {
        monthlyTotal += c.paidAmount;
      }

      if (c.date.startsWith(currentYear)) {
        yearlyTotal += c.paidAmount;
      }

      totalDue += (c.dueAmount || 0);
      totalAdvance += (c.advanceAmount || 0);
    });

    return {
      todayTotal,
      todayCount,
      monthlyTotal,
      yearlyTotal,
      totalDue,
      totalAdvance
    };
  }

  // ----------------------------------------------------
  // 6. SOFT DELETE TRANSACTION
  // ----------------------------------------------------
  static async softDeleteCollection(collectionId: string, actorName: string = 'Admin'): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS_PATH, collectionId);
      await updateDoc(docRef, {
        isDeleted: true,
        deletedBy: actorName,
        deletedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Error soft deleting collection:', e);
    }
  }

  // ----------------------------------------------------
  // 7. GET DUE LIST & REMINDER TEXT
  // ----------------------------------------------------
  static getDueList(collections: DailyCollectionRecord[]): DueRecord[] {
    const dueMap = new Map<string, DueRecord>();

    collections.forEach((col) => {
      if (col.isDeleted) return;

      const existing = dueMap.get(col.memberId);
      const currentDue = col.dueAmount || 0;
      const currentAdv = col.advanceAmount || 0;

      if (existing) {
        existing.totalDue += currentDue;
        existing.advanceBalance += currentAdv;
        if (col.date > existing.lastPaymentDate) {
          existing.lastPaymentDate = col.date;
        }
        existing.status = existing.totalDue > 0 ? 'due' : 'clear';
      } else {
        dueMap.set(col.memberId, {
          id: `due_${col.memberId}`,
          tenantId: col.tenantId,
          memberId: col.memberId,
          memberName: col.memberName,
          memberPhone: col.memberPhone,
          membershipNumber: col.membershipNumber,
          vehicleNo: col.vehicleNo,
          totalDue: currentDue,
          advanceBalance: currentAdv,
          lastPaymentDate: col.date,
          status: currentDue > 0 ? 'due' : 'clear'
        });
      }
    });

    return Array.from(dueMap.values()).filter(d => d.totalDue > 0 || d.advanceBalance > 0);
  }

  static generateDueReminderSMS(dueItem: DueRecord, garageName: string): string {
    return `প্রিয় ${dueItem.memberName}, ${garageName}-এ আপনার মোট বকেয়া ৳${dueItem.totalDue} টাকা। অনুগ্রহ করে দ্রুত বকেয়া পরিশোধ করুন। ধন্যবাদ!`;
  }
}
