import React from 'react';
import { QrCode, ShieldCheck, Printer, Download, Sparkles, Building2, User, Phone, Car } from 'lucide-react';
import { MemberPortalProfile } from '../../types/customerPortal';

interface DigitalMembershipCardProps {
  profile: MemberPortalProfile;
  onDownloadCard?: () => void;
}

export const DigitalMembershipCard: React.FC<DigitalMembershipCardProps> = ({
  profile,
  onDownloadCard
}) => {

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-indigo-500" />
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            ডিজিটাল মেম্বারশিপ কার্ড (QR Code)
          </h3>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handlePrintCard}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            প্রিন্ট কার্ড
          </button>
        </div>
      </div>

      {/* The Digital Smart Card */}
      <div className="max-w-md mx-auto p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-indigo-500/30 relative overflow-hidden group">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Top: Org Info */}
        <div className="flex items-start justify-between border-b border-indigo-500/20 pb-4 relative z-10">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 block">
              OFFICIAL MEMBER CARD
            </span>
            <h4 className="text-base font-black text-white tracking-tight mt-0.5">
              {profile.tenantName}
            </h4>
            <p className="text-[10px] text-slate-300">ABABIL CLOUD SAAS PLATFORM</p>
          </div>
          
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black inline-flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            {profile.membershipStatus}
          </span>
        </div>

        {/* Card Body */}
        <div className="py-4 grid grid-cols-3 gap-4 items-center relative z-10">
          
          {/* Avatar & Member Info */}
          <div className="col-span-2 flex items-center gap-3">
            <img
              src={profile.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={profile.fullName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-400 shadow-md shrink-0"
            />
            <div className="space-y-1 overflow-hidden">
              <div className="text-sm font-black text-white truncate">{profile.fullName}</div>
              <div className="text-[11px] font-mono font-bold text-indigo-300">{profile.memberCode}</div>
              <div className="text-[10px] text-slate-300 flex items-center gap-1">
                <Car className="w-3 h-3 text-indigo-400" />
                {profile.vehicleNumber || 'N/A'}
              </div>
            </div>
          </div>

          {/* Rendered Visual QR Code */}
          <div className="flex flex-col items-center justify-center p-2 bg-white rounded-2xl border border-indigo-200 shadow-inner">
            <svg className="w-16 h-16 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 17h3v3h-3z" />
            </svg>
            <span className="text-[8px] font-mono font-extrabold text-slate-700 mt-1">
              SCAN VERIFY
            </span>
          </div>

        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-indigo-500/20 flex justify-between items-center text-[10px] text-slate-300 relative z-10">
          <div>
            <span className="text-slate-400 block">যোগদানের তারিখ:</span>
            <span className="font-semibold text-white">{profile.joiningDate}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block">মোবাইল নম্বর:</span>
            <span className="font-mono font-bold text-indigo-300">{profile.mobile}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
