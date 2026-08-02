import React from 'react';
import { CreditCard, Sparkles, RefreshCw, Settings, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface BillingHeaderProps {
  onRefresh: () => void;
  loading: boolean;
  onOpenGatewaySettings: () => void;
  onOpenCheckout: () => void;
  isSuperAdmin: boolean;
}

export const BillingHeader: React.FC<BillingHeaderProps> = ({
  onRefresh,
  loading,
  onOpenGatewaySettings,
  onOpenCheckout,
  isSuperAdmin
}) => {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-1 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> PROMPT-19 Enterprise Payment & Billing Gateway
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-indigo-400" />
          পেমেন্ট গেটওয়ে, সাবস্ক্রিপশন ও বিলিং সিস্টেম
        </h1>
        <p className="text-xs text-slate-300 max-w-2xl">
          bKash, Nagad, Rocket, SSLCommerz, Bank Transfer ও অটোমেটেড ইনভয়েস জেনারেশন, সাবস্ক্রিপশন রিনিউয়াল এবং ট্রানজেকশন হিস্ট্রি।
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0 z-10">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl border border-white/20 transition-all backdrop-blur-md"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          রিফ্রেশ
        </button>

        {isSuperAdmin && (
          <button
            onClick={onOpenGatewaySettings}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg transition-all"
          >
            <Settings className="w-4 h-4" />
            গেটওয়ে কনফিগারেশন
          </button>
        )}

        <button
          onClick={onOpenCheckout}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-2xl shadow-lg transition-all active:scale-95"
        >
          <CreditCard className="w-4 h-4" />
          সাবস্ক্রিপশন রিনিউ / আপগ্রেড
        </button>
      </div>
    </div>
  );
};
