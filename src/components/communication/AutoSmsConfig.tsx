import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  RefreshCw, 
  Send, 
  Sliders, 
  Info, 
  UserPlus, 
  Receipt, 
  DollarSign, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  Smartphone,
  Check
} from 'lucide-react';
import { CommunicationSettings, AutoSmsEventType, AutoSmsTriggerConfig } from '../../types/communication';
import { CommunicationService } from '../../services/communicationService';

interface AutoSmsConfigProps {
  currentTenantId: string;
  currentUserUid: string;
}

const EVENT_ICONS: Record<AutoSmsEventType, any> = {
  member_registered: UserPlus,
  collection_completed: DollarSign,
  receipt_generated: Receipt,
  due_reminder: Calendar,
  subscription_expiry: ShieldCheck,
  organization_created: Building2,
  employee_created: Sliders
};

export const AutoSmsConfig: React.FC<AutoSmsConfigProps> = ({
  currentTenantId,
  currentUserUid
}) => {
  const [settings, setSettings] = useState<CommunicationSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, [currentTenantId]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await CommunicationService.getSettings(currentTenantId);
      setSettings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEvent = (eventType: AutoSmsEventType, enabled: boolean) => {
    if (!settings) return;
    const updatedTriggers = {
      ...settings.autoSmsTriggers,
      [eventType]: {
        ...settings.autoSmsTriggers[eventType],
        enabled
      }
    };
    setSettings({ ...settings, autoSmsTriggers: updatedTriggers });
  };

  const handleMessageChange = (eventType: AutoSmsEventType, message: string) => {
    if (!settings) return;
    const updatedTriggers = {
      ...settings.autoSmsTriggers,
      [eventType]: {
        ...settings.autoSmsTriggers[eventType],
        defaultMessage: message
      }
    };
    setSettings({ ...settings, autoSmsTriggers: updatedTriggers });
  };

  const handleSaveTriggers = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await CommunicationService.updateSettings(currentTenantId, { autoSmsTriggers: settings.autoSmsTriggers }, currentUserUid);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      alert('অটোমেটিক SMS সেটআপ সেভ করা সম্ভব হয়নি!');
    } finally {
      setSaving(false);
    }
  };

  const handleTestTrigger = async (eventType: AutoSmsEventType) => {
    if (!settings) return;
    setTestResult(`ট্রিগার [${eventType}] টেস্ট করা হচ্ছে...`);
    const success = await CommunicationService.triggerAutoSms(
      currentTenantId,
      eventType,
      {
        MemberName: 'মোঃ সামসুল হক (টেস্ট)',
        Amount: '১৫০০',
        ReceiptNo: 'RCP-AUTO-001',
        OrganizationName: 'বিসমিল্লাহ গ্যারেজ',
        DueAmount: '০',
        Phone: '01712345678',
        ExpiryDate: '2026-08-31'
      },
      '01712345678',
      'মোঃ সামসুল হক'
    );

    if (success) {
      setTestResult(`সফল! [${eventType}] ইভেন্টে টেস্ট SMS পাঠানো হয়েছে এবং ব্যালেন্স থেকে কাটা হয়েছে।`);
    } else {
      setTestResult(`ব্যর্থ! প্রোভাইডার সেটিংস বা ব্যালেন্স পরীক্ষা করুন।`);
    }

    setTimeout(() => setTestResult(null), 5000);
  };

  if (loading || !settings) {
    return (
      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center">
        <RefreshCw className="w-5 h-5 text-emerald-500 animate-spin mr-2" />
        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">অটোমেটিক SMS কনফিগারেশন লোড হচ্ছে...</span>
      </div>
    );
  }

  const triggersList = Object.values(settings.autoSmsTriggers) as AutoSmsTriggerConfig[];

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
        <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="font-bold text-slate-900 dark:text-white">Auto SMS Engine (সফটওয়্যার ইভেন্ট নোটিফিকেশন):</span> সফ্টওয়্যারে কোনো রিয়েল-টাইম একশন ঘটলেই (যেমন মেম্বার রেজিস্ট্রেশন, টাকা জমা বা রশিদ তৈরি) সঙ্গে সঙ্গে ব্যাকগ্রাউন্ড থেকে অটোমেটিক মেসেজ চলে যাবে।
        </div>
      </div>

      {testResult && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500 shrink-0" />
          {testResult}
        </div>
      )}

      {/* Triggers Cards List */}
      <div className="space-y-4">
        {triggersList.map(trigger => {
          const IconComponent = EVENT_ICONS[trigger.eventType] || Smartphone;
          return (
            <div 
              key={trigger.eventType} 
              className={`p-5 rounded-xl border transition-all ${
                trigger.enabled 
                  ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm' 
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-75'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${trigger.enabled ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {trigger.labelBengali}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Event Code: {trigger.eventType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleTestTrigger(trigger.eventType)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-500" />
                    টেস্ট পাঠান
                  </button>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={trigger.enabled} 
                      onChange={(e) => handleToggleEvent(trigger.eventType, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              {/* Message Template Customizer */}
              <div className="mt-3 space-y-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  অটোমেটিক SMS মেসেজ বডি (Variables Allowed):
                </label>
                <textarea
                  rows={2}
                  value={trigger.defaultMessage}
                  onChange={(e) => handleMessageChange(trigger.eventType, e.target.value)}
                  disabled={!trigger.enabled}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs leading-relaxed text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 font-sans"
                ></textarea>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Action */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
        {savedSuccess && (
          <div className="flex items-center text-emerald-600 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            অটো SMS ট্রিগারসমূহ সফলভাবে সংরক্ষিত হয়েছে!
          </div>
        )}
        <div className="ml-auto">
          <button
            type="button"
            onClick={handleSaveTriggers}
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                সেভ হচ্ছে...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                অটোমেটিক SMS সেটিংস আপডেট সেভ করুন
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
