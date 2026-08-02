import React, { useState } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Smartphone, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  ShieldAlert,
  Bot
} from 'lucide-react';

interface FutureReadyChannelsProps {
  currentTenantId: string;
}

export const FutureReadyChannels: React.FC<FutureReadyChannelsProps> = () => {
  const [channels, setChannels] = useState({
    whatsapp: false,
    email: false,
    mobilePush: true,
    telegram: false
  });

  const toggleChannel = (key: keyof typeof channels) => {
    setChannels(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-md space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
          <h3 className="font-bold text-base">Future-Ready Multi-Channel Architecture</h3>
        </div>
        <p className="text-xs text-emerald-100 leading-relaxed max-w-2xl">
          সিস্টেমের আর্কিটেকচার এমনভাবে ডিজাইন করা হয়েছে যেন ভবিষ্যতে কোনো জটিল পরিবর্তন ছাড়াই সরাসরি WhatsApp Business API, Email Gateway, Mobile App Push ও Telegram Bot চ্যানেল চালু করা যায়।
        </p>
      </div>

      {/* Grid of Future Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp Channel */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  WhatsApp Business API Integration
                </h4>
                <p className="text-xs text-slate-500">Meta Cloud API / UltraMsg Webhook</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={channels.whatsapp} 
                onChange={() => toggleChannel('whatsapp')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            ড্রাইভার ও মেম্বারদের কাছে সরাসরি হোয়াটসঅ্যাপে ইমেজযুক্ত ডিজিটাল রশিদ (Digital PDF Receipt) ও বকেয়া নোটিশ পাঠাতে সহায়ক।
          </p>

          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs space-y-2 border border-slate-200 dark:border-slate-700 font-mono text-slate-600 dark:text-slate-400">
            <div>Phone Number ID: 10882299182...</div>
            <div>Access Token: EAAGm0PX...</div>
          </div>
        </div>

        {/* Email Channel */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Email SMTP & SendGrid Provider
                </h4>
                <p className="text-xs text-slate-500">HTML Report & Invoice Attachments</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={channels.email} 
                onChange={() => toggleChannel('email')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            মাসিক সামারি অ্যাকাউন্ট স্টেটমেন্ট এবং অফিসিয়াল রিপোর্ট ইমেইল ইনবক্সে সেন্ড করার ব্যবস্থা।
          </p>

          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs space-y-2 border border-slate-200 dark:border-slate-700 font-mono text-slate-600 dark:text-slate-400">
            <div>SMTP Host: smtp.gmail.com</div>
            <div>Port: 587 (TLS Enabled)</div>
          </div>
        </div>

        {/* Mobile App Push Channel */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Mobile App Push (FCM SDK)
                </h4>
                <p className="text-xs text-slate-500">Android & iOS Native Push Notifications</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={channels.mobilePush} 
                onChange={() => toggleChannel('mobilePush')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            স্মার্টফোন অ্যাপে ইনস্ট্যান্ট পপআপ অ্যালার্ট পাঠানোর ব্যবস্থা। Firebase Cloud Messaging-এর সাথে সম্পূর্ণ সামঞ্জস্যপূর্ণ।
          </p>
        </div>

        {/* Telegram Bot Channel */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Telegram Bot Notification
                </h4>
                <p className="text-xs text-slate-500">Group / Admin Daily Summary Alerts</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={channels.telegram} 
                onChange={() => toggleChannel('telegram')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            কমিটি বা এডমিন টেলিগ্রাম গ্রুপে প্রতিদিনের মোট ক্যাশ কালেকশনের অটোমেটিক সামারি রিপোর্ট।
          </p>
        </div>
      </div>
    </div>
  );
};
