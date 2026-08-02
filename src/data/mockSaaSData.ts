import { 
  PackageTier, 
  OrganizationTenant, 
  UserProfile, 
  PermissionItem, 
  MemberRecord, 
  DailyCollectionRecord 
} from '../types/saas';

export const MOCK_PACKAGES: PackageTier[] = [
  {
    id: 'starter',
    packageCode: 'PKG-STR-01',
    nameBangla: 'স্টার্টার প্যাকেজ (Starter)',
    nameEnglish: 'Starter',
    description: 'ছোট গ্যারেজ বা নতুন সমিতির জন্য আদর্শ প্যাকেজ',
    priceMonthly: 500,
    priceYearly: 5000,
    trialDays: 7,
    maxMembers: 100,
    maxEmployees: 2,
    maxBranches: 1,
    maxStorageMB: 500,
    maxDailyCollection: 100,
    status: 'active',
    features: ['dashboard', 'members', 'employees', 'daily_collection', 'receipt_printing', 'reports']
  },
  {
    id: 'professional',
    packageCode: 'PKG-PRO-02',
    nameBangla: 'প্রফেশনাল প্যাকেজ (Professional)',
    nameEnglish: 'Professional',
    description: 'মাঝারি আকারের অটো গ্যারেজ ও বড় সমিতি পরিচালনায় উপযুক্ত',
    priceMonthly: 1200,
    priceYearly: 12000,
    trialDays: 14,
    maxMembers: 500,
    maxEmployees: 5,
    maxBranches: 2,
    maxStorageMB: 2000,
    maxDailyCollection: 500,
    status: 'active',
    isPopular: true,
    features: ['dashboard', 'members', 'employees', 'daily_collection', 'monthly_collection', 'income', 'expense', 'receipt_printing', 'reports', 'qr_code', 'sms', 'export_pdf']
  },
  {
    id: 'business',
    packageCode: 'PKG-BUS-03',
    nameBangla: 'বিজনেস প্যাকেজ (Business)',
    nameEnglish: 'Business',
    description: 'মাল্টি-ব্রাঞ্চ সুবিধা ও এডভান্সড ক্লাউড ব্যাকআপ সমৃদ্ধ',
    priceMonthly: 2500,
    priceYearly: 25000,
    trialDays: 14,
    maxMembers: 2000,
    maxEmployees: 15,
    maxBranches: 5,
    maxStorageMB: 10000,
    maxDailyCollection: 2000,
    status: 'active',
    features: ['dashboard', 'members', 'employees', 'daily_collection', 'monthly_collection', 'income', 'expense', 'receipt_printing', 'reports', 'qr_code', 'barcode', 'sms', 'notifications', 'backup', 'export_pdf', 'export_excel', 'whatsapp_notification']
  },
  {
    id: 'enterprise',
    packageCode: 'PKG-ENT-04',
    nameBangla: 'এন্টারপ্রাইজ প্যাকেজ (Enterprise)',
    nameEnglish: 'Enterprise',
    description: 'আনলিমিটেড সুবিধা, টিভি ড্যাশবোর্ড ও এআই এনালাইটিক্স',
    priceMonthly: 5000,
    priceYearly: 50000,
    trialDays: 30,
    maxMembers: 10000,
    maxEmployees: 50,
    maxBranches: 20,
    maxStorageMB: 50000,
    maxDailyCollection: 10000,
    status: 'active',
    features: ['dashboard', 'members', 'employees', 'daily_collection', 'monthly_collection', 'income', 'expense', 'receipt_printing', 'reports', 'qr_code', 'barcode', 'sms', 'notifications', 'android_tv_dashboard', 'backup', 'export_pdf', 'export_excel', 'ai_analytics', 'whatsapp_notification', 'payment_gateway', 'api_access']
  }
];

