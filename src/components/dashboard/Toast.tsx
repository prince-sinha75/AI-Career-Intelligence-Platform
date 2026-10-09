import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const remove = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const iconMap = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    info: <Info className="w-4 h-4 text-cyan-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  };

  const borderMap = {
    success: 'border-emerald-500/30',
    info: 'border-cyan-500/30',
    warning: 'border-amber-500/30',
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`glass-card pointer-events-auto flex items-center gap-3 px-4 py-3 pr-3 min-w-[280px] max-w-sm ${borderMap[t.type]}`}
            >
              {iconMap[t.type]}
              <span className="text-sm text-slate-200 flex-1">{t.message}</span>
              <button
                onClick={() => remove(t.id)}
                className="text-slate-500 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
