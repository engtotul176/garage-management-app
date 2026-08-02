import React, { useState } from 'react';
import { FileCode, Copy, Check, Download, Layers, ShieldCheck, Terminal, Cpu } from 'lucide-react';
import { KOTLIN_PROJECT_STRUCTURE, KOTLIN_CODE_SNIPPETS } from '../../services/androidAppService';

export const KotlinCodeExporter: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState(KOTLIN_PROJECT_STRUCTURE[0].path);
  const [copied, setCopied] = useState(false);

  const currentCode = KOTLIN_CODE_SNIPPETS[selectedFilePath] || '// Kotlin Source Code';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-4">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-black text-white">
              Android Studio (Kotlin + Jetpack Compose) Architecture
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            MVVM Pattern • Hilt Dependency Injection • Retrofit2 REST API • Room Database • Material 3
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Code!' : 'Copy File Content'}
          </button>
        </div>
      </div>

      {/* File Tree & Code Inspector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Left File Navigation */}
        <div className="md:col-span-4 space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Project Files (Android Studio View):
          </label>

          {KOTLIN_PROJECT_STRUCTURE.map((item) => (
            <button
              key={item.path}
              onClick={() => setSelectedFilePath(item.path)}
              className={`w-full text-left p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-2 ${
                selectedFilePath === item.path
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <FileCode className="w-4 h-4 shrink-0 text-indigo-400" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}

          <div className="mt-4 p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Production Ready Criteria
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-4">
              <li>Firebase Auth & App Check SDK Enabled</li>
              <li>EncryptedSharedPreferences Security</li>
              <li>CameraX & Thermal Printer Driver Ready</li>
              <li>Auto Offline Sync Queue Worker</li>
            </ul>
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="md:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400">
            <span>{selectedFilePath}</span>
            <span className="text-[10px] text-emerald-400 font-bold">KOTLIN 1.9.20</span>
          </div>

          <pre className="p-4 text-xs font-mono text-indigo-200 overflow-x-auto max-h-[420px] leading-relaxed">
            <code>{currentCode}</code>
          </pre>
        </div>

      </div>

    </div>
  );
};
