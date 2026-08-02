import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CustomerHome } from './components/customer/CustomerHome';
import { OrdersView } from './components/customer/OrdersView';
import { MapViewPage } from './components/customer/MapViewPage';
import { LiveDeliveryTracking } from './components/customer/LiveDeliveryTracking';
import { SettingsView } from './components/customer/SettingsView';
import { NotificationDrawer } from './components/customer/NotificationDrawer';
import { SmartSearchModal } from './components/customer/SmartSearchModal';
import { FamilyMedicineModal } from './components/customer/FamilyMedicineModal';
import { ReminderModal } from './components/customer/ReminderModal';
import { WalletModal } from './components/customer/WalletModal';
import { PrescriptionVaultModal } from './components/customer/PrescriptionVaultModal';
import { CartCheckoutModal } from './components/customer/CartCheckoutModal';
import { FeedbackModal } from './components/customer/FeedbackModal';
import { ProfileModal } from './components/ProfileModal';
import { AIChatbot } from './components/AIChatbot';
import { PharmacyDashboard } from './components/pharmacy/PharmacyDashboard';
import { AuthPage } from './components/AuthPage';

import {
  initialCustomerProfile,
  samplePharmacies as mockPharmacies,
  sampleStockItems as mockStockItems,
  sampleMedicines as mockMedicines,
  sampleOrders as mockOrders,
  sampleReminders as mockReminders,
  sampleFamilyMembers as mockFamilyMembers,
  samplePrescriptions as mockPrescriptions,
  sampleTransactions as mockWalletTransactions,
  sampleInvoices as mockInvoices,
  sampleNotifications as mockNotifications,
} from './data/mockData';

import {
  CustomerProfile,
  Pharmacy,
  PharmacyStockItem,
  Medicine,
  Order,
  Reminder,
  FamilyMember,
  PrescriptionVaultItem,
  WalletTransaction,
  PharmacyInvoice,
  CartItem,
  NotificationItem,
  PortalType,
} from './types';

