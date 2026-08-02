import React, { useState } from 'react';
import { Smartphone, ShieldCheck, Users, RefreshCw, KeyRound, Radio, Cpu, Layers, LogOut, Lock, Wifi, WifiOff } from 'lucide-react';
import { AndroidUserRole, AndroidSession } from '../../types/androidApp';
import { ROLE_DEFAULT_SESSIONS } from '../../services/androidAppService';
import { AndroidDeviceFrame } from './AndroidDeviceFrame';
import { AndroidLoginScreen } from './AndroidLoginScreen';
import { SuperAdminAndroidApp } from './roles/SuperAdminAndroidApp';
import { OrgAdminAndroidApp } from './roles/OrgAdminAndroidApp';
import { CashCollectorAndroidApp } from './roles/CashCollectorAndroidApp';
import { MemberAndroidApp } from './roles/MemberAndroidApp';
import { KotlinCodeExporter } from './KotlinCodeExporter';

interface EnterpriseAndroidAppDashboardProps {
  tenantId?: string;
  actorName?: string;
}

export const EnterpriseAndroidAppDashboard: React.FC<EnterpriseAndroidAppDashboardProps> = ({
  tenantId = 'org_bismillah_001',
  actorName = 'Engineer Md. Tanveen Ahmed Tutul'
}) => {
  const [currentSession, setCurrentSession] = useState<AndroidSession>(ROLE_DEFAULT_SESSIONS.ORG_ADMIN);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [activeTab, setActiveTab] = useState<'EMULATOR' | 'KOTLIN_CODE'>('EMULATOR');

  const handleRoleChange = (role: AndroidUserRole) => {
    const session = ROLE_DEFAULT_SESSIONS[role];
    session.isLoggedIn = true;
    setCurrentSession(session);
  };

  const handleLogout = () => {
    setCurrentSession({
      ...currentSession,
      isLoggedIn: false
    });
  };

  const renderRoleScreen = () => {
    if (!currentSession.isLoggedIn) {
      return (
        <AndroidLoginScreen
          onLoginSuccess={(s) => setCurrentSession(s)}
          isDarkMode={isDarkMode}
        />
      );
    }

    switch (currentSession.userRole) {
      case 'SUPER_ADMIN':
        return <SuperAdminAndroidApp session={currentSession} isDarkMode={isDarkMode} />;

      case 'ORG_ADMIN':
      case 'MANAGER':
      case 'ACCOUNTANT':
        return <OrgAdminAndroidApp session={currentSession} isDarkMode={isDarkMode} />;

      case 'CASH_COLLECTOR':
      case 'EMPLOYEE':
        return (
          <CashCollectorAndroidApp
            session={currentSession}
            isDarkMode={isDarkMode}
            isOffline={isOffline}
          />
        );

      case 'MEMBER':
        return <MemberAndroidApp session={currentSession} isDarkMode={isDarkMode} />;

      default:
        return <OrgAdminAndroidApp session={currentSession} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black border border-indigo-500/20">
              PROMPT-22
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              Kotlin Jetpack Compose MVVM
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Enterprise Android Application Module
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Android Studio Ready • Material Design 3 • Role-Based Dynamic UI • Firebase & JWT Integration
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('EMULATOR')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'EMULATOR'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Android Device Simulator
          </button>

          <button
            onClick={() => setActiveTab('KOTLIN_CODE')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'KOTLIN_CODE'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Kotlin MVVM Architecture
          </button>
        </div>
      </div>

      {activeTab === 'EMULATOR' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Controls & Role Selector Panel */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Active Role Control Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">অ্যাক্টিভ প্রোফাইল ও রুলস</h3>
                  <p className="text-xs text-slate-500">একই অ্যাপে রোল অনুযায়ী ইন্টারেক্টিভ UI সুইচ</p>
                </div>
                {currentSession.isLoggedIn && (
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                    title="Sign Out App"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Role Selector Grid */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                  রোল পরিবর্তন করুন (Interactive Switcher):
                </label>
                
                <div className="grid grid-cols-2 gap-2">
                  {(['SUPER_ADMIN', 'ORG_ADMIN', 'MANAGER', 'CASH_COLLECTOR', 'ACCOUNTANT', 'EMPLOYEE', 'MEMBER'] as AndroidUserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`p-2.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                        currentSession.userRole === r && currentSession.isLoggedIn
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md ring-2 ring-indigo-400'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                      }`}
                    >
                      <span>{r.replace('_', ' ')}</span>
                      {currentSession.userRole === r && currentSession.isLoggedIn && (
                        <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Session Info Box */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 font-mono">
                <div className="flex justify-between items-center text-slate-500">
                  <span>ইউজার:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-sans">{currentSession.userName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>ইমেইল:</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{currentSession.userEmail}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>ডিভাইস আইডি:</span>
                  <span className="text-slate-700 dark:text-slate-300">{currentSession.deviceId}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Firebase JWT:</span>
                  <span className="text-emerald-500 font-bold">VERIFIED ✓</span>
                </div>
              </div>

            </div>

            {/* Features Checklist Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
              <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Enterprise Mobile Feature Spec
              </h4>

              <div className="space-y-2 text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
                  <span>Material Design 3 (Compose)</span>
                  <span className="text-emerald-500 font-bold">ENABLED</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
                  <span>Biometric Fingerprint/Face ID</span>
                  <span className="text-emerald-500 font-bold">READY</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
                  <span>Offline Sync Queue (Room DB)</span>
                  <span className="text-emerald-500 font-bold">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
                  <span>Bluetooth POS Thermal Printing</span>
                  <span className="text-emerald-500 font-bold">DRIVER READY</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Mobile Emulator Display */}
          <div className="lg:col-span-7 flex justify-center">
            <AndroidDeviceFrame
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              isOffline={isOffline}
              onToggleOffline={() => setIsOffline(!isOffline)}
              title={`${currentSession.userRole.replace('_', ' ')} APP`}
            >
              {renderRoleScreen()}
            </AndroidDeviceFrame>
          </div>

        </div>
      ) : (
        <KotlinCodeExporter />
      )}

    </div>
  );
};
