import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ShieldAlert, 
  FileText, 
  Settings, 
  DownloadCloud, 
  RotateCcw, 
  RefreshCw, 
  CheckCircle2 
} from 'lucide-react';
import { BackupItem, BackupLog, RestoreLog, SystemHealthStatus } from '../../types/backup';
import { BackupService } from '../../services/backupService';
import { BackupHeader } from './BackupHeader';
import { BackupHubCards } from './BackupHubCards';
import { BackupCreatorModal } from './BackupCreatorModal';
import { RestorePreviewModal } from './RestorePreviewModal';
import { DisasterRecoveryWizard } from './DisasterRecoveryWizard';
import { BackupLogsTable } from './BackupLogsTable';
import { SystemHealthWidget } from './SystemHealthWidget';

interface BackupDashboardProps {
  currentTenantId?: string;
  currentTenantName?: string;
  actorName?: string;
}

export const BackupDashboard: React.FC<BackupDashboardProps> = ({
  currentTenantId = 'org_bismillah_001',
  currentTenantName = 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
  actorName = 'সুপার এডমিন ইউজার'
}) => {
  const [activeTab, setActiveTab] = useState<'HUB' | 'WIZARD' | 'LOGS' | 'SETTINGS'>('HUB');
  const [loading, setLoading] = useState<boolean>(false);

  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [backupLogs, setBackupLogs] = useState<BackupLog[]>([]);
  const [restoreLogs, setRestoreLogs] = useState<RestoreLog[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealthStatus | null>(null);

  // Modals state
  const [isCreatorOpen, setIsCreatorOpen] = useState<boolean>(false);
  const [selectedBackupForRestore, setSelectedBackupForRestore] = useState<BackupItem | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bkps, blogList, rlogList, health] = await Promise.all([
        BackupService.fetchBackups(currentTenantId),
        BackupService.fetchBackupLogs(currentTenantId),
        BackupService.fetchRestoreLogs(currentTenantId),
        BackupService.fetchSystemHealth(currentTenantId)
      ]);

      setBackups(bkps);
      setBackupLogs(blogList);
      setRestoreLogs(rlogList);
      setSystemHealth(health);
    } catch (e) {
      console.error('Error loading backup module data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenantId]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 font-sans">
      
      {/* Module Header */}
      <BackupHeader
        onRefresh={loadData}
        loading={loading}
        onOpenCreateBackup={() => setIsCreatorOpen(true)}
      />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-md">
        
        <button
          onClick={() => setActiveTab('HUB')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
            activeTab === 'HUB'
              ? 'bg-emerald-500 text-slate-950 shadow-lg'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          ১. ব্যাকআপ হ্যাব & কুইক অ্যাকশন
        </button>

        <button
          onClick={() => setActiveTab('WIZARD')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
            activeTab === 'WIZARD'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          ২. ডিজাস্টার রিকভারি উইজার্ড
        </button>

        <button
          onClick={() => setActiveTab('LOGS')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
            activeTab === 'LOGS'
              ? 'bg-emerald-500 text-slate-950 shadow-lg'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          ৩. ব্যাকআপ & রিস্টোর অডিট লগ
        </button>

        <button
          onClick={() => setActiveTab('SETTINGS')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
            activeTab === 'SETTINGS'
              ? 'bg-emerald-500 text-slate-950 shadow-lg'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          ৪. সিডিউলার & হেলথ সেটিংস
        </button>

      </div>

      {/* TAB 1: BACKUP HUB & STATS */}
      {activeTab === 'HUB' && (
        <div className="space-y-6 animate-in fade-in">
          <BackupHubCards health={systemHealth} backupsCount={backups.length} />

          {/* Quick List & Creator Trigger */}
          <BackupLogsTable
            backups={backups}
            backupLogs={backupLogs}
            restoreLogs={restoreLogs}
            onOpenRestorePreview={(item) => setSelectedBackupForRestore(item)}
            onRefresh={loadData}
          />
        </div>
      )}

      {/* TAB 2: DISASTER RECOVERY WIZARD */}
      {activeTab === 'WIZARD' && (
        <div className="animate-in fade-in">
          <DisasterRecoveryWizard
            backups={backups}
            tenantId={currentTenantId}
            actorName={actorName}
            onRecoveryComplete={loadData}
          />
        </div>
      )}

      {/* TAB 3: BACKUP LOGS */}
      {activeTab === 'LOGS' && (
        <div className="animate-in fade-in">
          <BackupLogsTable
            backups={backups}
            backupLogs={backupLogs}
            restoreLogs={restoreLogs}
            onOpenRestorePreview={(item) => setSelectedBackupForRestore(item)}
            onRefresh={loadData}
          />
        </div>
      )}

      {/* TAB 4: SYSTEM HEALTH & SCHEDULER SETTINGS */}
      {activeTab === 'SETTINGS' && (
        <div className="animate-in fade-in">
          <SystemHealthWidget
            health={systemHealth}
            onUpdateSettings={(updated) => {
              if (systemHealth) {
                setSystemHealth({ ...systemHealth, ...updated });
              }
            }}
          />
        </div>
      )}

      {/* CREATOR MODAL */}
      <BackupCreatorModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        tenantId={currentTenantId}
        tenantName={currentTenantName}
        actorName={actorName}
        onBackupCreated={loadData}
      />

      {/* RESTORE PREVIEW MODAL */}
      <RestorePreviewModal
        backupItem={selectedBackupForRestore}
        isOpen={!!selectedBackupForRestore}
        onClose={() => setSelectedBackupForRestore(null)}
        tenantId={currentTenantId}
        actorName={actorName}
        onRestoreComplete={loadData}
      />

    </div>
  );
};
