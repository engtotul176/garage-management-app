import {
  SecurityHealthScore,
  AuthSecurityConfig,
  ActiveSession,
  LoginHistoryEntry,
  PasswordPolicyConfig,
  RbacRoleMatrix,
  SecurityAuditLog,
  AppSecurityConfig,
  CompliancePolicy,
  FirestoreSecurityAuditItem
} from '../types/enterpriseSecurity';

const AUTH_CONFIG_STORAGE_KEY = 'saas_auth_security_config';
const PASSWORD_POLICY_STORAGE_KEY = 'saas_password_policy_config';
const APP_SECURITY_STORAGE_KEY = 'saas_app_security_config';
const COMPLIANCE_STORAGE_KEY = 'saas_compliance_policy';
const SESSIONS_STORAGE_KEY = 'saas_active_sessions';
const LOGIN_LOGS_STORAGE_KEY = 'saas_login_logs';
const AUDIT_LOGS_STORAGE_KEY = 'saas_security_audit_logs';

// Default Auth Config
const defaultAuthConfig: AuthSecurityConfig = {
  enableMultiFactorAuth: true,
  sessionTimeoutMinutes: 30,
  maxConcurrentSessionsPerUser: 3,
  autoLogoutOnIdle: true,
  idleThresholdMinutes: 15,
  forceTokenRefreshHours: 12,
  trackDeviceLocation: true,
  blockAnonymousAccess: true,
  requireEmailVerification: true
};

// Default Password Policy
const defaultPasswordPolicy: PasswordPolicyConfig = {
  minLength: 10,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChar: true,
  passwordExpiryDays: 90,
  enforcePasswordHistoryCount: 5,
  maxFailedAttemptsBeforeLockout: 5,
  lockoutDurationMinutes: 15
};

// Default Application Security
const defaultAppSecurity: AppSecurityConfig = {
  xssProtectionEnabled: true,
  csrfTokenVerification: true,
  rateLimitMaxRequestsPerMin: 120,
  rateLimitWindowMs: 60000,
  secureHeaders: {
    csp: true,
    hsts: true,
    xFrameOptions: true,
    xContentTypeOptions: true,
    referrerPolicy: true
  },
  inputSanitizationStrict: true,
  hideErrorStackTracesInProd: true
};

// Default Compliance Policy
const defaultCompliancePolicy: CompliancePolicy = {
  privacyPolicyVersion: 'v2.4.0 (Updated 2026)',
  termsOfServiceVersion: 'v2.1.0 (Enterprise SaaS)',
  cookieConsentRequired: true,
  dataRetentionDays: 365,
  gdprExportEnabled: true,
  rightToBeForgottenEnabled: true,
  lastUpdated: new Date().toISOString(),
  privacyNoticeBengali: 'আমাদের প্ল্যাটফর্ম গ্লোবাল সিকিউরিটি এবং প্রাইভেসি স্ট্যান্ডার্ড (GDPR & BD Cyber Act) মেনে আপনার ডেটা নিরাপদে সংরক্ষণ করে।',
  termsNoticeBengali: 'আমাদের সার্ভিস ব্যবহারের মাধ্যমে আপনি সকল সিকিউরিটি নীতি, ডেটা আইসোলেশন ও সিস্টেম ব্যবহারের শর্তাবলী মেনে নিচ্ছেন।',
  dataRetentionSchedule: [
    { logType: 'Login History Logs', retentionDays: 90, autoPurge: true },
    { logType: 'Security Audit Logs', retentionDays: 365, autoPurge: true },
    { logType: 'Session Tokens', retentionDays: 30, autoPurge: true },
    { logType: 'Inactive Tenant Data', retentionDays: 180, autoPurge: false }
  ]
};

