import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Zap, 
  BellRing, 
  Bell, 
  FileText, 
  History, 
  Sliders, 
  Sparkles,
  Building2,
  Printer
} from 'lucide-react';
import { useAuth } from '../../core/auth/AuthContext';
import { SmsGatewayConfig } from './SmsGatewayConfig';
import { ManualSmsComposer } from './ManualSmsComposer';
import { AutoSmsConfig } from './AutoSmsConfig';
import { PushNotificationManager } from './PushNotificationManager';
import { NotificationCenter } from './NotificationCenter';
import { MessageTemplateManager } from './MessageTemplateManager';
import { SmsLogHistory } from './SmsLogHistory';
import { FutureReadyChannels } from './FutureReadyChannels';

export const CommunicationSystem: React.FC = () => {
  const { user, currentTenant } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'sms_composer' | 'auto_sms' | 'gateway_config' | 'push_notifications' | 'notification_center' | 'message_templates' | 'sms_logs' | 'future_channels'
  >('sms_composer');

  const tenantId = currentTenant?.orgId || user?.tenantId || 'org_bismillah_001';
  const isSuperAdmin = user?.role === 'super_admin';
  const userUid = user?.uid || 'user_demo_001';

  return (
    <div className="space-y-6 pb-12">
      {/* Module Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-lg border border-slate-700 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <MessageSquare className="w-6 h-6" />
            </span>
            <h2 className="text-xl font-black tracking-tight">
              এসএমএস, পুশ নোটিফিকেশন ও কমিউনিকেশন সেন্টার
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed pl-10">
            SaaS সফটওয়্যারের সকল অটোমেটিক ও ম্যানুয়াল নোটিফিকেশন, SMS প্রোভাইডার গেটওয়ে, বার্তা টেমপ্লেট এবং ইন-অ্যাপ নোটিফিকেশন ইনবক্স নিয়ন্ত্রণ করুন।
          </p>
        </div>

        {/* Tenant badge */}
        <div className="px-4 py-2 bg-slate-800/80 rounded-xl border border-slate-700 text-right shrink-0">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">বর্তমান অর্গানাইজেশন</div>
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
            <Building2 className="w-3.5 h-3.5" />
            {currentTenant?.orgName || 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ'}
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { id: 'sms_composer', label: 'ম্যানুয়াল & বাল্ক SMS', icon: Send },
            { id: 'auto_sms', label: 'অটোমেটিক SMS ট্রিগার', icon: Zap },
            { id: 'notification_center', label: 'নোটিফিকেশন সেন্টার', icon: Bell },
            { id: 'push_notifications', label: 'ইন-অ্যাপ পুশ নোটিফিকেশন', icon: BellRing },
            { id: 'message_templates', label: 'মেসেজ টেমপ্লেট', icon: FileText },
            { id: 'sms_logs', label: 'SMS লগ ও হিস্ট্রি', icon: History },
            { id: 'gateway_config', label: 'SMS গেটওয়ে সেটিংস', icon: Sliders },
            { id: 'future_channels', label: 'ভবিষ্যৎ ফিচারসমূহ', icon: Sparkles }
          ].map(tab => {
            const IconComp = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  active 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                }`}
              >
                <IconComp className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Content Area */}
      <div>
        {activeTab === 'sms_composer' && (
          <ManualSmsComposer currentTenantId={tenantId} currentUserUid={userUid} />
        )}

        {activeTab === 'auto_sms' && (
          <AutoSmsConfig currentTenantId={tenantId} currentUserUid={userUid} />
        )}

        {activeTab === 'notification_center' && (
          <NotificationCenter currentTenantId={tenantId} />
        )}

        {activeTab === 'push_notifications' && (
          <PushNotificationManager currentTenantId={tenantId} currentUserUid={userUid} />
        )}

        {activeTab === 'message_templates' && (
          <MessageTemplateManager currentTenantId={tenantId} currentUserUid={userUid} />
        )}

        {activeTab === 'sms_logs' && (
          <SmsLogHistory currentTenantId={tenantId} />
        )}

        {activeTab === 'gateway_config' && (
          <SmsGatewayConfig currentTenantId={tenantId} isSuperAdmin={isSuperAdmin} currentUserUid={userUid} />
        )}

        {activeTab === 'future_channels' && (
          <FutureReadyChannels currentTenantId={tenantId} />
        )}
      </div>
    </div>
  );
};
