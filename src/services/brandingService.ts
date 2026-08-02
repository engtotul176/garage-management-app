import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { StorageService } from './storageService';
import { BrandingConfig } from '../types/saas';

export const DEFAULT_BRANDING: BrandingConfig = {
  softwareName: 'আবাবিল গ্যারেজ ও সমিতি ইআরপি',
  companyName: 'আবাবিল সফটওয়্যার সলিউশনস',
  orgName: 'সুপার এডমিন হেডকোয়ার্টার',
  logoUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=120&auto=format&fit=crop&q=80',
  faviconUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=32&auto=format&fit=crop&q=80',
  loginLogoUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=200&auto=format&fit=crop&q=80',
  dashboardLogoUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=120&auto=format&fit=crop&q=80',
  loaderLogoUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=80&auto=format&fit=crop&q=80',
  loginBgUrl: '',
  dashboardBgUrl: '',
  browserTitle: 'আবাবিল ইআরপি - অটো গ্যারেজ ও সমিতি ম্যানেজমেন্ট',
  footerText: 'সর্বস্বত্ব সংরক্ষিত © ২০২৬ আবাবিল ইআরপি। ডিজিটাল গ্যারেজ সলিউশন।',
  copyrightText: 'Copyright © 2026 Ababil Software Solutions. All rights reserved.',
  softwareVersion: 'v2.5.0-PROD',
  themeColor: '#7c3aed',
  primaryColor: '#7c3aed',
  secondaryColor: '#4f46e5',
  sidebarColor: '#0f172a',
  buttonColor: '#7c3aed',
  loginBgColor: '#090d16',
  contactNumber: '+880 1711-002233',
  email: 'support@ababil-erp.com',
  address: 'লেভেল ৪, আবাবিল টাওয়ার, কারওয়ান বাজার, ঢাকা-১২১৫',
  website: 'https://ababil-erp.com',
  showWhiteLabelPoweredBy: true,
  whiteLabelText: 'Powered by Ababil Software Solutions'
};

const GLOBAL_BRANDING_DOC = 'global_branding';
const SETTINGS_COLLECTION = 'settings';

export class BrandingService {
  /**
   * Subscribe in real-time to Global Branding Configuration from Firestore
   */
  static subscribeGlobalBranding(
    onSuccess: (branding: BrandingConfig) => void,
    onError?: (err: Error) => void
  ): () => void {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, GLOBAL_BRANDING_DOC);
      
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as BrandingConfig;
          onSuccess({
            ...DEFAULT_BRANDING,
            ...data
          });
        } else {
          // If doc doesn't exist yet, seed default branding
          this.saveGlobalBranding(DEFAULT_BRANDING).catch(console.warn);
          onSuccess(DEFAULT_BRANDING);
        }
      }, (err) => {
        console.warn('Firestore Branding listener warning, using default branding:', err);
        if (onError) onError(err);
        onSuccess(DEFAULT_BRANDING);
      });

      return unsubscribe;
    } catch (e) {
      console.warn('Branding subscription failed:', e);
      onSuccess(DEFAULT_BRANDING);
      return () => {};
    }
  }

  /**
   * Save Global Branding Settings to Firestore
   */
  static async saveGlobalBranding(branding: BrandingConfig): Promise<void> {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, GLOBAL_BRANDING_DOC);
      await setDoc(docRef, {
        ...branding,
        updatedAt: new Date().toISOString(),
        serverUpdatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn('Error saving global branding to Firestore:', e);
    }
  }

  /**
   * Save Organization Specific Branding Customizations
   */
  static async saveOrgBranding(orgId: string, branding: Partial<BrandingConfig>): Promise<void> {
    try {
      const docRef = doc(db, 'tenants', orgId);
      await setDoc(docRef, {
        orgName: branding.orgName,
        logoUrl: branding.logoUrl,
        primaryColor: branding.primaryColor,
        address: branding.address,
        phone: branding.contactNumber,
        email: branding.email,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn(`Error saving branding for org ${orgId}:`, e);
    }
  }

  /**
   * Upload Media Files for Branding (Logo, Favicon, Backgrounds, etc.)
   */
  static async uploadBrandingImage(file: File, fileTypeKey: string): Promise<string> {
    try {
      const pathKey = `branding/${fileTypeKey}_${Date.now()}`;
      return await StorageService.uploadTenantFile('global', 'logos', file);
    } catch (e) {
      console.warn(`Branding image upload warning (${fileTypeKey}):`, e);
      // Fallback base64 / blob preview if storage offline
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }

  /**
   * Dynamically Apply Branding Settings to HTML DOM (Page Title, Favicon, Root CSS Custom Variables)
   */
  static applyBrandingToDOM(branding: BrandingConfig): void {
    if (typeof document === 'undefined') return;

    // 1. Browser Title
    const titleText = branding.browserTitle || branding.softwareName || 'আবাবিল ইআরপি';
    document.title = titleText;

    // 2. Favicon
    if (branding.faviconUrl) {
      let faviconLink = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(faviconLink);
      }
      faviconLink.href = branding.faviconUrl;
    }

    // 3. CSS Custom Custom Colors
    const root = document.documentElement;
    if (branding.primaryColor) {
      root.style.setProperty('--primary-color', branding.primaryColor);
    }
    if (branding.secondaryColor) {
      root.style.setProperty('--secondary-color', branding.secondaryColor);
    }
    if (branding.sidebarColor) {
      root.style.setProperty('--sidebar-color', branding.sidebarColor);
    }
    if (branding.buttonColor) {
      root.style.setProperty('--button-color', branding.buttonColor);
    }
    if (branding.themeColor) {
      root.style.setProperty('--theme-color', branding.themeColor);
    }
  }
}
