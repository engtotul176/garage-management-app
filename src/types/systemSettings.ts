export interface GeneralSettings {
  softwareName: string;
  organizationName: string;
  companyName: string;
  systemVersion: string;
  timeZone: string;
  dateFormat: string;
  currency: string;
  language: string;
  country: string;
}

export interface BrandingSettings {
  logoUrl: string;
  faviconUrl: string;
  loginLogoUrl: string;
  dashboardLogoUrl: string;
  footerText: string;
  copyrightText: string;
  primaryThemeColor: string;
  defaultMode: 'DARK' | 'LIGHT' | 'SYSTEM';
}

export interface EmailSmtpSettings {
  enabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  senderEmail: string;
  senderName: string;
  useTls: boolean;
}

export interface SmsGatewaySettings {
  enabled: boolean;
  provider: 'SSL_WIRELESS' | 'BULKSMS_BD' | 'MAMURBET' | 'TWILIO';
  apiKey: string;
  senderId: string;
  apiEndpoint: string;
}

export interface PaymentGatewayConfig {
  provider: 'BKASH' | 'NAGAD' | 'ROCKET' | 'SSLCOMMERZ';
  enabled: boolean;
  merchantId: string;
  appKey: string;
  appSecret: string;
  isSandbox: boolean;
}

export interface NotificationSettings {
  pushNotificationsEnabled: boolean;
  smsAlertsEnabled: boolean;
  emailAlertsEnabled: boolean;
  systemInAppAlertsEnabled: boolean;
}

export interface SecuritySettings {
  minPasswordLength: number;
  requireSpecialChar: boolean;
  requireNumber: boolean;
  twoFactorAuthReady: boolean;
  sessionTimeoutMinutes: number;
  maxLoginAttemptLimit: number;
  ipRestrictionEnabled: boolean;
  allowedIpList: string[];
}

export interface MaintenanceSettings {
  maintenanceModeActive: boolean;
  maintenanceMessage: string;
  lastCacheClearedAt: string;
  lastDatabaseOptimizedAt: string;
  serverStatus: 'ONLINE' | 'DEGRADED' | 'MAINTENANCE';
  firebaseStatus: 'CONNECTED' | 'DISCONNECTED';
}

export interface LicenseSettings {
  licenseKey: string;
  licenseStatus: 'ACTIVE' | 'EXPIRED' | 'TRIAL' | 'REVOKED';
  activatedAt: string;
  expiryDate: string;
  whiteLabelEnabled: boolean;
  maxTenantsAllowed: number;
  currentTenantsCount: number;
}

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  logType: 'SYSTEM' | 'ERROR' | 'ACTIVITY' | 'AUDIT';
  actor: string;
  action: string;
  details: string;
  ipAddress: string;
}

export interface GlobalSystemConfig {
  general: GeneralSettings;
  branding: BrandingSettings;
  email: EmailSmtpSettings;
  sms: SmsGatewaySettings;
  payments: PaymentGatewayConfig[];
  notifications: NotificationSettings;
  security: SecuritySettings;
  maintenance: MaintenanceSettings;
  license: LicenseSettings;
}
