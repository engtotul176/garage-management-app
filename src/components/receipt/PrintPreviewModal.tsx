import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  RotateCcw, 
  CheckCircle2, 
  Copy,
  FileText
} from 'lucide-react';
import { 
  ReceiptRecord, 
  ReceiptTemplateConfig, 
  PaperSize, 
  InvoiceRecord 
} from '../../types/receipt';
import { Thermal58Receipt } from './Thermal58Receipt';
import { Thermal80Receipt } from './Thermal80Receipt';
import { A4InvoiceReceipt } from './A4InvoiceReceipt';
import { ReceiptService } from '../../services/receiptService';

interface Props {
  receipt?: ReceiptRecord;
  invoice?: InvoiceRecord;
  template: ReceiptTemplateConfig;
  isOpen: boolean;
  onClose: () => void;
  currentUserUid?: string;
  currentUserName?: string;
}

export const PrintPreviewModal: React.FC<Props> = ({
  receipt,
  invoice,
  template,
  isOpen,
  onClose,
  currentUserName = 'আবাবিল এডমিন'
}) => {
  const [selectedPaper, setSelectedPaper] = useState<PaperSize>(
    template.defaultPaperSize || '58mm'
  );
  const [isCopied, setIsCopied] = useState(false);
  const [isReprinting, setIsReprinting] = useState(false);

  if (!isOpen || (!receipt && !invoice)) return null;

  const docNo = receipt?.receiptNo || invoice?.invoiceNo || 'DOC-0000';
  const memberName = receipt?.memberName || invoice?.memberName || 'সদস্য';
  const memberPhone = receipt?.memberPhone || invoice?.memberPhone || '';
  const amount = receipt?.amount || invoice?.paidAmount || 0;

  // 1. ONE CLICK PRINT TRIGGER
  const handlePrint = async () => {
    // Log print action
    await ReceiptService.logPrintAction({
      tenantId: receipt?.tenantId || invoice?.tenantId || 'org_bismillah_001',
      documentType: receipt ? 'receipt' : 'invoice',
      documentNo: docNo,
      action: selectedPaper === '58mm' ? 'print_58mm' : selectedPaper === '80mm' ? 'print_80mm' : 'print_a4',
      printedBy: currentUserName,
      details: `Printed in ${selectedPaper} format`
    });

    if (receipt?.id) {
      await ReceiptService.incrementReprintCount(receipt.id);
    }

    // Native browser print
    window.print();
  };

  // 2. PDF DOWNLOAD (NATIVE PRINT TO PDF)
  const handleDownloadPDF = async () => {
    await ReceiptService.logPrintAction({
      tenantId: receipt?.tenantId || invoice?.tenantId || 'org_bismillah_001',
      documentType: receipt ? 'receipt' : 'invoice',
      documentNo: docNo,
      action: 'pdf_download',
      printedBy: currentUserName,
      details: 'Downloaded PDF document'
    });

    if (receipt?.id) {
      await ReceiptService.incrementReprintCount(receipt.id);
    }

    window.print();
  };

  // 3. WHATSAPP SHARE
  const handleShareWhatsApp = async () => {
    await ReceiptService.logPrintAction({
      tenantId: receipt?.tenantId || invoice?.tenantId || 'org_bismillah_001',
      documentType: receipt ? 'receipt' : 'invoice',
      documentNo: docNo,
      action: 'share_whatsapp',
      printedBy: currentUserName,
      details: `WhatsApp text message generated for ${memberPhone}`
    });

    const text = `*${template.orgName || 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ'}*\n` +
      `অফিশিয়াল জমা রসিদ নম্বর: *${docNo}*\n` +
      `গ্রাহকের নাম: ${memberName}\n` +
      `আদায়কৃত টাকা: ৳ ${amount.toLocaleString()} BDT\n` +
      `তারিখ: ${receipt?.date || invoice?.generatedDate}\n` +
      `আদায়কারী: ${receipt?.collectorName || invoice?.collectorName}\n` +
      `ধন্যবাদ! আপনার অবদানের জন্য ধন্যবাদ।`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = memberPhone
      ? `https://api.whatsapp.com/send?phone=88${memberPhone.replace(/\D/g, '')}&text=${encodedText}`
      : `https://api.whatsapp.com/send?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  };

  // 4. MARK AS REPRINT
  const handleMarkReprint = async () => {
    if (!receipt?.id) return;
    setIsReprinting(true);
    await ReceiptService.incrementReprintCount(receipt.id);
    await ReceiptService.logPrintAction({
      tenantId: receipt.tenantId,
      documentType: 'receipt',
      documentNo: docNo,
      action: 'reprint',
      printedBy: currentUserName,
      details: 'Marked as Duplicate Reprint'
    });
    setTimeout(() => setIsReprinting(false), 500);
  };

  return (
    <div className="fixed inset-[#00000080] z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:fixed-none print:static">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl overflow-hidden my-auto print:shadow-none print:border-none print:w-full print:max-w-none print:m-0">
        
        {/* MODAL HEADER - HIDDEN IN PRINT */}
        <div className="bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">রসিদ ও ইনভয়েস প্রিন্ট প্রিভিউ</h2>
              <p className="text-xs text-slate-300">
                ভাউচার নং: <span className="font-mono text-emerald-400 font-bold">{docNo}</span> ({memberName})
              </p>
            </div>
          </div>

          {/* PAPER SIZE SELECTOR BUTTONS */}
          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setSelectedPaper('58mm')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                selectedPaper === '58mm'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              58mm থার্মাল
            </button>
            <button
              onClick={() => setSelectedPaper('80mm')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                selectedPaper === '80mm'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              80mm থার্মাল
            </button>
            <button
              onClick={() => setSelectedPaper('a4')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                selectedPaper === 'a4'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              A4 স্ট্যান্ডার্ড
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* MODAL ACTION BAR - HIDDEN IN PRINT */}
        <div className="bg-slate-100 px-6 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              প্রিন্ট করুন (One Click)
            </button>

            <button
              onClick={handleDownloadPDF}
              className="bg-slate-800 hover:bg-slate-900 text-white font-medium px-3.5 py-2 rounded-lg text-sm flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              PDF ডাউনলোড
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-3.5 py-2 rounded-lg text-sm flex items-center gap-2 transition"
            >
              <Share2 className="w-4 h-4" />
              হোয়াটসঅ্যাপ শেয়ার
            </button>

            {receipt && (
              <button
                onClick={handleMarkReprint}
                disabled={isReprinting}
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-3.5 py-2 rounded-lg text-sm flex items-center gap-2 transition disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                {receipt.isReprint ? `রিপ্রিন্ট (${receipt.reprintCount || 1})` : 'রিপ্রিন্ট চিহ্নিত'}
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-mono">
            পেপার কাস্টমাইজেশন: <span className="font-bold text-slate-800 uppercase">{selectedPaper}</span>
          </div>
        </div>

        {/* PRINT PREVIEW PAPER CONTAINER */}
        <div className="p-6 bg-slate-200/60 max-h-[70vh] overflow-y-auto flex items-center justify-center print:p-0 print:bg-white print:max-h-none print:overflow-visible">
          <div className="print-area">
            {selectedPaper === '58mm' && (
              <Thermal58Receipt
                receipt={receipt!}
                template={template}
                isDuplicate={receipt?.isReprint}
              />
            )}

            {selectedPaper === '80mm' && (
              <Thermal80Receipt
                receipt={receipt!}
                template={template}
                isDuplicate={receipt?.isReprint}
              />
            )}

            {selectedPaper === 'a4' && (
              <A4InvoiceReceipt
                receipt={receipt}
                invoice={invoice}
                template={template}
                isDuplicate={receipt?.isReprint}
              />
            )}
          </div>
        </div>

        {/* FOOTER TIPS - HIDDEN IN PRINT */}
        <div className="bg-white px-6 py-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500 print:hidden">
          <span>💡 টিপস: থার্মাল প্রিন্টারের জন্য ব্রাউজার প্রিন্ট ডায়ালগে Margins = 'None' সেট করুন।</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
