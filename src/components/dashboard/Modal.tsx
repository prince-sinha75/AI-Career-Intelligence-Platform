import { motion, AnimatePresence } from 'framer-motion';
import { X, type LucideIcon } from 'lucide-react';
import { type ReactNode, useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
  accent?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  accent = '#06B6D4',
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative glass-card w-full max-w-lg max-h-[85vh] overflow-y-auto"
          >
            {/* Accent glow */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
            />

            {/* Header */}
            <div className="flex items-start gap-3 p-6 border-b border-white/10 sticky top-0 bg-onyx-deep/80 backdrop-blur-xl z-10">
              {Icon && (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border"
                  style={{ background: `${accent}15`, borderColor: `${accent}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: accent }} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-lg text-white">{title}</h3>
                {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all duration-300 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
