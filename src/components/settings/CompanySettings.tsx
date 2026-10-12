import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { CompanySettings as CompanySettingsType } from '../../types/company';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  UserCheck,
  Upload,
  Check,
  RotateCcw,
  Database,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { getStoredSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig } from '../../services/supabase';
import { useToast } from '../../context/ToastContext';

export const CompanySettings: React.FC = () => {
  const { companySettings, updateCompanySettings, resetToDefaults, reloadData } = useData();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<CompanySettingsType>(companySettings);
  const [isSaving, setIsSaving] = useState(false);

  // Supabase Config states
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [showDbModal, setShowDbModal] = useState(false);

  useEffect(() => {
    setFormData(companySettings);
  }, [companySettings]);

  useEffect(() => {
    const config = getStoredSupabaseConfig();
    if (config) {
      setSupabaseUrl(config.url);
      setSupabaseKey(config.anonKey);
    }
  }, []);

  const handleChange = (field: keyof CompanySettingsType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Logo image must be smaller than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('logo_url', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateCompanySettings(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      clearSupabaseConfig();
      showToast('Cleared custom Supabase configuration', 'info');
    } else {
      saveSupabaseConfig({ url: supabaseUrl.trim(), anonKey: supabaseKey.trim() });
      showToast('Supabase configuration saved! Reloading data...', 'success');
    }
    setShowDbModal(false);
    await reloadData();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Company & Payslip Settings
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure company legal entity, branding logo, and authorized signatories on all payslips
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDbModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-2xs"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            Database / Supabase
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all demo employees and payrolls to initial default state?')) {
                resetToDefaults();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition"
            title="Restore default demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Company Profile & Logo */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Company Information</h3>
              <p className="text-xs text-slate-500">Legal business name, registration, and logo</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Logo Upload Box */}
            <div className="md:col-span-1 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Company Logo
              </label>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center text-center">
                {formData.logo_url ? (
                  <div className="space-y-3">
                    <img
                      src={formData.logo_url}
                      alt="Company Logo Preview"
                      className="w-24 h-24 object-contain mx-auto rounded-xl bg-white p-2 border border-slate-200 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleChange('logo_url', '')}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                    >
                      Remove Logo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-xs text-slate-500">
                      <label className="font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer">
                        Upload Logo Image
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/svg+xml"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, or SVG up to 2MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Business Fields */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company Legal Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  placeholder="e.g. Apex Zenith Technologies Pvt. Ltd."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    GST Number (GSTIN)
                  </label>
                  <input
                    type="text"
                    value={formData.gst_number || ''}
                    onChange={(e) => handleChange('gst_number', e.target.value.toUpperCase())}
                    placeholder="36AABCU9603R1ZM"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    value={formData.pan_number || ''}
                    onChange={(e) => handleChange('pan_number', e.target.value.toUpperCase())}
                    placeholder="AABCU9603R"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Contact & Address */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Registered Address & Communication</h3>
              <p className="text-xs text-slate-500">Official office address printed on payslip header</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Street Address / Building <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Plot No. 42, Cyber Gateway, Hitec City, Madhapur"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Hyderabad"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  State <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="Telangana"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  PIN Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  placeholder="500081"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 40 4892 7100"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  HR / Payroll Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="hr@apexzenith.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="www.apexzenith.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Authorized Signatory */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Authorized Signatory</h3>
              <p className="text-xs text-slate-500">Official signature block printed on every salary slip</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Authorized Person Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.authorized_person}
                onChange={(e) => handleChange('authorized_person', e.target.value)}
                placeholder="Rajesh Nambiar"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Authorized Person Designation <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.authorized_designation}
                onChange={(e) => handleChange('authorized_designation', e.target.value)}
                placeholder="Head of Human Resources & Finance"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            {isSaving ? 'Saving Changes...' : 'Save Company Settings'}
          </button>
        </div>
      </form>

      {/* Supabase Connection Modal */}
      {showDbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 animate-fade-in">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Supabase Cloud Database</h3>
                <p className="text-xs text-slate-500">Connect to your real Supabase PostgreSQL instance</p>
              </div>
            </div>

            <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Supabase Anon Public API Key
                </label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">Note:</p>
                <p>
                  You can run the full SQL schema found in <code>src/supabase/schema.sql</code> in your Supabase SQL Editor.
                </p>
                <p className="text-emerald-700 font-semibold">
                  Leave fields blank to use Local Sandbox Storage with instant persistence.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDbModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
                >
                  Save & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
