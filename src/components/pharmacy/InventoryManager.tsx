import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { PharmacyStockItem, Medicine } from '../../types';

interface InventoryManagerProps {
  stockItems: PharmacyStockItem[];
  onUpdateStock: (stockId: string, newQty: number, newPrice?: number) => void;
  onAddStockItem: (item: PharmacyStockItem) => void;
  onDeleteStockItem: (stockId: string) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  stockItems = [],
  onUpdateStock,
  onAddStockItem,
  onDeleteStockItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState<number>(0);

  // New Item modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [medName, setMedName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Painkiller & Fever');
  const [qty, setQty] = useState(100);
  const [price, setPrice] = useState(40);
  const [batchNo, setBatchNo] = useState(`BATCH-${Math.floor(100 + Math.random() * 900)}`);
  const [expiry, setExpiry] = useState('2027-12-31');

  const safeStockItems = stockItems || [];
  const filteredStock = safeStockItems.filter(
    (s) =>
      s?.medicine?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s?.medicine?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s?.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveEdit = (stockId: string) => {
    onUpdateStock(stockId, editQty);
    setEditingId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    const newMed: Medicine = {
      id: `med-${Date.now()}`,
      name: medName.trim(),
      brand: brand || 'Generic Pharma',
      composition: `${medName} Active Generic Formula`,
      category,
      requiresPrescription: false,
      unitPrice: price,
      mrp: price * 1.15,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
      description: 'Pharmacy inventory added item.',
      dosageInstructions: 'As advised by doctor.',
    };

    const newStock: PharmacyStockItem = {
      id: `st-${Date.now()}`,
      pharmacyId: 'pharm-1',
      medicineId: newMed.id,
      medicine: newMed,
      quantityInStock: qty,
      batchNumber: batchNo,
      expiryDate: expiry,
      discountPercent: 10,
    };

    onAddStockItem(newStock);
    setShowAddModal(false);
    setMedName('');
  };

  return (
    <div className="space-y-5 text-xs">
      
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search store inventory by name, batch, or category..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-500"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Medicine Stock
        </button>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <form onSubmit={handleAddSubmit} className="p-5 bg-emerald-50/70 border border-emerald-300 rounded-2xl space-y-3">
          <div className="font-bold text-emerald-950 text-sm">Add Medicine to Store Master Stock</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Medicine Name (e.g. Paracetamol 650mg)"
              value={medName}
              onChange={(e) => setMedName(e.target.value)}
              className="p-2.5 bg-white border rounded-xl"
              required
            />
            <input
              type="text"
              placeholder="Brand / Manufacturer"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="p-2.5 bg-white border rounded-xl"
            />
            <input
              type="number"
              placeholder="Initial Stock Quantity"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 0)}
              className="p-2.5 bg-white border rounded-xl"
              required
            />
            <input
              type="number"
              placeholder="Price per Unit (₹)"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              className="p-2.5 bg-white border rounded-xl"
              required
            />
            <input
              type="text"
              placeholder="Batch Number"
              value={batchNo}
              onChange={(e) => setBatchNo(e.target.value)}
              className="p-2.5 bg-white border rounded-xl"
            />
            <input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="p-2.5 bg-white border rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-1.5 bg-emerald-600 text-white font-bold rounded-xl">
              Save to Stock
            </button>
          </div>
        </form>
      )}

      {/* Stock Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-900 text-white font-bold text-xs flex items-center justify-between">
          <span>Live Store Stock Master ({filteredStock.length} items)</span>
          <span className="text-[10px] text-emerald-400 font-medium">
            Changes update GPS Customer Map instantly
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                <th className="p-3.5">Medicine Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Batch No.</th>
                <th className="p-3.5">Expiry Date</th>
                <th className="p-3.5">Unit Price (₹)</th>
                <th className="p-3.5">Real-time Stock</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStock.map((st) => {
                const isEditing = editingId === st.id;
                const isLow = st.quantityInStock <= 15;
                return (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      {st.medicine.name}
                      <span className="block font-normal text-slate-400 text-[10px]">{st.medicine.brand}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                        {st.medicine.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">{st.batchNumber}</td>
                    <td className="p-3.5 text-slate-600">{st.expiryDate}</td>
                    <td className="p-3.5 font-extrabold text-slate-900">₹ {st.medicine.unitPrice}</td>
                    <td className="p-3.5">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editQty}
                          onChange={(e) => setEditQty(parseInt(e.target.value) || 0)}
                          className="w-20 p-1 border rounded text-xs"
                        />
                      ) : (
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold ${
                            isLow ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {st.quantityInStock} units
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveEdit(st.id)}
                          className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(st.id);
                            setEditQty(st.quantityInStock);
                          }}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          title="Quick Edit Stock Quantity"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteStockItem(st.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Delete Stock Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
