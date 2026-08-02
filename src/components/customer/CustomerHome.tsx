import React from 'react';
import {
  Pill,
  MapPin,
  Truck,
  ShieldCheck,
  Bell,
  Wallet,
  ShoppingBag,
  Clock,
  Headset,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Search,
  Lock
} from 'lucide-react';
import { CustomerProfile, Reminder, Order } from '../../types';

interface CustomerHomeProps {
  profile: CustomerProfile;
  reminders: Reminder[];
  orders: Order[];
  onNavigateTab: (tab: string) => void;
  onOpenAIChat: () => void;
  onOpenNotifications: () => void;
  onSearchClick: (query: string) => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  profile,
  reminders,
  orders,
  onNavigateTab,
  onOpenAIChat,
  onOpenNotifications,
  onSearchClick,
}) => {
  const activeRemindersCount = reminders.filter((r) => !r.isTakenToday).length;
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/40">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> GPS Real-time Medicine Availability Platform
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight font-['Playfair_Display']">
              Welcome back, {profile.name}!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Find your medicines easily and take care of your health with Medifinds.
            </p>

            {/* Quick Search trigger inside hero */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="text-slate-400 font-medium py-1">Popular searches:</span>
              {['Paracetamol 650', 'Augmentin 625', 'Glycomet GP', 'Becosules'].map((term) => (
                <button
                  key={term}
                  onClick={() => onSearchClick(term)}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-emerald-500 hover:text-slate-950 text-white transition-all border border-white/10 flex items-center gap-1"
                >
                  <Search className="w-3 h-3" /> {term}
                </button>
              ))}
            </div>
          </div>

          {/* Health Vector Illustration Graphic */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-4">
              <div className="w-36 h-36 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-4 shadow-2xl rotate-3 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <Pill className="w-8 h-8 text-slate-900" />
                  <span className="text-[10px] font-extrabold bg-slate-900 px-2 py-0.5 rounded-full">LIVE STOCK</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900">Medifinds Central</span>
                  <span className="text-[10px] text-slate-800">In Stock: 145 Units</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Stats (3 Small Flex Columns) */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-bold text-sm text-white">1 Lakh+ Medicines</span>
              <span className="text-[11px] text-slate-300">Available across partners</span>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-bold text-sm text-white">10,000+ Pharmacies</span>
              <span className="text-[11px] text-slate-300">Verified GPS network</span>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-bold text-sm text-white">Fast Delivery</span>
              <span className="text-[11px] text-slate-300">Quick & Reliable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Encrypted Digital Prescription Vault */}
          <button
            onClick={() => onNavigateTab('vault')}
            className="group p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">Encrypted Digital Prescription Vault</h3>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full">
                    AES-256
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">
                  Securely upload and manage digitized prescriptions and health records
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Card 2: Smart Search & Nearby Stock */}
          <button
            onClick={() => onSearchClick('Paracetamol')}
            className="group p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Find Nearby Stock</h3>
                <p className="text-slate-500 text-xs">
                  Locate pharmacies holding stock with interactive map directions
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
          </button>

        </div>
      </div>

      {/* Status Cards Grid */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Your Health Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Status 1: Reminder */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-400">Pill Schedule</span>
            </div>
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Reminder</h3>
              <p className="text-xl font-extrabold text-slate-900 mt-1">
                {activeRemindersCount} Reminders Today
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('home')}
              className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center justify-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Status 2: Wallet */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-400">Medifind Pay</span>
            </div>
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Wallet</h3>
              <p className="text-xl font-extrabold text-slate-900 mt-1">
                ₹ {profile.walletBalance.toFixed(2)}
              </p>
              <span className="text-[11px] text-slate-500">Available Balance</span>
            </div>
            <button
              onClick={() => onNavigateTab('wallet')}
              className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center justify-center gap-1"
            >
              Top Up <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Status 3: Orders */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-400">Live Delivery</span>
            </div>
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Orders</h3>
              <p className="text-xl font-extrabold text-slate-900 mt-1">
                {activeOrdersCount} Active Orders
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center justify-center gap-1"
            >
              View Orders <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Status 4: History */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-400">Past Log</span>
            </div>
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 text-sm">History</h3>
              <p className="text-xl font-extrabold text-slate-900 mt-1">
                24 Past Orders
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('history')}
              className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center justify-center gap-1"
            >
              View History <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Banners (Faint Green Background) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Need Help? AI Assistant */}
        <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Headset className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-950 text-sm">Need Help?</h3>
              <p className="text-emerald-800 text-xs leading-snug">
                Our AI Assistant is here to help you 24/7.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAIChat}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors shrink-0"
          >
            Chat Now
          </button>
        </div>

        {/* Card 2: Stay Updated Notifications */}
        <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-950 text-sm">Stay Updated</h3>
              <p className="text-emerald-800 text-xs leading-snug">
                Enable notifications to get updates on your orders, reminders and offers.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenNotifications}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors shrink-0"
          >
            Enable Notifications
          </button>
        </div>

      </div>

    </div>
  );
};
