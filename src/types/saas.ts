export type UserRole = 'super_admin' | 'org_admin' | 'manager' | 'employee' | 'member' | 'guest';

export type OrgStatus = 'active' | 'trial' | 'suspended' | 'expired';

export type OrgCategory = 
  | 'Auto Garage'
  | 'Auto Stand'
  | 'Rickshaw Garage'
  | 'CNG Garage'
  | 'Truck Garage'
  | 'Bus Counter'
  | 'Samity'
  | 'Society'
  | 'Association'
  | 'Market Committee'
  | 'Mosque Committee'
  | 'Hostel'
  | 'School'
  | 'Club'
  | 'Member Based Organization';

export interface SoftwareOwnerInfo {
  softwareName: string;
  softwareOwner: string;
  founderName: string;
  founderTitle: string;
  copyrightYear: string;
  supportPhone: string;
  supportEmail: string;
  website: string;
}

export interface BrandingConfig {
  softwareName: string;
  companyName: string;
  orgName: string;
  logoUrl: string;
  faviconUrl: string;
  loginLogoUrl?: string;
  dashboardLogoUrl?: string;
  loaderLogoUrl?: string;
  loginBgUrl?: string;
  dashboardBgUrl?: string;
  browserTitle?: string;
  footerText?: string;
  copyrightText?: string;
  softwareVersion?: string;
  themeColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  sidebarColor?: string;
  buttonColor?: string;
  loginBgColor?: string;
  contactNumber?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  domain?: string;
  showWhiteLabelPoweredBy?: boolean;
  whiteLabelText?: string;
  updatedAt?: string;
}

export interface PackageTier {
  id: string;
  packageCode: string;
  nameBangla: string;
  nameEnglish: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  trialDays: number;
  maxEmployees: number;
  maxMembers: number;
  maxBranches: number;
  maxStorageMB: number;
  maxDailyCollection: number;
  status: 'active' | 'inactive';
  features: string[]; // List of feature keys enabled
  isPopular?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'paused' | 'cancelled';

export interface SubscriptionRecord {
  id: string;
  tenantId: string;
  tenantName: string;
  packageId: string;
  packageName: string;
  billingCycle: 'monthly' | 'yearly';
  status: SubscriptionStatus;
  amount: number;
  startDate: string;
  endDate: string;
  trialEndsAt?: string;
  autoRenew: boolean;
  pausedAt?: string;
  cancelledAt?: string;
  notes?: string;
  updatedAt?: string;
}

export interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  packageId: string;
  packageName: string;
  amount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Bank' | 'Cash' | 'Card';
  paymentDate: string;
  renewedUntil: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  renewedBy: string; // Super Admin or Org Admin user
  transactionId?: string;
  receiptUrl?: string;
  createdAt?: string;
}

export interface FeatureDefinition {
  key: string;
  nameBangla: string;
  nameEnglish: string;
  category: 'core' | 'reports' | 'integrations' | 'advanced';
  description: string;
}

export interface OrganizationTenant {
  id: string;
  orgCode?: string;
  orgName: string;
  orgCategory: OrgCategory;
  ownerName?: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
  primaryColor: string;
  status: OrgStatus;
  packageId: string;
  subscriptionStart: string;
  subscriptionEnd: string;
  trialDaysRemaining?: number;
  timeZone?: string;
  createdAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  memberCount: number;
  employeeCount: number;
  monthlyRevenueEstimate: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  role: UserRole;
  tenantId: string;
  tenantName: string;
  avatarUrl?: string;
  isActive: boolean;
}

export interface MemberRecord {
  id: string;
  tenantId: string;
  memberName: string;
  phone: string;
  vehicleNo: string;
  vehicleType: string;
  address: string;
  monthlyFee: number;
  balance: number;
  dueAmount: number;
  qrCode: string;
  status: 'active' | 'inactive';
  joinedDate: string;
}

export interface DailyCollectionRecord {
  id: string;
  tenantId: string;
  memberId: string;
  memberName: string;
  vehicleNo: string;
  amount: number;
  paymentMethod: 'ক্যাশ' | 'বিকাশ' | 'নগদ' | 'ব্যাংক';
  receiptNo: string;
  category: 'চার্জিং ফি' | 'নাইট গার্ড ফি' | 'ওয়াশিং' | 'বকেয়া আদায়' | 'চাঁদা';
  collectorName: string;
  collectorUid: string;
  timestamp: string;
}

export interface PermissionItem {
  featureKey: string;
  featureNameBangla: string;
  superAdmin: boolean;
  orgAdmin: boolean;
  employee: boolean;
  member: boolean;
  description: string;
}

export interface RoadmapStep {
  stepNumber: number;
  titleBangla: string;
  descriptionBangla: string;
  deliverables: string[];
  status: 'completed' | 'in_progress' | 'pending';
  requiresApproval: boolean;
}
