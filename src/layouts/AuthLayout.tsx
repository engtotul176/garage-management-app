import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useBranding } from '../core/branding/BrandingEngine';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { branding } = useBranding();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="mb-6 text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-black text-xl mx-auto shadow-lg">
          {branding.softwareName.charAt(0)}
        </div>
        <h1 className="text-xl font-extrabold text-white">{branding.softwareName}</h1>
        <p className="text-xs text-slate-400">{branding.companyName}</p>
      </div>

      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
        {children}
      </div>
    </div>
  );
};
