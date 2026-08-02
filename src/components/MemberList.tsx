import React, { useState, useEffect } from 'react';
import { Users, UserPlus, QrCode, Search, Phone, Truck, Trash2, RefreshCw } from 'lucide-react';
import { MemberRecord } from '../types/member';
import { MemberService } from '../services/memberService';

export const MemberList: React.FC = () => {
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const unsub = MemberService.subscribeMembers('org_bismillah_001', (data) => {
      setMembers(data);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = members.filter(
    m => m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
         (m.vehicleNo && m.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase())) || 
         m.phone.includes(searchTerm)
  );

  const handleDeleteSingle = async (id: string, name: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে মেম্বার/গাড়ি "${name}" ডাটাবেজ থেকে স্থায়ীভাবে মুছে ফেলতে চান?`)) {
      await MemberService.hardDeleteMember(id, 'org_bismillah_001', name, 'Admin');
      setMembers(prev => prev.filter(m => m.id !== id));
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`আপনি কি নিশ্চিত যে নির্বাচিত ${selectedIds.length} টি মেম্বার ও গাড়ি রেকর্ড ডিলিট করতে চান?`)) {
      await MemberService.deleteMembersBatch(selectedIds, 'org_bismillah_001', 'Admin');
      setMembers(prev => prev.filter(m => !selectedIds.includes(m.id)));
      setSelectedIds([]);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(m => m.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-600" />
            মেম্বার ও গাড়ি ম্যানেজমেন্ট
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            অটো চালক, গাড়ি মালিক, কিউআর কোড এবং মাসিক নির্ধারিত চার্জিং ফি ট্র্যাকার।
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 animate-pulse"
            >
              <Trash2 className="w-4 h-4" />
              <span>সিলেক্ট করা মেম্বার ডিলিট ({selectedIds.length})</span>
            </button>
          )}

          <button className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0">
            <UserPlus className="w-4 h-4" />
            <span>নতুন মেম্বার / গাড়ি এন্ট্রি</span>
          </button>
        </div>
      </div>

      {/* Search Input & Select All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="নাম, ফোন নম্বর বা গাড়ির নম্বর দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
          />
        </div>

        {filtered.length > 0 && (
          <button
            onClick={handleToggleSelectAll}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 shrink-0"
          >
            {selectedIds.length === filtered.length ? 'সব আন-সিলেক্ট করুন' : 'সবগুলো সিলেক্ট করুন'}
          </button>
        )}
      </div>

      {/* Members Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl text-center text-slate-400 text-xs border border-slate-200 dark:border-slate-800">
          কোনো মেম্বার বা গাড়ি রেকর্ড পাওয়া যায়নি!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((member) => {
            const isChecked = selectedIds.includes(member.id);
            return (
              <div 
                key={member.id} 
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border ${isChecked ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/10' : 'border-slate-200 dark:border-slate-800'} shadow-xs space-y-3 relative transition-all`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleSelectOne(member.id)}
                      className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                      {member.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      এক্টিভ মেম্বার
                    </span>
                    <button
                      onClick={() => handleDeleteSingle(member.id, member.fullName)}
                      className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded transition-colors"
                      title="এই মেম্বার ডিলিট করুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {member.fullName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    {member.vehicleNo} ({member.vehicleType})
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {member.phone}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[11px] text-slate-400">মাসিক নির্ধারিত ফি</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">৳ {member.monthlyFee}</p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">বর্তমান বকেয়া</p>
                    <p className={`font-bold ${member.dueAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      ৳ {member.dueAmount}
                    </p>
                  </div>

                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer" title="QR Code View">
                    <QrCode className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
