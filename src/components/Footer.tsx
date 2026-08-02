import React from 'react';
import { OWNER_INFO } from '../config/branding';
import { ShieldCheck, Code, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs py-6 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        
        {/* Left Side: Owner Credits */}
        <div className="space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Powered by {OWNER_INFO.softwareOwner}</span>
          </div>
          <p className="text-slate-400 text-xs">
            Founder & Lead Architect: <span className="text-sky-300 font-semibold">{OWNER_INFO.founderName}</span>
          </p>
        </div>

        {/* Center: System Guarantee */}
        <div className="flex items-center justify-center gap-4 text-slate-400 text-xs">
          <span className="flex items-center gap-1">
            <Code className="w-3.5 h-3.5 text-emerald-400" /> Enterprise Multi-Tenant SaaS Engine
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Firebase Cloud Firestore Secured</span>
        </div>

        {/* Right Side: Copyright */}
        <div className="text-slate-400 text-xs">
          <p>Copyright © {OWNER_INFO.copyrightYear} {OWNER_INFO.softwareOwner}</p>
          <p className="text-slate-500 font-medium">All Rights Reserved | সর্বস্বত্ব সংরক্ষিত</p>
        </div>

      </div>
    </footer>
  );
};
