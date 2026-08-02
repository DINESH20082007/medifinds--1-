import React, { useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, RefreshCw, BarChart2, ShieldCheck } from 'lucide-react';
import { PharmacyStockItem } from '../../types';

interface AIDemandPredictionProps {
  stockItems: PharmacyStockItem[];
}

export const AIDemandPrediction: React.FC<AIDemandPredictionProps> = ({ stockItems = [] }) => {
  const safeStockItems = stockItems || [];
  const [selectedSeason, setSelectedSeason] = useState('Monsoon Season');
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);

  const handleRunPrediction = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/demand-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          season: selectedSeason,
          stockItemsSummary: safeStockItems.map((s) => ({
            name: s.medicine.name,
            qty: s.quantityInStock,
            category: s.medicine.category,
          })),
        }),
      });

      const data = await res.json();
      setPredictionResult(data);
    } catch (err) {
      console.error('Demand prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Hero AI Analyzer Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 text-white shadow-xl border border-indigo-800/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
              <Sparkles className="w-3.5 h-3.5" /> Gemini AI Retail Inventory Forecasting
            </div>
            <h2 className="text-xl font-bold font-['Playfair_Display']">
              AI Seasonal Medicine Demand Prediction Engine
            </h2>
            <p className="text-slate-300 text-xs">
              Prevents stockouts and overstock losses using local disease trends, seasonal shifts, and stock movement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="p-2.5 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold focus:outline-none"
            >
              <option value="Monsoon Season">Monsoon Season (Fever / Typhoid)</option>
              <option value="Winter Season">Winter Season (Flu / Respiratory)</option>
              <option value="Summer Season">Summer Season (Dehydration / Heat)</option>
            </select>

            <button
              onClick={handleRunPrediction}
              disabled={isLoading}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-extrabold rounded-xl shadow-lg transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Analyzing Inventory...' : 'Generate AI Forecast'}
            </button>
          </div>
        </div>
      </div>

      {/* AI Prediction Report Results */}
      {predictionResult ? (
        <div className="space-y-4 animate-fade-in">
          
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Seasonal Outbreak Analysis</h3>
            <p className="text-slate-600 text-xs leading-relaxed">{predictionResult.seasonAnalysis}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Top High Demand Restock List */}
            <div className="p-5 bg-white rounded-2xl border border-emerald-200 shadow-sm space-y-3">
              <h4 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> High Priority Restock Recommendations
              </h4>

              <div className="space-y-2">
                {predictionResult.recommendations?.map((rec: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{rec.medicineName}</span>
                      <span className="text-[10px] text-slate-500">Reason: {rec.reason}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]">
                      Add +{rec.suggestedQuantity} Units
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Overstock Warning List */}
            <div className="p-5 bg-white rounded-2xl border border-amber-200 shadow-sm space-y-3">
              <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Overstock / Slow-Moving Warning
              </h4>

              <div className="space-y-2">
                {predictionResult.overstockRisk?.map((ov: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{ov.medicineName}</span>
                      <span className="text-[10px] text-slate-500">Action: {ov.suggestedAction}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-200 text-amber-900 font-bold rounded-lg text-[10px]">
                      Risk Level: {ov.riskLevel}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
          <BarChart2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Run AI Forecasting Analysis</h3>
          <p className="text-slate-500 text-xs">
            Click 'Generate AI Forecast' to query Gemini models on current stock levels vs seasonal health demand.
          </p>
        </div>
      )}

    </div>
  );
};
