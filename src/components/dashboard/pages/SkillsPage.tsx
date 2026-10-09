import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Plus, Clock, BookOpen, ArrowRight } from 'lucide-react';
import type { DashboardData, SkillGap } from '@/types/dashboard';
import { PageHeader } from './AnalysisPage';
import { ProgressBar } from '../Charts';
import { useToast } from '../Toast';
import Modal from '../Modal';

const priorityColors: Record<string, string> = {
  High: '#EF4444',
  Medium: '#F59E0B',
  Low: '#10B981',
};

export default function SkillsPage({
  data,
  onNavigate,
}: {
  data: DashboardData;
  onNavigate: (page: 'roadmap') => void;
}) {
  const [selected, setSelected] = useState<SkillGap | null>(null);
  const [addedToRoadmap, setAddedToRoadmap] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const addToRoadmap = (skill: string) => {
    setAddedToRoadmap((prev) => new Set(prev).add(skill));
    toast(`${skill} added to your learning roadmap`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Gap Analysis"
        subtitle={`${data.skillGaps.length} gaps identified • ${data.currentSkills.length} current skills`}
        icon={<Zap className="w-5 h-5 text-amber-400" />}
      />

      {/* Current skills overview */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">Current Skills</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.currentSkills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/10"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-white">{skill.name}</span>
                <span className="text-xs font-mono text-emerald-400">{skill.level}%</span>
              </div>
              <ProgressBar value={skill.level} color="#10B981" delay={i} height="h-1.5" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Skill gaps */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">Skill Gaps</h3>
        <div className="space-y-4">
          {data.skillGaps.map((gap, i) => (
            <motion.div
              key={gap.skill}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-amber-500/20 transition-all duration-300 cursor-pointer"
              onClick={() => setSelected(gap)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white group-hover:text-amber-300 transition-colors">{gap.skill}</span>
                  <span
                    className="text-[9px] font-mono px-2 py-0.5 rounded-full"
                    style={{ color: priorityColors[gap.priority], background: `${priorityColors[gap.priority]}15` }}
                  >
                    {gap.priority} priority
                  </span>
                  <span className="text-[9px] text-slate-600 px-2 py-0.5 rounded-full bg-white/5">{gap.category}</span>
                </div>
                <span className="text-xs font-mono text-slate-400">{gap.currentLevel}% → {gap.requiredLevel}%</span>
              </div>
              <div className="relative">
                <ProgressBar value={gap.currentLevel} color="#F59E0B" delay={i} height="h-2" />
                <div className="absolute top-0 bottom-0 w-px bg-rose-400/60" style={{ left: `${gap.requiredLevel}%` }} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Est. {gap.estimatedTime}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); addToRoadmap(gap.skill); }}
                  disabled={addedToRoadmap.has(gap.skill)}
                  className={`text-xs flex items-center gap-1 px-2.5 py-1 rounded-full transition-all duration-300 ${
                    addedToRoadmap.has(gap.skill)
                      ? 'bg-emerald-500/10 text-emerald-400 cursor-default'
                      : 'bg-white/5 text-slate-400 hover:text-amber-300 hover:bg-amber-500/10'
                  }`}
                >
                  {addedToRoadmap.has(gap.skill) ? (
                    <>Added to roadmap</>
                  ) : (
                    <><Plus className="w-3 h-3" /> Add to roadmap</>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Skill detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.skill || ''}
        subtitle={selected ? `${selected.category} • ${selected.priority} priority` : ''}
        icon={Zap}
        accent="#F59E0B"
      >
        {selected && (
          <div className="space-y-5">
            {/* Gap visualization */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                <div className="text-xl font-display font-bold text-amber-400">{selected.currentLevel}%</div>
                <div className="text-[10px] text-slate-500 uppercase">Current</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                <div className="text-xl font-display font-bold text-cyan-400">{selected.requiredLevel}%</div>
                <div className="text-[10px] text-slate-500 uppercase">Required</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                <div className="text-xl font-display font-bold text-rose-400">{selected.gap}</div>
                <div className="text-[10px] text-slate-500 uppercase">Gap</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Current vs Required Proficiency</div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Your level</span>
                    <span className="font-mono text-amber-400">{selected.currentLevel}%</span>
                  </div>
                  <ProgressBar value={selected.currentLevel} color="#F59E0B" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Required level</span>
                    <span className="font-mono text-cyan-400">{selected.requiredLevel}%</span>
                  </div>
                  <ProgressBar value={selected.requiredLevel} color="#06B6D4" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="w-4 h-4 text-amber-400" />
              Estimated time to improve: <span className="text-white font-medium">{selected.estimatedTime}</span>
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3 h-3" /> Recommended Resources
              </div>
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
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                addToRoadmap(selected.skill);
                setSelected(null);
                onNavigate('roadmap');
              }}
              className="glow-button flex items-center justify-center gap-2 text-sm w-full"
            >
              Add to Learning Roadmap
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
