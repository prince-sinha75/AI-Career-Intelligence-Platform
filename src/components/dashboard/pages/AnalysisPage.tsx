import { motion } from 'framer-motion';
import { Target, TrendingUp, CheckCircle2, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';
import type { DashboardData } from '@/types/dashboard';
import { RadialGauge, ProgressBar, AnimatedNumber } from '../Charts';
import { useToast } from '../Toast';

export default function AnalysisPage({
  data,
  onNavigate,
}: {
  data: DashboardData;
  onNavigate: (page: 'roadmap' | 'interview') => void;
}) {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Career Analysis"
        subtitle="Comprehensive AI analysis of your career readiness"
        icon={<Target className="w-5 h-5 text-cyan-400" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall score */}
        <div className="glass-card glass-card-hover p-6 lg:col-span-1">
          <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-4">Overall Readiness</h3>
          <RadialGauge score={data.overallScore} size={180} />
          <div className="mt-4 text-center">
            <span className="text-xs text-slate-500">
              {data.overallScore >= 75 ? 'Strong readiness — you are placement-ready for most roles.' : data.overallScore >= 60 ? 'Good progress — targeted improvements will push you over the line.' : 'Early stage — focus on the recommended actions below.'}
            </span>
          </div>
        </div>

        {/* Detailed breakdown */}
        <div className="glass-card glass-card-hover p-6 lg:col-span-2">
          <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-4">Score Breakdown</h3>
          <div className="space-y-4">
            {data.breakdown.map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{b.label}</span>
                  <span className="text-lg font-display font-bold" style={{ color: b.color }}>
                    <AnimatedNumber value={b.score} suffix="%" delay={i * 0.1} />
                  </span>
                </div>
                <ProgressBar value={b.score} color={b.color} delay={i} />
                <p className="text-xs text-slate-500 mt-2">
                  {b.score >= 80 ? 'Excellent — top percentile for this dimension.' : b.score >= 60 ? 'Good progress — targeted improvements can push you higher.' : 'Needs attention — focus here to boost overall readiness.'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths + Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-semibold text-white">Career Strengths</h3>
          </div>
          <div className="space-y-2">
            {data.strengths.length > 0 ? data.strengths.map((s) => (
              <div key={s} className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-sm text-slate-300">{s}</span>
              </div>
            )) : <p className="text-sm text-slate-500">Keep building — your strengths will appear as scores improve.</p>}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-semibold text-white">Weak Areas</h3>
          </div>
          <div className="space-y-2">
            {data.weaknesses.length > 0 ? data.weaknesses.map((w) => (
              <div key={w} className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-sm text-slate-300">{w}</span>
              </div>
            )) : <p className="text-sm text-slate-500">No weak areas detected — great work!</p>}
          </div>
        </div>
      </div>

      {/* Career fit */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-cyan-400" />
          <h3 className="font-display font-semibold text-white">Career Fit Explanation</h3>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">{data.careerFit}</p>
      </div>

      {/* Recommendations */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-white mb-4">Career Recommendations</h3>
        <div className="space-y-3">
          {data.recommendations.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/10"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-xs font-mono font-bold text-cyan-400 flex-shrink-0">
                {i + 1}
              </div>
              <span className="text-sm text-slate-300">{rec}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* What should I improve next */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-white mb-4">What Should I Improve Next?</h3>
        <div className="space-y-3">
          {data.improvementAreas.map((area, i) => (
            <motion.div
              key={area.area}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{area.area}</span>
                <span className="text-sm font-display font-bold" style={{ color: area.score >= 70 ? '#10B981' : area.score >= 50 ? '#F59E0B' : '#EF4444' }}>
                  {area.score}%
                </span>
              </div>
              <ProgressBar value={area.score} color={area.score >= 70 ? '#10B981' : area.score >= 50 ? '#F59E0B' : '#EF4444'} delay={i} />
              <p className="text-xs text-slate-500 mt-2">{area.action}</p>
            </motion.div>
          ))}
        </div>
        <button
          onClick={() => { toast('Navigating to your learning roadmap...'); onNavigate('roadmap'); }}
          className="glow-button flex items-center gap-2 text-sm mt-4"
        >
          View Learning Roadmap
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-3"
    >
      <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h1 className="font-display font-bold text-2xl text-white">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </motion.div>
  );
}
