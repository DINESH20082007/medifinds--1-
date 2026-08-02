import React, { useState } from 'react';
import {
  X,
  Bell,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Pill,
  Trash2,
  Volume2
} from 'lucide-react';
import { Reminder } from '../../types';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: Reminder[];
  onToggleTaken: (id: string) => void;
  onAddReminder: (reminder: Reminder) => void;
  onDeleteReminder: (id: string) => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  reminders,
  onToggleTaken,
  onAddReminder,
  onDeleteReminder,
}) => {
  const [showAdd, setShowAdd] = useState(false);
  
  // New Reminder state
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet');
  const [time, setTime] = useState('09:00');
  const [repeat, setRepeat] = useState<'Daily' | 'Twice Daily' | 'Weekly' | 'Custom'>('Daily');
  const [familyMemberName, setFamilyMemberName] = useState('Rajesh Sharma (Self)');
  const [pillsRemaining, setPillsRemaining] = useState(15);

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim()) return;

    const newReminder: Reminder = {
      id: `rem-${Date.now()}`,
      medicineName: medicineName.trim(),
      dosage,
      time,
      repeat,
      familyMemberName,
      pillsRemaining,
      lowStockAlertThreshold: 5,
      isTakenToday: false,
      isActive: true,
    };

    onAddReminder(newReminder);
    setShowAdd(false);
    setMedicineName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Medicine Pill Schedule & Reminders</h2>
              <p className="text-xs text-slate-300">
                Automated pill reminders, repeat schedules, and low-stock reorder alerts
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
          
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-xs">
              Today's Schedule ({reminders.length})
            </span>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Reminder
            </button>
          </div>

          {/* Add Reminder Form */}
          {showAdd && (
            <form onSubmit={handleCreateSubmit} className="p-5 bg-white border border-emerald-300 rounded-2xl shadow-sm space-y-3">
              <div className="font-bold text-emerald-950 text-sm">Set New Medicine Alarm</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Medicine Name</label>
                  <input
                    type="text"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    placeholder="e.g. Paracetamol 650mg"
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Dosage</label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 1 Tablet / 5ml Syrup"
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Alarm Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Repeat Frequency</label>
                  <select
                    value={repeat}
                    onChange={(e) => setRepeat(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-500 font-medium mb-1">For Family Member</label>
                  <input
                    type="text"
                    value={familyMemberName}
                    onChange={(e) => setFamilyMemberName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-emerald-600 text-white font-bold rounded-xl"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          )}

          {/* Reminders List */}
          <div className="space-y-3">
            {reminders.map((rem) => {
              const isLowStock = rem.pillsRemaining <= rem.lowStockAlertThreshold;
              return (
                <div
                  key={rem.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    rem.isTakenToday
                      ? 'bg-slate-100/70 border-slate-200'
                      : 'bg-white border-slate-200 shadow-sm hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleTaken(rem.id)}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                        rem.isTakenToday
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-700'
                      }`}
                      title={rem.isTakenToday ? 'Mark as Not Taken' : 'Mark as Taken'}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${rem.isTakenToday ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {rem.medicineName}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          {rem.dosage}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-bold text-emerald-800">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" /> {rem.time} ({rem.repeat})
                        </span>
                        <span>•</span>
                        <span>{rem.familyMemberName}</span>
                      </div>

                      {/* Low Stock Alert */}
                      {isLowStock && (
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 w-fit">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          Low Stock Warning: Only {rem.pillsRemaining} pills remaining!
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDeleteReminder(rem.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
