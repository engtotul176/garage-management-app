import React, { useState } from 'react';
import { X, Megaphone, Send, Sparkles, AlertCircle } from 'lucide-react';
import { TvDashboardService } from '../../services/tvDashboardService';

interface TvAdminAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  actorName: string;
}

export const TvAdminAnnouncementModal: React.FC<TvAdminAnnouncementModalProps> = ({
  isOpen,
  onClose,
  tenantId,
  actorName
}) => {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      await TvDashboardService.sendAnnouncement(
        tenantId,
        message,
        priority,
        actorName
      );
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setMessage('');
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-5">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">লাইভ টিভি ঘোষণা প্রকাশ</h3>
            <p className="text-xs text-slate-400">
              এখান থেকে যে মেসেজ পোস্ট করবেন, তা টিভিতে স্ক্রলিং মার্কিউ নোটিশ আকারে ভেসে উঠবে।
            </p>
          </div>
        </div>

        {success ? (
          <div className="p-6 text-center bg-emerald-950/60 border border-emerald-800 rounded-2xl text-emerald-400 font-bold my-4">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-emerald-400 animate-bounce" />
            ঘোষণা টিভিতে সফলভাবে পাঠানো হয়েছে!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ঘোষণারPriority (গুরুত্ব):
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPriority('HIGH')}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all border ${
                    priority === 'HIGH'
                      ? 'bg-rose-600 border-rose-500 text-white shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  🚨 জরুরী (High)
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('MEDIUM')}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all border ${
                    priority === 'MEDIUM'
                      ? 'bg-amber-600 border-amber-500 text-white shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  📢 সাধারণ (Medium)
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('LOW')}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all border ${
                    priority === 'LOW'
                      ? 'bg-sky-600 border-sky-500 text-white shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  ℹ️ তথ্যমূলক (Low)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ঘোষণার বার্তা (বাংলা/English):
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="যেমন: শুভ অপরাহ্ন! সকল ড্রাইভার ভাইদের অনুরোধ জানানো যাচ্ছে যে সন্ধ্যকালীন চার্জিং স্লট স্লট-০৪ ও স্লট-০৫ এ বর্তমানে সম্পূর্ণ খালি রয়েছে..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {loading ? 'পাঠানো হচ্ছে...' : 'টিভিতে লাইভ ব্রডকাস্ট করুন'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
