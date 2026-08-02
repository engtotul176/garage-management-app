import React, { useState } from 'react';
import { X, Settings, ShieldCheck, Key, Lock, CheckCircle2, Save, CreditCard } from 'lucide-react';
import { PaymentGatewayConfig, PaymentGatewayType } from '../../types/billing';
import { BillingService } from '../../services/billingService';

interface PaymentGatewaySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gateways: PaymentGatewayConfig[];
  onSaveComplete: () => void;
}

export const PaymentGatewaySettingsModal: React.FC<PaymentGatewaySettingsModalProps> = ({
  isOpen,
  onClose,
  gateways,
  onSaveComplete
}) => {
  const [selectedType, setSelectedType] = useState<PaymentGatewayType>('BKASH');
  const [configs, setConfigs] = useState<PaymentGatewayConfig[]>(gateways);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentConfig = configs.find(c => c.gatewayType === selectedType) || {
    id: `gw_${selectedType.toLowerCase()}`,
    gatewayType: selectedType,
    name: selectedType,
    isEnabled: true,
    isSandbox: false,
    merchantId: '',
    apiKey: '',
    secretKey: '',
    accountNumber: '',
    bankName: '',
    branchName: '',
    instructionsBn: '',
    supportedCurrencies: ['BDT']
  };

  const handleUpdateCurrentField = (field: keyof PaymentGatewayConfig, value: any) => {
    setConfigs(prev => {
      const idx = prev.findIndex(c => c.gatewayType === selectedType);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], [field]: value };
        return updated;
      } else {
        return [...prev, { ...currentConfig, [field]: value }];
      }
    });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    for (const cfg of configs) {
      await BillingService.saveGatewayConfig(cfg);
    }
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onSaveComplete();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={saving}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-5">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">পেমেন্ট গেটওয়ে & API ক্র্যাডেনশিয়াল সেটআপ</h3>
            <p className="text-xs text-slate-400">
              সুপার এডমিন কন্ট্রোল: bKash, Nagad, SSLCommerz, Bank, Stripe, PayPal API Keys
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Gateway Selector List */}
          <div className="space-y-1 bg-slate-950 p-2 rounded-2xl border border-slate-800">
            {(['BKASH', 'NAGAD', 'ROCKET', 'SSLCOMMERZ', 'BANK_TRANSFER', 'MANUAL', 'STRIPE', 'PAYPAL'] as PaymentGatewayType[]).map((type) => {
              const cfg = configs.find(c => c.gatewayType === type);
              const active = cfg?.isEnabled ?? false;

              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`w-full p-2.5 rounded-xl text-xs font-black flex items-center justify-between transition-all ${
                    selectedType === type
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span>{type}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {active ? 'ON' : 'OFF'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Config Editor Form */}
          <div className="md:col-span-2 space-y-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
            
            {/* Enable/Disable & Sandbox Toggles */}
            <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <div>
                <span className="font-extrabold text-white block">{selectedType} পেমেন্ট গেটওয়ে সক্রিয়</span>
                <span className="text-[10px] text-slate-400">কাস্টমারকে চেকআউটে অপশনটি দেখাবে</span>
              </div>
              <input
                type="checkbox"
                checked={currentConfig.isEnabled}
                onChange={(e) => handleUpdateCurrentField('isEnabled', e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <div>
                <span className="font-extrabold text-white block">স্যান্ডবক্স / টেস্ট মোড (Sandbox Mode)</span>
                <span className="text-[10px] text-slate-400">প্রোডাকশন পেমেন্ট টেস্ট করতে অন করুন</span>
              </div>
              <input
                type="checkbox"
                checked={currentConfig.isSandbox}
                onChange={(e) => handleUpdateCurrentField('isSandbox', e.target.checked)}
                className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
              />
            </div>

            {/* Fields based on type */}
            <div>
              <label className="block text-slate-400 font-bold mb-1">মার্চেন্ট আইডি / নাম্বার (Merchant ID):</label>
              <input
                type="text"
                value={currentConfig.merchantId || ''}
                onChange={(e) => handleUpdateCurrentField('merchantId', e.target.value)}
                placeholder="e.g. 01711223344 or merchant_code"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {['SSLCOMMERZ', 'STRIPE', 'PAYPAL', 'BKASH'].includes(selectedType) && (
              <>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">API Key / App Key:</label>
                  <input
                    type="password"
                    value={currentConfig.apiKey || ''}
                    onChange={(e) => handleUpdateCurrentField('apiKey', e.target.value)}
                    placeholder="••••••••••••••••••••••••"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Secret Key / Store Password:</label>
                  <input
                    type="password"
                    value={currentConfig.secretKey || ''}
                    onChange={(e) => handleUpdateCurrentField('secretKey', e.target.value)}
                    placeholder="••••••••••••••••••••••••"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </>
            )}

            {selectedType === 'BANK_TRANSFER' && (
              <>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">ব্যাংকের নাম:</label>
                  <input
                    type="text"
                    value={currentConfig.bankName || ''}
                    onChange={(e) => handleUpdateCurrentField('bankName', e.target.value)}
                    placeholder="e.g. BRAC Bank PLC"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">একাউন্ট নম্বর:</label>
                  <input
                    type="text"
                    value={currentConfig.accountNumber || ''}
                    onChange={(e) => handleUpdateCurrentField('accountNumber', e.target.value)}
                    placeholder="e.g. 1501204899120001"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-400 font-bold mb-1">গ্রাহকের পেমেন্ট নির্দেশনা (বাংলায়):</label>
              <textarea
                rows={2}
                value={currentConfig.instructionsBn || ''}
                onChange={(e) => handleUpdateCurrentField('instructionsBn', e.target.value)}
                placeholder="পেমেন্ট করার ধাপগুলো স্পষ্টভাবে লিখুন..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

          </div>

        </div>

        {/* Action Bar */}
        <div className="pt-5 border-t border-slate-800 mt-5 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-400" />
            সকল ক্র্যাডেনশিয়াল AES-256 এনক্রিপ্ট করে সিকিউরড স্টোরেজে রাখা হয়।
          </div>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs rounded-xl shadow-lg transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            {savedSuccess ? 'সংরক্ষিত হয়েছে!' : saving ? 'সেভ হচ্ছে...' : 'সকল পরিবর্তন সেভ করুন'}
          </button>
        </div>

      </div>
    </div>
  );
};
