import React, { useState } from 'react';
import { X, Settings, Check, Save } from 'lucide-react';
import { ReceiptTemplateConfig, PaperSize } from '../../types/receipt';
import { ReceiptService } from '../../services/receiptService';

interface Props {
  config: ReceiptTemplateConfig;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updated: ReceiptTemplateConfig) => void;
}

export const TemplateSettingsModal: React.FC<Props> = ({
  config,
  isOpen,
  onClose,
  onSaved
}) => {
  const [formData, setFormData] = useState<ReceiptTemplateConfig>(config);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await ReceiptService.saveTemplateConfig(formData);
    onSaved(formData);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-[#00000080] z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden my-auto">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">প্রিন্ট টেমপ্লেট সেটিং (Template Settings)</h2>
              <p className="text-xs text-slate-300">থার্মাল ও A4 রসিদের লোগো, হেডার ও ফুটারে কাস্টম তথ্য পরিবর্তন করুন</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">প্রতিষ্ঠানের নাম</label>
              <input
                type="text"
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">লোগো ইমেজ লিঙ্ক (URL)</label>
              <input
                type="text"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">প্রতিষ্ঠানের ঠিকানা</label>
              <input
                type="text"
                value={formData.orgAddress}
                onChange={(e) => setFormData({ ...formData, orgAddress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">হেল্পলাইন / ফোন নম্বর</label>
              <input
                type="text"
                value={formData.orgPhone}
                onChange={(e) => setFormData({ ...formData, orgPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">হেডার টেক্সট (অফিশিয়াল টাইটেল)</label>
            <input
              type="text"
              value={formData.headerText}
              onChange={(e) => setFormData({ ...formData, headerText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">ফুটার ধন্যবাদ বার্তা</label>
            <input
              type="text"
              value={formData.footerNote}
              onChange={(e) => setFormData({ ...formData, footerNote: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">শর্তাবলী (Terms & Conditions)</label>
            <textarea
              rows={3}
              value={formData.termsAndConditions}
              onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* TOGGLES */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase">প্রিন্ট এলিমেন্ট ও বারকোড অপশন</h3>

            <div className="grid grid-cols-3 gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.showQrCode}
                  onChange={(e) => setFormData({ ...formData, showQrCode: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                QR কোড দেখান
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.showBarcode}
                  onChange={(e) => setFormData({ ...formData, showBarcode: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                বারকোড দেখান
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.showDigitalSignature}
                  onChange={(e) => setFormData({ ...formData, showDigitalSignature: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                ডিজিটাল স্বাক্ষর ব্লক
              </label>
            </div>
          </div>

          {/* DEFAULT PAPER SIZE */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">ডিফল্ট পেপার সাইজ</label>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {(['58mm', '80mm', 'a4'] as PaperSize[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFormData({ ...formData, defaultPaperSize: size })}
                  className={`py-2 px-3 rounded-lg border font-bold uppercase transition ${
                    formData.defaultPaperSize === size
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {size} {size === '58mm' ? '(ছোট থার্মাল)' : size === '80mm' ? '(মাঝারি থার্মাল)' : '(A4 পেপার)'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              সেটিংস সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
