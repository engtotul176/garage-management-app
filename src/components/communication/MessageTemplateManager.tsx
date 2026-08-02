import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  RefreshCw, 
  Tag, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { MessageTemplate } from '../../types/communication';
import { CommunicationService } from '../../services/communicationService';

interface MessageTemplateManagerProps {
  currentTenantId: string;
  currentUserUid: string;
}

const DYNAMIC_VARIABLE_TAGS = [
  '{{MemberName}}',
  '{{Amount}}',
  '{{ReceiptNo}}',
  '{{OrganizationName}}',
  '{{DueAmount}}',
  '{{Date}}',
  '{{ExpiryDate}}',
  '{{Phone}}'
];

export const MessageTemplateManager: React.FC<MessageTemplateManagerProps> = ({
  currentTenantId,
  currentUserUid
}) => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<MessageTemplate> | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    loadTemplates();
  }, [currentTenantId]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await CommunicationService.getMessageTemplates(currentTenantId);
      setTemplates(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNew = () => {
    setEditingTemplate({
      templateId: `tmpl_${Date.now()}`,
      tenantId: currentTenantId,
      title: '',
      category: 'general',
      channel: 'sms',
      body: '',
      variables: ['{{MemberName}}'],
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tmpl: MessageTemplate) => {
    setEditingTemplate({ ...tmpl });
    setIsModalOpen(true);
  };

  const handleInsertTag = (tag: string) => {
    if (!editingTemplate) return;
    const currentBody = editingTemplate.body || '';
    const updatedBody = currentBody + ' ' + tag;
    const currentVars = editingTemplate.variables || [];
    const updatedVars = Array.from(new Set([...currentVars, tag]));

    setEditingTemplate({
      ...editingTemplate,
      body: updatedBody,
      variables: updatedVars
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate || !editingTemplate.title || !editingTemplate.body) return;

    setSaving(true);
    try {
      const tmplObj: MessageTemplate = {
        templateId: editingTemplate.templateId || `tmpl_${Date.now()}`,
        tenantId: currentTenantId,
        title: editingTemplate.title,
        category: editingTemplate.category || 'general',
        channel: editingTemplate.channel as any || 'sms',
        body: editingTemplate.body,
        variables: editingTemplate.variables || [],
        isActive: editingTemplate.isActive ?? true,
        createdAt: editingTemplate.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await CommunicationService.saveMessageTemplate(tmplObj, currentUserUid);
      setIsModalOpen(false);
      loadTemplates();
    } catch (e) {
      alert('টেমপ্লেট সেভ করা সম্ভব হয়নি!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm('এই টেমপ্লেটটি মুছে ফেলতে নিশ্চিত?')) return;
    try {
      await CommunicationService.deleteMessageTemplate(templateId, currentTenantId, currentUserUid);
      setTemplates(prev => prev.filter(t => t.templateId !== templateId));
    } catch (e) {
      alert('টেমপ্লেট মোছা সম্ভব হয়নি');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
            <FileText className="w-5 h-5 text-emerald-600" />
            মেসেজ টেমপ্লেট বিল্ডার (Message Template Library)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            বারংবার ব্যবহৃত SMS ও পুশ বার্তার জন্য ডায়নামিক টেমপ্লেট তৈরি ও সংরক্ষণ করুন
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          নতুন টেমপ্লেট
        </button>
      </div>

      {/* Grid of Templates */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-500 mr-2" />
          টেমপ্লেট লোড হচ্ছে...
        </div>
      ) : templates.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold">কোনো সেভ করা টেমপ্লেট পাওয়া যায়নি</p>
          <button onClick={handleOpenNew} className="mt-2 text-xs text-emerald-600 font-bold underline">
            প্রথম টেমপ্লেট যোগ করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(tmpl => (
            <div
              key={tmpl.templateId}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {tmpl.category} • {tmpl.channel.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(tmpl)}
                      className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(tmpl.templateId)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {tmpl.title}
                </h4>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-sans border border-slate-100 dark:border-slate-700/50">
                  {tmpl.body}
                </div>
              </div>

              {/* Tags / Variables Used */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex flex-wrap gap-1">
                  {tmpl.variables.map(v => (
                    <span key={v} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono text-[9px]">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Template Modal */}
      {isModalOpen && editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                মেসেজ টেমপ্লেট সম্পাদনা (Edit Template)
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  টেমপ্লেট টাইটেল (Template Title) *
                </label>
                <input
                  type="text"
                  value={editingTemplate.title || ''}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                  placeholder="যেমন: কালেকশন প্রাপ্তি রসিদ"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={editingTemplate.category || 'general'}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-900 dark:text-white"
                  >
                    <option value="collection">Collection</option>
                    <option value="due">Due Payment</option>
                    <option value="registration">Member Registration</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    চ্যানেল (Channel)
                  </label>
                  <select
                    value={editingTemplate.channel || 'sms'}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, channel: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-900 dark:text-white"
                  >
                    <option value="sms">SMS</option>
                    <option value="push">Push Notification</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  টেমপ্লেট বার্তা টেক্সট (Template Body) *
                </label>
                <textarea
                  rows={4}
                  value={editingTemplate.body || ''}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                  placeholder="বার্তার কন্টেন্ট লিখুন..."
                  required
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              {/* Insert Tags */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  ক্লিক করে ডাইনামিক ভেরিয়েবল ট্যাগ যোগ করুন:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {DYNAMIC_VARIABLE_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleInsertTag(tag)}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 text-[10px] font-mono rounded transition-all"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  {saving ? 'সেভ হচ্ছে...' : 'টেমপ্লেট সেভ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
