import React, { useState } from 'react';
import {
  Pill,
  AlertTriangle,
  Clock,
  TrendingUp,
  PackageCheck,
  FileText,
  Sparkles,
  Download,
  Building2,
  Lock,
  LogOut,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  CheckCircle2,
  Truck,
  UserCheck
} from 'lucide-react';
import { Pharmacy, PharmacyStockItem, PharmacyInvoice, Order } from '../../types';
import { InventoryManager } from './InventoryManager';
import { ExpiryTracker } from './ExpiryTracker';
import { POSBilling } from './POSBilling';
import { AIDemandPrediction } from './AIDemandPrediction';
import { DataExportView } from './DataExportView';

interface PharmacyDashboardProps {
  pharmacies: Pharmacy[];
  stockItems: PharmacyStockItem[];
  invoices: PharmacyInvoice[];
  orders?: Order[];
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onUpdateStock: (stockId: string, newQty: number) => void;
  onAddStockItem: (item: PharmacyStockItem) => void;
  onDeleteStockItem: (stockId: string) => void;
  onAddInvoice: (inv: PharmacyInvoice) => void;
  onUpdateOrderStatus?: (orderId: string, status: string, step: number) => void;
}

export const PharmacyDashboard: React.FC<PharmacyDashboardProps> = ({
  pharmacies = [],
  stockItems = [],
  invoices = [],
  orders = [],
  activeTab: externalTab,
  onSelectTab,
  onUpdateStock,
  onAddStockItem,
  onDeleteStockItem,
  onAddInvoice,
  onUpdateOrderStatus = (_orderId: string, _status: string, _step: number) => {},
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [licenceInput, setLicenceInput] = useState('TN-37B-189234');
  const [internalTab, setInternalTab] = useState<'overview' | 'orders' | 'inventory' | 'expiry' | 'pos' | 'ai' | 'export'>('overview');

  const validAdminTabs = ['overview', 'orders', 'inventory', 'expiry', 'pos', 'ai', 'export'];
  const activeTab = (
    externalTab && validAdminTabs.includes(externalTab) ? externalTab : internalTab
  ) as 'overview' | 'orders' | 'inventory' | 'expiry' | 'pos' | 'ai' | 'export';

  const handleTabChange = (tab: 'overview' | 'orders' | 'inventory' | 'expiry' | 'pos' | 'ai' | 'export') => {
    setInternalTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  const activePharmacy = (pharmacies && pharmacies[0]) || {
    name: 'Medifinds Central - RS Puram',
    address: 'DB Road, Opposite Flower Market, RS Puram, Coimbatore',
    licenseNo: 'TN-37B-189234',
  };

  const safeStockItems = stockItems || [];
  const safeInvoices = invoices || [];
  const safeOrders = orders || [];

  // Metrics calculations
  const totalStockCount = safeStockItems.reduce((acc, item) => acc + (item.quantityInStock || 0), 0);
  const lowStockCount = safeStockItems.filter((item) => (item.quantityInStock || 0) <= 15).length;
  
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  const expiryCount = safeStockItems.filter((item) => new Date(item.expiryDate) <= thirtyDaysFromNow).length;

  const todaySalesTotal = safeInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0) + 14850;

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-['Playfair_Display'] text-slate-900">
          Medifind Partner Pharmacy Login
        </h2>
        <p className="text-slate-500 text-xs">
          Enter your Drug Controller License Number to open store dashboard
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsAuthenticated(true);
          }}
          className="space-y-3 text-left"
        >
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Drug License No. (DL No.)</label>
            <input
              type="text"
              value={licenceInput}
              onChange={(e) => setLicenceInput(e.target.value)}
              placeholder="e.g. TN-37B-189234"
              className="w-full p-3 bg-slate-50 border rounded-xl text-xs font-mono font-bold text-slate-800"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-all"
          >
            Authenticate & Open Terminal
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Pharmacy Header Profile Banner */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 font-extrabold text-xl">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold font-['Playfair_Display']">{activePharmacy.name}</h1>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                Verified Medifind Store
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              DL No: <span className="font-mono text-emerald-400">{activePharmacy.licenseNo || 'TN-37B-189234'}</span> • Coimbatore Central Region
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Lock Store Terminal
        </button>
      </div>

      {/* 4 Key Metric Cards (Overview) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Total Medicines in Stock</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalStockCount} Units</div>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Live GPS Customer Visible</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Pill className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Incoming Orders</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{safeOrders.length} Orders</div>
            <span className="text-[11px] text-teal-600 font-bold mt-1 block">Real-time Push Sync</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Low Stock Alerts</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{lowStockCount} Items</div>
            <span className="text-[11px] text-amber-600 font-bold mt-1 block">Quantity &le; 15 units</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Today's Sales Revenue</span>
            <div className="text-2xl font-extrabold text-emerald-800 mt-1">₹ {todaySalesTotal.toFixed(2)}</div>
            <span className="text-[11px] text-slate-500 font-bold mt-1 block">38 Transactions Recorded</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar gap-2 text-xs font-bold">
        {[
          { id: 'overview', label: 'Store Overview' },
          { id: 'orders', label: `Live Customer Orders (${safeOrders.length})` },
          { id: 'inventory', label: 'Medicine Inventory Manager' },
          { id: 'expiry', label: 'Expiry Alerts & Tracker' },
          { id: 'pos', label: 'POS Terminal & Billing' },
          { id: 'ai', label: 'Gemini AI Demand Forecast' },
          { id: 'export', label: 'Data Export & Audit' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as any)}
            className={`py-3 px-4 rounded-t-2xl transition-all border-b-2 shrink-0 ${
              activeTab === tab.id
                ? 'bg-white border-emerald-600 text-emerald-800 shadow-sm font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Display */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <InventoryManager
            stockItems={stockItems}
            onUpdateStock={onUpdateStock}
            onAddStockItem={onAddStockItem}
            onDeleteStockItem={onDeleteStockItem}
          />
        </div>
      )}

      {/* Live Customer Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                Live Incoming Customer Orders (Admin Push Feed)
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Orders placed via customer checkout sync instantly to this store terminal
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
              {safeOrders.length} Active Feeds
            </span>
          </div>

          <div className="space-y-4">
            {safeOrders.length === 0 ? (
              <p className="text-slate-400 text-xs py-8 text-center">No incoming orders currently.</p>
            ) : (
              safeOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-slate-200/80">
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm">{ord.orderNumber}</span>
                      <span className="text-slate-500 text-xs ml-3 font-medium">{ord.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                        Status: {ord.status}
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        ₹ {ord.totalAmount}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="font-bold text-slate-700 mb-1">Ordered Items:</p>
                      <ul className="space-y-1">
                        {ord.items.map((it, idx) => (
                          <li key={idx} className="text-slate-600 flex justify-between">
                            <span>• {it.medicineName} (x{it.quantity})</span>
                            <span className="font-semibold text-slate-800">₹ {it.totalPrice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-800">Delivery Address:</p>
                      <p className="text-slate-600 text-[11px]">{ord.deliveryAddress}</p>
                      <p className="font-bold text-slate-800 mt-2">Payment Mode:</p>
                      <p className="text-emerald-700 font-bold text-[11px]">{ord.paymentMethod} (Paid)</p>
                    </div>
                  </div>

                  {/* Admin Order Action Toolbar */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-500 mr-2">Advance Order Status:</span>
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'Packing Order', 1)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
                    >
                      1. Packing Order
                    </button>
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'Handed to Delivery Agent', 2)}
                      className="px-3 py-1.5 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-900 font-bold text-xs"
                    >
                      2. Dispatched to Agent
                    </button>
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'Out for Delivery', 3)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold text-xs"
                    >
                      3. Out for Delivery
                    </button>
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'Delivered', 4)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                    >
                      4. Mark Delivered
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <InventoryManager
          stockItems={stockItems}
          onUpdateStock={onUpdateStock}
          onAddStockItem={onAddStockItem}
          onDeleteStockItem={onDeleteStockItem}
        />
      )}

      {activeTab === 'expiry' && <ExpiryTracker stockItems={stockItems} />}

      {activeTab === 'pos' && (
        <POSBilling
          stockItems={stockItems}
          invoices={invoices}
          onAddInvoice={onAddInvoice}
        />
      )}

      {activeTab === 'ai' && <AIDemandPrediction stockItems={stockItems} />}

      {activeTab === 'export' && <DataExportView stockItems={stockItems} invoices={invoices} />}

    </div>
  );
};
