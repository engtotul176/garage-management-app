import React from 'react';
import { ReceiptRecord, ReceiptTemplateConfig } from '../../types/receipt';
import { BarcodeGenerator } from './BarcodeGenerator';
import { QRCodeGenerator } from './QRCodeGenerator';

interface Props {
  receipt: ReceiptRecord;
  template: ReceiptTemplateConfig;
  isDuplicate?: boolean;
}

export const Thermal80Receipt: React.FC<Props> = ({
  receipt,
  template,
  isDuplicate = false
}) => {
  return (
    <div className="w-[300px] bg-white text-black font-mono text-[12px] p-3 leading-snug shadow-md border border-gray-200 mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:w-full">
      {/* DUPLICATE STAMP IF REPRINT */}
      {(isDuplicate || receipt.isReprint) && (
        <div className="border-2 border-black text-center font-bold text-[13px] py-1 mb-2 uppercase tracking-widest bg-gray-100">
          *** ডুপ্লিকেট রসিদ / REPRINT COPY ***
        </div>
      )}

      {/* HEADER / ORG INFO */}
      <div className="text-center pb-2 border-b-2 border-black">
        <div className="flex justify-center items-center gap-2 mb-1">
          {template.logoUrl && (
            <img
              src={template.logoUrl}
              alt="Org Logo"
              className="w-10 h-10 object-contain grayscale"
            />
          )}
          <h2 className="font-bold text-[15px] uppercase leading-tight text-black">
            {template.orgName || receipt.tenantName}
          </h2>
        </div>
        {template.orgAddress && (
          <p className="text-[10px] text-gray-800">{template.orgAddress}</p>
        )}
        {template.orgPhone && (
          <p className="text-[10px] font-semibold">ফোন: {template.orgPhone}</p>
        )}
        <div className="mt-2 font-bold text-[12px] bg-black text-white py-1 px-2 uppercase tracking-wider">
          দৈনিক ও মাসিক ক্যাশ আদায় রসিদ
        </div>
      </div>

      {/* METADATA TABLE */}
      <div className="py-2 border-b border-dashed border-black space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span className="text-gray-700">ভাউচার রসিদ নং:</span>
          <span className="font-bold text-[12px]">{receipt.receiptNo}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">আদায়ের তারিখ ও সময়:</span>
          <span className="font-semibold">{receipt.date} ({receipt.time})</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">আদায়কারী কর্মকর্তা:</span>
          <span className="font-semibold">{receipt.collectorName}</span>
        </div>
      </div>

      {/* MEMBER & VEHICLE DETAILS */}
      <div className="py-2 border-b border-dashed border-black space-y-1 text-[11px]">
        <div className="flex justify-between font-bold text-[12px]">
          <span>গ্রাহক / সদস্য নাম:</span>
          <span className="text-right truncate max-w-[160px]">{receipt.memberName}</span>
        </div>
        <div className="flex justify-between">
          <span>মেম্বারশিপ কোড:</span>
          <span className="font-semibold">{receipt.memberId}</span>
        </div>
        <div className="flex justify-between"><span>মোবাইল নম্বর:</span><span>{receipt.memberPhone}</span></div>
        <div className="flex justify-between font-bold text-[12px] bg-gray-50 p-1 border border-gray-300">
          <span>গাড়ির নম্বর:</span>
          <span>{receipt.vehicleNo}</span>
        </div>
        {receipt.chargingSlot && (
          <div className="flex justify-between font-semibold text-blue-900">
            <span>গ্যারেজ চার্জিং স্লট:</span>
            <span>{receipt.chargingSlot}</span>
          </div>
        )}
      </div>

      {/* BREAKDOWN TABLE */}
      <div className="py-2 border-b-2 border-black">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-black font-bold">
              <th className="py-1">বিবরণ</th>
              <th className="py-1 text-right">মেথড</th>
              <th className="py-1 text-right">পরিমাণ (৳)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1 font-semibold">{receipt.chargeType}</td>
              <td className="py-1 text-right uppercase text-[10px] font-bold">{receipt.paymentMethod}</td>
              <td className="py-1 text-right font-bold text-[13px]">৳ {receipt.amount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        {/* SUMMARY FINANCIAL BOX */}
        <div className="mt-2 bg-gray-100 p-2 rounded border border-black space-y-1">
          <div className="flex justify-between font-bold text-[14px] text-black border-b border-gray-400 pb-1">
            <span>মোট আদায়:</span>
            <span>৳ {receipt.amount.toLocaleString()} BDT</span>
          </div>
          <div className="flex justify-between text-[11px] text-red-700 font-bold">
            <span>অবশিষ্ট বকেয়া:</span>
            <span>৳ {receipt.due.toLocaleString()} BDT</span>
          </div>
          <div className="flex justify-between text-[11px] text-green-800 font-bold">
            <span>অগ্রিম তহবিল জমা:</span>
            <span>৳ {receipt.advance.toLocaleString()} BDT</span>
          </div>
        </div>
      </div>

      {/* REMARKS & SIGNATURE */}
      {receipt.remarks && (
        <div className="py-1.5 border-b border-dashed border-black text-[10px] italic">
          <span className="font-semibold">বিশেষ মন্তব্য:</span> {receipt.remarks}
        </div>
      )}

      {/* DIGITAL SIGNATURE */}
      {template.showDigitalSignature && (
        <div className="py-3 flex justify-between items-end border-b border-dashed border-black text-[9px]">
          <div className="text-center">
            <div className="border-t border-black w-20 mx-auto pt-0.5">গ্রাহকের স্বাক্ষর</div>
          </div>
          <div className="text-center">
            <div className="font-serif italic font-bold text-[11px] text-gray-800 mb-1">
              {receipt.collectorName}
            </div>
            <div className="border-t border-black w-24 mx-auto pt-0.5">ক্যাশিয়ার/ম্যানেজার</div>
          </div>
        </div>
      )}

      {/* BARCODE & QR CODE */}
      <div className="py-2 flex items-center justify-between border-b border-dashed border-black">
        {template.showBarcode && (
          <BarcodeGenerator value={receipt.barcode || receipt.receiptNo} width={150} height={36} />
        )}
        {template.showQrCode && (
          <QRCodeGenerator value={receipt.qrCodeData || receipt.receiptNo} size={60} />
        )}
      </div>

      {/* FOOTER & TERMS */}
      <div className="pt-2 text-center space-y-1 text-[9px] text-gray-700">
        <p className="font-semibold">{template.footerNote || 'আপনার গাড়ি নিরাপদে রাখুন। ধন্যবাদ!'}</p>
        {template.termsAndConditions && (
          <p className="text-[8px] text-gray-600 line-clamp-2 mt-1 leading-tight">{template.termsAndConditions}</p>
        )}
        <p className="text-[8px] text-gray-500 pt-1">
          সফটওয়্যার ডেভেলপমেন্ট: আবাবিল সফটওয়্যার সলিউশন
        </p>
      </div>
    </div>
  );
};
