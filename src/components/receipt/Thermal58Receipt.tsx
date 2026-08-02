import React from 'react';
import { ReceiptRecord, ReceiptTemplateConfig } from '../../types/receipt';
import { BarcodeGenerator } from './BarcodeGenerator';
import { QRCodeGenerator } from './QRCodeGenerator';

interface Props {
  receipt: ReceiptRecord;
  template: ReceiptTemplateConfig;
  isDuplicate?: boolean;
}

export const Thermal58Receipt: React.FC<Props> = ({
  receipt,
  template,
  isDuplicate = false
}) => {
  return (
    <div className="w-[220px] bg-white text-black font-mono text-[11px] p-2 leading-tight shadow-md border border-gray-200 mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:w-full">
      {/* DUPLICATE STAMP IF REPRINT */}
      {(isDuplicate || receipt.isReprint) && (
        <div className="border border-black text-center font-bold text-[12px] py-0.5 mb-1 uppercase tracking-wider bg-gray-100">
          *** ডুপ্লিকেট / পুনঃমুদ্রণ ***
        </div>
      )}

      {/* HEADER / ORG INFO */}
      <div className="text-center pb-2 border-b border-dashed border-black">
        {template.logoUrl && (
          <img
            src={template.logoUrl}
            alt="Org Logo"
            className="w-8 h-8 object-contain mx-auto mb-1 grayscale"
          />
        )}
        <h2 className="font-bold text-[13px] uppercase leading-snug">
          {template.orgName || receipt.tenantName}
        </h2>
        {template.orgAddress && (
          <p className="text-[9px] mt-0.5">{template.orgAddress}</p>
        )}
        {template.orgPhone && (
          <p className="text-[9px]">ফো: {template.orgPhone}</p>
        )}
        <div className="mt-1 font-bold text-[11px] bg-black text-white py-0.5 px-1 uppercase">
          সংগ্রহ রসিদ ভাউচার
        </div>
      </div>

      {/* RECEIPT METADATA */}
      <div className="py-1.5 border-b border-dashed border-black space-y-0.5 text-[10px]">
        <div className="flex justify-between">
          <span className="font-bold">রসিদ নং:</span>
          <span className="font-bold">{receipt.receiptNo}</span>
        </div>
        <div className="flex justify-between">
          <span>তারিখ:</span>
          <span>{receipt.date}</span>
        </div>
        <div className="flex justify-between">
          <span>সময়:</span>
          <span>{receipt.time}</span>
        </div>
        <div className="flex justify-between">
          <span>সংগ্রহকারী:</span>
          <span>{receipt.collectorName}</span>
        </div>
      </div>

      {/* MEMBER & VEHICLE DETAILS */}
      <div className="py-1.5 border-b border-dashed border-black space-y-0.5 text-[10px]">
        <div className="flex justify-between font-bold text-[11px]">
          <span>সদস্য নাম:</span>
          <span className="text-right truncate max-w-[120px]">{receipt.memberName}</span>
        </div>
        <div className="flex justify-between">
          <span>আইডি / কোড:</span>
          <span>{receipt.memberId}</span>
        </div>
        <div className="flex justify-between">
          <span>মোবাইল:</span>
          <span>{receipt.memberPhone}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>গাড়ি নং:</span>
          <span>{receipt.vehicleNo}</span>
        </div>
        {receipt.chargingSlot && (
          <div className="flex justify-between text-blue-900 font-semibold">
            <span>চার্জিং স্লট:</span>
            <span>{receipt.chargingSlot}</span>
          </div>
        )}
      </div>

      {/* PAYMENT SUMMARY */}
      <div className="py-2 border-b border-dashed border-black space-y-1 text-[11px]">
        <div className="flex justify-between font-bold text-[12px]">
          <span>জমা বিবরণ:</span>
          <span>{receipt.chargeType}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span>পেমেন্ট মেথড:</span>
          <span className="uppercase font-semibold">{receipt.paymentMethod}</span>
        </div>

        <div className="bg-gray-100 p-1 rounded space-y-0.5 mt-1 border border-black">
          <div className="flex justify-between font-bold text-[13px] border-b border-black pb-0.5">
            <span>আদায়কৃত টাকা:</span>
            <span>৳ {receipt.amount.toLocaleString()}</span>
          </div>
          {receipt.due > 0 && (
            <div className="flex justify-between text-red-600 font-bold text-[10px]">
              <span>বর্তমান বকেয়া:</span>
              <span>৳ {receipt.due.toLocaleString()}</span>
            </div>
          )}
          {receipt.advance > 0 && (
            <div className="flex justify-between text-green-700 font-bold text-[10px]">
              <span>অগ্রিম জমা:</span>
              <span>৳ {receipt.advance.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* REMARKS */}
      {receipt.remarks && (
        <div className="py-1 border-b border-dashed border-black text-[9px] italic">
          মন্তব্য: {receipt.remarks}
        </div>
      )}

      {/* BARCODE & QR CODE */}
      <div className="py-2 text-center space-y-2 border-b border-dashed border-black">
        {template.showBarcode && (
          <BarcodeGenerator value={receipt.barcode || receipt.receiptNo} width={180} height={32} />
        )}
        {template.showQrCode && (
          <div className="flex justify-center">
            <QRCodeGenerator value={receipt.qrCodeData || receipt.receiptNo} size={60} />
          </div>
        )}
      </div>

      {/* FOOTER & TERMS */}
      <div className="pt-2 text-center space-y-1 text-[8px] text-gray-800">
        <p className="font-semibold">{template.footerNote || 'ধন্যবাদ! সাথে থাকার জন্য ধন্যবাদ।'}</p>
        <p className="text-[7px] border-t border-gray-300 pt-1">
          সফটওয়্যার কারিগরি সহায়তায়: আবাবিল সফটওয়্যার সলিউশন
        </p>
        <div className="text-[6px] tracking-tight pt-1">
          - - - - - - - - কাটুন - - - - - - - -
        </div>
      </div>
    </div>
  );
};
