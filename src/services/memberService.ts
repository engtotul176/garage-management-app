import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  MemberRecord, 
  MemberStatus, 
  MembershipType, 
  MemberCollectionHistory, 
  MemberDueHistory, 
  MemberPaymentHistory, 
  MemberReceiptRecord, 
  MemberSMSHistory, 
  MemberLoginHistory, 
  MemberActivityLog 
} from '../types/member';

const MEMBERS_COLLECTION = 'members';
const MEMBER_PROFILES_COLLECTION = 'member_profiles';
const MEMBER_HISTORY_COLLECTION = 'member_history';
const MEMBER_ACTIVITY_COLLECTION = 'member_activity';

// Comprehensive mock members for seed fallback
const INITIAL_MOCK_MEMBERS: MemberRecord[] = [
  {
    id: 'MEM-2026-001',
    membershipNumber: 'MS-1001',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    fullName: 'আলহাজ্ব মোঃ সামসুল হক',
    fatherName: 'মৃত আবদুর রহমান',
    motherName: 'মোসাম্মাৎ রোকেয়া বেগম',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    phone: '01712345678',
    altPhone: '01812345678',
    email: 'samsul.haque@gmail.com',
    nid: '19752691234567890',
    birthDate: '1975-06-12',
    gender: 'male',
    bloodGroup: 'B+',
    occupation: 'পরিবহন ব্যবসায়ী',
    address: 'বাসা-৪৫, রোড-০৭, ব্লক-বি, মিরপুর-১০, ঢাকা',
    district: 'ঢাকা',
    upazila: 'মিরপুর',
    village: 'মিরপুর-১০',
    emergencyContact: '01911223344 (ছেলে - জাহিদ)',
    joinDate: '2024-01-10',
    referencePerson: 'মোঃ আমজাদ হোসেন (সাধারণ সম্পাদক)',
    membershipType: 'lifetime',
    status: 'active',
    remarks: 'নিয়মিত চাঁদা প্রদানকারী সিনিয়র মেম্বার',
    qrCodeData: 'QR-MEM-2026-001-MS1001',
    barcodeData: '8801712345678',
    totalPaidAmount: 45000,
    totalDueAmount: 0,
    vehicleNo: 'ঢাকা মেট্রো-থ-১১-৪৫২৩',
    createdAt: '2024-01-10T00:00:00Z',
    isDeleted: false
  },
  {
    id: 'MEM-2026-002',
    membershipNumber: 'MS-1002',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    fullName: 'মোঃ কামাল হোসেন',
    fatherName: 'মোঃ সিরাজুল ইসলাম',
    motherName: 'মাজেদা খাতুন',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    phone: '01811998877',
    altPhone: '01911998877',
    email: 'kamal.auto@yahoo.com',
    nid: '19822691234561122',
    birthDate: '1982-08-25',
    gender: 'male',
    bloodGroup: 'O+',
    occupation: 'অটো রিকশা চালক',
    address: 'কয়লাঘাট, পল্লবী, ঢাকা',
    district: 'ঢাকা',
    upazila: 'পল্লবী',
    village: 'পল্লবী',
    emergencyContact: '01711889900 (ভাই - জামাল)',
    joinDate: '2024-03-15',
    referencePerson: 'মোঃ সামসুল হক',
    membershipType: 'general',
    status: 'active',
    remarks: 'মাসিক চাঁদা নিয়মিত পরিশোধিত',
    qrCodeData: 'QR-MEM-2026-002-MS1002',
    barcodeData: '8801811998877',
    totalPaidAmount: 18500,
    totalDueAmount: 500,
    vehicleNo: 'ঢাকা মেট্রো-হ-১২-৮৮৯০',
    createdAt: '2024-03-15T00:00:00Z',
    isDeleted: false
  },
  {
    id: 'MEM-2026-003',
    membershipNumber: 'MS-1003',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    fullName: 'মোসাম্মাৎ রহিমা আক্তার',
    fatherName: 'মৃত খলিলুর রহমান',
    motherName: 'জাহানারা বেগম',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    phone: '01911223366',
    altPhone: '01511223366',
    email: 'rahima@gmail.com',
    nid: '19902691234563344',
    birthDate: '1990-11-04',
    gender: 'female',
    bloodGroup: 'A+',
    occupation: 'ব্যবসায়ী',
    address: 'দক্ষিণ খাঁ, উত্তরা, ঢাকা',
    district: 'ঢাকা',
    upazila: 'উত্তরা',
    village: 'দক্ষিণ খাঁ',
    emergencyContact: '01811223344 (স্বামী - আনোয়ার)',
    joinDate: '2024-05-20',
    referencePerson: 'অফিস ডিরেক্টরি',
    membershipType: 'vip',
    status: 'suspended',
    remarks: 'সাময়িকভাবে ড্রাইভিং লাইসেন্স হালনাগাদ এর কারণে স্থগিত',
    qrCodeData: 'QR-MEM-2026-003-MS1003',
    barcodeData: '8801911223366',
    totalPaidAmount: 22000,
    totalDueAmount: 1500,
    vehicleNo: 'ঢাকা মেট্রো-গ-১৪-৫০১০',
    createdAt: '2024-05-20T00:00:00Z',
    isDeleted: false
  }
];

