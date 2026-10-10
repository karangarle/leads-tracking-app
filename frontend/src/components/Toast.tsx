import React from 'react';
import { Icon } from '@iconify/react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-3 max-w-sm w-auto sm:w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all transform translate-y-0 animate-in fade-in slide-in-from-top-5 duration-200 ${
              isSuccess
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                : isError
                ? 'bg-rose-950/80 border-rose-500/40 text-rose-200'
                : 'bg-blue-950/80 border-blue-500/40 text-blue-200'
            }`}
          >
            {isSuccess && <Icon icon="material-symbols:check-circle-outline-rounded" className="w-5 h-5 text-emerald-400 shrink-0" />}
            {isError && <Icon icon="material-symbols:error-outline-rounded" className="w-5 h-5 text-rose-400 shrink-0" />}
            {!isSuccess && !isError && <Icon icon="material-symbols:info-outline-rounded" className="w-5 h-5 text-blue-400 shrink-0" />}

            <span className="text-sm font-medium flex-1">{toast.message}</span>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity"
            >
              <Icon icon="material-symbols:close-rounded" className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
