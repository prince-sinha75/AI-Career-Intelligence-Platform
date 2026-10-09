import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, XCircle, ArrowRight, Route, TrendingUp } from 'lucide-react';
import type { DashboardData, CareerMatch } from '@/types/dashboard';
import { PageHeader } from './AnalysisPage';
import { useToast } from '../Toast';
import Modal from '../Modal';

export default function MatchesPage({ data }: { data: DashboardData }) {
  const [selected, setSelected] = useState<CareerMatch | null>(null);
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Career Matches"
        subtitle={`${data.careerMatches.length} roles matched to your profile`}
        icon={<Target className="w-5 h-5 text-cyan-400" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.careerMatches.map((match, i) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelected(match)}
            className="glass-card glass-card-hover p-5 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-3xl font-display font-bold gradient-text-cyan">{match.match}%</div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <h3 className="font-display font-semibold text-lg text-white group-hover:text-cyan-300 transition-colors mb-1">
              {match.role}
            </h3>
            <p className="text-xs text-slate-500 mb-3">{match.company} • {match.location} • {match.type}</p>

            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="text-slate-400">{match.matchingSkills.length} matching skills</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <XCircle className="w-3 h-3 text-rose-400" />
                <span className="text-slate-400">{match.missingSkills.length} missing skills</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-cyan-400 group-hover:gap-2 transition-all">
              View details <ArrowRight className="w-3 h-3" />
            </div>
          </motion.div>
        ))}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.role || ''}
        subtitle={`${selected?.company} • ${selected?.location}`}
        icon={Target}
      >
        {selected && (
          <div className="space-y-5">
            {/* Match + salary */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-display font-bold gradient-text-cyan">{selected.match}%</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Match Score</div>
              </div>
              <div className="h-14 w-px bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-white">{selected.salary}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Expected Salary</div>
              </div>
            </div>

            {/* Overview */}
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Career Overview</div>
              <p className="text-sm text-slate-400 leading-relaxed">{selected.overview}</p>
            </div>

            {/* Why it matches */}
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Why It Matches</div>
              <p className="text-sm text-slate-400 leading-relaxed">{selected.description}</p>
            </div>

            {/* Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-emerald-400 uppercase tracking-wider mb-2">Matching Skills</div>
                <div className="flex flex-wrap gap-2">
                  {selected.matchingSkills.length > 0 ? selected.matchingSkills.map((s) => (
                    <span key={s} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">{s}</span>
                  )) : <span className="text-xs text-slate-600">No matching skills yet</span>}
                </div>
              </div>
              <div>
                <div className="text-xs text-rose-400 uppercase tracking-wider mb-2">Missing Skills</div>
                <div className="flex flex-wrap gap-2">
                  {selected.missingSkills.length > 0 ? selected.missingSkills.map((s) => (
                    <span key={s} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300">{s}</span>
                  )) : <span className="text-xs text-slate-600">No missing skills — great fit!</span>}
                </div>
              </div>
            </div>

            {/* Required skills */}
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Required Skills</div>
              <div className="flex flex-wrap gap-2">
                {selected.requiredSkills.map((s) => (
                  <span key={s} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">{s}</span>
                ))}
              </div>
            </div>

            {/* Growth areas */}
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" /> Growth Areas
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.growthAreas.map((g) => (
                  <span key={g} className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">{g}</span>
                ))}
              </div>
            </div>

            {/* Learning path */}
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Route className="w-3 h-3" /> Recommended Learning Path
              </div>
              <div className="space-y-2">
                {selected.learningPath.map((step, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                    <div className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xs font-mono text-amber-400">{i + 1}</div>
                    <span className="text-sm text-slate-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { toast(`Started learning path for ${selected.role}`); setSelected(null); }}
              className="glow-button flex items-center gap-2 text-sm w-full justify-center"
            >
              Start Learning Path
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
