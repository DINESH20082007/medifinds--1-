import React, { useState, useRef, useEffect } from 'react';
import {
  Pill,
  Search,
  Camera,
  Bell,
  User,
  Wallet,
  ShoppingCart,
  Globe,
  LogOut,
  Building2,
  ChevronDown,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Store,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PortalType, CustomerProfile, NotificationItem, Medicine, Pharmacy } from '../types';

interface HeaderProps {
  portal: PortalType;
  onSwitchPortal?: (portal: PortalType) => void;
  setPortal?: (portal: PortalType) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  profile?: CustomerProfile;
  cartCount?: number;
  notifications?: NotificationItem[];
  onOpenProfile?: () => void;
  onOpenNotifications?: () => void;
  onOpenSmartSearch?: (query: string) => void;
  onOpenSearch?: (query: string) => void;
  onSearch?: (query: string) => void;
  onOpenCart?: () => void;
  onOpenAIChat?: () => void;
  onOpenPrescriptionScanner?: () => void;
  currentLang?: string;
  onChangeLang?: (lang: string) => void;
  onLogout?: () => void;
  
  // Collapsible Sidebar & Autocomplete props
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onOpenMobileSidebar?: () => void;
  medicines?: Medicine[];
  pharmacies?: Pharmacy[];
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
];

