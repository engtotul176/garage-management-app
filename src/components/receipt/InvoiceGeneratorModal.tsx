import React, { useState } from 'react';
import { X, FileText, Plus, Trash2, Calendar, User, CheckCircle } from 'lucide-react';
import { InvoiceRecord, InvoiceType, InvoiceItem } from '../../types/receipt';
import { ReceiptService } from '../../services/receiptService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreated: (invoice: InvoiceRecord) => void;
}

export const InvoiceGeneratorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onInvoiceCreated
}) => {
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('monthly');
  const [memberName, setMemberName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [monthYear, setMonthYear] = useState('2026-07');
  const [collectorName, setCollectorName] = useState('রফিকুল ইসলাম (ম্যানেজার)');

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'মাসিক গ্যারেজ চার্জিং ফ্রি', amount: 3000 },
    { id: '2', description: 'নাইট গার্ড ও সিকিউরিটি ফি', amount: 500 }
  ]);

  const [paidAmount, setPaidAmount] = useState(3000);
  const [dueAmount, setDueAmount] = useState(500);
  const [advanceAmount, setAdvanceAmount] = useState(0);

  if (!isOpen) return null;

  const totalAmount = items.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: 'অতিরিক্ত সার্ভিস ফি', amount: 200 }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleItemChange = (id: string, field: 'description' | 'amount', value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: field === 'amount' ? Number(value) : value };
      }
      return item;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invNo = `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice: InvoiceRecord = {
      id: `inv_${Date.now()}`,
      invoiceNo: invNo,
      tenantId: 'org_bismillah_001',
      tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
      memberId: memberId || `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
      memberName: memberName || 'জহিরুল ইসলাম',
      memberPhone: memberPhone || '01712003344',
      membershipNumber: memberId || 'MS-5001',
      vehicleNo: vehicleNo || 'ঢাকা মেট্রো-থ-১৫-৯৯০০',
      invoiceType,
      monthYear,
      items,
      totalAmount,
      paidAmount,
      dueAmount,
      advanceAmount,
      status: dueAmount === 0 ? 'paid' : paidAmount > 0 ? 'partial' : 'unpaid',
      generatedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      collectorName,
      qrCodeData: `${invNo}|${memberName}|TOTAL:${totalAmount}|DUE:${dueAmount}`,
      barcode: invNo.replace(/-/g, ''),
      createdAt: new Date().toISOString()
    };

    await ReceiptService.createInvoice(newInvoice);
    onInvoiceCreated(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-[#00000080] z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden my-auto">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">নতুন ইনভয়েস স্টেটমেন্ট তৈরি করুন</h2>
              <p className="text-xs text-slate-300">মাসিক চার্জ, বকেয়া এবং অগ্রিম হিসাব ইনভয়েস জেনারেটর</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* INVOICE TYPE */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
              ইনভয়েসের ধরণ (Invoice Category)
            </label>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setInvoiceType('monthly')}
                className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition ${
                  invoiceType === 'monthly'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                মাসিক বিল ইনভয়েস
              </button>
              <button
                type="button"
                onClick={() => setInvoiceType('due')}
                className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition ${
                  invoiceType === 'due'
                    ? 'bg-red-50 border-red-500 text-red-800 shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                বকেয়া ডিমান্ড বিল
              </button>
              <button
                type="button"
                onClick={() => setInvoiceType('advance')}
                className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition ${
                  invoiceType === 'advance'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                অগ্রিম জমা ইনভয়েস
              </button>
            </div>
          </div>

          {/* MEMBER SELECTION */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">সদস্যের নাম</label>
              <input
                type="text"
                required
                placeholder="যেমন: মোঃ জহিরুল ইসলাম"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">মেম্বার আইডি / মোবাইল</label>
              <input
                type="text"
                placeholder="যেমন: MEM-2026-005"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">মোবাইল</label>
              <input
                type="text"
                placeholder="01700112233"
                value={memberPhone}
                onChange={(e) => setMemberPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">গাড়ির নম্বর</label>
              <input
                type="text"
                placeholder="ঢাকা মেট্রো-থ-১১-১২৩৪"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">মাস ও বছর</label>
              <input
                type="month"
                value={monthYear}
                onChange={(e) => setMonthYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* ITEM LINE BREAKDOWN */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-700 uppercase">সার্ভিস ও চার্জ খাতের বিবরণ</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> খাত যোগ করুন
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="w-32 relative">
                    <span className="absolute left-2.5 top-2 text-xs text-gray-500">৳</span>
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleItemChange(item.id, 'amount', e.target.value)}
                      className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded-lg text-sm font-bold text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FINANCIAL SUMMARY */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex justify-between font-bold text-base text-slate-900 border-b pb-2">
              <span>সর্বমোট ইনভয়েস বিল (Total):</span>
              <span className="text-emerald-700">৳ {totalAmount.toLocaleString()} BDT</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-gray-600 mb-1 font-semibold">আদায়কৃত টাকা</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-emerald-300 rounded-lg font-bold text-emerald-800"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-semibold">বকেয়া টাকা (Due)</label>
                <input
                  type="number"
                  value={dueAmount}
                  onChange={(e) => setDueAmount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-red-300 rounded-lg font-bold text-red-700"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-semibold">অগ্রিম জমা (Adv)</label>
                <input
                  type="number"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-blue-300 rounded-lg font-bold text-blue-700"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              ইনভয়েস সেভ & ভিউ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
