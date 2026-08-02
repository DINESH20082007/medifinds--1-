import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  ShieldAlert,
  CheckCircle2,
  Wallet,
  CreditCard,
  Building2
} from 'lucide-react';
import { CartItem, CustomerProfile, Order } from '../../types';

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  profile: CustomerProfile;
  onUpdateQty: (medId: string, delta: number) => void;
  onRemoveItem: (medId: string) => void;
  onPlaceOrder: (order: Order) => void;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  profile,
  onUpdateQty,
  onRemoveItem,
  onPlaceOrder,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Wallet' | 'Cash on Delivery'>('UPI');
  const [showAgeVerificationModal, setShowAgeVerificationModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.medicine.unitPrice * item.quantity, 0);
  const deliveryFee = subtotal > 300 || cartItems.length === 0 ? 0 : 25;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const hasAgeRestrictedItems = cartItems.some(
    (item) => item.medicine.ageLimit && item.medicine.ageLimit > 0
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'MONSOON50' && subtotal >= 300) {
      setDiscountAmount(50);
      setCouponApplied(true);
    } else if (couponCode.toUpperCase() === 'APOLLO100') {
      setDiscountAmount(100);
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code or minimum order amount not met!');
    }
  };

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return;

    if (hasAgeRestrictedItems && !profile.isAgeVerified) {
      setShowAgeVerificationModal(true);
      return;
    }

    executeOrderPlacement();
  };

  const executeOrderPlacement = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `MF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        pharmacyName: cartItems[0]?.pharmacy.name || 'Apollo Pharmacy',
        items: cartItems.map((ci) => ({
          medicineName: ci.medicine.name,
          quantity: ci.quantity,
          pricePerUnit: ci.medicine.unitPrice,
          totalPrice: ci.medicine.unitPrice * ci.quantity,
        })),
        subtotal,
        discount: discountAmount,
        deliveryFee,
        totalAmount: grandTotal,
        status: 'Processing',
        paymentMethod,
        deliveryAddress: `${profile.addresses[0]?.street || 'Home'}, ${profile.addresses[0]?.city || 'Bengaluru'}`,
        trackingStep: 1,
      };

      onPlaceOrder(newOrder);
      onClose();
      alert(`Order #${newOrder.orderNumber} successfully placed! Dispatch in progress.`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Medifind Cart & Instant Checkout</h2>
              <p className="text-xs text-slate-300">
                Direct partner pharmacy dispatch with verified age & prescription check
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50 text-xs">
          
          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="font-bold text-slate-700">Your Medifind Cart is empty</p>
              <p className="text-xs">Search medicines to locate nearby pharmacy stock.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-xs">
                Items from {cartItems[0]?.pharmacy.name} ({cartItems.length})
              </span>

              {cartItems.map((item) => (
                <div
                  key={item.medicine.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.medicine.image}
                      alt={item.medicine.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.medicine.name}</h4>
                      <p className="text-[10px] text-slate-500">{item.medicine.composition}</p>
                      <span className="font-extrabold text-emerald-700 text-xs mt-1 block">
                        ₹ {item.medicine.unitPrice} / unit
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => onUpdateQty(item.medicine.id, -1)}
                        className="p-1 hover:bg-white rounded-lg text-slate-700"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 font-bold text-xs">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQty(item.medicine.id, 1)}
                        className="p-1 hover:bg-white rounded-lg text-slate-700"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.medicine.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Promo Coupon Form */}
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Apply Coupon (e.g. MONSOON50, APOLLO100)"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs uppercase font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
            >
              Apply
            </button>
          </form>

          {couponApplied && (
            <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Coupon Applied! You saved ₹ {discountAmount}.
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <span className="font-bold text-slate-700 uppercase tracking-wider text-xs block mb-2">
              Select Payment Method
            </span>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-2xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5" /> UPI (GPay/PhonePe)
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Wallet')}
                className={`p-3 rounded-2xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'Wallet'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <Wallet className="w-5 h-5" /> Wallet (₹ {profile.walletBalance})
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-3 rounded-2xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <Building2 className="w-5 h-5" /> Cash on Delivery
              </button>
            </div>
          </div>

          {/* Bill Breakdown */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-900">₹ {subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Discount</span>
                <span>- ₹ {discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Express Delivery Fee</span>
              <span className="font-bold text-slate-900">{deliveryFee === 0 ? 'FREE' : `₹ ${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-emerald-950 pt-2 border-t">
              <span>Grand Total</span>
              <span>₹ {grandTotal.toFixed(2)}</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Amount</span>
            <span className="text-xl font-extrabold text-emerald-900">₹ {grandTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckoutClick}
            disabled={cartItems.length === 0 || isProcessing}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-lg transition-colors text-sm"
          >
            {isProcessing ? 'Processing Order...' : 'Place Order Now'}
          </button>
        </div>

      </div>

      {/* Age Limit Verification Pop-up */}
      {showAgeVerificationModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 border border-rose-200 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Schedule H/H1 Age Limit Requirement</h3>
            <p className="text-slate-500 text-xs">
              One or more items in your cart require verified age 18+ approval under drug compliance rules. Please verify your Aadhaar or profile age first.
            </p>
            <button
              onClick={() => {
                setShowAgeVerificationModal(false);
                executeOrderPlacement();
              }}
              className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs"
            >
              I Confirm I am 18+ & Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
