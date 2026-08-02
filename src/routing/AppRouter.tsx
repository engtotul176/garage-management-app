import React from 'react';
import { useAuth } from '../core/auth/AuthContext';
import { useTenant } from '../core/tenant/TenantEngine';
import { AuthMiddleware } from '../core/auth/authMiddleware';
import { RBACMiddleware } from '../core/rbac/rbacMiddleware';
import { LoadingEngine } from '../core/loading/LoadingEngine';

import { LoginPage } from '../components/auth/LoginPage';
import { Step1Overview } from '../components/Step1Overview';
import { SuperAdminPanel } from '../components/SuperAdminPanel';
import { MemberManagementSystem } from '../components/member/MemberManagementSystem';
import { DailyCollectionSystem } from '../components/collection/DailyCollectionSystem';
import { GarageDashboard } from '../components/GarageDashboard';
import { EmployeeRoleManagementSystem } from '../components/employee/EmployeeRoleManagementSystem';
import { ReceiptInvoiceSystem } from '../components/receipt/ReceiptInvoiceSystem';
import { CommunicationSystem } from '../components/communication/CommunicationSystem';
import { AccountingSystem } from '../components/finance/AccountingSystem';
import { ReportsDashboard } from '../components/reports/ReportsDashboard';
import { AndroidTvLiveDashboard } from '../components/tv/AndroidTvLiveDashboard';
import { BackupDashboard } from '../components/backup/BackupDashboard';
import { BillingDashboard } from '../components/billing/BillingDashboard';
import { CustomerPortalDashboard } from '../components/portal/CustomerPortalDashboard';
import { ApiManagementDashboard } from '../components/api/ApiManagementDashboard';
import { EnterpriseAndroidAppDashboard } from '../components/android/EnterpriseAndroidAppDashboard';
import { AiBusinessIntelligenceDashboard } from '../components/analytics/AiBusinessIntelligenceDashboard';
import { GlobalSystemSettingsCenter } from '../components/settings/GlobalSystemSettingsCenter';
import { EnterpriseSecurityHardeningDashboard } from '../components/security/EnterpriseSecurityHardeningDashboard';
import { EnterprisePerformanceDashboard } from '../components/performance/EnterprisePerformanceDashboard';
import { EnterpriseAutomatedQaDashboard } from '../components/qa/EnterpriseAutomatedQaDashboard';
import { EnterpriseDevOpsDashboard } from '../components/devops/EnterpriseDevOpsDashboard';
import { EnterpriseWhiteLabelLicenseDashboard } from '../components/licensing/EnterpriseWhiteLabelLicenseDashboard';
import { EnterpriseFinalReleaseCenter } from '../components/release/EnterpriseFinalReleaseCenter';

interface AppRouterProps {
  activeTab: string;
}

