import React from 'react';
import {
  Home,
  MapPin,
  Wallet,
  ShoppingBag,
  History,
  FileText,
  ShoppingCart,
  Settings,
  Building2,
  X,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Store,
  Pill,
  Clock,
  Download,
} from 'lucide-react';
import { CustomerProfile, PortalType } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  portal: PortalType;
  onSwitchPortal: (portal: PortalType) => void;
  profile: CustomerProfile;
  cartCount: number;
  activeOrdersCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenProfile?: () => void;
  onOpenAIChat?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  portal,
  onSwitchPortal,
  profile,
  cartCount = 0,
  activeOrdersCount = 0,
  isCollapsed = false,
  onToggleCollapse = () => {},
  isOpenMobile = false,
  onCloseMobile = () => {},
  onOpenProfile = () => {},
  onOpenAIChat = () => {},
}) => {
  // Role-based distinct menu configurations
  const customerMenuItems = [
    { id: 'home', label: 'Home', icon: Home, badge: null },
    { id: 'map', label: 'Nearby Shops & Map', icon: MapPin, badge: 'Coimbatore' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, badge: `₹${profile.walletBalance}` },
    { id: 'orders', label: 'Active Orders', icon: ShoppingBag, badge: activeOrdersCount > 0 ? activeOrdersCount : null },
    { id: 'history', label: 'Order History', icon: History, badge: null },
    { id: 'vault', label: 'Prescription Vault', icon: ShieldCheck, badge: null },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, badge: cartCount > 0 ? cartCount : null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const adminMenuItems = [
    { id: 'overview', label: 'Store Overview', icon: Store, badge: null },
    { id: 'orders', label: 'Live Customer Orders', icon: ShoppingBag, badge: activeOrdersCount > 0 ? activeOrdersCount : null },
    { id: 'inventory', label: 'Medicine Inventory Manager', icon: Pill, badge: null },
    { id: 'expiry', label: 'Expiry Alerts & Tracker', icon: Clock, badge: null },
    { id: 'pos', label: 'POS Terminal & Billing', icon: FileText, badge: null },
    { id: 'ai', label: 'Gemini AI Demand Forecast', icon: Sparkles, badge: 'AI' },
    { id: 'export', label: 'Data Export & Audit', icon: Download, badge: null },
  ];

  // Dynamically select menu based strictly on user role/portal
  const menuItems = portal === 'customer' ? customerMenuItems : adminMenuItems;

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Collapsible Sidebar Drawer / Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } w-64 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Header Branding */}
          <div className={`p-4 border-b border-slate-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-emerald-500/20 shrink-0">
                M
              </div>
              {!isCollapsed && (
                <div>
                  <span className="font-bold text-white text-base tracking-tight font-['Playfair_Display'] block leading-none">
                    Medifinds
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase mt-1 block">
                    {portal === 'customer' ? 'Customer Portal' : 'Pharmacy Admin'}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:block p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Quick Profile Card */}
          <div className={`mx-3 mt-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between ${isCollapsed ? 'p-2 justify-center' : 'p-3.5'}`}>
            <button
              onClick={() => {
                onOpenProfile();
                onCloseMobile();
              }}
              className="flex items-center gap-2.5 text-left group w-full justify-center"
              title={isCollapsed ? profile.name : undefined}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                {portal === 'customer' ? (profile.name ? profile.name.charAt(0) : 'U') : 'A'}
              </div>
              {!isCollapsed && (
                <>
                  <div className="truncate flex-1">
                    <span className="block text-xs font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {portal === 'customer' ? profile.name : 'Medifinds Store Admin'}
                    </span>
                    <span className="block text-[10px] text-slate-400 truncate">
                      {portal === 'customer' ? profile.phone : 'DL: TN-37B-189234'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                </>
              )}
            </button>
          </div>

          {/* AI Assistance Button */}
          <div className="px-3 mt-2">
            <button
              onClick={() => {
                onOpenAIChat();
                onCloseMobile();
              }}
              className={`w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center transition-all group shadow-sm ${
                isCollapsed ? 'justify-center' : 'justify-between'
              }`}
              title="Ask MediBot AI Assistant"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                {!isCollapsed && <span>Ask MediBot AI</span>}
              </span>
              {!isCollapsed && (
                <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-black uppercase">
                  24/7
                </span>
              )}
            </button>
          </div>

          {/* Role-Based Navigation Links */}
          <nav className="p-3 space-y-1 mt-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all ${
                    isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : typeof item.badge === 'string' && item.badge.startsWith('₹')
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-emerald-500 text-slate-950'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer & Portal Switcher */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {/* Explicit UI Removal: Show Aadhaar Verified badge ONLY in Customer Portal */}
          {!isCollapsed && portal === 'customer' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/40 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Aadhaar Verified Account</span>
            </div>
          )}

          <button
            onClick={() => {
              const next = portal === 'customer' ? 'pharmacy' : 'customer';
              onSwitchPortal(next);
              onCloseMobile();
            }}
            title={isCollapsed ? `Switch to ${portal === 'customer' ? 'Pharmacy' : 'Customer'}` : undefined}
            className={`w-full flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700 ${
              isCollapsed ? 'justify-center p-2.5' : 'justify-center px-3 py-2.5'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
            {!isCollapsed && <span>Switch to {portal === 'customer' ? 'Pharmacy Portal' : 'Customer Portal'}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
