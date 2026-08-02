import React, { useState } from 'react';
import { QrCode, Printer, Search, PlusCircle, CheckCircle2, WifiOff, RefreshCw, Smartphone, DollarSign, Camera } from 'lucide-react';
import { AndroidSession, OfflineCollectionQueueItem } from '../../../types/androidApp';

interface CashCollectorAndroidAppProps {
  session: AndroidSession;
  isDarkMode: boolean;
  isOffline: boolean;
}

export const CashCollectorAndroidApp: React.FC<CashCollectorAndroidAppProps> = ({
  session,
  isDarkMode,
  isOffline
}) => {
  const [activeTab, setActiveTab] = useState<'NEW_COLLECTION' | 'QR_SCAN' | 'OFFLINE_QUEUE' | 'PRINT'>('NEW_COLLECTION');
  const [memberSearch, setMemberSearch] = useState('ঢাকা মেট্রো-থ-১১-৮৮৯২');
  const [amount, setAmount] = useState('500');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BKASH' | 'NAGAD'>('CASH');
  const [isScanning, setIsScanning] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printedSuccess, setPrintedSuccess] = useState(false);

  const [offlineQueue, setOfflineQueue] = useState<OfflineCollectionQueueItem[]>([
    {
      id: 'offline_col_101',
      memberId: 'mem_001',
      memberName: 'মোঃ কামাল হোসেন',
      amount: 500,
      paymentMethod: 'CASH',
      collectedBy: session.userName,
      timestamp: '11:42 AM',
      synced: false
    },
    {
      id: 'offline_col_102',
      memberId: 'mem_002',
      memberName: 'আব্দুল করিম',
      amount: 300,
      paymentMethod: 'BKASH',
      collectedBy: session.userName,
      timestamp: '11:58 AM',
      synced: false
    }
  ]);

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: OfflineCollectionQueueItem = {
      id: `offline_col_${Date.now()}`,
      memberId: 'mem_custom',
      memberName: memberSearch || 'মোঃ ড্রাইভ মেম্বার',
      amount: Number(amount),
      paymentMethod,
      collectedBy: session.userName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      synced: !isOffline
    };

    setOfflineQueue([newItem, ...offlineQueue]);
    setActiveTab('PRINT');
  };

  const handleSimulateQrScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setMemberSearch('ঢাকা মেট্রো-থ-১১-৮৮৯২ (কামাল হোসেন)');
      setAmount('৫০০');
      setActiveTab('NEW_COLLECTION');
    }, 1200);
  };

  const handleThermalPrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      setPrintedSuccess(true);
    }, 1500);
  };

  return (
    <div className="space-y-3">
      
      {/* Header Stat Card */}
      <div className="p-3 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl border border-emerald-800 space-y-1 shadow-md">
        <div className="flex items-center justify-between text-[10px] text-emerald-300 font-mono">
          <span>CASH COLLECTOR POS</span>
          <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-bold">POS READY</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h4 className="font-extrabold text-xs text-white">{session.userName}</h4>
            <p className="text-[10px] text-slate-300">আজকের মোট সংগ্রহ (Today's Total)</p>
          </div>
          <div className="text-right">
            <span className="text-base font-black text-emerald-400 font-mono">৳৮,৫০০</span>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="grid grid-cols-4 gap-1 text-center font-bold text-[9px]">
        <button
          onClick={() => setActiveTab('NEW_COLLECTION')}
          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            activeTab === 'NEW_COLLECTION' 
              ? 'bg-emerald-600 text-white border-emerald-500' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          নতুন এন্ট্রি
        </button>

        <button
          onClick={() => setActiveTab('QR_SCAN')}
          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            activeTab === 'QR_SCAN' 
              ? 'bg-emerald-600 text-white border-emerald-500' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          QR স্ক্যান
        </button>

        <button
          onClick={() => setActiveTab('PRINT')}
          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            activeTab === 'PRINT' 
              ? 'bg-emerald-600 text-white border-emerald-500' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <Printer className="w-3.5 h-3.5" />
          প্রিন্ট রিসিট
        </button>

        <button
          onClick={() => setActiveTab('OFFLINE_QUEUE')}
          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all relative ${
            activeTab === 'OFFLINE_QUEUE' 
              ? 'bg-emerald-600 text-white border-emerald-500' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <WifiOff className="w-3.5 h-3.5" />
          সিঙ্ক ({offlineQueue.length})
        </button>
      </div>

      {/* Tabs */}
      {activeTab === 'NEW_COLLECTION' && (
        <form onSubmit={handleCreateCollection} className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">মেম্বার খুঁজুন / গাড়ির নম্বর:</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                required
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">টাকার পরিমাণ (৳):</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">পেমেন্ট মেথড:</label>
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
              {(['CASH', 'BKASH', 'NAGAD'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`py-1.5 rounded-xl border transition-all ${
                    paymentMethod === m 
                      ? 'bg-emerald-600 text-white border-emerald-500' 
                      : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 text-xs mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            কালেকশন জমা নিন & রিসিট প্রিন্ট
          </button>
        </form>
      )}

      {activeTab === 'QR_SCAN' && (
        <div className="p-4 bg-slate-900 text-white rounded-2xl text-center space-y-3">
          <div className="relative w-40 h-40 mx-auto bg-slate-950 border-2 border-dashed border-emerald-500 rounded-2xl flex items-center justify-center overflow-hidden">
            {isScanning ? (
              <div className="absolute inset-0 bg-emerald-500/10 flex flex-col items-center justify-center space-y-2">
                <div className="w-full h-1 bg-emerald-400 animate-bounce"></div>
                <span className="text-[10px] text-emerald-300 font-mono">Scanning QR Code...</span>
              </div>
            ) : (
              <QrCode className="w-20 h-20 text-emerald-400" />
            )}
          </div>

          <div>
            <h5 className="font-bold text-xs">মেম্বার QR বা বারকোড স্ক্যানার</h5>
            <p className="text-[10px] text-slate-400">ক্যামেরা দিয়ে মেম্বারশিপ কার্ডের QR ফ্রন্ট ফোকাস করুন</p>
          </div>

          <button
            type="button"
            onClick={handleSimulateQrScan}
            disabled={isScanning}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs"
          >
            <Camera className="w-4 h-4" />
            {isScanning ? 'স্ক্যানিং হচ্ছে...' : 'ক্যামেরা স্ক্যান ট্রিগার করুন'}
          </button>
        </div>
      )}

      {activeTab === 'PRINT' && (
        <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 text-xs">
          <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 font-mono text-[10px]">
            <div className="text-center border-b pb-1">
              <div className="font-black text-xs font-sans text-slate-900 dark:text-white">{session.tenantName}</div>
              <div className="text-slate-400">কালেকশন মানি রিসিট (Thermal 58mm)</div>
            </div>
            <div className="flex justify-between">
              <span>রিসিট নং:</span>
              <span className="font-bold">REC-998201</span>
            </div>
            <div className="flex justify-between">
              <span>মেম্বার:</span>
              <span className="font-bold">{memberSearch || 'মোঃ কামাল হোসেন'}</span>
            </div>
            <div className="flex justify-between">
              <span>জমা টাকা:</span>
              <span className="font-bold text-emerald-500">৳{amount}</span>
            </div>
            <div className="flex justify-between border-t pt-1 text-slate-400">
              <span>কালেক্টর:</span>
              <span>{session.userName}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleThermalPrint}
            disabled={isPrinting}
            className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 text-xs"
          >
            {isPrinting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            {printedSuccess ? 'ব্লুটুথ থার্মাল রিসিট প্রিন্ট হয়েছে ✓' : 'ব্লুটুথ থার্মাল প্রিন্ট করুন (POS)'}
          </button>
        </div>
      )}

      {activeTab === 'OFFLINE_QUEUE' && (
        <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between items-center font-bold">
            <span className="text-slate-900 dark:text-white">অফলাইন কালেকশন কু (Queue):</span>
            <span className="text-amber-500 font-mono">{offlineQueue.length} Pending</span>
          </div>

          {offlineQueue.map((item) => (
            <div key={item.id} className="p-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{item.memberName}</div>
                <div className="text-[10px] text-slate-400 font-mono">{item.timestamp} • {item.paymentMethod}</div>
              </div>
              <span className="text-emerald-500 font-bold font-mono">৳{item.amount}</span>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setOfflineQueue([])}
            className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            ফায়ারস্টোরে অটো সিঙ্ক আপলোড করুন
          </button>
        </div>
      )}

    </div>
  );
};
