export type BackupType = 'MANUAL' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ORGANIZATION_WISE' | 'COLLECTION_WISE' | 'SETTINGS_ONLY' | 'BRANDING_ONLY';

export type BackupStatus = 'SUCCESS' | 'IN_PROGRESS' | 'FAILED' | 'PENDING' | 'CORRUPTED';

export type RestoreStatus = 'SUCCESS' | 'IN_PROGRESS' | 'FAILED' | 'ROLLED_BACK';

export interface BackupItem {
  id: string;
  filename: string;
  backupType: BackupType;
  status: BackupStatus;
  sizeBytes: number;
  sizeFormatted: string;
  tenantId: string;
  tenantName: string;
  collectionsIncluded: string[];
  totalRecordsCount: number;
  createdBy: string;
  createdAt: string;
  checksumMd5: string;
  isEncrypted: boolean;
  storageProvider: 'FIREBASE_STORAGE' | 'GCP_CLOUD_STORAGE' | 'LOCAL_EXPORT';
  downloadUrl?: string;
  dataJson?: string; // Serialized stringified DB snapshot
}

export interface RestoreLog {
  id: string;
  backupId: string;
  backupFilename: string;
  restoreType: 'FULL' | 'ORGANIZATION' | 'COLLECTION';
  status: RestoreStatus;
  restoredBy: string;
  restoredAt: string;
  tenantId: string;
  recordsRestoredCount: number;
  rollbackSnapshotId?: string;
  notes?: string;
}

export interface BackupLog {
  id: string;
  backupId: string;
  backupFilename: string;
  backupType: BackupType;
  status: BackupStatus;
  sizeFormatted: string;
  createdBy: string;
  createdAt: string;
  tenantId: string;
  durationMs: number;
  errorMessage?: string;
}

export interface SystemHealthStatus {
  id?: string;
  tenantId: string;
  firestoreConnected: boolean;
  storageAvailable: boolean;
  lastBackupAt: string;
  lastBackupStatus: BackupStatus;
  nextScheduledBackupAt: string;
  totalBackupsCount: number;
  storageUsedMB: number;
  storageLimitMB: number;
  autoBackupEnabled: boolean;
  backupFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  retentionDays: number;
}

export interface DisasterRecoveryVerification {
  isValid: boolean;
  totalCollectionsChecked: number;
  totalRecordsChecked: number;
  corruptedRecordsCount: number;
  orphanedRecordsCount: number;
  schemaVersionMatch: boolean;
  encryptionVerified: boolean;
  details: string[];
}
