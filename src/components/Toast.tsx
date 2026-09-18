import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isWarning = t.type === 'warning';
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-stone-200/90 bg-white/95 p-4 shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200"
          >
            <div
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                isSuccess
                  ? 'bg-emerald-100 text-emerald-700'
                  : isWarning
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-teal-100 text-teal-700'
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : isWarning ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <Info className="h-4 w-4" />
              )}
            </div>

            <div className="flex-1 text-xs">
              <div className="font-bold text-stone-900">{t.title}</div>
              <div className="mt-0.5 text-stone-600 leading-relaxed">{t.message}</div>
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              className="text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