export class MemberService {

  // Helper for persistent local tracking of deleted members
  private static getDeletedMemberIds(): string[] {
    try {
      const stored = localStorage.getItem('ababil_deleted_member_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static addDeletedMemberIds(ids: string[]): void {
    try {
      const existing = this.getDeletedMemberIds();
      const updated = Array.from(new Set([...existing, ...ids]));
      localStorage.setItem('ababil_deleted_member_ids', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save deleted member ids to localStorage:', e);
    }
  }

  // Helper for custom members stored in localStorage
  private static getCustomMembers(): MemberRecord[] {
    try {
      const stored = localStorage.getItem('ababil_custom_members');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static saveCustomMember(member: MemberRecord): void {
    try {
      const members = this.getCustomMembers();
      const index = members.findIndex(m => m.id === member.id);
      if (index >= 0) {
        members[index] = member;
      } else {
        members.unshift(member);
      }
      localStorage.setItem('ababil_custom_members', JSON.stringify(members));
    } catch (e) {
      console.warn('Failed to save custom member to localStorage:', e);
    }
  }

  private static updateCustomMemberStatus(memberId: string, status: MemberStatus): void {
    try {
      const members = this.getCustomMembers();
      const index = members.findIndex(m => m.id === memberId);
      if (index >= 0) {
        members[index].status = status;
        members[index].updatedAt = new Date().toISOString();
        localStorage.setItem('ababil_custom_members', JSON.stringify(members));
      }
    } catch (e) {
      console.warn('Failed to update custom member status in localStorage:', e);
    }
  }

  private static removeCustomMember(memberId: string): void {
    try {
      const members = this.getCustomMembers().filter(m => m.id !== memberId);
      localStorage.setItem('ababil_custom_members', JSON.stringify(members));
    } catch (e) {
      console.warn('Failed to remove custom member from localStorage:', e);
    }
  }

  // ----------------------------------------------------
  // 1. REALTIME MEMBERS LISTENER
  // ----------------------------------------------------
  static subscribeMembers(
    tenantId: string = 'org_bismillah_001',
    onSuccess: (members: MemberRecord[]) => void,
    onError?: (err: Error) => void
  ): () => void {
    try {
      const colRef = collection(db, MEMBERS_COLLECTION);
      return onSnapshot(colRef, (snapshot) => {
        const deletedIds = this.getDeletedMemberIds();
        const customMembers = this.getCustomMembers();
        
        const firestoreDocs = !snapshot.empty 
          ? snapshot.docs.map(d => ({ id: d.id, ...d.data() } as MemberRecord))
          : [];

        // Combine Firestore docs, custom members, and initial mock members uniquely by ID
        const map = new Map<string, MemberRecord>();
        [...INITIAL_MOCK_MEMBERS, ...customMembers, ...firestoreDocs].forEach(m => {
          if (m && m.id && !m.isDeleted && !deletedIds.includes(m.id)) {
            if (tenantId === 'all' || tenantId === 'no_org' || !m.tenantId || m.tenantId === tenantId) {
              map.set(m.id, m);
            }
          }
        });

        onSuccess(Array.from(map.values()));
      }, (err) => {
        console.warn('Members Firestore listener warning, using fallback:', err);
        if (onError) onError(err);
        const deletedIds = this.getDeletedMemberIds();
        const customMembers = this.getCustomMembers();
        const map = new Map<string, MemberRecord>();
        [...INITIAL_MOCK_MEMBERS, ...customMembers].forEach(m => {
          if (m && m.id && !m.isDeleted && !deletedIds.includes(m.id)) {
            if (tenantId === 'all' || tenantId === 'no_org' || !m.tenantId || m.tenantId === tenantId) {
              map.set(m.id, m);
            }
          }
        });
        onSuccess(Array.from(map.values()));
      });
    } catch (e) {
      console.warn('Members subscription error:', e);
      const deletedIds = this.getDeletedMemberIds();
      const customMembers = this.getCustomMembers();
      const map = new Map<string, MemberRecord>();
      [...INITIAL_MOCK_MEMBERS, ...customMembers].forEach(m => {
        if (m && m.id && !m.isDeleted && !deletedIds.includes(m.id)) {
          if (tenantId === 'all' || tenantId === 'no_org' || !m.tenantId || m.tenantId === tenantId) {
            map.set(m.id, m);
          }
        }
      });
      onSuccess(Array.from(map.values()));
      return () => {};
    }
  }

  private static async seedInitialMembers(tenantId: string): Promise<void> {
    try {
      for (const m of INITIAL_MOCK_MEMBERS) {
        const docRef = doc(db, MEMBERS_COLLECTION, m.id);
        await setDoc(docRef, { ...m, updatedAt: new Date().toISOString() }, { merge: true });
      }
    } catch (e) {
      console.warn('Error seeding mock members:', e);
    }
  }

  // ----------------------------------------------------
  // 2. MEMBER SAVE & UPDATE
  // ----------------------------------------------------
  static async saveMember(
    memberData: Partial<MemberRecord>, 
    actorName: string = 'Org Admin'
  ): Promise<MemberRecord> {
    const isNew = !memberData.id;
    const autoNum = Math.floor(1000 + Math.random() * 9000);
    const memberId = memberData.id || `MEM-2026-${autoNum}`;
    const membershipNo = memberData.membershipNumber || `MS-${autoNum}`;
    const nowStr = new Date().toISOString();

    const fullRecord: MemberRecord = {
      id: memberId,
      membershipNumber: membershipNo,
      tenantId: memberData.tenantId || 'org_bismillah_001',
      tenantName: memberData.tenantName || 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
      fullName: memberData.fullName || 'নতুন মেম্বার',
      fatherName: memberData.fatherName || '',
      motherName: memberData.motherName || '',
      photoUrl: memberData.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      phone: memberData.phone || '',
      altPhone: memberData.altPhone || '',
      email: memberData.email || '',
      nid: memberData.nid || '',
      birthDate: memberData.birthDate || '',
      gender: memberData.gender || 'male',
      bloodGroup: memberData.bloodGroup || 'B+',
      occupation: memberData.occupation || 'ব্যবসায়ী',
      address: memberData.address || '',
      district: memberData.district || 'ঢাকা',
      upazila: memberData.upazila || 'মিরপুর',
      village: memberData.village || '',
      emergencyContact: memberData.emergencyContact || '',
      joinDate: memberData.joinDate || new Date().toISOString().split('T')[0],
      referencePerson: memberData.referencePerson || 'অফিস এডমিন',
      membershipType: (memberData.membershipType as MembershipType) || 'general',
      status: (memberData.status as MemberStatus) || 'active',
      remarks: memberData.remarks || '',
      qrCodeData: `QR-${memberId}-${membershipNo}`,
      barcodeData: `88${memberData.phone || '01712345678'}`,
      totalPaidAmount: memberData.totalPaidAmount || 0,
      totalDueAmount: memberData.totalDueAmount || 0,
      vehicleNo: memberData.vehicleNo || '',
      createdAt: memberData.createdAt || nowStr,
      updatedAt: nowStr,
      isDeleted: false
    };

    // Save to localStorage immediately as primary robust persistence layer
    this.saveCustomMember(fullRecord);

    try {
      const docRef = doc(db, MEMBERS_COLLECTION, memberId);
      await setDoc(docRef, fullRecord, { merge: true });

      // Save additional profile details in member_profiles
      const profileRef = doc(db, MEMBER_PROFILES_COLLECTION, memberId);
      await setDoc(profileRef, {
        memberId,
        fullAddress: `${fullRecord.village}, ${fullRecord.upazila}, ${fullRecord.district}`,
        emergencyDetails: fullRecord.emergencyContact,
        updatedBy: actorName,
        updatedAt: nowStr
      }, { merge: true });

      // Audit Log
      await this.logActivity(
        fullRecord.tenantId,
        fullRecord.id,
        fullRecord.fullName,
        isNew ? 'Member Registered' : 'Member Details Updated',
        `মেম্বার ${fullRecord.fullName} (${fullRecord.membershipNumber}) এর ফাইল ${actorName} দ্বারা ${isNew ? 'নিবন্ধন' : 'আপডেট'} করা হয়েছে।`,
        actorName
      );

    } catch (e) {
      console.warn('Error saving member to Firestore (local fallback active):', e);
    }

    return fullRecord;
  }

  // ----------------------------------------------------
  // 3. STATUS TOGGLE (SUSPEND / ACTIVATE)
  // ----------------------------------------------------
  static async toggleMemberStatus(
    memberId: string, 
    currentStatus: MemberStatus, 
    tenantId: string, 
    fullName: string, 
    actorName: string = 'Org Admin'
  ): Promise<MemberStatus> {
    const newStatus: MemberStatus = currentStatus === 'active' ? 'suspended' : 'active';
    this.updateCustomMemberStatus(memberId, newStatus);
    try {
      const docRef = doc(db, MEMBERS_COLLECTION, memberId);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      await this.logActivity(
        tenantId,
        memberId,
        fullName,
        newStatus === 'suspended' ? 'Member Suspended' : 'Member Activated',
        `মেম্বার ${fullName} এর মেম্বারশিপ স্ট্যাটাস ${newStatus === 'suspended' ? 'স্থগিত' : 'সক্রিয়'} করা হয়েছে (${actorName} দ্বারা)।`,
        actorName
      );
    } catch (e) {
      console.warn('Error toggling member status:', e);
    }
    return newStatus;
  }

  // ----------------------------------------------------
  // 4. SOFT & HARD DELETE
  // ----------------------------------------------------
  static async softDeleteMember(
    memberId: string, 
    tenantId: string, 
    fullName: string, 
    actorName: string = 'Org Admin'
  ): Promise<void> {
    this.updateCustomMemberStatus(memberId, 'deleted');
    try {
      const docRef = doc(db, MEMBERS_COLLECTION, memberId);
      await updateDoc(docRef, {
        isDeleted: true,
        status: 'deleted',
        deletedAt: new Date().toISOString()
      });

      await this.logActivity(
        tenantId,
        memberId,
        fullName,
        'Member Soft Deleted',
        `মেম্বার ${fullName} কে সফট-ডিলিট করা হয়েছে (${actorName} দ্বারা)।`,
        actorName
      );
    } catch (e) {
      console.warn('Error soft deleting member:', e);
    }
  }

  static async hardDeleteMember(
    memberId: string, 
    tenantId: string, 
    fullName: string, 
    actorName: string = 'Org Admin'
  ): Promise<void> {
    this.addDeletedMemberIds([memberId]);
    this.removeCustomMember(memberId);
    try {
      const docRef = doc(db, MEMBERS_COLLECTION, memberId);
      await deleteDoc(docRef);
      await deleteDoc(doc(db, MEMBER_PROFILES_COLLECTION, memberId));

      await this.logActivity(
        tenantId,
        memberId,
        fullName,
        'Member Permanently Deleted',
        `মেম্বার ${fullName} কে স্থায়ীভাবে ডাটাবেজ থেকে মুছে ফেলা হয়েছে (${actorName} দ্বারা)।`,
        actorName
      );
    } catch (e) {
      console.warn('Error hard deleting member:', e);
      this.addDeletedMemberIds([memberId]);
      this.removeCustomMember(memberId);
    }
  }

  static async deleteMembersBatch(
    memberIds: string[], 
    tenantId: string, 
    actorName: string = 'Org Admin'
  ): Promise<void> {
    this.addDeletedMemberIds(memberIds);
    memberIds.forEach(id => this.removeCustomMember(id));
    try {
      for (const id of memberIds) {
        await deleteDoc(doc(db, MEMBERS_COLLECTION, id));
        await deleteDoc(doc(db, MEMBER_PROFILES_COLLECTION, id));
      }
      await this.logActivity(
        tenantId,
        'BATCH',
        `${memberIds.length} members`,
        'Batch Members Permanent Delete',
        `একসাথে ${memberIds.length} জন মেম্বার স্থায়ীভাবে ডিলিট করা হয়েছে (${actorName} দ্বারা)।`,
        actorName
      );
    } catch (e) {
      console.warn('Error batch deleting members:', e);
      this.addDeletedMemberIds(memberIds);
      memberIds.forEach(id => this.removeCustomMember(id));
    }
  }

  // ----------------------------------------------------
  // 5. MEMBER HISTORIES (COLLECTIONS, DUES, PAYMENTS, RECEIPTS, SMS, LOGINS)
  // ----------------------------------------------------
  static getMemberDetailedHistories(member: MemberRecord) {
    const collections: MemberCollectionHistory[] = [
      { id: 'col_1', memberId: member.id, date: '2026-07-28', type: 'দৈনিক গ্যারেজ জমার চাঁদা', amount: 300, receiptNo: 'RCP-2026-881', collectorName: 'মোঃ জসিম (ক্যাশিয়ার)', status: 'paid' },
      { id: 'col_2', memberId: member.id, date: '2026-07-20', type: 'মাসিক সদস্য চাঁদা', amount: 1200, receiptNo: 'RCP-2026-750', collectorName: 'রফিকুল ইসলাম (ম্যানেজার)', status: 'paid' },
      { id: 'col_3', memberId: member.id, date: '2026-07-01', type: 'ব্যাজ ও কার্ড ফি', amount: 500, receiptNo: 'RCP-2026-610', collectorName: 'রফিকুল ইসলাম', status: 'paid' }
    ];

    const dues: MemberDueHistory[] = [
      { id: 'due_1', memberId: member.id, monthYear: 'আগস্ট ২০২৬', amount: 1200, dueDate: '2026-08-10', fineAmount: 0, status: 'due' },
      { id: 'due_2', memberId: member.id, monthYear: 'জুলাই ২০২৬', amount: 1200, dueDate: '2026-07-10', fineAmount: 0, status: 'paid' }
    ];

    const payments: MemberPaymentHistory[] = [
      { id: 'pay_1', memberId: member.id, paymentDate: '2026-07-20 11:30 AM', amount: 1200, paymentMethod: 'bkash', transactionId: 'TRX99882211', receiptNo: 'RCP-2026-750', receivedBy: 'অনলাইন বিকাশ পে' },
      { id: 'pay_2', memberId: member.id, paymentDate: '2026-07-01 10:15 AM', amount: 500, paymentMethod: 'cash', receiptNo: 'RCP-2026-610', receivedBy: 'ক্যাশ কাউন্টার-১' }
    ];

    const receipts: MemberReceiptRecord[] = [
      { id: 'rcp_1', receiptNo: 'RCP-2026-750', memberId: member.id, memberName: member.fullName, date: '2026-07-20', amount: 1200, purpose: 'মাসিক চাঁদা পরিশোধ (জুলাই)', printedBy: 'ম্যানেজার' },
      { id: 'rcp_2', receiptNo: 'RCP-2026-610', memberId: member.id, memberName: member.fullName, date: '2026-07-01', amount: 500, purpose: 'আইডি কার্ড ও প্লাস্টিক ব্যাজ ফি', printedBy: 'এডমিন' }
    ];

    const smsLogs: MemberSMSHistory[] = [
      { id: 'sms_1', memberId: member.id, phone: member.phone, message: `প্রিয় ${member.fullName}, আপনার ১২০০ টাকা পরিশোধ সফল হয়েছে। রসিদ: RCP-2026-750। আবাবিল টেক।`, sentTime: '2026-07-20 11:32 AM', status: 'delivered' },
      { id: 'sms_2', memberId: member.id, phone: member.phone, message: `সমিতির বার্ষিক সাধারণ সভার তারিখ আগামী ১৫ই আগস্ট নির্ধারিত হয়েছে। উপস্থিতি কাম্য।`, sentTime: '2026-07-15 04:00 PM', status: 'delivered' }
    ];

    const logins: MemberLoginHistory[] = [
      { id: 'log_1', memberId: member.id, loginTime: '2026-07-29 08:45 PM', ipAddress: '103.112.227.14', deviceInfo: 'Samsung Galaxy A54 (Android 14)', status: 'success' },
      { id: 'log_2', memberId: member.id, loginTime: '2026-07-20 11:28 AM', ipAddress: '103.112.227.18', deviceInfo: 'Mobile Chrome Browser', status: 'success' }
    ];

    return { collections, dues, payments, receipts, smsLogs, logins };
  }

  // ----------------------------------------------------
  // 6. EXCEL EXPORT & IMPORT
  // ----------------------------------------------------
  static exportToCSV(members: MemberRecord[]): void {
    const headers = [
      'Member ID', 'Membership No', 'Full Name', 'Father Name', 'Phone', 
      'NID', 'Address', 'District', 'Join Date', 'Membership Type', 'Status'
    ];

    const rows = members.map(m => [
      m.id,
      m.membershipNumber,
      `"${m.fullName}"`,
      `"${m.fatherName}"`,
      m.phone,
      m.nid,
      `"${m.address}"`,
      m.district,
      m.joinDate,
      m.membershipType,
      m.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Member_List_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static async importBulkMembers(
    importedRows: Array<Partial<MemberRecord>>, 
    tenantId: string = 'org_bismillah_001',
    actorName: string = 'Org Admin'
  ): Promise<number> {
    let successCount = 0;
    for (const row of importedRows) {
      if (row.fullName && row.phone) {
        await this.saveMember({ ...row, tenantId }, actorName);
        successCount++;
      }
    }
    return successCount;
  }

  // ----------------------------------------------------
  // 7. AUDIT LOGGING
  // ----------------------------------------------------
  static async logActivity(
    tenantId: string, 
    memberId: string, 
    memberName: string, 
    action: string, 
    details: string,
    actorName: string
  ): Promise<void> {
    try {
      const actId = `mact_${Date.now()}_${Math.floor(Math.random()*1000)}`;
      const logDoc: MemberActivityLog = {
        id: actId,
        tenantId,
        memberId,
        memberName,
        action,
        details,
        actorName,
        timestamp: new Date().toISOString()
      };
      await setDoc(doc(db, MEMBER_ACTIVITY_COLLECTION, actId), logDoc);
    } catch (e) {
      console.warn('Error saving member activity log:', e);
    }
  }

  static subscribeMemberActivityLogs(
    tenantId: string = 'org_bismillah_001',
    onSuccess: (logs: MemberActivityLog[]) => void
  ): () => void {
    try {
      const colRef = collection(db, MEMBER_ACTIVITY_COLLECTION);
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const logs = snapshot.docs
            .map(d => ({ id: d.id, ...d.data() } as MemberActivityLog))
            .filter(l => tenantId === 'all' || l.tenantId === tenantId)
            .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          onSuccess(logs);
        } else {
          onSuccess([]);
        }
      }, (err) => {
        console.warn('Member activity log listener error:', err);
      });
    } catch (e) {
      console.warn('Member activity log subscription failed:', e);
      return () => {};
    }
  }
}
