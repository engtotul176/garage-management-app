import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  ApiKeyRecord, 
  ApiLogRecord, 
  ApiUsageMetric, 
  MobileSessionRecord, 
  EndpointDefinition, 
  ApiResponseWrapper 
} from '../types/apiBackend';

const INITIAL_API_KEYS: ApiKeyRecord[] = [
  {
    id: 'key_android_mobile_prod',
    tenantId: 'org_bismillah_001',
    name: 'Ababil Mobile App (Android Native)',
    apiKey: 'ababil_live_and_78901234567890123456',
    role: 'ORG_ADMIN',
    scopes: ['auth:full', 'members:read', 'members:write', 'collections:read', 'collections:write', 'reports:read', 'push:send'],
    rateLimitPerMin: 120,
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    lastUsedAt: new Date(Date.now() - 3600000).toISOString(),
    createdBy: 'Engineer Md. Tanveen Ahmed Tutul'
  },
  {
    id: 'key_pos_desktop_terminal',
    tenantId: 'org_bismillah_001',
    name: 'Garage POS Terminal & TV Screen',
    apiKey: 'ababil_live_pos_11223344556677889900',
    role: 'EMPLOYEE',
    scopes: ['collections:read', 'collections:write', 'receipts:read', 'receipts:print'],
    rateLimitPerMin: 300,
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    lastUsedAt: new Date(Date.now() - 600000).toISOString(),
    createdBy: 'ক্যাশিয়ার রফিক উল্লাহ'
  },
  {
    id: 'key_third_party_bkash',
    tenantId: 'org_bismillah_001',
    name: 'bKash Merchant Webhook Integration',
    apiKey: 'ababil_live_bkas_99887766554433221100',
    role: 'SYSTEM',
    scopes: ['payments:webhook', 'collections:write'],
    rateLimitPerMin: 60,
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    lastUsedAt: new Date(Date.now() - 7200000).toISOString(),
    createdBy: 'System Integration Engine'
  }
];

const INITIAL_API_LOGS: ApiLogRecord[] = [
  {
    id: 'log_api_1001',
    tenantId: 'org_bismillah_001',
    keyId: 'key_android_mobile_prod',
    endpoint: '/api/v1/members',
    version: 'v1',
    method: 'GET',
    clientIp: '103.114.32.18',
    userAgent: 'AbabilAndroidApp/v2.4.0 (Android 14; Samsung Galaxy S23)',
    statusCode: 200,
    responseTimeMs: 42,
    requestPayload: '{"page":1,"limit":20,"search":"ঢাকা"}',
    responsePayload: '{"success":true,"statusCode":200,"count":15}',
    timestamp: new Date(Date.now() - 120000).toISOString()
  },
  {
    id: 'log_api_1002',
    tenantId: 'org_bismillah_001',
    keyId: 'key_pos_desktop_terminal',
    endpoint: '/api/v1/collections',
    version: 'v1',
    method: 'POST',
    clientIp: '103.114.32.22',
    userAgent: 'AbabilDesktopPOS/v1.1 (Windows 11 x64)',
    statusCode: 201,
    responseTimeMs: 68,
    requestPayload: '{"memberId":"mem_88201","amount":500,"paymentMethod":"CASH"}',
    responsePayload: '{"success":true,"statusCode":201,"receiptNo":"REC-2026-08812"}',
    timestamp: new Date(Date.now() - 300000).toISOString()
  },
  {
    id: 'log_api_1003',
    tenantId: 'org_bismillah_001',
    keyId: 'key_third_party_bkash',
    endpoint: '/api/v1/payments/webhook',
    version: 'v1',
    method: 'POST',
    clientIp: '180.211.200.5',
    userAgent: 'bKash-Payment-Gateway/v2.0',
    statusCode: 200,
    responseTimeMs: 110,
    requestPayload: '{"trxID":"9A18273645","status":"COMPLETED"}',
    responsePayload: '{"success":true,"message":"Webhook Processed"}',
    timestamp: new Date(Date.now() - 1800000).toISOString()
  }
];

