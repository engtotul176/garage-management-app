export type MemberStatus = 'active' | 'suspended' | 'deleted';
export type MembershipType = 'general' | 'vip' | 'lifetime' | 'associate' | 'honorary';

export interface MemberRecord {
  id: string; // Member ID (e.g. MEM-2026-001)
  membershipNumber: string; // Serial / Reg No (e.g. MS-8821)
  tenantId: string;
  tenantName: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  photoUrl: string;
  phone: string;
  altPhone?: string;
  email?: string;
  nid: string;
  birthDate?: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  occupation: string;
  address: string;
  district: string;
  upazila: string;
  village?: string;
  emergencyContact: string;
  joinDate: string;
  referencePerson?: string;
  membershipType: MembershipType;
  status: MemberStatus;
  remarks?: string;
  qrCodeData: string;
  barcodeData: string;
  totalPaidAmount?: number;
  totalDueAmount?: number;
  vehicleNo?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface MemberCollectionHistory {
  id: string;
  memberId: string;
  date: string;
  type: string;
  amount: number;
  receiptNo: string;
  collectorName: string;
  status: 'paid' | 'pending';
}

export interface MemberDueHistory {
  id: string;
  memberId: string;
  monthYear: string;
  amount: number;
  dueDate: string;
  fineAmount?: number;
  status: 'due' | 'paid' | 'overdue';
}

export interface MemberPaymentHistory {
  id: string;
  memberId: string;
  paymentDate: string;
  amount: number;
  paymentMethod: 'cash' | 'bkash' | 'nagad' | 'bank';
  transactionId?: string;
  receiptNo: string;
  receivedBy: string;
}

export interface MemberReceiptRecord {
  id: string;
  receiptNo: string;
  memberId: string;
  memberName: string;
  date: string;
  amount: number;
  purpose: string;
  printedBy: string;
}

export interface MemberSMSHistory {
  id: string;
  memberId: string;
  phone: string;
  message: string;
  sentTime: string;
  status: 'delivered' | 'failed' | 'pending';
}

export interface MemberLoginHistory {
  id: string;
  memberId: string;
  loginTime: string;
  ipAddress: string;
  deviceInfo: string;
  status: 'success' | 'failed';
}

export interface MemberActivityLog {
  id: string;
  tenantId: string;
  memberId: string;
  memberName: string;
  action: string;
  details: string;
  actorName: string;
  timestamp: string;
}

export interface MemberFilterOptions {
  searchTerm: string;
  status: string;
  membershipType: string;
  district: string;
  joinDateFrom: string;
  joinDateTo: string;
}