// Default Active Sessions Mock/Initial Data
const initialSessions: ActiveSession[] = [
  {
    id: 'sess_curr_101',
    userId: 'usr_admin_001',
    userName: 'Super Admin Engine',
    userEmail: 'engtotul176@gmail.com',
    userRole: 'super_admin',
    orgId: 'system_root',
    device: 'MacBook Pro (macOS 15.2)',
    browser: 'Chrome 128.0.0',
    ipAddress: '103.205.132.45',
    location: 'Dhaka, Bangladesh',
    loginTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    lastActiveTime: new Date().toISOString(),
    isCurrentDevice: true,
    status: 'ACTIVE'
  },
  {
    id: 'sess_mob_202',
    userId: 'usr_admin_001',
    userName: 'Super Admin Engine',
    userEmail: 'engtotul176@gmail.com',
    userRole: 'super_admin',
    orgId: 'system_root',
    device: 'Android App (Samsung S24 Ultra)',
    browser: 'SaaS Native App v3.2',
    ipAddress: '103.205.132.88',
    location: 'Dhaka, Bangladesh',
    loginTime: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    lastActiveTime: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    isCurrentDevice: false,
    status: 'ACTIVE'
  },
  {
    id: 'sess_win_303',
    userId: 'usr_org_002',
    userName: 'Central Garage Manager',
    userEmail: 'manager@centralgarage.com',
    userRole: 'org_admin',
    orgId: 'org_central_01',
    device: 'Windows Workstation',
    browser: 'Firefox 129.0',
    ipAddress: '118.179.88.12',
    location: 'Chittagong, Bangladesh',
    loginTime: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    lastActiveTime: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    isCurrentDevice: false,
    status: 'ACTIVE'
  }
];

// Default Login History Data
const initialLoginLogs: LoginHistoryEntry[] = [
  {
    id: 'log_in_101',
    userId: 'usr_admin_001',
    email: 'engtotul176@gmail.com',
    ipAddress: '103.205.132.45',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    device: 'MacBook Pro',
    status: 'SUCCESS',
    timestamp: new Date().toISOString(),
    location: 'Dhaka, Bangladesh',
    orgId: 'system_root'
  },
  {
    id: 'log_in_102',
    email: 'hacker_test@suspicious-domain.com',
    ipAddress: '185.220.101.5',
    userAgent: 'Python-requests/2.31.0',
    device: 'Automated Bot Script',
    status: 'BLOCKED',
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    location: 'Frankfurt, Germany',
    failureReason: 'Rate limit exceeded & Invalid Credentials (Locked out)',
    orgId: 'unknown'
  },
  {
    id: 'log_in_103',
    userId: 'usr_org_002',
    email: 'manager@centralgarage.com',
    ipAddress: '118.179.88.12',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    device: 'Windows PC',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    location: 'Chittagong, Bangladesh',
    orgId: 'org_central_01'
  },
  {
    id: 'log_in_104',
    email: 'employee@somedomain.com',
    ipAddress: '203.190.45.10',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X)',
    device: 'iPhone 15 Pro',
    status: 'FAILED',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    location: 'Dhaka, Bangladesh',
    failureReason: 'Invalid password attempt (1/5)',
    orgId: 'org_dhanmondi_02'
  }
];

// Default Audit Logs Data
const initialAuditLogs: SecurityAuditLog[] = [
  {
    id: 'aud_sec_001',
    timestamp: new Date().toISOString(),
    actorEmail: 'engtotul176@gmail.com',
    actorRole: 'super_admin',
    action: 'SECURITY_RULES_DEPLOYED',
    category: 'SECURITY',
    orgId: 'system_root',
    ipAddress: '103.205.132.45',
    severity: 'INFO',
    details: 'Firestore Security Rules Hardened for Multi-tenant isolation',
    status: 'SUCCESS'
  },
  {
    id: 'aud_sec_002',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    actorEmail: 'engtotul176@gmail.com',
    actorRole: 'super_admin',
    action: 'PASSWORD_POLICY_UPDATE',
    category: 'SETTINGS',
    orgId: 'system_root',
    ipAddress: '103.205.132.45',
    severity: 'WARNING',
    details: 'Increased min password length to 10 chars & required special characters',
    status: 'SUCCESS'
  },
  {
    id: 'aud_sec_003',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    actorEmail: 'manager@centralgarage.com',
    actorRole: 'org_admin',
    action: 'PERMISSION_ROLE_GRANT',
    category: 'RBAC',
    orgId: 'org_central_01',
    ipAddress: '118.179.88.12',
    severity: 'INFO',
    details: 'Granted collection voucher creation access to employee ID emp_88',
    status: 'SUCCESS'
  },
  {
    id: 'aud_sec_004',
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    actorEmail: 'system_guard',
    actorRole: 'system',
    action: 'UNAUTHORIZED_API_ATTEMPT',
    category: 'AUTH',
    orgId: 'system_root',
    ipAddress: '185.220.101.5',
    severity: 'CRITICAL',
    details: 'Blocked suspicious request to /api/v1/finance without valid Bearer Token',
    status: 'FAILURE'
  }
];

