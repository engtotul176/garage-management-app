import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Users, 
  Phone, 
  Smartphone, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  RefreshCw, 
  Layers, 
  Calculator,
  Tag
} from 'lucide-react';
import { MessageTemplate } from '../../types/communication';
import { CommunicationService } from '../../services/communicationService';
import { MemberService } from '../../services/memberService';
import { MemberRecord } from '../../types/member';

interface ManualSmsComposerProps {
  currentTenantId: string;
  currentUserUid: string;
}

export const ManualSmsComposer: React.FC<ManualSmsComposerProps> = ({
  currentTenantId,
  currentUserUid
}) => {
  const [recipientType, setRecipientType] = useState<'single' | 'multiple' | 'bulk_all' | 'bulk_due'>('single');
  const [singlePhone, setSinglePhone] = useState<string>('01712345678');
  const [singleName, setSingleName] = useState<string>('মোঃ সামসুল হক');
  const [multiplePhonesText, setMultiplePhonesText] = useState<string>('01712345678, 01811998877, 01911223366');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  
  const [message, setMessage] = useState<string>('সম্মানিত মেম্বার, বিসমিল্লাহ অটো চার্জিং গ্যারেজে আপনার মাসিক ফি পরিশোধের শেষ তারিখ আগামী ১০ই আগস্ট। ধন্যবাদ!');
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [members, setMembers] = useState<MemberRecord[]>([]);
  
  const [sending, setSending] = useState<boolean>(false);
  const [statusResult, setStatusResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [smsBalance, setSmsBalance] = useState<number>(500);
  const [smsRate, setSmsRate] = useState<number>(0.35);

  useEffect(() => {
    loadData();
  }, [currentTenantId]);

  const loadData = async () => {
    try {
      const tmplList = await CommunicationService.getMessageTemplates(currentTenantId);
      setTemplates(tmplList);

      const settings = await CommunicationService.getSettings(currentTenantId);
      setSmsBalance(settings.smsBalance);
      setSmsRate(settings.smsRate);

      // Load members
      MemberService.subscribeMembers(currentTenantId, (mList) => {
        setMembers(mList);
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleMemberSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mId = e.target.value;
    setSelectedMemberId(mId);
    const m = members.find(x => x.id === mId);
    if (m) {
      setSinglePhone(m.phone || '');
      setSingleName(m.fullName || '');
    }
  };

  const handleInsertVariable = (variableTag: string) => {
    setMessage(prev => prev + ' ' + variableTag);
  };

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tmplId = e.target.value;
    if (!tmplId) return;
    const tmpl = templates.find(t => t.templateId === tmplId);
    if (tmpl) {
      setMessage(tmpl.body);
    }
  };

  // Compute metrics
  const { smsCount, isUnicode, charLength, estimatedCost } = CommunicationService.calculateSmsCountAndCost(message, smsRate);

  let targetRecipientCount = 1;
  if (recipientType === 'multiple') {
    const splitArr = multiplePhonesText.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    targetRecipientCount = splitArr.length || 1;
  } else if (recipientType === 'bulk_all') {
    targetRecipientCount = members.filter(m => m.status === 'active').length || 5;
  } else if (recipientType === 'bulk_due') {
    targetRecipientCount = members.filter(m => m.totalDueAmount > 0).length || 3;
  }

  const totalBatchCost = Number((targetRecipientCount * estimatedCost).toFixed(2));

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('অনুগ্রহ করে SMS বার্তার বিবরণ লিখুন।');
      return;
    }

    let recipientPhonesList: string[] = [];
    if (recipientType === 'single') {
      if (!singlePhone.trim()) {
        alert('ফোন নম্বর সঠিক নয়');
        return;
      }
      recipientPhonesList = [singlePhone.trim()];
    } else if (recipientType === 'multiple') {
      recipientPhonesList = multiplePhonesText.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    } else if (recipientType === 'bulk_all') {
      recipientPhonesList = members.filter(m => m.status === 'active' && m.phone).map(m => m.phone);
      if (recipientPhonesList.length === 0) {
        recipientPhonesList = ['01712345678', '01811998877', '01911223366']; // fallback
      }
    } else if (recipientType === 'bulk_due') {
      recipientPhonesList = members.filter(m => m.totalDueAmount > 0 && m.phone).map(m => m.phone);
      if (recipientPhonesList.length === 0) {
        recipientPhonesList = ['01811998877', '01911223366']; // fallback
      }
    }

    setSending(true);
    setStatusResult(null);

    try {
      const res = await CommunicationService.sendSms(currentTenantId, {
        recipientType,
        recipientPhone: recipientType === 'single' ? singlePhone : undefined,
        recipientPhones: recipientPhonesList,
        recipientName: recipientType === 'single' ? singleName : undefined,
        message,
        eventType: `Manual SMS (${recipientType.toUpperCase()})`
      }, currentUserUid);

      setStatusResult({ success: res.success, message: res.message });
      if (res.success) {
        setSmsBalance(prev => Math.max(0, prev - res.totalCost));
      }
    } catch (e: any) {
      setStatusResult({ success: false, message: e.message || 'SMS পাঠাতে ব্যর্থ হয়েছে' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Form: Composer */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
                <Send className="w-5 h-5 text-emerald-600" />
                ম্যানুয়াল ও বাল্ক SMS প্র্রেরণ কেন্দ্র (Manual & Bulk SMS)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                একক ড্রাইভার, নির্দিষ্ট তালিকা বা সকল সক্রিয় সদস্যকে সরাসরি SMS পাঠান
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500">বর্তমান ব্যালেন্স:</span>
              <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">৳{smsBalance.toFixed(2)}</div>
            </div>
          </div>

          <form onSubmit={handleSendSms} className="space-y-6">
            {/* Recipient Mode Radio Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                প্রাপক সিলেক্ট করুন (Recipient Type)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: 'single', label: 'সিঙ্গেল SMS', icon: Phone },
                  { id: 'multiple', label: 'একাধিক ফোন', icon: Layers },
                  { id: 'bulk_all', label: 'সকল সদস্য (Bulk)', icon: Users },
                  { id: 'bulk_due', label: 'শুধুমাত্র বকেয়া', icon: Calculator }
                ].map(item => {
                  const IconComp = item.icon;
                  const active = recipientType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRecipientType(item.id as any)}
                      className={`p-3 rounded-lg border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                        active 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Recipient Fields */}
            {recipientType === 'single' && (
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      রেজিস্টার্ড সদস্য সিলেক্ট (ঐচ্ছিক)
                    </label>
                    <select
                      value={selectedMemberId}
                      onChange={handleMemberSelect}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                    >
                      <option value="">-- মেম্বার তালিকা থেকে বেছে নিন --</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.fullName} ({m.phone}) - {m.vehicleNo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      প্রাপকের নাম
                    </label>
                    <input
                      type="text"
                      value={singleName}
                      onChange={(e) => setSingleName(e.target.value)}
                      placeholder="যেমন: মোঃ সামসুল হক"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    মোবাইল নম্বর (Phone Number) *
                  </label>
                  <input
                    type="text"
                    value={singlePhone}
                    onChange={(e) => setSinglePhone(e.target.value)}
                    placeholder="01712345678"
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {recipientType === 'multiple' && (
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  একাধিক মোবাইল নম্বর (কমা বা নিউলাইন দিয়ে আলাদা করুন)
                </label>
                <textarea
                  rows={3}
                  value={multiplePhonesText}
                  onChange={(e) => setMultiplePhonesText(e.target.value)}
                  placeholder="01712345678, 01811998877, 01911223366"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                ></textarea>
                <p className="text-[11px] text-slate-500 mt-1">
                  মোট শনাক্তকৃত নম্বর: <span className="font-bold text-emerald-600">{targetRecipientCount}</span> টি
                </p>
              </div>
            )}

            {(recipientType === 'bulk_all' || recipientType === 'bulk_due') && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
                    {recipientType === 'bulk_all' ? 'সকল সক্রিয় ড্রাইভার/সদস্যগণ' : 'বকেয়া ফি থাকা সদস্যগণ'}
                  </div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                    মোট প্রাপক সংখ্যা: <span className="font-bold underline">{targetRecipientCount} জন</span>
                  </div>
                </div>
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            )}

            {/* Template Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  টেমপ্লেট নির্বাচন করুন (Load Template)
                </label>
              </div>
              <select
                onChange={handleTemplateSelect}
                defaultValue=""
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-900 dark:text-white"
              >
                <option value="">-- ডাইনামিক টেমপ্লেট লোড করতে ক্লিক করুন --</option>
                {templates.map(t => (
                  <option key={t.templateId} value={t.templateId}>
                    [{t.category.toUpperCase()}] {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  SMS বার্তার টেক্সট (Message Body) *
                </label>
                <div className="text-[11px] text-slate-500">
                  {isUnicode ? 'বাংলা/ইউনিকোড' : 'ইংলিশ/ASCII'}
                </div>
              </div>

              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="বাংলা বা ইংরেজিতে মেসেজ লিখুন..."
                required
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs leading-relaxed text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              ></textarea>

              {/* Variable Quick Inserters */}
              <div className="mt-2.5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-2">
                  ডাইনামিক ভেরিয়েবল যোগ করুন:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {[
                    '{{MemberName}}',
                    '{{Amount}}',
                    '{{ReceiptNo}}',
                    '{{OrganizationName}}',
                    '{{DueAmount}}',
                    '{{Date}}',
                    '{{Phone}}'
                  ].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleInsertVariable(v)}
                      className="px-2 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 text-[10px] font-mono rounded transition-colors"
                    >
                      + {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Message Character & Cost Metrics */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">অক্ষর সংখ্যা</span>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{charLength}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">SMS পার্ট</span>
                <div className="text-sm font-bold text-emerald-600">{smsCount} Part(s)</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">প্রাপক সংখ্যা</span>
                <div className="text-sm font-bold text-blue-600">{targetRecipientCount} Person</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">মোট আনুমানিক খরচ</span>
                <div className="text-sm font-black text-amber-600">৳{totalBatchCost} BDT</div>
              </div>
            </div>

            {/* Status Feedback */}
            {statusResult && (
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                statusResult.success 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-200'
              }`}>
                {statusResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                <div className="text-xs font-medium">{statusResult.message}</div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={sending}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {sending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    SMS পাঠানো হচ্ছে...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    SMS সেন্ড করুন (Send Now)
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Live Mobile Mockup Preview */}
      <div className="space-y-6">
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4 text-white">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              লাইভ মোবাইল প্রিভিউ (Live SMS Mockup)
            </span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">
              ABIL_SaaS
            </span>
          </div>

          {/* Smartphone Frame */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3 min-h-[220px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-900 pb-2">
              <span>প্রাপক: {recipientType === 'single' ? singlePhone : `গ্রুপ (${targetRecipientCount})`}</span>
              <span>এখনই</span>
            </div>

            {/* Bubble */}
            <div className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-100 rounded-xl p-3 text-xs leading-relaxed font-sans shadow-sm">
              {CommunicationService.replaceVariables(message, {
                MemberName: singleName || 'মোঃ সামসুল হক',
                Amount: '১২০০',
                ReceiptNo: 'RCP-2026-881',
                OrganizationName: 'বিসমিল্লাহ গ্যারেজ',
                DueAmount: '৫০০',
                Phone: singlePhone
              })}
            </div>

            <div className="text-[10px] text-slate-500 text-right">
              {isUnicode ? 'বাংলা SMS' : 'ASCII SMS'} • {smsCount} Segment(s)
            </div>
          </div>

          {/* Pricing Info */}
          <div className="p-3 bg-slate-800/60 rounded-xl text-xs space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>প্রতি SMS রেট:</span>
              <span className="font-bold text-emerald-400">৳{smsRate} BDT</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>বর্তমান ব্যালেন্স:</span>
              <span className="font-bold text-white">৳{smsBalance.toFixed(2)} BDT</span>
            </div>
            <div className="flex justify-between text-amber-400 font-bold border-t border-slate-700 pt-1.5">
              <span>আনুমানিক মোট খরচ:</span>
              <span>৳{totalBatchCost} BDT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
