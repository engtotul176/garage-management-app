import React from 'react';
import { ReceiptRecord, ReceiptTemplateConfig, InvoiceRecord } from '../../types/receipt';
import { BarcodeGenerator } from './BarcodeGenerator';
import { QRCodeGenerator } from './QRCodeGenerator';

interface Props {
  receipt?: ReceiptRecord;
  invoice?: InvoiceRecord;
  template: ReceiptTemplateConfig;
  isDuplicate?: boolean;
}

export const A4InvoiceReceipt: React.FC<Props> = ({
  receipt,
  invoice,
  template,
  isDuplicate = false
}) => {
  const docNo = receipt?.receiptNo || invoice?.invoiceNo || 'DOC-0000';
  const memberName = receipt?.memberName || invoice?.memberName || 'অজ্ঞাত সদস্য';
  const memberId = receipt?.memberId || invoice?.memberId || 'N/A';
  const memberPhone = receipt?.memberPhone || invoice?.memberPhone || 'N/A';
  const vehicleNo = receipt?.vehicleNo || invoice?.vehicleNo || 'N/A';
  const collectorName = receipt?.collectorName || invoice?.collectorName || 'অফিস ক্যাশিয়ার';
  const date = receipt?.date || invoice?.generatedDate || new Date().toISOString().split('T')[0];
  const time = receipt?.time || '10:00 AM';
  const amount = receipt?.amount || invoice?.paidAmount || 0;
  const due = receipt?.due ?? invoice?.dueAmount ?? 0;
  const advance = receipt?.advance ?? invoice?.advanceAmount ?? 0;
  const paymentMethod = receipt?.paymentMethod || 'ক্যাশ / অনলাইন';
  const remarks = receipt?.remarks || 'অফিশিয়াল জমা রসিদ ও ইনভয়েস স্টেটমেন্ট';

  return (
    <div className="w-[750px] min-h-[950px] bg-white text-gray-900 font-sans p-8 border border-gray-300 rounded-lg shadow-xl mx-auto print:shadow-none print:border-none print:p-0 print:w-full print:min-h-0">
      {/* REPRINT / DUPLICATE BANNER */}
      {(isDuplicate || receipt?.isReprint) && (
        <div className="mb-4 bg-amber-100 border-2 border-amber-600 text-amber-900 font-bold text-center py-2 text-sm uppercase tracking-widest rounded">
          *** অফিসিয়াল ডুপ্লিকেট রসিদ কফি (REPRINT COPY) ***
        </div>
      )}

      {/* BRANDING & ORG HEADER */}
      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-6">
        <div className="flex items-center gap-4">
          {template.logoUrl ? (
            <img
              src={template.logoUrl}
              alt="Logo"
              className="w-20 h-20 object-contain rounded border border-gray-200 p-1"
            />
          ) : (
            <div className="w-16 h-16 bg-slate-900 text-white font-bold flex items-center justify-center rounded text-xl">
              অর্ঘ্য
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {template.orgName || receipt?.tenantName || 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">{template.orgAddress}</p>
            <p className="text-sm text-gray-700 font-semibold mt-0.5">
              হেল্পলাইন/যোগাযোগ: {template.orgPhone}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-block bg-slate-900 text-white font-bold px-4 py-1.5 text-sm uppercase tracking-wider rounded">
            {invoice ? 'মাসিক ইনভয়েস স্টেটমেন্ট' : 'অফিশিয়াল আদায় রসিদ'}
          </span>
          <p className="text-lg font-bold text-slate-800 mt-2">{docNo}</p>
          <p className="text-xs text-gray-500">তারিখ: {date} | সময়: {time}</p>
        </div>
      </div>

      {/* MEMBER & DOCUMENT SUMMARY GRID */}
      <div className="grid grid-cols-2 gap-6 mb-6 bg-slate-50 p-5 rounded-lg border border-slate-200">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            গ্রাহক / সদস্যর বিবরণ (Member Details)
          </h3>
          <p className="text-lg font-bold text-slate-900">{memberName}</p>
          <div className="mt-2 space-y-1 text-sm text-gray-700">
            <p><span className="font-semibold text-slate-900">সদস্য আইডি:</span> {memberId}</p>
            <p><span className="font-semibold text-slate-900">মোবাইল নম্বর:</span> {memberPhone}</p>
            <p><span className="font-semibold text-slate-900">গাড়ির রেজিস্ট্রেশন নং:</span> {vehicleNo}</p>
            {receipt?.chargingSlot && (
              <p><span className="font-semibold text-slate-900">নিয়োজিত চার্জিং স্লট:</span> {receipt.chargingSlot}</p>
            )}
          </div>
        </div>

        <div className="border-l border-slate-300 pl-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            ট্রানজেকশন তথ্য (Transaction Info)
          </h3>
          <div className="space-y-1.5 text-sm text-gray-700">
            <p><span className="font-semibold text-slate-900">ভাউচার রসিদ নম্বর:</span> {docNo}</p>
            <p><span className="font-semibold text-slate-900">পেমেন্ট মেথড:</span> <span className="uppercase font-bold text-blue-700">{paymentMethod}</span></p>
            <p><span className="font-semibold text-slate-900">অর্থ আদায়কারী:</span> {collectorName}</p>
            <p><span className="font-semibold text-slate-900">স্ট্যাটাস:</span> <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-xs">পরিশোধিত (PAID)</span></p>
          </div>
        </div>
      </div>

      {/* ITEMS / CHARGES TABLE */}
      <div className="mb-6">
        <table className="w-full text-left border-collapse border border-slate-200">
          <thead>
            <tr className="bg-slate-800 text-white text-xs font-bold uppercase">
              <th className="p-3 border border-slate-700">ক্রমিক</th>
              <th className="p-3 border border-slate-700">আদায়ের বিবরণ / খাত</th>
              <th className="p-3 border border-slate-700 text-center">মেথড</th>
              <th className="p-3 border border-slate-700 text-right">পরিমাণ (BDT ৳)</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {invoice?.items && invoice.items.length > 0 ? (
              invoice.items.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-3 border border-slate-200 text-center font-bold">{idx + 1}</td>
                  <td className="p-3 border border-slate-200 font-semibold">{item.description}</td>
                  <td className="p-3 border border-slate-200 text-center uppercase text-xs font-bold">{paymentMethod}</td>
                  <td className="p-3 border border-slate-200 text-right font-bold">৳ {item.amount.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr className="border-b border-slate-200">
                <td className="p-3 border border-slate-200 text-center font-bold">১</td>
                <td className="p-3 border border-slate-200 font-semibold">
                  {receipt?.chargeType || 'দৈনিক গ্যারেজ চার্জ, ব্যাটারি চার্জিং & নাইট গার্ড সার্ভিস'}
                </td>
                <td className="p-3 border border-slate-200 text-center uppercase text-xs font-bold">{paymentMethod}</td>
                <td className="p-3 border border-slate-200 text-right font-bold">৳ {amount.toLocaleString()}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FINANCIAL SUMMARY & BREAKDOWN */}
      <div className="flex justify-between items-start gap-8 mb-8">
        <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs text-gray-700 space-y-2">
          <p className="font-bold text-slate-900 uppercase">মন্তব্য ও শর্তাবলী:</p>
          <p className="italic">{remarks}</p>
          {template.termsAndConditions && (
            <p className="text-gray-600 border-t border-gray-300 pt-2">{template.termsAndConditions}</p>
          )}
        </div>

        <div className="w-72 bg-slate-900 text-white p-5 rounded-lg space-y-2.5">
          <div className="flex justify-between text-base font-bold border-b border-slate-700 pb-2">
            <span>সর্বমোট পরিশোধিত:</span>
            <span className="text-emerald-400">৳ {amount.toLocaleString()} BDT</span>
          </div>
          <div className="flex justify-between text-xs text-red-300">
            <span>অবশিষ্ট বকেয়া (Due):</span>
            <span className="font-bold">৳ {due.toLocaleString()} BDT</span>
          </div>
          <div className="flex justify-between text-xs text-emerald-300">
            <span>অগ্রিম জমা (Advance):</span>
            <span className="font-bold">৳ {advance.toLocaleString()} BDT</span>
          </div>
        </div>
      </div>

      {/* BARCODE & QR VALIDATION */}
      <div className="flex items-center justify-between border-t border-b border-slate-200 py-4 mb-12">
        {template.showBarcode && (
          <BarcodeGenerator value={receipt?.barcode || docNo} width={220} height={45} />
        )}
        {template.showQrCode && (
          <div className="flex items-center gap-3">
            <QRCodeGenerator value={receipt?.qrCodeData || docNo} size={70} />
            <div className="text-[10px] text-gray-500 max-w-[150px]">
              ডিজিটাল ভাউচার কিউআর কোড যাচাই করুন। আবাবিল এনক্রিপ্টেড সিকিউরিটি কিউআর।
            </div>
          </div>
        )}
      </div>

      {/* AUTHORIZATION SIGNATURES */}
      {template.showDigitalSignature && (
        <div className="mt-16 pt-8 grid grid-cols-2 gap-12 text-center text-sm font-bold text-slate-800">
          <div>
            <div className="border-t-2 border-slate-800 w-48 mx-auto pt-2">
              গ্রাহক / সদস্য স্বাক্ষর
            </div>
            <p className="text-xs text-gray-500 font-normal mt-1">{memberName}</p>
          </div>

          <div>
            <div className="border-t-2 border-slate-800 w-48 mx-auto pt-2">
              অনুমোদিত ক্যাশিয়ার / ক্যাশ ইনচার্জ
            </div>
            <p className="text-xs text-gray-500 font-normal mt-1">{collectorName}</p>
          </div>
        </div>
      )}

      {/* FOOTER CREDITS */}
      <div className="mt-12 text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
        <p className="font-medium text-gray-700">{template.footerNote || 'আপনার সদয় অবদানের জন্য ধন্যবাদ।'}</p>
        <p className="text-[10px] text-gray-400 mt-1">
          সফটওয়্যার কারিগরি সহায়তা ও ডিজাইন: আবাবিল সফটওয়্যার সলিউশন (প্রকৌশলী মোঃ তানভীন আহমেদ টুটুল)
        </p>
      </div>
    </div>
  );
};
