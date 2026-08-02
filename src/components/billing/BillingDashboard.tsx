import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  Settings, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Building2 
} from 'lucide-react';
import { PaymentGatewayConfig, SubscriptionInvoice, TransactionRecord } from '../../types/billing';
import { BillingService } from '../../services/billingService';
import { BillingHeader } from './BillingHeader';
import { PaymentGatewaySettingsModal } from './PaymentGatewaySettingsModal';
import { SubscriptionCheckoutModal } from './SubscriptionCheckoutModal';
import { InvoicePreviewModal } from './InvoicePreviewModal';
import { TransactionsTable } from './TransactionsTable';

interface BillingDashboardProps {
  currentTenantId?: string;
  currentTenantName?: string;
  actorName?: string;
  isSuperAdmin?: boolean;
}

export const BillingDashboard: React.FC<BillingDashboardProps> = ({
  currentTenantId = 'org_bismillah_001',
  currentTenantName = 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
  actorName = 'আরিফুল ইসলাম (এডমিন)',
  isSuperAdmin = true
}) => {
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>([]);
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Modals
  const [isGatewaySettingsOpen, setIsGatewaySettingsOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SubscriptionInvoice | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [gwList, invList, trxList] = await Promise.all([
        BillingService.fetchGatewayConfigs(),
        BillingService.fetchInvoices(currentTenantId),
        BillingService.fetchTransactions(currentTenantId)
      ]);

      setGateways(gwList);
      setInvoices(invList);
      setTransactions(trxList);
    } catch (e) {
      console.error('Error loading billing data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenantId]);

  // Financial Stats Calculation
  const totalPaidRevenue = invoices
    .filter(i => i.status === 'PAID')
    .reduce((sum, i) => sum + i.netAmount, 0);

  const pendingCount = invoices.filter(i => i.status === 'PENDING_VERIFICATION').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 font-sans">
      
      {/* Header */}
      <BillingHeader
        onRefresh={loadData}
        loading={loading}
        onOpenGatewaySettings={() => setIsGatewaySettingsOpen(true)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        isSuperAdmin={isSuperAdmin}
      />

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
              মোট সাবস্ক্রিপশন রেভিনিউ
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              ৳ {totalPaidRevenue.toLocaleString('bn-BD')} BDT
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              পরিশোধিত সকল চালান
            </div>
          </div>
          <div className="p-3.5 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Current Subscription Plan */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
              বর্তমান একটিভ প্যাকেজ
            </span>
            <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1">
              Enterprise PRO Suite
            </div>
            <div className="text-[11px] text-emerald-500 font-bold mt-1">
              স্ট্যাটাস: ACTIVE (১ বছর মেয়াদ)
            </div>
          </div>
          <div className="p-3.5 bg-indigo-500/10 text-indigo-500 rounded-2xl border border-indigo-500/20">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Enabled Gateways Count */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
              সক্রিয় পেমেন্ট গেটওয়ে
            </span>
            <div className="text-2xl font-black text-sky-600 dark:text-sky-400 font-mono mt-1">
              {gateways.filter(g => g.isEnabled).length} টি মেথড
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">
              bKash, Nagad, Rocket, SSLCommerz
            </div>
          </div>
          <div className="p-3.5 bg-sky-500/10 text-sky-500 rounded-2xl border border-sky-500/20">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
              পেন্ডিং ভেরিফিকেশন
            </span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
              {pendingCount} টি চালান
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">
              ম্যানুয়াল ব্যাংক ট্রান্সফার
            </div>
          </div>
          <div className="p-3.5 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Transactions & Invoices Table */}
      <TransactionsTable
        invoices={invoices}
        onSelectInvoice={(inv) => setSelectedInvoice(inv)}
        onRefresh={loadData}
        isSuperAdmin={isSuperAdmin}
        actorName={actorName}
      />

      {/* Modals */}
      <PaymentGatewaySettingsModal
        isOpen={isGatewaySettingsOpen}
        onClose={() => setIsGatewaySettingsOpen(false)}
        gateways={gateways}
        onSaveComplete={loadData}
      />

      <SubscriptionCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        tenantId={currentTenantId}
        tenantName={currentTenantName}
        actorName={actorName}
        onPaymentSuccess={(inv) => {
          loadData();
          setSelectedInvoice(inv);
        }}
      />

      <InvoicePreviewModal
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />

    </div>
  );
};
