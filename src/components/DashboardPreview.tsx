import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Grid3x3,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

type TabKey = 'resume' | 'skills' | 'roadmap';

const tabs: { key: TabKey; label: string; icon: typeof FileText }[] = [
  { key: 'resume', label: 'Resume Insights', icon: FileText },
  { key: 'skills', label: 'Skill Matrix', icon: Grid3x3 },
  { key: 'roadmap', label: 'Roadmap Timeline', icon: Calendar },
];

const resumeInsights = [
  {
    type: 'success',
    icon: CheckCircle2,
    title: 'Strong technical keyword density',
    detail: 'Python, React, and SQL detected with high frequency in experience sections.',
  },
  {
    type: 'warning',
    icon: AlertTriangle,
    title: 'Missing quantifiable achievements',
    detail: '3 bullet points lack measurable impact metrics. Add numbers, percentages, or scale.',
  },
  {
    type: 'warning',
    icon: AlertTriangle,
    title: 'Projects section underweighted',
    detail: 'Your ML capstone project is buried below coursework. Move it higher for ATS visibility.',
  },
  {
    type: 'info',
    icon: Info,
    title: 'Format compatibility: 92%',
    detail: 'Single-column layout parses cleanly. Avoid multi-column formats for ATS systems.',
  },
];

const skills = [
  { name: 'Python', level: 85, status: 'Strong', color: '#06B6D4' },
  { name: 'Machine Learning', level: 62, status: 'Developing', color: '#8B5CF6' },
  { name: 'SQL', level: 78, status: 'Proficient', color: '#3B82F6' },
  { name: 'React', level: 70, status: 'Proficient', color: '#10B981' },
  { name: 'Docker', level: 40, status: 'Gap', color: '#F59E0B' },
  { name: 'System Design', level: 35, status: 'Gap', color: '#EC4899' },
];

const roadmap = [
  { week: 'Week 1-2', title: 'Docker Fundamentals', progress: 100, status: 'done' },
  { week: 'Week 3-4', title: 'ML Model Deployment', progress: 65, status: 'active' },
  { week: 'Week 5-6', title: 'System Design Basics', progress: 0, status: 'upcoming' },
  { week: 'Week 7-8', title: 'Mock Interview Sprint', progress: 0, status: 'upcoming' },
];

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<TabKey>('resume');

  return (
    <section id="roadmap" className="relative py-24 md:py-32 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span className="text-xs text-slate-400 uppercase tracking-widest">
            Live Dashboard
          </span>
        </div>
        <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl gradient-text mb-4">
          Your career, visualized in real time
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Explore the interactive dashboard. Switch between resume insights,
          skill matrices, and your learning roadmap.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <div className="glass-card overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/30">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-[10px] font-mono text-slate-500">
                app.careeriq.io/dashboard
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 pt-4 border-b border-white/5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${
                    active
                      ? 'text-cyan-300'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {active && (
                    <motion.div
                      layoutId="tabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="p-6 md:p-8 min-h-[320px]">
            <AnimatePresence mode="wait">
              {activeTab === 'resume' && (
                <motion.div
                  key="resume"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {resumeInsights.map((insight, i) => {
                    const Icon = insight.icon;
                    const colorMap = {
                      success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                      warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                      info: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                    };
                    return (
                      <div
                        key={i}
                        className={`flex items-start gap-3 p-4 rounded-xl border ${colorMap[insight.type as keyof typeof colorMap]} group cursor-default transition-all duration-300 hover:scale-[1.01]`}
                      >
                        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-white">
                            {insight.title}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {insight.detail}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {skills.map((skill, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/10 group cursor-default transition-all duration-300 hover:border-white/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">
                          {skill.name}
                        </span>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                          style={{
                            color: skill.color,
                            background: `${skill.color}15`,
                          }}
                        >
                          {skill.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)`,
                              boxShadow: `0 0 8px ${skill.color}60`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono text-slate-400 w-8 text-right">
                          {skill.level}%
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'roadmap' && (
                <motion.div
                  key="roadmap"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {roadmap.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10 group cursor-default transition-all duration-300 hover:border-cyan-500/20"
                    >
                      <div className="flex-shrink-0">
                        {item.status === 'done' ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                        ) : item.status === 'active' ? (
                          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <span className="text-[10px] font-mono text-slate-500">
                              {i + 1}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-white">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {item.week}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ duration: 0.8, delay: i * 0.15 }}
                            className={`h-full rounded-full ${
                              item.status === 'done'
                                ? 'bg-emerald-500'
                                : item.status === 'active'
                                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                                  : 'bg-white/10'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
