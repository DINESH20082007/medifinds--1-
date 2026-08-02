import React, { useEffect, useRef, useState } from 'react';
import {
  Phone,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Package,
  Bike,
  Navigation,
  ChevronRight,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Order } from '../../types';

interface LiveDeliveryTrackingProps {
  order: Order;
  onCompleteDelivery?: (orderId: string) => void;
  onBackToOrders?: () => void;
}

export const LiveDeliveryTracking: React.FC<LiveDeliveryTrackingProps> = ({
  order,
  onCompleteDelivery,
  onBackToOrders,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const agentMarkerRef = useRef<L.Marker | null>(null);

  const agent = order.deliveryAgent || {
    name: 'Karthik Raja',
    phone: '+91 98422 12345',
    rating: 4.9,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    vehicleNumber: 'TN 37 B 8842 (TVS XL EV)',
    currentLat: 11.0115,
    currentLng: 76.9538,
    etaMinutes: 12,
    otp: '4829',
  };

  // Coimbatore Coordinates
  const userLat = 11.0083;
  const userLng = 76.9515;
  const pharmacyLat = 11.0183;
  const pharmacyLng = 76.9658;

  const [agentPos, setAgentPos] = useState({
    lat: agent.currentLat,
    lng: agent.currentLng,
  });

  const [eta, setEta] = useState(agent.etaMinutes);

  // Animate delivery partner movement towards destination
  useEffect(() => {
    const interval = setInterval(() => {
      setAgentPos((prev) => {
        const deltaLat = (userLat - prev.lat) * 0.05;
        const deltaLng = (userLng - prev.lng) * 0.05;

        // If close enough, don't overshoot
        if (Math.abs(userLat - prev.lat) < 0.0005) {
          return prev;
        }

        return {
          lat: prev.lat + deltaLat,
          lng: prev.lng + deltaLng,
        };
      });

      setEta((prev) => (prev > 1 ? prev - 1 : 1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMap.current) {
      const map = L.map(mapRef.current, {
        center: [11.014, 76.956],
        zoom: 14,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // User Icon
      const userIcon = L.divIcon({
        className: 'custom-user-pin',
        html: `<div style="background-color: #059669; color: white; padding: 6px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      // Pharmacy Icon
      const pharmIcon = L.divIcon({
        className: 'custom-pharm-pin',
        html: `<div style="background-color: #1e293b; color: white; padding: 6px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      // Agent Icon
      const agentIcon = L.divIcon({
        className: 'custom-agent-pin',
        html: `<div style="background-color: #f59e0b; color: black; padding: 7px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18.5" cy="17.5" r="2.5"/><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      // Add Markers
      L.marker([userLat, userLng], { icon: userIcon })
        .addTo(map)
        .bindPopup(`<b>Delivery Address:</b><br/>${order.deliveryAddress}`);

      L.marker([pharmacyLat, pharmacyLng], { icon: pharmIcon })
        .addTo(map)
        .bindPopup(`<b>${order.pharmacyName}</b>`);

      const agentMarker = L.marker([agentPos.lat, agentPos.lng], { icon: agentIcon })
        .addTo(map)
        .bindPopup(`<b>Delivery Partner: ${agent.name}</b>`);

      agentMarkerRef.current = agentMarker;

      // Draw Route Polyline
      L.polyline(
        [
          [pharmacyLat, pharmacyLng],
          [agentPos.lat, agentPos.lng],
          [userLat, userLng],
        ],
        { color: '#059669', weight: 4, dashArray: '6, 8', opacity: 0.8 }
      ).addTo(map);

      leafletMap.current = map;
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [order]);

  // Update agent position on map
  useEffect(() => {
    if (agentMarkerRef.current) {
      agentMarkerRef.current.setLatLng([agentPos.lat, agentPos.lng]);
    }
  }, [agentPos]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Header Bar */}
      <div className="bg-slate-900 text-white p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            Live Delivery Tracking • Coimbatore GPS
          </div>
          <h2 className="font-extrabold text-lg sm:text-xl text-white">
            Order #{order.orderNumber}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            {order.pharmacyName} • {order.items.length} Medicines
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onBackToOrders && (
            <button
              onClick={onBackToOrders}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
            >
              Back to List
            </button>
          )}

          {onCompleteDelivery && (
            <button
              onClick={() => onCompleteDelivery(order.id)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Delivery Received
            </button>
          )}
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="bg-slate-900/95 border-b border-slate-800 p-4 sm:px-8">
        <div className="grid grid-cols-4 gap-2 text-center relative">
          <div className="flex flex-col items-center gap-1 text-emerald-400 font-bold text-[11px]">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-xs shadow-md">
              ✓
            </div>
            <span>Confirmed</span>
          </div>

          <div className="flex flex-col items-center gap-1 text-emerald-400 font-bold text-[11px]">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-xs shadow-md">
              ✓
            </div>
            <span>Packed</span>
          </div>

          <div className="flex flex-col items-center gap-1 text-amber-400 font-extrabold text-[11px]">
            <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-xs shadow-md ring-4 ring-amber-400/20 animate-bounce">
              <Bike className="w-4 h-4" />
            </div>
            <span>On the Way</span>
          </div>

          <div className="flex flex-col items-center gap-1 text-slate-500 font-semibold text-[11px]">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <span>Delivered</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Map Container */}
        <div className="lg:col-span-8 relative h-80 sm:h-[420px] bg-slate-100">
          <div ref={mapRef} className="w-full h-full z-10" />

          {/* Floating ETA Banner */}
          <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl border border-slate-700 shadow-2xl flex items-center gap-3 text-xs font-bold">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Estimated Arrival
              </span>
              <span className="text-sm font-extrabold text-emerald-400">
                {eta} Mins • Live Moving GPS
              </span>
            </div>
          </div>

          {/* OTP Pill */}
          <div className="absolute top-4 right-4 z-20 bg-emerald-950/90 backdrop-blur-md text-emerald-300 px-3.5 py-2 rounded-2xl border border-emerald-500/40 shadow-xl flex items-center gap-2 text-xs font-extrabold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Delivery OTP: <span className="text-white text-sm tracking-widest">{agent.otp}</span></span>
          </div>
        </div>

        {/* Agent & Order Details Side Panel */}
        <div className="lg:col-span-4 p-5 sm:p-6 bg-slate-50 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200">
          <div className="space-y-5">
            {/* Delivery Partner Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-base">{agent.name}</h3>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-bold border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{agent.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs font-medium mt-0.5">
                    {agent.vehicleNumber}
                  </p>
                  <p className="text-emerald-600 text-[11px] font-bold mt-0.5 flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    En route in Coimbatore
                  </p>
                </div>
              </div>

              {/* Call Agent Button */}
              <a
                href={`tel:${agent.phone}`}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Phone className="w-4 h-4 fill-white" />
                Call Agent ({agent.phone})
              </a>
            </div>

            {/* Delivery Address Summary */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-bold">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Drop Location</span>
              </div>
              <p className="text-slate-600 font-medium pl-6 leading-relaxed">
                {order.deliveryAddress}
              </p>
            </div>

            {/* Order Items Breakdown */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800 border-b pb-2">
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-600" />
                  Order Summary
                </span>
                <span className="text-emerald-700 font-extrabold">₹ {order.totalAmount}</span>
              </div>
              <div className="space-y-1 pt-1 max-h-32 overflow-y-auto text-slate-600 font-medium">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px]">
                    <span>{it.medicineName} x {it.quantity}</span>
                    <span>₹ {it.totalPrice}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="pt-4 border-t border-slate-200 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Vaccinated agent with temperature & safety check compliance.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
