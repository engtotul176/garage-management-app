import React, { useState } from 'react';
import { Key, Plus, ShieldAlert, CheckCircle2, Copy, Trash2, Eye, EyeOff, Lock, Zap } from 'lucide-react';
import { ApiKeyRecord } from '../../types/apiBackend';
import { ApiBackendService } from '../../services/apiBackendService';

interface ApiKeyManagerProps {
  tenantId: string;
  apiKeys: ApiKeyRecord[];
  onKeysUpdated: () => void;
  actorName: string;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({
  tenantId,
  apiKeys,
  onKeysUpdated,
  actorName
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('ORG_ADMIN');
  const [rateLimit, setRateLimit] = useState(120);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    'members:read',
    'collections:read',
    'collections:write'
  ]);
  const [createdKey, setCreatedKey] = useState<ApiKeyRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  const ALL_SCOPES = [
    { id: 'auth:full', label: 'Auth & JWT Token issuing' },
    { id: 'members:read', label: 'Members Read (List & Details)' },
    { id: 'members:write', label: 'Members Write (Register & Update)' },
    { id: 'collections:read', label: 'Collections Read (Vouchers)' },
    { id: 'collections:write', label: 'Collections Write (Collect Money)' },
    { id: 'reports:read', label: 'Financial & Analytics Reports' },
    { id: 'push:send', label: 'Push Notifications Send' },
    { id: 'accounting:read', label: 'Accounting & Cashbook Read' }
  ];

  const handleToggleScope = (scopeId: string) => {
    setSelectedScopes(prev => 
      prev.includes(scopeId) ? prev.filter(s => s !== scopeId) : [...prev, scopeId]
    );
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newKey = await ApiBackendService.createApiKey(
      tenantId,
      name,
      role,
      selectedScopes,
      rateLimit,
      actorName
    );

    setCreatedKey(newKey);
    onKeysUpdated();
  };

  const handleRevoke = async (keyId: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই API Key রিভোক (Revoke) করতে চান? এটি ব্যবহার করা অ্যাপস কাজ বন্ধ করবে।')) {
      await ApiBackendService.revokeApiKey(keyId);
      onKeysUpdated();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleVisibility = (id: string) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-500" />
            REST API Key Credentials & Scope Control
          </h3>
          <p className="text-xs text-slate-500">
            মোবাইল অ্যাপস, পিওএস টার্মিনাল ও থার্ডপার্টি ওয়েবহুকের সিকিউর এক্সেস কি
          </p>
        </div>

        <button
          onClick={() => {
            setCreatedKey(null);
            setName('');
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          নতুন API Key তৈরি করুন
        </button>
      </div>

      {/* API Keys Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase">
              <th className="py-3 px-3">নাম ও ডিভাইস</th>
              <th className="py-3 px-3">API Key (X-API-KEY)</th>
              <th className="py-3 px-3">পারমিশন স্কোপ</th>
              <th className="py-3 px-3">রেট লিমিট</th>
              <th className="py-3 px-3">স্ট্যাটাস</th>
              <th className="py-3 px-3 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {apiKeys.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                  কোনো এক্টিভ API Key পাওয়া যায়নি।
                </td>
              </tr>
            ) : (
              apiKeys.map((key) => {
                const isVisible = visibleKeys[key.id];
                const displayKey = isVisible ? key.apiKey : `${key.apiKey.substring(0, 12)}••••••••••••••••`;

                return (
                  <tr key={key.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{key.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">তৈরি করেছে: {key.createdBy}</div>
                    </td>
                    <td className="py-3.5 px-3 font-mono">
                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 w-fit">
                        <span className="text-[11px] font-bold">{displayKey}</span>
                        <button
                          onClick={() => toggleVisibility(key.id)}
                          className="p-1 hover:text-indigo-500 transition-colors"
                        >
                          {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleCopy(key.apiKey, key.id)}
                          className="p-1 hover:text-indigo-500 transition-colors"
                          title="Copy API Key"
                        >
                          {copiedId === key.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {key.scopes.map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono">
                      <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        {key.rateLimitPerMin} req/min
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        key.status === 'ACTIVE' 
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30'
                      }`}>
                        {key.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {key.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleRevoke(key.id)}
                          className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-[11px] font-bold border border-rose-500/30 transition-all flex items-center gap-1 ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          রিভোক
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Create API Key */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">নতুন Enterprise REST API Key তৈরি</h4>
                <p className="text-[11px] text-slate-400">অ্যাপ্লিকেশনের সিকিউরিটি স্কোপ ও রেট লিমিট ডিফাইন করুন</p>
              </div>
            </div>

            {createdKey ? (
              <div className="space-y-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-5 h-5" />
                  API Key সফলভাবে তৈরি হয়েছে!
                </div>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold">API Key:</span>
                    <div className="p-2.5 bg-slate-950 font-mono text-emerald-300 rounded-xl border border-slate-800 select-all font-bold">
                      {createdKey.apiKey}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-semibold">Secret Key:</span>
                    <div className="p-2.5 bg-slate-950 font-mono text-amber-300 rounded-xl border border-slate-800 select-all font-bold">
                      {createdKey.secretKey}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs"
                  >
                    সম্পন্ন
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateKey} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    API Key নাম বা ডিভাইস লেবেল:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: Android Driver Mobile App v2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">ডিফল্ট রোল:</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="ORG_ADMIN">ORG_ADMIN</option>
                      <option value="EMPLOYEE">EMPLOYEE</option>
                      <option value="MEMBER">MEMBER</option>
                      <option value="SYSTEM">SYSTEM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">রেট লিমিট (Req/Min):</label>
                    <input
                      type="number"
                      value={rateLimit}
                      onChange={(e) => setRateLimit(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-2">অনুমোদিত পারমিশন স্কোপ (Scopes):</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                    {ALL_SCOPES.map((scope) => {
                      const checked = selectedScopes.includes(scope.id);
                      return (
                        <label
                          key={scope.id}
                          onClick={() => handleToggleScope(scope.id)}
                          className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                            checked 
                              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {}}
                            className="rounded text-indigo-500 focus:ring-0"
                          />
                          <span className="text-[11px] font-semibold truncate">{scope.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg"
                  >
                    API Key জেনারেট করুন
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
