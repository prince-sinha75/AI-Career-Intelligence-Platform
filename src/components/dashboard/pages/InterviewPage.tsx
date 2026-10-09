import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, CheckCircle2, AlertCircle, Clock, Play, TrendingUp, MessageSquare, Code, Brain } from 'lucide-react';
import type { DashboardData, InterviewSession } from '@/types/dashboard';
import { PageHeader } from './AnalysisPage';
import { RadialGauge, ProgressBar, AnimatedNumber } from '../Charts';
import { useToast } from '../Toast';
import Modal from '../Modal';

const categoryIcons: Record<string, typeof Code> = {
  Technical: Code,
  Behavioral: MessageSquare,
  'System Design': Brain,
};

export default function InterviewPage({ data }: { data: DashboardData }) {
  const [selected, setSelected] = useState<InterviewSession | null>(null);
  const { toast } = useToast();

  const avgScore = Math.round(data.interviews.reduce((s, i) => s + i.score, 0) / data.interviews.length);
  const totalQuestions = data.interviews.reduce((s, i) => s + i.questionsPracticed, 0);
  const technicalAvg = Math.round(data.interviews.filter((i) => i.category === 'Technical').reduce((s, i) => s + i.score, 0) / Math.max(1, data.interviews.filter((i) => i.category === 'Technical').length));
  const behavioralAvg = Math.round(data.interviews.filter((i) => i.category === 'Behavioral').reduce((s, i) => s + i.score, 0) / Math.max(1, data.interviews.filter((i) => i.category === 'Behavioral').length));
  const commScore = Math.round(avgScore * 0.9);

  const scoreCards = [
    { label: 'Technical', value: technicalAvg, color: '#06B6D4', icon: Code },
    { label: 'Behavioral', value: behavioralAvg, color: '#8B5CF6', icon: MessageSquare },
    { label: 'Communication', value: commScore, color: '#10B981', icon: Mic },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Interview Prep"
        subtitle="Practice sessions, scores, and improvement tracking"
        icon={<Mic className="w-5 h-5 text-violet-400" />}
      />

      {/* Top section: score gauge + score cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-3">Overall Interview Score</h3>
          <RadialGauge score={avgScore} size={160} label="Interview" color="#8B5CF6" />
        </div>

        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-4">Performance Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {scoreCards.map((sc, i) => {
              const Icon = sc.icon;
              return (
                <motion.div
                  key={sc.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4" style={{ color: sc.color }} />
                    <span className="text-xs text-slate-400">{sc.label}</span>
                  </div>
                  <div className="text-2xl font-display font-bold text-white">
                    <AnimatedNumber value={sc.value} suffix="%" delay={i * 0.1} />
                  </div>
                  <ProgressBar value={sc.value} color={sc.color} delay={i} height="h-1.5" />
                </motion.div>
              );
            })}
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">{totalQuestions} questions practiced across {data.interviews.length} sessions</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => toast('Launching AI mock interview...')}
          className="glass-card glass-card-hover p-5 text-left group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Play className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">Start Mock Interview</div>
              <div className="text-xs text-slate-500">AI-powered simulation</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => toast('Opening your weakest area for practice...', 'info')}
          className="glass-card glass-card-hover p-5 text-left group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">Practice Weak Area</div>
              <div className="text-xs text-slate-500">Target your lowest score</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setSelected(data.interviews[0])}
          className="glass-card glass-card-hover p-5 text-left group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">View Previous</div>
              <div className="text-xs text-slate-500">Review past sessions</div>
            </div>
          </div>
        </button>
      </div>

      {/* Previous sessions */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">Previous Sessions</h3>
        <div className="space-y-3">
          {data.interviews.map((session, i) => {
            const CatIcon = categoryIcons[session.category] || Mic;
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelected(session)}
                className="group cursor-pointer p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-violet-500/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                      <CatIcon className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors">{session.topic}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{session.date}</span>
                        <span>{session.duration}</span>
                        <span>• {session.questionsPracticed} questions</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-lg font-display font-bold ${session.score >= 80 ? 'text-emerald-400' : session.score >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {session.score}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Session detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.topic || ''}
        subtitle={`${selected?.date} • ${selected?.duration} • ${selected?.questionsPracticed} questions`}
        icon={Mic}
        accent="#8B5CF6"
      >
        {selected && (
          <div className="space-y-5">
            <div className="text-center py-2">
              <div className={`text-5xl font-display font-bold ${selected.score >= 80 ? 'text-emerald-400' : selected.score >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
                {selected.score}%
              </div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Overall Score</div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4" /> Strengths
              </div>
              <div className="space-y-1.5">
                {selected.strengths.map((s) => (
                  <div key={s} className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-sm text-slate-300">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 uppercase tracking-wider mb-2">
                <AlertCircle className="w-4 h-4" /> Areas to Improve
              </div>
              <div className="space-y-1.5">
                {selected.improvements.map((s) => (
                  <div key={s} className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-sm text-slate-300">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { toast('Retaking interview practice session...'); setSelected(null); }}
              className="glow-button w-full flex items-center justify-center gap-2 text-sm"
            >
              <Mic className="w-4 h-4" /> Retake This Session
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
