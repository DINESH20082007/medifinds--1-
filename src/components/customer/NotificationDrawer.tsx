import React from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  Package,
  Wallet,
  Clock,
  Sparkles,
  Trash2,
  Check,
} from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-white">Real-Time Notifications</h2>
                <p className="text-slate-400 text-xs">Order dispatches, expiry & wallet alerts</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Bar */}
          <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>{unreadCount} Unread Alerts</span>
            <div className="flex items-center gap-3">
              <button
                onClick={onMarkAllRead}
                className="text-emerald-700 hover:underline flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Mark All Read
              </button>
              <button
                onClick={onClearAll}
                className="text-rose-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>

          {/* List */}
          <div className="p-4 space-y-3 max-h-[calc(100vh-160px)] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs font-medium space-y-2">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No notifications right now.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onMarkRead(notif.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    notif.isRead
                      ? 'bg-slate-50 border-slate-200 opacity-75'
                      : 'bg-white border-emerald-300 ring-1 ring-emerald-500/20 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                      {notif.title}
                    </h3>
                    <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                  </div>

                  <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-center text-[11px] text-slate-500">
          Push notifications synced with Coimbatore delivery GPS & stock monitor
        </div>
      </div>
    </div>
  );
};