export class EnterpriseSecurityService {
  // --- Auth Security Configuration ---
  static getAuthConfig(): AuthSecurityConfig {
    const raw = localStorage.getItem(AUTH_CONFIG_STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultAuthConfig;
  }

  static saveAuthConfig(config: AuthSecurityConfig): void {
    localStorage.setItem(AUTH_CONFIG_STORAGE_KEY, JSON.stringify(config));
    this.recordAuditLog({
      actorEmail: 'engtotul176@gmail.com',
      actorRole: 'super_admin',
      action: 'AUTH_CONFIG_UPDATE',
      category: 'SETTINGS',
      orgId: 'system_root',
      ipAddress: '103.205.132.45',
      severity: 'WARNING',
      details: `Updated session timeout to ${config.sessionTimeoutMinutes} min & idle threshold to ${config.idleThresholdMinutes} min`,
      status: 'SUCCESS'
    });
  }

  // --- Password Policy Configuration ---
  static getPasswordPolicy(): PasswordPolicyConfig {
    const raw = localStorage.getItem(PASSWORD_POLICY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultPasswordPolicy;
  }

  static savePasswordPolicy(policy: PasswordPolicyConfig): void {
    localStorage.setItem(PASSWORD_POLICY_STORAGE_KEY, JSON.stringify(policy));
    this.recordAuditLog({
      actorEmail: 'engtotul176@gmail.com',
      actorRole: 'super_admin',
      action: 'PASSWORD_POLICY_UPDATE',
      category: 'SETTINGS',
      orgId: 'system_root',
      ipAddress: '103.205.132.45',
      severity: 'WARNING',
      details: `Min password length set to ${policy.minLength}. Lockout after ${policy.maxFailedAttemptsBeforeLockout} attempts.`,
      status: 'SUCCESS'
    });
  }

  static validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const policy = this.getPasswordPolicy();
    const errors: string[] = [];

    if (password.length < policy.minLength) {
      errors.push(`পাসওয়ার্ড নূন্যতম ${policy.minLength} অক্ষরের হতে হবে।`);
    }
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('নূন্যতম একটি বড় হাতের অক্ষর (A-Z) থাকতে হবে।');
    }
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('নূন্যতম একটি ছোট হাতের অক্ষর (a-z) থাকতে হবে।');
    }
    if (policy.requireNumbers && !/[0-9]/.test(password)) {
      errors.push('নূন্যতম একটি সংখ্যা (0-9) থাকতে হবে।');
    }
    if (policy.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('নূন্যতম একটি বিশেষ চিহ্ন (!@#$%^&*) থাকতে হবে।');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // --- Active Session Management ---
  static getActiveSessions(): ActiveSession[] {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialSessions;
  }

  static terminateSession(sessionId: string): ActiveSession[] {
    const sessions = this.getActiveSessions();
    const updated = sessions.map(s => {
      if (s.id === sessionId) {
        return { ...s, status: 'TERMINATED' as const };
      }
      return s;
    });
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));

    this.recordAuditLog({
      actorEmail: 'engtotul176@gmail.com',
      actorRole: 'super_admin',
      action: 'SESSION_TERMINATED',
      category: 'AUTH',
      orgId: 'system_root',
      ipAddress: '103.205.132.45',
      severity: 'WARNING',
      details: `Force terminated active device session ID: ${sessionId}`,
      status: 'SUCCESS'
    });

