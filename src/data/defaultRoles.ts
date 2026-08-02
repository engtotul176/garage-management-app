import { RoleDefinition, PermissionDefinition } from '../types/employee';

export const ALL_EMPLOYEE_PERMISSIONS: PermissionDefinition[] = [
  { key: 'dashboard', nameBangla: 'ড্যাশবোর্ড (Dashboard)', nameEnglish: 'Dashboard', category: 'core', description: 'ওভারভিউ ও সামারি পরিসংখ্যান ড্যাশবোর্ড ভিউ' },
  { key: 'members', nameBangla: 'মেম্বার ম্যানেজমেন্ট (Members)', nameEnglish: 'Members', category: 'core', description: 'সদস্য রেজিস্টার, প্রোফাইল এডিট ও গাড়ি তালিকা' },
  { key: 'employees', nameBangla: 'স্টাফ ও ভূমিকা (Employees)', nameEnglish: 'Employees', category: 'admin', description: 'কর্মচারী নিয়োগ, রোল এবং পারমিশন অ্যাসাইনমেন্ট' },
  { key: 'daily_collection', nameBangla: 'দৈনিক কালেকশন (Daily Collection)', nameEnglish: 'Daily Collection', category: 'finance', description: 'গাড়ির রুটিন জমা, রসিদ এন্ট্রি ও জমার হিসাব' },
  { key: 'monthly_collection', nameBangla: 'মাসিক কালেকশন (Monthly Collection)', nameEnglish: 'Monthly Collection', category: 'finance', description: 'সমিতির মাসিক চাঁদা, বকেয়া রিমাইন্ডার ও আদায়' },
  { key: 'income', nameBangla: 'আয় হিসাব (Income)', nameEnglish: 'Income', category: 'finance', description: 'বিবিধ আয়ের বিবরণ ও খাতভিত্তিক খতিয়ান' },
  { key: 'expense', nameBangla: 'ব্যয় হিসাব (Expense)', nameEnglish: 'Expense', category: 'finance', description: 'দৈনিক পরিচালন খরচ, বেতন প্রদান ও ভাউচার' },
  { key: 'reports', nameBangla: 'রিপোর্টস ও অ্যানালিটিক্স (Reports)', nameEnglish: 'Reports', category: 'core', description: 'কাস্টম লেজার, আয়-ব্যয় সামারি ও এক্সেল এক্সপোর্ট' },
  { key: 'receipt', nameBangla: 'রিসিপ্ট প্রিন্টিং (Receipt)', nameEnglish: 'Receipt Printing', category: 'finance', description: 'থার্মাল প্রিন্টার ও মেম্বার মেমো ভাউচার প্রিন্ট' },
  { key: 'sms', nameBangla: 'এসএমএস অ্যালার্ট (SMS)', nameEnglish: 'SMS Notification', category: 'communication', description: 'টাকা জমার স্বয়ংক্রিয় এসএমএস ও বকেয়া নোটিশ' },
  { key: 'notifications', nameBangla: 'ইন-অ্যাপ নোটিফিকেশন', nameEnglish: 'Notifications', category: 'communication', description: 'সিস্টেম নোটিফিকেশন ও মেসেজ সেন্ট্রাল' },
  { key: 'settings', nameBangla: 'সিস্টেম সেটিংস (Settings)', nameEnglish: 'Settings', category: 'admin', description: 'অর্গানাইজেশনের জেনারেল সেটিংস ও কনফিগারেশন' },
  { key: 'branding', nameBangla: 'ব্র্যান্ডিং (Branding)', nameEnglish: 'Branding', category: 'admin', description: 'লোগো, প্রিন্টিং হেডার ও অর্গানাইজেশন হোয়াইট লেবেল' }
];

export const DEFAULT_SYSTEM_ROLES: RoleDefinition[] = [
  {
    id: 'org_admin',
    roleCode: 'ROLE-ADM',
    nameBangla: 'অর্গানাইজেশন এডমিন (Org Admin)',
    nameEnglish: 'Organization Admin',
    description: 'সংস্থার পূর্ণ নিয়ন্ত্রণকারী, সব মেনু ও সেটিংসে অ্যাক্সেসপ্রাপ্ত',
    tenantId: 'global',
    isSystemRole: true,
    permissions: [
      'dashboard', 'members', 'employees', 'daily_collection', 'monthly_collection',
      'income', 'expense', 'reports', 'receipt', 'sms', 'notifications', 'settings', 'branding'
    ]
  },
  {
    id: 'manager',
    roleCode: 'ROLE-MGR',
    nameBangla: 'ম্যানেজার (Manager)',
    nameEnglish: 'Manager',
    description: 'দৈনন্দিন কার্যক্রম, কালেকশন পর্যবেক্ষণ ও সদস্য ব্যবস্থাপনা',
    tenantId: 'global',
    isSystemRole: true,
    permissions: [
      'dashboard', 'members', 'daily_collection', 'monthly_collection',
      'income', 'expense', 'reports', 'receipt', 'sms', 'notifications'
    ]
  },
  {
    id: 'cash_collector',
    roleCode: 'ROLE-COL',
    nameBangla: 'ক্যাশ কালেক্টর (Cash Collector)',
    nameEnglish: 'Cash Collector',
    description: 'গ্যারেজের বা সমিতির মাঠপর্যায়ে ক্যাশ জমা ও রসিদ প্রিন্ট',
    tenantId: 'global',
    isSystemRole: true,
    permissions: [
      'dashboard', 'daily_collection', 'monthly_collection', 'receipt', 'notifications'
    ]
  },
  {
    id: 'accountant',
    roleCode: 'ROLE-ACC',
    nameBangla: 'একাউন্ট্যান্ট (Accountant)',
    nameEnglish: 'Accountant',
    description: 'আয়-ব্যয় লেজার হিসাব, আর্থিক রিপোর্টস ও ভাউচার পরিচালনা',
    tenantId: 'global',
    isSystemRole: true,
    permissions: [
      'dashboard', 'daily_collection', 'monthly_collection', 'income', 'expense', 'reports', 'receipt'
    ]
  },
  {
    id: 'supervisor',
    roleCode: 'ROLE-SUP',
    nameBangla: 'সুপারভাইজার (Supervisor)',
    nameEnglish: 'Supervisor',
    description: 'কালেকশন তদারকি, স্টাফ ডিউটি মনিটরিং ও মেম্বার ভেরিফিকেশন',
    tenantId: 'global',
    isSystemRole: true,
    permissions: [
      'dashboard', 'members', 'daily_collection', 'reports', 'notifications'
    ]
  },
  {
    id: 'reception',
    roleCode: 'ROLE-REC',
    nameBangla: 'রিস্তপশন (Reception)',
    nameEnglish: 'Reception',
    description: 'সদস্য অভ্যর্থনা, ইনকোয়ারি ও রুটিন সার্ভিস জমা',
    tenantId: 'global',
    isSystemRole: true,
    permissions: [
      'dashboard', 'members', 'daily_collection', 'notifications'
    ]
  },
  {
    id: 'data_entry',
    roleCode: 'ROLE-DEO',
    nameBangla: 'ডাটা এন্ট্রি অপারেটর (Data Entry)',
    nameEnglish: 'Data Entry Operator',
    description: 'মেম্বার নিবন্ধন, পুরনো খাতা এন্ট্রি ও ব্যাকলগ ডাটা ইনপুট',
    tenantId: 'global',
    isSystemRole: true,
    permissions: [
      'members', 'daily_collection', 'monthly_collection', 'income', 'expense'
    ]
  }
];
