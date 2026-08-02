import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Building2, 
  ArrowRight, 
  Receipt 
} from 'lucide-react';
import { PaymentGatewayType, BillingCycle, SubscriptionInvoice } from '../../types/billing';
import { BillingService } from '../../services/billingService';

interface SubscriptionCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  tenantName: string;
  actorName: string;
  onPaymentSuccess: (invoice: SubscriptionInvoice) => void;
}

export const SubscriptionCheckoutModal: React.FC<SubscriptionCheckoutModalProps> = ({
  isOpen,
  onClose,
  tenantId,
  tenantName,
  actorName,
  onPaymentSuccess
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('Enterprise PRO Suite');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('YEARLY');
  const [gateway, setGateway] = useState<PaymentGatewayType>('BKASH');
  const [senderAccount, setSenderAccount] = useState<string>('01711223344');
  const [trxId, setTrxId] = useState<string>('TRX_' + Math.floor(10000000 + Math.random() * 90000000));
  
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  if (!isOpen) return null;

  // Plan Pricing Calculator
  const getAmount = () => {
    switch (billingCycle) {
      case 'TRIAL': return 0;
      case 'MONTHLY': return 2000;
      case 'QUARTERLY': return 5500;
      case 'HALF_YEARLY': return 10000;
      case 'YEARLY': return 18000;
      case 'LIFETIME': return 50000;
    }
  };

  const amount = getAmount();
  const vat = Math.round(amount * 0.05);
  const totalAmount = amount + vat;

  const handleExecutePayment = async () => {
    setLoading(true);
    setProgress(20);

    setTimeout(async () => {
      setProgress(60);
      try {
        const inv = await BillingService.processPayment({
          tenantId,
          tenantName,
          planName: selectedPlan,
          billingCycle,
          amount,
          gatewayType: gateway,
          transactionId: trxId,
          senderMobileOrAccount: senderAccount,
          paidBy: actorName
        });

        setProgress(100);
        setTimeout(() => {
          setLoading(false);
          onPaymentSuccess(inv);
          onClose();
        }, 800);

      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-5">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">সাবস্ক্রিপশন রিনিউয়াল & অন-ডিমান্ড পেমেন্ট</h3>
            <p className="text-xs text-slate-400">
              ইনস্ট্যান্ট গেটওয়ে প্রসেসিং, ডিজিটাল ইনভয়েস জেনারেটর & অটোমেটেড সার্ভিস অ্যাক্টিভেশন
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mx-auto" />
            <div className="text-sm font-black text-emerald-400 font-mono">
              পেমেন্ট গেটওয়ে প্রসেসিং চলছে... {progress}%
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700 max-w-xs mx-auto">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-indigo-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Step 1: Billing Cycle */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ১. প্যাকেজ মেয়াদকাল (Billing Cycle) সিলেক্ট করুন:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { cycle: 'MONTHLY', label: 'মাসিক (Monthly)', badge: '৳২,০০০/মাস' },
                  { cycle: 'QUARTERLY', label: '৩ মাস (Quarterly)', badge: '৳৫,৫০০ (Save 8%)' },
                  { cycle: 'YEARLY', label: '১ বছর (Yearly)', badge: '৳১৮,০০০ (Best Value)' }
                ].map((item) => (
                  <button
                    key={item.cycle}
                    type="button"
                    onClick={() => setBillingCycle(item.cycle as BillingCycle)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      billingCycle === item.cycle
                        ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-black">{item.label}</div>
                    <div className="text-[10px] text-emerald-400 font-bold mt-1">{item.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Payment Gateway Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ২. পেমেন্ট গেটওয়ে নির্বাচন করুন:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {[
                  { id: 'BKASH', name: 'bKash', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
                  { id: 'NAGAD', name: 'Nagad', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
                  { id: 'ROCKET', name: 'Rocket', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
                  { id: 'SSLCOMMERZ', name: 'SSLCommerz', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
                  { id: 'BANK_TRANSFER', name: 'Bank Wire', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
                  { id: 'MANUAL', name: 'Manual', color: 'bg-slate-800 text-slate-300 border-slate-700' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGateway(item.id as PaymentGatewayType)}
                    className={`p-2.5 rounded-xl text-center border font-extrabold text-xs transition-all ${
                      gateway === item.id
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md scale-105'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Payment Details Inputs */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                <span>মার্চেন্ট একাউন্ট নম্বর:</span>
                <span className="font-mono font-bold text-emerald-400">01711223344 (bKash/Nagad Merchant)</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">প্রেরকের মোবাইল/একাউন্ট:</label>
                  <input
                    type="text"
                    value={senderAccount}
                    onChange={(e) => setSenderAccount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">ট্রানজেকশন ID (TrxID):</label>
                  <input
                    type="text"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 bg-emerald-950/30 border border-emerald-800/60 rounded-2xl text-xs space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>প্যাকেজ মোট ফি ({billingCycle}):</span>
                <span className="font-mono font-bold">৳ {amount.toLocaleString('bn-BD')}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>সরকারি ভ্যাট (৫% VAT):</span>
                <span className="font-mono font-bold text-amber-400">৳ {vat.toLocaleString('bn-BD')}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-emerald-400 pt-2 border-t border-emerald-800">
                <span>সর্বমোট পরিশোধযোগ্য (Net Amount):</span>
                <span>৳ {totalAmount.toLocaleString('bn-BD')} BDT</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleExecutePayment}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                পেমেন্ট কনফার্ম & ইনভয়েস জেনারেট করুন
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
