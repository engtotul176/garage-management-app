export interface TvDashboardMetrics {
  todayCollection: number;
  monthlyCollection: number;
  todayIncome: number;
  todayExpense: number;
  activeMembers: number;
  vehiclesInside: number;
  chargingVehicles: number;
  completedCharging: number;
  availableSlots: number;
  occupiedSlots: number;
  dueMembersTodayCount: number;
  topCollectorToday: {
    name: string;
    amount: number;
  };
  topPayingMemberToday: {
    name: string;
    vehicleNo: string;
    amount: number;
  };
}

export interface LiveActivityItem {
  id: string;
  type: 'COLLECTION' | 'MEMBER_JOIN' | 'RECEIPT' | 'CHARGING_START' | 'CHARGING_COMPLETE' | 'ALERT';
  title: string;
  subtitle: string;
  amount?: number;
  timestamp: string;
  tenantId: string;
}

export interface TvAnnouncement {
  id: string;
  tenantId: string;
  message: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  active: boolean;
  createdAt: string;
  createdBy: string;
}

export interface ChargingSlot {
  slotId: string;
  slotNumber: string;
  status: 'CHARGING' | 'COMPLETED' | 'AVAILABLE' | 'MAINTENANCE';
  vehicleNo?: string;
  driverName?: string;
  startTime?: string;
  estimatedEndTime?: string;
}

export interface TvSettings {
  tenantId: string;
  themeMode: 'DARK' | 'LIGHT';
  fontSizeMode: 'LARGE' | 'EXTRA_LARGE';
  marqueeSpeed: 'SLOW' | 'NORMAL' | 'FAST';
  autoRotateIntervalSec: number;
  isReadOnlyMode: boolean;
  tvAccessPin?: string;
}

export interface SystemAlertStatus {
  subscriptionExpiringSoon: boolean;
  daysRemaining?: number;
  isOffline: boolean;
  isFirebaseSyncing: boolean;
  dueAlertCount: number;
  highPriorityAnnouncements: TvAnnouncement[];
}
