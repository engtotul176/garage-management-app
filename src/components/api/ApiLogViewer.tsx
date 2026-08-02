import React, { useState } from 'react';
import { Activity, Search, Filter, Terminal, Clock, CheckCircle, AlertTriangle, XCircle, Code2 } from 'lucide-react';
import { ApiLogRecord } from '../../types/apiBackend';

interface ApiLogViewerProps {
  logs: ApiLogRecord[];
  onRefresh: () => void;
}

export const ApiLogViewer: React.FC<ApiLogViewerProps> = ({ logs, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<ApiLogRecord | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.clientIp.includes(searchTerm) ||
      (log.userAgent && log.userAgent.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMethod = methodFilter === 'ALL' || log.method === methodFilter;
    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === '2XX' && log.statusCode >= 200 && log.statusCode < 300) ||
      (statusFilter === '4XX' && log.statusCode >= 400 && log.statusCode < 500) ||
      (statusFilter === '5XX' && log.statusCode >= 500);

    return matchesSearch && matchesMethod && matchesStatus;
  });

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
          <CheckCircle className="w-3 h-3" />
          {status} OK
        </span>
      );
    } else if (status >= 400 && status < 500) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
          <AlertTriangle className="w-3 h-3" />
          {status} BAD REQ
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1 w-fit">
          <XCircle className="w-3 h-3" />
          {status} ERR
        </span>
      );
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'GET':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">GET</span>;
      case 'POST':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">POST</span>;
      case 'PUT':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">PUT</span>;
      case 'DELETE':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">DELETE</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-slate-500/20 text-slate-400">{method}</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            Realtime REST API Request & Response Telemetry Logs
          </h3>
          <p className="text-xs text-slate-500">
            মোবাইল ও ডেসktop অ্যাপসের রিয়েলটাইম API রিকোয়েস্ট মনিটরিং ও লেটেন্সি ট্র্যাকিং
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl flex items-center gap-2 transition-all"
        >
          <Clock className="w-4 h-4 text-emerald-500" />
          রিফ্রেশ লগস
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="এন্ডপয়েন্ট বা IP দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">সকল মেথড (All Methods)</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">সকল স্ট্যাটাস কোড (All Status Codes)</option>
            <option value="2XX">2XX Success</option>
            <option value="4XX">4XX Client Error</option>
            <option value="5XX">5XX Server Error</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase">
              <th className="py-3 px-3">সময় (Time)</th>
              <th className="py-3 px-3">মেথড</th>
              <th className="py-3 px-3">এন্ডপয়েন্ট (Endpoint)</th>
              <th className="py-3 px-3">স্ট্যাটাস</th>
              <th className="py-3 px-3">লেটেন্সি</th>
              <th className="py-3 px-3">ক্লায়েন্ট IP & User Agent</th>
              <th className="py-3 px-3 text-right">ডিটেইলস</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-sans font-bold">
                  কোনো API লগ ম্যাচ করেনি।
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                  <td className="py-3 px-3 text-slate-500 text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString('bn-BD')}
                  </td>
                  <td className="py-3 px-3">
                    {getMethodBadge(log.method)}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100 text-[11px]">
                    {log.endpoint}
                  </td>
                  <td className="py-3 px-3">
                    {getStatusBadge(log.statusCode)}
                  </td>
                  <td className="py-3 px-3 text-amber-500 font-bold text-[11px]">
                    {log.responseTimeMs} ms
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[10px]">
                    <div>{log.clientIp}</div>
                    <div className="truncate max-w-xs text-[9px] text-slate-500">{log.userAgent}</div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-sans font-bold border border-indigo-500/30 transition-all"
                    >
                      ইনস্পেক্ট
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Log Inspection Details */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <h4 className="text-sm font-black text-white font-mono">
                  {selectedLog.method} {selectedLog.endpoint}
                </h4>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">Status:</span>
                {getStatusBadge(selectedLog.statusCode)}
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Latency:</span>
                <span className="text-amber-400 font-bold">{selectedLog.responseTimeMs} ms</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Client IP:</span>
                <span className="text-slate-200">{selectedLog.clientIp}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Version:</span>
                <span className="text-indigo-400 font-bold">{selectedLog.version}</span>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-slate-400 font-bold block mb-1">Request Payload (JSON):</span>
                <pre className="p-3 bg-slate-950 text-emerald-400 border border-slate-800 rounded-2xl text-[11px] overflow-x-auto">
                  {selectedLog.requestPayload || '{}'}
                </pre>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">Response Payload (JSON):</span>
                <pre className="p-3 bg-slate-950 text-indigo-300 border border-slate-800 rounded-2xl text-[11px] overflow-x-auto">
                  {selectedLog.responsePayload || '{}'}
                </pre>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
