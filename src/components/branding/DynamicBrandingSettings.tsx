import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Image as ImageIcon, 
  Globe, 
  Building2, 
  ShieldCheck, 
  RotateCcw, 
  Save, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  Layout, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Upload, 
  Check, 
  Lock,
  Layers,
  Monitor,
  Smartphone,
  Info
} from 'lucide-react';
import { useBranding } from '../../context/BrandingContext';
import { BrandingConfig } from '../../types/saas';
import { MOCK_ORGANIZATIONS } from '../../data/mockSaaSData';
import { BrandingService } from '../../services/brandingService';

export const DynamicBrandingSettings: React.FC = () => {
  const { 
    globalBranding, 
    updateGlobalBranding, 
    resetToDefaults, 
    loading: brandingLoading 
  } = useBranding();

  const [formData, setFormData] = useState<BrandingConfig>(globalBranding);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('global');
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'dashboard' | 'login' | 'footer'>('dashboard');

  // Sync state when globalBranding loads
  useEffect(() => {
    if (selectedOrgId === 'global') {
      setFormData(globalBranding);
    }
  }, [globalBranding, selectedOrgId]);

  // Handle Organization switching in multi-org preview mode
  const handleOrgChange = (orgId: string) => {
    setSelectedOrgId(orgId);
    if (orgId === 'global') {
      setFormData(globalBranding);
    } else {
      const org = MOCK_ORGANIZATIONS.find(o => o.id === orgId);
      if (org) {
        setFormData({
          ...globalBranding,
          orgName: org.orgName,
          companyName: org.orgName,
          primaryColor: org.primaryColor || globalBranding.primaryColor,
          buttonColor: org.primaryColor || globalBranding.buttonColor,
          address: org.address,
          contactNumber: org.phone,
          email: org.email
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Image File Upload Helper
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof BrandingConfig) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName as string);
    try {
      const imageUrl = await BrandingService.uploadBrandingImage(file, fieldName as string);
      setFormData((prev) => ({
        ...prev,
        [fieldName]: imageUrl
      }));
    } catch (err) {
      console.warn('Error uploading image:', err);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (selectedOrgId === 'global') {
        await updateGlobalBranding(formData);
      } else {
        await BrandingService.saveOrgBranding(selectedOrgId, formData);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving branding:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('আপনি কি ব্র্যান্ডিং সেটিংস সিস্টেম ডিফল্টে রিসেট করতে চান?')) {
      await resetToDefaults();
      setSelectedOrgId('global');
      setFormData(globalBranding);
    }
  };

  if (brandingLoading) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium">
        ব্র্যান্ডিং তথ্য লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Super Admin Security Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-5 rounded-2xl text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold tracking-tight">ডায়নামিক ব্র্যান্ডিং ও হোয়াইট লেবেল সিস্টেম</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/30 text-purple-200 text-xs font-semibold">
              Super Admin Control
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            সফ্টওয়্যারের সকল নাম, লোগো, থিম কালার ও হোয়াইট লেবেল সেটিংস ডাটাবেজ থেকে রিয়েলটাইমে লোড হয়। কোডের ভেতর কোনো ব্র্যান্ডিং হার্ডকোড করা নেই।
          </p>
        </div>

        <div className="flex items-center gap-2 z-10 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ডিফল্ট রিসেট</span>
          </button>

          <button
            type="submit"
            form="branding-form"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : saveSuccess ? 'সংসংরক্ষিত হয়েছে!' : 'সেটিংস সেভ করুন'}</span>
          </button>
        </div>
      </div>

      {/* Multi-Organization Branding Selector */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">মাল্টি-অর্গানাইজেশন কাস্টম ব্র্যান্ডিং সিলেক্টর</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              নির্দিষ্ট অর্গানাইজেশন নির্বাচন করে তার আলাদা লোগো, নাম ও প্রাইমারি কালার সেট করুন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedOrgId}
            onChange={(e) => handleOrgChange(e.target.value)}
            className="w-full md:w-72 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="global">🌐 গ্লোবাল সিস্টেম ব্র্যান্ডিং (Master Default)</option>
            <optgroup label="অর্গানাইজেশনসমূহ (Tenants)">
              {MOCK_ORGANIZATIONS.map((org) => (
                <option key={org.id} value={org.id}>
                  🏢 {org.orgName} ({org.orgCategory})
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Main Grid Layout: Left Settings Form, Right Interactive Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form id="branding-form" onSubmit={handleSave} className="space-y-6">

            {/* 1. Basic Identity & Software Information */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Globe className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">১. সফটওয়্যার ও কোম্পানি আইডেন্টিটি</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    সফটওয়্যার নেম (Software Name) *
                  </label>
                  <input
                    type="text"
                    name="softwareName"
                    value={formData.softwareName || ''}
                    onChange={handleChange}
                    required
                    placeholder="যেমন: আবাবিল গ্যারেজ ইআরপি"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    কোম্পানি নেম (Company Name)
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName || ''}
                    onChange={handleChange}
                    placeholder="যেমন: আবাবিল সফটওয়্যার সলিউশনস"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    অর্গানাইজেশন/ব্রাঞ্চ নেম (Org Name)
                  </label>
                  <input
                    type="text"
                    name="orgName"
                    value={formData.orgName || ''}
                    onChange={handleChange}
                    placeholder="যেমন: বিসমিল্লাহ অটো চার্জিং গ্যারেজ"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ব্রাউজার টাইটেল (Browser Title)
                  </label>
                  <input
                    type="text"
                    name="browserTitle"
                    value={formData.browserTitle || ''}
                    onChange={handleChange}
                    placeholder="যেমন: আবাবিল ইআরপি - ড্যাশবোর্ড"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    সফটওয়্যার ভার্সন (Software Version)
                  </label>
                  <input
                    type="text"
                    name="softwareVersion"
                    value={formData.softwareVersion || ''}
                    onChange={handleChange}
                    placeholder="যেমন: v2.5.0-PROD"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    যোগাযোগ নম্বর (Contact Phone)
                  </label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber || ''}
                    onChange={handleChange}
                    placeholder="+880 1711-002233"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ইমেইল (Email Address)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    placeholder="support@ababil.com"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ওয়েবসাইট (Website)
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleChange}
                    placeholder="https://ababil-erp.com"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ঠিকানা (Physical Address)
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    placeholder="লেভেল ৪, আবাবিল টাওয়ার, কারওয়ান বাজার, ঢাকা"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 2. Logos, Icons & Media Uploads */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">২. লোগো ও ইমেজ মিডিয়া কাস্টমাইজেশন</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Main Logo */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">মূল লোগো (Primary Logo)</span>
                    <span className="text-[10px] text-slate-400">PNG / SVG</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={formData.logoUrl}
                      alt="Primary Logo"
                      className="w-12 h-12 rounded-lg object-cover bg-slate-200 dark:bg-slate-900 border p-1 shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        name="logoUrl"
                        value={formData.logoUrl || ''}
                        onChange={handleChange}
                        placeholder="Image URL"
                        className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px]"
                      />
                      <label className="cursor-pointer text-[10px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-bold">
                        <Upload className="w-3 h-3" />
                        <span>আপলোড ইমেজ...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'logoUrl')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Dashboard Logo */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">ড্যাশবোর্ড লোগো</span>
                    <span className="text-[10px] text-slate-400">Header Icon</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={formData.dashboardLogoUrl || formData.logoUrl}
                      alt="Dashboard Logo"
                      className="w-12 h-12 rounded-lg object-cover bg-slate-200 dark:bg-slate-900 border p-1 shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        name="dashboardLogoUrl"
                        value={formData.dashboardLogoUrl || ''}
                        onChange={handleChange}
                        placeholder="Image URL"
                        className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px]"
                      />
                      <label className="cursor-pointer text-[10px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-bold">
                        <Upload className="w-3 h-3" />
                        <span>আপলোড...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'dashboardLogoUrl')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Login Logo */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">লগইন স্ক্রিন লোগো</span>
                    <span className="text-[10px] text-slate-400">Login Card</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={formData.loginLogoUrl || formData.logoUrl}
                      alt="Login Logo"
                      className="w-12 h-12 rounded-lg object-cover bg-slate-200 dark:bg-slate-900 border p-1 shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        name="loginLogoUrl"
                        value={formData.loginLogoUrl || ''}
                        onChange={handleChange}
                        placeholder="Image URL"
                        className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px]"
                      />
                      <label className="cursor-pointer text-[10px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-bold">
                        <Upload className="w-3 h-3" />
                        <span>আপলোড...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'loginLogoUrl')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Favicon Icon */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">ফেভিকন (Favicon Icon)</span>
                    <span className="text-[10px] text-slate-400">32x32 Tab Icon</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={formData.faviconUrl}
                      alt="Favicon"
                      className="w-8 h-8 rounded-md object-cover bg-slate-200 dark:bg-slate-900 border p-1 shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        name="faviconUrl"
                        value={formData.faviconUrl || ''}
                        onChange={handleChange}
                        placeholder="Image URL"
                        className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px]"
                      />
                      <label className="cursor-pointer text-[10px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-bold">
                        <Upload className="w-3 h-3" />
                        <span>আপলোড...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'faviconUrl')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Loader Logo */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">লোডিং/প্রোগ্রেস স্পিনার লোগো</span>
                    <span className="text-[10px] text-slate-400">App Loader</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={formData.loaderLogoUrl || formData.logoUrl}
                      alt="Loader Logo"
                      className="w-10 h-10 rounded-lg object-cover bg-slate-200 dark:bg-slate-900 border p-1 shrink-0 animate-pulse"
                    />
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        name="loaderLogoUrl"
                        value={formData.loaderLogoUrl || ''}
                        onChange={handleChange}
                        placeholder="Image URL"
                        className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px]"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. Theme Colors & Dynamic Palette */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Palette className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">৩. থিম কালার প্যালেট ও ডায়নামিক স্টাইলিং</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                
                {/* Primary Color */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    প্রাইমারি কালার (Primary)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      name="primaryColor"
                      value={formData.primaryColor || '#7c3aed'}
                      onChange={handleChange}
                      className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      name="primaryColor"
                      value={formData.primaryColor || '#7c3aed'}
                      onChange={handleChange}
                      className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase font-bold text-[11px]"
                    />
                  </div>
                </div>

                {/* Secondary Color */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    সেকেন্ডারি কালার (Secondary)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      name="secondaryColor"
                      value={formData.secondaryColor || '#4f46e5'}
                      onChange={handleChange}
                      className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      name="secondaryColor"
                      value={formData.secondaryColor || '#4f46e5'}
                      onChange={handleChange}
                      className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase font-bold text-[11px]"
                    />
                  </div>
                </div>

                {/* Sidebar Color */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    সাইডবার কালার (Sidebar)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      name="sidebarColor"
                      value={formData.sidebarColor || '#0f172a'}
                      onChange={handleChange}
                      className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      name="sidebarColor"
                      value={formData.sidebarColor || '#0f172a'}
                      onChange={handleChange}
                      className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase font-bold text-[11px]"
                    />
                  </div>
                </div>

                {/* Button Color */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    বাটন কালার (Button Primary)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      name="buttonColor"
                      value={formData.buttonColor || '#7c3aed'}
                      onChange={handleChange}
                      className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      name="buttonColor"
                      value={formData.buttonColor || '#7c3aed'}
                      onChange={handleChange}
                      className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase font-bold text-[11px]"
                    />
                  </div>
                </div>

                {/* Login Background Color */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    লগইন ব্যাকগ্রাউন্ড (Login BG)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      name="loginBgColor"
                      value={formData.loginBgColor || '#090d16'}
                      onChange={handleChange}
                      className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      name="loginBgColor"
                      value={formData.loginBgColor || '#090d16'}
                      onChange={handleChange}
                      className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase font-bold text-[11px]"
                    />
                  </div>
                </div>

                {/* General Theme Accent */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    থিম একসেন্ট (Theme Accent)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      name="themeColor"
                      value={formData.themeColor || '#7c3aed'}
                      onChange={handleChange}
                      className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      name="themeColor"
                      value={formData.themeColor || '#7c3aed'}
                      onChange={handleChange}
                      className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase font-bold text-[11px]"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* 4. White Label & Footer Settings */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">৪. হোয়াইট লেবেল ও ফুটার কাস্টমাইজেশন</h3>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300">
                  White Label License Ready
                </span>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* White Label Powered By Toggle */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      "Powered by Ababil Software Solutions" ফুটার প্রদর্শন
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      হোয়াইট লেবেল লাইসেন্সে এটি হাইড করা যাবে। সাধারণ অর্গানাইজেশনে সর্বদা দৃশ্যমান থাকবে।
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      name="showWhiteLabelPoweredBy"
                      checked={formData.showWhiteLabelPoweredBy ?? true}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      ফুটার কপিরাইট টেক্সট (Footer Copyright Text)
                    </label>
                    <input
                      type="text"
                      name="footerText"
                      value={formData.footerText || ''}
                      onChange={handleChange}
                      placeholder="সর্বস্বত্ব সংরক্ষিত © ২০২৬ আবাবিল ইআরপি"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      কাস্টম ব্র্যান্ডিং স্লোগান / সাব-ফুটার
                    </label>
                    <input
                      type="text"
                      name="whiteLabelText"
                      value={formData.whiteLabelText || ''}
                      onChange={handleChange}
                      placeholder="Powered by Ababil Software Solutions"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

              </div>
            </div>

          </form>
        </div>

        {/* Right Panel: Interactive Real-time Software Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs sticky top-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">লাইভ ব্র্যান্ডিং প্রিভিউ (Realtime Preview)</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Feed
              </span>
            </div>

            {/* Preview View Selector */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setPreviewTab('dashboard')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  previewTab === 'dashboard'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                ড্যাশবোর্ড
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('login')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  previewTab === 'login'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                লগইন স্ক্রিন
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('footer')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  previewTab === 'footer'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                ফুটার ও মেটা
              </button>
            </div>

            {/* Preview Frame Mockup */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md">

              {/* Browser Window Bar */}
              <div className="bg-slate-200 dark:bg-slate-800 px-3 py-2 flex items-center justify-between border-b border-slate-300 dark:border-slate-700">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-0.5 rounded-md text-[10px] font-mono text-slate-600 dark:text-slate-300 truncate max-w-[220px]">
                  <img src={formData.faviconUrl} alt="Favicon" className="w-3 h-3 rounded" />
                  <span className="truncate">{formData.browserTitle || formData.softwareName}</span>
                </div>
                <div className="w-10" />
              </div>

              {/* Preview Content Area */}
              {previewTab === 'dashboard' && (
                <div className="min-h-[320px] bg-slate-50 dark:bg-slate-950 flex flex-col">
                  {/* Mock Navbar */}
                  <div 
                    className="p-3 text-white flex items-center justify-between shadow-xs transition-colors"
                    style={{ backgroundColor: formData.primaryColor || '#7c3aed' }}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={formData.dashboardLogoUrl || formData.logoUrl}
                        alt="Logo"
                        className="w-7 h-7 rounded bg-white p-0.5 object-cover"
                      />
                      <div>
                        <p className="font-bold text-xs leading-none">{formData.orgName || formData.softwareName}</p>
                        <p className="text-[9px] opacity-80">{formData.companyName}</p>
                      </div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-white/20 font-mono">
                      {formData.softwareVersion}
                    </span>
                  </div>

                  {/* Mock Dashboard Body */}
                  <div className="p-4 flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        দৈনিক ড্যাশবোর্ড ওভারভিউ
                      </span>
                      <button
                        type="button"
                        className="px-2.5 py-1 text-[10px] font-bold text-white rounded-lg transition-all"
                        style={{ backgroundColor: formData.buttonColor || '#7c3aed' }}
                      >
                        + নতুন এন্ট্রি
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400">আজকের কালেকশন</span>
                        <p className="font-extrabold text-sm text-emerald-600">৳ ৪,৫০০</p>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400">একটিভ সদস্য</span>
                        <p className="font-extrabold text-sm text-purple-600">১২৫ জন</p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        লাইভ ব্র্যান্ডিং কাস্টমাইজেশন টেস্ট:
                      </p>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full border shadow-xs" 
                          style={{ backgroundColor: formData.primaryColor }}
                        />
                        <span className="text-[10px] font-mono text-slate-500">
                          Primary: {formData.primaryColor}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mock Footer */}
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-900 border-t text-[10px] text-center text-slate-500 space-y-0.5">
                    <p>{formData.footerText}</p>
                    {formData.showWhiteLabelPoweredBy && (
                      <p className="font-semibold text-purple-600 dark:text-purple-400">
                        {formData.whiteLabelText}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {previewTab === 'login' && (
                <div 
                  className="min-h-[320px] p-6 flex items-center justify-center transition-colors"
                  style={{ backgroundColor: formData.loginBgColor || '#090d16' }}
                >
                  <div className="bg-white dark:bg-slate-900 w-full max-w-xs p-5 rounded-2xl shadow-xl space-y-4 text-center border border-slate-200 dark:border-slate-800">
                    <img
                      src={formData.loginLogoUrl || formData.logoUrl}
                      alt="Login Logo"
                      className="w-12 h-12 rounded-xl mx-auto object-cover border p-1 shadow-xs"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {formData.softwareName}
                      </h4>
                      <p className="text-[10px] text-slate-400">{formData.orgName}</p>
                    </div>

                    <div className="space-y-2 text-left">
                      <input
                        type="text"
                        disabled
                        placeholder="ইউজার আইডি বা ফোন নম্বর"
                        className="w-full p-2 bg-slate-100 dark:bg-slate-800 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700"
                      />
                      <input
                        type="password"
                        disabled
                        placeholder="পাসওয়ার্ড"
                        className="w-full p-2 bg-slate-100 dark:bg-slate-800 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700"
                      />
                      <button
                        type="button"
                        className="w-full py-2 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                        style={{ backgroundColor: formData.buttonColor || '#7c3aed' }}
                      >
                        লগইন করুন
                      </button>
                    </div>

                    {formData.showWhiteLabelPoweredBy && (
                      <p className="text-[9px] text-slate-400 pt-1">
                        {formData.whiteLabelText}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {previewTab === 'footer' && (
                <div className="min-h-[320px] p-5 bg-slate-900 text-white space-y-4 text-xs">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={formData.logoUrl} alt="Logo" className="w-8 h-8 rounded bg-white p-0.5 object-cover" />
                      <div>
                        <p className="font-bold text-sm">{formData.softwareName}</p>
                        <p className="text-[10px] text-slate-400">{formData.companyName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-300">
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{formData.contactNumber}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{formData.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{formData.website}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{formData.address}</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
                    <p>{formData.footerText}</p>
                    {formData.showWhiteLabelPoweredBy ? (
                      <p className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>White Label: {formData.whiteLabelText}</span>
                      </p>
                    ) : (
                      <p className="text-amber-400 font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>White Label Mode Activated (Powered-by Hidden)</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Quick Summary Specs */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-[11px] text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>সফ্টওয়্যার ভার্সন:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formData.softwareVersion}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>হোয়াইট লেবেল স্ট্যাটাস:</span>
                <span className={`font-bold ${formData.showWhiteLabelPoweredBy ? 'text-slate-700 dark:text-slate-300' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {formData.showWhiteLabelPoweredBy ? 'Standard Branding' : 'White Label Enabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>ডাটাবেজ সিঙ্ক:</span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">Firestore Realtime</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
