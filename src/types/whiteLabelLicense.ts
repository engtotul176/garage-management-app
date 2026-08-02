export type LicenseTier = 'STARTER' | 'PROFESSIONAL' | 'BUSINESS' | 'ENTERPRISE' | 'TRIAL' | 'LIFETIME';

export type LicenseStatus = 'ACTIVE' | 'PENDING_ACTIVATION' | 'SUSPENDED' | 'EXPIRED' | 'REVOKED';

export interface CustomerAccount {
  id: string;
  customerName: string;
  companyName: string;
  primaryContactEmail: string;
  contactPhone: string;
  orgId: string; // Provisions new tenant
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'TRIAL';
  tier: LicenseTier;
  createdAt: string;
  activatedAt?: string;
  expiresAt: string;
  maxMembersLimit: number;
  maxVehiclesLimit: number;
  maxAdminsLimit: number;
  customDomain?: string;
}

export interface LicenseKeyRecord {
  id: string;
  licenseKey: string; // e.g. ABA-2026-89FA-41B2-ENT
  tier: LicenseTier;
  assignedCustomerId?: string;
  assignedOrgId?: string;
  status: LicenseStatus;
  issuedAt: string;
  expiresAt: string;
  activationsCount: number;
  maxActivationsAllowed: number;
  notes?: string;
}

export interface WhiteLabelBrandingSettings {
  orgId: string;
  softwareName: string;
  companyName: string;
  logoUrl: string;
  faviconUrl: string;
  primaryBrandColor: string;
  secondaryBrandColor: string;
  customLoginMessage: string;
  customDashboardGreeting: string;
  customDomainMapping?: string;
  whiteLabelEnabled: boolean;
  updatedAt: string;
}

export interface LicenseAuditLog {
  id: string;
  timestamp: string;
  licenseKey: string;
  orgId: string;
  action: 'GENERATED' | 'ACTIVATED' | 'RENEWED' | 'SUSPENDED' | 'UPGRADED' | 'DOWNGRADED' | 'TRANSFERRED' | 'DELETED';
  performedBy: string;
  details: string;
}

export interface LicenseDashboardSummary {
  totalCustomersCount: number;
  activeLicensesCount: number;
  suspendedLicensesCount: number;
  expiredLicensesCount: number;
  trialCustomersCount: number;
  monthlyRevenueBdt: number;
  annualRevenueBdt: number;
  trialConversionRatePct: number;
}
