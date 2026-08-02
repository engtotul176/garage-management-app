export interface PerformanceMetric {
  id: string;
  timestamp: string;
  responseTimeMs: number;
  firestoreReadCount: number;
  firestoreWriteCount: number;
  storageUsageMb: number;
  activeSessionsCount: number;
  apiRequestsPerMin: number;
  memoryUsageMb: number;
  cpuLoadPercentage: number;
  cacheHitRatioPercent: number;
}

export interface FirestoreQueryOptRule {
  id: string;
  collection: string;
  queryPattern: string;
  compositeIndexNeeded: string;
  estimatedCostReductionPct: number;
  status: 'OPTIMIZED' | 'INDEX_PENDING' | 'NEEDS_REFACTOR';
  recommendation: string;
}

export interface BundleOptimizationMetric {
  chunkName: string;
  sizeKb: number;
  lazyLoaded: boolean;
  compressionRatio: string;
  loadTimeMs: number;
}

export interface RealtimeListenerStatus {
  listenerId: string;
  targetCollection: string;
  activeSubscribers: number;
  autoCleanupEnabled: boolean;
  backgroundSyncIntervalSec: number;
  offlineCacheSizeBytes: number;
  status: 'HEALTHY' | 'MEM_LEAK_WARN' | 'DISCONNECTED';
}

export interface AndroidPerformanceProfile {
  startupTimeMs: number;
  frameDropRatePct: number;
  recyclerItemMemoryKb: number;
  backgroundSyncEfficiencyPct: number;
  sqliteCacheSizeMb: number;
  batteryDrainImpact: 'LOW' | 'OPTIMAL' | 'HIGH';
}

export interface SystemMonitoringAlert {
  id: string;
  timestamp: string;
  component: 'FIRESTORE' | 'API_GATEWAY' | 'ANDROID_APP' | 'MEMORY' | 'CDN';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  metricValue: string;
  status: 'ACTIVE' | 'RESOLVED';
}

export interface GlobalScalabilityBenchmark {
  targetOrganizationsCapacity: number;
  currentOrganizationsCount: number;
  targetMembersCapacity: number;
  currentMembersCount: number;
  avgReadLatencyMs: number;
  avgWriteLatencyMs: number;
  uptimePercentage: number;
}
