import React from 'react';
import { BrandingProvider, useBranding as useNewBranding } from '../../context/BrandingContext';

export const BrandingEngine: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrandingProvider>
      {children}
    </BrandingProvider>
  );
};

export const useBranding = () => {
  const context = useNewBranding();
  return {
    branding: context.effectiveBranding,
    updateBranding: (newBranding: any) => context.updateGlobalBranding({ ...context.globalBranding, ...newBranding })
  };
};
