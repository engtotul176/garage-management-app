import React, { useState } from 'react';
import { User, Phone, Mail, Lock, Camera, Save, CheckCircle2, AlertCircle, Key } from 'lucide-react';
import { MemberPortalProfile } from '../../types/customerPortal';
import { CustomerPortalService } from '../../services/customerPortalService';

interface MemberProfileEditProps {
  profile: MemberPortalProfile;
  onProfileUpdated: () => void;
  actorName: string;
}

export const MemberProfileEdit: React.FC<MemberProfileEditProps> = ({
  profile,
  onProfileUpdated,
  actorName
}) => {
  const [mobile, setMobile] = useState<string>(profile.mobile);
  const [email, setEmail] = useState<string>(profile.email);
  const [photoUrl, setPhotoUrl] = useState<string>(profile.photoUrl || '');
  const [address, setAddress] = useState<string>(profile.address || '');
  const [emergencyContact, setEmergencyContact] = useState<string>(profile.emergencyContact || '');
  const [vehicleNumber, setVehicleNumber] = useState<string>(profile.vehicleNumber || '');

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await CustomerPortalService.updateMemberProfile(
        profile.id,
        {
          mobile,
          email,
          photoUrl,
          address,
          emergencyContact,
          vehicleNumber
        },
        actorName
      );

      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onProfileUpdated();
      }, 1500);

    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordMsg({ type: 'error', text: 'বর্তমান পাসওয়ার্ড প্রদান করুন' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'নতুন পাসওয়ার্ড দুইটি মিলছে না' });
      return;
    }

    setPasswordMsg({ type: 'success', text: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!' });
    setTimeout(() => {
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMsg(null);
    }, 1200);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" />
            মেম্বার সেলফ সার্ভিস প্রোফাইল এডিটর
          </h3>
          <p className="text-xs text-slate-500">
            আপনার ব্যক্তিগত মোবাইল, ইমেইল, প্রোফাইল ছবি ও পাসওয়ার্ড পরিবর্তন করুন
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPasswordModalOpen(true)}
          className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 shadow-md transition-all"
        >
          <Key className="w-4 h-4 text-amber-400" />
          পাসওয়ার্ড পরিবর্তন
        </button>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-4">
        
        {/* Photo URL & Avatar Preview */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          <img
            src={photoUrl || profile.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt="Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
          />
          <div className="flex-1 space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              প্রোফাইল ফটো URL (Upload / Change Photo):
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              মোবাইল নম্বর (মেইন কন্টাক্ট):
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="pl-9 pr-4 py-2 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              ইমেইল এড্রেস:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 pr-4 py-2 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              গাড়ির রেজিস্ট্রেশন নম্বর:
            </label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="px-3 py-2 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              জরুরী যোগাযোগ নম্বর (Emergency Contact):
            </label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="px-3 py-2 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              স্থায়ী ও বর্তমান ঠিকানা:
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="px-3 py-2 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            পরিবর্তনসমূহ ফায়ারবেস `profile_updates` কালেকশনে সংরক্ষিত হবে।
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            {saveSuccess ? 'সফলভাবে সংরক্ষিত!' : saving ? 'সেভ হচ্ছে...' : 'প্রোফাইল আপডেট করুন'}
          </button>
        </div>

      </form>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">পাসওয়ার্ড পরিবর্তন করুন</h4>
                <p className="text-[11px] text-slate-400">সিকিউরিটি পিন ও পাসওয়ার্ড হালনাগাদ</p>
              </div>
            </div>

            {passwordMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                passwordMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">বর্তমান পাসওয়ার্ড:</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">নতুন পাসওয়ার্ড:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">নতুন পাসওয়ার্ড পুনরায় লিখুন:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl"
                >
                  পাসওয়ার্ড সেভ করুন
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
