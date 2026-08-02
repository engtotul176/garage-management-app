export type EnvironmentType = 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';

export interface ProductionEnvironmentConfig {
  envName: EnvironmentType;
  baseUrl: string;
  firebaseProjectId: string;
  appCheckEnabled: boolean;
  sslActive: boolean;
  activeBuildVersion: string;
  lastDeployedAt: string;
  nodeEnv: string;
  expressPort: number;
}

export interface FirebaseProductDeploymentStatus {
  productName: 'Firebase Hosting' | 'Firestore DB' | 'Firebase Auth' | 'Firebase Authentication' | 'Firebase Storage' | 'Firebase Functions' | 'Firebase App Check';
  status: 'DEPLOYED_HEALTHY' | 'SYNCED' | 'CONFIGURED';
  lastSyncedAt: string;
  activeRulesVersion: string;
  details: string;
}

export interface CustomDomainSslConfig {
  id: string;
  domainName: string;
  status: 'ACTIVE_SSL' | 'PENDING_DNS' | 'VERIFYING';
  sslProvider: string;
  sslExpiresAt: string;
  wwwRedirectEnabled: boolean;
  dnsRecords: { type: 'A' | 'CNAME' | 'TXT'; host: string; value: string; status: 'VERIFIED' | 'PENDING' }[];
}

export interface CiCdPipelineRun {
  id: string;
  commitHash: string;
  commitMessage: string;
  branch: string;
  triggeredBy: string;
  buildStatus: 'SUCCESS' | 'BUILDING' | 'FAILED';
  testStatus: 'PASSED' | 'TESTING' | 'FAILED';
  deployStatus: 'DEPLOYED' | 'PENDING' | 'ROLLED_BACK';
  durationSeconds: number;
  timestamp: string;
  releaseTag: string;
}

export interface PreDeploymentBackupSnapshot {
  snapshotId: string;
  timestamp: string;
  versionTag: string;
  firestoreDataSizeBytes: number;
  storageFilesCount: number;
  checksumHash: string;
  status: 'VERIFIED_READY' | 'ARCHIVED';
}

export interface DeploymentChecklistItem {
  id: string;
  category: 'SECURITY' | 'INTEGRATION' | 'GATEWAY' | 'PLATFORM';
  title: string;
  verified: boolean;
  verifiedAt: string;
  verifiedBy: string;
  notes: string;
}

export interface SystemMonitoringSnapshot {
  crashRatePct: number;
  avgP99LatencyMs: number;
  errorLogCount24h: number;
  dailyActiveUsers: number;
  monthlyRecurringRevenueBdt: number;
  serverUptimePct: number;
}
