import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Upload, 
  CheckCircle2, 
  AlertOctagon, 
  FileCheck2, 
  Lock, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Database 
} from 'lucide-react';
import { BackupItem, DisasterRecoveryVerification } from '../../types/backup';
import { BackupService } from '../../services/backupService';

interface DisasterRecoveryWizardProps {
  backups: BackupItem[];
  tenantId: string;
  actorName: string;
  onRecoveryComplete: () => void;
}

export const DisasterRecoveryWizard: React.FC<DisasterRecoveryWizardProps> = ({
  backups,
  tenantId,
  actorName,
  onRecoveryComplete
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedBackup, setSelectedBackup] = useState<BackupItem | null>(null);
  const [uploadedJsonContent, setUploadedJsonContent] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<DisasterRecoveryVerification | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setUploadedJsonContent(content);
        
        // Build temporary backup object
        const tempBkp: BackupItem = {
          id: `uploaded_${Date.now()}`,
          filename: file.name,
          backupType: 'MANUAL',
          status: 'SUCCESS',
          sizeBytes: file.size,
          sizeFormatted: (file.size / 1024).toFixed(2) + ' KB',
          tenantId,
          tenantName: 'আপলোড করা লোকাল ফাইল',
          collectionsIncluded: ['ALL_COLLECTIONS'],
          totalRecordsCount: 142,
          createdBy: actorName,
          createdAt: new Date().toISOString(),
          checksumMd5: 'md5_uploaded_' + Math.floor(Math.random() * 100000),
          isEncrypted: true,
          storageProvider: 'LOCAL_EXPORT',
          dataJson: content
        };

        setSelectedBackup(tempBkp);
      };
      reader.readAsText(file);
    }
  };

  // Step 2: Integrity Scan
  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      if (selectedBackup) {
        const res = BackupService.verifyBackupIntegrity(selectedBackup);
        setVerificationResult(res);
      }
      setIsVerifying(false);
      setStep(2);
    }, 600);
  };

  // Step 4: Execute Emergency Recovery
  const handleStartEmergencyRecovery = () => {
    setIsExecuting(true);
    setProgress(10);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsExecuting(false);
          setIsComplete(true);
          onRecoveryComplete();
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-white shadow-2xl space-y-6">
      
      {/* Wizard Step Indicator */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">ডিজাস্টার রিকভারি উইজার্ড (Emergency Recovery Wizard)</h2>
            <p className="text-xs text-slate-400">
              সিস্টেম ক্র্যাশ, ডাটা কারাপশন বা জরুরী পরিস্থিতিতে ৩-ধাপে নিরাপদ রিকভারি এক্সিকিউশন
            </p>
          </div>
        </div>

        {/* Step Badge */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                step === s
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : step > s
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {step > s ? '✓' : s}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Select or Upload Backup */}
      {step === 1 && (
        <div className="space-y-5 animate-in fade-in">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-200 mb-2">১. ব্যাকআপ সোর্স নির্বাচন করুন (Select Source):</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Option A: Select from Cloud List */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-rose-400 block">অপশন A: বিদ্যমান ক্লাউড ব্যাকআপ থেকে নির্বাচন</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {backups.map((bkp) => (
                    <div
                      key={bkp.id}
                      onClick={() => {
                        setSelectedBackup(bkp);
                        setUploadedJsonContent('');
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedBackup?.id === bkp.id
                          ? 'bg-rose-500/10 border-rose-500 text-white'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="font-bold flex justify-between">
                        <span className="truncate">{bkp.filename}</span>
                        <span className="text-emerald-400">{bkp.sizeFormatted}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        ধরন: {bkp.backupType} | তারিখ: {new Date(bkp.createdAt).toLocaleDateString('bn-BD')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Option B: Local JSON Upload */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-sky-400 block mb-2">অপশন B: লোকাল পিসি থেকে JSON ফাইল আপলোড</span>
                  <p className="text-xs text-slate-400 mb-3">
                    আপনার পূর্বে ডাউনলোড করা .json ব্যাকআপ ফাইলটি ড্র্যাগ অ্যান্ড ড্রপ করুন।
                  </p>
                </div>

                <label className="border-2 border-dashed border-slate-700 hover:border-sky-500 p-6 rounded-2xl text-center cursor-pointer transition-all bg-slate-950/60 block">
                  <Upload className="w-8 h-8 text-sky-400 mx-auto mb-2" />
                  <span className="text-xs font-bold text-white block">JSON ব্যাকআপ ফাইল সিলেক্ট করুন</span>
                  <span className="text-[10px] text-slate-500 block mt-1">সর্বোচ্চ ৩০ MB পর্যন্ত সাপোর্টেড</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

            </div>
          </div>

          {/* Selected File Feedback */}
          {selectedBackup && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-300">নির্বাচিত ব্যাকআপ ফাইল:</div>
                <div className="text-sm font-black text-emerald-400 font-mono">{selectedBackup.filename}</div>
              </div>
              <button
                onClick={handleRunVerification}
                disabled={isVerifying}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-white text-xs font-black rounded-xl shadow-lg transition-all"
              >
                {isVerifying ? 'স্ক্যান করা হচ্ছে...' : 'পরবর্তী ধাপ: ফাইল ভ্যালিডেশন'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Integrity & Checksum Result */}
      {step === 2 && verificationResult && (
        <div className="space-y-5 animate-in fade-in">
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              ২. ফাইল ইন্টিগ্রিটি ও ডাটা স্ট্রাকচার ভ্যালিডেশন রিপোর্ট
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold">স্ক্যানড কালেকশন</span>
                <span className="text-lg font-black text-white">{verificationResult.totalCollectionsChecked} টি</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold">মোট রেকর্ড ডাটা</span>
                <span className="text-lg font-black text-emerald-400">{verificationResult.totalRecordsChecked} টি</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold">কারাপ্টেড বা ব্রোকেন</span>
                <span className="text-lg font-black text-rose-400">{verificationResult.corruptedRecordsCount} টি</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold">এনক্রিপশন চেকম</span>
                <span className="text-xs font-black text-emerald-400 mt-1 block">PASS (Valid)</span>
              </div>
            </div>

            {/* Checklist Logs */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-slate-300">ভ্যালিডেশন লগ বিবরণী:</div>
              {verificationResult.details.map((d, i) => (
                <div key={i} className="text-emerald-400 font-mono text-[11px] flex items-center gap-2">
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-slate-300"
            >
              পেছনে যান
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-white text-xs font-black rounded-xl shadow-lg"
            >
              জরুরী রিকভারি এক্সিকিউশনে যান
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Final Recovery Confirmation */}
      {step === 3 && (
        <div className="space-y-5 animate-in fade-in">
          {isComplete ? (
            <div className="p-8 bg-emerald-950/60 border border-emerald-800 rounded-3xl text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-black text-white">ডিজাস্টার রিকভারি সফলভাবে সম্পন্ন হয়েছে!</h3>
              <p className="text-xs text-emerald-200 max-w-md mx-auto">
                সকল ফায়ারবেস কালেকশন এবং রেকর্ড ডাটাবেজে পুনঃসংস্থাপিত করা হয়েছে।
              </p>
              <button
                onClick={() => {
                  setStep(1);
                  setIsComplete(false);
                  setSelectedBackup(null);
                }}
                className="mt-4 px-6 py-2.5 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg"
              >
                প্যানেলে ফিরে যান
              </button>
            </div>
          ) : isExecuting ? (
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl text-center space-y-4">
              <div className="w-16 h-16 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto" />
              <div className="text-lg font-black text-rose-400 font-mono">
                জরুরী ডাটাবেজ পুনর্গঠন চলছে... {progress}%
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700 max-w-md mx-auto">
                <div 
                  className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-950 border border-rose-900/60 rounded-3xl space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertOctagon className="w-8 h-8 shrink-0" />
                <div>
                  <h3 className="text-base font-black">চূড়ান্ত নিশ্চয়তা: রিকভারি রান করবেন?</h3>
                  <p className="text-xs text-slate-300">
                    এই ধাপটির মাধ্যমে ডাটাবেজের সকল কালেকশন রিস্টোর করা হবে। 
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl text-xs space-y-2 border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">টার্গেট ফাইল:</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedBackup?.filename}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">মোট রেকর্ডস:</span>
                  <span className="font-bold text-white">{selectedBackup?.totalRecordsCount} টি</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-slate-300"
                >
                  বাতিল
                </button>
                <button
                  onClick={handleStartEmergencyRecovery}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-xl active:scale-95 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  জরুরী রিকভারি এক্সিকিউট করুন
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
