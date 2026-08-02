export interface SecurityHealthScore {
  score: number;
  status: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
  passedChecks: number;
  failedChecks: number;
  warningsCount: number;
  lastScannedAt: string;
  checks: {
    id: string;
    title: string;
    category: 'AUTH' | 'PASSWORD' | 'RBAC' | 'FIRESTORE' | 'APP_SEC' | 'AUDIT' | 'COMPLIANCE';
    status: 'PASS' | 'FAIL' | 'WARN';
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    details: string;
    remediation?: string;
  }[];
}

export interface AuthSecurityConfig {
  enableMultiFactorAuth: boolean;
  sessionTimeoutMinutes: number;
  maxConcurrentSessionsPerUser: number;
  autoLogoutOnIdle: boolean;
  idleThresholdMinutes: number;
  forceTokenRefreshHours: number;
  trackDeviceLocation: boolean;
  blockAnonymousAccess: boolean;
  requireEmailVerification: boolean;
}

export interface ActiveSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  orgId: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  loginTime: string;
  lastActiveTime: string;
  isCurrentDevice: boolean;
  status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
}

export interface LoginHistoryEntry {
  id: string;
  userId?: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  device: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  timestamp: string;
  location: string;
  failureReason?: string;
  orgId?: string;
}

export interface PasswordPolicyConfig {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChar: boolean;
  passwordExpiryDays: number; // 0 for disabled
  enforcePasswordHistoryCount: number; // e.g. last 5
  maxFailedAttemptsBeforeLockout: number;
  lockoutDurationMinutes: number;
}

export interface RbacRoleMatrix {
  role: 'super_admin' | 'org_admin' | 'employee' | 'member';
  displayName: string;
  description: string;
  permissions: {
    module: string;
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
    canAdmin: boolean;
  }[];
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  category: 'AUTH' | 'RBAC' | 'SETTINGS' | 'DATA_EXPORT' | 'SYSTEM' | 'SECURITY';
  orgId: string;
  ipAddress: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  details: string;
  status: 'SUCCESS' | 'FAILURE';
}

export interface AppSecurityConfig {
  xssProtectionEnabled: boolean;
  csrfTokenVerification: boolean;
  rateLimitMaxRequestsPerMin: number;
  rateLimitWindowMs: number;
  secureHeaders: {
    csp: boolean;
    hsts: boolean;
    xFrameOptions: boolean;
    xContentTypeOptions: boolean;
    referrerPolicy: boolean;
  };
  inputSanitizationStrict: boolean;
  hideErrorStackTracesInProd: boolean;
}

export interface CompliancePolicy {
  privacyPolicyVersion: string;
  termsOfServiceVersion: string;
  cookieConsentRequired: boolean;
  dataRetentionDays: number;
  gdprExportEnabled: boolean;
  rightToBeForgottenEnabled: boolean;
  lastUpdated: string;
  privacyNoticeBengali: string;
  termsNoticeBengali: string;
  dataRetentionSchedule: {
    logType: string;
    retentionDays: number;
    autoPurge: boolean;
  }[];
}

export interface FirestoreSecurityAuditItem {
  collection: string;
  readAccess: string;
  writeAccess: string;
  deleteAccess: string;
  orgIsolation: boolean;
  status: 'SECURE' | 'PARTIAL' | 'EXPOSED';
  notes: string;
}
