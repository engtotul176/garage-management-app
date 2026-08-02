import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Building2, FileText, CreditCard } from 'lucide-react';
import { SubscriptionInvoice } from '../../types/billing';

interface InvoicePreviewModalProps {
  invoice: SubscriptionInvoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  invoice,
  isOpen,
  onClose
}) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        
        {/* Action Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <FileText className="w-4 h-4 text-emerald-600" />
            অফিসিয়াল ডিজিটাল ইনভয়েস & পেমেন্ট মানি রিসিট
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              প্রিন্ট / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div className="space-y-6">
          
          {/* Header & Logo */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">ABABIL CLOUD SAAS</h2>
              <p className="text-xs text-slate-500">Enterprise Garage & ERP Management Platform</p>
              <p className="text-[11px] text-slate-400 mt-1">ঢাকা, বাংলাদেশ | সাপোর্ট: support@ababilcloud.com</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {invoice.status} (পরিশোধিত)
              </span>
              <div className="text-xs font-mono font-bold text-slate-700 mt-2">
                ইনভয়েস নং: {invoice.invoiceNumber}
              </div>
              <div className="text-[11px] text-slate-500">
                তারিখ: {new Date(invoice.paidAt).toLocaleDateString('bn-BD')}
              </div>
            </div>
          </div>

          {/* Billed To & Gateway Info */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">গ্রহীতা প্রতিষ্ঠান:</span>
              <div className="font-extrabold text-slate-900 text-sm mt-0.5">{invoice.tenantName}</div>
              <div className="text-slate-500 mt-0.5">টেন্যান্ট ID: {invoice.tenantId}</div>
              <div className="text-slate-500">পরিশোধকারী: {invoice.paidBy}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">পেমেন্ট মেথড বিবরণী:</span>
              <div className="font-bold text-slate-900 mt-0.5">গেটওয়ে: {invoice.gatewayType}</div>
              <div className="font-mono text-emerald-600 font-bold">TrxID: {invoice.transactionId}</div>
              <div className="text-slate-500">একাউন্ট: {invoice.senderMobileOrAccount || 'N/A'}</div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase">
                <th className="py-2.5">বিবরণ (Particulars)</th>
                <th className="py-2.5">মেয়াদকাল</th>
                <th className="py-2.5 text-right">পরিমাণ (BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr>
                <td className="py-3">
                  <div className="font-bold text-slate-900">{invoice.planName} Subscription</div>
                  <div className="text-[10px] text-slate-500">{invoice.notes}</div>
                </td>
                <td className="py-3 font-semibold text-slate-700">
                  {new Date(invoice.periodStart).toLocaleDateString('bn-BD')} - {new Date(invoice.periodEnd).toLocaleDateString('bn-BD')}
                </td>
                <td className="py-3 text-right font-mono font-bold text-slate-900">
                  ৳ {invoice.amount.toLocaleString('bn-BD')}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-slate-500">সরকারি ভ্যাট (৫% VAT)</td>
                <td className="py-2">--</td>
                <td className="py-2 text-right font-mono text-slate-700">
                  ৳ {invoice.taxAmount.toLocaleString('bn-BD')}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900 text-sm font-black">
                <td colSpan={2} className="py-3 text-right">সর্বমোট প্রাপ্তি (Net Paid):</td>
                <td className="py-3 text-right text-emerald-600 font-mono">
                  ৳ {invoice.netAmount.toLocaleString('bn-BD')} BDT
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Footer Signature */}
          <div className="pt-8 flex justify-between items-end text-[11px] text-slate-400 border-t border-slate-100">
            <div>
              <div className="font-bold text-slate-700">কম্পিউটার জেনারেটেড ইনভয়েস</div>
              <div>কোনো স্বাক্ষর প্রয়োজন নেই।</div>
            </div>
            <div className="text-right">
              <div className="w-32 border-b border-slate-300 mb-1" />
              <div className="font-bold text-slate-700">অথরাইজড অ্যাকাউন্টস সিগনেচার</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
