import React from 'react';
import { ShieldCheck, Phone, Heart } from 'lucide-react';
import { useBranding } from '../../core/branding/BrandingEngine';

export const FooterShell: React.FC = () => {
  const { branding } = useBranding();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-6 px-4 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <p className="font-semibold text-slate-300">
            {branding.footerText} — {branding.companyName}
          </p>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-slate-300">
            <Phone className="w-3.5 h-3.5 text-purple-400" />
            হেল্পলাইন: {branding.phone}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-bold">
            Enterprise Multi-Tenant Engine v2.0
          </span>
        </div>

      </div>
    </footer>
  );
};
