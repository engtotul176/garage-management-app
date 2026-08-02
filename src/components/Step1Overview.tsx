import React, { useState } from 'react';
import { 
  FolderTree, 
  Layers, 
  Database, 
  ShieldCheck, 
  Lock, 
  Palette, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Key, 
  ChevronRight, 
  Code2, 
  Sparkles,
  Server,
  FileCode,
  Users,
  Check,
  Send
} from 'lucide-react';
import { OWNER_INFO } from '../config/branding';
import { BrandingConfig, OrganizationTenant, UserRole } from '../types/saas';
import { MOCK_PACKAGES, PERMISSION_MATRIX } from '../data/mockSaaSData';
import { DEVELOPMENT_ROADMAP } from '../config/roadmap';

interface Step1OverviewProps {
  branding: BrandingConfig;
  onUpdateBranding: (newBranding: Partial<BrandingConfig>) => void;
  organizations: OrganizationTenant[];
  currentOrg: OrganizationTenant;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onApproveStep1: () => void;
  isStep1Approved: boolean;
}

export const Step1Overview: React.FC<Step1OverviewProps> = ({
  branding,
  onUpdateBranding,
  organizations,
  currentOrg,
  currentRole,
  onRoleChange,
  onApproveStep1,
  isStep1Approved
}) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  // Temporary Branding Form State
  const [tempOrgName, setTempOrgName] = useState(branding.orgName);
  const [tempColor, setTempColor] = useState(branding.primaryColor);
  const [tempLogo, setTempLogo] = useState(branding.logoUrl);

  const handleApplyBranding = () => {
    onUpdateBranding({
      orgName: tempOrgName,
      softwareName: tempOrgName,
      primaryColor: tempColor,
      logoUrl: tempLogo
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Step 1 Hero Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-sky-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ধাপ ১ সম্পূর্ণ প্রস্তুত (Step 1 Blueprint Completed)</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Enterprise SaaS Cloud Platform — Architecture Blueprint
            </h2>
            
            <p className="text-sm text-slate-300 leading-relaxed">
              সফটওয়্যার ওনারশিপ: <span className="text-sky-300 font-bold">{OWNER_INFO.softwareOwner}</span> (Founder: <span className="text-sky-300 font-bold">{OWNER_INFO.founderName}</span>)। নিচে ধাপ ১ এর ১০টি আবশ্যক আর্কিটেকচার মোডিউল বিশদভাবে সাজানো হয়েছে।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            {isStep1Approved ? (
              <div className="flex items-center gap-2 bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 px-5 py-3 rounded-xl font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>ধাপ ১ অনুমোদিত (Step 1 Approved)</span>
              </div>
            ) : (
              <button
                onClick={onApproveStep1}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-sky-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Send className="w-4 h-4" />
                <span>ধাপ ১ অনুমোদন দিন ও ধাপ ২ শুরু করুন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 10 Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {[
          { id: 1, name: '১. প্রজেক্ট ফোল্ডার স্ট্রাকচার', icon: FolderTree },
          { id: 2, name: '২ & ৯. মাল্টি-টেন্যান্ট ইঞ্জিন', icon: Layers },
          { id: 3, name: '৩. ফায়ারবেস সিকিউরিটি রুলস', icon: ShieldCheck },
          { id: 4, name: '৪. ফায়ারস্টোর স্কিমা', icon: Database },
          { id: 5, name: '৫. অথেনটিকেশন ফ্লো', icon: Key },
          { id: 6, name: '৬. রোল ও পারমিশন মেট্রিক্স', icon: Lock },
          { id: 7, name: '৭. ডাইনামিক ব্র্যান্ডিং', icon: Palette },
          { id: 8, name: '৮. সাবস্ক্রিপশন ও অটো-লক', icon: CreditCard },
          { id: 9, name: '১০. ডেভেলপমেন্ট রোডম্যাপ', icon: Code2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 shrink-0 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREA */}

      {/* Tab 1: Folder Structure */}
      {activeTab === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-sky-600" />
                ১. প্রজেক্ট ফোল্ডার স্ট্রাকচার (Clean Enterprise Architecture)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                মডিউলার ফাইল আইসোলেশন ও স্কেলেবল ক্লিন আর্কিটেকচার অনুসরন করা হয়েছে।
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md">
              React 19 + TypeScript + Vite
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
              <p className="text-emerald-400 font-bold mb-2">// Project Folder Tree</p>
              <pre className="text-slate-300">
{`/ (Root Workdir)
├── /metadata.json                    # App Title, Permissions & Capabilities
├── /package.json                     # Vite + React 19 + Tailwind CSS
├── /firebase-blueprint.json          # Intermediate Representation Schema
├── /firestore.rules                  # Multi-Tenant Hardened Security Rules
├── /src/
│   ├── /config/
│   │   ├── branding.ts               # Software Owner & Dynamic Themes
│   │   └── roadmap.ts                # 10-Step Development Roadmap
│   ├── /types/
│   │   └── saas.ts                   # Multi-Tenant SaaS Interfaces
│   ├── /data/
│   │   └── mockSaaSData.ts           # Bengali Enterprise Demo Seed
│   ├── /components/
│   │   ├── Header.tsx                # Enterprise Dynamic Header
│   │   ├── Sidebar.tsx               # Bengali Module Navigation
│   │   ├── Footer.tsx                # Ababil Software Owner Footer
│   │   └── Step1Overview.tsx         # Interactive Architecture Dashboard
│   ├── App.tsx                       # Primary Engine Component
│   ├── index.css                     # Tailwind CSS Imports
│   └── main.tsx                      # Entry Point
└── index.html                        # HTML Viewport`}
              </pre>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40">
                <h4 className="font-bold text-xs text-sky-900 dark:text-sky-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" /> মডিউলার আর্কিটেকচার সুবিধা
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 mt-2 space-y-1.5 list-disc list-inside">
                  <li><strong>১০,০০০+ অর্গানাইজেশন স্কেলিং:</strong> স্টেট সম্পূর্ণ আলাদা রাখা হয়েছে।</li>
                  <li><strong>জিরো কোড কলিশন:</strong> প্রতিটি মডিউল স্বতন্ত্র ফাইল হিসেবে ভাগ করা।</li>
                  <li><strong>টাইপ সেফটি:</strong> TypeScript strict type checking নিশ্চিত করা হয়েছে।</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  মূল ওনারশিপ অ্যান্ড সোর্স কোড লাইসেন্স
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Software Owner: <strong>{OWNER_INFO.softwareOwner}</strong><br />
                  Founder: <strong>{OWNER_INFO.founderName}</strong><br />
                  কোনো কাস্টমার বা থার্ড-পার্টি এই কোডের মালিকানা বা ডিরেক্ট সার্ভিস পাবে না।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Multi-Tenant Architecture */}
      {activeTab === 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-600" />
              ২ & ৯. মাল্টি-টেন্যান্ট আইসোলেশন ও ক্লাউড ডেটা পার্টিশনিং
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              একটি মাত্র ক্লাউড ডেটাবেজ অ্যাপ্লিকেশনে শত শত অটো গ্যারেজ ও স্ট্যান্ডের ডেটা সম্পূর্ণ সুরক্ষিত ও বিচ্ছিন্নভাবে সংরক্ষিত থাকে।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {organizations.map((org) => (
              <div 
                key={org.id} 
                className={`p-4 rounded-xl border transition-all ${
                  org.id === currentOrg.id 
                    ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 ring-2 ring-sky-500/20' 
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Tenant ID: {org.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    org.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                    org.status === 'trial' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                    'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                  }`}>
                    {org.status.toUpperCase()}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-3">
                  {org.orgName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ক্যাটাগরি: {org.orgCategory}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <p>গাড়ি/মেম্বার সংখ্যা: <strong>{org.memberCount} টি</strong></p>
                  <p>প্যাকেজ: <strong>{org.packageId.toUpperCase()}</strong></p>
                  <p className="text-[11px] font-mono text-slate-400 truncate">
                    Path: /organizations/{org.id}/members/*
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
            <h4 className="font-bold text-xs text-sky-400 flex items-center gap-2">
              <Server className="w-4 h-4" /> মাল্টি-টেন্যান্ট ডেটা নিরাপত্তা আইন
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              ১. অর্গানাইজেশন A কোনো অবস্থাতেই অর্গানাইজেশন B এর তথ্য বা মেম্বার দেখতে বা পরিবর্তন করতে পারবে না।<br />
              ২. ফায়ারস্টোর সিকিউরিটি রুলসে <code className="text-emerald-300 font-mono">request.auth.token.tenantId</code> যাচাই করে ডেটা পার্টিশনিং নিশ্চিত করা হয়।
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Security Rules */}
      {activeTab === 3 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              ৩. ফায়ারবেস সিকিউরিটি কনফিগারেশন (firestore.rules)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              জিরো-ট্রাস্ট সিকিউরিটি অনুসরণ করে লিখিত প্রোডাকশন গ্রেড ফায়ারস্টোর সিকিউরিটি রুলস।
            </p>
          </div>

          <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
            <pre className="text-slate-300">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Default Deny
    match /{document=**} { allow read, write: if false; }

    function isSuperAdmin() {
      return request.auth != null && 
        (request.auth.token.email == "engtotul176@gmail.com" || 
         get(/databases/$(database)/documents/system/users/$(request.auth.uid)).data.role == "super_admin");
    }

    match /organizations/{orgId} {
      allow read: if isSuperAdmin() || isOrgUser(orgId);
      allow create, update, delete: if isSuperAdmin();

      match /collections/{collectionId} {
        allow read: if isOrgUser(orgId) || isSuperAdmin();
        allow create: if isOrgEmployee(orgId) && isOrgActive(orgId);
        allow delete: if isSuperAdmin(); // Employees CANNOT delete collection vouchers!
      }
    }
  }
}`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Firestore Database Design */}
      {activeTab === 4 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-600" />
              ৪. ফায়ারস্টোর ক্লাউড ডেটাবেজ স্কিমা (Firestore Database Design)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ১০,০০,০০০+ মেম্বার ও দৈনিক লক্ষ লক্ষ কালেকশন ভাউচার দক্ষতার সাথে প্রসেস করার উপযোগী ইন্ডেক্সিং স্কিমা।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { path: '/system/branding', title: 'Global Branding', desc: 'সফটওয়্যার নাম, লোগো, ফুটার ও ওনারশিপ ডেটা' },
              { path: '/packages/{packageId}', title: 'Subscription Tiers', desc: 'স্টার্টার, প্রফেশনাল, বিজনেস ও এন্টারপ্রাইজ' },
              { path: '/organizations/{orgId}', title: 'Tenant Organizations', desc: 'প্রতিটি গ্যারেজ বা স্ট্যান্ডের কাস্টম ইনফরমেশন' },
              { path: '/organizations/{orgId}/members/{memberId}', title: 'Members / Vehicles', desc: 'ড্রাইভারের নাম, গাড়ি নম্বর, ফিস ও কিউআর' },
              { path: '/organizations/{orgId}/collections/{id}', title: 'Daily Collections', desc: 'দৈনিক টাকা জমার হিসাব ও প্রিন্টেড রসিদ' },
              { path: '/auditLogs/{logId}', title: 'Audit Trail', desc: 'নিরাপত্তা ট্র্যাকিং ও ইউজার অ্যাক্টিভিটি লগ' },
            ].map((col, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-950 px-2 py-0.5 rounded">
                  {col.path}
                </span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-2">
                  {col.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {col.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Authentication Flow */}
      {activeTab === 5 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-500" />
              ৫. অথেনটিকেশন ও সাইন-ইন ফ্লো (Multi-Tenant Auth)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ফায়ারবেস অথেনটিকেশন ও কাস্টম টেন্যান্ট ক্লাইম যাচাইকরণ ফ্লো।
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900 text-white space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 w-full sm:w-1/4">
                <p className="text-xs font-bold text-sky-400">১. ইউজার লগইন</p>
                <p className="text-[11px] text-slate-300 mt-1">Firebase Google/Phone Auth</p>
              </div>
              <ChevronRight className="w-5 h-5 text-sky-400 hidden sm:block" />
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 w-full sm:w-1/4">
                <p className="text-xs font-bold text-emerald-400">২. টেন্যান্ট ফিল্টারিং</p>
                <p className="text-[11px] text-slate-300 mt-1">Check /users/{'{uid}'} document</p>
              </div>
              <ChevronRight className="w-5 h-5 text-emerald-400 hidden sm:block" />
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 w-full sm:w-1/4">
                <p className="text-xs font-bold text-purple-400">৩. সাবস্ক্রিপশন চেক</p>
                <p className="text-[11px] text-slate-300 mt-1">Verify Active/Trial Status</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Role & Permission Matrix */}
      {activeTab === 6 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              ৬. রোল বেসড এক্সেস কন্ট্রোল (RBAC Matrix)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              সুপার এডমিন, অর্গানাইজেশন এডমিন, এমপ্লয়ী ও মেম্বারের অ্যাক্সেস সীমানা।
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3">ফিচার নাম</th>
                  <th className="p-3 text-center">Super Admin</th>
                  <th className="p-3 text-center">Org Admin</th>
                  <th className="p-3 text-center">Employee</th>
                  <th className="p-3 text-center">Member</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                {PERMISSION_MATRIX.map((perm) => (
                  <tr key={perm.featureKey} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3">
                      <p className="font-bold text-slate-900 dark:text-white">{perm.featureNameBangla}</p>
                      <p className="text-[11px] text-slate-500">{perm.description}</p>
                    </td>
                    <td className="p-3 text-center">{perm.superAdmin ? '✅' : '❌'}</td>
                    <td className="p-3 text-center">{perm.orgAdmin ? '✅' : '❌'}</td>
                    <td className="p-3 text-center">{perm.employee ? '✅' : '❌'}</td>
                    <td className="p-3 text-center">{perm.member ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 7: Dynamic Branding */}
      {activeTab === 7 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-sky-600" />
              ৭. ডাইনামিক ব্র্যান্ডিং ও থিমিং ইঞ্জিন (Live Engine Test)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              কোনো Branding Hard Code করা হয়নি। নিমিষেই ড্যাশবোর্ড থেকে নাম, লোগো ও থিম পরিবর্তন করা যায়।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                লাইভ ব্র্যান্ডিং টেস্ট চেঞ্জার
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  অর্গানাইজেশন / সফটওয়্যার নাম
                </label>
                <input
                  type="text"
                  value={tempOrgName}
                  onChange={(e) => setTempOrgName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  থিম কালার সিলেক্টর
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tempColor}
                    onChange={(e) => setTempColor(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs font-mono">{tempColor}</span>
                </div>
              </div>

              <button
                onClick={handleApplyBranding}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2.5 rounded-lg shadow-sm transition-all"
              >
                ব্র্যান্ডিং রিয়েলটাইম অ্যাপ্লাই করুন
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                আবশ্যিক ওনারশিপ মেটাডেটা (Fixed in Footer)
              </h4>
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <p>Powered by: <strong className="text-sky-600">{OWNER_INFO.softwareOwner}</strong></p>
                <p>Founder: <strong className="text-sky-600">{OWNER_INFO.founderName}</strong></p>
                <p>সোর্স কোড মালিকানা: <strong>Engineer Md. Tanveen Ahmed Tutul</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Subscription Engine */}
      {activeTab === 8 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              ৮. সাবস্ক্রিপশন বিজনেস মডেল ও অটো-লক ব্যবস্থা
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              মাসিক ও বার্ষিক প্যাকেজ, ট্রায়াল কাউন্টডাউন এবং মেয়াদ শেষ হলে স্বয়ংক্রিয় লগইন বন্ধের ব্যবস্থা।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{pkg.nameBangla}</h4>
                  <div className="mt-2 text-xl font-extrabold text-sky-600 dark:text-sky-400">
                    ৳ {pkg.priceMonthly} <span className="text-xs text-slate-400 font-normal">/মাস</span>
                  </div>
                  <ul className="mt-3 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                  সর্বোচ্চ মেম্বার: {pkg.maxMembers} জন
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 9: Roadmap */}
      {activeTab === 9 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-sky-600" />
              ১০. ডেভেলপমেন্ট রোডম্যাপ (ধাপ ভিত্তিক বাস্তবায়ন)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              আপনার নির্দেশনা অনুযায়ী ধাপ ১ সম্পন্ন করা হয়েছে। পরবর্তী ধাপ সমূহের তালিকা নিচে দেওয়া হলো।
            </p>
          </div>

          <div className="space-y-4">
            {DEVELOPMENT_ROADMAP.map((step) => (
              <div 
                key={step.stepNumber}
                className={`p-4 rounded-xl border transition-all ${
                  step.stepNumber === 1
                    ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {step.titleBangla}
                  </h4>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${
                    step.stepNumber === 1
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {step.stepNumber === 1 ? 'ধাপ ১ প্রস্তুত' : 'পরবর্তী ধাপ'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                  {step.descriptionBangla}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {step.deliverables.map((item, idx) => (
                    <span key={idx} className="text-[11px] bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {!isStep1Approved && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={onApproveStep1}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ধাপ ১ অনুমোদন করুন এবং ধাপ ২ তে অগ্রসর হোন</span>
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
