import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Route, CheckCircle2, Circle, Play, BookOpen, ChevronRight, Plus, X, Clock } from 'lucide-react';
import type { DashboardData, RoadmapItem } from '@/types/dashboard';
import { PageHeader } from './AnalysisPage';
import { ProgressBar, AnimatedNumber } from '../Charts';
import { useToast } from '../Toast';
import Modal from '../Modal';

const statusConfig = {
  done: { color: '#10B981', icon: CheckCircle2, label: 'Completed' },
  active: { color: '#06B6D4', icon: Play, label: 'In Progress' },
  upcoming: { color: '#64748B', icon: Circle, label: 'Upcoming' },
};

export default function RoadmapPage({ data }: { data: DashboardData }) {
  const [selected, setSelected] = useState<RoadmapItem | null>(null);
  const [roadmap, setRoadmap] = useState(data.roadmap);
  const [customSkills, setCustomSkills] = useState<Set<string>>(new Set());
  const [newSkill, setNewSkill] = useState('');
  const { toast } = useToast();

  const startItem = (item: RoadmapItem) => {
    if (item.status === 'upcoming') {
      setRoadmap((prev) => prev.map((r) => r.id === item.id ? { ...r, status: 'active' as const, progress: 5 } : r));
      toast(`Started: ${item.title}`);
    } else if (item.status === 'active') {
      const newProgress = Math.min(item.progress + 20, 100);
      const isDone = newProgress === 100;
      setRoadmap((prev) => prev.map((r) => r.id === item.id ? { ...r, progress: newProgress, status: isDone ? 'done' as const : 'active' as const } : r));
      if (isDone) toast(`${item.title} completed! +5 readiness points`);
      else toast(`Progress updated: ${newProgress}%`, 'info');
    }
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed) {
      setCustomSkills((prev) => new Set(prev).add(trimmed));
      toast(`${trimmed} added to your skills`);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setCustomSkills((prev) => { const n = new Set(prev); n.delete(skill); return n; });
    toast(`${skill} removed`, 'info');
  };

  const doneCount = roadmap.filter((r) => r.status === 'done').length;
  const overallProgress = Math.round(roadmap.reduce((s, r) => s + r.progress, 0) / roadmap.length);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Roadmap"
        subtitle="Your personalized career learning journey"
        icon={<Route className="w-5 h-5 text-amber-400" />}
      />

      {/* Progress summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 text-center">
          <div className="text-3xl font-display font-bold gradient-text-cyan">
            <AnimatedNumber value={overallProgress} suffix="%" />
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Overall Progress</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-3xl font-display font-bold text-emerald-400">
            {doneCount}/{roadmap.length}
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Sprints Completed</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-3xl font-display font-bold text-cyan-400">
            {roadmap.filter((r) => r.status === 'active').length}
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Active Sprints</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="glass-card p-6">
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10">
            <motion.div
              className="w-full bg-gradient-to-b from-cyan-400 via-amber-500 to-violet-500"
              initial={{ height: 0 }}
              animate={{ height: `${(doneCount / roadmap.length) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>

          <div className="space-y-4">
            {roadmap.map((item, i) => {
              const cfg = statusConfig[item.status];
              const StatusIcon = cfg.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-14"
                >
                  <div
                    className="absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center border-2 bg-onyx-deep z-10"
                    style={{ borderColor: cfg.color }}
                  >
                    <StatusIcon className="w-4 h-4" style={{ color: cfg.color }} />
                  </div>

                  <div
                    onClick={() => setSelected(item)}
                    className="group cursor-pointer p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">{item.title}</span>
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.estimatedTime}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{item.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {item.skills.map((s) => (
                        <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">{s}</span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <ProgressBar value={item.progress} color={cfg.color} height="h-1.5" delay={i} />
                      </div>
                      <span className="text-xs font-mono text-slate-400 w-10 text-right">{item.progress}%</span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] uppercase tracking-wider" style={{ color: cfg.color }}>{cfg.label}</span>
                      {item.status !== 'done' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); startItem(item); }}
                          className="text-xs flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-300"
                        >
                          <Play className="w-3 h-3" />
                          {item.status === 'active' ? 'Update Progress' : 'Start Sprint'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Manage skills */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">Manage Your Skills</h3>
        <div className="flex gap-2.5 mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
            placeholder="Add a skill to track..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/30 transition-all"
          />
          <button onClick={addSkill} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 hover:border-cyan-500/30 hover:text-cyan-300 transition-all">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        {customSkills.size > 0 && (
          <div className="flex flex-wrap gap-2">
            {Array.from(customSkills).map((skill) => (
              <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300">
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Module detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title || ''}
        subtitle={selected?.week}
        icon={BookOpen}
        accent="#F59E0B"
      >
        {selected && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400 leading-relaxed">{selected.description}</p>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-amber-400" /> Estimated time: <span className="text-white font-medium">{selected.estimatedTime}</span>
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Skills Being Developed</div>
              <div className="flex flex-wrap gap-2">
                {selected.skills.map((s) => (
                  <span key={s} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">{s}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Resources</div>
              <div className="space-y-2">
                {selected.resources.map((r) => (
                  <div key={r.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white">{r.name}</div>
                      <div className="text-xs text-slate-500">{r.type}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 uppercase tracking-wider">Progress</span>
                <span className="text-xs font-mono text-white">{selected.progress}%</span>
              </div>
              <ProgressBar value={selected.progress} color="#F59E0B" />
            </div>

            <button
              onClick={() => { startItem(selected); setSelected(null); }}
              disabled={selected.status === 'done'}
              className={`w-full ${selected.status === 'done' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="glow-button flex items-center justify-center gap-2 text-sm">
                {selected.status === 'done' ? 'Completed' : selected.status === 'active' ? 'Continue Learning' : 'Start Sprint'}
                {selected.status !== 'done' && <Play className="w-4 h-4" />}
              </div>
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
