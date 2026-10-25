import React from 'react';
import { CheckCircle2, Heart, ShoppingBag, X, Sparkles, AlertCircle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'wishlist' | 'error';
  title: string;
  description?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-white border border-pink-200/90 rounded-2xl p-4 shadow-xl shadow-rose-200/40 flex items-start gap-3 transition-all animate-in slide-in-from-bottom-3 duration-300"
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'wishlist' && (
              <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Heart className="w-4 h-4 fill-rose-600" />
              </div>
            )}
            {toast.type === 'success' && (
              <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <ShoppingBag className="w-4 h-4" />
              </div>
            )}
            {toast.type === 'info' && (
              <div className="w-8 h-8 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-rose-600">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            {toast.type === 'error' && (
              <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <AlertCircle className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-heading text-lg font-medium text-rose-800 leading-tight">{toast.title}</h4>
            {toast.description && (
              <p className="text-xs text-slate-600 mt-0.5 font-body leading-relaxed">{toast.description}</p>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
