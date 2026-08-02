import {
  LicenseTier,
  LicenseStatus,
  CustomerAccount,
  LicenseKeyRecord,
  WhiteLabelBrandingSettings,
  LicenseAuditLog,
  LicenseDashboardSummary
} from '../types/whiteLabelLicense';

const CUSTOMERS_KEY = 'saas_whitelabel_customers_v1';
const LICENSES_KEY = 'saas_whitelabel_license_keys_v1';
const BRANDING_KEY = 'saas_whitelabel_branding_v1';
const LOGS_KEY = 'saas_whitelabel_audit_logs_v1';

const defaultCustomers: CustomerAccount[] = [
  {
    id: 'cust_org_001',
    customerName: 'Rahim Motors Bangladesh Ltd',
    companyName: 'Rahim Group',
    primaryContactEmail: 'contact@rahimmotorsbd.com',
    contactPhone: '+8801711223344',
    orgId: 'tenant_rahim_001',
    status: 'ACTIVE',
    tier: 'ENTERPRISE',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    activatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
    maxMembersLimit: 100,
    maxVehiclesLimit: 5000,
    maxAdminsLimit: 10,
    customDomain: 'garage.rahimmotorsbd.com'
  },
  {
    id: 'cust_org_002',
    customerName: 'Chittagong Auto Care Center',
    companyName: 'Chittagong Auto Care',
    primaryContactEmail: 'admin@ctgautocare.com',
    contactPhone: '+8801819887766',
    orgId: 'tenant_ctgauto_002',
    status: 'ACTIVE',
    tier: 'BUSINESS',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    activatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000).toISOString(),
    maxMembersLimit: 25,
    maxVehiclesLimit: 1000,
    maxAdminsLimit: 3
  },
  {
    id: 'cust_org_003',
    customerName: 'Sylhet Smart Garage Studio',
    companyName: 'Sylhet Auto Traders',
    primaryContactEmail: 'support@sylhetauto.com',
    contactPhone: '+8801912345678',
    orgId: 'tenant_sylhet_003',
    status: 'TRIAL',
    tier: 'TRIAL',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    activatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    maxMembersLimit: 5,
    maxVehiclesLimit: 50,
    maxAdminsLimit: 1
  }
];

const defaultLicenses: LicenseKeyRecord[] = [
  {
    id: 'lic_1',
    licenseKey: 'ABA-2026-X89F-99A1-ENT',
    tier: 'ENTERPRISE',
    assignedCustomerId: 'cust_org_001',
    assignedOrgId: 'tenant_rahim_001',
    status: 'ACTIVE',
    issuedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
    activationsCount: 1,
    maxActivationsAllowed: 10,
    notes: 'Commercial Annual License with Full White Label Branding & Unlimited POS'
  },
  {
    id: 'lic_2',
    licenseKey: 'ABA-2026-B44C-7721-BUS',
    tier: 'BUSINESS',
    assignedCustomerId: 'cust_org_002',
    assignedOrgId: 'tenant_ctgauto_002',
    status: 'ACTIVE',
    issuedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000).toISOString(),
    activationsCount: 1,
    maxActivationsAllowed: 3,
    notes: 'Business Tier with Multi-branch support & Bengali SMS Gateway'
  },
  {
    id: 'lic_3',
    licenseKey: 'ABA-2026-TRL9-1100-TRL',
    tier: 'TRIAL',
    assignedCustomerId: 'cust_org_003',
    assignedOrgId: 'tenant_sylhet_003',
    status: 'ACTIVE',
    issuedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    activationsCount: 1,
    maxActivationsAllowed: 1,
    notes: '14-Day Free Trial License for Sylhet Smart Garage'
  }
];

const defaultBranding: Record<string, WhiteLabelBrandingSettings> = {
  tenant_rahim_001: {
    orgId: 'tenant_rahim_001',
    softwareName: 'Rahim Auto Cloud SaaS',
    companyName: 'Rahim Motors Bangladesh Ltd',
    logoUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=120&auto=format&fit=crop&q=80',
    faviconUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=32&auto=format&fit=crop&q=80',
    primaryBrandColor: '#059669', // Emerald
    secondaryBrandColor: '#0284c7', // Sky
    customLoginMessage: 'Welcome to Rahim Motors Cloud Enterprise SaaS Portal',
    customDashboardGreeting: 'Rahim Motors Management Console',
    customDomainMapping: 'garage.rahimmotorsbd.com',
    whiteLabelEnabled: true,
    updatedAt: new Date().toISOString()
  }
};

