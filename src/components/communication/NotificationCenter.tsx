import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  Trash2, 
  Archive, 
  CheckCheck, 
  RefreshCw, 
  Info, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle,
  Clock,
  Radio
} from 'lucide-react';
import { NotificationLog, NotificationCategory } from '../../types/communication';
import { CommunicationService } from '../../services/communicationService';

interface NotificationCenterProps {
  currentTenantId: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ currentTenantId }) => {
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    loadNotifications();
  }, [currentTenantId]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await CommunicationService.getNotifications(currentTenantId);
      setNotifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await CommunicationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = async () => {
    await CommunicationService.markAllAsRead(currentTenantId);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleArchive = async (id: string) => {
    await CommunicationService.archiveNotification(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isArchived: true } : n));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('নোটিফিকেশনটি মুছে ফেলতে নিশ্চিত?')) return;
    await CommunicationService.deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Filter logic
  const filteredList = notifications.filter(n => {
    // Tab filter
    if (activeTab === 'unread' && (n.isRead || n.isArchived)) return false;
    if (activeTab === 'read' && (!n.isRead || n.isArchived)) return false;
    if (activeTab === 'archived' && !n.isArchived) return false;
    if (activeTab === 'all' && n.isArchived) return false;

    // Category filter
    if (categoryFilter !== 'all' && n.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
    }

    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'system': return <Info className="w-4 h-4 text-slate-500" />;
      case 'dashboard': return <Radio className="w-4 h-4 text-blue-500" />;
      case 'due': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'subscription': return <ShieldCheck className="w-4 h-4 text-purple-500" />;
      case 'payment_success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'payment_failed': return <XCircle className="w-4 h-4 text-rose-500" />;
      default: return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-6">
      {/* Header & Mark All Read */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
            <Bell className="w-5 h-5 text-emerald-600" />
            নোটিফিকেশন সেন্টার (Notification Center Inbox)
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs bg-rose-500 text-white font-bold rounded-full animate-bounce">
                {unreadCount} Unread
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            সিস্টেম অ্যালার্ট, বকেয়া রিমাইন্ডার ও পেমেন্ট হিস্ট্রি এক পলকে পর্যবেক্ষণ করুন
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadNotifications}
            className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4" />
            সবগুলো পঠিত চিহ্নিত করুন
          </button>
        </div>
      </div>

      {/* Tabs & Search Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Sub Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          {[
            { id: 'all', label: 'সকল (All)' },
            { id: 'unread', label: `অপঠিত (${unreadCount})` },
            { id: 'read', label: 'পঠিত (Read)' },
            { id: 'archived', label: 'আর্কাইভ (Archived)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter Inputs */}
        <div className="flex items-center gap-2">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              <option value="all">সব ক্যাটাগরি</option>
              <option value="system">System</option>
              <option value="dashboard">Dashboard</option>
              <option value="due">Due Alert</option>
              <option value="subscription">Subscription</option>
              <option value="payment_success">Payment Success</option>
              <option value="payment_failed">Payment Failed</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="খুঁজুন (Search)..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Notifications Inbox List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-500 mr-2" />
          নোটিফিকেশন ডাটা ফিল্টার করা হচ্ছে...
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
          <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-sm font-semibold">কোনো নোটিফিকেশন পাওয়া যায়নি</p>
          <p className="text-xs">আপনার ফিল্টার বা সার্চ বক্সে নতুন নাম দিয়ে ট্রাই করুন</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredList.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                !item.isRead 
                  ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30 font-medium' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/80 shrink-0 mt-0.5">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.body}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleString('bn-BD')}
                    </span>
                    <span className="capitalize font-semibold text-slate-500">
                      Category: {item.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                {!item.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="পঠিত চিহ্নিত করুন"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}

                {!item.isArchived && (
                  <button
                    onClick={() => handleArchive(item.id)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="আর্কাইভ করুন"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
