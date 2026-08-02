import React, { useState } from 'react';
import {
  X,
  Search,
  MapPin,
  Pill,
  Clock,
  Phone,
  Navigation,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShoppingCart,
  Filter
} from 'lucide-react';
import { Medicine, Pharmacy, PharmacyStockItem } from '../../types';
import { MapView } from '../MapView';

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery: string;
  medicines: Medicine[];
  pharmacies: Pharmacy[];
  stockItems: PharmacyStockItem[];
  onAddToCart: (medicine: Medicine, pharmacy: Pharmacy, qty: number) => void;
}

export const SmartSearchModal: React.FC<SmartSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery,
  medicines,
  pharmacies,
  stockItems,
  onAddToCart,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(
    medicines.find((m) => m.name.toLowerCase().includes(initialQuery.toLowerCase())) || medicines[0]
  );
  const [qty, setQty] = useState(1);

  if (!isOpen) return null;

  const filteredMedicines = medicines.filter((m) => {
    const matchesQuery =
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.composition.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase());
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  const activeMed = selectedMed || filteredMedicines[0] || medicines[0];

  // Get stock items for the active medicine across all pharmacies
  const pharmaciesWithStock = pharmacies.map((pharm) => {
    const stock = stockItems.find((s) => s.pharmacyId === pharm.id && s.medicineId === activeMed.id);
    return {
      pharmacy: pharm,
      stock: stock || null,
      isAvailable: pharm.isOpen && stock && stock.quantityInStock > 0,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header Search */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search medicine by brand or formula (e.g. Paracetamol, Augmentin)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 text-white rounded-xl text-xs sm:text-sm border border-slate-700 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50">
          
          {/* Medicine Selector Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Matching Medicines ({filteredMedicines.length})
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                Select a medicine to check GPS live stock
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {filteredMedicines.map((med) => {
                const isSelected = activeMed.id === med.id;
                return (
                  <button
                    key={med.id}
                    onClick={() => setSelectedMed(med)}
                    className={`p-3 rounded-2xl border text-left shrink-0 w-60 transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-400'
                    }`}
                  >
                    <div className="font-bold text-xs truncate">{med.name}</div>
                    <div className={`text-[10px] truncate ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {med.composition}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/20">
                      <span className="font-extrabold text-xs">₹ {med.unitPrice}</span>
                      {med.requiresPrescription && (
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          isSelected ? 'bg-amber-400 text-slate-900' : 'bg-amber-100 text-amber-900'
                        }`}>
                          Prescription Req
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Medicine Spec Banner */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={activeMed.image}
                alt={activeMed.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{activeMed.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {activeMed.category}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">{activeMed.composition} • {activeMed.brand}</p>
                <p className="text-slate-600 text-[11px] mt-1">{activeMed.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl font-extrabold text-emerald-700">₹ {activeMed.unitPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Interactive Map Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                GPS Map View: Partner Pharmacies Stocking {activeMed.name}
              </h3>
              <span className="text-xs text-slate-500">
                In Stock Pins: Green | Out of Stock / Closed: Darkened
              </span>
            </div>

            <MapView
              pharmacies={pharmacies}
              stockItems={stockItems.filter((s) => s.medicineId === activeMed.id)}
              selectedMedicineName={activeMed.name}
            />
          </div>

          {/* Pharmacy Stock List Grid */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              Nearby Pharmacies Availability List
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pharmaciesWithStock.map(({ pharmacy, stock, isAvailable }) => (
                <div
                  key={pharmacy.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isAvailable
                      ? 'bg-white border-slate-200 hover:border-emerald-500 shadow-sm'
                      : 'bg-slate-100 border-slate-200 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h4 className={`font-bold text-sm ${isAvailable ? 'text-slate-900' : 'text-slate-500'}`}>
                          {pharmacy.name}
                        </h4>
                        <p className="text-xs text-slate-500">{pharmacy.address}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {pharmacy.distanceKm} km away
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 my-2">
                      <span className="flex items-center gap-1">⭐ {pharmacy.rating}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {pharmacy.openTime} - {pharmacy.closeTime}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 my-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        {isAvailable ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span className="font-bold text-emerald-800">
                              In Stock ({stock?.quantityInStock} units left)
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-slate-400" />
                            <span className="font-semibold text-slate-500">Out of Stock / Store Closed</span>
                          </>
                        )}
                      </div>
                      {stock && stock.discountPercent > 0 && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                          {stock.discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <a
                      href={`https://maps.google.com/?q=${pharmacy.lat},${pharmacy.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5 text-slate-500" /> Map Directions
                    </a>

                    {isAvailable && (
                      <button
                        onClick={() => {
                          onAddToCart(activeMed, pharmacy, qty);
                          alert(`Added ${activeMed.name} from ${pharmacy.name} to your Cart!`);
                        }}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Order from Store
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
