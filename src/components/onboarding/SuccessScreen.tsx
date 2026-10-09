import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, ArrowRight, Brain } from 'lucide-react';
import type { OnboardingData } from '@/types/onboarding';

export default function SuccessScreen({
  data,
  onContinue,
}: {
  data: OnboardingData;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-10 md:p-14 text-center relative overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="relative">
        {/* Animated check */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative w-20 h-20 mx-auto mb-6"
        >
          <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-cyan-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-cyan-500/20 mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs text-slate-300 tracking-wide">
            Profile Created Successfully
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-display font-bold text-2xl md:text-3xl gradient-text mb-3"
        >
          Welcome to CareerIQ, {data.fullName.split(' ')[0]}!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-slate-400 max-w-md mx-auto mb-8"
        >
          Your career profile is ready. We have analyzed your goals, skills,
          and preferences. Your personalized AI career dashboard is waiting.
        </motion.p>

        {/* Summary mini-cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8"
        >
          {[
            { label: 'Target Roles', value: `${data.targetRoles.length}` },
            { label: 'Skills', value: `${data.skills.length}` },
            { label: 'Weekly Hours', value: data.weeklyHours || '—' },
            { label: 'Learning Style', value: data.learningStyle || '—' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/10"
            >
              <div className="text-lg font-display font-bold text-white">
                {stat.value}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={onContinue}
            className="glow-button flex items-center gap-2 group text-base px-8 py-3.5 mx-auto"
          >
            <Brain className="w-4 h-4" />
            Continue to CareerIQ
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