export default function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Portal & Active View State
  const [portal, setPortal] = useState<PortalType>('customer');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Master domain data states
  const [profile, setProfile] = useState<CustomerProfile>(initialCustomerProfile);
  const [pharmacies] = useState<Pharmacy[]>(mockPharmacies);
  const [stockItems, setStockItems] = useState<PharmacyStockItem[]>(mockStockItems);
  const [medicines] = useState<Medicine[]>(mockMedicines);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(mockFamilyMembers);
  const [prescriptions, setPrescriptions] = useState<PrescriptionVaultItem[]>(mockPrescriptions);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(mockWalletTransactions);
  const [invoices, setInvoices] = useState<PharmacyInvoice[]>(mockInvoices);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Modals & Panels state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isFamilyOpen, setIsFamilyOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Global Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Active tracking order state
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(orders[0] || null);

  // Open modal triggers when sidebar tabs are clicked
  useEffect(() => {
    if (activeTab === 'wallet') {
      setIsWalletOpen(true);
    } else if (activeTab === 'vault') {
      setIsVaultOpen(true);
    } else if (activeTab === 'cart') {
      setIsCartOpen(true);
    } else if (activeTab === 'family') {
      setIsFamilyOpen(true);
    }
  }, [activeTab]);

  // Portal switch handler with tab reset
  const handleSwitchPortal = (newPortal: PortalType) => {
    setPortal(newPortal);
    if (newPortal === 'pharmacy') {
      setActiveTab('overview');
    } else {
      setActiveTab('home');
    }
  };

  // Auth login handler
  const handleLoginSuccess = (chosenPortal: PortalType, userProfile?: Partial<CustomerProfile>) => {
    setIsAuthenticated(true);
    setPortal(chosenPortal);
    if (chosenPortal === 'pharmacy') {
      setActiveTab('overview');
    } else {
      setActiveTab('home');
    }
    if (userProfile) {
      setProfile((prev) => ({
        ...prev,
        ...userProfile,
      }));
    }
    setToastMsg(`Welcome back to Medifinds! Signed in as ${userProfile?.name || 'User'}`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Handlers
  const handleSearchTrigger = (query: string) => {
    setSearchQuery(query);
    setIsSearchOpen(true);
  };

  const handleAddToCart = (medicine: Medicine, pharmacy: Pharmacy, qty: number) => {
    const existingIndex = cartItems.findIndex((c) => c.medicine.id === medicine.id);
    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += qty;
      setCartItems(updated);
    } else {
      setCartItems([...cartItems, { medicine, pharmacy, quantity: qty }]);
    }
    setToastMsg(`Added ${qty}x ${medicine.name} to cart!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleUpdateCartQty = (medId: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.medicine.id === medId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];
    setCartItems(updated);
  };

  const handleRemoveCartItem = (medId: string) => {
    setCartItems(cartItems.filter((i) => i.medicine.id !== medId));
  };

  // Flow: Cart -> Wallet Deduction -> Order Creation -> Admin Pharmacy Sync -> Route to Active Orders / Tracking
  const handlePlaceOrder = (newOrder: Order) => {
    // 1. Add order to customer orders list
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    setCartItems([]);
    setTrackingOrder(newOrder);

    // 2. Wallet balance deduction
    if (newOrder.paymentMethod === 'Wallet' || newOrder.paymentMethod === 'UPI') {
      setProfile((prev) => ({
        ...prev,
        walletBalance: Math.max(0, prev.walletBalance - newOrder.totalAmount),
      }));

      const newTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: `Medicine Order #${newOrder.orderNumber}`,
        amount: newOrder.totalAmount,
        type: 'debit',
        status: 'Completed',
      };
      setWalletTransactions((prev) => [newTx, ...prev]);
    }

    // 3. Admin Sync: Push corresponding invoice to Pharmacy Portal
    const newInvoice: PharmacyInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: profile.name,
      doctorName: 'Dr. Coimbatore General',
      date: new Date().toISOString().split('T')[0],
      items: newOrder.items.map((i) => ({
        medicineName: i.medicineName,
        batchNo: 'B-2026',
        quantity: i.quantity,
        mrp: i.pricePerUnit,
        amount: i.totalPrice,
      })),
      subtotal: newOrder.subtotal,
      taxAmount: Math.round(newOrder.totalAmount * 0.12),
      totalAmount: newOrder.totalAmount,
      paymentMode: newOrder.paymentMethod === 'Wallet' ? 'UPI' : 'Cash',
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    // 4. Real-time Notification Alert
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Order Confirmed & Partner Dispatched',
      message: `Order #${newOrder.orderNumber} from ${newOrder.pharmacyName} is packed. Agent is on the way!`,
      time: 'Just now',
      isRead: false,
      type: 'order',
    };
    setNotifications((prev) => [notif, ...prev]);

    // 5. Navigate to Live Tracking tab
    setActiveTab('tracking');
    setToastMsg(`🎉 Order #${newOrder.orderNumber} Placed Successfully! Dispatched to store.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Real-time Order status update from Pharmacy Admin Portal
  const handleUpdateOrderStatus = (orderId: string, status: string, trackingStep: number) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status, trackingStep } : o));
    setOrders(updated);
    if (trackingOrder && trackingOrder.id === orderId) {
      setTrackingOrder({ ...trackingOrder, status, trackingStep });
    }
    setToastMsg(`Pharmacy Admin updated Order status to "${status}"`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleTopUpWallet = (amount: number) => {
    setProfile((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: 'Wallet Top Up (UPI Auto-Add)',
      amount: amount,
      type: 'credit',
      status: 'Completed',
    };
    setWalletTransactions((prev) => [newTx, ...prev]);
    setToastMsg(`Added ₹${amount} to Medifind Wallet!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleReminderTaken = (id: string) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, isTaken: !r.isTaken } : r))
    );
  };

  const handleAddReminder = (r: Reminder) => {
    setReminders([...reminders, r]);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  // Pharmacy Inventory Handlers
  const handleUpdateStock = (stockId: string, newQty: number) => {
    setStockItems(
      stockItems.map((s) => (s.id === stockId ? { ...s, quantityInStock: newQty } : s))
    );
  };

  const handleAddStockItem = (newItem: PharmacyStockItem) => {
    setStockItems([newItem, ...stockItems]);
  };

  const handleDeleteStockItem = (stockId: string) => {
    setStockItems(stockItems.filter((s) => s.id !== stockId));
  };

  const handleAddInvoice = (inv: PharmacyInvoice) => {
    setInvoices([inv, ...invoices]);
  };

  // If unauthenticated, show clean AuthPage
  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">
      
      {/* Collapsible Primary Navigation Drawer / Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        portal={portal}
        onSwitchPortal={handleSwitchPortal}
        profile={profile}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        activeOrdersCount={orders.filter((o) => o.status !== 'Delivered').length}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
      />

      {/* Main Content Workspace (Responds smoothly to Sidebar width) */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Header Bar */}
        <Header
          portal={portal}
          onSwitchPortal={handleSwitchPortal}
          setPortal={handleSwitchPortal}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          profile={profile}
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          notifications={notifications}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onSearch={handleSearchTrigger}
          onOpenSmartSearch={handleSearchTrigger}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAIChat={() => setIsAIChatOpen(true)}
          onOpenPrescriptionScanner={() => setIsVaultOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          medicines={medicines}
          pharmacies={pharmacies}
          onLogout={() => setIsAuthenticated(false)}
        />

        {/* Dynamic Workspace Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          
          {portal === 'customer' ? (
            <div className="space-y-6">
              
              {/* Dynamic View Tab Rendering */}
              {(activeTab === 'home' || activeTab === 'wallet' || activeTab === 'vault' || activeTab === 'cart' || activeTab === 'family') && (
                <CustomerHome
                  profile={profile}
                  reminders={reminders}
                  orders={orders}
                  onNavigateTab={(tab) => {
                    if (tab === 'map') setActiveTab('map');
                    else if (tab === 'tracking') setActiveTab('tracking');
                    else if (tab === 'vault') setIsVaultOpen(true);
                    else if (tab === 'wallet') setIsWalletOpen(true);
                    else if (tab === 'orders') setActiveTab('orders');
                    else if (tab === 'history') setActiveTab('history');
                    else setActiveTab(tab);
                  }}
                  onOpenAIChat={() => setIsAIChatOpen(true)}
                  onOpenNotifications={() => setIsNotificationOpen(true)}
                  onSearchClick={handleSearchTrigger}
                />
              )}

              {activeTab === 'map' && (
                <MapViewPage
                  pharmacies={pharmacies}
                  medicines={medicines}
                  stockItems={stockItems}
                  onAddToCart={handleAddToCart}
                  onGoToCart={() => setIsCartOpen(true)}
                />
              )}

              {activeTab === 'orders' && (
                <OrdersView
                  orders={orders}
                  activeFilter="active"
                  onTrackOrder={(order) => {
                    setTrackingOrder(order);
                    setActiveTab('tracking');
                  }}
                />
              )}

              {activeTab === 'tracking' && (
                <LiveDeliveryTracking
                  order={trackingOrder || orders[0]}
                  onBackToOrders={() => setActiveTab('orders')}
                />
              )}

              {activeTab === 'history' && (
                <OrdersView
                  orders={orders}
                  activeFilter="history"
                  onTrackOrder={(order) => {
                    setTrackingOrder(order);
                    setActiveTab('tracking');
                  }}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  profile={profile}
                  onUpdateProfile={(updated) => setProfile(updated)}
                  onOpenProfileModal={() => setIsProfileOpen(true)}
                />
              )}

            </div>
          ) : (
            /* Pharmacy Admin Portal Dashboard */
            <PharmacyDashboard
              pharmacies={pharmacies}
              stockItems={stockItems}
              invoices={invoices}
              orders={orders}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onUpdateStock={handleUpdateStock}
              onAddStockItem={handleAddStockItem}
              onDeleteStockItem={handleDeleteStockItem}
              onAddInvoice={handleAddInvoice}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

        </main>

        {/* Global Footer */}
        <footer className="bg-slate-900 text-white text-xs border-t border-slate-800 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold font-['Playfair_Display'] text-base">
              <span className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-900 flex items-center justify-center font-extrabold text-xs">M</span>
              Medifinds Platform
            </div>
            <div className="text-slate-400">
              © 2026 Medifinds Healthcare Technologies • Coimbatore Pharmacy Locator & Live Delivery Network
            </div>
          </div>
        </footer>

      </div>

      {/* Global Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-4 text-xs font-bold animate-bounce">
          <span>🔔 {toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Real-time Notification Panel */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkRead={(id) => {
          setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
        }}
        onMarkAllRead={() => {
          setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
        }}
        onClearAll={() => setNotifications([])}
      />

      {/* All Application Modals & Dialogs */}
      <SmartSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialQuery={searchQuery}
        medicines={medicines}
        pharmacies={pharmacies}
        stockItems={stockItems}
        onAddToCart={handleAddToCart}
      />

      <FamilyMedicineModal
        isOpen={isFamilyOpen}
        onClose={() => setIsFamilyOpen(false)}
        familyMembers={familyMembers}
        onAddMember={(m) => setFamilyMembers([...familyMembers, m])}
        onUpdateMember={(updated) => {
          setFamilyMembers(familyMembers.map((f) => (f.id === updated.id ? updated : f)));
        }}
        onDeleteMember={(id) => setFamilyMembers(familyMembers.filter((f) => f.id !== id))}
      />

      <ReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        reminders={reminders}
        onToggleTaken={handleToggleReminderTaken}
        onAddReminder={handleAddReminder}
        onDeleteReminder={handleDeleteReminder}
      />

      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        balance={profile.walletBalance}
        transactions={walletTransactions}
        onTopUp={handleTopUpWallet}
      />

      <PrescriptionVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        prescriptions={prescriptions}
        profile={profile}
        onAddPrescription={(p) => setPrescriptions([p, ...prescriptions])}
      />

      <CartCheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        profile={profile}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onPlaceOrder={handlePlaceOrder}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={(p) => setProfile(p)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <AIChatbot
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        profileName={profile.name}
      />

    </div>
  );
}
