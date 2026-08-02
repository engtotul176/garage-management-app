import React from 'react';
import { MessageSquare, Bell, CheckCircle2, ShieldAlert, Smartphone } from 'lucide-react';
import { MemberSmsRecord } from '../../types/customerPortal';

interface MemberSmsHistoryProps {
  smsRecords: MemberSmsRecord[];
}

export const MemberSmsHistory: React.FC<MemberSmsHistoryProps> = ({
  smsRecords
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
            এসএমএস নোটিফিকেশন & সিস্টেম এলার্ট হিস্ট্রি
          </h3>
          <p className="text-xs text-slate-500">
            আপনার মোবাইলে প্রেরিত পেমেন্ট রিসিট, সিকিউরিটি পিন ও সিস্টেম এলার্ট লগ
          </p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {smsRecords.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-bold">
            কোনো এসএমএস নোটিফিকেশন রেকর্ড পাওয়া যায়নি।
          </div>
        ) : (
          smsRecords.map((sms) => (
            <div 
              key={sms.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    sms.smsType === 'PAYMENT_RECEIPT'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                  }`}>
                    {sms.smsType}
                  </span>
                  <span className="font-mono text-slate-500 flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-slate-400" />
                    {sms.mobile}
                  </span>
                </div>

                <span className="text-[10px] text-slate-400">
                  {new Date(sms.sentAt).toLocaleString('bn-BD')}
                </span>
              </div>

              <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                {sms.message}
              </p>

              <div className="flex justify-end">
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> DELIVERED TO HANDSET
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