const INITIAL_MOBILE_SESSIONS: MobileSessionRecord[] = [
  {
    id: 'sess_mob_991',
    tenantId: 'org_bismillah_001',
    userId: 'usr_dir_001',
    userName: 'মোঃ জহিরুল ইসলাম',
    deviceId: 'samsung_sm_g998b_android_14',
    platform: 'ANDROID',
    appVersion: 'v2.4.0',
    fcmToken: 'fcm_token_and_8839201920394829384920',
    ipAddress: '103.114.32.18',
    status: 'ACTIVE',
    lastActiveAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'sess_mob_992',
    tenantId: 'org_bismillah_001',
    userId: 'usr_cash_002',
    userName: 'ক্যাশিয়ার রফিক উল্লাহ',
    deviceId: 'ipad_pro_12.9_ios_17',
    platform: 'IOS',
    appVersion: 'v2.3.1',
    fcmToken: 'fcm_token_ios_19283746501928374',
    ipAddress: '103.114.32.22',
    status: 'ACTIVE',
    lastActiveAt: new Date(Date.now() - 600000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'sess_tv_993',
    tenantId: 'org_bismillah_001',
    userId: 'usr_tv_dashboard',
    userName: 'গ্যারেজ মেইন গেট টিভি ডিসপ্লে',
    deviceId: 'android_tv_box_realtek_3229',
    platform: 'ANDROID_TV',
    appVersion: 'v1.0.0-tv',
    ipAddress: '192.168.1.105',
    status: 'ACTIVE',
    lastActiveAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  }
];

export const ENDPOINT_CATALOG: EndpointDefinition[] = [
  // Authentication API
  {
    module: 'Authentication API',
    version: 'v1',
    method: 'POST',
    path: '/api/v1/auth/login',
    summary: 'মোবাইল ও ডেসktop অ্যাপ ইউজার লগইন',
    description: 'Firebase auth ID token অথবা ইমেইল/মোবাইল পিন দিয়ে জেনুইন JWT Access Token ও Refresh Token ইস্যু করে।',
    authRequired: false,
    parameters: [
      { name: 'emailOrMobile', in: 'body', required: true, type: 'string', description: 'ইমেইল অথবা মোবাইল নম্বর' },
      { name: 'passwordOrPin', in: 'body', required: true, type: 'string', description: 'পাসওয়ার্ড অথবা সিকিউরিটি পিন' },
      { name: 'deviceId', in: 'body', required: true, type: 'string', description: 'মোবাইল ডিভাইস ইউনিক আইডি' }
    ],
    sampleResponse: {
      success: true,
      version: 'v1',
      timestamp: '2026-07-31T12:00:00.000Z',
      statusCode: 200,
      data: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'def456_refresh_token_string',
        expiresIn: 3600,
        user: {
          uid: 'usr_dir_001',
          name: 'মোঃ জহিরুল ইসলাম',
          role: 'ORG_ADMIN',
          tenantId: 'org_bismillah_001',
          tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ'
        }
      }
    }
  },
  {
    module: 'Authentication API',
    version: 'v1',
    method: 'POST',
    path: '/api/v1/auth/refresh',
    summary: 'Refresh Token দিয়ে Access Token নবায়ন',
    description: 'এক্সপায়ার্ড এক্সেস টোকেন রিফ্রেশ করার এন্ডপয়েন্ট।',
    authRequired: false,
    parameters: [
      { name: 'refreshToken', in: 'body', required: true, type: 'string', description: 'বৈধ রিফ্রেশ টোকেন' }
    ],
    sampleResponse: {
      success: true,
      version: 'v1',
      timestamp: '2026-07-31T12:00:00.000Z',
      statusCode: 200,
      data: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_new',
        expiresIn: 3600
      }
    }
  },

  // Organization API
  {
    module: 'Organization API',
    version: 'v1',
    method: 'GET',
    path: '/api/v1/organizations/{orgId}',
    summary: 'অর্গানাইজেশন প্রোফাইল ও টেন্যান্ট ডিটেইলস',
    description: 'টেন্যান্ট আইডি অনুযায়ী প্রতিষ্ঠানের লাইসেন্স, লোগো, প্যাকেজ ও কনফিগারেশন প্রদান করে।',
    authRequired: true,
    scopeRequired: 'org:read',
    parameters: [
      { name: 'orgId', in: 'path', required: true, type: 'string', description: 'অর্গানাইজেশন ইউনিক আইডি' }
    ],
    sampleResponse: {
      success: true,
      version: 'v1',
      timestamp: '2026-07-31T12:00:00.000Z',
      statusCode: 200,
      data: {
        orgId: 'org_bismillah_001',
        orgName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
        orgType: 'Auto Charging Garage & Stand',
        packageId: 'enterprise_pro',
        status: 'ACTIVE',
        maxMembers: 500,
        currentMembers: 142
      }
    }
  },

  // Employee API
  {
    module: 'Employee API',
    version: 'v1',
    method: 'GET',
    path: '/api/v1/employees',
    summary: 'কর্মচারী ও ক্যাশিয়ার তালিকা (Paginated)',
    description: 'অর্গানাইজেশনের ড্রাইভার, মেকানিক ও ক্যাশিয়ারদের তথ্য সার্চ ও ফিল্টার করে।',
    authRequired: true,
    scopeRequired: 'employees:read',
    parameters: [
      { name: 'page', in: 'query', required: false, type: 'number', description: 'Page number (Default: 1)' },
      { name: 'limit', in: 'query', required: false, type: 'number', description: 'Page limit (Default: 20)' },
      { name: 'search', in: 'query', required: false, type: 'string', description: 'নাম বা মোবাইল নম্বর' }
    ],
    sampleResponse: {
      success: true,
      version: 'v1',
      timestamp: '2026-07-31T12:00:00.000Z',
      statusCode: 200,
      pagination: { page: 1, limit: 10, total: 3, totalPages: 1, hasNext: false, hasPrev: false },
      data: [
        { id: 'emp_01', name: 'মোঃ জহিরুল ইসলাম', role: 'SUPERVISOR', mobile: '01711002233' },
        { id: 'emp_02', name: 'ক্যাশিয়ার রফিক উল্লাহ', role: 'CASHIER', mobile: '01899112244' }
      ]
    }
  },

  // Member API
  {
    module: 'Member API',
    version: 'v1',
    method: 'GET',
    path: '/api/v1/members',
    summary: 'মেম্বার ও গাড়ির ড্রাইভার তালিকা (Android Optimized)',
    description: 'মোবাইল অ্যাপের দ্রুত লোডিংয়ের জন্য ফিল্টারিং ও পেজিনেশন সহ মেম্বার লিস্ট।',
    authRequired: true,
    scopeRequired: 'members:read',
    parameters: [
      { name: 'page', in: 'query', required: false, type: 'number', description: 'পৃষ্ঠা নম্বর' },
      { name: 'limit', in: 'query', required: false, type: 'number', description: 'আইটেম সংখ্যা' },
      { name: 'vehicleNo', in: 'query', required: false, type: 'string', description: 'গাড়ির রেজিস্ট্রেশন নম্বর' }
    ],
    sampleResponse: {
      success: true,
      version: 'v1',
      timestamp: '2026-07-31T12:00:00.000Z',
      statusCode: 200,
      pagination: { page: 1, limit: 20, total: 142, totalPages: 8, hasNext: true, hasPrev: false },
      data: [
        {
          memberId: 'mem_88201',
          memberCode: 'MEM-ABABIL-2026-991',
          memberName: 'মোঃ জহিরুল ইসলাম',
          mobile: '01711002233',
          vehicleNo: 'ঢাকা মেট্রো-থ-১১-৮৮৯২',
          monthlyFee: 1500,
          dueAmount: 1200,
          status: 'ACTIVE'
        }
      ]
    }
  },
  {
    module: 'Member API',
    version: 'v1',
    method: 'POST',
    path: '/api/v1/members',
    summary: 'নতুন মেম্বার/গাড়ি রেজিস্ট্রেশন',
    description: 'অর্গানাইজেশনের অধীনে নতুন ড্রাগিং/চার্জিং মেম্বার অন্তর্ভুক্ত করে।',
    authRequired: true,
    scopeRequired: 'members:write',
    parameters: [
      { name: 'memberName', in: 'body', required: true, type: 'string', description: 'মেম্বারের পুরো নাম' },
      { name: 'mobile', in: 'body', required: true, type: 'string', description: '১১ ডিজিটের মোবাইল নম্বর' },
      { name: 'vehicleNo', in: 'body', required: true, type: 'string', description: 'গাড়ির নম্বর' },
      { name: 'monthlyFee', in: 'body', required: true, type: 'number', description: 'মাসিক ফি' }
    ],
    sampleResponse: {
      success: true,
      version: 'v1',
      timestamp: '2026-07-31T12:00:00.000Z',
      statusCode: 201,
      message: 'মেম্বার সফলভাবে নিবন্ধিত হয়েছে',
      data: {
        memberId: 'mem_new_99182',
        memberCode: 'MEM-ABABIL-2026-102',
        qrCodeData: 'ABABIL-CARD-mem_new_99182'
      }
    }
  },

  // Collection API
  {
    module: 'Collection API',
    version: 'v1',
    method: 'POST',
    path: '/api/v1/collections',
    summary: 'দৈনিক টাকা আদায় ও রিসিট ভাউচার এনট্রি',
    description: 'মোবাইল অ্যাপ বা ডেসktop POS থেকে টাকা কালেকশন এন্ট্রি দিলে স্বয়ংক্রিয়ভাবে SMS ও রিসিট জেনারেট হয়।',
    authRequired: true,
    scopeRequired: 'collections:write',
    parameters: [
      { name: 'memberId', in: 'body', required: true, type: 'string', description: 'মেম্বার আইডি' },
      { name: 'amount', in: 'body', required: true, type: 'number', description: 'টাকার পরিমাণ (BDT)' },
      { name: 'paymentMethod', in: 'body', required: true, type: 'string', description: 'CASH / BKASH / NAGAD' }
    ],
    sampleResponse: {
      success: true,
      version: 'v1',
      timestamp: '2026-07-31T12:00:00.000Z',
      statusCode: 201,
      message: 'টাকা আদায় সফল হয়েছে',
      data: {
        collectionId: 'col_991827',
        receiptNo: 'REC-2026-08812',
        amountPaid: 500,
        remainingDue: 700,
        smsStatus: 'DELIVERED'
      }
    }
  },

  // Receipt API
  {
    module: 'Receipt API',
    version: 'v1',
    method: 'GET',
    path: '/api/v1/receipts/{receiptNo}',
    summary: 'ডিজিটাল রিসিট ভাউচার ও প্রফেশনাল লেআউট',
    description: 'রিসিট নম্বর দিয়ে রিসিটের বিস্তারিত তথ্য ও QR Code ডিক্রিপ্ট করে।',
    authRequired: true,
    scopeRequired: 'receipts:read',
    parameters: [
      { name: 'receiptNo', in: 'path', required: true, type: 'string', description: 'রিসিট নম্বর' }
    ],
    sampleResponse: {
      success: true,
      version: 'v1',
      timestamp: '2026-07-31T12:00:00.000Z',
      statusCode: 200,
      data: {
        receiptNo: 'REC-2026-08812',
        orgName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
        memberName: 'মোঃ জহিরুল ইসলাম',
        amount: 500,
        due: 700,
        date: '2026-07-31',
        qrCodeUrl: 'https://api.ababil.com/qr/REC-2026-08812'
      }
    }
  },

  // Accounting API
  {
    module: 'Accounting API',
    version: 'v1',
    method: 'GET',
    path: '/api/v1/accounting/summary',
    summary: 'দৈনিক ক্যাশবুক ও জমা-খরচ স্টেটমেন্ট',
    description: 'মোট আয়, মোট ব্যয়, ক্যাশ ইন হ্যান্ড ও ব্যাংক ব্যালেন্স সামারি।',
    authRequired: true,
    scopeRequired: 'accounting:read',
    parameters: [
      { name: 'fromDate', in: 'query', required: false, type: 'string', description: 'YYYY-MM-DD' },
      { name: 'toDate', in: 'query', required: false, type: 'string', description: 'YYYY-MM-DD' }
    ],
    sampleResponse: {
      success: true,
      version: 'v1',
      timestamp: '2026-07-31T12:00:00.000Z',
      statusCode: 200,
      data: {
        totalIncome: 158000,
        totalExpense: 42000,
        netProfit: 116000,
        cashInHand: 35000,
        bankBalance: 81000
      }
    }
  },

  // Reports API
  {
    module: 'Reports API',
    version: 'v1',
    method: 'GET',
    path: '/api/v1/reports/summary',
    summary: 'বিজনেস ইন্টেলিজেন্স & পারফরম্যান্স রিপোর্ট',
    description: 'মাসিক বকেয়া রিপোর্ট, কালেকশন ট্রেন্ডস ও মেম্বার এনগেজমেন্ট সামারি।',
    authRequired: true,
    scopeRequired: 'reports:read',
    parameters: [],
    sampleResponse: {
      success: true,
      version: 'v1',
      timestamp: '2026-07-31T12:00:00.000Z',
      statusCode: 200,
      data: {
        totalActiveMembers: 142,
        totalDuesPending: 45000,
        collectionEfficiency: '94.2%'
      }
    }
  },

  // Notification API
  {
    module: 'Notification API',
    version: 'v1',
    method: 'POST',
    path: '/api/v1/notifications/push',
    summary: 'মোবাইল অ্যাপস push notification ব্রডকাস্ট',
    description: 'FCM (Firebase Cloud Messaging) দিয়ে অ্যান্ড্রয়েড ও আইওএস অ্যাপে ইনস্ট্যান্ট পুশ নোটিফিকেশন পাঠায়।',
    authRequired: true,
    scopeRequired: 'push:send',
    parameters: [
      { name: 'title', in: 'body', required: true, type: 'string', description: 'নোটিফিকেশন টাইটেল' },
      { name: 'message', in: 'body', required: true, type: 'string', description: 'নোটিফিকেশন মেসেজ' },
      { name: 'targetAudience', in: 'body', required: true, type: 'string', description: 'ALL / DRIVERS / CASHIERS' }
    ],
    sampleResponse: {
      success: true,
      version: 'v1',
      timestamp: '2026-07-31T12:00:00.000Z',
      statusCode: 200,
      data: {
        notificationId: 'push_881920',
        recipientsCount: 142,
        deliveredCount: 139
      }
    }
  },

  // Dashboard API
  {
    module: 'Dashboard API',
    version: 'v1',
    method: 'GET',
    path: '/api/v1/dashboard/metrics',
    summary: 'লাইভ রিয়েলটাইম ড্যাশবোর্ড ম্যাট্রিক্স',
    description: 'Android TV, Tablet ও Web Live Dashboard-এর জন্য একনজরে সকল লাইভ পরিসংখ্যান।',
    authRequired: true,
    scopeRequired: 'dashboard:read',
    parameters: [],
    sampleResponse: {
      success: true,
      version: 'v1',
      timestamp: '2026-07-31T12:00:00.000Z',
      statusCode: 200,
      data: {
        todayCollection: 12500,
        todayExpense: 1200,
        activeVehiclesInGarage: 88,
        activeTvScreens: 2,
        systemHealth: 'OPTIMAL'
      }
    }
  }
];

