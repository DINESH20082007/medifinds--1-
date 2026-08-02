import React, { useState } from 'react';
import {
  Settings,
  Languages,
  User,
  Bell,
  Moon,
  Sun,
  ShieldCheck,
  Smartphone,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { CustomerProfile } from '../../types';

interface SettingsViewProps {
  profile: CustomerProfile;
  onUpdateProfile: (updated: CustomerProfile) => void;
  onOpenProfileModal: () => void;
}

const languages = [
  { code: 'en', label: 'English (US & India)', native: 'English' },
  { code: 'ta', label: 'Tamil (தமிழ்)', native: 'தமிழ்' },
  { code: 'hi', label: 'Hindi (हिंदी)', native: 'हिंदी' },
  { code: 'te', label: 'Telugu (తెలుగు)', native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada (கன்னட)', native: 'கன்னட' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onOpenProfileModal,
}) => {
  const [selectedLang, setSelectedLang] = useState(profile.preferredLanguage || 'en');
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>(profile.theme || 'light');
  const [notifSms, setNotifSms] = useState(true);
  const [notifExpiry, setNotifExpiry] = useState(true);
  const [notifWallet, setNotifWallet] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = () => {
    const updated: CustomerProfile = {
      ...profile,
      preferredLanguage: selectedLang,
      theme: selectedTheme,
    };
    onUpdateProfile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            App Preferences & Security
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Account & App Settings</h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage your language, themes, notification channels, and Aadhaar-linked profile
          </p>
        </div>

        {isSaved && (
          <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Settings Saved!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Preferences */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Multi-Language Selection</h3>
              <p className="text-slate-500 text-xs">Choose preferred application language</p>
            </div>
          </div>

          <div className="space-y-2">
            {languages.map((lang) => (
              <label
                key={lang.code}
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedLang === lang.code
                    ? 'bg-emerald-50/80 border-emerald-500 font-bold text-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="language"
                    value={lang.code}
                    checked={selectedLang === lang.code}
                    onChange={() => setSelectedLang(lang.code)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs">{lang.label}</span>
                </div>
                <span className="text-slate-400 text-xs">{lang.native}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Profile & Aadhaar Quick Link */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Profile & Verification</h3>
              <p className="text-slate-500 text-xs">Aadhaar eKYC and delivery addresses</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Account Name</span>
              <span className="font-bold text-slate-900">{profile.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Aadhaar Status</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[10px] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Addresses Saved</span>
              <span className="font-bold text-slate-900">{profile.addresses.length} Addresses</span>
            </div>

            <button
              onClick={onOpenProfileModal}
              className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors text-xs"
            >
              Edit Full Profile & Addresses
            </button>
          </div>
        </div>

        {/* Notifications Config */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Notification Rules</h3>
              <p className="text-slate-500 text-xs">Real-time dispatches and alerts</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <span>GPS Delivery & Order SMS Alerts</span>
              <input
                type="checkbox"
                checked={notifSms}
                onChange={(e) => setNotifSms(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <span>Medicine Refill & Expiry Reminders</span>
              <input
                type="checkbox"
                checked={notifExpiry}
                onChange={(e) => setNotifExpiry(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <span>Wallet Transaction Updates</span>
              <input
                type="checkbox"
                checked={notifWallet}
                onChange={(e) => setNotifWallet(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>

        {/* Theme Preference */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Appearance</h3>
              <p className="text-slate-500 text-xs">Color scheme & display theme</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Smartphone },
            ].map((th) => {
              const Icon = th.icon;
              const isSelected = selectedTheme === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => setSelectedTheme(th.id as any)}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs flex flex-col items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{th.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSaveSettings}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-emerald-900/20 flex items-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" />
          Save Preferences
        </button>
      </div>
    </div>
  );
};
