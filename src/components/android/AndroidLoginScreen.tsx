import React, { useState } from 'react';
import { Fingerprint, Lock, Mail, Smartphone, KeyRound, ShieldCheck, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { AndroidUserRole, AndroidSession } from '../../types/androidApp';
import { ROLE_DEFAULT_SESSIONS } from '../../services/androidAppService';

interface AndroidLoginScreenProps {
  onLoginSuccess: (session: AndroidSession) => void;
  isDarkMode: boolean;
}

export const AndroidLoginScreen: React.FC<AndroidLoginScreenProps> = ({
  onLoginSuccess,
  isDarkMode
}) => {
  const [selectedRole, setSelectedRole] = useState<AndroidUserRole>('ORG_ADMIN');
  const [authMethod, setAuthMethod] = useState<'PASSWORD' | 'OTP' | 'BIOMETRIC'>('PASSWORD');
  const [mobileOrEmail, setMobileOrEmail] = useState('01711002233');
  const [password, setPassword] = useState('******');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('889922');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: AndroidUserRole) => {
    setSelectedRole(role);
    const def = ROLE_DEFAULT_SESSIONS[role];
    setMobileOrEmail(def.userEmail);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const session = ROLE_DEFAULT_SESSIONS[selectedRole];
      session.rememberMe = rememberMe;
      session.isLoggedIn = true;
      setLoading(false);
      onLoginSuccess(session);
    }, 600);
  };

  const handleBiometricLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const session = ROLE_DEFAULT_SESSIONS[selectedRole];
      session.biometricEnabled = true;
      session.isLoggedIn = true;
      setLoading(false);
      onLoginSuccess(session);
    }, 700);
  };

  return (
    <div className="space-y-4 py-2">
      
      {/* Brand Header */}
      <div className="text-center space-y-1">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
          <Smartphone className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-black text-slate-900 dark:text-white">
          Ababil Enterprise Android App
        </h3>
        <p className="text-[10px] text-slate-500 dark:text-slate-400">
          Firebase Auth • JWT Token • Biometric Security
        </p>
      </div>

      {/* Role Switcher Pill Bar */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          টেস্ট রোল নির্বাচন করুন (Role Switcher):
        </label>
        <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          {(['SUPER_ADMIN', 'ORG_ADMIN', 'CASH_COLLECTOR', 'MEMBER', 'MANAGER', 'ACCOUNTANT', 'EMPLOYEE'] as AndroidUserRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleSelect(r)}
              className={`px-2 py-1.5 rounded-lg text-[10px] font-extrabold text-left transition-all ${
                selectedRole === r 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Auth Method Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold">
        <button
          type="button"
          onClick={() => setAuthMethod('PASSWORD')}
          className={`flex-1 py-1.5 border-b-2 text-center ${
            authMethod === 'PASSWORD' 
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black' 
              : 'border-transparent text-slate-400'
          }`}
        >
          Password
        </button>

        <button
          type="button"
          onClick={() => setAuthMethod('OTP')}
          className={`flex-1 py-1.5 border-b-2 text-center ${
            authMethod === 'OTP' 
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black' 
              : 'border-transparent text-slate-400'
          }`}
        >
          SMS OTP
        </button>

        <button
          type="button"
          onClick={() => setAuthMethod('BIOMETRIC')}
          className={`flex-1 py-1.5 border-b-2 text-center ${
            authMethod === 'BIOMETRIC' 
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black' 
              : 'border-transparent text-slate-400'
          }`}
        >
          Biometric
        </button>
      </div>

      {/* Login Form */}
      {authMethod === 'BIOMETRIC' ? (
        <div className="text-center py-6 space-y-4 bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-full w-16 h-16 mx-auto flex items-center justify-center animate-pulse">
            <Fingerprint className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">ফিঙ্গারপ্রিন্ট বা ফেস আইডি টাচ করুন</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">ডিভাইসে রেজিস্টার্ড বায়োমেট্রিক সিকিউরিটি সেন্সর</p>
          </div>

          <button
            type="button"
            onClick={handleBiometricLogin}
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
            বায়োমেট্রিক দিয়ে দ্রুত লগইন করুন
          </button>
        </div>
      ) : (
        <form onSubmit={handleLoginSubmit} className="space-y-3">
          
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">
              ইমেইল বা মোবাইল নম্বর:
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                required
                value={mobileOrEmail}
                onChange={(e) => setMobileOrEmail(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {authMethod === 'PASSWORD' && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                পাসওয়ার্ড বা পিন:
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {authMethod === 'OTP' && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                SMS OTP কোড (৬ ডিজিট):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="889922"
                  className="flex-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setOtpSent(true)}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-[10px] font-bold"
                >
                  {otpSent ? 'OTP Sent ✓' : 'Send OTP'}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-[10px]">
            <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0"
              />
              Remember Me
            </label>

            <button type="button" className="text-indigo-500 font-bold hover:underline">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all mt-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                {selectedRole.replace('_', ' ')} অ্যাপে সাইন-ইন
              </>
            )}
          </button>

        </form>
      )}

      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>Firebase JWT Token স্বয়ংক্রিয়ভাবে লোকাল এনক্রিপ্টেড স্টোরেজে সেভ থাকবে।</span>
      </div>

    </div>
  );
};