const defaultLogs: LicenseAuditLog[] = [
  {
    id: 'log_1',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    licenseKey: 'ABA-2026-X89F-99A1-ENT',
    orgId: 'tenant_rahim_001',
    action: 'ACTIVATED',
    performedBy: 'Super Admin Engine',
    details: 'Provisioned enterprise customer Rahim Motors Bangladesh Ltd with 5000 vehicle capacity.'
  },
  {
    id: 'log_2',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    licenseKey: 'ABA-2026-TRL9-1100-TRL',
    orgId: 'tenant_sylhet_003',
    action: 'GENERATED',
    performedBy: 'Sales Representative',
    details: 'Issued 14-day trial key for Sylhet Smart Garage Studio.'
  }
];

export class WhiteLabelLicenseService {
  // --- Customer Accounts ---
  static getCustomers(): CustomerAccount[] {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    return raw ? JSON.parse(raw) : defaultCustomers;
  }

  static provisionCustomer(
    customerName: string,
    companyName: string,
    email: string,
    phone: string,
    tier: LicenseTier
  ): { customer: CustomerAccount; license: LicenseKeyRecord } {
    const customers = this.getCustomers();
    const licenses = this.getLicenses();
    const orgId = `tenant_${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now().toString().slice(-4)}`;
    
    let daysValidity = 365;
    let maxMembers = 15;
    let maxVehicles = 500;
    let maxAdmins = 2;

    if (tier === 'TRIAL') {
      daysValidity = 14;
      maxMembers = 5;
      maxVehicles = 50;
      maxAdmins = 1;
    } else if (tier === 'STARTER') {
      maxMembers = 5;
      maxVehicles = 150;
      maxAdmins = 1;
    } else if (tier === 'BUSINESS') {
      maxMembers = 30;
      maxVehicles = 1500;
      maxAdmins = 5;
    } else if (tier === 'ENTERPRISE' || tier === 'LIFETIME') {
      daysValidity = tier === 'LIFETIME' ? 36500 : 365;
      maxMembers = 200;
      maxVehicles = 10000;
      maxAdmins = 20;
    }

    const newCust: CustomerAccount = {
      id: `cust_${Date.now()}`,
      customerName,
      companyName,
      primaryContactEmail: email,
      contactPhone: phone,
      orgId,
      status: tier === 'TRIAL' ? 'TRIAL' : 'ACTIVE',
      tier,
      createdAt: new Date().toISOString(),
      activatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + daysValidity * 24 * 3600 * 1000).toISOString(),
      maxMembersLimit: maxMembers,
      maxVehiclesLimit: maxVehicles,
      maxAdminsLimit: maxAdmins
    };

    const licenseKey = `ABA-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${tier.substring(0, 3)}`;

    const newLic: LicenseKeyRecord = {
      id: `lic_${Date.now()}`,
      licenseKey,
      tier,
      assignedCustomerId: newCust.id,
      assignedOrgId: orgId,
      status: 'ACTIVE',
      issuedAt: new Date().toISOString(),
      expiresAt: newCust.expiresAt,
      activationsCount: 1,
      maxActivationsAllowed: maxAdmins,
      notes: `Auto-provisioned customer account for ${companyName}`
    };

