import { Check } from 'lucide-react';

const stepLabels = ['Basic Info', 'Career', 'Skills', 'Resume', 'Goals'];

export default function StepProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center justify-center gap-1 md:gap-2 mb-10">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center gap-1 md:gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all duration-400 ${
                  done
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                    : active
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                      : 'bg-white/5 border border-white/10 text-slate-600'
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className={`hidden sm:block text-xs font-medium transition-colors duration-300 ${
                  active
                    ? 'text-cyan-300'
                    : done
                      ? 'text-slate-300'
                      : 'text-slate-600'
                }`}
              >
                {stepLabels[i]}
              </span>
            </div>
            {i < total - 1 && (
              <div className="w-4 md:w-8 h-px bg-white/10 relative overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-transform duration-500 ${
                    done ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
