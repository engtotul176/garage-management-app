import React, { useState } from 'react';
import { BookOpen, Download, Play, CheckCircle2, Code, FileCode, Server, Terminal, Lock } from 'lucide-react';
import { ENDPOINT_CATALOG, ApiBackendService } from '../../services/apiBackendService';
import { EndpointDefinition } from '../../types/apiBackend';

export const SwaggerDocsViewer: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDefinition>(ENDPOINT_CATALOG[0]);
  const [testResponse, setTestResponse] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunTest = async () => {
    setLoading(true);
    setTestResponse(null);

    try {
      // Execute live fetch request to Express server
      const res = await fetch(selectedEndpoint.path.replace('{orgId}', 'org_bismillah_001').replace('{receiptNo}', 'REC-2026-08812'), {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'ababil_live_and_78901234567890123456'
        },
        body: selectedEndpoint.method === 'POST' ? JSON.stringify({
          emailOrMobile: '01711002233',
          passwordOrPin: '123456',
          memberName: 'টেস্ট ড্রাইভার',
          mobile: '01711002233',
          amount: 500
        }) : undefined
      });

      const data = await res.json();
      setTestResponse(data);
    } catch (e) {
      // Fallback sample response
      setTestResponse(selectedEndpoint.sampleResponse);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadOpenApi = () => {
    const spec = ApiBackendService.generateOpenApiSpec();
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ababil_openapi_3.0_spec.json';
    a.click();
  };

  const handleDownloadPostman = () => {
    const collection = ApiBackendService.generatePostmanCollection();
    const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ababil_postman_collection.json';
    a.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Endpoints Index */}
      <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              REST API Endpoints (v1)
            </h4>
            <p className="text-[11px] text-slate-500">Swagger OpenAPI 3.0 Standard</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownloadOpenApi}
            className="px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] rounded-xl border border-indigo-500/30 flex items-center justify-center gap-1.5 transition-all"
          >
            <FileCode className="w-3.5 h-3.5" />
            OpenAPI Spec
          </button>

          <button
            onClick={handleDownloadPostman}
            className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-[11px] rounded-xl border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Postman Json
          </button>
        </div>

        {/* List of Endpoints */}
        <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
          {ENDPOINT_CATALOG.map((ep, idx) => {
            const isSelected = selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
            return (
              <button
                key={`${ep.method}-${ep.path}-${idx}`}
                onClick={() => {
                  setSelectedEndpoint(ep);
                  setTestResponse(null);
                }}
                className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                  isSelected 
                    ? 'bg-indigo-600/10 border-indigo-500/60 shadow-md' 
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span className={`px-2 py-0.5 rounded text-[9px] font-black font-mono shrink-0 ${
                  ep.method === 'GET' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {ep.method}
                </span>

                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate font-mono">
                    {ep.path}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {ep.summary}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Right Column: Interactive Endpoint Explorer & Tester */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* Endpoint Detail Banner */}
        <div className="p-5 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono">
              <span className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                selectedEndpoint.method === 'GET' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'
              }`}>
                {selectedEndpoint.method}
              </span>
              <span className="text-sm font-bold text-emerald-400">{selectedEndpoint.path}</span>
            </div>

            <span className="px-2.5 py-1 bg-slate-800 text-indigo-300 rounded-xl text-[10px] font-bold">
              {selectedEndpoint.module}
            </span>
          </div>

          <p className="text-xs text-slate-300">{selectedEndpoint.description}</p>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800 font-mono">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Auth Required: {selectedEndpoint.authRequired ? 'YES (X-API-KEY / Bearer)' : 'NO'}
            </span>
            {selectedEndpoint.scopeRequired && (
              <span className="text-indigo-400 font-bold">Scope: {selectedEndpoint.scopeRequired}</span>
            )}
          </div>
        </div>

        {/* Parameters Section */}
        {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              অনুরোধের প্যারামিটার (Parameters / Payload)
            </h5>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-950 text-slate-400 font-extrabold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2 px-3">নাম</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">In</th>
                    <th className="py-2 px-3">Required</th>
                    <th className="py-2 px-3">বিবরণ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                  {selectedEndpoint.parameters.map((p) => (
                    <tr key={p.name}>
                      <td className="py-2 px-3 font-bold text-indigo-500">{p.name}</td>
                      <td className="py-2 px-3 text-slate-400">{p.type}</td>
                      <td className="py-2 px-3 text-amber-500">{p.in}</td>
                      <td className="py-2 px-3 font-sans font-bold text-rose-500">{p.required ? 'REQUIRED' : 'Optional'}</td>
                      <td className="py-2 px-3 font-sans text-slate-500">{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Live Test Console */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              লাইভ এন্ডপয়েন্ট টেস্ট কনসোল (Live Test Console)
            </h5>

            <button
              onClick={handleRunTest}
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {loading ? 'টেস্ট চলছে...' : 'Execute Live API Request'}
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-500 font-mono block">Response Payload (JSON Standard):</span>
            <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto max-h-64 border border-slate-800">
              {JSON.stringify(testResponse || selectedEndpoint.sampleResponse, null, 2)}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
};
