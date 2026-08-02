import React from 'react';
import { AlertOctagon, Clock, ShieldAlert, Tag, ArrowRight } from 'lucide-react';
import { PharmacyStockItem } from '../../types';

interface ExpiryTrackerProps {
  stockItems: PharmacyStockItem[];
}

export const ExpiryTracker: React.FC<ExpiryTrackerProps> = ({ stockItems = [] }) => {
  const safeStockItems = stockItems || [];
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const expiringSoonItems = safeStockItems.filter((st) => {
    const exp = new Date(st.expiryDate);
    return exp >= today && exp <= thirtyDaysFromNow;
  });

  const expiredItems = safeStockItems.filter((st) => {
    const exp = new Date(st.expiryDate);
    return exp < today;
  });

  return (
    <div className="space-y-6 text-xs">
      
      {/* Alert Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div>
            <span className="text-amber-800 font-bold uppercase text-[10px] tracking-wider block">
              Expiring Within 30 Days
            </span>
            <div className="text-2xl font-extrabold text-amber-950 mt-1">
              {expiringSoonItems.length} Medicines
            </div>
            <p className="text-[11px] text-amber-800 mt-1">
              Apply promotional clear-out discounts or schedule distributor return
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
          <div>
            <span className="text-rose-800 font-bold uppercase text-[10px] tracking-wider block">
              Expired Medicines Alert
            </span>
            <div className="text-2xl font-extrabold text-rose-950 mt-1">
              {expiredItems.length} Medicines
            </div>
            <p className="text-[11px] text-rose-800 mt-1">
              Strictly pull from retail shelves for safe destruction
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-800 flex items-center justify-center font-bold">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Expiring Soon Table */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" /> Medicines Expiring Soon (30 Days Threshold)
        </h3>

        {expiringSoonItems.length === 0 ? (
          <p className="text-slate-400 py-4">No medicines in stock expiring within 30 days!</p>
        ) : (
          <div className="space-y-2">
            {expiringSoonItems.map((st) => (
              <div
                key={st.id}
                className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{st.medicine.name}</h4>
                  <p className="text-[10px] text-slate-500">
                    Batch: {st.batchNumber} • In Stock: {st.quantityInStock} units
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg bg-amber-200 text-amber-900 font-bold text-xs">
                    Expires: {st.expiryDate}
                  </span>
                  <button className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Set 20% Clear-out Discount
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
