import React from 'react';
import { 
  X, Building2, MapPin, Phone, Mail, Calendar, Users, DollarSign, 
  ShieldCheck, Clock, Key, LogIn, Edit3, Lock, Trash2, CheckCircle2, AlertTriangle, Layers
} from 'lucide-react';
import { OrganizationTenant, PackageTier } from '../../types/saas';

interface OrgProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationTenant | null;
  packageDetail?: PackageTier;
  onEdit: (org: OrganizationTenant) => void;
  onToggleStatus: (id: string, currentStatus: any) => void;
  onResetPassword: (org: OrganizationTenant) => void;
  onImpersonate: (org: OrganizationTenant) => void;
  onSoftDelete: (org: OrganizationTenant) => void;
}

export const OrgProfileModal: React.FC<OrgProfileModalProps> = ({
  isOpen,
  onClose,
  organization,
  packageDetail,
  onEdit,
  onToggleStatus,
  onResetPassword,
  onImpersonate,
  onSoftDelete
}) => {
  if (!isOpen || !organization) return null;

  const isExpired = organization.status === 'expired';
  const isSuspended = organization.status === 'suspended';
  const isTrial = organization.status === 'trial';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl my-8 overflow-hidden">
        
        {/* Header Profile Banner */}
        <div 
          className="p-6 text-white relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ backgroundColor: organization.primaryColor || '#7c3aed' }}
        >
          <div className="flex items-center gap-4 relative z-10">
            <img 
              src={organization.logoUrl || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=120&auto=format&fit=crop&q=80'} 
              alt={organization.orgName} 
              className="w-16 h-16 rounded-2xl object-cover bg-white p-1 border-2 border-white/40 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-black/30 border border-white/20 text-[10px] font-mono font-bold tracking-wider uppercase">
                  {organization.orgCode || organization.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  organization.status === 'active' ? 'bg-emerald-500 text-white' :
                  organization.status === 'trial' ? 'bg-amber-400 text-slate-950' :
                  'bg-rose-500 text-white'
                }`}>
                  {organization.status}
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">{organization.orgName}</h2>
              <p className="text-xs text-white/80">{organization.orgCategory} • {organization.ownerName || 'প্রোপাইটর'}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-all relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                মোট মেম্বার
              </span>
              <p className="text-lg font-black text-slate-900 dark:text-white">{organization.memberCount} জন</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                কর্মচারী সংখ্যা
              </span>
              <p className="text-lg font-black text-slate-900 dark:text-white">{organization.employeeCount} জন</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                মাসিক রেভিনিউ
              </span>
              <p className="text-lg font-black text-emerald-600">৳ {(organization.monthlyRevenueEstimate || 0).toLocaleString()}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                মেয়াদ শেষ
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{organization.subscriptionEnd}</p>
            </div>

          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Full Details */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-600" />
                পূর্ণাঙ্গ প্রতিষ্ঠান তথ্য (Full Profile Details)
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-slate-500 font-medium">অর্গানাইজেশন কোড:</span>
                  <span className="font-mono font-bold text-purple-600">{organization.orgCode || organization.id}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-slate-500 font-medium">মালিকের নাম:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{organization.ownerName || 'প্রোপাইটর'}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-slate-500 font-medium">মোবাইল নম্বর:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{organization.phone}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-slate-500 font-medium">ইমেইল এড্রেস:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{organization.email}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-slate-500 font-medium">ঠিকানা:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 max-w-[200px] text-right">{organization.address}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-slate-500 font-medium">টাইমজোন:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{organization.timeZone || 'Asia/Dhaka'}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">তৈরির তারিখ:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{organization.createdAt || organization.subscriptionStart}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Package Details */}
            <div className="space-y-3 bg-purple-50/50 dark:bg-purple-950/20 p-4 rounded-2xl border border-purple-200 dark:border-purple-800/40">
              <h3 className="text-xs font-black text-purple-900 dark:text-purple-300 uppercase tracking-wider border-b border-purple-200 dark:border-purple-800 pb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-600" />
                বর্তমান সাবস্ক্রিপশন প্যাকেজ (Current Package)
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-purple-100 dark:border-purple-900/50">
                  <span className="text-slate-500 font-medium">প্যাকেজের নাম:</span>
                  <span className="font-black text-purple-700 dark:text-purple-300 uppercase">{packageDetail?.nameBangla || organization.packageId}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-purple-100 dark:border-purple-900/50">
                  <span className="text-slate-500 font-medium">মাসিক মূল্য:</span>
                  <span className="font-bold text-emerald-600">৳ {packageDetail?.priceMonthly || 1200}/মাস</span>
                </div>

                <div className="flex justify-between py-1 border-b border-purple-100 dark:border-purple-900/50">
                  <span className="text-slate-500 font-medium">সর্বোচ্চ মেম্বার সীমা:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{packageDetail?.maxMembers || 500} জন</span>
                </div>

                <div className="flex justify-between py-1 border-b border-purple-100 dark:border-purple-900/50">
                  <span className="text-slate-500 font-medium">সর্বোচ্চ স্টাফ সীমা:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{packageDetail?.maxEmployees || 5} জন</span>
                </div>

                <div className="pt-2">
                  <span className="block text-slate-500 font-medium mb-1">প্যাকেজ ফিচারসমূহ:</span>
                  <div className="flex flex-wrap gap-1">
                    {(packageDetail?.features || ['মেম্বার ম্যানেজমেন্ট', 'দৈনিক কালেকশন', 'এসএমএস অ্যালার্ট']).map((feat, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 text-[10px] font-bold">
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Action Toolbar Inside Profile */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              সুপার এডমিন একশনস (Super Admin Operations)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              
              <button
                onClick={() => {
                  onClose();
                  onEdit(organization);
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                <span>সম্পাদনা</span>
              </button>

              <button
                onClick={() => {
                  onToggleStatus(organization.id, organization.status);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isSuspended 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                    : 'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
              >
                {isSuspended ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{isSuspended ? 'সক্রিয় করুন' : 'স্থগিত করুন'}</span>
              </button>

              <button
                onClick={() => {
                  onResetPassword(organization);
                }}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30"
              >
                <Key className="w-3.5 h-3.5" />
                <span>পাসওয়ার্ড রিসেট</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onImpersonate(organization);
                }}
                className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>লগইন করুন (Impersonate)</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onSoftDelete(organization);
                }}
                className="px-3 py-2 bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-rose-500/40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>সফ্ট ডিলিট</span>
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
