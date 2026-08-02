import React, { useState, useEffect } from 'react';
import { 
  X, Building2, Upload, RefreshCw, Sparkles, CheckCircle2, AlertCircle, 
  MapPin, Phone, Mail, Calendar, DollarSign, Clock, ShieldCheck, Palette, User
} from 'lucide-react';
import { OrganizationTenant, OrgCategory, OrgStatus, PackageTier } from '../../types/saas';
import { OrganizationService } from '../../services/organizationService';

interface CreateEditOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgToEdit?: OrganizationTenant | null;
  packages: PackageTier[];
  onSaveSuccess: (savedOrg: OrganizationTenant) => void;
}

const CATEGORIES: OrgCategory[] = [
  'Auto Garage', 'Auto Stand', 'Rickshaw Garage', 'CNG Garage', 
  'Truck Garage', 'Bus Counter', 'Samity', 'Society', 
  'Association', 'Market Committee', 'Mosque Committee', 
  'Hostel', 'School', 'Club', 'Member Based Organization'
];

export const CreateEditOrgModal: React.FC<CreateEditOrgModalProps> = ({
  isOpen,
  onClose,
  orgToEdit,
  packages,
  onSaveSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [orgCode, setOrgCode] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgCategory, setOrgCategory] = useState<OrgCategory>('Auto Garage');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [packageId, setPackageId] = useState('professional');
  const [status, setStatus] = useState<OrgStatus>('active');
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(14);
  const [timeZone, setTimeZone] = useState('Asia/Dhaka');
  const [primaryColor, setPrimaryColor] = useState('#7c3aed');
  
  // Logo Upload State
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (orgToEdit) {
      setOrgCode(orgToEdit.orgCode || OrganizationService.generateOrgCode());
      setOrgName(orgToEdit.orgName || '');
      setOrgCategory(orgToEdit.orgCategory || 'Auto Garage');
      setOwnerName(orgToEdit.ownerName || '');
      setPhone(orgToEdit.phone || '');
      setEmail(orgToEdit.email || '');
      setAddress(orgToEdit.address || '');
      setPackageId(orgToEdit.packageId || 'professional');
      setStatus(orgToEdit.status || 'active');
      setTrialDaysRemaining(orgToEdit.trialDaysRemaining || 14);
      setTimeZone(orgToEdit.timeZone || 'Asia/Dhaka');
      setPrimaryColor(orgToEdit.primaryColor || '#7c3aed');
      setLogoUrl(orgToEdit.logoUrl || '');
      setLogoPreview(orgToEdit.logoUrl || null);
    } else {
      setOrgCode(OrganizationService.generateOrgCode());
      setOrgName('');
      setOrgCategory('Auto Garage');
      setOwnerName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setPackageId('professional');
      setStatus('active');
      setTrialDaysRemaining(14);
      setTimeZone('Asia/Dhaka');
      setPrimaryColor('#7c3aed');
      setLogoUrl('https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=120&auto=format&fit=crop&q=80');
      setLogoPreview(null);
    }
    setLogoFile(null);
    setError(null);
  }, [orgToEdit, isOpen]);

  if (!isOpen) return null;

  const handleRegenerateCode = () => {
    setOrgCode(OrganizationService.generateOrgCode());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) {
      setError('অর্গানাইজেশনের নাম আবশ্যক');
      return;
    }
    if (!phone.trim()) {
      setError('মোবাইল নম্বর আবশ্যক');
      return;
    }

    setLoading(true);
    setError(null);

    const subscriptionStart = new Date().toISOString().split('T')[0];
    const subscriptionEnd = new Date(Date.now() + (status === 'trial' ? trialDaysRemaining : 365) * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    try {
      if (orgToEdit) {
        await OrganizationService.update(orgToEdit.id, {
          orgCode,
          orgName,
          orgCategory,
          ownerName,
          phone,
          email,
          address,
          packageId,
          status,
          trialDaysRemaining: status === 'trial' ? trialDaysRemaining : undefined,
          timeZone,
          primaryColor,
          logoUrl: logoPreview || logoUrl,
          subscriptionEnd
        }, logoFile || undefined);

        const updated: OrganizationTenant = {
          ...orgToEdit,
          orgCode,
          orgName,
          orgCategory,
          ownerName,
          phone,
          email,
          address,
          packageId,
          status,
          trialDaysRemaining: status === 'trial' ? trialDaysRemaining : undefined,
          timeZone,
          primaryColor,
          logoUrl: logoPreview || logoUrl,
          subscriptionEnd
        };
        onSaveSuccess(updated);
      } else {
        const created = await OrganizationService.create({
          orgCode,
          orgName,
          orgCategory,
          ownerName: ownerName || 'প্রোপাইটর',
          phone,
          email: email || `${orgCode.toLowerCase()}@tenant-bd.com`,
          address: address || 'ঢাকা, বাংলাদেশ',
          logoUrl: logoUrl || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=120&auto=format&fit=crop&q=80',
          primaryColor,
          status,
          packageId,
          subscriptionStart,
          subscriptionEnd,
          trialDaysRemaining: status === 'trial' ? trialDaysRemaining : undefined,
          timeZone,
          memberCount: 0,
          employeeCount: 1,
          monthlyRevenueEstimate: packageId === 'starter' ? 500 : packageId === 'professional' ? 1200 : 2500
        }, logoFile || undefined);

        onSaveSuccess(created);
      }
      onClose();
    } catch (err: any) {
      console.error('Error saving organization:', err);
      setError(err.message || 'অর্গানাইজেশন সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl my-8 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/20 rounded-2xl border border-purple-500/30 text-purple-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                {orgToEdit ? 'অর্গানাইজেশন তথ্য সম্পাদনা (Edit Org)' : 'নতুন অর্গানাইজেশন তৈরি (Create Organization)'}
              </h3>
              <p className="text-xs text-slate-400">
                গ্যারেজ বা সমিতির পূর্ণাঙ্গ সাবস্ক্রিপশন ফাইল ও ক্রডেনশিয়াল সেটআপ করুন।
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Building2 className="w-4 h-4 text-purple-600" />
              ১. মৌলিক তথ্য ও পরিচয়পত্র (Basic Identifiers)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  অর্গানাইজেশন নাম (Organization Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: বিসমিল্লাহ অটো চার্জিং গ্যারেজ"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>অর্গানাইজেশন কোড (Auto Code)</span>
                  <button
                    type="button"
                    onClick={handleRegenerateCode}
                    className="text-[10px] text-purple-600 hover:underline flex items-center gap-1 font-bold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    পুনরায় জেনারেট
                  </button>
                </label>
                <input
                  type="text"
                  value={orgCode}
                  onChange={(e) => setOrgCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-purple-600 dark:text-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  অর্গানাইজেশন ধরণ (Category / Type) *
                </label>
                <select
                  value={orgCategory}
                  onChange={(e) => setOrgCategory(e.target.value as OrgCategory)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মালিকের নাম (Owner / Proprietor)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: মো: আব্দুল করিম"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                />
              </div>

            </div>
          </div>

          {/* Section 2: Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              ২. যোগাযোগের তথ্য (Contact Details)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মোবাইল নম্বর (Phone Number) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="যেমন: 01711002233"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ইমেইল এড্রেস (Email Address)
                </label>
                <input
                  type="email"
                  placeholder="যেমন: info@tenant-bd.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ঠিকানা ও লোকেশন (Full Address)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: স্টেশন রোড, টার্মিনাল মোড়, ঢাকা"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                />
              </div>

            </div>
          </div>

          {/* Section 3: Package & Licensing */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              ৩. সাবস্ক্রিপশন প্যাকেজ ও লাইসেন্স (Package & License)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্যাকেজ প্ল্যান (Package Tier)
                </label>
                <select
                  value={packageId}
                  onChange={(e) => setPackageId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.nameBangla} - ৳{pkg.priceMonthly}/মাস
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  লাইসেন্স স্ট্যাটাস (Status)
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrgStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                >
                  <option value="active">একটিভ (Active)</option>
                  <option value="trial">ফ্রি ট্রায়াল (Trial)</option>
                  <option value="suspended">সাসপেন্ডেড (Suspended)</option>
                  <option value="expired">মেয়াদোত্তীর্ণ (Expired)</option>
                </select>
              </div>

              {status === 'trial' && (
                <div>
                  <label className="block text-xs font-bold text-amber-600 mb-1">
                    ট্রায়াল মেয়াদ (দিন)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={trialDaysRemaining}
                    onChange={(e) => setTrialDaysRemaining(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-xl text-xs font-bold focus:outline-none text-amber-900 dark:text-amber-200"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  টাইমজোন (Time Zone)
                </label>
                <input
                  type="text"
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none text-slate-900 dark:text-white"
                />
              </div>

            </div>
          </div>

          {/* Section 4: Branding & Logo Upload */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Palette className="w-4 h-4 text-sky-600" />
              ৪. লোগো ও ব্র্যান্ড কালার (Branding & Logo Upload)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  লোগো আপলোড (Cloud Storage Logo Upload)
                </label>
                <div className="flex items-center gap-3">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Logo Preview" 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                  )}

                  <label className="flex-1 cursor-pointer">
                    <span className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-all">
                      <Upload className="w-3.5 h-3.5 text-purple-600" />
                      <span>ছবি নির্বাচন করুন</span>
                    </span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রাইমারি থিম কালার (Primary Color)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5 bg-slate-50 dark:bg-slate-800"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-28 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Buttons Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              বাতিল
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{orgToEdit ? 'আপডেট সংরক্ষণ করুন' : 'নতুন অর্গানাইজেশন তৈরি করুন'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
