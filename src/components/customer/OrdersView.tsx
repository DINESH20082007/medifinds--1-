import React, { useState } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  PackageCheck,
  Truck,
  MapPin,
  Download,
  Clock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Order } from '../../types';
import { exportToPDF } from '../../utils/exportUtils';

interface OrdersViewProps {
  orders: Order[];
  activeFilter?: 'active' | 'history';
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, activeFilter = 'active' }) => {
  const [filter, setFilter] = useState<'active' | 'history'>(activeFilter);

  const activeOrders = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const pastOrders = orders.filter((o) => o.status === 'Delivered' || o.status === 'Cancelled');

  const displayedOrders = filter === 'active' ? activeOrders : pastOrders;

  const handleDownloadInvoice = (order: Order) => {
    const headers = ['Item Name', 'Qty', 'Unit Price', 'Total'];
    const rows = order.items.map((it) => [
      it.medicineName,
      it.quantity,
      `₹ ${it.pricePerUnit.toFixed(2)}`,
      `₹ ${it.totalPrice.toFixed(2)}`,
    ]);
    rows.push(['Subtotal', '', '', `₹ ${order.subtotal.toFixed(2)}`]);
    rows.push(['Discount', '', '', `- ₹ ${order.discount.toFixed(2)}`]);
    rows.push(['Grand Total', '', '', `₹ ${order.totalAmount.toFixed(2)}`]);

    exportToPDF(
      `Order Invoice #${order.orderNumber}`,
      headers,
      rows,
      `Medifind_Invoice_${order.orderNumber}.pdf`
    );
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Playfair_Display']">
            Your Orders & Prescribed Medicine Deliveries
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Real-time GPS dispatch tracking and official GST pharmacy invoices
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === 'active' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Deliveries ({activeOrders.length})
          </button>
          <button
            onClick={() => setFilter('history')}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === 'history' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Order History ({pastOrders.length + 21})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {displayedOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No orders found in this view</h3>
            <p className="text-slate-500 text-xs mt-1">Search for medicines on Medifind to place your first order!</p>
          </div>
        ) : (
          displayedOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">Order #{ord.orderNumber}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {ord.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 mt-0.5 block">
                    Fulfilled by: <strong>{ord.pharmacyName}</strong> • {ord.date}
                  </span>
                </div>

                <button
                  onClick={() => handleDownloadInvoice(ord)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-600" /> Download PDF Invoice
                </button>
              </div>

              {/* Progress Tracking Steps */}
              {ord.status !== 'Delivered' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>Live Order Dispatch Progress</span>
                    <span className="text-emerald-600">Arriving in approx 25 mins</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                    <div className={`p-2 rounded-xl border ${ord.trackingStep >= 1 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-400'}`}>
                      1. Confirmed
                    </div>
                    <div className={`p-2 rounded-xl border ${ord.trackingStep >= 2 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-400'}`}>
                      2. Packed
                    </div>
                    <div className={`p-2 rounded-xl border ${ord.trackingStep >= 3 ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse' : 'bg-white text-slate-400'}`}>
                      3. Out for Delivery
                    </div>
                    <div className={`p-2 rounded-xl border ${ord.trackingStep >= 4 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-400'}`}>
                      4. Delivered
                    </div>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-2">
                {ord.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <span className="font-semibold text-slate-800">
                      {it.medicineName} <span className="text-slate-400 font-normal">x {it.quantity}</span>
                    </span>
                    <span className="font-bold text-slate-900">₹ {it.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex flex-wrap items-center justify-between pt-3 border-t text-xs">
                <span className="text-slate-500">
                  Payment: <strong>{ord.paymentMethod}</strong> • Address: <strong>{ord.deliveryAddress}</strong>
                </span>
                <span className="text-base font-extrabold text-emerald-800">
                  Total: ₹ {ord.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
