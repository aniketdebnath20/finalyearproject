import React from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUniversity();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-white text-zinc-900 border border-zinc-200 shadow-lg transition-all"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />}

          <div className="flex-1 text-xs font-medium text-zinc-800 leading-normal">
            {toast.message}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-zinc-400 hover:text-zinc-700 p-0.5 rounded transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
