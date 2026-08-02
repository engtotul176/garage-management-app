import React from 'react';
import { AlertOctagon, WifiOff, RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';
import { SystemAlertStatus } from '../../types/tvDashboard';

interface TvAlertsOverlayProps {
  alerts: SystemAlertStatus;
}

export const TvAlertsOverlay: React.FC<TvAlertsOverlayProps> = ({ alerts }) => {
  if (!alerts.isOffline && !alerts.subscriptionExpiringSoon && alerts.dueAlertCount === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mb-4">
      
      {/* 1. Offline Alert Banner */}
      {alerts.isOffline && (
        <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-lg flex items-center justify-between px-5 animate-pulse">
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-amber-300" />
            <div>
              <span className="font-black text-xs uppercase tracking-wider">ইন্টারনেট সংযোগ বিচ্ছিন</span>
              <p className="text-[11px] text-rose-100">
                ইন্টারনেট ফিরে এলে ফায়ারবেস রিয়েল-টাইম অটোমেটিক সিঙ্ক সম্পন্ন হবে।
              </p>
            </div>
          </div>
          <span className="text-xs font-bold bg-slate-950 px-3 py-1 rounded-xl text-rose-300">
            অফলাইন মোড
          </span>
        </div>
      )}

      {/* 2. Subscription Expire Warning Banner */}
      {alerts.subscriptionExpiringSoon && (
        <div className="p-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl shadow-lg flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-5 h-5 text-amber-200" />
            <div>
              <span className="font-black text-xs uppercase tracking-wider">সাবস্ক্রিপশন মেয়াদ সতর্কবার্তা</span>
              <p className="text-[11px] text-amber-100">
                আপনার ক্লাউড সাবস্ক্রিপশনের মেয়াদ আগামী {alerts.daysRemaining || 3} দিনের মধ্যে শেষ হবে। অনুগ্রহ করে রিনিউ করুন।
              </p>
            </div>
          </div>
          <span className="text-xs font-bold bg-slate-950 px-3 py-1 rounded-xl text-amber-400">
            জরুরী রিনিউ
          </span>
        </div>
      )}

      {/* 3. Due Alert Summary */}
      {alerts.dueAlertCount > 0 && (
        <div className="p-2.5 bg-indigo-950 border border-indigo-800 text-indigo-200 rounded-2xl flex items-center justify-between px-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>আজকের বকেয়া ড্রাইভার তালিকা: <strong className="text-amber-400">{alerts.dueAlertCount}</strong> জন মেম্বারের বকেয়া রয়েছে।</span>
          </div>
        </div>
      )}

    </div>
  );
};
