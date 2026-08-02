export type AndroidUserRole = 
  | 'SUPER_ADMIN' 
  | 'ORG_ADMIN' 
  | 'MANAGER' 
  | 'CASH_COLLECTOR' 
  | 'ACCOUNTANT' 
  | 'EMPLOYEE' 
  | 'MEMBER';

export interface AndroidSession {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: AndroidUserRole;
  tenantId: string;
  tenantName: string;
  jwtToken: string;
  biometricEnabled: boolean;
  rememberMe: boolean;
  isLoggedIn: boolean;
  deviceId: string;
  appVersion: string;
}

export interface OfflineCollectionQueueItem {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  paymentMethod: string;
  collectedBy: string;
  timestamp: string;
  synced: boolean;
}

export interface AndroidNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'PAYMENT' | 'SYSTEM' | 'SECURITY' | 'DUE_ALERT';
}
