import {
  GlobalSystemConfig,
  SystemLogEntry,
  PaymentGatewayConfig
} from '../types/systemSettings';

export const DEFAULT_GLOBAL_CONFIG: GlobalSystemConfig = {
  general: {
    softwareName: 'Ababil Enterprise Cloud SaaS',
    organizationName: 'Ababil Technologies Limited',
    companyName: 'Ababil Group Bangladesh',
    systemVersion: 'v4.8.2-Enterprise',
    timeZone: 'Asia/Dhaka (GMT+6)',
    dateFormat: 'DD/MM/YYYY',
    currency: 'BDT (৳)',
    language: 'bn-BD (বাংলা)',
    country: 'Bangladesh'
  },
  branding: {
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    faviconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=32',
    loginLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300',
    dashboardLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
    footerText: 'Ababil Enterprise Cloud SaaS Platform | Powered by AI Engine & Gemini 2.5',
    copyrightText: '© 2026 Ababil Technologies Ltd. All Rights Reserved.',
    primaryThemeColor: '#4f46e5',
    defaultMode: 'DARK'
  },
  email: {
    enabled: true,
    smtpHost: 'smtp.mailgun.org',
    smtpPort: 587,
    smtpUser: 'postmaster@ababil.app',
    smtpPass: '••••••••••••••••',
    senderEmail: 'noreply@ababil.app',
    senderName: 'Ababil SaaS System',
    useTls: true
  },
  sms: {
    enabled: true,
    provider: 'SSL_WIRELESS',
    apiKey: 'SSLW-LIVE-9948123-KEY',
    senderId: 'ABABIL_SMS',
    apiEndpoint: 'https://smsplus.sslwireless.com/api/v3/send-sms'
  },
  payments: [
    {
      provider: 'BKASH',
      enabled: true,
      merchantId: '01711002233',
      appKey: 'bkash_app_key_991823',
      appSecret: '••••••••••••••••',
      isSandbox: false
    },
    {
      provider: 'NAGAD',
      enabled: true,
      merchantId: '68291002',
      appKey: 'nagad_app_key_44312',
      appSecret: '••••••••••••••••',
      isSandbox: false
    },
    {
      provider: 'ROCKET',
      enabled: true,
      merchantId: '018223344551',
      appKey: 'rocket_key_11029',
      appSecret: '••••••••••••••••',
      isSandbox: false
    },
    {
      provider: 'SSLCOMMERZ',
      enabled: true,
      merchantId: 'ababil_live_store',
      appKey: 'ababil_store_pass',
      appSecret: '••••••••••••••••',
      isSandbox: false
    }
  ],
  notifications: {
    pushNotificationsEnabled: true,
    smsAlertsEnabled: true,
    emailAlertsEnabled: true,
    systemInAppAlertsEnabled: true
  },
  security: {
    minPasswordLength: 8,
    requireSpecialChar: true,
    requireNumber: true,
    twoFactorAuthReady: true,
    sessionTimeoutMinutes: 30,
    maxLoginAttemptLimit: 5,
    ipRestrictionEnabled: false,
    allowedIpList: ['103.112.44.1', '180.211.201.10']
  },
  maintenance: {
    maintenanceModeActive: false,
    maintenanceMessage: 'সিস্টেম মেইনটেন্যান্স এর কাজ চলছে। অনুগ্রহ করে ১০ মিনিট পর চেষ্টা করুন।',
    lastCacheClearedAt: '31/07/2026, 04:30 AM',
    lastDatabaseOptimizedAt: '30/07/2026, 11:00 PM',
    serverStatus: 'ONLINE',
    firebaseStatus: 'CONNECTED'
  },
  license: {
    licenseKey: 'ABABIL-ENTERPRISE-PRO-2026-9918-X77',
    licenseStatus: 'ACTIVE',
    activatedAt: '01/01/2026',
    expiryDate: '31/12/2028',
    whiteLabelEnabled: true,
    maxTenantsAllowed: 500,
    currentTenantsCount: 142
  }
};