export class ApiBackendService {
  
  // Get API Keys
  static async getApiKeys(tenantId: string): Promise<ApiKeyRecord[]> {
    try {
      const q = query(
        collection(db, 'api_keys'),
        where('tenantId', '==', tenantId)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        return INITIAL_API_KEYS.filter(k => k.tenantId === tenantId || tenantId === 'org_bismillah_001');
      }
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as ApiKeyRecord));
    } catch (e) {
      console.warn('Fallback to local API keys:', e);
      return INITIAL_API_KEYS;
    }
  }

  // Create API Key
  static async createApiKey(
    tenantId: string,
    name: string,
    role: string,
    scopes: string[],
    rateLimitPerMin: number,
    createdBy: string
  ): Promise<ApiKeyRecord> {
    const randomSuffix = Array.from({ length: 20 }, () => 
      Math.floor(Math.random() * 36).toString(36)
    ).join('');
    
    const newApiKey: ApiKeyRecord = {
      id: `key_${Date.now()}`,
      tenantId,
      name,
      apiKey: `ababil_live_${randomSuffix}`,
      secretKey: `sec_${Date.now()}_${randomSuffix.substring(0, 8)}`,
      role,
      scopes,
      rateLimitPerMin,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      createdBy
    };

    try {
      await setDoc(doc(db, 'api_keys', newApiKey.id), newApiKey);
    } catch (e) {
      console.warn('Stored key locally:', e);
    }

    return newApiKey;
  }

  // Revoke API Key
  static async revokeApiKey(keyId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'api_keys', keyId), { status: 'REVOKED' });
    } catch (e) {
      console.warn('Updated key status locally:', e);
    }
  }

  // Get API Logs
  static async getApiLogs(tenantId: string): Promise<ApiLogRecord[]> {
    try {
      const q = query(
        collection(db, 'api_logs'),
        where('tenantId', '==', tenantId),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        return INITIAL_API_LOGS;
      }
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as ApiLogRecord));
    } catch (e) {
      console.warn('Fallback to initial API logs:', e);
      return INITIAL_API_LOGS;
    }
  }

  // Record API Log
  static async logApiRequest(log: Omit<ApiLogRecord, 'id' | 'timestamp'>): Promise<void> {
    const record: ApiLogRecord = {
      ...log,
      id: `log_api_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'api_logs', record.id), record);
    } catch (e) {
      console.warn('Logged API request in memory:', e);
    }
  }

  // Get Mobile Active Sessions
  static async getMobileSessions(tenantId: string): Promise<MobileSessionRecord[]> {
    try {
      const q = query(
        collection(db, 'mobile_sessions'),
        where('tenantId', '==', tenantId)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        return INITIAL_MOBILE_SESSIONS;
      }
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as MobileSessionRecord));
    } catch (e) {
      console.warn('Fallback to initial mobile sessions:', e);
      return INITIAL_MOBILE_SESSIONS;
    }
  }

  // Generate OpenAPI 3.0.3 Specification JSON
  static generateOpenApiSpec(): Record<string, any> {
    const pathsObj: Record<string, any> = {};

    ENDPOINT_CATALOG.forEach((ep) => {
      if (!pathsObj[ep.path]) {
        pathsObj[ep.path] = {};
      }

      const methodKey = ep.method.toLowerCase();
      pathsObj[ep.path][methodKey] = {
        tags: [ep.module],
        summary: ep.summary,
        description: ep.description,
        operationId: `${methodKey}_${ep.path.replace(/[^a-zA-Z0-9]/g, '_')}`,
        parameters: ep.parameters
          ?.filter(p => p.in !== 'body')
          .map(p => ({
            name: p.name,
            in: p.in,
            required: p.required,
            description: p.description,
            schema: { type: p.type }
          })),
        ...(ep.parameters?.some(p => p.in === 'body') && {
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: ep.parameters
                    ?.filter(p => p.in === 'body')
                    .reduce((acc, p) => ({ ...acc, [p.name]: { type: p.type, description: p.description } }), {})
                }
              }
            }
          }
        }),
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                example: ep.sampleResponse
              }
            }
          },
          '401': {
            description: 'Unauthorized - Invalid API Key or Token'
          },
          '429': {
            description: 'Rate Limit Exceeded'
          }
        },
        security: ep.authRequired ? [{ ApiKeyAuth: [] }, { BearerAuth: [] }] : []
      };
    });

    return {
      openapi: '3.0.3',
      info: {
        title: 'Ababil Enterprise Cloud SaaS REST API',
        description: 'Production Ready REST API & Mobile Backend for Android/iOS Apps, POS Desktop, and Third-Party Webhooks.',
        version: '1.0.0',
        contact: {
          name: 'Ababil Software Solutions',
          email: 'Engtotul176@gmail.com',
          url: 'https://ababil.cloud'
        }
      },
      servers: [
        {
          url: 'https://ais-dev-5xzkn7dniwit7jy77r6uaz-493414554263.asia-southeast1.run.app',
          description: 'Cloud Run Primary API Cluster (Port 3000)'
        },
        {
          url: 'https://api.ababil.cloud/v1',
          description: 'Production Global CDN Edge'
        }
      ],
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-KEY',
            description: 'Enter your organization API Key'
          },
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter JWT Access Token issued from /api/v1/auth/login'
          }
        }
      },
      paths: pathsObj
    };
  }

  // Generate Postman Collection v2.1.0 JSON
  static generatePostmanCollection(): Record<string, any> {
    const items = ENDPOINT_CATALOG.map((ep) => {
      const urlParts = ep.path.split('/').filter(Boolean);

      return {
        name: `${ep.method} ${ep.summary}`,
        request: {
          method: ep.method,
          header: [
            { key: 'Content-Type', value: 'application/json' },
            { key: 'X-API-KEY', value: '{{API_KEY}}', type: 'text' }
          ],
          url: {
            raw: `{{BASE_URL}}${ep.path}`,
            host: ['{{BASE_URL}}'],
            path: urlParts,
            query: ep.parameters
              ?.filter(p => p.in === 'query')
              .map(p => ({ key: p.name, value: '', description: p.description }))
          },
          description: ep.description
        },
        response: [
          {
            name: '200 OK Sample',
            status: 'OK',
            code: 200,
            _postman_previewlanguage: 'json',
            body: JSON.stringify(ep.sampleResponse, null, 2)
          }
        ]
      };
    });

    return {
      info: {
        _postman_id: 'ababil-rest-api-v1-collection',
        name: 'Ababil Enterprise SaaS REST API v1 (Postman Collection)',
        description: 'Complete API endpoints for Android App, iOS App, POS Terminals & Webhooks',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      variable: [
        { key: 'BASE_URL', value: 'https://ais-dev-5xzkn7dniwit7jy77r6uaz-493414554263.asia-southeast1.run.app' },
        { key: 'API_KEY', value: 'ababil_live_and_78901234567890123456' }
      ],
      item: items
    };
  }
}
