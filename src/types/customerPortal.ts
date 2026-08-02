export interface MemberPortalProfile {
  id: string;
  tenantId: string;
  tenantName: string;
  memberCode: string;
  fullName: string;
  mobile: string;
  email: string;
  role: 'MEMBER' | 'ORG_ADMIN' | 'DRIVER' | 'OWNER';
  designation?: string;
  joiningDate: string;
  vehicleNumber?: string;
  photoUrl?: string;
  address?: string;
  emergencyContact?: string;
  totalCollectionsPaid: number;
  totalCurrentDue: number;
  membershipStatus: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  qrCodeData: string;
  lastLoginAt: string;
}

export interface CollectionHistoryRecord {
  id: string;
  receiptNumber: string;
  tenantId: string;
  collectionType: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  collectedBy: string;
  status: 'PAID' | 'PENDING' | 'CANCELLED';
  downloadUrl?: string;
}

export interface MemberSmsRecord {
  id: string;
  mobile: string;
  message: string;
  smsType: 'PAYMENT_RECEIPT' | 'DUE_ALERT' | 'ANNOUNCEMENT' | 'SECURITY_OTP';
  status: 'DELIVERED' | 'SENT' | 'FAILED';
  sentAt: string;
}

export interface ProfileUpdateLog {
  id: string;
  memberId: string;
  memberName: string;
  tenantId: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  updatedAt: string;
  updatedBy: string;
}

export interface CustomerSessionLog {
  id: string;
  memberId: string;
  memberEmail: string;
  tenantId: string;
  ipAddress: string;
  deviceInfo: string;
  loginAt: string;
  status: 'ACTIVE' | 'EXPIRED';
}
