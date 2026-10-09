import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import type { DashboardData, InterviewSession } from '@/types/dashboard';
import Modal from './Modal';
import { useToast } from './Toast';

export default function InterviewPerformance({ data }: { data: DashboardData }) {
  const [selected, setSelected] = useState<InterviewSession | null>(null);
  const { toast } = useToast();
  const avgScore = Math.round(data.interviews.reduce((s, i) => s + i.score, 0) / data.interviews.length);

  return (
    <>
      <div className="glass-card glass-card-hover p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider">
              Interview Performance
            </h3>
            <p className="text-xs text-slate-500 mt-1">{data.interviews.length} sessions • Avg: {avgScore}%</p>
          </div>
          <Mic className="w-5 h-5 text-violet-400" />
        </div>

        <div className="space-y-3">
          {data.interviews.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelected(session)}
              className="group cursor-pointer p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-violet-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors">
                  {session.topic}
                </span>
                <div className="text-right">
                  <span className={`text-lg font-display font-bold ${session.score >= 80 ? 'text-emerald-400' : session.score >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {session.score}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{session.date}</span>
                <span>{session.duration}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => toast('Launching AI mock interview...')}
          className="w-full mt-4 glow-border-button text-sm flex items-center justify-center gap-2"
        >
          <Mic className="w-4 h-4" />
          Start New Mock Interview
        </button>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.topic || ''}
        subtitle={`${selected?.date} • ${selected?.duration}`}
        icon={Mic}
        accent="#8B5CF6"
      >
        {selected && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className={`text-5xl font-display font-bold ${selected.score >= 80 ? 'text-emerald-400' : selected.score >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
                {selected.score}%
              </div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Overall Score</div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4" />
                Strengths
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
                <AlertCircle className="w-4 h-4" />
                Areas to Improve
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
              <Mic className="w-4 h-4" />
              Retake This Session
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