    const updatedCustomers = [newCust, ...customers];
    const updatedLicenses = [newLic, ...licenses];

    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updatedCustomers));
    localStorage.setItem(LICENSES_KEY, JSON.stringify(updatedLicenses));

    this.addAuditLog(licenseKey, orgId, 'ACTIVATED', 'Super Admin', `Provisioned new customer ${companyName}`);

    return { customer: newCust, license: newLic };
  }

  // --- Licenses ---
  static getLicenses(): LicenseKeyRecord[] {
    const raw = localStorage.getItem(LICENSES_KEY);
    return raw ? JSON.parse(raw) : defaultLicenses;
  }

  static generateLicenseKey(tier: LicenseTier, notes?: string): LicenseKeyRecord {
    const licenses = this.getLicenses();
    const licenseKey = `ABA-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${tier.substring(0, 3)}`;

    const newLic: LicenseKeyRecord = {
      id: `lic_${Date.now()}`,
      licenseKey,
      tier,
      status: 'PENDING_ACTIVATION',
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (tier === 'TRIAL' ? 14 : 365) * 24 * 3600 * 1000).toISOString(),
      activationsCount: 0,
      maxActivationsAllowed: tier === 'ENTERPRISE' ? 10 : 3,
      notes: notes || `Standalone ${tier} License Key`
    };

    const updated = [newLic, ...licenses];
    localStorage.setItem(LICENSES_KEY, JSON.stringify(updated));
    this.addAuditLog(licenseKey, 'UNASSIGNED', 'GENERATED', 'Super Admin', `Generated new ${tier} standalone license key`);
    return newLic;
  }

  static updateLicenseStatus(licenseId: string, status: LicenseStatus): void {
    const licenses = this.getLicenses();
    const target = licenses.find(l => l.id === licenseId);
    if (!target) return;

    target.status = status;
    localStorage.setItem(LICENSES_KEY, JSON.stringify(licenses));

    // Also suspend customer account if license is suspended
    if (target.assignedCustomerId) {
      const customers = this.getCustomers();
      const cust = customers.find(c => c.id === target.assignedCustomerId);
      if (cust) {
        cust.status = status === 'SUSPENDED' ? 'SUSPENDED' : status === 'ACTIVE' ? 'ACTIVE' : cust.status;
        localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
      }
    }

    this.addAuditLog(
      target.licenseKey,
      target.assignedOrgId || 'N/A',
      status === 'SUSPENDED' ? 'SUSPENDED' : 'RENEWED',
      'Super Admin',
      `Updated license status to ${status}`
    );
  }

  // --- White Label Branding ---
  static getBrandingForOrg(orgId: string): WhiteLabelBrandingSettings {
    const raw = localStorage.getItem(BRANDING_KEY);
    const all = raw ? JSON.parse(raw) : defaultBranding;
    if (all[orgId]) return all[orgId];

    return {
      orgId,
      softwareName: 'Ababil Cloud Garage SaaS',
      companyName: 'Ababil Software Suite',
      logoUrl: '',
      faviconUrl: '',
      primaryBrandColor: '#4f46e5',
      secondaryBrandColor: '#0284c7',
      customLoginMessage: 'Sign in to Ababil Cloud SaaS Workspace',
      customDashboardGreeting: 'Welcome back to your Ababil Garage System',
      whiteLabelEnabled: false,
      updatedAt: new Date().toISOString()
    };
  }

  static saveBrandingForOrg(orgId: string, branding: WhiteLabelBrandingSettings): void {
    const raw = localStorage.getItem(BRANDING_KEY);
    const all = raw ? JSON.parse(raw) : defaultBranding;
    all[orgId] = { ...branding, updatedAt: new Date().toISOString() };
    localStorage.setItem(BRANDING_KEY, JSON.stringify(all));
  }

  // --- Audit Logs ---
  static getAuditLogs(): LicenseAuditLog[] {
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? JSON.parse(raw) : defaultLogs;
  }

  private static addAuditLog(
    licenseKey: string,
    orgId: string,
    action: LicenseAuditLog['action'],
    performedBy: string,
    details: string
  ): void {
    const logs = this.getAuditLogs();
    const newLog: LicenseAuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      licenseKey,
      orgId,
      action,
      performedBy,
      details
    };
    const updated = [newLog, ...logs];
    localStorage.setItem(LOGS_KEY, JSON.stringify(updated));
  }

  // --- Dashboard Summary Metrics ---
  static getSummaryMetrics(): LicenseDashboardSummary {
    const customers = this.getCustomers();
    const licenses = this.getLicenses();

    const activeLicenses = licenses.filter(l => l.status === 'ACTIVE').length;
    const suspendedLicenses = licenses.filter(l => l.status === 'SUSPENDED').length;
    const expiredLicenses = licenses.filter(l => l.status === 'EXPIRED').length;
    const trialCustomers = customers.filter(c => c.tier === 'TRIAL').length;

    let monthlyRev = 0;
    customers.forEach(c => {
      if (c.status === 'ACTIVE') {
        if (c.tier === 'STARTER') monthlyRev += 5000;
        else if (c.tier === 'PROFESSIONAL') monthlyRev += 15000;
        else if (c.tier === 'BUSINESS') monthlyRev += 35000;
        else if (c.tier === 'ENTERPRISE') monthlyRev += 85000;
      }
    });

    return {
      totalCustomersCount: customers.length,
      activeLicensesCount: activeLicenses,
      suspendedLicensesCount: suspendedLicenses,
      expiredLicensesCount: expiredLicenses,
      trialCustomersCount: trialCustomers,
      monthlyRevenueBdt: monthlyRev,
      annualRevenueBdt: monthlyRev * 12,
      trialConversionRatePct: 78.5
    };
  }
}
