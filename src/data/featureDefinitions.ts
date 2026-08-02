import { FeatureDefinition } from '../types/saas';

export const ALL_SYSTEM_FEATURES: FeatureDefinition[] = [
  { key: 'dashboard', nameBangla: 'ড্যাশবোর্ড (Dashboard)', nameEnglish: 'Dashboard', category: 'core', description: 'মেইন এনালিটিক্স ও সামারি ভিউ' },
  { key: 'members', nameBangla: 'মেম্বার ম্যানেজমেন্ট (Members)', nameEnglish: 'Members', category: 'core', description: 'সদস্য নিবন্ধন, গাড়ি তথ্য ও প্রোফাইল' },
  { key: 'employees', nameBangla: 'স্টাফ/এমপ্লয়ি (Employees)', nameEnglish: 'Employees', category: 'core', description: 'কর্মচারী তালিকা ও পে-রোল' },
  { key: 'daily_collection', nameBangla: 'দৈনিক কালেকশন (Daily Collection)', nameEnglish: 'Daily Collection', category: 'core', description: 'গাড়ির রুটিন জমার রসিদ ও ট্র্যাকিং' },
  { key: 'monthly_collection', nameBangla: 'মাসিক কালেকশন (Monthly Collection)', nameEnglish: 'Monthly Collection', category: 'core', description: 'সমিতি বা সদস্যের মাসিক চাঁদা ও হিসাব' },
  { key: 'income', nameBangla: 'আয় হিসাব (Income)', nameEnglish: 'Income', category: 'core', description: 'বিবিধ আয়ের খতিয়ান' },
  { key: 'expense', nameBangla: 'ব্যয় হিসাব (Expense)', nameEnglish: 'Expense', category: 'core', description: 'দৈনিক ও মাসের খরচ' },
  { key: 'reports', nameBangla: 'রিপোর্টস ও স্টেটমেন্ট (Reports)', nameEnglish: 'Reports', category: 'reports', description: 'কাস্টম কালেকশন ও লেজার রিপোর্ট' },
  { key: 'sms', nameBangla: 'এসএমএস অ্যালার্ট (SMS)', nameEnglish: 'SMS', category: 'integrations', description: 'টাকা জমার স্বয়ংক্রিয় এসএমএস মেসেজ' },
  { key: 'notifications', nameBangla: 'ইন-অ্যাপ নোটিফিকেশন', nameEnglish: 'Notifications', category: 'core', description: 'সিস্টেম এলার্ট ও বকেয়া নোটিশ' },
  { key: 'qr_code', nameBangla: 'কিউআর কোড স্ক্যানার (QR Code)', nameEnglish: 'QR Code', category: 'advanced', description: 'দ্রুত কালেকশন ও মেম্বার স্ক্যান' },
  { key: 'barcode', nameBangla: 'বারকোড জেনারেটর (Barcode)', nameEnglish: 'Barcode', category: 'advanced', description: 'পাস ও রিসিপ্ট বারকোড প্রসেসিং' },
  { key: 'receipt_printing', nameBangla: 'রিসিপ্ট প্রিন্টিং (Receipt Printing)', nameEnglish: 'Receipt Printing', category: 'core', description: 'থার্মাল ও POS প্রিন্টার সাপোর্ট' },
  { key: 'android_tv_dashboard', nameBangla: 'এন্ড্রয়েড টিভি ড্যাশবোর্ড', nameEnglish: 'Android TV Dashboard', category: 'advanced', description: 'টিভি মনিটরে লাইভ কালেকশন স্ট্রিম' },
  { key: 'backup', nameBangla: 'ক্লাউড ব্যাকআপ (Backup)', nameEnglish: 'Backup', category: 'advanced', description: 'স্বয়ংক্রিয় ক্লাউড ডাটা ব্যাকআপ' },
  { key: 'export_pdf', nameBangla: 'পিডিএফ এক্সপোর্ট (Export PDF)', nameEnglish: 'Export PDF', category: 'reports', description: 'রিপোর্ট পিডিএফ ফরম্যাটে ডাউনলোড' },
  { key: 'export_excel', nameBangla: 'এক্সেল এক্সপোর্ট (Export Excel)', nameEnglish: 'Export Excel', category: 'reports', description: 'রিপোর্ট এক্সেল/CSV ফরম্যাটে এক্সপোর্ট' },
  { key: 'ai_analytics', nameBangla: 'এআই প্রেডিক্টিভ এনালাইটিক্স', nameEnglish: 'AI Analytics', category: 'advanced', description: 'স্মার্ট প্রেডিকশন ও অটো রিপোর্ট' },
  { key: 'whatsapp_notification', nameBangla: 'হোয়াটসঅ্যাপ মেসেজিং', nameEnglish: 'WhatsApp Notification', category: 'integrations', description: 'হোয়াটসঅ্যাপে ইনস্ট্যান্ট রসিদ ও রিমাইন্ডার' },
  { key: 'payment_gateway', nameBangla: 'অনলাইন পেমেন্ট গেটওয়ে', nameEnglish: 'Payment Gateway', category: 'integrations', description: 'বিকাশ/নগদ অনলাইন পেমেন্ট রিসিভ' },
  { key: 'api_access', nameBangla: 'এপিআই এক্সেস (API Access)', nameEnglish: 'API Access', category: 'integrations', description: 'থার্ড-পার্টি ইন্টিগ্রেশন এপিআই' }
];
