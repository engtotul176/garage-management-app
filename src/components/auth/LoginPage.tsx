import React, { useState } from 'react';
import { Mail, Lock, LogIn, ShieldCheck, AlertCircle, Loader2, Check } from 'lucide-react';
import { useAuth } from '../../core/auth/AuthContext';
import { useBranding } from '../../core/branding/BrandingEngine';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const LoginPage: React.FC = () => {
  const { login, loading, error } = useAuth();
  const { branding } = useBranding();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }
    setLocalError('');
    try {
      await login(email, password, rememberMe);
    } catch (err: any) {
      setLocalError(err.message || 'লগইন ব্যর্থ হয়েছে। ইমেইল ও পাসওয়ার্ড সঠিক কিনা পরীক্ষা করুন।');
    }
  };

  // Quick Demo Account Auto-Fillers
  const fillDemoAccount = (demoEmail: string, demoRole: string) => {
    setEmail(demoEmail);
    setPassword('demo123456');
    setLocalError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Software Header */}
        <div className="text-center space-y-2">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto shadow-lg ring-4 ring-white/10"
            style={{ backgroundColor: branding.primaryColor || '#7c3aed' }}
          >
            {branding.softwareName.charAt(0)}
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">
            {branding.softwareName}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {branding.companyName} — SaaS Enterprise Engine
          </p>
        </div>

        {/* Errors */}
        {(localError || error) && (
          <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              ইমেইল / আইডি (User Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@garage.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300">
                পাসওয়ার্ড (Password)
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-[11px] text-purple-400 hover:text-purple-300 font-bold"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500"
              />
              <span>সেশন মনে রাখুন (Remember Me)</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            <span>লগইন করুন (Sign In)</span>
          </button>
        </form>

        {/* Quick Demo Login Preset Buttons */}
        <div className="pt-4 border-t border-slate-700/60 space-y-2">
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider text-center">
            এক-ক্লিক ডেমো লগইন প্রিসেট:
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => fillDemoAccount('superadmin@ababil.com', 'Super Admin')}
              className="px-3 py-2 bg-slate-900/60 hover:bg-purple-950/60 text-slate-300 hover:text-purple-300 text-[11px] font-bold rounded-xl border border-slate-700/60 transition-all flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>সুপার এডমিন</span>
            </button>

            <button
              onClick={() => fillDemoAccount('admin@garage.com', 'Garage Admin')}
              className="px-3 py-2 bg-slate-900/60 hover:bg-sky-950/60 text-slate-300 hover:text-sky-300 text-[11px] font-bold rounded-xl border border-slate-700/60 transition-all flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>গ্যারেজ এডমিন</span>
            </button>
          </div>
        </div>

      </div>

      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};
