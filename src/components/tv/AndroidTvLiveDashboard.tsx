import React, { useState, useEffect } from 'react';
import { 
  TvDashboardMetrics, 
  LiveActivityItem, 
  TvAnnouncement, 
  ChargingSlot, 
  SystemAlertStatus 
} from '../../types/tvDashboard';
import { TvDashboardService } from '../../services/tvDashboardService';
import { TvTopHeader } from './TvTopHeader';
import { TvMarqueeAnnouncement } from './TvMarqueeAnnouncement';
import { TvMetricsCounters } from './TvMetricsCounters';
import { TvChargingSlotStatus } from './TvChargingSlotStatus';
import { TvLiveActivityFeed } from './TvLiveActivityFeed';
import { TvAlertsOverlay } from './TvAlertsOverlay';
import { TvAdminAnnouncementModal } from './TvAdminAnnouncementModal';

interface AndroidTvLiveDashboardProps {
  tenantId?: string;
  tenantName?: string;
  actorName?: string;
}

export const AndroidTvLiveDashboard: React.FC<AndroidTvLiveDashboardProps> = ({
  tenantId = 'ALL',
  tenantName = 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ & কমান্ড সেন্টার',
  actorName = 'এডমিন ইউজার'
}) => {
  // Display Modes
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Real-time Data States
  const [metrics, setMetrics] = useState<TvDashboardMetrics | null>(null);
  const [activities, setActivities] = useState<LiveActivityItem[]>([]);
  const [announcements, setAnnouncements] = useState<TvAnnouncement[]>([]);
  const [chargingSlots, setChargingSlots] = useState<ChargingSlot[]>([]);

  // Monitor Network Online/Offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Real-time Firebase Firestore Listeners
  useEffect(() => {
    const unsubMetrics = TvDashboardService.subscribeMetrics(tenantId, setMetrics);
    const unsubActivities = TvDashboardService.subscribeLiveActivity(tenantId, setActivities);
    const unsubAnnouncements = TvDashboardService.subscribeAnnouncements(tenantId, setAnnouncements);
    const unsubSlots = TvDashboardService.subscribeChargingSlots(tenantId, setChargingSlots);

    return () => {
      unsubMetrics();
      unsubActivities();
      unsubAnnouncements();
      unsubSlots();
    };
  }, [tenantId]);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Error entering fullscreen:', err);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const alertStatus: SystemAlertStatus = {
    subscriptionExpiringSoon: false,
    daysRemaining: 12,
    isOffline: !isOnline,
    isFirebaseSyncing: false,
    dueAlertCount: metrics?.dueMembersTodayCount || 0,
    highPriorityAnnouncements: announcements.filter(a => a.priority === 'HIGH')
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      
      {/* 1. Top Bar Header */}
      <TvTopHeader
        tenantName={tenantName}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onOpenAnnouncementModal={() => setIsAnnouncementModalOpen(true)}
        isOnline={isOnline}
      />

      {/* 2. Scrolling Marquee Announcement */}
      <TvMarqueeAnnouncement announcements={announcements} />

      {/* 3. Main Live Dashboard Body */}
      <main className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
        
        {/* Alerts Banner if Offline or Due */}
        <TvAlertsOverlay alerts={alertStatus} />

        {/* Real-time Metrics Counters Cards */}
        {metrics && (
          <TvMetricsCounters
            metrics={metrics}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Split Grid: Left = Charging Slots Monitor, Right = Live Activity Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Charging Slots (7 cols) */}
          <div className="lg:col-span-7">
            <TvChargingSlotStatus
              slots={chargingSlots}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Right Column: Live Feed (5 cols) */}
          <div className="lg:col-span-5">
            <TvLiveActivityFeed
              activities={activities}
              isDarkMode={isDarkMode}
            />
          </div>

        </div>

      </main>

      {/* Broadcast Announcement Modal */}
      <TvAdminAnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        tenantId={tenantId}
        actorName={actorName}
      />

    </div>
  );
};
