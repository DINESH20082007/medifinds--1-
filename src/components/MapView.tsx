import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Pharmacy, PharmacyStockItem } from '../types';

interface MapViewProps {
  pharmacies: Pharmacy[];
  stockItems: PharmacyStockItem[];
  selectedMedicineName?: string;
  onSelectPharmacy?: (pharmacy: Pharmacy) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  pharmacies,
  stockItems,
  selectedMedicineName,
  onSelectPharmacy,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already initialized
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [12.9716, 77.6412], // Indiranagar, Bengaluru default
        zoom: 13,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const bounds = L.latLngBounds([]);

    pharmacies.forEach((pharm) => {
      // Find matching stock for this pharmacy
      const stock = stockItems.find((s) => s.pharmacyId === pharm.id);
      const isAvailable = pharm.isOpen && stock && stock.quantityInStock > 0;

      // Custom HTML pin icon
      const pinColor = isAvailable ? '#10B981' : '#64748B'; // Emerald vs Slate Gray
      const pulseHtml = isAvailable
        ? `<div class="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-md animate-ping absolute top-1 left-1"></div>`
        : '';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg text-white font-bold text-xs" style="background-color: ${pinColor}">
            ${pulseHtml}
            <span class="relative z-10">${isAvailable ? stock.quantityInStock : '0'}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([pharm.lat, pharm.lng], { icon: customIcon }).addTo(map);

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 font-sans text-sm max-w-xs';
      popupContent.innerHTML = `
        <div class="font-bold text-slate-800 text-base mb-1">${pharm.name}</div>
        <div class="text-xs text-slate-500 mb-2">${pharm.address} (${pharm.distanceKm} km away)</div>
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2 py-0.5 rounded text-xs font-semibold ${
            isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
          }">
            ${isAvailable ? `In Stock: ${stock.quantityInStock} units` : 'Out of Stock / Closed'}
          </span>
          <span class="text-xs text-slate-500">⭐ ${pharm.rating} (${pharm.reviewCount})</span>
        </div>
        <div class="text-xs text-slate-600 mb-3">🕒 ${pharm.openTime} - ${pharm.closeTime}</div>
        <button id="pharm-btn-${pharm.id}" class="w-full py-1.5 px-3 rounded-lg bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 transition-colors">
          Select Pharmacy
        </button>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`pharm-btn-${pharm.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectPharmacy) onSelectPharmacy(pharm);
          };
        }
      });

      bounds.extend([pharm.lat, pharm.lng]);
    });

    if (pharmacies.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      // cleanup on unmount
    };
  }, [pharmacies, stockItems, selectedMedicineName, onSelectPharmacy]);

  return (
    <div class="relative w-full h-[380px] rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <div ref={mapContainerRef} class="w-full h-full z-0" />
      <div class="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs font-semibold text-slate-700 flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        Live GPS Pharmacy Stock Map
      </div>
    </div>
  );
};