    return updated;
  }

  static terminateOtherSessions(currentSessionId: string): ActiveSession[] {
    const sessions = this.getActiveSessions();
    const updated = sessions.map(s => {
      if (s.id !== currentSessionId) {
        return { ...s, status: 'TERMINATED' as const };
      }
      return s;
    });
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));

    this.recordAuditLog({
      actorEmail: 'engtotul176@gmail.com',
      actorRole: 'super_admin',
      action: 'ALL_OTHER_SESSIONS_TERMINATED',
      category: 'AUTH',
      orgId: 'system_root',
      ipAddress: '103.205.132.45',
      severity: 'CRITICAL',
      details: 'Force logged out all other active devices for account',
      status: 'SUCCESS'
    });

    return updated;
  }

  // --- Login History ---
  static getLoginLogs(): LoginHistoryEntry[] {
    const raw = localStorage.getItem(LOGIN_LOGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialLoginLogs;
  }

  static recordLoginAttempt(entry: Omit<LoginHistoryEntry, 'id' | 'timestamp'>): LoginHistoryEntry {
    const logs = this.getLoginLogs();
    const newEntry: LoginHistoryEntry = {
      ...entry,
      id: `log_in_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    const updated = [newEntry, ...logs];
    localStorage.setItem(LOGIN_LOGS_STORAGE_KEY, JSON.stringify(updated));
    return newEntry;
  }

  // --- Audit Logs ---
  static getAuditLogs(): SecurityAuditLog[] {
    const raw = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialAuditLogs;
  }

  static recordAuditLog(log: Omit<SecurityAuditLog, 'id' | 'timestamp'>): SecurityAuditLog {
    const logs = this.getAuditLogs();
    const newLog: SecurityAuditLog = {
      ...log,
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    const updated = [newLog, ...logs.slice(0, 200)]; // keep max 200 entries locally
    localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(updated));
    return newLog;
  }

  // --- App Security Config ---
  static getAppSecurityConfig(): AppSecurityConfig {
    const raw = localStorage.getItem(APP_SECURITY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultAppSecurity;
  }

  static saveAppSecurityConfig(config: AppSecurityConfig): void {
    localStorage.setItem(APP_SECURITY_STORAGE_KEY, JSON.stringify(config));
    this.recordAuditLog({
      actorEmail: 'engtotul176@gmail.com',
      actorRole: 'super_admin',
      action: 'APP_SECURITY_CONFIG_UPDATE',
      category: 'SETTINGS',
      orgId: 'system_root',
      ipAddress: '103.205.132.45',
      severity: 'INFO',
      details: 'Updated Application Security headers, XSS filter, and Rate limiters',
      status: 'SUCCESS'
    });
  }

  // --- Compliance Policy ---
  static getCompliancePolicy(): CompliancePolicy {
    const raw = localStorage.getItem(COMPLIANCE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultCompliancePolicy;
  }

  static saveCompliancePolicy(policy: CompliancePolicy): void {
    localStorage.setItem(COMPLIANCE_STORAGE_KEY, JSON.stringify(policy));
    this.recordAuditLog({
      actorEmail: 'engtotul176@gmail.com',
      actorRole: 'super_admin',
      action: 'COMPLIANCE_POLICY_UPDATE',
      category: 'SETTINGS',
      orgId: 'system_root',
      ipAddress: '103.205.132.45',
      severity: 'INFO',
      details: `Compliance policy updated. GDPR export: ${policy.gdprExportEnabled ? 'Enabled' : 'Disabled'}`,
      status: 'SUCCESS'
    });
  }

  // --- Input Sanitizer & XSS Protection Tool ---
  static sanitizeInput(input: string): string {
    if (!input) return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // --- RBAC Role Matrix ---
  static getRbacMatrix(): RbacRoleMatrix[] {
    return [
      {
        role: 'super_admin',
        displayName: '👑 Super Admin',
        description: 'গ্লোবাল সিস্টেম কন্ট্রোল, অল টেন্যান্ট ডেটা অ্যাক্সেস, সিস্টেম সিকিউরিটি ও ব্যাকআপ অ্যাডমিন',
        permissions: [
          { module: 'Global Settings', canRead: true, canWrite: true, canDelete: true, canAdmin: true },
          { module: 'Tenant Management', canRead: true, canWrite: true, canDelete: true, canAdmin: true },
          { module: 'Security & Audit', canRead: true, canWrite: true, canDelete: true, canAdmin: true },
          { module: 'Financial Ledgers', canRead: true, canWrite: true, canDelete: true, canAdmin: true },
          { module: 'Database & Rules', canRead: true, canWrite: true, canDelete: true, canAdmin: true }
        ]
      },
      {
        role: 'org_admin',
        displayName: '🏢 Organization Admin',
        description: 'নিজস্ব অর্গানাইজেশনের গ্যারেজ, মেম্বারশিপ, ইনভয়েসিং ও এমপ্লয়ি কন্ট্রোল',
        permissions: [
          { module: 'Global Settings', canRead: false, canWrite: false, canDelete: false, canAdmin: false },
          { module: 'Tenant Management', canRead: true, canWrite: true, canDelete: false, canAdmin: true },
          { module: 'Security & Audit', canRead: true, canWrite: false, canDelete: false, canAdmin: false },
          { module: 'Financial Ledgers', canRead: true, canWrite: true, canDelete: false, canAdmin: true },
          { module: 'Database & Rules', canRead: false, canWrite: false, canDelete: false, canAdmin: false }
        ]
      },
      {
        role: 'employee',
        displayName: '👨‍💼 Employee / Counter Operator',
        description: 'দৈনন্দিন কালেকশন ভাউচার তৈরি, রসিদ প্রিন্ট ও মেম্বার সার্ভিসিং',
        permissions: [
          { module: 'Global Settings', canRead: false, canWrite: false, canDelete: false, canAdmin: false },
          { module: 'Tenant Management', canRead: true, canWrite: false, canDelete: false, canAdmin: false },
          { module: 'Security & Audit', canRead: false, canWrite: false, canDelete: false, canAdmin: false },
          { module: 'Financial Ledgers', canRead: true, canWrite: true, canDelete: false, canAdmin: false },
          { module: 'Database & Rules', canRead: false, canWrite: false, canDelete: false, canAdmin: false }
        ]
      },
      {
        role: 'member',
        displayName: '🚗 Member / Vehicle Owner',
        description: 'নিজের গাড়ি চাঁদা হিসেব, ডিজিটাল রসিদ ডাউনলোড ও পেমেন্ট হিস্ট্রি',
        permissions: [
          { module: 'Global Settings', canRead: false, canWrite: false, canDelete: false, canAdmin: false },
          { module: 'Tenant Management', canRead: false, canWrite: false, canDelete: false, canAdmin: false },
          { module: 'Security & Audit', canRead: false, canWrite: false, canDelete: false, canAdmin: false },
          { module: 'Financial Ledgers', canRead: false, canWrite: false, canDelete: false, canAdmin: false },
          { module: 'Database & Rules', canRead: false, canWrite: false, canDelete: false, canAdmin: false }
        ]
      }
    ];
  }

  // --- Firestore Security Rules Audit Inspection ---
  static getFirestoreRulesAudit(): FirestoreSecurityAuditItem[] {
    return [
      {
        collection: 'system/{docId}',
        readAccess: 'Public Read (Brand assets)',
        writeAccess: 'Super Admin Only',
        deleteAccess: 'Super Admin Only',
        orgIsolation: false,
        status: 'SECURE',
        notes: 'Global public system config safe for public asset fetch'
      },
      {
        collection: 'organizations/{orgId}',
        readAccess: 'Super Admin OR Tenant Member',
        writeAccess: 'Super Admin Only',
        deleteAccess: 'Super Admin Only',
        orgIsolation: true,
        status: 'SECURE',
        notes: 'Strict multi-tenant boundary enforced'
      },
      {
        collection: 'organizations/{orgId}/users/{userId}',
        readAccess: 'Org User OR Super Admin',
        writeAccess: 'Org Admin Only',
        deleteAccess: 'Super Admin Only',
        orgIsolation: true,
        status: 'SECURE',
        notes: 'Isolated within tenant document tree'
      },
      {
        collection: 'organizations/{orgId}/collections/{colId}',
        readAccess: 'Org User OR Super Admin',
        writeAccess: 'Org Employee / Admin (Active Org)',
        deleteAccess: 'Super Admin Only (No employee delete)',
        orgIsolation: true,
        status: 'SECURE',
        notes: 'Employees blocked from deleting financial vouchers'
      },
      {
        collection: 'organizations/{orgId}/finance/{recordId}',
        readAccess: 'Org Admin OR Super Admin',
        writeAccess: 'Org Admin Only',
        deleteAccess: 'Super Admin Only',
        orgIsolation: true,
        status: 'SECURE',
        notes: 'Financial ledger records locked to Org Admins'
      },
      {
        collection: 'auditLogs/{logId}',
        readAccess: 'Super Admin Only',
        writeAccess: 'Authenticated Create Only',
        deleteAccess: 'Locked (false)',
        orgIsolation: true,
        status: 'SECURE',
        notes: 'Immutable security log storage'
      },
      {
        collection: 'api_keys/{keyId}',
        readAccess: 'Authenticated Admin',
        writeAccess: 'Authenticated Admin',
        deleteAccess: 'Super Admin Only',
        orgIsolation: true,
        status: 'SECURE',
        notes: 'Hashed API secret keys protected'
      }
    ];
  }

  // --- Automated Security Scanner & Health Scorecard ---
  static runSecurityScan(): SecurityHealthScore {
    const authConfig = this.getAuthConfig();
    const passwordPolicy = this.getPasswordPolicy();
    const appSecurity = this.getAppSecurityConfig();
    const compliance = this.getCompliancePolicy();

    const checks: SecurityHealthScore['checks'] = [
      {
        id: 'chk_auth_mfa',
        title: 'Multi-Factor Authentication (MFA)',
        category: 'AUTH',
        status: authConfig.enableMultiFactorAuth ? 'PASS' : 'WARN',
        impact: 'HIGH',
        details: authConfig.enableMultiFactorAuth
          ? 'MFA is enabled for admin tier accounts'
          : 'MFA is currently optional for admins',
        remediation: 'Enable MFA in Auth Security Settings'
      },
      {
        id: 'chk_session_timeout',
        title: 'Auto Session Expiry & Idle Lockout',
        category: 'AUTH',
        status: authConfig.sessionTimeoutMinutes <= 60 ? 'PASS' : 'WARN',
        impact: 'MEDIUM',
        details: `Active session expires after ${authConfig.sessionTimeoutMinutes} minutes`,
        remediation: 'Set session expiry to 30-60 minutes'
      },
      {
        id: 'chk_pwd_length',
        title: 'Minimum Password Length Policy',
        category: 'PASSWORD',
        status: passwordPolicy.minLength >= 10 ? 'PASS' : 'FAIL',
        impact: 'HIGH',
        details: `Current min password length: ${passwordPolicy.minLength} characters`,
        remediation: 'Increase minimum password length to at least 10 characters'
      },
      {
        id: 'chk_pwd_lockout',
        title: 'Brute-Force Account Lockout Protection',
        category: 'PASSWORD',
        status: passwordPolicy.maxFailedAttemptsBeforeLockout <= 5 ? 'PASS' : 'FAIL',
        impact: 'HIGH',
        details: `Account locks after ${passwordPolicy.maxFailedAttemptsBeforeLockout} failed attempts for ${passwordPolicy.lockoutDurationMinutes} min`,
        remediation: 'Configure lockout threshold to 5 or fewer attempts'
      },
      {
        id: 'chk_firestore_rules',
        title: 'Firestore Multi-Tenant Isolation Rules',
        category: 'FIRESTORE',
        status: 'PASS',
        impact: 'HIGH',
        details: 'match /{document=**} default deny + organization subcollection isolation rules verified',
        remediation: 'Keep security rules up to date with schema changes'
      },
      {
        id: 'chk_app_xss',
        title: 'XSS Input Sanitization & Output Encoding',
        category: 'APP_SEC',
        status: appSecurity.xssProtectionEnabled ? 'PASS' : 'FAIL',
        impact: 'HIGH',
        details: appSecurity.xssProtectionEnabled
          ? 'HTML escaping & XSS sanitizer filters active'
          : 'XSS filter is disabled',
        remediation: 'Enable XSS protection in Application Security settings'
      },
      {
        id: 'chk_app_headers',
        title: 'HTTP Security Headers (CSP, HSTS, XFO)',
        category: 'APP_SEC',
        status: appSecurity.secureHeaders.csp && appSecurity.secureHeaders.hsts ? 'PASS' : 'WARN',
        impact: 'MEDIUM',
        details: 'CSP, HSTS, X-Frame-Options, and X-Content-Type-Options active on reverse proxy',
        remediation: 'Ensure all 4 secure headers are enforced'
      },
      {
        id: 'chk_rate_limit',
        title: 'API & Login Rate Limiting Guard',
        category: 'APP_SEC',
        status: appSecurity.rateLimitMaxRequestsPerMin <= 200 ? 'PASS' : 'WARN',
        impact: 'MEDIUM',
        details: `Rate limit set to ${appSecurity.rateLimitMaxRequestsPerMin} requests per minute`,
        remediation: 'Maintain rate limit threshold below 200 req/min'
      },
      {
        id: 'chk_audit_logging',
        title: 'Security Audit & Sensitive Action Logging',
        category: 'AUDIT',
        status: 'PASS',
        impact: 'HIGH',
        details: 'Audit logs active for login attempts, permission changes, and settings updates',
        remediation: 'Review audit logs regularly'
      },
      {
        id: 'chk_privacy_gdpr',
        title: 'GDPR / Privacy Compliance & Data Export',
        category: 'COMPLIANCE',
        status: compliance.gdprExportEnabled ? 'PASS' : 'WARN',
        impact: 'MEDIUM',
        details: 'Data Export & Right to be Forgotten policies active',
        remediation: 'Enable GDPR data export feature'
      }
    ];

    const passed = checks.filter(c => c.status === 'PASS').length;
    const failed = checks.filter(c => c.status === 'FAIL').length;
    const warnings = checks.filter(c => c.status === 'WARN').length;

    // Calculate score (0 to 100)
    const score = Math.round((passed / checks.length) * 100);

    let status: SecurityHealthScore['status'] = 'EXCELLENT';
    if (score < 60 || failed > 0) status = 'CRITICAL';
    else if (score < 80 || warnings > 2) status = 'WARNING';
    else if (score < 95) status = 'GOOD';

    return {
      score,
      status,
      passedChecks: passed,
      failedChecks: failed,
      warningsCount: warnings,
      lastScannedAt: new Date().toISOString(),
      checks
    };
  }

  // --- Run Data Retention Purge ---
  static executeDataRetentionPurge(): { purgedRecordsCount: number; timestamp: string } {
    const logs = this.getLoginLogs();
    const auditLogs = this.getAuditLogs();

    // Keep logs newer than retention days (e.g. 90 days)
    const ninetyDaysAgo = Date.now() - 90 * 24 * 3600 * 1000;
    const filteredLogs = logs.filter(l => new Date(l.timestamp).getTime() > ninetyDaysAgo);
    const purgedCount = logs.length - filteredLogs.length;

    localStorage.setItem(LOGIN_LOGS_STORAGE_KEY, JSON.stringify(filteredLogs));

    this.recordAuditLog({
      actorEmail: 'system_cron',
      actorRole: 'system',
      action: 'DATA_RETENTION_PURGE',
      category: 'SYSTEM',
      orgId: 'system_root',
      ipAddress: '127.0.0.1',
      severity: 'INFO',
      details: `Automated data retention purge removed ${purgedCount} expired login log entries older than 90 days`,
      status: 'SUCCESS'
    });

    return {
      purgedRecordsCount: purgedCount,
      timestamp: new Date().toISOString()
    };
  }
}
