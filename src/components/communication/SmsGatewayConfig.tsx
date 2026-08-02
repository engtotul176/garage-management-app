import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Send, 
  CheckCircle2, 
  RefreshCw, 
  Key, 
  Lock, 
  Building2, 
  CreditCard, 
  SlidersHorizontal,
  Server,
  Zap,
  DollarSign
} from 'lucide-react';
import { CommunicationSettings, SmsGatewayProvider } from '../../types/communication';
import { CommunicationService } from '../../services/communicationService';

interface SmsGatewayConfigProps {
  currentTenantId: string;
  isSuperAdmin: boolean;
  currentUserUid: string;
}

export const SmsGatewayConfig: React.FC<SmsGatewayConfigProps> = ({
  currentTenantId,
  isSuperAdmin,
  currentUserUid
}) => {
  const [settings, setSettings] = useState<CommunicationSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [rechargeAmount, setRechargeAmount] = useState<number>(500);
  const [balanceMode, setBalanceMode] = useState<'recharge' | 'set'>('recharge');
  const [exactBalanceInput, setExactBalanceInput] = useState<number>(0);
  const [rechargeModalOpen, setRechargeModalOpen] = useState<boolean>(false);

  useEffect(() => {
    loadSettings();
  }, [currentTenantId]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await CommunicationService.getSettings(currentTenantId);
      setSettings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    if (!isSuperAdmin) {
      alert('শুধুমাত্র সুপার এডমিন (Super Admin) SMS Gateway কনফিগারেশন পরিবর্তন করতে পারবেন।');
      return;
    }

    setSaving(true);
    try {
      await CommunicationService.updateSettings(currentTenantId, settings, currentUserUid);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      alert('সেটিংস সংরক্ষণ ব্যর্থ হয়েছে!');
    } finally {
      setSaving(false);
    }
  };

  const handleRechargeBalance = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      let newBal = settings.smsBalance;
      if (balanceMode === 'recharge') {
        if (rechargeAmount <= 0) {
          alert('রিচার্জের পরিমাণ ০ এর চেয়ে বেশি হতে হবে।');
          setSaving(false);
          return;
        }
        newBal = Number((settings.smsBalance + rechargeAmount).toFixed(2));
      } else {
        newBal = Number(exactBalanceInput.toFixed(2));
      }

      await CommunicationService.updateSettings(currentTenantId, { smsBalance: newBal }, currentUserUid);
      setSettings(prev => prev ? { ...prev, smsBalance: newBal } : null);
      setRechargeModalOpen(false);
      alert(`SMS ব্যালেন্স সফলভাবে আপডেট করা হয়েছে! নতুন ব্যালেন্স: ৳${newBal}`);
    } catch (e) {
      alert('ব্যালেন্স আপডেট ব্যর্থ হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin mr-3" />
        <span className="text-slate-600 dark:text-slate-300 font-medium">SMS গেটওয়ে তথ্য লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Super Admin Notice Banner */}
      {!isSuperAdmin && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <span className="font-semibold">সিকিউরিটি সতর্কতা:</span> শুধুমাত্র <span className="font-bold underline">Super Admin</span> SMS Provider, API Key ও Sender ID পরিবর্তন করতে পারবেন। অর্গানাইজেশন এডমিন কেবল ব্যালেন্স ও স্ট্যাটাস পর্যবেক্ষণ করতে পারবেন।
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gateway Status */}
        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SMS সিস্টেম স্ট্যাটাস</span>
            <div className={`p-2 rounded-lg ${settings.smsEnabled ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
              <Server className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${settings.smsEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {settings.smsEnabled ? 'সক্রিয় (Active)' : 'বন্ধ (Disabled)'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            অটোমেটিক ও ম্যানুয়াল SMS সার্ভিস
          </p>
        </div>

        {/* SMS Balance */}
        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SMS ফান্ড ব্যালেন্স</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">৳{settings.smsBalance.toLocaleString('bn-BD')}</span>
            <span className="text-xs text-slate-500">BDT</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              আনুমানিক ~{Math.floor(settings.smsBalance / settings.smsRate)} টি SMS
            </span>
            <button
              onClick={() => setRechargeModalOpen(true)}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" />
              রিচার্জ করুন
            </button>
          </div>
        </div>

        {/* Selected Provider & Rate */}
        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SMS প্রোভাইডার & রেট</span>
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white capitalize">
            {settings.smsGateway.replace('_', ' ')}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            প্রতি SMS চার্জ: <span className="font-bold text-emerald-600 dark:text-emerald-400">৳{settings.smsRate} BDT</span>
          </p>
        </div>
      </div>

      {/* Gateway Configuration Form */}
      <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-600" />
              SMS Provider Gateway Setup
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              বাংলাদেশের সেরা প্রোভাইডারসমূহ (Teletalk, Greenweb, BulkSMS BD, SSL Wireless, Twilio)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">সিস্টেম চালু:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.smsEnabled} 
                onChange={(e) => setSettings({ ...settings, smsEnabled: e.target.checked })}
                disabled={!isSuperAdmin}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              SMS প্রোভাইডার সিলেক্ট করুন (Gateway Provider)
            </label>
            <select
              value={settings.smsGateway}
              onChange={(e) => setSettings({ ...settings, smsGateway: e.target.value as SmsGatewayProvider })}
              disabled={!isSuperAdmin}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
            >
              <option value="greenweb">Greenweb BD (Masking / Non-masking)</option>
              <option value="teletalk">Teletalk Govt Gateway</option>
              <option value="bulksms_bd">BulkSMSBD API</option>
              <option value="ssl_wireless">SSL Wireless Push API</option>
              <option value="twilio">Twilio Global Gateway</option>
              <option value="custom_api">Custom REST API Endpoint</option>
            </select>
          </div>

          {/* Sender ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Sender ID / Masking Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={settings.senderId}
                onChange={(e) => setSettings({ ...settings, senderId: e.target.value })}
                disabled={!isSuperAdmin}
                placeholder="যেমন: ABIL_SaaS"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
              />
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              API Key Token
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                disabled={!isSuperAdmin}
                placeholder="আপনার Gateway API Key"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
              />
            </div>
          </div>

          {/* API Secret */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              API Secret / Client Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={settings.apiSecret}
                onChange={(e) => setSettings({ ...settings, apiSecret: e.target.value })}
                disabled={!isSuperAdmin}
                placeholder="API Secret Key"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Cost Per SMS */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              প্রতি SMS ফি রেট (BDT)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="number"
                step="0.01"
                value={settings.smsRate}
                onChange={(e) => setSettings({ ...settings, smsRate: parseFloat(e.target.value) || 0.35 })}
                disabled={!isSuperAdmin}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          {saveSuccess && (
            <div className="flex items-center text-emerald-600 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              সেটিংস সফলভাবে সংরক্ষিত হয়েছে!
            </div>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              disabled={!isSuperAdmin || saving}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  সংরক্ষণ করা হচ্ছে...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  গেটাওয়ে কনফিগারেশন সেভ করুন
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Recharge / Edit Balance Modal */}
      {rechargeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                SMS ব্যালেন্স রিচার্জ ও এডিট (Balance Management)
              </h3>
              <button 
                onClick={() => setRechargeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setBalanceMode('recharge')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  balanceMode === 'recharge' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                + টাকা যোগ/রিচার্জ করুন
              </button>
              <button
                type="button"
                onClick={() => {
                  setBalanceMode('set');
                  setExactBalanceInput(settings.smsBalance);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  balanceMode === 'set' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                ✏️ সরাসরি ব্যালেন্স এডিট/রিসেট
              </button>
            </div>

            {balanceMode === 'recharge' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  রিচার্জ করার পরিমাণ (BDT)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[200, 500, 1000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setRechargeAmount(amt)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        rechargeAmount === amt 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-900 dark:text-white"
                />
                <p className="text-xs text-slate-500 mt-2">
                  বর্তমান ব্যালেন্স (৳{settings.smsBalance}) + নতুন রিচার্জ (৳{rechargeAmount}) = মোট ৳{(settings.smsBalance + rechargeAmount).toFixed(2)}
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  সরাসরি নির্দিষ্ট ব্যালেন্স সেট করুন (BDT)
                </label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setExactBalanceInput(0)}
                    className="px-3 py-1.5 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 rounded-lg"
                  >
                    ব্যালেন্স রিসেট (৳০)
                  </button>
                  <button
                    type="button"
                    onClick={() => setExactBalanceInput(500)}
                    className="px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg"
                  >
                    ডিফল্ট (৳৫০০)
                  </button>
                </div>
                <input
                  type="number"
                  value={exactBalanceInput}
                  onChange={(e) => setExactBalanceInput(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-900 dark:text-white"
                />
                <p className="text-xs text-slate-500 mt-2">
                  আপনি সরাসরি আপনার ইচ্ছামতো SMS ব্যালেন্স কমানো, বাড়ানো বা ০ করতে পারেন।
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setRechargeModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleRechargeBalance}
                disabled={saving}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                {balanceMode === 'recharge' ? 'কনফার্ম রিচার্জ' : 'ব্যালেন্স আপডেট করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
