import React, { useState } from 'react';
import { 
  BellRing, 
  Send, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Radio, 
  Info,
  CreditCard,
  XCircle
} from 'lucide-react';
import { NotificationCategory, PushNotification } from '../../types/communication';
import { CommunicationService } from '../../services/communicationService';

interface PushNotificationManagerProps {
  currentTenantId: string;
  currentUserUid: string;
}

export const PushNotificationManager: React.FC<PushNotificationManagerProps> = ({
  currentTenantId,
  currentUserUid
}) => {
  const [title, setTitle] = useState<string>('বকেয়া ফি পরিশোধের তাগাদা');
  const [message, setMessage] = useState<string>('সম্মানিত গ্রাহক/সদস্য, আপনার চলতি মাসের বকেয়া ফি আগামী ৫ তারিখের মধ্যে পরিশোধ করার অনুরোধ করা হচ্ছে।');
  const [category, setCategory] = useState<NotificationCategory>('due');
  const [targetAudience, setTargetAudience] = useState<'all' | 'members' | 'employees' | 'due_members'>('due_members');
  
  const [sending, setSending] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);
  const [recentBroadcasts, setRecentBroadcasts] = useState<PushNotification[]>([]);

  const handleSendPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setSending(true);
    setSentSuccess(false);

    try {
      const res = await CommunicationService.sendPushNotification(
        currentTenantId,
        title,
        message,
        category,
        targetAudience,
        currentUserUid
      );

      setRecentBroadcasts(prev => [res, ...prev]);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 4000);
    } catch (e) {
      alert('পুশ নোটিফিকেশন পাঠাতে সমস্যা হয়েছে');
    } finally {
      setSending(false);
    }
  };

  const getCategoryBadge = (cat: NotificationCategory) => {
    switch (cat) {
      case 'system':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-500/10 text-slate-600 dark:text-slate-300">System</span>;
      case 'dashboard':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-500/10 text-blue-600">Dashboard Alert</span>;
      case 'due':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/10 text-amber-600">Due Alert</span>;
      case 'subscription':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-500/10 text-purple-600">Subscription</span>;
      case 'payment_success':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-600">Payment Success</span>;
      case 'payment_failed':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/10 text-rose-600">Payment Failed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Push Creator Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
              <BellRing className="w-5 h-5 text-emerald-600" />
              ইন-অ্যাপ পুশ নোটিফিকেশন ব্রডকাস্টার (In-App Push Alerts)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ড্যাশবোর্ড অ্যালার্ট, বকেয়া রিমাইন্ডার ও পেমেন্ট আপডেট মুহূর্তেই ইউজার স্ক্রিনে প্রমোট করুন
            </p>
          </div>

          <form onSubmit={handleSendPush} className="space-y-5">
            {/* Category Cards Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                নোটিফিকেশন ক্যাটাগরি নির্বাচন করুন *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {[
                  { id: 'system', label: 'System Notification', icon: Info },
                  { id: 'dashboard', label: 'Dashboard Alert', icon: Radio },
                  { id: 'due', label: 'Due Alert', icon: AlertTriangle },
                  { id: 'subscription', label: 'Subscription Alert', icon: ShieldCheck },
                  { id: 'payment_success', label: 'Payment Success', icon: CheckCircle2 },
                  { id: 'payment_failed', label: 'Payment Failed', icon: XCircle }
                ].map(item => {
                  const IconComp = item.icon;
                  const active = category === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCategory(item.id as any)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all flex items-center gap-2.5 ${
                        active 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <IconComp className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                টার্গেট অডিয়েন্স (Target Audience)
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="all">সকল ব্যবহারকারী ও ড্রাইভার (All Users & Drivers)</option>
                <option value="members">শুধুমাত্র মেম্বার ও গাড়ি চালকগণ (Registered Members)</option>
                <option value="employees">অর্গানাইজেশনের কর্মচারীবৃন্দ (Employees / Staff)</option>
                <option value="due_members">বকেয়া ফি থাকা নির্দিষ্ট মেম্বারগণ (Due Members)</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                নোটিফিকেশন শিরোনাম (Title) *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: জরুরি বকেয়া রিমাইন্ডার"
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Body Message */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                বার্তা বিবরণ (Notification Message Body) *
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="পুশ বার্তার বিষয়বস্তু লিখুন..."
                required
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>

            {/* Feedback */}
            {sentSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ইন-অ্যাপ পুশ নোটিফিকেশন সফলভাবে ব্রডকাস্ট করা হয়েছে!
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={sending}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {sending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    ব্রডকাস্ট হচ্ছে...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    পুশ অল্যার্ট ব্রডকাস্ট করুন
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Live Push Preview & History */}
      <div className="space-y-6">
        {/* Banner Preview Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            ড্যাশবোর্ড ইনবক্স কার্ড লাইভ প্রিভিউ
          </h4>

          <div className="p-4 rounded-xl bg-slate-900 text-white shadow-lg space-y-2 border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getCategoryBadge(category)}
                <span className="text-[10px] text-slate-400">এখনই</span>
              </div>
              <BellRing className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm font-bold">{title || 'শিরোনাম'}</div>
            <p className="text-xs text-slate-300 leading-relaxed">{message || 'বার্তার বিস্তারিত স্থানকাল...'}</p>
          </div>
        </div>

        {/* History List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
            সাম্প্রতিক পাঠানো পুশ হিস্ট্রি
          </h4>

          {recentBroadcasts.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 text-center">এখনো কোনো পুশ অ্যালার্ট ব্রডকাস্ট হয়নি</p>
          ) : (
            <div className="space-y-2.5 max-h-[260px] overflow-y-auto">
              {recentBroadcasts.map((b) => (
                <div key={b.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span className="truncate max-w-[150px]">{b.title}</span>
                    {getCategoryBadge(b.category)}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{b.message}</p>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                    <span>প্রাপক: {b.sentCount} জন</span>
                    <span>{new Date(b.createdAt).toLocaleTimeString('bn-BD')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