export const INITIAL_SYSTEM_LOGS: SystemLogEntry[] = [
  {
    id: 'log_01',
    timestamp: '31/07/2026 04:55 AM',
    logType: 'AUDIT',
    actor: 'Super Admin (Eng. Tutul)',
    action: 'SYSTEM_SETTINGS_UPDATE',
    details: 'Global bKash Merchant Gateway configuration parameters updated.',
    ipAddress: '103.112.44.12'
  },
  {
    id: 'log_02',
    timestamp: '31/07/2026 04:30 AM',
    logType: 'SYSTEM',
    actor: 'System Auto Job',
    action: 'CACHE_PURGED',
    details: 'Redis & Application In-Memory Cache purged successfully (12.4 MB freed).',
    ipAddress: '127.0.0.1'
  },
  {
    id: 'log_03',
    timestamp: '31/07/2026 03:15 AM',
    logType: 'ACTIVITY',
    actor: 'bismillah_admin',
    action: 'ORGANIZATION_PROFILE_SAVE',
    details: 'Updated Organization Garage profile and Android POS terminal bindings.',
    ipAddress: '118.179.201.5'
  },
  {
    id: 'log_04',
    timestamp: '30/07/2026 11:00 PM',
    logType: 'SYSTEM',
    actor: 'Database Optimizer Cron',
    action: 'FIRESTORE_INDEX_OPTIMIZE',
    details: 'Firestore Index & Query cache optimized across 142 tenant collections.',
    ipAddress: '127.0.0.1'
  },
  {
    id: 'log_05',
    timestamp: '30/07/2026 09:20 PM',
    logType: 'ERROR',
    actor: 'SMS Gateway Engine',
    action: 'SMS_DELIVERY_FAIL',
    details: 'SSL Wireless API timeout on mobile +8801700000000. Auto-retried via MAMURBET.',
    ipAddress: '202.84.44.18'
  }
];

export class SystemSettingsService {
  private static STORAGE_KEY = 'ababil_global_system_settings_v1';
  private static LOGS_KEY = 'ababil_global_system_logs_v1';

  static getSettings(): GlobalSystemConfig {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read settings from localStorage, fallback to default', e);
    }
    return DEFAULT_GLOBAL_CONFIG;
  }

  static saveSettings(config: GlobalSystemConfig): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save system settings', e);
    }
  }

  static getLogs(): SystemLogEntry[] {
    try {
      const saved = localStorage.getItem(this.LOGS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read logs from localStorage', e);
    }
    return INITIAL_SYSTEM_LOGS;
  }

  static addLog(entry: Omit<SystemLogEntry, 'id' | 'timestamp'>): void {
    const logs = this.getLogs();
    const newEntry: SystemLogEntry = {
      ...entry,
      id: 'log_' + Date.now(),
      timestamp: new Date().toLocaleString('en-GB')
    };
    const updated = [newEntry, ...logs];
    try {
      localStorage.setItem(this.LOGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save log entry', e);
    }
  }

  static clearCache(currentConfig: GlobalSystemConfig): GlobalSystemConfig {
    const updated: GlobalSystemConfig = {
      ...currentConfig,
      maintenance: {
        ...currentConfig.maintenance,
        lastCacheClearedAt: new Date().toLocaleString('en-GB')
      }
    };
    this.saveSettings(updated);
    this.addLog({
      logType: 'SYSTEM',
      actor: 'Super Admin',
      action: 'CLEAR_SYSTEM_CACHE',
      details: 'Super Admin manually triggered full cache flush across CDN & Redis.',
      ipAddress: '103.112.44.1'
    });
    return updated;
  }

  static optimizeDatabase(currentConfig: GlobalSystemConfig): GlobalSystemConfig {
    const updated: GlobalSystemConfig = {
      ...currentConfig,
      maintenance: {
        ...currentConfig.maintenance,
        lastDatabaseOptimizedAt: new Date().toLocaleString('en-GB')
      }
    };
    this.saveSettings(updated);
    this.addLog({
      logType: 'SYSTEM',
      actor: 'Super Admin',
      action: 'OPTIMIZE_DATABASE',
      details: 'Executed Firestore index rebuild and garbage collection routines.',
      ipAddress: '103.112.44.1'
    });
    return updated;
  }
}