export const MOCK_ORGANIZATIONS: OrganizationTenant[] = [
  {
    id: 'org_bismillah_001',
    orgName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    orgCategory: 'Auto Garage',
    address: 'স্টেশন রোড, টার্মিনাল মোড়, ঢাকা',
    phone: '01711223344',
    email: 'bismillah@garage-bd.com',
    logoUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=120&auto=format&fit=crop&q=80',
    primaryColor: '#0284c7',
    status: 'active',
    packageId: 'business',
    subscriptionStart: '2026-01-01',
    subscriptionEnd: '2026-12-31',
    memberCount: 340,
    employeeCount: 4,
    monthlyRevenueEstimate: 85000
  },
  {
    id: 'org_mirpur_002',
    orgName: 'মিরপুর অটো স্ট্যান্ড সমিতি',
    orgCategory: 'Auto Stand',
    address: 'মিরপুর ১০ গোলচত্বর, ঢাকা',
    phone: '01822334455',
    email: 'mirpur.stand@samity-bd.com',
    logoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80',
    primaryColor: '#16a34a',
    status: 'trial',
    trialDaysRemaining: 12,
    packageId: 'professional',
    subscriptionStart: '2026-07-20',
    subscriptionEnd: '2026-08-03',
    memberCount: 180,
    employeeCount: 3,
    monthlyRevenueEstimate: 42000
  },
  {
    id: 'org_greenline_003',
    orgName: 'গ্রিনলাইন ট্রাক টার্মিনাল কমার্শিয়াল সংস্থান',
    orgCategory: 'Truck Garage',
    address: 'তেজগাঁও ট্রাক টার্মিনাল, ঢাকা',
    phone: '01933445566',
    email: 'contact@greenlinetruck.com',
    logoUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=120&auto=format&fit=crop&q=80',
    primaryColor: '#dc2626',
    status: 'expired',
    packageId: 'starter',
    subscriptionStart: '2025-06-01',
    subscriptionEnd: '2026-06-01',
    memberCount: 95,
    employeeCount: 2,
    monthlyRevenueEstimate: 28000
  }
];

export const MOCK_USERS: UserProfile[] = [
  {
    uid: 'user_super_admin_176',
    displayName: 'ইনজিনিয়ার মোঃ তানভীন আহমেদ তুতুল',
    email: 'Engtotul176@gmail.com',
    phone: '01700000000',
    role: 'super_admin',
    tenantId: 'GLOBAL',
    tenantName: 'Ababil Software Solutions (Super Admin)',
    isActive: true
  },
  {
    uid: 'user_org_admin_001',
    displayName: 'আলহাজ্ব মোঃ রফিকুল ইসলাম',
    email: 'rafiqul@bismillahgarage.com',
    phone: '01711223344',
    role: 'org_admin',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    isActive: true
  },
  {
    uid: 'user_employee_001',
    displayName: 'মোঃ তারেক রহমান (কালেক্টর)',
    email: 'tareq@bismillahgarage.com',
    phone: '01722334455',
    role: 'employee',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    isActive: true
  },
  {
    uid: 'user_member_001',
    displayName: 'মোঃ আবদুর রহিম (ইজিবাইক চালক)',
    email: 'rahim.driver@gmail.com',
    phone: '01811223344',
    role: 'member',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    isActive: true
  }
];

export const PERMISSION_MATRIX: PermissionItem[] = [
  {
    featureKey: 'org_management',
    featureNameBangla: 'নতুন অর্গানাইজেশন তৈরি ও কন্ট্রোল',
    superAdmin: true,
    orgAdmin: false,
    employee: false,
    member: false,
    description: 'নতুন টেন্যান্ট তৈরি, এডিট, ডিলিট, সাসপেন্ড ও রিকভারি'
  },
  {
    featureKey: 'package_pricing',
    featureNameBangla: 'সাবস্ক্রিপশন প্যাকেজ ও প্রাইসিং',
    superAdmin: true,
    orgAdmin: false,
    employee: false,
    member: false,
    description: 'প্যাকেজ রেট নির্ধারণ, ট্রায়াল মেথড ও ফিচার লিমিট কন্ট্রোল'
  },
  {
    featureKey: 'branding_control',
    featureNameBangla: 'সফটওয়্যার ব্র্যান্ডিং ও লোগো চেঞ্জ',
    superAdmin: true,
    orgAdmin: true,
    employee: false,
    member: false,
    description: 'ডাইনামিক নাম, লোগো, থিম কালার ও কন্ট্রাক্ট ফিল্ড সেটিংস'
  },
  {
    featureKey: 'member_registration',
    featureNameBangla: 'ড্রাইভার/মেম্বার রেজিস্ট্রেশন',
    superAdmin: true,
    orgAdmin: true,
    employee: true,
    member: false,
    description: 'নতুন গাড়ি/মেম্বার এন্ট্রি, মাসিক ফিস নির্ধারণ ও প্রোফাইল আপডেট'
  },
  {
    featureKey: 'daily_collection',
    featureNameBangla: 'দৈনিক কালেকশন ও রসিদ প্রিন্ট',
    superAdmin: true,
    orgAdmin: true,
    employee: true,
    member: false,
    description: 'টাকা আদায়, কিউআর স্ক্যান ও মেমো প্রিন্টিং (ডিলিট পারমিশন নেই)'
  },
  {
    featureKey: 'delete_collection',
    featureNameBangla: 'কালেকশন এন্ট্রি মুছে ফেলা (Delete Voucher)',
    superAdmin: true,
    orgAdmin: true,
    employee: false,
    member: false,
    description: 'ভাউচার ডিলিট পারমিশন শুধুমাত্র এডমিনের জন্য সংরক্ষিত'
  },
  {
    featureKey: 'income_expense',
    featureNameBangla: 'আয়-ব্যয় ও অডিট হিসেব',
    superAdmin: true,
    orgAdmin: true,
    employee: false,
    member: false,
    description: 'কারেন্ট বিল, স্টাফ বেতন ও অন্যান্য গ্যারেজ খরচের হিসাব'
  },
  {
    featureKey: 'personal_ledger',
    featureNameBangla: 'ব্যক্তিগত হিসাব ও রসিদ হিস্ট্রি',
    superAdmin: true,
    orgAdmin: true,
    employee: true,
    member: true,
    description: 'নিজের জমা, বকেয়া এবং পূর্বের ভাউচার ডাউনলোড'
  }
];

