import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  MemberPortalProfile, 
  CollectionHistoryRecord, 
  MemberSmsRecord, 
  ProfileUpdateLog, 
  CustomerSessionLog 
} from '../types/customerPortal';

export class CustomerPortalService {

  /**
   * Fetch Member Profile from `member_portal` collection
   */
  static async getMemberProfile(memberId: string): Promise<MemberPortalProfile> {
    try {
      const docRef = doc(db, 'member_portal', memberId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...(snap.data() as Record<string, any>) } as MemberPortalProfile;
      }
      return this.getFallbackMemberProfile(memberId);
    } catch (e) {
      console.warn('Error fetching member profile, using fallback:', e);
      return this.getFallbackMemberProfile(memberId);
    }
  }

  /**
   * Update Profile Details & Log Change into `profile_updates`
   */
  static async updateMemberProfile(
    memberId: string, 
    updatedFields: Partial<MemberPortalProfile>, 
    actorName: string
  ): Promise<void> {
    try {
      const docRef = doc(db, 'member_portal', memberId);
      await setDoc(docRef, updatedFields, { merge: true });

      // Log updates
      for (const [key, val] of Object.entries(updatedFields)) {
        await addDoc(collection(db, 'profile_updates'), {
          memberId,
          memberName: actorName,
          tenantId: updatedFields.tenantId || 'org_bismillah_001',
          fieldChanged: key,
          newValue: String(val),
          updatedAt: new Date().toISOString(),
          updatedBy: actorName
        } as ProfileUpdateLog);
      }
    } catch (e) {
      console.error('Error updating member profile:', e);
    }
  }

  /**
   * Log Download Action into `download_logs`
   */
  static async logDownload(memberId: string, documentType: string, documentId: string): Promise<void> {
    try {
      await addDoc(collection(db, 'download_logs'), {
        memberId,
        documentType,
        documentId,
        downloadedAt: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
    } catch (e) {
      console.error('Error logging download:', e);
    }
  }

  /**
   * Create Session Log in `customer_sessions`
   */
  static async createCustomerSession(memberId: string, email: string, tenantId: string): Promise<void> {
    try {
      await addDoc(collection(db, 'customer_sessions'), {
        memberId,
        memberEmail: email,
        tenantId,
        ipAddress: '103.145.118.22',
        deviceInfo: navigator.userAgent.substring(0, 60),
        loginAt: new Date().toISOString(),
        status: 'ACTIVE'
      } as CustomerSessionLog);
    } catch (e) {
      console.error('Error creating customer session:', e);
    }
  }

  /**
   * Fetch Member Collections History
   */
  static async getMemberCollections(memberId: string): Promise<CollectionHistoryRecord[]> {
    try {
      const snap = await getDocs(collection(db, 'member_collections'));
      const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, any>) })) as CollectionHistoryRecord[];
      if (items.length === 0) return this.getFallbackCollections();
      return items;
    } catch (e) {
      return this.getFallbackCollections();
    }
  }

  /**
   * Fetch Member SMS History
   */
  static async getMemberSmsHistory(memberId: string): Promise<MemberSmsRecord[]> {
    try {
      const snap = await getDocs(collection(db, 'member_sms'));
      const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, any>) })) as MemberSmsRecord[];
      if (items.length === 0) return this.getFallbackSmsHistory();
      return items;
    } catch (e) {
      return this.getFallbackSmsHistory();
    }
  }

  /* Fallbacks for clean initial render */
  private static getFallbackMemberProfile(memberId: string): MemberPortalProfile {
    return {
      id: memberId || 'mem_88201',
      tenantId: 'org_bismillah_001',
      tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
      memberCode: 'MEM-ABABIL-2026-991',
      fullName: 'মোঃ জহিরুল ইসলাম',
      mobile: '01711002233',
      email: 'zahir.garage@gmail.com',
      role: 'MEMBER',
      designation: 'সিনিয়র গ্যারেজ ড্রাইভার ও মেম্বার',
      joiningDate: '2025-01-15',
      vehicleNumber: 'ঢাকা মেট্রো-থ-১১-৮৮৯২',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      address: 'বাড়ী নং ৪২, রোড নং ৭, ব্লক-সি, মিরপুর-১০, ঢাকা',
      emergencyContact: '01899112233 (ভাই)',
      totalCollectionsPaid: 32500,
      totalCurrentDue: 1200,
      membershipStatus: 'ACTIVE',
      qrCodeData: `ABABIL-CARD-MEM-ABABIL-2026-991-ZAHIR`,
      lastLoginAt: new Date().toISOString()
    };
  }

  private static getFallbackCollections(): CollectionHistoryRecord[] {
    return [
      {
        id: 'col_901',
        receiptNumber: 'REC-2026-8812',
        tenantId: 'org_bismillah_001',
        collectionType: 'দৈনিক গ্যারেজ চার্জিং ও নাইট পার্কিং ফি',
        amount: 850,
        paymentMethod: 'bKash Merchant',
        paymentDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        collectedBy: 'ক্যাশিয়ার রফিক',
        status: 'PAID'
      },
      {
        id: 'col_902',
        receiptNumber: 'REC-2026-7731',
        tenantId: 'org_bismillah_001',
        collectionType: 'মাসিক মেম্বারশিপ সার্ভিস চার্জ',
        amount: 3500,
        paymentMethod: 'Nagad Pay',
        paymentDate: new Date(Date.now() - 86400000 * 15).toISOString(),
        collectedBy: 'সিস্টেম অটো পেমেন্ট',
        status: 'PAID'
      },
      {
        id: 'col_903',
        receiptNumber: 'REC-2026-5510',
        tenantId: 'org_bismillah_001',
        collectionType: 'জরুরী ব্যাটারি স্পেয়ার পার্টস বিল',
        amount: 1200,
        paymentMethod: 'Cash',
        paymentDate: new Date(Date.now() - 86400000 * 30).toISOString(),
        collectedBy: 'ক্যাশিয়ার রফিক',
        status: 'PAID'
      }
    ];
  }

  private static getFallbackSmsHistory(): MemberSmsRecord[] {
    return [
      {
        id: 'sms_101',
        mobile: '01711002233',
        message: 'শ্রদ্ধেয় মোঃ জহিরুল ইসলাম, আপনার ৳৮৫০ পেমেন্ট সফলভাবে প্রাপ্ত হয়েছে। রিসিট নং: REC-2026-8812। ধন্যবাদ - বিসমিল্লাহ গ্যারেজ।',
        smsType: 'PAYMENT_RECEIPT',
        status: 'DELIVERED',
        sentAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'sms_102',
        mobile: '01711002233',
        message: 'মেম্বারশিপ আপডেট: আপনার প্রোফাইল তথ্য এবং মোবাইল নম্বর সফলভাবে আপডেট করা হয়েছে।',
        smsType: 'SECURITY_OTP',
        status: 'DELIVERED',
        sentAt: new Date(Date.now() - 86400000 * 5).toISOString()
      }
    ];
  }
}
