import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrandingConfig } from '../types/saas';
import { BrandingService, DEFAULT_BRANDING } from '../services/brandingService';

interface BrandingContextType {
  globalBranding: BrandingConfig;
  selectedOrgId: string | null;
  activeOrgBranding: Partial<BrandingConfig> | null;
  effectiveBranding: BrandingConfig;
  loading: boolean;
  updateGlobalBranding: (branding: BrandingConfig) => Promise<void>;
  updateOrgBranding: (orgId: string, branding: Partial<BrandingConfig>) => Promise<void>;
  setSelectedOrgId: (orgId: string | null) => void;
  resetToDefaults: () => Promise<void>;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalBranding, setGlobalBranding] = useState<BrandingConfig>(DEFAULT_BRANDING);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [activeOrgBranding, setActiveOrgBranding] = useState<Partial<BrandingConfig> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Real-time listener for Global Branding settings
  useEffect(() => {
    const unsubscribe = BrandingService.subscribeGlobalBranding(
      (updated) => {
        setGlobalBranding(updated);
        setLoading(false);
      },
      (err) => {
        console.warn('Branding Context error:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Compute effective branding by overriding global branding with active org properties if selected
  const effectiveBranding: BrandingConfig = {
    ...globalBranding,
    ...(activeOrgBranding ? activeOrgBranding : {})
  };

  // Dynamically update DOM title, favicon, and CSS variables whenever effectiveBranding updates
  useEffect(() => {
    BrandingService.applyBrandingToDOM(effectiveBranding);
  }, [effectiveBranding]);

  const updateGlobalBranding = async (newBranding: BrandingConfig) => {
    setGlobalBranding(newBranding);
    await BrandingService.saveGlobalBranding(newBranding);
  };

  const updateOrgBranding = async (orgId: string, orgBranding: Partial<BrandingConfig>) => {
    if (selectedOrgId === orgId) {
      setActiveOrgBranding((prev) => ({ ...prev, ...orgBranding }));
    }
    await BrandingService.saveOrgBranding(orgId, orgBranding);
  };

  const resetToDefaults = async () => {
    setGlobalBranding(DEFAULT_BRANDING);
    await BrandingService.saveGlobalBranding(DEFAULT_BRANDING);
  };

  return (
    <BrandingContext.Provider
      value={{
        globalBranding,
        selectedOrgId,
        activeOrgBranding,
        effectiveBranding,
        loading,
        updateGlobalBranding,
        updateOrgBranding,
        setSelectedOrgId,
        resetToDefaults
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = (): BrandingContextType => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};