export const AppRouter: React.FC<AppRouterProps> = ({ activeTab }) => {
  const { currentUser, role, loading: authLoading } = useAuth();
  const { currentTenant, tenantsList, updateTenantsList } = useTenant();

  if (authLoading) {
    return <LoadingEngine message="অথেন্টিকেশন ও সিকিউরিটি চেক সম্পন্ন হচ্ছে..." />;
  }

  // Route Protection: Render Login Page if User is not logged in
  if (!currentUser) {
    return <LoginPage />;
  }

  // Validate session status
  const authCheck = AuthMiddleware.validateSession(true, role, currentTenant.status);
  
  if (!authCheck.isSubscriptionActive && role !== 'super_admin') {
    return (
      <div className="p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-3">
        <h2 className="text-lg font-bold text-rose-700 dark:text-rose-300">
          সাবস্ক্রিপশনের মেয়াদ শেষ বা স্থগিত করা হয়েছে
        </h2>
        <p className="text-xs text-rose-600 dark:text-rose-400">
          আপনার অর্গানাইজেশনের সাবস্ক্রিপশন ফি বা লাইসেন্স স্থিতি যাচাই করতে সুপার এডমিনের সাথে যোগাযোগ করুন।
        </p>
      </div>
    );
  }

  switch (activeTab) {
    case 'super_admin_panel':
      if (!RBACMiddleware.hasPermission(role, 'manage_all_tenants')) {
        return (
          <div className="p-6 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-2xl border border-amber-200">
            এই পেজটি শুধুমাত্র সুপার এডমিনদের জন্য সংরক্ষিত।
          </div>
        );
      }
      return (
        <SuperAdminPanel
          organizations={tenantsList}
          onUpdateOrganizations={updateTenantsList}
          branding={{
            softwareName: 'আবাবিল সফটওয়্যার',
            companyName: 'আবাবিল টেকনোলজিস লিঃ',
            logoUrl: '',
            primaryColor: '#7c3aed',
            phone: '০১৭০০-০০০০০',
            email: 'support@ababil-bd.com',
            footerText: 'স্বত্ব © ২০২৬ আবাবিল টেকনোলজিস'
          }}
          onUpdateBranding={() => {}}
        />
      );

    case 'members':
    case 'member_management':
      return (
        <MemberManagementSystem
          tenantId={currentTenant?.id || 'org_bismillah_001'}
          tenantName={currentTenant?.name || 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ'}
          actorName={currentUser?.displayName || currentUser?.email || 'এডমিন ইউজার'}
        />
      );

    case 'daily_collection':
      return (
        <DailyCollectionSystem
          tenantId={currentTenant?.id || 'org_bismillah_001'}
          tenantName={currentTenant?.name || 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ'}
          actorName={currentUser?.displayName || currentUser?.email || 'মোঃ জসিম (ক্যাশিয়ার)'}
        />
      );

    case 'receipt_system':
    case 'receipts':
      return <ReceiptInvoiceSystem />;

    case 'communication_center':
    case 'sms_center':
    case 'notifications':
      return <CommunicationSystem />;

    case 'accounting_system':
    case 'accounting':
    case 'finance':
    case 'financial_management':
      return <AccountingSystem />;

    case 'reports_analytics':
    case 'reports':
    case 'analytics':
    case 'bi':
      return (
        <ReportsDashboard
          tenantId={currentTenant?.id || 'org_bismillah_001'}
          tenantName={currentTenant?.name || 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ'}
          actorName={currentUser?.displayName || currentUser?.email || 'এডমিন ইউজার'}
          isSuperAdmin={role === 'super_admin'}
        />
      );

    case 'android_tv_live':
    case 'tv_dashboard':
    case 'command_center':
      return (
        <AndroidTvLiveDashboard
          tenantId={currentTenant?.id || 'org_bismillah_001'}
          tenantName={currentTenant?.name || 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ & কমান্ড সেন্টার'}
          actorName={currentUser?.displayName || currentUser?.email || 'এডমিন ইউজার'}
        />
      );

    case 'backup_restore':
    case 'backup':
    case 'restore':
    case 'disaster_recovery':
      return (
        <BackupDashboard
          currentTenantId={currentTenant?.id || 'org_bismillah_001'}
          currentTenantName={currentTenant?.name || 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ'}
          actorName={currentUser?.displayName || currentUser?.email || 'সুপার এডমিন ইউজার'}
        />
      );

    case 'payment_billing':
    case 'subscription_engine':
    case 'billing':
    case 'payments':
    case 'invoices':
      return (
        <BillingDashboard
          currentTenantId={currentTenant?.id || 'org_bismillah_001'}
          currentTenantName={currentTenant?.name || 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ'}
          actorName={currentUser?.displayName || currentUser?.email || 'আরিফুল ইসলাম (এডমিন)'}
          isSuperAdmin={role === 'SUPER_ADMIN'}
        />
      );

    case 'customer_portal':
    case 'member_portal':
    case 'portal':
    case 'self_service':
      return (
        <CustomerPortalDashboard
          currentMemberId={currentUser?.uid || 'mem_88201'}
          currentTenantId={currentTenant?.id || 'org_bismillah_001'}
          actorName={currentUser?.displayName || currentUser?.email || 'মোঃ জহিরুল ইসলাম'}
          isOrgAdmin={role === 'ORG_ADMIN' || role === 'SUPER_ADMIN'}
        />
      );

    case 'rest_api':
    case 'api_backend':
    case 'api':
    case 'mobile_backend':
      return (
        <ApiManagementDashboard
          tenantId={currentTenant?.id || 'org_bismillah_001'}
          actorName={currentUser?.displayName || currentUser?.email || 'Engineer Md. Tanveen Ahmed Tutul'}
        />
      );

    case 'android_app':
    case 'mobile_app':
    case 'android':
      return (
        <EnterpriseAndroidAppDashboard
          tenantId={currentTenant?.id || 'org_bismillah_001'}
          actorName={currentUser?.displayName || currentUser?.email || 'Engineer Md. Tanveen Ahmed Tutul'}
        />
      );

    case 'ai_analytics':
    case 'smart_analytics':
      return (
        <AiBusinessIntelligenceDashboard
          tenantId={currentTenant?.id || 'org_bismillah_001'}
          actorName={currentUser?.displayName || currentUser?.email || 'Engineer Md. Tanveen Ahmed Tutul'}
        />
      );

    case 'system_settings_center':
    case 'system_settings':
    case 'global_settings':
    case 'settings_center':
      return <GlobalSystemSettingsCenter />;

    case 'enterprise_security':
    case 'security_compliance':
    case 'security_hardening':
    case 'security_center':
      return <EnterpriseSecurityHardeningDashboard />;

    case 'enterprise_performance':
    case 'performance_scalability':
    case 'performance_dashboard':
    case 'scalability_center':
      return <EnterprisePerformanceDashboard />;

    case 'enterprise_qa':
    case 'qa_center':
    case 'automated_testing':
    case 'code_audit':
      return <EnterpriseAutomatedQaDashboard />;

    case 'enterprise_devops':
    case 'production_deployment':
    case 'devops_center':
    case 'cicd_pipeline':
      return <EnterpriseDevOpsDashboard />;

    case 'whitelabel_licensing':
    case 'license_management':
    case 'customer_provisioning':
    case 'white_label':
      return <EnterpriseWhiteLabelLicenseDashboard />;

    case 'final_release':
    case 'release_center':
    case 'release_notes':
      return <EnterpriseFinalReleaseCenter />;

    case 'dashboard':
      return <GarageDashboard currentOrg={currentTenant} />;

    case 'employee_management':
    case 'employees':
      return <EmployeeRoleManagementSystem />;

    case 'step1_overview':
    default:
      return (
        <Step1Overview
          branding={{
            softwareName: 'আবাবিল সফটওয়্যার',
            companyName: 'আবাবিল টেকনোলজিস লিঃ',
            logoUrl: '',
            primaryColor: '#7c3aed',
            phone: '০১৭০০-০০০০০',
            email: 'support@ababil-bd.com',
            footerText: 'স্বত্ব © ২০২৬ আবাবিল টেকনোলজিস'
          }}
          onUpdateBranding={() => {}}
          organizations={tenantsList}
          currentOrg={currentTenant}
          currentRole={role}
          onRoleChange={() => {}}
          onApproveStep1={() => {}}
          isStep1Approved={true}
        />
      );
  }
};