export const Header: React.FC<HeaderProps> = ({
  portal,
  onSwitchPortal,
  setPortal,
  activeTab = 'home',
  setActiveTab,
  profile,
  cartCount = 0,
  notifications = [],
  onOpenProfile,
  onOpenNotifications,
  onOpenSmartSearch,
  onSearch,
  onOpenCart,
  onOpenAIChat,
  onOpenPrescriptionScanner,
  currentLang = 'en',
  onChangeLang,
  onLogout,
  isSidebarCollapsed = false,
  onToggleSidebar,
  onOpenMobileSidebar,
  medicines = [],
  pharmacies = [],
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const unreadCount = (notifications || []).filter((n) => !n.isRead).length;

  // Autocomplete matching items
  const matchingMedicines = searchInput.trim().length > 0
    ? medicines.filter(
        (m) =>
          m.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          m.category.toLowerCase().includes(searchInput.toLowerCase()) ||
          m.composition.toLowerCase().includes(searchInput.toLowerCase())
      ).slice(0, 5)
    : [];

  const matchingPharmacies = searchInput.trim().length > 0
    ? pharmacies.filter(
        (p) =>
          p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          p.area.toLowerCase().includes(searchInput.toLowerCase())
      ).slice(0, 3)
    : [];

  // Close autocomplete on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setIsAutocompleteOpen(false);
      if (onSearch) onSearch(searchInput.trim());
      else if (onOpenSmartSearch) onOpenSmartSearch(searchInput.trim());
    }
  };

  const handleSelectAutocomplete = (query: string) => {
    setSearchInput(query);
    setIsAutocompleteOpen(false);
    if (onSearch) onSearch(query);
    else if (onOpenSmartSearch) onOpenSmartSearch(query);
  };

  const handleSwitchPortal = () => {
    const next = portal === 'customer' ? 'pharmacy' : 'customer';
    if (onSwitchPortal) onSwitchPortal(next);
    else if (setPortal) setPortal(next);
    if (setActiveTab) setActiveTab(next === 'customer' ? 'home' : 'overview');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Top Left: Mobile Drawer Trigger + Desktop Sidebar Collapse Toggle + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Collapsible Toggle */}
            <button
              onClick={onToggleSidebar}
              className="hidden lg:flex p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-emerald-600 transition-colors"
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-emerald-600" />
              ) : (
                <PanelLeftClose className="w-5 h-5 text-slate-500" />
              )}
            </button>

            {/* Logo */}
            <button
              onClick={() => setActiveTab?.('home')}
              className="flex items-center gap-2 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-slate-900 font-['Playfair_Display'] block leading-none">
                  Medifinds
                </span>
                <span className="block text-[9px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">
                  {portal === 'customer' ? 'Coimbatore Pharmacy Network' : 'Pharmacy Admin'}
                </span>
              </div>
            </button>
          </div>

          {/* Top Center: Dynamic Autocomplete Search Bar */}
          {portal === 'customer' ? (
            <div ref={searchContainerRef} className="flex-1 max-w-lg relative hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setIsAutocompleteOpen(true);
                  }}
                  onFocus={() => setIsAutocompleteOpen(true)}
                  placeholder="Search medicines (e.g., Dolo 650, Augmentin, Glycomet)..."
                  className="w-full pl-10 pr-12 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={onOpenPrescriptionScanner}
                  className="absolute right-2 p-1.5 rounded-full text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                  title="Upload Prescription Photo / Smart Scan"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </form>

              {/* Dynamic Autocomplete Dropdown */}
              {isAutocompleteOpen && (matchingMedicines.length > 0 || matchingPharmacies.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl py-2 z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in duration-150">
                  {/* Medicines Suggestions */}
                  {matchingMedicines.length > 0 && (
                    <div className="py-1">
                      <div className="px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Medicines & Tablets
                      </div>
                      {matchingMedicines.map((med) => (
                        <button
                          key={med.id}
                          type="button"
                          onClick={() => handleSelectAutocomplete(med.name)}
                          className="w-full px-3.5 py-2 text-left hover:bg-emerald-50/80 flex items-center justify-between text-xs transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                              <Pill className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 group-hover:text-emerald-700 block">
                                {med.name}
                              </span>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {med.category} • {med.composition}
                              </span>
                            </div>
                          </div>
                          <span className="font-extrabold text-emerald-700 text-xs">
                            ₹ {med.unitPrice}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Partner Shops Suggestions */}
                  {matchingPharmacies.length > 0 && (
                    <div className="py-1">
                      <div className="px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Nearby Medifinds Partner Stores
                      </div>
                      {matchingPharmacies.map((pharm) => (
                        <button
                          key={pharm.id}
                          type="button"
                          onClick={() => {
                            if (setActiveTab) setActiveTab('map');
                            setIsAutocompleteOpen(false);
                          }}
                          className="w-full px-3.5 py-2 text-left hover:bg-emerald-50/80 flex items-center justify-between text-xs transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                              <Store className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 group-hover:text-teal-700 block">
                                {pharm.name}
                              </span>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {pharm.area}, Coimbatore • Rating {pharm.rating} ★
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {pharm.isOpen ? 'Open Now' : 'Closed'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="p-2 bg-slate-50 text-center">
                    <button
                      onClick={() => handleSelectAutocomplete(searchInput)}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1 w-full"
                    >
                      <span>Search all results for &quot;{searchInput}&quot;</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Medifinds Central Pharmacy Dashboard
            </div>
          )}

          {/* Top Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {portal === 'customer' && (
              <>
                {/* Cart Button with badge */}
                <button
                  onClick={onOpenCart}
                  className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-emerald-600 transition-colors"
                  title="View Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Notifications Bell */}
                <button
                  onClick={onOpenNotifications}
                  className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-emerald-600 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Profile Avatar */}
            {profile && (
              <button
                onClick={() => onOpenProfile?.()}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-700"
                title="Profile"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold text-xs">
                  {profile.name ? profile.name.charAt(0) : 'U'}
                </div>
                <div className="text-left hidden xl:block">
                  <span className="block text-xs font-bold text-slate-800 leading-none">
                    {profile.name}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    {profile.isAadhaarVerified ? '✓ Verified' : 'Unverified'}
                  </span>
                </div>
              </button>
            )}

            {/* Switch Portal Button */}
            <button
              onClick={handleSwitchPortal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{portal === 'customer' ? 'Pharmacy' : 'Customer'}</span>
            </button>

            {/* Language Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-bold"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="uppercase">{currentLang}</span>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-2xl shadow-xl py-1 z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        if (onChangeLang) onChangeLang(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 ${
                        currentLang === l.code ? 'font-bold text-emerald-600' : 'text-slate-700'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Logout */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

          </div>
        </div>

        {/* Mobile Search Input */}
        {portal === 'customer' && (
          <div className="mt-2 block md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search medicines in Coimbatore..."
                className="w-full pl-9 pr-10 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:bg-white focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={onOpenPrescriptionScanner}
                className="absolute right-2 text-slate-500 p-1"
              >
                <Camera className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </div>
    </header>
  );
};
