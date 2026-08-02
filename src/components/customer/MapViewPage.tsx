import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Search,
  CheckCircle2,
  XCircle,
  Star,
  Clock,
  Phone,
  Navigation,
  ShoppingCart,
  Pill,
  Filter,
  Check,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pharmacy, PharmacyStockItem, Medicine } from '../../types';

interface MapViewPageProps {
  pharmacies: Pharmacy[];
  stockItems: PharmacyStockItem[];
  medicines: Medicine[];
  onAddToCart: (medicine: Medicine, pharmacy: Pharmacy, qty: number) => void;
  onGoToCart: () => void;
}

export const MapViewPage: React.FC<MapViewPageProps> = ({
  pharmacies,
  stockItems,
  medicines,
  onAddToCart,
  onGoToCart,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy>(pharmacies[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOnlyOpen, setFilterOnlyOpen] = useState(false);
  const [addedItemMsg, setAddedItemMsg] = useState<string | null>(null);

  // Filtered pharmacies
  const filteredPharmacies = pharmacies.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOpen = !filterOnlyOpen || p.isOpen;
    return matchesSearch && matchesOpen;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMap.current) {
      const map = L.map(mapRef.current, {
        center: [11.0168, 76.9558], // Coimbatore Center
        zoom: 13,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      leafletMap.current = map;
    }

    // Update Markers
    if (leafletMap.current) {
      // Clear previous markers
      Object.values(markersRef.current).forEach((m) => {
        if (m && typeof (m as any).remove === 'function') {
          (m as any).remove();
        }
      });
      markersRef.current = {};

      filteredPharmacies.forEach((p) => {
        const isSelected = selectedPharmacy.id === p.id;
        const color = p.isOpen ? (isSelected ? '#059669' : '#0d9488') : '#ef4444';

        const customIcon = L.divIcon({
          className: 'custom-pharmacy-pin',
          html: `<div style="background-color: ${color}; color: white; padding: 7px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'}; transition: transform 0.2s;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });

        const marker = L.marker([p.lat, p.lng], { icon: customIcon })
          .addTo(leafletMap.current!)
          .bindPopup(`<b>${p.name}</b><br/>${p.area}, Coimbatore<br/>Rating: ${p.rating} ★`);

        marker.on('click', () => {
          setSelectedPharmacy(p);
        });

        markersRef.current[p.id] = marker;
      });
    }
  }, [filteredPharmacies, selectedPharmacy]);

  // Center map when selected pharmacy changes
  useEffect(() => {
    if (leafletMap.current && selectedPharmacy) {
      leafletMap.current.panTo([selectedPharmacy.lat, selectedPharmacy.lng]);
    }
  }, [selectedPharmacy]);

  // Available stock in selected pharmacy
  const pStock = stockItems.filter((s) => s.pharmacyId === selectedPharmacy.id);

  const handleAddMed = (med: Medicine, qty: number) => {
    onAddToCart(med, selectedPharmacy, qty);
    setAddedItemMsg(`Added ${med.name} to Cart!`);
    setTimeout(() => setAddedItemMsg(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {addedItemMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4" />
          <span>{addedItemMsg}</span>
          <button onClick={onGoToCart} className="underline ml-2 text-white">
            View Cart
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            Coimbatore Geo-Locator
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Find Nearby Pharmacies in Coimbatore
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time medicine stock check across RS Puram, Gandhipuram, Peelamedu, Saibaba Colony & Town Hall
          </p>
        </div>

        <button
          onClick={onGoToCart}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all"
        >
          <ShoppingCart className="w-4 h-4" />
          Proceed to Cart & Checkout
        </button>
      </div>

      {/* Main Grid: Sidebar List + Map View + Stock Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filterable Pharmacy List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search area (e.g. RS Puram, Peelamedu)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 pt-1">
              <span>Shops Found: {filteredPharmacies.length}</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterOnlyOpen}
                  onChange={(e) => setFilterOnlyOpen(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Open Now Only</span>
              </label>
            </div>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredPharmacies.map((p) => {
              const isSelected = selectedPharmacy.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPharmacy(p)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{p.name}</h3>
                      <p className="text-slate-500 text-xs mt-0.5">{p.address}</p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        p.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.isOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{p.rating}</span>
                      <span className="text-slate-400 font-normal">({p.reviewCount})</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{p.distanceKm} km away</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Leaflet Map & Selected Store Live Inventory */}
        <div className="lg:col-span-8 space-y-6">
          {/* Map Container */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden relative">
            <div ref={mapRef} className="w-full h-80 sm:h-96 z-10" />

            <div className="absolute bottom-3 left-3 z-20 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-xs font-bold border border-slate-700 shadow-lg flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Selected: <span className="text-emerald-300">{selectedPharmacy.name}</span></span>
            </div>
          </div>

          {/* Selected Store Inventory & Direct Buy Panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-emerald-600" />
                  Live Stock at {selectedPharmacy.name}
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  Direct pharmacy inventory verified in Coimbatore
                </p>
              </div>

              <a
                href={`tel:${selectedPharmacy.phone}`}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                Call Pharmacy
              </a>
            </div>

            {/* Medicine Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pStock.length === 0 ? (
                <div className="col-span-2 p-8 text-center text-slate-400 text-xs font-medium">
                  No stock items listed currently for this outlet.
                </div>
              ) : (
                pStock.map((st) => {
                  const isAvailable = st.quantityInStock > 0 && selectedPharmacy.isOpen;
                  return (
                    <div
                      key={st.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={st.medicine.image}
                          alt={st.medicine.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{st.medicine.name}</h4>
                          <p className="text-slate-500 text-[11px]">{st.medicine.category}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px]">
                            <span className="font-extrabold text-emerald-700">₹ {st.medicine.unitPrice}</span>
                            <span className="text-slate-400 line-through">₹ {st.medicine.mrp}</span>
                            <span className="text-slate-500 font-semibold">• Stock: {st.quantityInStock}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        disabled={!isAvailable}
                        onClick={() => handleAddMed(st.medicine, 1)}
                        className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all shrink-0 ${
                          isAvailable
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {isAvailable ? '+ Add' : 'Out of Stock'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
