import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Download,
  Search,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { PharmacyStockItem, PharmacyInvoice } from '../../types';
import { exportToPDF } from '../../utils/exportUtils';

interface POSBillingProps {
  stockItems: PharmacyStockItem[];
  invoices: PharmacyInvoice[];
  onAddInvoice: (inv: PharmacyInvoice) => void;
}

export const POSBilling: React.FC<POSBillingProps> = ({
  stockItems = [],
  invoices = [],
  onAddInvoice,
}) => {
  const safeStockItems = stockItems || [];
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card'>('UPI');

  // Cart items in POS
  const [billItems, setBillItems] = useState<{
    stockItem: PharmacyStockItem;
    qty: number;
  }[]>([]);

  const subtotal = billItems.reduce((sum, item) => sum + item.stockItem.medicine.mrp * item.qty, 0);
  const taxAmount = subtotal * 0.12; // 12% GST
  const grandTotal = subtotal + taxAmount;

  const handleAddItemToBill = (stock: PharmacyStockItem) => {
    const existingIndex = billItems.findIndex((b) => b.stockItem.id === stock.id);
    if (existingIndex > -1) {
      const updated = [...billItems];
      updated[existingIndex].qty += 1;
      setBillItems(updated);
    } else {
      setBillItems([...billItems, { stockItem: stock, qty: 1 }]);
    }
  };

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (billItems.length === 0 || !customerName.trim()) {
      alert('Please add customer details and at least 1 medicine item!');
      return;
    }

    const newInvoice: PharmacyInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || '+91 90000 00000',
      date: new Date().toISOString().split('T')[0],
      items: billItems.map((b) => ({
        medicineName: b.stockItem.medicine.name,
        batchNo: b.stockItem.batchNumber,
        quantity: b.qty,
        mrp: b.stockItem.medicine.mrp,
        amount: b.stockItem.medicine.mrp * b.qty,
      })),
      subtotal,
      taxAmount,
      totalAmount: grandTotal,
      paymentMode,
    };

    onAddInvoice(newInvoice);
    setBillItems([]);
    setCustomerName('');
    setCustomerPhone('');
    alert(`Invoice #${newInvoice.invoiceNumber} successfully generated and recorded!`);
  };

  const handleExportPDFInvoice = (inv: PharmacyInvoice) => {
    const headers = ['Medicine', 'Batch No', 'Qty', 'MRP', 'Amount'];
    const rows = inv.items.map((it) => [
      it.medicineName,
      it.batchNo,
      it.quantity,
      `₹ ${it.mrp.toFixed(2)}`,
      `₹ ${it.amount.toFixed(2)}`,
    ]);
    rows.push(['Subtotal', '', '', '', `₹ ${inv.subtotal.toFixed(2)}`]);
    rows.push(['GST Tax (12%)', '', '', '', `₹ ${inv.taxAmount.toFixed(2)}`]);
    rows.push(['Total Amount', '', '', '', `₹ ${inv.totalAmount.toFixed(2)}`]);

    exportToPDF(
      `Pharmacy Bill #${inv.invoiceNumber} - ${inv.customerName}`,
      headers,
      rows,
      `Pharmacy_Invoice_${inv.invoiceNumber}.pdf`
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
      
      {/* Left Column: POS Terminal Form */}
      <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600" /> New Counter POS Billing Terminal
        </h3>

        {/* Customer Input */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="p-2.5 bg-slate-50 border rounded-xl"
            required
          />
          <input
            type="text"
            placeholder="Customer Phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="p-2.5 bg-slate-50 border rounded-xl"
          />
        </div>

        {/* Add Items Picker */}
        <div>
          <label className="block font-bold text-slate-700 mb-2">Select In-Stock Medicines</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {safeStockItems.map((st) => (
              <button
                key={st.id}
                onClick={() => handleAddItemToBill(st)}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 text-left flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900">{st.medicine.name}</div>
                  <div className="text-[10px] text-slate-500">₹ {st.medicine.mrp} • Stock: {st.quantityInStock}</div>
                </div>
                <Plus className="w-4 h-4 text-emerald-600" />
              </button>
            ))}
          </div>
        </div>

        {/* Current Bill Table */}
        <div className="border rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-500 font-bold text-[10px] uppercase">
              <tr>
                <th className="p-2">Item</th>
                <th className="p-2">Qty</th>
                <th className="p-2">MRP</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {billItems.map((b, idx) => (
                <tr key={idx}>
                  <td className="p-2 font-bold text-slate-800">{b.stockItem.medicine.name}</td>
                  <td className="p-2 font-bold">{b.qty}</td>
                  <td className="p-2">₹ {b.stockItem.medicine.mrp}</td>
                  <td className="p-2 text-right font-extrabold text-emerald-700">
                    ₹ {(b.stockItem.medicine.mrp * b.qty).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment mode */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex gap-2">
            {(['UPI', 'Cash', 'Card'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPaymentMode(mode)}
                className={`px-3 py-1.5 rounded-xl font-bold border ${
                  paymentMode === mode ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateInvoice}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md"
          >
            Generate & Print Bill (₹ {grandTotal.toFixed(2)})
          </button>
        </div>
      </div>

      {/* Right Column: Invoices History Record */}
      <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Recent POS Invoices ({invoices.length})</h3>

        <div className="space-y-2">
          {invoices.map((inv) => (
            <div key={inv.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-xs">{inv.invoiceNumber}</span>
                <p className="text-[10px] text-slate-500">{inv.customerName} • {inv.date}</p>
                <span className="font-extrabold text-emerald-700 text-xs block">₹ {inv.totalAmount.toFixed(2)} ({inv.paymentMode})</span>
              </div>

              <button
                onClick={() => handleExportPDFInvoice(inv)}
                className="p-2 bg-white border border-slate-200 hover:bg-emerald-50 rounded-xl text-emerald-700"
                title="Download PDF Invoice"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