export const MOCK_MEMBERS: MemberRecord[] = [
  {
    id: 'MEM-101',
    tenantId: 'org_bismillah_001',
    memberName: 'মোঃ আবদুর রহিম',
    phone: '01811223344',
    vehicleNo: 'ঢাকা-মেট্রো-থ-১১-৪৫৮৯',
    vehicleType: 'অটো ইজিবাইক',
    address: 'দক্ষিণখান, ঢাকা',
    monthlyFee: 3000,
    balance: 500,
    dueAmount: 0,
    qrCode: 'QR-MEM-101-BISMILLAH',
    status: 'active',
    joinedDate: '2025-10-12'
  },
  {
    id: 'MEM-102',
    tenantId: 'org_bismillah_001',
    memberName: 'মোঃ জহিরুল ইসলাম',
    phone: '01722334455',
    vehicleNo: 'ঢাকা-মেট্রো-থ-১২-৭৭৮১',
    vehicleType: 'সিএনজি অটো',
    address: 'উত্তরা সেক্টর ৭, ঢাকা',
    monthlyFee: 3500,
    balance: 0,
    dueAmount: 1200,
    qrCode: 'QR-MEM-102-BISMILLAH',
    status: 'active',
    joinedDate: '2025-11-05'
  },
  {
    id: 'MEM-103',
    tenantId: 'org_bismillah_001',
    memberName: 'মোঃ শফিকুল আলম',
    phone: '01933445566',
    vehicleNo: 'ঢাকা-মেট্রো-থ-১৪-৯০১১',
    vehicleType: 'ব্যাটারি রিকশা',
    address: 'বিমানবন্দর ট্রাফিক মোড়, ঢাকা',
    monthlyFee: 2500,
    balance: 0,
    dueAmount: 2500,
    qrCode: 'QR-MEM-103-BISMILLAH',
    status: 'active',
    joinedDate: '2026-01-02'
  }
];

export const MOCK_COLLECTIONS: DailyCollectionRecord[] = [
  {
    id: 'COL-9901',
    tenantId: 'org_bismillah_001',
    memberId: 'MEM-101',
    memberName: 'মোঃ আবদুর রহিম',
    vehicleNo: 'ঢাকা-মেট্রো-থ-১১-৪৫৮৯',
    amount: 100,
    paymentMethod: 'ক্যাশ',
    receiptNo: 'REC-2026-0001',
    category: 'চার্জিং ফি',
    collectorName: 'মোঃ তারেক রহমান',
    collectorUid: 'user_employee_001',
    timestamp: '2026-07-30T10:15:00Z'
  },
  {
    id: 'COL-9902',
    tenantId: 'org_bismillah_001',
    memberId: 'MEM-102',
    memberName: 'মোঃ জহিরুল ইসলাম',
    vehicleNo: 'ঢাকা-মেট্রো-থ-১২-৭৭৮১',
    amount: 500,
    paymentMethod: 'বিকাশ',
    receiptNo: 'REC-2026-0002',
    category: 'বকেয়া আদায়',
    collectorName: 'মোঃ তারেক রহমান',
    collectorUid: 'user_employee_001',
    timestamp: '2026-07-30T11:40:00Z'
  }
];
