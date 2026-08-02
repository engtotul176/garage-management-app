import { SoftwareOwnerInfo, BrandingConfig } from '../types/saas';

export const OWNER_INFO: SoftwareOwnerInfo = {
  softwareName: 'Ababil Enterprise Cloud SaaS Engine',
  softwareOwner: 'Ababil Software Solutions',
  founderName: 'Engineer Md. Tanveen Ahmed Tutul',
  founderTitle: 'Founder & Software Architect',
  copyrightYear: '2026',
  supportPhone: '+880 1700-000000',
  supportEmail: 'Engtotul176@gmail.com',
  website: 'https://ababil-solutions.com',
};

export const DEFAULT_DEMO_BRANDING: BrandingConfig = {
  softwareName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
  orgName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
  companyName: 'বিসমিল্লাহ অটো অ্যান্ড ইজিবাইক সার্ভিসেস',
  logoUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=150&auto=format&fit=crop&q=80',
  faviconUrl: '/favicon.ico',
  primaryColor: '#0284c7', // Sky-600
  secondaryColor: '#0f172a', // Slate-900
  domain: 'bismillah-garage.ababil-saas.com',
  address: 'স্টেশন রোড, টার্মিনাল মোড়, ঢাকা, বাংলাদেশ',
  phone: '+880 1711-223344',
  email: 'info@bismillahgarage.com',
  footerText: `Powered by ${OWNER_INFO.softwareOwner} | Founder: ${OWNER_INFO.founderName}`,
};

export function applyDynamicTheme(primaryHex: string) {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--primary-brand-color', primaryHex);
  }
}
