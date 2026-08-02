import React, { useState } from 'react';
import {
  X,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  CreditCard,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { WalletTransaction } from '../../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  transactions: WalletTransaction[];
  onTopUp: (amount: number) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  balance,
  transactions,
  onTopUp,
}) => {
  const [topUpAmount, setTopUpAmount] = useState<number>(500);
  const [showTopUpForm, setShowTopUpForm] = useState(false);

  if (!isOpen) return null;

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topUpAmount > 0) {
      onTopUp(topUpAmount);
      setShowTopUpForm(false);
      alert(`Successfully added ₹ ${topUpAmount} to your Medifind Wallet!`);
    }
  };

  const activeOffers = [
    { code: 'MONSOON50', title: 'Flat ₹50 Cashback', desc: 'On medicine orders above ₹300 via Medifind Wallet' },
    { code: 'APOLLO100', title: '₹100 Off First Order', desc: 'Valid across all 10,000+ partner pharmacies' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Medifind Wallet & Credits</h2>
              <p className="text-xs text-slate-300">
                Instant checkout balance, cashback rewards, and payment history
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50 text-xs">
          
          {/* Wallet Balance Hero Card */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Available Wallet Balance
                </span>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                  ₹ {balance.toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => setShowTopUpForm(!showTopUpForm)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-extrabold rounded-2xl shadow-md transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Top Up Wallet
              </button>
            </div>
          </div>

          {/* Top Up Form Drawer */}
          {showTopUpForm && (
            <form onSubmit={handleTopUpSubmit} className="p-5 bg-white border border-emerald-300 rounded-2xl shadow-sm space-y-3">
              <div className="font-bold text-emerald-950 text-sm">Add Funds to Medifind Wallet</div>
              
              <div className="flex gap-2">
                {[200, 500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                      topUpAmount === amt
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    + ₹{amt}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTopUpForm(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-emerald-600 text-white font-bold rounded-xl"
                >
                  Pay via UPI / Card
                </button>
              </div>
            </form>
          )}

          {/* Active Offers & Cashback */}
          <div>
            <h3 className="font-bold text-slate-700 uppercase tracking-wider text-xs mb-3 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-emerald-600" /> Active Offers & Cashback Rewards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeOffers.map((off) => (
                <div key={off.code} className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[9px]">
                      {off.code}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs mt-1">{off.title}</h4>
                    <p className="text-slate-500 text-[10px]">{off.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wallet Transaction History */}
          <div>
            <h3 className="font-bold text-slate-700 uppercase tracking-wider text-xs mb-3">
              Wallet Transaction History
            </h3>
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      tx.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{tx.title}</div>
                      <div className="text-[10px] text-slate-400">{tx.date} • {tx.status}</div>
                    </div>
                  </div>

                  <span className={`font-extrabold text-sm ${
                    tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-800'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'} ₹ {tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
